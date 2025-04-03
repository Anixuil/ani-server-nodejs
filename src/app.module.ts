/*
 * @Author: Anixuil
 * @Date: 2025-03-27 10:40:06
 * @LastEditors: Anixuil
 * @LastEditTime: 2025-04-02 16:01:04
 * @Description: 主模块
 */
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SysUserModule } from './SysUser/sysUser.module';
// import { PrismaModule } from './prisma/prisma.module';
@Module({
  imports: [SysUserModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
