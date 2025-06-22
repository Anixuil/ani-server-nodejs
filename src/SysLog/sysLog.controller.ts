import { Controller, UseInterceptors } from "@nestjs/common";
import { RestInterceptor } from "src/Rest/rest.interceptor";
import { SysLogService } from "./sysLog.service";

@Controller('sys-log')
@UseInterceptors(RestInterceptor)
export class SysLogController {
    constructor(private readonly sysLogService: SysLogService) {}
}