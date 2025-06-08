/*
 * @Author: Anixuil
 * @Date: 2025-04-02 11:15:46
 * @LastEditors: Anixuil
 * @LastEditTime: 2025-06-08 15:53:56
 * @Description: 请填写简介
 */
import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { AddSysUserDto } from "./dto/addSysUser.dto";
import { PrismaService } from "../prisma/prisma.service";
import { handleApiServiceError } from "src/utils";
import * as bcrypt from 'bcryptjs'
import { LoginSysUserDto } from "./dto/loginSysUser.dto";
import { AuthService } from "src/Auth/auth.service";

@Injectable()
export class SysUserService {
    constructor(private readonly prisma: PrismaService, private readonly authService: AuthService) { }
    
    // 检查邮箱是否重复
    private async checkEmailExists(email: string): Promise<void> {
        const existingUser = await this.prisma.sysUser.findUnique({
            where: { userEmail: email }
        });
        if (existingUser) throw new BadRequestException('邮箱已存在');
    }

    // 检查用户名是否重复
    private async checkUsernameExists(username: string): Promise<void> {
        const existingUser = await this.prisma.sysUser.findUnique({
            where: { userName: username }
        });
        if (existingUser) throw new BadRequestException('用户名已存在');
    }

    // 添加用户
    async addSysUser(data: AddSysUserDto): Promise<any> {
        try {
            // 检查邮箱和用户名是否已存在
            await this.checkEmailExists(data.userEmail);
            await this.checkUsernameExists(data.userName);
            
            // 对密码进行加密
            const hashedPassword = await bcrypt.hash(data.userPassword, 10)
            return await this.prisma.sysUser.create({ data: { ...data, userPassword: hashedPassword } })
        } catch (err) {
            // 保留BadRequestException原始错误信息
            if (err instanceof BadRequestException) {
                throw err;
            }
            // 其他错误使用通用处理函数
            throw handleApiServiceError(err);
        }
    }

    // 登录
    async login(data: LoginSysUserDto): Promise<any> {
        try {
            // 检查邮箱是否存在
            const user = await this.prisma.sysUser.findUnique({
                where: { userEmail: data.userEmail }
            })
            if (!user) throw new NotFoundException('用户不存在')

            // 检查密码是否正确
            if(!user.userPassword) throw new NotFoundException('用户密码异常')
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
            
            return {
                ...token,
                userInfo
            }
            
        } catch (err) {
            // 保留BadRequestException原始错误信息
            if (err instanceof BadRequestException) {
                throw err;
            }
            // 其他错误使用通用处理函数
            throw handleApiServiceError(err);
        }
    }
}