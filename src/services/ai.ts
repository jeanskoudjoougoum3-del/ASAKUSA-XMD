import OpenAI from 'openai';
import { config } from 'dotenv';
config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_KEY || 'ta-cle-api-ici',
});

export class AIService {
  
  async chat(message: string, history: any[] = []): Promise<string> {
    try {
      const completion = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: 'Tu es ASAKUSA-XMD, un assistant WhatsApp utile et concis. Réponds en français.' },
          ...history,
          { role: 'user', content: message },
        ],
        max_tokens: 500,
      });
      
      return completion.choices[0].message.content || 'Je ne comprends pas...';
    } catch (error) {
      console.error('AI Error:', error);
      return '❌ Service IA indisponible';
    }
  }

  async imagine(prompt: string): Promise<string | null> {
    try {
      const response = await openai.images.generate({
        prompt,
        n: 1,
        size: '512x512',
      });
      return response.data[0].url || null;
    } catch {
      return null;
    }
  }
}

export const ai = new AIService();
