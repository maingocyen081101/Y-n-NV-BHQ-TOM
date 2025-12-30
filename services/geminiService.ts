
import { GoogleGenAI } from "@google/genai";
import { Machine } from "../types";

export class GeminiService {
  private ai: GoogleGenAI;

  constructor() {
    this.ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  }

  async analyzeRepairStrategy(machines: Machine[]): Promise<string> {
    const prompt = `
      Analyze the following production machine repair data:
      ${JSON.stringify(machines, null, 2)}
      
      Please provide a brief executive summary in Vietnamese focusing on:
      1. Overall repairability trends.
      2. Cost optimization suggestions.
      3. Critical machines that need immediate attention.
      4. Ratio of repairable vs scrap items.
    `;

    try {
      const response = await this.ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
        config: {
          systemInstruction: "You are a senior production manager with expertise in machine maintenance and cost analysis. Provide insights in professional Vietnamese.",
        }
      });
      return response.text || "Could not generate analysis.";
    } catch (error) {
      console.error("Gemini Analysis Error:", error);
      return "An error occurred during AI analysis.";
    }
  }
}
