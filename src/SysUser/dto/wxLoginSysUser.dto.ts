/*
 * @Author: Anixuil
 * @Date: 2025-10-02 09:43:55
 * @LastEditors: Anixuil
 * @LastEditTime: 2025-10-02 10:24:09
 * @Description: 微信登录DTO
 */
import { createZodDto } from "@anatine/zod-nestjs";
import { z } from "zod";


export const wxLoginSysUserSchema = z.object({
    code: z.string().nonempty({ message: 'code不能为空' }),
    avatarUrl: z.string().optional(),
    nickName: z.string().optional(),
    gender: z.number().optional(),
}).passthrough();

export class WxLoginSysUserDto extends createZodDto(wxLoginSysUserSchema) {}
