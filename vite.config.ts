import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig, Plugin } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

function expressApiPlugin(): Plugin {
  return {
    name: 'express-api-plugin',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (req.url === '/api/ustad-ai' && req.method === 'POST') {
          let bodyStr = '';
          req.on('data', chunk => {
            bodyStr += chunk;
          });

          req.on('end', async () => {
            try {
              const body = JSON.parse(bodyStr || '{}');
              const { action, prompt, systemPrompt, questionData, userAnswer } = body;

              const apiKey = process.env.GEMINI_API_KEY;
              if (!apiKey) {
                res.statusCode = 500;
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({
                  error: 'GEMINI_API_KEY পাওয়া যায়নি। অনুগ্রহ করে Secrets প্যানেলে এপিআই কি সেট করুন।'
                }));
                return;
              }

              const ai = new GoogleGenAI({
                apiKey: apiKey,
                httpOptions: {
                  headers: {
                    'User-Agent': 'aistudio-build',
                  },
                },
              });

              let instruction = "আপনি 'উস্তাদ এআই' (Ustad AI) - বাংলাদেশ মাদ্রাসা শিক্ষক নিবন্ধন (NTRCA Madrasa Exam) প্রস্তুতির বিশেষজ্ঞ ও বিনয়ী ইসলামিক শিক্ষক। ছাত্রকে খুব স্পষ্ট, সুন্দর বাংলা, প্রয়োজনীয় আরবি ইবারত/আয়াত এবং উদাহরণ সহ উত্তর দিন।";
              if (systemPrompt) {
                instruction += "\n" + systemPrompt;
              }

              let finalPrompt = prompt || "";
              if (action === 'explain_question' && questionData) {
                finalPrompt = `নিম্নলিখিত মাদ্রাসা শিক্ষক নিবন্ধন প্রশ্নটি বিস্তারিতভাবে ব্যাখ্যা করুন:
বিষয়: ${questionData.subject || 'সাধারণ'}
প্রশ্ন: ${questionData.question}
অপশনসমূহ: ${JSON.stringify(questionData.options || [])}
সঠিক উত্তর: ${questionData.correctAnswer !== undefined ? questionData.options?.[questionData.correctAnswer] : ''}
মূল তথ্য, আরবি পরিভাষা, হাদিস/কোরআনের নির্দেশ এবং প্রাসঙ্গিক তথ্যসহ সহজ বাংলায় বিস্তারিত বুঝিয়ে বলুন।`;
              } else if (action === 'evaluate_cq' && questionData) {
                finalPrompt = `মাদ্রাসা শিক্ষক নিবন্ধন লিখিত/সিকিউ প্রশ্নের উত্তর মূল্যায়ন করুন:
প্রশ্ন: ${questionData.title} (${questionData.marks || 10} নম্বর)
শিক্ষার্থীর দেওয়া উত্তর: ${userAnswer}

অনুগ্রহ করে নিচের পয়েন্টগুলোতে ফিডব্যাক দিন:
১. কত নম্বর পাওয়ার যোগ্য? (মার্কিং)
২. উত্তরের শক্তিশালী দিক
৩. কী কী তথ্য বা আরবি ইবারত/রেফারেন্স বাদ পড়েছে?
৪. আদর্শ নমুনা উত্তর (Model High-Scoring Answer) প্রদান করুন।`;
              }

              const response = await ai.models.generateContent({
                model: 'gemini-3.6-flash',
                contents: finalPrompt,
                config: {
                  systemInstruction: instruction,
                },
              });

              res.statusCode = 200;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ text: response.text || "কোনো উত্তর পাওয়া যায়নি।" }));
            } catch (err: any) {
              console.error('Ustad AI Server Error:', err);
              res.statusCode = 500;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ error: err.message || 'উস্তাদ এআই সার্ভিস প্রক্রিয়াকরণে সমস্যা হয়েছে।' }));
            }
          });
        } else {
          next();
        }
      });
    },
  };
}

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss(), expressApiPlugin()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      hmr: process.env.DISABLE_HMR !== 'true',
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
