
FROM node:24-bookworm-slim AS base
WORKDIR /app


FROM base AS deps

COPY package.json package-lock.json ./

COPY prisma ./prisma
COPY prisma.config.ts ./
RUN npm ci


FROM deps AS builder
COPY . .

ENV DATABASE_URL="mysql://build:build@localhost:3306/build"
RUN npm run build

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


FROM base AS migrator
COPY --from=deps /app/node_modules ./node_modules
COPY package.json prisma.config.ts ./
COPY prisma ./prisma
CMD ["npx", "prisma", "migrate", "deploy"]