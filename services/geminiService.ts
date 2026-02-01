import { GoogleGenAI } from "@google/genai";
import { UserData } from "../types";

// Get financial advice from Gemini based on user portfolio
export const getFinancialAdvice = async (userData: UserData): Promise<string> => {
  try {
    // Initializing Gemini client as per latest guidelines
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Analiza financieramente:
      - Patrimonio total: $${userData.savings + userData.paxg + userData.latam}
      - Deuda actual: $${userData.totalDebt}
      Da un consejo de 15 palabras máximo en español para un usuario de Cryptocagua.`,
      config: {
        temperature: 0.7,
      }
    });
    // Extracting the text property directly from the GenerateContentResponse object
    return response.text || "Sigue ahorrando para fortalecer tu futuro financiero.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Mantén un equilibrio saludable en tus finanzas.";
  }
};
