/*
 * @Author: Anixuil
 * @Date: 2025-04-14 11:43:27
 * @LastEditors: Anixuil
 * @LastEditTime: 2025-04-14 16:37:52
 * @Description: ai请求
 */
import { Body, Controller, Post, Sse, UseInterceptors, UsePipes } from "@nestjs/common";
import { RestInterceptor } from "src/Rest/rest.interceptor";
import { AiService } from "./ai.service";
import { ZodCustomValidationPipe } from "src/validation.pipe";
import { AiDto } from "./dto/ai.dto";
// import { RestResponse } from "src/Rest";
import { Public } from "src/guards/public.decorator";
import { catchError, map, of } from "rxjs";



@Controller('ai')
@UseInterceptors(RestInterceptor)
export class AiController {
    constructor(private readonly aiService: AiService) { }

    @Public()
    @Post('deepseek')
    @Sse('deepseek')
    @UsePipes(new ZodCustomValidationPipe())
    deepseek(@Body() dto: AiDto): any {
        return this.aiService.deepseek(dto).pipe(
            map(data => (data)),
            catchError((err: Error) => {
                // throw new BadRequestException(err.message)
                return of(err.message)
            })
        )
    }
}