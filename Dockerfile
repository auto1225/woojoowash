# syntax=docker/dockerfile:1.6

# ---- deps ----
FROM node:20-alpine AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

# ---- builder ----
FROM node:20-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# git 으로 추적되지 않는 빈 폴더 보장
RUN mkdir -p public/uploads/profile

# Prisma 클라이언트 생성 (스키마 → @prisma/client)
RUN npx prisma generate

# Build (NEXT_PUBLIC_ env 는 이때 주입돼야 클라이언트 번들에 박힘)
ARG NEXT_PUBLIC_NAVER_MAP_CLIENT_ID
ENV NEXT_PUBLIC_NAVER_MAP_CLIENT_ID=$NEXT_PUBLIC_NAVER_MAP_CLIENT_ID
RUN npm run build

# ---- runtime ----
FROM node:20-alpine AS runtime
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

# 빌더 단계에서 prisma generate 까지 끝난 node_modules 를 그대로 사용
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/next.config.mjs ./next.config.mjs

# 업로드 디렉토리 생성 (volume mount 대상)
RUN mkdir -p /app/public/uploads/profile

EXPOSE 3000

# 시작 스크립트: 마이그레이션 → 시드(있을때만) → next start
CMD ["sh", "-c", "npx prisma migrate deploy && node node_modules/next/dist/bin/next start -p 3000 -H 0.0.0.0"]
