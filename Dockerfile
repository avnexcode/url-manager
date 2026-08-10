# S-1 : base — shared alpine + node, NO hardcoded ENV
FROM node:20-alpine AS base

# S-2 : deps — install dependencies
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY package.json package-lock.json* ./

RUN npm ci

# S-3 : builder — build Next.js application
FROM base AS builder
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Dummy ENV kalau ada env validation saat build (mis. t3-env / zod).
# Hapus baris ini kalau proyekmu tidak butuh ENV apa pun saat build.
ENV SKIP_ENV_VALIDATION=1

RUN npm run build

# S-4 : production — lean image, zero hardcoded secrets
FROM base AS production
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]

# RUN
# docker build -t portofolio-app .
# docker compose up --build -d