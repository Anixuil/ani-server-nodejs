/*
 * @Author: Anixuil
 * @Date: 2025-03-27 10:40:06
 * @LastEditors: Anixuil
 * @LastEditTime: 2025-06-22 14:42:03
 * @Description: 主文件
 */
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationExceptionFilter } from './filter/http-exception.filter';
import { ValidationPipe } from '@nestjs/common';
import { ZodCustomValidationPipe } from './validation.pipe';
import { RestExceptionFilter } from './Rest/rest.exception.filter';
import { RestInterceptor } from './Rest/rest.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn', 'log', 'debug', 'verbose'], // 设置日志级别
    cors: true, // 设置跨域
    rawBody: true, // 解析json
    bodyParser: true, // 设置body解析器
  });
  
  // 使用Rest异常过滤器（优先级高于ValidationExceptionFilter）
  app.useGlobalFilters(new RestExceptionFilter());
  app.useGlobalFilters(new ValidationExceptionFilter()); // 使用自定义异常过滤器
  
  // 使用Rest响应拦截器
  app.useGlobalInterceptors(new RestInterceptor());
  
  app.setGlobalPrefix('ani-server') // 设置全局前缀
  
  // 注册内置验证管道用于class-validator
  app.useGlobalPipes(new ValidationPipe());
  
  // 注册全局Zod验证管道
  app.useGlobalPipes(new ZodCustomValidationPipe());
  
  await app.listen(process.env.PORT ?? 3000, '0.0.0.0');
}
bootstrap();
