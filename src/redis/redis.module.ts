/*
 * @Author: Anixuil
 * @Date: 2025-06-07 20:05:54
 * @LastEditors: Anixuil
 * @LastEditTime: 2025-09-30 12:29:56
 * @Description: redis 配置
 */
import { Module } from "@nestjs/common";
import { RedisModule as RedisModuleNest } from "@nestjs-modules/ioredis";

@Module({
    imports: [
        RedisModuleNest.forRoot({
            type: 'single',
            url: '121.37.4.76',
            options: {
                username: '',
                password: 'Lx20010207',
                // username: '',
                // password: '',
                db: 0,
                connectTimeout: 10000,
                maxRetriesPerRequest: 3,
                port: 6379,
                retryStrategy: (times) => {
                    // 最多重试 5 次，每次等待 1000ms
                    if (times > 5) {
                        console.warn('Redis 连接失败，已达到最大重试次数');
                        return null;
                    }
                    return 1000;
                }
            }
        })
    ]
})
export class RedisModule {}