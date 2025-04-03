# 阶段一：构建环境
FROM node:18-alpine AS builder
# 设置时区
ENV TZ=Asia/Shanghai

# 创建工作目录
WORKDIR /Anixuil/ani-server

# 复制package.json和lockfile
COPY package.json ./
COPY package-lock.json* ./

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
FROM node:18-alpine AS production
WORKDIR /Anixuil/ani-server

# 设置环境变量
ENV NODE_ENV=production

# 从构建阶段复制必要文件
COPY --from=builder /Anixuil/ani-server/package.json ./
COPY --from=builder /Anixuil/ani-server/dist ./dist
COPY --from=builder /Anixuil/ani-server/prisma ./prisma
COPY --from=builder /Anixuil/ani-server/node_modules ./node_modules

EXPOSE 3000
CMD ["node", "dist/main.js"]