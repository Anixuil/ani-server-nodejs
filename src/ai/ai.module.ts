/*
 * @Author: Anixuil
 * @Date: 2025-04-14 11:45:59
 * @LastEditors: Anixuil
 * @LastEditTime: 2025-04-14 15:29:13
 * @Description: ai模块
 */
import { HttpModule } from "@nestjs/axios";
import { Module } from "@nestjs/common";
import { AiController } from "./ai.controller";
import { AiService } from "./ai.service";



@Module({
    imports: [HttpModule],
    controllers: [AiController],
    providers: [AiService],
    exports: [AiService]
})

export class AiModule {}