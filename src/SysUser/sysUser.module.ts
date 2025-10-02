/*
 * @Author: Anixuil
 * @Date: 2025-04-02 14:12:33
 * @LastEditors: Anixuil
 * @LastEditTime: 2025-10-02 10:15:08
 * @Description: 请填写简介
 */
import { Module } from "@nestjs/common";
import { SysUserController } from "./sysUser.controller";
import { SysUserService } from "./sysUser.service";
import { PrismaModule } from "../prisma/prisma.module";
import { AuthModule } from "src/Auth/auth.module";
import { SysLogModule } from "src/SysLog/sysLog.module";
import { HttpModule } from "@nestjs/axios";
@Module({
    imports: [PrismaModule, AuthModule, SysLogModule, HttpModule],
    controllers: [SysUserController],
    providers: [SysUserService],
    exports: [SysUserService]
})
    
export class SysUserModule {}
