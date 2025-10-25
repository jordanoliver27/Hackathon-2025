import 'dotenv/config';
import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import fetch from 'node-fetch';

const app = express();
const PORT = process.env.PORT || 3000;
const API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_MODEL = "gemini-2.5-flash";


app.use(cors()); // allows frontend to call this server
app.use(bodyParser.json()); // parse incoming JSON body from frontend
app.use(express.static('./')); // index.html, style.css, script.js

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
                    text: "You are a professional, empathetic cognitive-behavioral therapy (CBT) AI assistant called 'The Calm Translator'. Your job is to rephrase harsh, negative self-talk into a balanced, compassionate, and realistic perspective. The original thought's emotional intensity must be rated as a single word: 'RED' (Severe), 'ORANGE' (Moderate), or 'GREEN' (Low). Your output MUST be in the exact format: [COLOR_TAG] Rephrased text."
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