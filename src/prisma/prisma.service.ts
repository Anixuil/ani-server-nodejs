/*
 * @Author: Anixuil
 * @Date: 2025-03-27 17:04:45
 * @LastEditors: Anixuil
 * @LastEditTime: 2025-04-02 16:00:45
 * @Description: 请填写简介
 */
import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  async onModuleInit() {
    await (this.$connect as () => Promise<void>)();
  }

  async onModuleDestroy() {
    await (this.$disconnect as () => Promise<void>)();
  }
}
