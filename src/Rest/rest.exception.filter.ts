/*
 * @Author: Anixuil
 * @Date: 2025-04-10 18:05:00
 * @LastEditors: Anixuil
 * @LastEditTime: 2025-04-11 09:25:24
 * @Description: Rest异常过滤器
 */

import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class RestExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = '服务器内部错误';

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();
      message = typeof exceptionResponse === 'object' && 'message' in exceptionResponse
        ? Array.isArray(exceptionResponse['message'])
          ? exceptionResponse['message'][0]
          : exceptionResponse['message']
        : exception.message;
    } else if (exception instanceof Error) {
      message = exception.message;
    }

    const errorResponse = {
      code: status,
      message: message,
      data: null,
      timestamp: Date.now(),
      path: request.url,
    };

    response.status(status).json(errorResponse);
  }
} 