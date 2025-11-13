/*
 * @Author: Anixuil
 * @Date: 2025-10-19 16:03:24
 * @LastEditors: Anixuil
 * @LastEditTime: 2025-10-19 20:43:25
 * @Description: 更新用户信息DTO
 */
import { createZodDto } from "@anatine/zod-nestjs";
import { z } from "zod";


export const updateUserInfoSchema = z.object({
    userId: z.number().min(1, { message: '用户ID不能为空' }),
    userEmail: z.string().nonempty({ message: '邮箱不能为空' }).email({ message: '邮箱格式错误' }),
    userName: z.string().nonempty({ message: '用户名不能为空' }).min(1, { message: '用户名长度至少为1位' }),
    userAlias: z.string().optional()
}).passthrough();

export class UpdateUserInfoDto extends createZodDto(updateUserInfoSchema) {}