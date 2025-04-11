import { createZodDto } from "@anatine/zod-nestjs";
import { z } from "zod";


export const loginSysUserSchema = z.object({
    userEmail: z.string().nonempty({ message: '邮箱不能为空' }).email({ message: '邮箱格式错误' }),
    userPassword: z.string().nonempty({ message: '密码不能为空' }).min(6, { message: '密码长度至少为6位' })
}).passthrough();

export class LoginSysUserDto extends createZodDto(loginSysUserSchema) {}
