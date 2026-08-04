import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Lazy initialization for Google Gen AI client
  let aiClient: GoogleGenAI | null = null;
  function getAi() {
    if (!aiClient) {
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey || apiKey === "MY_GEMINI_API_KEY") {
        throw new Error("GEMINI_API_KEY সেট করা নেই। AI Studio সেটিংস থেকে Gemini API Key যুক্ত করুন।");
      }
      aiClient = new GoogleGenAI({ apiKey });
    }
    return aiClient;
  }

  // API Health Check Endpoint
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", hasApiKey: Boolean(process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== "MY_GEMINI_API_KEY") });
  });

  // Ustad AI Chat Endpoint
  app.post("/api/ustad-ai", async (req, res) => {
    try {
      const { prompt } = req.body;
      if (!prompt || typeof prompt !== "string") {
        return res.status(400).json({ error: "প্রশ্ন প্রদান করা হয়নি।" });
      }

      const ai = getAi();
      
      const systemInstruction = `আপনি "উস্তাদ এআই" (Ustad AI) - বাংলাদেশ মাদ্রাসা শিক্ষক নিবন্ধন (NTRCA) পরীক্ষার বিশেষজ্ঞ গৃহশিক্ষক ও সহায়ক।
আপনার কাজ হলো পরীক্ষার্থীদের সহকারী শিক্ষক (আরবি), প্রভাষক (হাদিস/ফিকহ/আদব), সহকারী মৌলভী ও ইবতেদায়ী পদের নিবন্ধন পরীক্ষার জন্য সাহায্য করা।
পরামর্শের নিয়মাবলী:
১. উত্তর প্রদান করুন স্পষ্ট, গঠনমূলক ও শুদ্ধ বাংলায়। আরবি শব্দ বা আয়াত/হাদিস থাকলে স্পষ্ট হরকত সহ আরবি হরফে লিখুন।
২. নাহু (আরবি ব্যাকরণ), সরফ (শব্দরূপ), ফিকহ, হাদীস, তাফসীর, বালাগাত-ফাসাহাত এবং বাংলা ও ইংরেজি ব্যাকরণের সঠিক উত্তর দিন।
৩. উত্তর সুন্দর ইমোজি, বুলেট পয়েন্ট ও স্পষ্ট কাঠামোতে সাজিয়ে দিন।
৪. উত্তর সংক্ষিপ্ত কিন্তু সম্পূর্ণ রাখুন।`;

      const response = await ai.models.generateContent({
        model: "gemini-3.6-flash",
        contents: prompt,
        config: {
          systemInstruction,
          temperature: 0.7,
        },
      });

      const responseText = response.text || "দুঃখিত, কোনো উত্তর উৎপন্ন করা যায়নি।";
      return res.json({ text: responseText });
    } catch (err: any) {
      console.error("Error in Ustad AI handler:", err);
      const errorMessage = err?.message || "এআই সার্ভিস চালনায় সমস্যা হয়েছে।";
      return res.status(500).json({ 
        error: `উস্তাদ এআই উত্তর দিতে পারছে না: ${errorMessage}` 
      });
    }
  });

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
