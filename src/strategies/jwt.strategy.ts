/*
 * @Author: Anixuil
 * @Date: 2025-04-10 11:32:03
 * @LastEditors: Anixuil
 * @LastEditTime: 2025-04-11 10:47:11
 * @Description: JWT 认证策略
 */
import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy, ExtractJwt } from 'passport-jwt'
import { ConfigService } from "@nestjs/config";
import { InjectRedis } from "@nestjs-modules/ioredis";
import { Redis } from "ioredis";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
        private config: ConfigService,
        @InjectRedis() private readonly redisService: Redis
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: config.get('jwt.secret'),
            ignoreExpiration: false,
            passReqToCallback: true,
        })
    }

    // 验证 JWT 令牌
    async validate(req: Request, payload: any) {
        // const token = ExtractJwt.fromAuthHeaderAsBearerToken()(req);
        // 查看token是否过期
        if (payload.exp && payload.exp < Date.now() / 1000) {
            throw new UnauthorizedException("Token已过期");
        }
        delete payload.exp;
        delete payload.iat;
        // 查看payload是否在redis中
        const storedToken = await this.redisService.get(`user:${payload.userId}`);
        const payloadString = typeof payload !== 'string' ? JSON.stringify(payload) : payload;
        if (payloadString != storedToken) {
            throw new UnauthorizedException("Token已失效");
        }

        // 返回用户信息
        return {
            userId: payload.userId,
            userName: payload.userName,
            userEmail: payload.userEmail,
            userAge: payload.userAge,
            userAlias: payload.userAlias
        };
    }
}
