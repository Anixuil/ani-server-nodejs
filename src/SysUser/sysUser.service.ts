/*
 * @Author: Anixuil
 * @Date: 2025-04-02 11:15:46
 * @LastEditors: Anixuil
 * @LastEditTime: 2025-04-02 16:21:29
 * @Description: 请填写简介
 */
import { Injectable } from "@nestjs/common";
import { AddSysUserDto } from "./dto/addSysUser.dto";
import { PrismaService } from "../prisma/prisma.service";
import { handleApiServiceError } from "src/utils";

@Injectable()
export class SysUserService {
    constructor(private readonly prisma: PrismaService) { }

    // 添加用户
    async addSysUser(data: AddSysUserDto): Promise<any> {
        try {
            return await this.prisma.sysUser.create({ data })            
        } catch (err) {
            throw handleApiServiceError(err);
        }
    }
}