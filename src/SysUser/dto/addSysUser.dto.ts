/*
 * @Author: Anixuil
 * @Date: 2025-04-02 10:48:04
 * @LastEditors: Anixuil
 * @LastEditTime: 2025-04-02 17:44:14
 * @Description: 添加系统用户DTO
 */
import { z } from 'zod'
import { createZodDto } from '@anatine/zod-nestjs'

export const addSysUserSchema = z.object({
    userEmail: z.string().nonempty({ message: '邮箱不能为空' }).email({ message: '邮箱格式错误' }),
    userPassword: z.string().nonempty({ message: '密码不能为空' }).min(6, { message: '密码长度至少为6位' }),
    userAlias: z.string().optional(),
    userAge: z.number({ message: '年龄必须为数字' }).optional(),
    userName: z.string().nonempty({ message: '用户名不能为空' }).min(1, { message: '用户名长度至少为1位' })
}).passthrough(); // 传递原始数据

// 使用createZodDto创建DTO类
export class AddSysUserDto extends createZodDto(addSysUserSchema) {}
