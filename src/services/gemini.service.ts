import { Injectable } from '@angular/core';
import { GoogleGenAI } from '@google/genai';

@Injectable({
  providedIn: 'root'
})
export class GeminiService {
  private ai: GoogleGenAI | null = null;

  constructor() {
    // IMPORTANT: This relies on `process.env.API_KEY` being set in the environment.
    if (process.env.API_KEY) {
      this.ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    }
  }

  async getInsights(temperature: number, humidity: number): Promise<string> {
    if (!this.ai) {
      return Promise.reject(new Error('API key is not configured.'));
    }

    const prompt = `
      Como un IA experto en agronomía, proporciona una recomendación breve y procesable para un agricultor basada en estas condiciones del invernadero:
      - Temperatura: ${temperature.toFixed(1)}°C
      - Humedad: ${humidity}%
      Concéntrate en los riesgos potenciales y sugiere una o dos acciones claras. Mantén un tono servicial y conciso. Máximo 50 palabras.
    `;
    
    try {
      const response = await this.ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
      });
      return response.text;
    } catch (error) {
      console.error('Error fetching insights from Gemini API:', error);
      return 'No se pudieron obtener las recomendaciones de la IA en este momento. Por favor, revisa tu conexión o clave de API.';
    }
  }
}