import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';
import fs from 'fs';

dotenv.config();

async function main() {
  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${process.env.GEMINI_API_KEY}`);
    const data = await response.json();
    fs.writeFileSync('models_out.txt', JSON.stringify(data, null, 2));
  } catch(e) {
    fs.writeFileSync('models_out.txt', 'ERROR: ' + e.message);
  }
}
main();
