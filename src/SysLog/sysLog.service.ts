import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { AddSysLogDto } from "./dto/addSysLog.dto";
import { handleApiServiceError } from "src/utils";

@Injectable()
export class SysLogService {
    constructor(private readonly prisma: PrismaService) { }
    
    // 添加系统日志
    async addSysLog(data: AddSysLogDto, currentUserId: number) { 
        try {
            const { userId, operation, time, method, params, ip, result } = data;
            const log = await this.prisma.sysLog.create({
                data: {
                    userId, operation, time, method, params, ip, result, createBy: currentUserId, updateBy: currentUserId }
            })
            return log;
        } catch (err) {
            console.log('err', err);
            
            // 保留BadRequestException原始错误信息
            if (err instanceof BadRequestException || err instanceof UnauthorizedException || err instanceof NotFoundException) {
                throw err;
            }
            // 其他错误使用通用处理函数
            handleApiServiceError(err);
        }
    }

}