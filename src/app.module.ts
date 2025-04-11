/*
 * @Author: Anixuil
 * @Date: 2025-03-27 10:40:06
 * @LastEditors: Anixuil
 * @LastEditTime: 2025-04-11 10:13:01
 * @Description: 主模块
 */
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SysUserModule } from './SysUser/sysUser.module';
import { ApiRateLimiterInterceptor } from './filter/api-rate-limiter.interceptor';
import { RedisModule } from './redis/redis.module';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { AuthModule } from './Auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { jwtConfig } from './Auth/jwt.config';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [jwtConfig]
    }),
    SysUserModule,
    RedisModule,
    AuthModule
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_INTERCEPTOR,
      useClass: ApiRateLimiterInterceptor
    },
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard
    }
  ],
})
export class AppModule { }
