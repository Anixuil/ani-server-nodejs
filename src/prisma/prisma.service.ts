/*
 * @Author: Anixuil
 * @Date: 2025-03-27 17:04:45
 * @LastEditors: Anixuil
 * @LastEditTime: 2025-06-22 14:59:00
 * @Description: 请填写简介
 */
import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient<{
  log: [
    { emit: 'event'; level: 'query' },
    { emit: 'stdout'; level: 'error' },
    { emit: 'stdout'; level: 'info' },
    { emit: 'stdout'; level: 'warn' }
  ];
}> implements OnModuleInit, OnModuleDestroy {
  constructor() {
    super({
      log: [
        {
          emit: 'event',
          level: 'query',
        },
        {
          emit: 'stdout',
          level: 'error',
        },
        {
          emit: 'stdout',
          level: 'info',
        },
        {
          emit: 'stdout',
          level: 'warn',
        },
      ],
    });

    // 监听查询事件，打印SQL语句和执行时间
    this.$on('query', (e) => {
      console.log('Query: ' + e.query);
      console.log('Params: ' + e.params);
      console.log('Duration: ' + e.duration + 'ms');
      console.log('---');
    });
  }

  async onModuleInit() {
    await (this.$connect as () => Promise<void>)();
  }

  async onModuleDestroy() {
    await (this.$disconnect as () => Promise<void>)();
  }
}
