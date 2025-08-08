import { Hono } from "hono";
import { serveStatic } from "hono/bun";

const app = new Hono();

// Serve static assets from ./public (built frontend)
app.use("/assets/*", serveStatic({ root: "./public" }));
app.use("/favicon.ico", serveStatic({ path: "./public/favicon.ico" }));

// SPA fallback: always return index.html for non-file routes
app.get("*", serveStatic({ path: "./public/index.html" }));

// Bun: export default object with fetch handler to auto-start server
export default {
  fetch: app.fetch,
  port: 3000,
};
