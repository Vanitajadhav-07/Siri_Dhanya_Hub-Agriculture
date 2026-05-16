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
    if (!GEMINI_API_KEY) throw new Error("API Key missing");

    const aiInstance = getAi();
    const model = aiInstance.getGenerativeModel({
      model: "gemini-1.5-flash",
      generationConfig: {
        responseMimeType: "application/json",
        temperature: 0.7,
      }
    });

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

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    if (!text) throw new Error("Empty response from AI");

    // Strip markdown code fences if present
    const cleaned = text.replace(/^```json\s*/i, '').replace(/^```\s*/i, '').replace(/```\s*$/i, '').trim();
    return JSON.parse(cleaned) as Recipe;
  } catch (error: any) {
    console.error("Error in aiService:", error);

    // FALLBACK: Return a high-quality local recipe if AI fails
    if (language === 'kn') {
      return {
        title: `${kannadaName || milletName} ಪೌಷ್ಟಿಕ ಆಹಾರ`,
        ingredients: [
          `1 ಕಪ್ ${kannadaName || milletName}`,
          "3 ಕಪ್ ನೀರು",
          "ರುಚಿಗೆ ತಕ್ಕಷ್ಟು ಉಪ್ಪು",
          "ಒಗ್ಗರಣೆಗೆ ಸಾಸಿವೆ ಮತ್ತು ಜೀರಿಗೆ",
          "ಹಸಿ ಮೆಣಸಿನಕಾಯಿ ಮತ್ತು ಕರಿಬೇವು"
        ],
        instructions: [
          `${kannadaName || milletName} ಅನ್ನು ಚೆನ್ನಾಗಿ ತೊಳೆದು 6 ಗಂಟೆಗಳ ಕಾಲ ನೆನೆಸಿಡಿ.`,
          "ಒಂದು ಪಾತ್ರೆಯಲ್ಲಿ ನೀರನ್ನು ಕುದಿಸಿ ಮತ್ತು ನೆನೆಸಿದ ಧಾನ್ಯವನ್ನು ಸೇರಿಸಿ.",
          "ಧಾನ್ಯವು ಮೃದುವಾಗುವವರೆಗೆ ಸಣ್ಣ ಉರಿಯಲ್ಲಿ ಬೇಯಿಸಿ.",
          "ಮತ್ತೊಂದು ಬಾಣಲೆಯಲ್ಲಿ ಒಗ್ಗರಣೆ ತಯಾರಿಸಿ ಬೇಯಿಸಿದ ಧಾನ್ಯಕ್ಕೆ ಸೇರಿಸಿ.",
          "ಬಿಸಿಯಾಗಿ ಬಡಿಸಿ."
        ],
        cookingTime: "40 ನಿಮಿಷಗಳು"
      };
    }

    return {
      title: `Classic ${milletName} Health Mix`,
      ingredients: [
        `1 cup ${milletName}`,
        "3 cups water",
        "Salt to taste",
        "1 tbsp Ghee or Oil",
        "Fresh curry leaves and green chillies"
      ],
      instructions: [
        `Wash the ${milletName} thoroughly and soak for at least 6 hours.`,
        "Boil water in a heavy-bottomed pan.",
        "Add the soaked grains and cook on medium flame until soft.",
        "Prepare a simple tempering with mustard seeds and curry leaves.",
        "Mix well and serve hot with chutney or curd."
      ],
      cookingTime: "35 minutes"
    };
  }
}
