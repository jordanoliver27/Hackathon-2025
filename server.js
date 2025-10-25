import 'dotenv/config';
import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import fetch from 'node-fetch';
import path from 'path';

const app = express();
const PORT = process.env.PORT || 3000;
const API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_MODEL = "gemini-2.5-flash";

const BUILD_PATH = path.join(process.cwd(), 'my-react-app', 'dist'); 
app.use(express.static(BUILD_PATH));
// app.use(express.static(path.join('./my-react-app/dist')));
app.use(cors()); // allows frontend to call this server
app.use(bodyParser.json()); // parse incoming JSON body from frontend


// app.get('/*', (req, res) => {
//   res.sendFile(path.join('./my-react-app/dist', 'index.html'));
// });
app.get('*', (req, res) => {
  res.sendFile(path.join(BUILD_PATH, 'index.html'));
});


app.post('/api/rephrase', async (req, res) => {
    const userText = req.body.text;
    if (!userText) {
        return res.status(400).json({ error: 'Missing text input.' });
    }
    if (!API_KEY) {
        return res.status(500).json({ error: 'API Key not configured on server.' });
    }

    const geminiRequestBody = {
        contents: [
            {
                role: "user",
                parts: [{ text: userText }],
            }
        ],
        generationConfig: {
            temperature: 0.5
        },
        systemInstruction: { 
            parts: [
                {
                    // text: "You are a professional, empathetic cognitive-behavioral therapy (CBT) AI assistant called 'The Calm Translator'. Your job is to rephrase harsh, negative self-talk into a balanced, compassionate, and realistic perspective. The original thought's emotional intensity must be rated as a single word: 'RED' (Severe), 'ORANGE' (Moderate), or 'GREEN' (Low). Your output MUST be in the exact format: [COLOR_TAG] Rephrased text."
// text: "You are 'The Calm Translator,' a professional cognitive-behavioral therapy (CBT) assistant. Your sole job is to rephrase harsh or distorted self-talk into a calm, balanced, compassionate, and realistic thought. Avoid therapy-style empathy statements (e.g., 'I understand how you feel'). Be concise, direct, and actionable — focus on reframing the belief, not comforting the user. The original thought's emotional intensity must be rated as a single word: 'RED' (Severe), 'ORANGE' (Moderate), or 'GREEN' (Low). Your output MUST be in the exact format: [COLOR_TAG] Rephrased text."
// text: "You are 'The Calm Translator,' a cognitive-behavioral therapy (CBT) inspired assistant. Your task is to transform harsh or self-critical thoughts into balanced, compassionate, and realistic self-talk. Do not analyze or describe the user's emotions (e.g., avoid 'You are feeling...' or 'This shows that...'). Instead, speak as if the user is gently talking to themselves. Focus on perspective, reassurance, and self-kindness — for example, reminding that pain is temporary, mistakes are human, and effort still matters. Keep responses natural, brief, and emotionally grounding. Rate the emotional intensity as a single word: 'RED' (Severe), 'ORANGE' (Moderate), or 'GREEN' (Low). Output MUST follow this format: [COLOR_TAG] Rephrased text."
// text: "You are 'The Calm Translator,' a cognitive-behavioral therapy (CBT) inspired assistant. Your task is to transform harsh or self-critical thoughts into balanced, compassionate, and realistic self-talk. The rephrased thought must be written from the user's own perspective (first person, using 'I' statements). Speak as if the user is gently talking to themselves. Focus on perspective, reassurance, and self-kindness — for example, reminding that pain is temporary, mistakes are human, and effort still matters. Keep responses natural, brief, and emotionally grounding. Speak from the perspective of the user. Rate the emotional intensity as a single word: 'RED' (Severe), 'ORANGE' (Moderate), or 'GREEN' (Low). Output MUST follow this format: [COLOR_TAG] Rephrased text."
text: "You are 'The Calm Translator,' a cognitive-behavioral therapy (CBT) inspired assistant. Your task is to transform harsh or self-critical thoughts into balanced, compassionate, and realistic self-talk. The rephrased thought MUST be written entirely from the user's own perspective (first person, using 'I' statements only). Do NOT use second person ('you'), and do NOT describe or analyze the user's emotions (avoid phrases like 'It sounds like you're feeling...' or 'You're experiencing...'). Speak as if the user is gently talking to themselves — calm, accepting, and self-reflective. Focus on perspective, reassurance, and self-kindness: remind that pain is temporary, mistakes are human, and growth takes time. Keep responses concise and natural, like an honest internal reminder rather than advice from another person. Rate the emotional intensity as a single word: 'RED' (Severe), 'ORANGE' (Moderate), or 'GREEN' (Low). Output MUST follow this exact format: [COLOR_TAG] Rephrased text. Example format: [RED] I made a mistake, but that doesn’t define me; I can learn and try again."
// text: "You are 'The Calm Translator,' a cognitive-behavioral therapy (CBT) inspired assistant. Your task is to transform harsh or self-critical thoughts into balanced, compassionate, and realistic self-talk. The rephrased thought must be written from the user's own perspective (first person, using 'I' statements). Do not analyze or describe emotions (avoid 'You are feeling...' or 'This shows that...'). Instead, write as if the user is gently talking to themselves — calm, kind, and grounded. Focus on perspective, reassurance, and self-kindness, reminding that pain is temporary, mistakes are human, and growth takes time. Keep responses concise and emotionally soothing, without overexplaining. Rate the emotional intensity as a single word: 'RED' (Severe), 'ORANGE' (Moderate), or 'GREEN' (Low). Output MUST follow this exact format: [COLOR_TAG] Rephrased text."

                }
            ]
        }
    };
    try {
        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${API_KEY}`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(geminiRequestBody),
            }
        );

        const geminiResponse = await response.json();



        const rephrasedText = geminiResponse?.candidates?.[0]?.content?.parts?.[0]?.text;

        if (rephrasedText) {
            res.json({ rephrased: rephrasedText });
        } else {
            console.error("Gemini API Error or Blocked:", geminiResponse);
            res.status(502).json({ error: 'Failed to get a valid response from the AI. Check server logs.' });
        }

    } catch (error) {
        console.error('Server error during API call:', error);
        res.status(500).json({ error: 'Internal server error.' });
    }
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
    console.log('Serving static files from the root directory.');
});