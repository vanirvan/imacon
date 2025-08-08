FROM oven/bun:1
WORKDIR /app

# Install backend deps
COPY backend/package.json ./
RUN bun install --no-progress

# Copy backend source
COPY backend ./

EXPOSE 3000

CMD ["bun", "run", "src/index.ts"]
