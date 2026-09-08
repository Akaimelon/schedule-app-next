# alpine ではなく bookworm。musl だと lightningcss / sharp / Prisma で3回転ぶ
FROM node:24-bookworm-slim AS base
WORKDIR /app

# ---------- deps：依存だけ入れる ----------
FROM base AS deps
# package.json だけ先にコピーする＝これらが変わらない限り npm ci をキャッシュから再利用できる
COPY package.json package-lock.json ./
# postinstall で prisma generate が走るので、schema と設定を npm ci より先に置く
COPY prisma ./prisma
COPY prisma.config.ts ./
RUN npm ci

# ---------- builder：ビルドする ----------
FROM deps AS builder
COPY . .
# ビルド中は DB に繋がない。src/lib/prisma.ts が読み込み時に投げるのを避けるためのダミー
ENV DATABASE_URL="mysql://build:build@localhost:3306/build"
RUN npm run build

# ---------- runner：本番で動く ----------
FROM base AS runner
ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

COPY --from=builder --chown=node:node /app/.next/standalone ./
COPY --from=builder --chown=node:node /app/.next/static ./.next/static
COPY --from=builder --chown=node:node /app/public ./public

USER node
EXPOSE 3000
CMD ["node", "server.js"]

# ---------- migrator：使い捨て。compose の profiles から呼ぶ ----------
FROM base AS migrator
COPY --from=deps /app/node_modules ./node_modules
COPY package.json prisma.config.ts ./
COPY prisma ./prisma
CMD ["npx", "prisma", "migrate", "deploy"]