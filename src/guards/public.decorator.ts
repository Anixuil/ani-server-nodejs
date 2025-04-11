/*
 * @Author: Anixuil
 * @Date: 2025-04-11 10:14:21
 * @LastEditors: Anixuil
 * @LastEditTime: 2025-04-11 10:14:51
 * @Description: 公共装饰器
 */
import { SetMetadata } from "@nestjs/common";

export const Public = () => SetMetadata('isPublic', true)