## Imacon — Image Extension Formatter

Imacon is a simple, fast image format converter. Convert images between JPG, PNG, and WebP (and back) with a clean UI. Built with React (SWC) on the frontend and Hono running on Bun for the backend.

### Features

- Convert between common formats: JPG ↔ PNG ↔ WebP
- Batch-select multiple images
- Preserve image dimensions
- Lightweight UI powered by React + Vite (SWC)

### Tech Stack

- Frontend: React 19, TypeScript, Vite, `@vitejs/plugin-react-swc`
- Backend: Hono on Bun

### Repository Structure

```
imacon/
  backend/   # Hono app on Bun
  frontend/  # React + Vite (SWC)
```

### Prerequisites

- Node.js 18+ (for the frontend)
- Bun (for the backend). Install from `https://bun.sh`.

### Getting Started

1. Install dependencies

```
cd frontend
npm install

cd ../backend
bun install
```

2. Run in development

- Backend (Hono on Bun):

```
cd backend
bun run dev
# default: http://localhost:3000
```

- Frontend (Vite + React):

```
cd frontend
npm run dev
# default: http://localhost:5173
```

Open the frontend in your browser. Configure the frontend to call the backend if/when server-side conversion is used.

### Build

- Frontend:

```
cd frontend
npm run build
```

### Scripts Reference

- Frontend (`frontend/package.json`):

  - `dev`: start Vite dev server
  - `build`: type-check then build
  - `preview`: preview production build

- Backend (`backend/package.json`):
  - `dev`: run Hono app with Bun hot reload

### API

The backend is initialized with Hono. Default route:

- `GET /` → plain text response (health check / hello)

Image conversion endpoints can be added here if you choose server-side processing. Client-side conversion (via Canvas/Web APIs) is also supported depending on the implementation.

### Roadmap

- Optional server-side conversion (streaming, large files)
- Drag-and-drop UI polish and batch progress
- Quality/compression controls per format

### License

MIT

### Self-Hosting with Docker

Prerequisites:

- Docker and Docker Compose installed

Build and run with Compose:

```
docker compose up -d --build
```

Services:

- Single container: app available at `http://localhost:3001` (Hono serves built frontend + API on one port)

Notes:

- The frontend is built during the image build and copied into `backend/public`.
- Hono serves static assets and an SPA fallback. If you add API routes (e.g. `/api/*`), define them above the SPA fallback in `backend/src/index.ts`.

Stop and remove containers:

```
docker compose down
```
