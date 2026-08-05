import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import ustadAiHandler from "./api/ustad-ai";

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Permissive CORS & Cache middleware for Mobile Cellular (3G/4G/5G), Wi-Fi, and WebViews
  app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Requested-With, Cache-Control");
    res.setHeader("Keep-Alive", "timeout=15, max=100");
    if (req.method === "OPTIONS") {
      return res.sendStatus(200);
    }
    next();
  });

  app.use(express.json({ limit: "10mb" }));

  // API Health Check Endpoint
  app.get("/api/health", (req, res) => {
    res.json({
      status: "ok",
      hasApiKey: Boolean(process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== "MY_GEMINI_API_KEY")
    });
  });

  // Real Gemini AI Chat Endpoints
  app.post("/api/ustad-ai", ustadAiHandler);
  app.post("/api/chat", ustadAiHandler);

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
