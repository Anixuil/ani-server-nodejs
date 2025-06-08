/*
 * @Author: Anixuil
 * @Date: 2025-04-10 10:54:05
 * @LastEditors: Anixuil
 * @LastEditTime: 2025-06-08 16:03:07
 * @Description: 请填写简介
 */
import { ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { AuthGuard } from "@nestjs/passport";


@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
    constructor(private reflector: Reflector) {
        super()
    }

    canActivate(context: ExecutionContext) {
        const isPublic = this.reflector.get<boolean>('isPublic', context.getHandler())
        if (isPublic) return true
        return super.canActivate(context)
    }
}