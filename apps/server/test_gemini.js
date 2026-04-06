import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';
import fs from 'fs';

dotenv.config();

async function main() {
  try {
    const key = process.env.GEMINI_API_KEY;
    if (!key) {
      console.log('NO KEY');
      fs.writeFileSync('gemini_out.txt', 'NO KEY');
      return;
    }
    const genAI = new GoogleGenerativeAI(key);
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const result = await model.generateContent("Say hello");
    console.log("SUCCESS:", result.response.text());
    fs.writeFileSync('gemini_out.txt', 'SUCCESS: ' + result.response.text());
  } catch(e) {
    console.log("ERROR:", e.message);
    fs.writeFileSync('gemini_out.txt', 'ERROR: ' + e.message);
  }
}
main();
