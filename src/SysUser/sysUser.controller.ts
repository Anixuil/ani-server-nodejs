/*
 * @Author: Anixuil
 * @Date: 2025-04-02 11:31:16
 * @LastEditors: Anixuil
 * @LastEditTime: 2025-04-11 10:15:44
 * @Description: 系统用户控制器
 */
import { Body, Controller, Post, UsePipes, UseInterceptors } from "@nestjs/common";
import { AddSysUserDto } from "./dto/addSysUser.dto";
import { SysUserService } from "./sysUser.service";
import { ZodCustomValidationPipe } from "../validation.pipe";
import { RestResponse } from "../Rest";
import { RestInterceptor } from "../Rest/rest.interceptor";
import { LoginSysUserDto } from "./dto/loginSysUser.dto";
import { Public } from "src/guards/public.decorator";

@Controller('sys-user')
@UseInterceptors(RestInterceptor)
export class SysUserController {
  constructor(private readonly SysUserService: SysUserService) {}

  @Post('addSysUser')
  @UsePipes(new ZodCustomValidationPipe())
  async addSysUser(@Body() dto:AddSysUserDto):Promise<any>{
      const result = await this.SysUserService.addSysUser(dto);
      return RestResponse.success(result, '用户添加成功');
  }

  @Public()
  @Post('register')
  @UsePipes(new ZodCustomValidationPipe())
  async register(@Body() dto: AddSysUserDto): Promise<any>{
    const result = await this.SysUserService.addSysUser(dto);
    return RestResponse.success(result, '注册成功');
  }

  @Public()
  @Post('login')
  @UsePipes(new ZodCustomValidationPipe())
  async login(@Body() dto: LoginSysUserDto): Promise<any> {
    const result = await this.SysUserService.login(dto);
    return RestResponse.success(result, '登录成功');
  }
}