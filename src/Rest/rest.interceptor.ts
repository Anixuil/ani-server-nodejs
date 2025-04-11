/*
 * @Author: Anixuil
 * @Date: 2025-04-10 18:00:00
 * @LastEditors: Anixuil
 * @LastEditTime: 2025-04-10 18:00:00
 * @Description: Rest响应拦截器
 */

import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { RestResponse } from './index';

@Injectable()
export class RestInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map(data => {
        // 如果返回的已经是RestResponse类型，则直接返回
        if (data instanceof RestResponse) {
          return data;
        }
        // 否则包装成功响应
        return RestResponse.success(data);
      }),
    );
  }
} 