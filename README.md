# Ani-Server

> 这是Ani-Server搭建文档

## 一、项目初始化

### 1、创建NestJS项目

```bash
# 安装 Nest CLI
npm install -g @nestjs/cli

# 创建新项目（选择 npm/yarn/pnpm）
nest new project-name
```

### 2、安装核心依赖

```bash
cd project-name
npm install prisma @prisma/client zod @anatine/zod-nestjs class-validator class-transformer
npm install -D @types/node
```

## 二、Prisma配置

### 1、初始化Prisma

```bash
npx prisma init --datasource-provider mysql
```

此时会生成 `prisma/schema.prisma  数据模型文件` 和 `.env 环境配置文件`

### 2、配置数据库连接(以mysql为例)

```prisma
// prisma/schema.prisma
datasource db {
  provider = "mysql"
  url      = env("DATABASE_URL")  // 通过环境变量注入
  relationMode = "prisma"  // 显式声明关系模式（v4.7+新特性）
}

generator client {
  provider = "prisma-client-js"
  // output   = "../node_modules/.prisma/client" // Monorepo 项目需指定路径[1](@ref) 非monorepo项目注释
}
```

```env
# .env
DATABASE_URL="mysql://USER:PASSWORD@HOST:PORT/DATABASE?schema=public"
```

- URL参数详解
  - USER 数据库账号
  - PASSWORD 含特殊字符需URL编码
  - HOST 生成环境建议内网ip
  - schema 指定默认工作模式

```prisma
model User {
  id        Int      @id @default(autoincrement())
  email     String   @unique
  name      String?
  createdAt DateTime @default(now())
  posts     Post[]
}

model Post {
  id         Int     @id @default(autoincrement())
  title      String  @db.VarChar(255)  // 显式指定字段类型
  content    String?
  authorId   Int
  author     User    @relation(fields: [authorId], references: [id])
}
```

### 3、执行首次迁移

```bash
npx prisma migrate dev --name init
npx prisma generate
```

该命令会：

1. 在 `/prisma/migrations` 生成 SQL 文件
2. 自动执行 DDL 语句创建表结构
3. 生成 TypeScript 类型定义

> 要注意数据库账户的权限，因为我是直连服务器的数据库，所以遇到了权限问题，需要分配权限。

### 4、常用Prisma命令

```bash
# 完全重置数据库 生产环境慎用
npx prisma migrate reset

# 强制覆盖现有表结构
npx prisma db push --force-reset

# 只更新schema不重置数据
npx prisma db push --accept-data-loss
```

## 三、集成Zod验证

### 1、创建全局验证管道

```typescript
// src/validation.pipe.ts
import { ZodValidationPipe } from '@anatine/zod-nestjs'
import { Injectable, PipeTransform, BadRequestException } from '@nestjs/common'
import { ZodError } from 'zod'

@Injectable()
export class ZodCustomValidationPipe extends ZodValidationPipe implements PipeTransform {
    // 重写transform方法以支持自定义错误消息
    async transform(value: any, metadata: any) {
        try {
            return await super.transform(value, metadata);
        } catch (error) {            
            if (error instanceof ZodError) {
                // 提取Zod自定义错误消息
                const formattedErrors = error.errors.map(err => ({
                    field: err.path.join('.'),
                    message: err.message
                }));
                console.log('error', error);

                throw new BadRequestException({
                    message: '参数验证失败',
                    errors: formattedErrors
                });
            }
            throw error;
        }
    }
} 
```

### 2、在main.ts启用全局管道

```typescript
// src/main.ts
import { AppModule } from './app.module';
import { ValidationExceptionFilter } from './filter/http-exception.filter';
import { ValidationPipe } from '@nestjs/common';
import { ZodCustomValidationPipe } from './validation.pipe';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn', 'log', 'debug', 'verbose'], // 设置日志级别
    cors: true, // 设置跨域
    rawBody: true, // 解析json
    bodyParser: true, // 设置body解析器
  });
  app.useGlobalFilters(new ValidationExceptionFilter()); // 使用自定义异常过滤器
  app.setGlobalPrefix('ani-server') // 设置全局前缀
  
  // 注册内置验证管道用于class-validator
  app.useGlobalPipes(new ValidationPipe());
  
  // 注册全局Zod验证管道
  app.useGlobalPipes(new ZodCustomValidationPipe());
  
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();

```

