/*
 * @Author: Anixuil
 * @Date: 2025-04-10 17:55:36
 * @LastEditors: Anixuil
 * @LastEditTime: 2025-04-10 18:03:19
 * @Description: 封装Restful API
 */

export class RestResponse<T = any> {
  private code: number;
  private message: string;
  private data: T;
  private timestamp: number;

  constructor(code: number, message: string, data: T) {
    this.code = code;
    this.message = message;
    this.data = data;
    this.timestamp = Date.now();
  }

  public static success<T>(data: T, message: string = '操作成功'): RestResponse<T> {
    return new RestResponse<T>(200, message, data);
  }

  public static error<T = null>(message: string = '操作失败', code: number = 500, data: T | null = null): RestResponse<T> {
    return new RestResponse<T>(code, message, data as T);
  }

  public static unauthorized(message: string = '未授权'): RestResponse<null> {
    return new RestResponse<null>(401, message, null);
  }

  public static forbidden(message: string = '禁止访问'): RestResponse<null> {
    return new RestResponse<null>(403, message, null);
  }

  public static notFound(message: string = '资源不存在'): RestResponse<null> {
    return new RestResponse<null>(404, message, null);
  }
}
