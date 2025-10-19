/*
 * @Author: Anixuil
 * @Date: 2025-04-02 11:31:16
 * @LastEditors: Anixuil
 * @LastEditTime: 2025-10-03 10:36:04
 * @Description: 系统用户控制器
 */
import { Body, Controller, Post, UsePipes, UseInterceptors, Request, Get, Query } from "@nestjs/common";
import { AddSysUserDto } from "./dto/addSysUser.dto";
import { SysUserService } from "./sysUser.service";
import { ZodCustomValidationPipe } from "../validation.pipe";
import { RestResponse } from "../Rest";
import { RestInterceptor } from "../Rest/rest.interceptor";
import { LoginSysUserDto } from "./dto/loginSysUser.dto";
import { Public } from "src/guards/public.decorator";
import { WxLoginSysUserDto } from "./dto/wxLoginSysUser.dto";

@Controller('sys-user')
@UseInterceptors(RestInterceptor)
export class SysUserController {
  constructor(private readonly SysUserService: SysUserService) { }

  @Post('addSysUser')
  @UsePipes(new ZodCustomValidationPipe())
  async addSysUser(@Body() dto: AddSysUserDto, @Request() req: any): Promise<any> {
    const reqData = req;
    const result = await this.SysUserService.addSysUser(dto, reqData);
    return RestResponse.success(result, '用户添加成功');
  }

  @Public()
  @Post('register')
  @UsePipes(new ZodCustomValidationPipe())
  async register(@Body() dto: AddSysUserDto, @Request() req: any): Promise<any> {
    const reqData = req;
    const result = await this.SysUserService.addSysUser(dto, reqData);
    return RestResponse.success(result, '注册成功');
  }

  @Public()
  @Post('login')
  @UsePipes(new ZodCustomValidationPipe())
  async login(@Body() dto: LoginSysUserDto, @Request() req: any): Promise<any> {
    const reqData = req;
    const result = await this.SysUserService.login(dto, reqData);
    return RestResponse.success(result, '登录成功');
  }

  @Public()
  @Post('wxLogin')
  @UsePipes(new ZodCustomValidationPipe())
    async wxLogin(@Body() dto: WxLoginSysUserDto, @Request() req: any): Promise<any> {
    const reqData = req;
    const result = await this.SysUserService.wxLogin(dto, reqData);
    return RestResponse.success(result, '微信登录成功');
  }

  @Public()
  @Get('checkEmailIsExists')
  @UsePipes(new ZodCustomValidationPipe())
  async checkEmailIsExists(@Query('userEmail') userEmail: string): Promise<any> {
    if (!userEmail) {
      return RestResponse.error('邮箱不能为空');
    }
    const result = await this.SysUserService.publicCheckEmailExists(userEmail);
    const msg = result ? '邮箱已存在' : '邮箱不存在';
    return RestResponse.success(result, msg);
  }

  @Post('logout')
  async logout(@Request() req: any): Promise<any> {
    const reqData = req;
    const result = await this.SysUserService.logout(reqData);
    return RestResponse.success(result, result ? '注销成功' : '注销失败');
  }

  @Get('getUserInfo')
  async getUserInfo(@Request() req: any): Promise<any>{
    const reqData = req
    const result = await this.SysUserService.getUserInfo(reqData);
    return RestResponse.success(result, '获取用户信息成功');
  }
}