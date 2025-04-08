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