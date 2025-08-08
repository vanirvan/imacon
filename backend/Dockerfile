###############################################
# Frontend build stage
###############################################
FROM node:20-alpine AS frontend-build
WORKDIR /app/frontend

# Install deps and build frontend
COPY frontend/package*.json ./
RUN npm ci || npm i --no-audit --no-fund
COPY frontend .
RUN npm run build

###############################################
# Backend runtime (Bun + Hono)
###############################################
FROM oven/bun:1
WORKDIR /app

# Install backend deps
COPY backend/package.json ./
RUN bun install --no-progress

# Copy backend source
COPY backend ./

# Copy built frontend into public dir to be served by Hono
COPY --from=frontend-build /app/frontend/dist ./public

EXPOSE 3000

CMD ["bun", "run", "src/index.ts"]


