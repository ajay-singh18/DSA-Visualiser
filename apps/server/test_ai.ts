import { GoogleGenerativeAI } from '@google/generative-ai';
import { env } from './src/config/env.js';

const test = async () => {
    try {
        console.log("Using key:", env.GEMINI_API_KEY.substring(0,5) + "...");
        const genAI = new GoogleGenerativeAI(env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
        const result = await model.generateContent("hello");
        console.log("Success:", result.response.text());
    } catch (e: any) {
        console.error("Error:", e.message, e.stack);
    }
}
test();
