# syntax=docker/dockerfile:1

# ---- Base ----
FROM oven/bun:1 AS base
WORKDIR /app

# ---- Dependencies ----
FROM base AS deps
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile --production

# ---- Build ----
FROM base AS build
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile
COPY . .

# ---- Production ----
FROM base AS production
ENV NODE_ENV=production

# Copy production dependencies
COPY --from=deps /app/node_modules ./node_modules

# Copy source files
COPY --from=build /app/src ./src
COPY --from=build /app/index.ts ./
COPY --from=build /app/package.json ./
COPY --from=build /app/drizzle.config.ts ./

# Expose application port
EXPOSE 8000

# Run the application
CMD ["bun", "run", "index.ts"]