### 3、定义DTO与Zod Schema

```typescript
// src/sysUser/dto/addSysUser.dto.ts
import { z } from 'zod'
import { createZodDto } from '@anatine/zod-nestjs'

export const addSysUserSchema = z.object({
    userEmail: z.string().nonempty({ message: '邮箱不能为空' }).email({ message: '邮箱格式错误' }),
    userPassword: z.string().nonempty({ message: '密码不能为空' }).min(6, { message: '密码长度至少为6位' }),
    userAlias: z.string().optional(),
    userAge: z.number({ message: '年龄必须为数字' }).optional(),
    userName: z.string().nonempty({ message: '用户名不能为空' }).min(1, { message: '用户名长度至少为1位' })
}).passthrough(); // 传递原始数据

// 使用createZodDto创建DTO类
export class AddSysUserDto extends createZodDto(addSysUserSchema) {}
```

## 四、核心模块搭建

### 1、创建Prisma服务模块

```typescript
// scr/prisma/prisma.service.ts
import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  async onModuleInit() {
    await (this.$connect as () => Promise<void>)();
  }

  async onModuleDestroy() {
    await (this.$disconnect as () => Promise<void>)();
  }
}
```

### 2、用户模块实现

```typescript
// src/sysUser/sysUser.service.ts
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
```

```typescript
// src/utils
import { BadRequestException, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { Prisma } from "@prisma/client";


// 处理API服务错误
export function handleApiServiceError(err: any) {
    if (err instanceof Prisma.PrismaClientKnownRequestError) { 
        switch (err.code) {
            case 'P2025':
                return new NotFoundException('数据不存在')
            case 'P2002':
                return new BadRequestException('数据已存在')
            case 'P2003':
                return new BadRequestException('外键约束失败')
            case 'P2000':
                return new BadRequestException('数据库输入值过长')
            case 'P2001':
                return new BadRequestException('数据库输入值错误')
            case 'P2004':
                return new BadRequestException('数据库约束失败')
            case 'P2005':
                return new BadRequestException('字段值类型不匹配')
            case 'P2006':
                return new BadRequestException('提供的值无效')
            case 'P2007':
                return new BadRequestException('数据验证错误')
            case 'P2026':
                return new BadRequestException('数据冲突')
            case 'P2027':
                return new BadRequestException('数据验证错误')

            default:
                return new InternalServerErrorException('服务器错误')
        }
    }
    
    // 处理非Prisma错误
    return new InternalServerErrorException('未知服务器错误')
}
```



### 3、控制器集成验证

```typescript
// src/sysUser/sysUser.controller.ts
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
```

## 五、开发环境优化

### 1、数据可视化

```bash
npx prisma studio # 访问 http://localhost:5555
```

### 2、热重载配置

```bash
pnpm i --save-dev @nestjs/cli rimraf
```

修改`package.json`

```json
"dev": "nest build --watch --webpack && nest start"
```



> **关键注意事项**
>
> 过程中可能会遇到一些TS类型校验的问题
>
> 找到eslint.config.mjs添加以下规则
>
> ```js
> {
>     rules: {
>       '@typescript-eslint/no-explicit-any': 'off',
>       '@typescript-eslint/no-floating-promises': 'warn',
>       '@typescript-eslint/no-unsafe-argument': 'off',
>       'prettier/prettier': 'off',
>       '@typescript-eslint/no-unsafe-return': 'off',
>       '@typescript-eslint/no-unsafe-call': 'off',
>       '@typescript-eslint/no-unsafe-member-access': 'off'
>     },
> }
> ```



## 六、打包发布

> 这里我们采取的是docker镜像打包上传到服务器上运行的流程来实现服务的发布上线

### 1、打包配置

