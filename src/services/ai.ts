import { OpenAI } from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function generateTestCase(prompt: string): Promise<string> {
    const response = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: prompt }],
      });
      
      console.log("OpenAI response:", response);  // Log the full response
      
      const choice = response.choices[0]?.message?.content;
      if (!choice) {
        throw new Error("No content generated");
      }
      
      return choice;
      
}
