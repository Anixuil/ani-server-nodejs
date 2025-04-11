/*
 * @Author: Anixuil
 * @Date: 2025-04-10 10:16:14
 * @LastEditors: Anixuil
 * @LastEditTime: 2025-04-10 17:38:16
 * @Description: 认证模块
 */
import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";
import { AuthService } from "./auth.service";
import { JwtStrategy } from "../strategies/jwt.strategy";
import { PrismaModule } from "../prisma/prisma.module";
import { RedisModule } from "../redis/redis.module";

@Module({
    imports: [
        PassportModule.register({ defaultStrategy: 'jwt' }),
        JwtModule.registerAsync({
            imports: [ConfigModule],
            useFactory: (config: ConfigService) => ({
                secret: config.get('jwt.secret'),
                signOptions: {
                    expiresIn: config.get('jwt.expiresIn'),
                }
            }),
            inject: [ConfigService],
        }),
        PrismaModule,
        RedisModule
    ],
    providers: [AuthService, JwtStrategy],
    exports: [AuthService, JwtStrategy, PassportModule]
})
export class AuthModule { }