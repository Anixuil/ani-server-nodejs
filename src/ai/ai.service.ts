/*
 * @Author: Anixuil
 * @Date: 2025-04-13 13:43:14
 * @LastEditors: Anixuil
 * @LastEditTime: 2025-04-14 16:37:45
 * @Description: ai请求
 */
import { HttpService } from "@nestjs/axios";
import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { AiDto } from "./dto/ai.dto";
import { Observable } from "rxjs";

@Injectable()
export class AiService {
    constructor(private readonly configService: ConfigService, private readonly httpService: HttpService) { }

    // deepseek 请求
    deepseek(dto: AiDto): Observable<string> {
        const baseURL = this.configService.get('DEEPSEEK_BASE_URL')
        const apiKey = this.configService.get('DEEPSEEK_API_KEY')

        return new Observable(subscribe => {
            this.httpService.axiosRef({
                method: 'POST',
                url: baseURL,
                timeout: 60 * 1000 * 10,
                headers: {
                    'Authorization': `Bearer ${apiKey}`,
                    'Content-Type': 'application/json'
                },
                data: dto,
                responseType: 'stream'
            }).then(res => {
                const stream = res.data

                stream.on('data', (chunk: Buffer) => {
                    const data = chunk.toString()
                    if (data.indexOf('[DONE]') != -1) {
                        subscribe.next(data)
                        stream.destroy()
                        return
                    }
                    try {
                        subscribe.next(data)
                    } catch (e) {
                        console.error('流式数据解析错误', e);
                    }

                })

                stream.on('error', (err: Error) => {
                    subscribe.error(err)
                    subscribe.complete()
                })

                stream.on('end', () => {
                    subscribe.complete()
                })

                stream.on('close', () => {
                    subscribe.complete()
                })

                stream.on('timeout', () => {
                    subscribe.error(new Error('请求超时'))
                    subscribe.complete()
                })
            }).catch(error => {
                subscribe.error(error)
                subscribe.complete()
            })
        })
    }
}