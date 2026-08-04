import { GoogleGenAI } from "@google/genai";

export async function processGeminiRequest(reqBody: any) {
  const { prompt, image, history, questionData, action, userAnswer } = reqBody || {};

  let userPrompt = prompt;

  // Handle CQ evaluation request
  if (action === 'evaluate_cq') {
    const title = questionData?.title || 'প্রশ্ন';
    const marks = questionData?.marks || 10;
    userPrompt = `লিখিত প্রশ্নের নাম: ${title} (পূর্ণমান: ${marks})\nপরীক্ষার্থীর লিখিত উত্তর:\n${userAnswer}\n\nউপরের উত্তরটির একটি গঠনমূলক মূল্যায়ন দিন। কত নম্বর পাওয়া উচিত এবং কী কী পয়েন্ট উন্নত করা প্রয়োজন তা ১. ২. ৩. নম্বর পয়েন্ট আকারে লিখুন।`;
  } else if (!userPrompt && questionData) {
    const q = questionData;
    userPrompt = `প্রশ্ন: ${q.question}\nঅপশনসমূহ: ${q.options ? q.options.join(', ') : ''}\nসঠিক উত্তর: ${q.options && q.correctAnswer !== undefined ? q.options[q.correctAnswer] : ''}\nবিষয়: ${q.subject || ''}\nএই প্রশ্নটির সহজ ও সংক্ষিপ্ত ব্যাখ্যা প্রদান করুন।`;
  }

  if (!userPrompt || typeof userPrompt !== "string" || !userPrompt.trim()) {
    throw new Error("অনুগ্রহ করে একটি প্রশ্ন লিখুন।");
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === "MY_GEMINI_API_KEY") {
    throw new Error("GEMINI_API_KEY পরিবেশ ভেরিয়েবলে অনুপস্থিত। AI Studio বা Vercel পরিবেশের Settings > Secrets প্যানেল থেকে GEMINI_API_KEY কনফিগার করুন।");
  }

  const ai = new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });

  const systemInstruction = `আপনি "তামরীন উস্তাদ AI" (Tamreen Ustad AI) - বাংলা, আরবি ও ইংরেজি ভাষার শিক্ষাক্রম, সাধারণ জ্ঞান এবং মাদ্রাসা শিক্ষক নিবন্ধন (NTRCA) পরীক্ষার বিশেষজ্ঞ AI গৃহশিক্ষক।

কঠোর নির্দেশনাাবলী:
১. ব্যবহারকারীর সুনির্দিষ্ট প্রশ্নের সরাসরি, নির্ভুল ও পূর্ণাঙ্গ উত্তর প্রদান করুন।
২. আপনি বাংলা, আরবি ও ইংরেজি—এই তিনটি ভাষায় সমানভাবে পারদর্শী। ব্যবহারকারী যে ভাষায় প্রশ্ন করবেন, সেই ভাষায় পরিষ্কার ও প্রাঞ্জলভাবে উত্তর দিন।
৩. উত্তর স্বাভাবিকভাবে সংক্ষেপে, মূল পয়েন্টে ও বুলেট পয়েন্টে লিখুন।
৪. উত্তর তৈরিতে কখনোই স্টার চিহ্ন (*) বা হ্যাশ চিহ্ন (#) বা মার্কডাউন হেডিং চিহ্ন ব্যবহার করবেন না।
৫. তালিকা বা পয়েন্টের জন্য নম্বর (১. ২. ৩.) বা বুলেট চিহ্ন (•) ব্যবহার করুন।
৬. আরবি শব্দ, বাক্য বা আয়াতে স্পষ্ট হরকতসহ (জের, জবর, পেশ) আরবি হরফে লিখুন।`;

  // Build contents array with multi-turn chat history
  const contents: any[] = [];

  if (Array.isArray(history)) {
    for (const msg of history) {
      if (msg.text && (msg.role === 'user' || msg.role === 'model')) {
        contents.push({
          role: msg.role,
          parts: [{ text: msg.text }],
        });
      }
    }
  }

  // Construct current turn parts (support image attachment + text)
  const currentParts: any[] = [];

  if (image && typeof image === 'string' && image.includes('base64,')) {
    const parts = image.split('base64,');
    const mimeMatch = image.match(/data:(.*?);base64/);
    const mimeType = mimeMatch ? mimeMatch[1] : 'image/jpeg';
    const base64Data = parts[1];
    currentParts.push({
      inlineData: {
        mimeType,
        data: base64Data,
      },
    });
  }

  currentParts.push({ text: userPrompt });

  contents.push({
    role: 'user',
    parts: currentParts,
  });

  const response = await ai.models.generateContent({
    model: "gemini-3.6-flash",
    contents,
    config: {
      systemInstruction,
      temperature: 0.5,
    },
  });

  if (response && response.text) {
    // Strip markdown symbols (* or #)
    const cleanText = response.text.replace(/[*#]/g, '').trim();
    return cleanText;
  } else {
    throw new Error("Gemini API থেকে কোনো উত্তর পাওয়া যায়নি।");
  }
}

// Default handler for Vercel serverless function & Express route
export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const text = await processGeminiRequest(req.body);
    return res.json({ text });
  } catch (error: any) {
    console.error("Ustad AI Handler Error:", error);
    return res.status(500).json({ error: error?.message || "AI সার্ভারে সমস্যা দেখা দিয়েছে।" });
  }
}
