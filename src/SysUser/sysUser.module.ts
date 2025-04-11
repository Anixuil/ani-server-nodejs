/*
 * @Author: Anixuil
 * @Date: 2025-04-02 14:12:33
 * @LastEditors: Anixuil
 * @LastEditTime: 2025-04-11 10:01:45
 * @Description: 请填写简介
 */
import { Module } from "@nestjs/common";
import { SysUserController } from "./sysUser.controller";
import { SysUserService } from "./sysUser.service";
import { PrismaModule } from "../prisma/prisma.module";
import { AuthModule } from "src/Auth/auth.module";
@Module({
    imports: [PrismaModule, AuthModule],
    controllers: [SysUserController],
    providers: [SysUserService],
    exports: [SysUserService]
})
    
export class SysUserModule {}
