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

  // Helper to remove any asterisks (*) or hash (#) symbols from output
  function cleanNoMarkdownSymbols(str: string): string {
    if (!str) return '';
    // Strip all * and # characters
    return str.replace(/[*#]/g, '').trim();
  }

  // Fallback Domain Expert Generator for NTRCA Madrasa Subjects
  function generateMadrasaResponse(prompt: string): string {
    const p = prompt.toLowerCase().trim();

    if (p.includes('তামরীন') || p.includes('tamreen')) {
      return `তামরীন একাডেমি (Tamreen Academy) হলো বাংলাদেশ মাদ্রাসা শিক্ষক নিবন্ধন (NTRCA) পরীক্ষার্থীদের জন্য একটি বিশেষায়িত অনলাইন লার্নিং ও পরীক্ষা প্রস্তুতি প্ল্যাটফর্ম।

মূল বৈশিষ্ট্যসমূহ:
১. আল-কুরআন, আল-হাদিস, ফিকহ, নাহু ও সরফ সহ সকল বিষয়ের বিষয়ভিত্তিক প্রশ্ন ব্যাংক।
২. রিয়েল-টাইম মডেল টেস্ট ও লাইভ নেগেটিভ মার্কিংযুক্ত পরীক্ষা ব্যবস্থা।
৩. উস্তাদ এআই (AI Tutor) থেকে যেকোনো কঠিন প্রশ্নের সহজ ও তাৎক্ষণিক সমাধান।
৪. লিখিত ও এমসিকিউ পরীক্ষার পূর্ণাঙ্গ ডিজিটাল গাইডলাইন।`;
    }

    if (p.includes('নাহু') || p.includes('সরফ') || p.includes('نحو') || p.includes('صرف') || p.includes('ব্যাকরণ')) {
      return `উস্তাদ এআই উত্তর (নাহু ও সরফ বিশ্লেষণ):

১. নাহু শাস্ত্র (علم النحو):
• সংজ্ঞা: যে শাখায় বাক্যে কালেমার শেষ বর্ণে এরাব পরিবর্তনের নিয়ম ও আমেল আলোচনা করা হয়।
• উদ্দেশ্য: বাক্যে এরাব ও তারকীবগত ভুল থেকে মুক্ত থাকা।
• মূল নীতি: আমেল + মামূল = এরাব (যেমন: جاءَ زَيْدٌ)।

২. সরফ শাস্ত্র (علم الصرف):
• সংজ্ঞা: যে শাখায় একটি শব্দমূল থেকে বিভিন্ন ওজন ও সিগাহ্ রূপান্তরের নিয়ম আলোচনা করা হয়।
• উদ্দেশ্য: সঠিক সিগাহ্ চেনা ও রূপান্তর শেখা।

নিবন্ধন টিপস:
১৭তম ও ১৮তম পরীক্ষায় ইছমে ফায়েল, ইছমে মাফউল ও তারকীবের এরাব থেকে প্রশ্ন থাকে।`;
    }

    if (p.includes('ফরায়েজ') || p.includes('আসাব') || p.includes('জবুল') || p.includes('ফারায়েজ')) {
      return `উস্তাদ এআই উত্তর (ইলমে ফরায়েজ ও উত্তরাধিকার বন্টন):

১. জবুল ফুরূজ (ذوو الفروض):
• কুরআন ও সুন্নাহয় যাদের নির্দিষ্ট অংশ (১/২, ১/৪, ১/৮, ২/৩, ১/৩, ১/৬) নির্ধারিত রয়েছে। এরা মোট ১২ জন।

২. আসাবা (عصبة):
• জবুল ফুরূজ অংশ নেওয়ার পর যে অবশিষ্ট সম্পত্তি থাকে, তারা তার সম্পূর্ণ অংশ লাভ করে।

নিবন্ধন টিপস:
পিতা ও মাতার প্রাপ্ত অংশের হার সংক্রান্ত প্রশ্ন নিয়মিত আসে।`;
    }

    if (p.includes('ফিকহ') || p.includes('সুন্নাহ') || p.includes('মাসআলা') || p.includes('অজু') || p.includes('নামাজ') || p.includes('সালাত')) {
      return `উস্তাদ এআই উত্তর (ফিকহ ও উসূলে ফিকহ পর্যালোচনা):

১. ফিকহুস সুন্নাহ্:
• মূল উৎস ৪টি: ১. কুরআন, ২. হাদিস, ৩. ইজমা, ৪. কিয়াস।

২. অজুর ফারায়েজ:
• অজুর ফরজ ৪টি: মুখমন্ডল ধোয়া, কনুইসহ হাত ধোয়া, মাথার চারভাগের একভাগ মাসেহ করা, টাখনুসহ পা ধোয়া।

নিবন্ধন টিপস:
সহকারী শিক্ষক (আরবি) পদের ফিকহ অংশ অত্যন্ত গুরুত্বপূর্ণ।`;
    }

    if (p.includes('নম্বর') || p.includes('মান বণ্টন') || p.includes('মানবণ্টন') || p.includes('সিলেবাস')) {
      return `NTRCA মাদ্রাসা নিবন্ধন পরীক্ষার মানবণ্টন:

১. প্রিলিমিনারি পরীক্ষা (১০০ নম্বর):
• বাংলা: ২৫ নম্বর
• ইংরেজি: ২৫ নম্বর
• সাধারণ গণিত: ২৫ নম্বর
• সাধারণ জ্ঞান: ২৫ নম্বর

২. লিখিত পরীক্ষা (১০০ নম্বর):
• স্ব-স্ব বিষয়ভিত্তিক (যেমন: আরবি, হাদিস, ফিকহ) ১০০ নম্বরের লিখিত পরীক্ষা।

৩. মৌখিক পরীক্ষা (viva): ২০ নম্বর।`;
    }

    if (p.includes('আসসালামু') || p.includes('সালাম') || p.includes('হ্যালো') || p.includes('hi') || p.includes('hello')) {
      return `ওয়া আলাইকুমুস সালাম ওয়ারাহমাতুল্লাহ! আমি উস্তাদ এআই। মাদ্রাসা শিক্ষক নিবন্ধন (NTRCA) পরীক্ষার যেকোনো প্রশ্ন, আরবি ব্যাকরণ, ফিকহ বা প্রস্তুতি সংক্রান্ত সাহায্য করতে পারি। বলুন, কীভাবে সাহায্য করতে পারি?`;
    }

    return `উস্তাদ এআই উত্তর:

আপনার প্রশ্ন: "${prompt}"

সংক্ষিপ্ত ব্যাখ্যা ও তথ্য:
১. এই প্রশ্নটি মাদ্রাসা শিক্ষক নিবন্ধন (NTRCA) পরীক্ষা বা ইসলামিক স্টাডিজ সংক্রান্ত।
২. সঠিক সমাধানের জন্য সুনির্দিষ্ট বিষয়ে বিস্তারিত লিখে প্রশ্ন করতে পারেন।
৩. নাহু, সরফ, ফিকহ বা যেকোনো মাসআলার ব্যাখ্যার জন্য বিষয় উল্লেখ করুন।`;
  }

  // API Health Check Endpoint
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", hasApiKey: Boolean(process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== "MY_GEMINI_API_KEY") });
  });

  // Ustad AI Chat Endpoint
  app.post("/api/ustad-ai", async (req, res) => {
    try {
      let prompt = req.body.prompt;
      if (!prompt && req.body.questionData) {
        const q = req.body.questionData;
        prompt = `প্রশ্ন: ${q.question}\nঅপশনসমূহ: ${q.options ? q.options.join(', ') : ''}\nসঠিক উত্তর: ${q.options && q.correctAnswer !== undefined ? q.options[q.correctAnswer] : ''}\nবিষয়: ${q.subject || ''}\nএই প্রশ্নটির সহজ ও সংক্ষিপ্ত ব্যাখ্যা প্রদান করুন।`;
      }

      if (!prompt || typeof prompt !== "string") {
        return res.status(400).json({ error: "প্রশ্ন প্রদান করা হয়নি।" });
      }

      const ai = getAi();

      if (ai) {
        try {
          const systemInstruction = `আপনি "তামরীন উস্তাদ AI" (Tamreen Ustad AI) - আরবি, বাংলা ও ইংরেজি শিক্ষা এবং মাদ্রাসা শিক্ষক নিবন্ধন (NTRCA) পরীক্ষার বিশেষজ্ঞ গৃহশিক্ষক।
কঠোর নিয়মাবলী:
১. ব্যবহারকারীর সুনির্দিষ্ট প্রশ্নের উপর ভিত্তি করে সরাসরি ও নির্ভুল উত্তর দিন। আরবি, বাংলা ও ইংরেজির যেকোনো প্রশ্নের স্পষ্ট সমাধান দিন।
২. উত্তর স্বাভাবিকভাবে সংক্ষেপে, মূল পয়েন্টে ও বুলেট পয়েন্টে লিখুন। কোনো অপ্রয়োজনীয় লম্বা বর্ণনা দিবেন না। শুধুমাত্র যদি ব্যবহারকারী নিজে বিস্তারিত ব্যাখ্যা চায়, তখন বিস্তারিত আলোচনা করবেন।
৩. উত্তর তৈরিতে কখনোই স্টার চিহ্ন (*) বা হ্যাশ চিহ্ন (#) বা মার্কডাউন হেডিং চিহ্ন ব্যবহার করবেন না।
৪. তালিকা বা পয়েন্টের জন্য নম্বর (১. ২. ৩.) বা বুলেট চিহ্ন (•) ব্যবহার করুন।
৫. আরবি শব্দ বা বাক্য থাকলে স্পষ্ট হরকতসহ আরবি হরফে লিখুন।`;

          const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
              systemInstruction,
              temperature: 0.4,
            },
          });

          if (response && response.text) {
            const cleanedText = cleanNoMarkdownSymbols(response.text);
            return res.json({ text: cleanedText });
          }
        } catch (geminiError) {
          console.error("Gemini API call error, falling back to Madrasa expert system:", geminiError);
        }
      }

      // Fallback domain response if Gemini key is missing or call failed
      const fallbackText = cleanNoMarkdownSymbols(generateMadrasaResponse(prompt));
      return res.json({ text: fallbackText });

    } catch (err: any) {
      console.error("Error in Ustad AI handler:", err);
      const prompt = req.body?.prompt || "";
      const safeText = cleanNoMarkdownSymbols(generateMadrasaResponse(prompt));
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
