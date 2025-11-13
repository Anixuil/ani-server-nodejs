/*
 * @Author: Anixuil
 * @Date: 2025-10-19 15:09:12
 * @LastEditors: Anixuil
 * @LastEditTime: 2025-10-19 15:17:25
 * @Description: 发送邮箱验证码DTO
 */
import { createZodDto } from "@anatine/zod-nestjs";
import { z } from "zod";

export const sendUserEmailCodeSchema = z.object({
    userEmail: z.string().nonempty({ message: '收件邮箱不能为空' }).email({ message: '邮箱格式错误' }),
    emailTitle: z.string().nonempty({ message: '邮件标题不能为空' })
}).passthrough();

export class SendUserEmailDto extends createZodDto(sendUserEmailCodeSchema) {}