FROM oven/bun:canary-alpine AS builder

WORKDIR /app/
COPY package.json ./
COPY bun.lock ./
COPY . .

RUN bun -g install @nestjs/cli
RUN bun install
RUN bun run build

FROM oven/bun:canary-alpine 

WORKDIR /app/

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./

COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

WORKDIR /app/dist/
COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

ENTRYPOINT ["/entrypoint.sh"]
CMD ["bun", "run", "./src/main.js"]

