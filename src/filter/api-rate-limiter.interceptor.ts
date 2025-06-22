/*
 * @Author: Anixuil
 * @Date: 2025-04-10 15:02:11
 * @LastEditors: Anixuil
 * @LastEditTime: 2025-06-21 21:35:32
 * @Description: 请填写简介
 */
import { InjectRedis } from "@nestjs-modules/ioredis";
import { CallHandler, ExecutionContext, HttpException, HttpStatus, Injectable, Logger, NestInterceptor } from "@nestjs/common";
import Redis from "ioredis";
import { Observable, catchError, tap } from "rxjs";


@Injectable()
export class ApiRateLimiterInterceptor implements NestInterceptor {
    private readonly logger = new Logger(ApiRateLimiterInterceptor.name);
    
    constructor(@InjectRedis() private readonly redisService: Redis) { }
    
    async intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<any>> {
        try {
            const key = 'rate-limit:' + context.switchToHttp().getRequest().ip;
            
            // 检查 Redis 连接状态
            if (this.redisService.status !== 'ready') {
                this.logger.warn('Redis 连接不可用，跳过限流检查');
                return next.handle();
            }
            
            const currentRequestCount = await this.redisService.incr(key);

            if (currentRequestCount === 1) {
                // 设置过期时间 1分钟
                await this.redisService.expire(key, 60);
            }

            if (currentRequestCount > 10) {
                throw new HttpException('请求次数过多', HttpStatus.TOO_MANY_REQUESTS);
            }

            console.log('key', key, currentRequestCount);

            return next.handle().pipe(
                tap(() => {
                    // 请求结束后，尝试删除 key，忽略可能的错误
                    try {
                        this.redisService.del(key).catch(err => {
                            this.logger.warn(`无法删除 Redis key: ${key}, 错误: ${err.message}`);
                        });
                    } catch (error) {
                        this.logger.warn(`处理 Redis key 时出错: ${error.message}`);
                    }
                }),
                catchError(err => {
                    // 确保在出现错误时也尝试删除 key
                    try {
                        this.redisService.del(key).catch((delError) => {
                            this.logger.debug(`错误处理时删除key失败: ${delError.message}`);
                        });
                    } catch (cleanupError) {
                        this.logger.debug(`错误处理时发生异常: ${cleanupError.message}`);
                    }
                    throw err;
                })
            );
        } catch (error) {
            this.logger.error(`限流拦截器错误: ${error.message}`);
            // 发生错误时允许请求通过，不阻塞用户请求
            return next.handle();
        }
    }
}