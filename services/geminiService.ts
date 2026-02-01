
import { GoogleGenAI } from "@google/genai";
import { UserData } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getFinancialAdvice = async (userData: UserData): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Analiza los siguientes datos financieros de un usuario de "Cryptocagua Ahorro y Préstamos" y proporciona un consejo breve y motivador en español. 
      Datos: 
      - Ahorros totales: $${userData.savings}
      - Saldo disponible: $${userData.balance}
      - Préstamos activos: $${userData.activeLoans}
      - Límite de préstamo (50% ahorros): $${userData.savings * 0.5}
      
      Por favor, sé profesional pero cercano.`,
      config: {
        temperature: 0.7,
        topP: 0.9,
      }
    });
    return response.text || "Sigue ahorrando para fortalecer tu futuro financiero con Cryptocagua.";
  } catch (error) {
    console.error("Error fetching Gemini advice:", error);
    return "Mantén un equilibrio saludable entre tus ahorros y tus gastos.";
  }
};
