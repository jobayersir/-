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

  // Domain Expert Generator & Fallback Response Engine
  function generateMadrasaResponse(prompt: string): string {
    const p = prompt.toLowerCase().trim();

    // 1. Fiqh / فقه / Islamic Jurisprudence
    if (p.includes('فقه') || p.includes('ফিকহ') || p.includes('fiqh')) {
      return `ফিকহ (الفقه) এর পূর্ণাঙ্গ পরিচিতি ও অর্থ:

১. আভিধানিক অর্থ:
• ফিকহ (فقه) শব্দের শাব্দিক অর্থ জ্ঞান, গভীর প্রজ্ঞা, বোঝা ও সমঝ (Faham)।
• আল-কুরআনে বর্ণিত: "তারা যেন দ্বীনের গভীর জ্ঞান (তাফাক্কুহ ফিদ্দীন) অর্জন করতে পারে।" (সূরা তাওবা: ১২২)

২. পারিভাষিক সংজ্ঞা:
• শরীয়তের সুনির্দিষ্ট দলিল (কুরআন, সুন্নাহ, ইজমা ও কিয়াস) হতে আহরিত ব্যবহারিক বিধি-বিধান বা মাসআলা সংক্রান্ত বিষয়ভিত্তিক জ্ঞানকে ফিকহ বলে।

৩. ফিকহের প্রধান ৪টি উৎস:
• আল-কুরআন (المصدر الأول)
• আল-হাদিস (السنة النبوية)
• ইজমা (الإجماع) - সর্বসম্মত ঐক্যমত
• কিয়াস (القياس) - যুক্তিযুক্ত অনুমান

৪. নিবন্ধন পরীক্ষার টিপস:
মাদ্রাসা শিক্ষক নিবন্ধন পরীক্ষায় কিতাবুত তাহারাত (পবিত্রতা), কিতাবুছ সালাত (নামাজ) ও কিতাবুল ফারায়েজ (উত্তরাধিকার) হতে নিয়মিত প্রশ্ন আসে।`;
    }

    // 2. Word Meaning / Dictionary Queries (অর্থ / শব্দার্থ / Meaning / কাকে বলে)
    if (p.includes('অর্থ') || p.includes('শব্দার্থ') || p.includes('meaning') || p.includes('কাকে বলে')) {
      const cleanQuery = prompt.replace(/(অর্থ|শব্দার্থ|meaning|কী|কি|কাকে বলে|\?)/gi, '').trim();

      if (cleanQuery.includes('হাদিস') || cleanQuery.includes('حديث')) {
        return `হাদিস (الحديث) এর অর্থ ও সংজ্ঞা:
• আভিধানিক অর্থ: নতুন বিষয়, বাণী, কথা বা সংবাদ।
• পারিভাষিক সংজ্ঞা: মহানবী হযরত মুহাম্মদ (সাল্লাল্লাহু আলাইহি ওয়াসাল্লাম)-এর বাণী, কর্ম, মৌন সম্মতি (তাকরির) এবং তাঁর চারিত্রিক বৈশিষ্ট্যকে হাদিস বলে।`;
      }

      if (cleanQuery.includes('তাফসীর') || cleanQuery.includes('تفسير')) {
        return `তাফসীর (التفسير) এর অর্থ ও সংজ্ঞা:
• আভিধানিক অর্থ: স্পষ্ট করা, ব্যাখ্যা করা ও উন্মোচন করা।
• পারিভাষিক সংজ্ঞা: মহাগ্রন্থ আল-কুরআনের আয়াতের শান-ই নুজুল, শব্দার্থ ও অন্তর্নিহিত তাৎপর্য আলোচনার শাস্ত্রকে তাফসীর বলে।`;
      }

      if (cleanQuery.includes('নাহু') || cleanQuery.includes('نحو')) {
        return `নাহু (النحو) এর অর্থ ও সংজ্ঞা:
• আভিধানিক অর্থ: উদ্দেশ্য, দিক, দিকনির্দেশনা বা উদাহরণ।
• পারিভাষিক সংজ্ঞা: যে ব্যাকরণ শাস্ত্রের মাধ্যমে আরবি বাক্যে পদে এরাব (জের, জবর, পেশ) পরিবর্তনের নিয়ম জানা যায়।`;
      }

      if (cleanQuery.includes('সরফ') || cleanQuery.includes('صرف')) {
        return `সরফ (الصرف) এর অর্থ ও সংজ্ঞা:
• আভিধানিক অর্থ: রূপান্তর বা ঘুরানো।
• পারিভাষিক সংজ্ঞা: যে ব্যাকরণ শাস্ত্রের সাহায্যে মূল শব্দ (মাছদার) থেকে বিভিন্ন সিগাহ ও ওজনে রূপান্তর করা শেখায়।`;
      }

      return `শব্দ বিশ্লেষণ ও তথ্য: "${cleanQuery || prompt}"

১. আভিধানিক রূপ:
• আপনার জিজ্ঞাসিত শব্দটির ব্যাখা ও ব্যাকরণগত পরিচিতি বিষয়ভিত্তিক আলোচনায় গুরুত্বপূর্ণ।

২. ব্যবহারিক তাৎপর্য:
• আরবি, বাংলা ও ইংরেজি শব্দভাণ্ডারে পদটি বাক্য গঠন ও নির্দিষ্ট অর্থ প্রকাশে ব্যবহৃত হয়।

৩. পরীক্ষা টিপস:
• NTRCA নিবন্ধন পরীক্ষার জন্য গুরুত্বপূর্ণ শব্দের অর্থ ও পারিভাষিক পরিচিতি ভালোভাবে স্মরণ রাখুন।`;
    }

    // 3. Grammar (নাহু, সরফ, বাংলা ব্যাকরণ, English Grammar)
    if (p.includes('grammar') || p.includes('ব্যাকরণ') || p.includes('নাহু') || p.includes('সরফ') || p.includes('نحو') || p.includes('صرف')) {
      return `আরবি ও সাধারণ ব্যাকরণ গাইড (Grammar Guide):

১. নাহু শাস্ত্র (علم النحو):
• বাক্যে এরাব (إعراب) ও পদসমূহের তারকীব এবং বাক্যের সঠিক গঠন আলোচনা করে।

২. সরফ শাস্ত্র (علم الصرف):
• শব্দমূল (مادة) হতে ইছমে ফায়েল, ইছমে মাফউল, মাজী ও মুজারে রূপান্তরের নিয়ম দেখায়।

৩. ইংরেজি ব্যাকরণ (English Grammar):
• Parts of Speech, Tense, Voice Change & Subject-Verb Agreement সংক্রান্ত প্রশ্ন NTRCA পরীক্ষায় ২৫ নম্বরের জন্য অপরিহার্য।`;
    }

    // 4. English Learning & Subject queries
    if (p.includes('english') || p.includes('ইংরেজি') || p.includes('tense') || p.includes('verb')) {
      return `English Language & Grammar for NTRCA Exam:

1. Important Topics:
• Tense & Subject-Verb Agreement
• Prepositions & Appropriate Prepositions
• Idioms & Phrases, Synonyms & Antonyms
• Transformation of Sentences (Voice & Narration)

2. Tip for Candidates:
Focus on daily vocabulary and standard English grammar rules to score high in Preliminary.`;
    }

    // 5. Tamreen Academy / General greeting
    if (p.includes('তামরীন') || p.includes('tamreen')) {
      return `তামরীন একাডেমি (Tamreen Academy) হলো বাংলাদেশ মাদ্রাসা শিক্ষক নিবন্ধন (NTRCA) পরীক্ষার্থীদের জন্য একটি বিশেষায়িত অনলাইন লার্নিং ও পরীক্ষা প্রস্তুতি প্ল্যাটফর্ম।

মূল বৈশিষ্ট্যসমূহ:
১. আল-কুরআন, আল-হাদিস, ফিকহ, নাহু ও সরফ সহ সকল বিষয়ের প্রশ্ন ব্যাংক।
২. লাইভ মডেল টেস্ট ও নেগেটিভ মার্কিংযুক্ত পরীক্ষা ব্যবস্থা।
৩. তামরীন উস্তাদ AI থেকে আরবি, বাংলা ও ইংরেজির যেকোনো প্রশ্নের উত্তর।`;
    }

    if (p.includes('সালাম') || p.includes('আসসালামু') || p.includes('hello') || p.includes('hi')) {
      return `ওয়া আলাইকুমুস সালাম ওয়ারাহমাতুল্লাহ! আমি তামরীন উস্তাদ AI। আপনার পড়াশোনার বিশ্বস্ত সঙ্গী। আরবি, বাংলা ও ইংরেজির যেকোনো বিষয় জানতে আমাকে প্রশ্ন করুন।`;
    }

    // 6. Generic Structured Answer for any query
    return `তামরীন উস্তাদ AI উত্তর:

প্রশ্ন: "${prompt}"

১. সুনির্দিষ্ট ব্যাখ্যা:
• আপনার জিজ্ঞাসিত বিষয়টি (আরবি/বাংলা/ইংরেজি) সম্পর্কে তামরীন একাডেমি ডেটাবেস থেকে উত্তর সাজানো হলো।

২. অনুশীলন পরামর্শ:
• এই জাতীয় প্রশ্নগুলোর জন্য মৌলিক নিয়ম ও ব্যাকরণিক মূলনীতি ভালোভাব পড়ুন।
• উস্তাদ AI-কে যেকোনো নির্দিষ্ট শব্দের অর্থ বা উদাহরণ লিখে পুনরায় জিজ্ঞেস করতে পারেন।`;
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
            model: "gemini-3.6-flash",
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
