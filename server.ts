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
        return null;
      }
      aiClient = new GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          },
        },
      });
    }
    return aiClient;
  }

  // Fallback Domain Expert Generator for NTRCA Madrasa Subjects
  function generateMadrasaResponse(prompt: string): string {
    const p = prompt.toLowerCase();

    if (p.includes('নাহু') || p.includes('সরফ') || p.includes('نحو') || p.includes('صرف') || p.includes('ব্যাকরণ')) {
      return `✨ **উস্তাদ এআই উত্তর (নাহু ও সরফ বিশ্লেষণ):**

১. **নাহু শাস্ত্র (علم النحو):**
   - **সংজ্ঞা:** আরবি ব্যাকরণের যে শাখায় বাক্যে কালেমার (শব্দ) শেষ বর্ণে 'এরাব' (إعراب - যেমন পেশ, জের, জবর) পরিবর্তনের নিয়ম ও আমেল (عامل) আলোচনা করা হয়।
   - **উদ্দেশ্য:** বাক্যে এরোব ও তারকীবগত ভুল থেকে জিহ্বাকে রক্ষা করা।
   - **মূল নীতি:** عامل + معمول = إعراب (যেমন: جاءَ زَيْدٌ)।

২. **সরফ শাস্ত্র (علم الصرف):**
   - **সংজ্ঞা:** যে শাখায় একটি শব্দমূল (مادة) থেকে বিভিন্ন ওজন (وزن) ও বহেছে রূপান্তরের রূপ আলোচনা করা হয়।
   - **উদ্দেশ্য:** সঠিক সিগাহ্ (صيغة) চেনা ও রূপান্তর শেখা।

📌 **NTRCA নিবন্ধনের গুরুত্বপূর্ণ টিপস:**
১৭তম ও ১৮তম নিবন্ধন পরীক্ষায় সাধারণতঃ *ইছমে ফায়েল*, *ইছমে মাফউল*, *বাব ও আবওয়াবের পরিচয়* এবং *তারকীবের এরাব* থেকে ৩-৪টি প্রশ্ন নিশ্চিত থাকে।`;
    }

    if (p.includes('ফরায়েজ') || p.includes('আসাব') || p.includes('জবুল') || p.includes('ফারায়েজ')) {
      return `✨ **উস্তাদ এআই উত্তর (ইলমে ফরায়েজ ও উত্তরাধিকার বন্টন):**

১. **জবুল ফুরূজ (ذوو الفروض):**
   - কুরআন ও সুন্নাহয় যাদের নির্দিষ্ট অংশ (১/২, ১/৪, ১/৮, ২/৩, ১/৩, ১/৬) নির্ধারিত রয়েছে। এরা মোট ১২ জন (৪ জন পুরুষ ও ৮ জন নারী)।

২. **আসাবা (عصبة):**
   - জবুল ফুরূজ অংশ নেওয়ার পর যে অবশিষ্ট সম্পত্তি থাকে, তারা তার সম্পূর্ণ অংশ লাভ করে।
   - **আসাবা বিন নাফস (عصبة بالنفس):** যেমন: সন্তান, ভাই, পিতা, চাচা।

📌 **নিবন্ধন পরীক্ষার টেকনিক:**
পরীক্ষায় সাধারণতঃ পিতা ও মাতার বিভিন্ন অবস্থায় প্রাপ্ত অংশের হার (যেমন: সন্তান থাকলে ১/৬) সরাসরি জানতে চাওয়া হয়।`;
    }

    if (p.includes('ফিকহ') || p.includes('সুন্নাহ') || p.includes('মাসআলা') || p.includes('অজু') || p.includes('নামাজ')) {
      return `✨ **উস্তাদ এআই উত্তর (ফিকহ ও উসূলে ফিকহ পর্যালোচনা):**

১. **ফিকহুস সুন্নাহ্ (ফিকহের সারসংক্ষেপ):**
   - ইসলামী শরীয়তের প্রয়োগিক বিধানাবলি দলীলাদিসহ জানা হলো ফিকহ।
   - মূল উৎস ৪টি: **১. কুরআন**, **২. হাদিস**, **৩. ইজমা (الإجماع)**, **৪. কিয়াস (القياس)**।

২. **পবিত্রতা ও অজুর ফারায়েজ:**
   - অজুর ফরজ ৪টি: মুখমন্ডল ধোয়া, কনুইসহ হাত ধোয়া, মাথার চারভাগের একভাগ মাসেহ করা, টাখনুসহ পা ধোয়া।

📌 **NTRCA স্পেশাল নির্দেশিকা:**
সহকারী শিক্ষক (আরবি) ও সহকারী মৌলভী পদে ফিকহ ও উসূলে ফিকহ অংশে ১০-১৫ নম্বর নির্ধারিত থাকে।`;
    }

    return `✨ **উস্তাদ এআই উত্তর (মাদ্রাসা নিবন্ধন প্রস্তুতি গাইড):**

আপনার প্রশ্নটি পাওয়া গিয়েছে: "${prompt}"

📚 **NTRCA মাদ্রাসা শিক্ষক নিবন্ধনের গুরুত্বপূর্ণ পয়েন্ট:**
১. **আরবি বিষয় (৫০ নম্বর):** আল-কুরআন, আল-হাদিস, আরবি সাহিত্য, নাহু-সরফ ও ফিকহ।
২. **সাধারণ বিষয় (৫০ নম্বর):** বাংলা, ইংরেজি, সাধারণ গণিত ও বাংলাদেশ/আন্তর্জাতিক বিষয়াবলী।

💡 **উস্তাদ এআই পরামর্শ:**
তামরীন একাডেমির **মডেল টেস্ট** ও **কোর্স লেকচার** মডিউল অনুসরণ করুন। আপনার সুনির্দিষ্ট প্রশ্ন বা যেকোনো আয়াত/হাদিসের ব্যাখ্যা জানা থাকলে পুনরায় টাইপ করুন!`;
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

      if (ai) {
        try {
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

          if (response && response.text) {
            return res.json({ text: response.text });
          }
        } catch (geminiError) {
          console.error("Gemini API call error, falling back to Madrasa expert system:", geminiError);
        }
      }

      // Fallback domain response if Gemini key is missing or call failed
      const fallbackText = generateMadrasaResponse(prompt);
      return res.json({ text: fallbackText });

    } catch (err: any) {
      console.error("Error in Ustad AI handler:", err);
      // Even on general error, return a friendly helpful response
      const safeText = generateMadrasaResponse(req.body?.prompt || "");
      return res.json({ text: safeText });
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
