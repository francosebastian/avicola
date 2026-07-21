FROM node:20-slim AS builder
WORKDIR /app

RUN apt-get update -y && apt-get install -y python3 make g++ && rm -rf /var/lib/apt/lists/*

COPY package*.json ./
RUN npm ci

COPY prisma/ ./prisma/
COPY src/generated/ ./src/generated/ 2>/dev/null || true
RUN npx prisma generate

COPY . .
RUN npm run build

FROM node:20-slim AS runner
WORKDIR /app

RUN addgroup --system --gid 1001 nextjs && \
    adduser --system --uid 1001 nextjs

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/next.config.ts ./next.config.ts
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/scripts ./scripts
COPY --from=builder /app/src/generated ./src/generated

USER nextjs

EXPOSE 3000

ENTRYPOINT ["/app/scripts/entrypoint.sh"]
CMD ["npm", "start"]
