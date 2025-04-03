/*
 * @Author: Anixuil
 * @Date: 2025-04-02 11:31:16
 * @LastEditors: Anixuil
 * @LastEditTime: 2025-04-02 17:13:46
 * @Description: 请填写简介
 */
import { Body, Controller, Post, UsePipes } from "@nestjs/common";
import { AddSysUserDto } from "./dto/addSysUser.dto";
import { SysUserService } from "./sysUser.service";
import { ZodCustomValidationPipe } from "../validation.pipe";

@Controller('sys-user')
export class SysUserController {
  constructor(private readonly SysUserService: SysUserService) {}

  @Post('addSysUser')
  @UsePipes(new ZodCustomValidationPipe())
  async addSysUser(@Body() dto:AddSysUserDto):Promise<any>{
      return await this.SysUserService.addSysUser(dto)
  }
}