/*
 * @Author: Anixuil
 * @Date: 2025-04-02 16:08:50
 * @LastEditors: Anixuil
 * @LastEditTime: 2025-04-02 16:26:44
 * @Description: 请填写简介
 */
import { BadRequestException, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { Prisma } from "@prisma/client";


// 处理API服务错误
export function handleApiServiceError(err: any) {
    if (err instanceof Prisma.PrismaClientKnownRequestError) { 
        switch (err.code) {
            case 'P2025':
                return new NotFoundException('数据不存在')
            case 'P2002':
                return new BadRequestException('数据已存在')
            case 'P2003':
                return new BadRequestException('外键约束失败')
            case 'P2000':
                return new BadRequestException('数据库输入值过长')
            case 'P2001':
                return new BadRequestException('数据库输入值错误')
            case 'P2004':
                return new BadRequestException('数据库约束失败')
            case 'P2005':
                return new BadRequestException('字段值类型不匹配')
            case 'P2006':
                return new BadRequestException('提供的值无效')
            case 'P2007':
                return new BadRequestException('数据验证错误')
            case 'P2026':
                return new BadRequestException('数据冲突')
            case 'P2027':
                return new BadRequestException('数据验证错误')

            default:
                return new InternalServerErrorException('服务器错误')
        }
    }
    
    // 处理非Prisma错误
    return new InternalServerErrorException('未知服务器错误')
}