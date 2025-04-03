/*
 * @Author: Anixuil
 * @Date: 2025-04-02 14:12:33
 * @LastEditors: Anixuil
 * @LastEditTime: 2025-04-02 16:01:19
 * @Description: 请填写简介
 */
import { Module } from "@nestjs/common";
import { SysUserController } from "./sysUser.controller";
import { SysUserService } from "./sysUser.service";
import { PrismaModule } from "../prisma/prisma.module";
@Module({
    imports: [PrismaModule],
    controllers: [SysUserController],
    providers: [SysUserService],
    exports: [SysUserService]
})
    
export class SysUserModule {}
