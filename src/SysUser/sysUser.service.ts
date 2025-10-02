/*
 * @Author: Anixuil
 * @Date: 2025-04-02 11:15:46
 * @LastEditors: Anixuil
 * @LastEditTime: 2025-10-02 11:12:52
 * @Description: 用户服务
 */
import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { AddSysUserDto } from "./dto/addSysUser.dto";
import { PrismaService } from "../prisma/prisma.service";
import { handleApiServiceError } from "src/utils";
import * as bcrypt from 'bcryptjs'
import { LoginSysUserDto } from "./dto/loginSysUser.dto";
import { AuthService } from "src/Auth/auth.service";
import { SysLogService } from "src/SysLog/sysLog.service";
import { WxLoginSysUserDto } from "./dto/wxLoginSysUser.dto";
import { HttpService } from "@nestjs/axios";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class SysUserService {
    constructor(private readonly prisma: PrismaService, private readonly authService: AuthService, private readonly sysLogService: SysLogService, private readonly httpService: HttpService, private readonly configService: ConfigService) { }

    // 检查邮箱是否重复
    private async checkEmailExists(email: string): Promise<void> {
        const existingUser = await this.prisma.sysUser.findUnique({
            where: { userEmail: email }
        });
        if (existingUser) throw new BadRequestException('邮箱已存在');
    }

    // 检查邮箱是否重复
    async publicCheckEmailExists(email: string): Promise<boolean> {
        const existingUser = await this.prisma.sysUser.findUnique({
            where: { userEmail: email }
        });

        return existingUser ? true : false;
    }

    // 检查用户名是否重复
    private async checkUsernameExists(username: string): Promise<void> {
        const existingUser = await this.prisma.sysUser.findUnique({
            where: { userName: username }
        });
        if (existingUser) throw new BadRequestException('用户名已存在');
    }


    // 添加用户
    async addSysUser(data: AddSysUserDto, reqData?: any): Promise<any> {
        let userId = 0 // 用户ID
        try {
            // 检查邮箱和用户名是否已存在
            await this.checkEmailExists(data.userEmail);
            await this.checkUsernameExists(data.userName);

            // 对密码进行加密
            const hashedPassword = await bcrypt.hash(data.userPassword, 10)

            // 使用当前用户ID作为创建人和更新人，如果没有则使用传入的值或默认值
            const createBy = 0;
            const updateBy = 0;

            // 创建用户，并设置创建人和更新人
            const user = await this.prisma.sysUser.create({
                data: {
                    ...data,
                    userPassword: hashedPassword,
                    createBy,
                    updateBy
                }
            })
            userId = user.userId
            // 添加系统日志
            await this.sysLogService.addSysLog({
                userId: userId,
                operation: reqData.url,
                method: reqData.method,
                params: JSON.stringify(data),
                ip: reqData.ip
            }, userId);
            return user;
        } catch (err) {
            console.log('err', err);
            // 添加系统日志
            await this.sysLogService.addSysLog({
                userId: userId,
                operation: reqData.url,
                method: reqData.method,
                params: JSON.stringify(data),
                ip: reqData.ip
            }, userId);

            // 保留BadRequestException原始错误信息
            if (err instanceof BadRequestException || err instanceof UnauthorizedException || err instanceof NotFoundException) {
                throw err;
            }
            // 其他错误使用通用处理函数
            throw handleApiServiceError(err);
        }
    }

    // 登录
    async login(data: LoginSysUserDto, reqData?: any): Promise<any> {
        let userId = 0 // 用户ID
        try {
            // 检查邮箱是否存在
            const user = await this.prisma.sysUser.findUnique({
                where: { userEmail: data.userEmail }
            })
            if (!user) throw new NotFoundException('用户不存在')
            userId = user.userId
            // 检查密码是否正确
            if (!user.userPassword) throw new NotFoundException('用户密码异常')
            const isPasswordValid = await bcrypt.compare(data.userPassword, user.userPassword)
            if (!isPasswordValid) throw new UnauthorizedException('密码错误')

            // 生成token
            const token = await this.authService.login(user)
            if (!token || !token.access_token) throw new UnauthorizedException('登录失败')

            // 创建不包含密码的用户对象
            const userInfo = {
                userId: user.userId,
                userName: user.userName,
                userEmail: user.userEmail,
                userAge: user.userAge,
                userAlias: user.userAlias,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt
            };
            // 添加系统日志
            await this.sysLogService.addSysLog({
                userId: userId,
                operation: reqData.url,
                method: reqData.method,
                params: JSON.stringify({
                    ...data,
                    userPassword: '******'
                }),
                ip: reqData.ip
            }, userId);
            return {
                ...token,
                userInfo
            }

        } catch (err) {
            console.log('err', err);
            // 添加系统日志
            await this.sysLogService.addSysLog({
                userId: userId,
                operation: reqData.url,
                method: reqData.method,
                params: JSON.stringify({
                    ...data,
                    userPassword: '******'
                }),
                ip: reqData.ip
            }, userId);
            // 保留BadRequestException原始错误信息
            if (err instanceof BadRequestException || err instanceof UnauthorizedException || err instanceof NotFoundException) {
                throw err;
            }
            // 其他错误使用通用处理函数
            throw handleApiServiceError(err);
        }
    }

    // 微信登录
    async wxLogin(data: WxLoginSysUserDto, reqData?: any): Promise<any> {
        let userId = 0 // 用户ID
        try {
            const appid = this.configService.get('WX_APPID')
            const secret = this.configService.get('WX_SECRET')
            // 先通过code获取微信用户信息
            const wxUserInfo = await this.httpService.axiosRef({
                method: 'GET',
                url: 'https://api.weixin.qq.com/sns/jscode2session',
                params: {
                    appid,
                    secret,
                    js_code: data.code,
                    grant_type: 'authorization_code'
                }
            })

            const { openid, session_key, unionid } = wxUserInfo.data

            if(!openid) throw new UnauthorizedException('微信登录失败')

            // 根据openid查询用户
            let user = await this.prisma.sysUser.findUnique({
                where: { wxOpenId: openid }
            })
            if (!user) {                
                // 创建用户
                const newUser = await this.prisma.sysUser.create({
                    data: {
                        wxOpenId: openid,
                        wxUnionId: unionid || '',
                        wxAvatarUrl: data.avatarUrl || '',
                        userName: data.nickName || '',
                        userAlias: data.nickName || '',
                        userEmail: `${data.nickName}@wx.com`,
                        createBy: 0,
                        updateBy: 0
                    }
                })
                user = newUser
            }
            // 生成token
            const token = await this.authService.login(user)
            if (!token || !token.access_token) throw new UnauthorizedException('登录失败')

            // 创建不包含密码的用户对象
            const userInfo = {
                userId: user.userId,
                userName: user.userName,
                userEmail: user.userEmail,
                userAge: user.userAge,
                userAlias: user.userAlias,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt
            }
            
            // 添加系统日志
            await this.sysLogService.addSysLog({
                userId: user.userId,
                operation: reqData.url,
                method: reqData.method,
                params: JSON.stringify(userInfo),
                ip: reqData.ip
            }, user.userId)
            return {
                ...token,
                userInfo
            }
        } catch (err) {
            // 添加系统日志
            await this.sysLogService.addSysLog({
                userId: userId,
                operation: reqData.url,
                method: reqData.method,
                params: JSON.stringify(data),
                ip: reqData.ip
            }, userId)
            throw handleApiServiceError(err);
        }
    }
}