FROM node:20-slim AS builder

# better-sqlite3 컴파일에 필요한 도구
RUN apt-get update && apt-get install -y python3 make g++ && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .

# Prisma 클라이언트 생성 + Next.js 빌드
RUN npx prisma generate
RUN npm run build

# ── 실행 이미지 ──
FROM node:20-slim AS runner

WORKDIR /app
ENV NODE_ENV=production

# 빌드 결과물 + node_modules 복사 (prisma CLI 포함)
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/next.config.ts ./next.config.ts
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/src/generated ./src/generated

COPY start.sh ./start.sh
RUN chmod +x start.sh

EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

CMD ["./start.sh"]
