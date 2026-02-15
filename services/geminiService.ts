import { GoogleGenAI } from "@google/genai";
import { StreamSettings, CalculationResult } from "../types";

export const getNetworkAdvice = async (
  settings: StreamSettings,
  calculatedBitrate: CalculationResult,
  userNetworkContext: string,
  languageName: string,
  userApiKey?: string
): Promise<string> => {
  
  // Prioritize user provided key, fallback to env variable if available (e.g. self-hosted with env)
  const apiKey = userApiKey || process.env.API_KEY;

  if (!apiKey) {
    throw new Error("API Key is missing");
  }

  const ai = new GoogleGenAI({ apiKey });

  const prompt = `
    You are a network engineer expert in real-time game streaming protocols (like Moonlight/Sunshine/Gamestream).
    
    User Configuration:
    - Resolution: ${settings.resolution}
    - Frame Rate: ${settings.frameRate} FPS
    - Codec: ${settings.codec}
    - HDR: ${settings.hdr ? 'Enabled' : 'Disabled'}
    
    Calculated Requirement:
    - Optimal Bitrate: ${Math.round(calculatedBitrate.optimalBitrate)} Mbps
    
    User's Network Context or Question: "${userNetworkContext}"
    
    Task:
    Analyze if the user's network context is sufficient for the calculated bitrate. 
    Provide 3 specific, actionable tips to optimize their local network for this specific bitrate.
    Keep the tone technical but accessible ("Gamer" friendly). 
    Focus on router settings, interference, and wired vs wireless advice suitable for high-throughput low-latency streams.
    Limit response to 200 words.

    IMPORTANT: You MUST reply in ${languageName}.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });
    return response.text || "No response generated.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};