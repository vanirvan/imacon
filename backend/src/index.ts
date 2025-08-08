import { Hono } from "hono";
import { serveStatic } from "hono/bun";
import sharp from "sharp";
import { cors } from "hono/cors";
import { logger } from "hono/logger";

const app = new Hono();

app.use("*", cors());
app.use("*", logger());

// Serve static assets from ./public (built frontend)
app.use("/assets/*", serveStatic({ root: "./public" }));
app.use("/favicon.ico", serveStatic({ path: "./public/favicon.ico" }));

// SPA fallback: always return index.html for non-file routes
app.get("*", serveStatic({ path: "./public/index.html" }));

app.post("/api/convert-images", async (c) => {
  try {
    const form = await c.req.formData();
    const targetFormat = form.get("format");
    const fileEntries = form.getAll("files");

    if (typeof targetFormat !== "string") {
      return c.json({ error: "Missing or invalid 'format'" }, 400);
    }

    const allowedFormats = new Set([
      "png",
      "jpeg",
      "webp",
      "avif",
      "tiff",
      "gif",
    ]);

    if (!allowedFormats.has(targetFormat)) {
      return c.json(
        {
          error:
            "Unsupported format. Supported formats: png, jpeg, webp, avif, tiff, gif",
        },
        400
      );
    }

    const files: File[] = fileEntries.filter(
      (f): f is File =>
        typeof f === "object" && f !== null && "arrayBuffer" in f
    );

    if (files.length === 0) {
      return c.json({ error: "No files uploaded under field 'files'" }, 400);
    }

    const outputs = await Promise.all(
      files.map(async (file) => {
        const inputBuffer = Buffer.from(await file.arrayBuffer());
        let pipeline = sharp(inputBuffer, { unlimited: true });

        switch (targetFormat) {
          case "png":
            pipeline = pipeline.png();
            break;
          case "jpeg":
            pipeline = pipeline.jpeg();
            break;
          case "webp":
            pipeline = pipeline.webp();
            break;
          case "avif":
            pipeline = pipeline.avif();
            break;
          case "tiff":
            pipeline = pipeline.tiff();
            break;
          case "gif":
            pipeline = pipeline.gif();
            break;
        }

        const outputBuffer = await pipeline.toBuffer();

        const baseName = file.name.replace(/\.[^.]+$/i, "");
        const ext = targetFormat === "jpeg" ? "jpg" : targetFormat;
        const mimeMap: Record<string, string> = {
          png: "image/png",
          jpeg: "image/jpeg",
          jpg: "image/jpeg",
          webp: "image/webp",
          avif: "image/avif",
          tiff: "image/tiff",
          gif: "image/gif",
        };

        const mime = mimeMap[ext] ?? "application/octet-stream";
        const dataUrl = `data:${mime};base64,${outputBuffer.toString(
          "base64"
        )}`;

        return {
          name: `${baseName}.${ext}`,
          mime,
          size: outputBuffer.length,
          dataUrl,
        };
      })
    );

    return c.json({ files: outputs });
  } catch (err) {
    console.error(err);
    return c.json({ error: "Failed to convert images" }, 500);
  }
});

// Bun: export default object with fetch handler to auto-start server
export default {
  fetch: app.fetch,
  port: 3000,
};
