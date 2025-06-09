/*
 * @Author: Anixuil
 * @Date: 2025-04-14 11:32:52
 * @LastEditors: Anixuil
 * @LastEditTime: 2025-04-14 11:36:38
 * @Description: ai请求参数
 */
import { createZodDto } from "@anatine/zod-nestjs";
import { z } from "zod";

// deepseek 请求参数
export const aiSchema = z.object({
    model: z.string().nonempty({ message: 'model不能为空' }),
    messages: z.array(z.object({ role: z.string().nonempty({ message: 'role不能为空' }), content: z.string().nonempty({ message: 'content不能为空' }) })),
    stream: z.boolean().optional(),
    temperature: z.number().optional(),
    top_p: z.number().optional(),
    max_tokens: z.number().optional(),
    presence_penalty: z.number().optional(),
    frequency_penalty: z.number().optional(),
}).passthrough();

export class AiDto extends createZodDto(aiSchema) {}
