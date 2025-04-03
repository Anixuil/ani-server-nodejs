/*
 * @Author: Anixuil
 * @Description: Zod验证管道
 */
import { ZodValidationPipe } from '@anatine/zod-nestjs'
import { Injectable, PipeTransform, BadRequestException } from '@nestjs/common'
import { ZodError } from 'zod'

@Injectable()
export class ZodCustomValidationPipe extends ZodValidationPipe implements PipeTransform {
    // 重写transform方法以支持自定义错误消息
    async transform(value: any, metadata: any) {
        try {
            return await super.transform(value, metadata);
        } catch (error) {            
            if (error instanceof ZodError) {
                // 提取Zod自定义错误消息
                const formattedErrors = error.errors.map(err => ({
                    field: err.path.join('.'),
                    message: err.message
                }));
                console.log('error', error);

                throw new BadRequestException({
                    message: '参数验证失败',
                    errors: formattedErrors
                });
            }
            throw error;
        }
    }
} 