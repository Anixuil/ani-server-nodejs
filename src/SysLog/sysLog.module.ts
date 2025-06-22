/*
 * @Author: Anixuil
 * @Date: 2025-06-22 12:30:10
 * @LastEditors: Anixuil
 * @LastEditTime: 2025-06-22 12:44:54
 * @Description: 请填写简介
 */
import { Module } from "@nestjs/common";
import { PrismaModule } from "src/prisma/prisma.module";
import { SysLogController } from "./sysLog.controller";
import { SysLogService } from "./sysLog.service";

@Module({
    imports: [PrismaModule],
    controllers: [SysLogController],
    providers: [SysLogService],
    exports: [SysLogService]
})
export class SysLogModule {}