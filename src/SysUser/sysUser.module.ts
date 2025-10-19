/*
 * @Author: Anixuil
 * @Date: 2025-04-02 14:12:33
 * @LastEditors: Anixuil
 * @LastEditTime: 2025-10-02 18:08:59
 * @Description: 请填写简介
 */
import { Module } from "@nestjs/common";
import { SysUserController } from "./sysUser.controller";
import { SysUserService } from "./sysUser.service";
import { PrismaModule } from "../prisma/prisma.module";
import { AuthModule } from "src/Auth/auth.module";
import { SysLogModule } from "src/SysLog/sysLog.module";
import { HttpModule } from "@nestjs/axios";
import { RedisModule } from "src/redis/redis.module";
@Module({
    imports: [PrismaModule, AuthModule, SysLogModule, HttpModule, RedisModule],
    controllers: [SysUserController],
    providers: [SysUserService],
    exports: [SysUserService]
})
    
export class SysUserModule {}
