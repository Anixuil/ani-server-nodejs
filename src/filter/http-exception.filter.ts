// http-exception.filter.ts
import { ExceptionFilter, Catch, ArgumentsHost } from '@nestjs/common';
import { Response } from 'express';
import { BadRequestException } from '@nestjs/common';

@Catch(BadRequestException)
export class ValidationExceptionFilter implements ExceptionFilter {
    catch(exception: BadRequestException, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const status = exception.getStatus();
        const exceptionResponse = exception.getResponse() as any;
        
        // 支持Zod自定义错误格式
        if (exceptionResponse.errors && Array.isArray(exceptionResponse.errors)) {
            // 已经是格式化过的Zod错误
            response.status(status).json({
                code: status,
                message: exceptionResponse.message || '参数校验失败',
                errors: exceptionResponse.errors
            });
            return;
        }

        // 处理普通ValidationPipe错误
        const errors = Array.isArray(exceptionResponse.message)
            ? exceptionResponse.message
            : [exceptionResponse.message];

        response.status(status).json({
            code: status,
            message: '参数校验失败',
            errors: errors.map(error => ({
                field: this.extractField(error),
                message: error
            }))
        });
    }

    private extractField(error: string): string {
        // 从错误消息中提取字段名（如 "username 必须为字符串" → "username"）
        try {
            return error.split(' ')[0];
        } catch {
            return 'unknown';
        }
    }
}