```dockerfile
# Dockerfile

# 阶段一：构建环境
FROM node:23-alpine AS builder
# 设置时区
ENV TZ=Asia/Shanghai

# 创建工作目录
WORKDIR /Anixuil/ani-server

# 复制package.json和lockfile
COPY package.json ./
COPY package-lock.json* ./
COPY .env ./

# 复制prisma目录，这是必需的
COPY prisma ./prisma/

# 安装依赖，包括新添加的@anatine/zod-openapi
RUN npm install --legacy-peer-deps

# 生成Prisma客户端
RUN npx prisma generate --schema=./prisma/schema.prisma

# 复制所有源代码文件，除了node_modules
COPY src ./src/
COPY tsconfig.json ./
COPY nest-cli.json ./

# 构建应用
RUN npm run build

# 阶段二：生产镜像
FROM node:23-alpine AS production
WORKDIR /Anixuil/ani-server

# 设置环境变量
ENV NODE_ENV=production

# 从构建阶段复制必要文件
COPY --from=builder /Anixuil/ani-server/package.json ./
COPY --from=builder /Anixuil/ani-server/dist ./dist
COPY --from=builder /Anixuil/ani-server/prisma ./prisma
COPY --from=builder /Anixuil/ani-server/node_modules ./node_modules
COPY --from=builder /Anixuil/ani-server/.env ./

# 添加健康检查
HEALTHCHECK --interval=30s --timeout=30s --start-period=5s --retries=3 \
  CMD node -e "const http = require('http'); const options = { hostname: 'localhost', port: 3000, path: '/ani-server/health', timeout: 2000 }; const req = http.get(options, (res) => process.exit(res.statusCode === 200 ? 0 : 1)).on('error', () => process.exit(1));"

# 明确暴露端口
EXPOSE 3000

# 启动应用
CMD ["node", "dist/main.js"]
```

```yaml
version: '3.8'

services:
  ani-server:
    image: ani-server
    build: .
    env_file: .env
    ports:
      - "3000:3000"
    restart: unless-stopped
    environment:
      DATABASE_URL: mysql://${MYSQL_USER}:${MYSQL_PASSWORD}@${MYSQL_HOST}:${MYSQL_PORT}/${MYSQL_DATABASE}

# 移除了mysql服务和volumes配置，因为现在直接使用外部MySQL服务
```

以上用到变量的地方都是在`.env`文件中声明的变量

```
PORT=3000

DATABASE_URL="mysql://数据库用户:密码@ip地址:端口/数据库名?schema=public"

MYSQL_HOST=你的服务器地址
MYSQL_PORT=数据库服务端口
MYSQL_USER=数据库用户
MYSQL_PASSWORD=数据库密码
MYSQL_DATABASE=数据库
MYSQL_ROOT_PASSWORD=数据库密码

```

然后执行

```bash
docker-compose build # 命令进行打包
```

打包结束后我们可以在`Docker Desktop`的`images`中看到刚刚打好包的镜像，此时我们再执行命令

```bash
docker-compose up -d # 构建运行容器
```

这时我们就能在`Docker Desktop`的`containers`中看到运行起来的容器了

本地调试过后没有问题，这时候我们就要转战线上了。

我们首先在本地打一个tar包

```bash
docker images # 查看镜像
docker save ani-server -o ani-server.tar # 打包
```

连上服务器，我这里只说我的流程。

在根目录创建`docker-images`目录，随便取名，把刚刚打好的tar包上传到服务器上

```bash
# 在根目录创建docker-images
cd docker-images
docker load -i ani-server.tar # 加载上传的tar包到服务器镜像库
```

然后我是宝塔面板，直接上宝塔面板的docker管理，创建容器选择镜像找到刚才的镜像，然后配置后端口什么的。

运行起来后在自己本地`postman`测试ip端口直接访问接口。

## 七、反向代理

新添加一个网站，然后配置好证书、域名，然后配置该域名的反向代理。目标URL是docker镜像运行起来后的地址

![img](https://anixuil.obs.cn-south-1.myhuaweicloud.com/typoraImageResource/QQ_1744106066228.png)

![image-20250408175524143](https://anixuil.obs.cn-south-1.myhuaweicloud.com/typoraImageResource/image-20250408175524143.png)

## 八、JWT

安装核心依赖

```bash
pnpm i @nestjs/jwt @nestjs/passport passport passport-jwt bcrypt @nestjs/config @types/bcrypt
```

在`.env`中新加**JWT**配置

```
JWT_SECRET="your_secret"
JWT_EXPIRES_IN="24h"
```

