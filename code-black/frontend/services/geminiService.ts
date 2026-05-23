import { GoogleGenAI } from '@google/genai';
import { SYSTEM_INSTRUCTION } from '../constants';

// Initialize the client. API_KEY must be available in the environment.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY, vertexai: true });

export const analyzeEmergency = async (userInput: string): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: {
        role: 'user',
        parts: [{ text: userInput }],
      },
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.1, // Low temperature for deterministic, strict adherence to rules
      },
    });

    return response.text || "Error: No response generated.";
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    return "System Error: Unable to process request at this time. If this is a life-threatening emergency, dial 911 immediately.";
  }
};
