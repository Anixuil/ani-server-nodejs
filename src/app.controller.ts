/*
 * @Author: Anixuil
 * @Date: 2025-04-08 09:07:26
 * @LastEditors: Anixuil
 * @LastEditTime: 2025-06-22 00:13:14
 * @Description: 请填写简介
 */
import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { Public } from './guards/public.decorator';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Public()
  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Public()
  @Get('health')
  healthCheck(): { status: string } {
    return { status: 'OK' };
  }

  @Get('testAuth')
  @UseGuards(JwtAuthGuard)
  testAuth(): { message: string }{
    return { message: '认证成功' }
  }

  @Public()
  @Get('getIp')
  getIp(@Req() req: any): { ip: string } {
    return { 
      // 返回请求方的ip地址
      ip: req.ip
    }
  }
}
