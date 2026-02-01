
import { GoogleGenAI } from "@google/genai";
import { UserData } from "../types";

export const getFinancialAdvice = async (userData: UserData): Promise<string> => {
  try {
    const apiKey = (typeof process !== 'undefined' && process.env?.API_KEY) || "";
    if (!apiKey) return "Continúa gestionando tus activos con inteligencia.";

    const ai = new GoogleGenAI({ apiKey });
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
    return response.text || "Sigue ahorrando para fortalecer tu futuro financiero.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Mantén un equilibrio saludable en tus finanzas.";
  }
};
