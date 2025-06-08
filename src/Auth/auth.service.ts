/*
 * @Author: Anixuil
 * @Date: 2025-04-10 10:24:25
 * @LastEditors: Anixuil
 * @LastEditTime: 2025-06-08 15:53:59
 * @Description: 请填写简介
 */
import { Injectable, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { PrismaService } from "src/prisma/prisma.service";
import * as bcrypt from 'bcryptjs'
import { SysUser } from "@prisma/client";
import { InjectRedis } from "@nestjs-modules/ioredis";
import { Redis } from "ioredis";

@Injectable()
export class AuthService {
    constructor(private prisma: PrismaService, private jwtService: JwtService, @InjectRedis() private readonly redisService: Redis) { }
    
    // 验证用户
    async validateUser(userEmail: string, userPassword: string) {
        // 查询用户是否唯一
        const user = await this.prisma.sysUser.findUnique({
            where: { userEmail },
            select: {
                userId: true,
                userName: true,
                userPassword: true,
                userEmail: true,
                userAge: true,
                userAlias: true
            }
        })

        if (!user) throw new NotFoundException('用户不存在')
        
        if(!user.userPassword) throw new NotFoundException('用户密码异常')
        const isValid = await bcrypt.compare(userPassword, user.userPassword)
        if (!isValid) throw new UnauthorizedException('密码错误')
        
        return user
    }

    // 登录
    async login(user: SysUser) {
        const payload = {
            userId: user.userId,
            userName: user.userName,
            userAlias: user.userAlias,
            userEmail: user.userEmail,
            userAge: user.userAge
        }
        // 将用户信息存储到redis中 1天
        await this.redisService.set(`user:${user.userId}`, JSON.stringify(payload), 'EX', 60 * 60 * 24)
        return {
            access_token: this.jwtService.sign(payload)
        }
    }
}