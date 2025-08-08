FROM oven/bun:1 AS deps
WORKDIR /app/frontend
COPY frontend/bun.lock frontend/package.json ./
RUN bun install --frozen-lockfile

FROM oven/bun:1 AS build
WORKDIR /app/frontend
COPY --from=deps /app/frontend/node_modules ./node_modules
COPY frontend ./
ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL
RUN bun run build

FROM node:20-alpine AS runner
WORKDIR /app
COPY --from=build /app/frontend/dist ./dist
RUN npm i -g serve
EXPOSE 5173
CMD ["serve", "-s", "dist", "-l", "5173"]