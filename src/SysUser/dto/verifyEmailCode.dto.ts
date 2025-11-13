/*
 * @Author: Anixuil
 * @Date: 2025-10-19 15:53:07
 * @LastEditors: Anixuil
 * @LastEditTime: 2025-10-19 15:53:39
 * @Description: 验证邮箱验证码DTO
 */
import { createZodDto } from "@anatine/zod-nestjs";
import { z } from "zod";


export const verifyEmailCodeSchema = z.object({
    userEmail: z.string().nonempty({ message: '邮箱不能为空' }).email({ message: '邮箱格式错误' }),
    code: z.string().nonempty({ message: '验证码不能为空' }),
}).passthrough();

export class VerifyEmailCodeDto extends createZodDto(verifyEmailCodeSchema) {}