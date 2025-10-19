/*
 * @Author: Anixuil
 * @Date: 2025-06-22 12:34:09
 * @LastEditors: Anixuil
 * @LastEditTime: 2025-10-03 10:46:24
 * @Description: 请填写简介
 */
import { createZodDto } from "@anatine/zod-nestjs";
import { z } from "zod";

export const addSysLogSchema = z.object({
    userId: z.number().min(1, { message: '用户ID非法' }),
    operation: z.string().nonempty({ message: '操作描述不能为空' }),
    time: z.date().optional(),
    result: z.number().optional(),
    method: z.string().nonempty({ message: '请求方法不能为空' }),
    params: z.string().nonempty({ message: '请求参数不能为空' }),
    ip: z.string().nonempty({ message: 'IP地址不能为空' }),
}).passthrough();

export class AddSysLogDto extends createZodDto(addSysLogSchema) {}