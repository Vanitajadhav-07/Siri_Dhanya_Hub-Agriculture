import { GoogleGenAI } from "@google/genai";
import { Recipe } from '../types';
import { GEMINI_API_KEY } from '../lib/config';

let ai: GoogleGenAI | null = null;

function getAi() {
  if (!ai) {
    console.log("Gemini Service: Initializing with key length", GEMINI_API_KEY.length);
    ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });
  }
  return ai;
}

export async function generateMilletRecipe(
  milletName: string,
  preference: string = 'healthy',
  language: 'en' | 'kn' | 'hi' = 'en',
  kannadaName?: string
): Promise<Recipe | null> {
  try {
    const aiInstance = getAi();
    const langLabel = language === 'kn' ? 'Kannada' : language === 'hi' ? 'Hindi' : 'English';
    const milletLabel = language === 'kn' && kannadaName ? `${kannadaName} (${milletName})` : milletName;

    const prompt = `Generate a delicious and ${preference} recipe using ${milletLabel}.
Write ALL text fields in ${langLabel}.
${language === 'kn' ? 'Use proper Kannada script (ಕನ್ನಡ) for all text.' : ''}

Return ONLY a valid JSON object with these exact keys:
- "title": recipe name in ${langLabel}
- "ingredients": array of ingredient strings in ${langLabel}
- "instructions": array of step-by-step instruction strings in ${langLabel}
- "cookingTime": time string like "30 minutes" in ${langLabel}

Example structure (do not copy content):
{"title":"...","ingredients":["..."],"instructions":["..."],"cookingTime":"..."}`;

    const result = await aiInstance.models.generateContent({
      model: "gemini-2.0-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        temperature: 0.7,
      },
    });

    const text = result.text;
    if (!text) throw new Error("Empty response from AI");

    // Strip markdown code fences if present
    const cleaned = text.replace(/^```json\s*/i, '').replace(/^```\s*/i, '').replace(/```\s*$/i, '').trim();
    return JSON.parse(cleaned) as Recipe;
  } catch (error: any) {
    console.error("Error in aiService:", error);
    return null;
  }
}
