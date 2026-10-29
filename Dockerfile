FROM node:24-trixie-slim AS deps

WORKDIR /app

COPY package.json package-lock.json ./

COPY prisma7.config.ts ./

COPY prisma ./prisma

RUN npm ci

FROM node:24-trixie-slim AS builder

WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules

COPY --from=deps /app/src/generated ./src/generated

COPY . .

RUN npm run build

FROM node:24-trixie-slim AS runner

WORKDIR /app

ENV NODE_ENV=production PORT=3002 HOSTNAME=0.0.0.0

COPY --from=builder /app/.next/standalone ./

COPY --from=builder /app/.next/static ./.next/static

COPY --from=builder /app/public ./public

USER node

EXPOSE 3002

CMD ["node", "server.js"]