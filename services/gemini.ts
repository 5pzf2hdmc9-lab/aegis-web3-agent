import { GoogleGenAI } from "@google/genai";
import { buildAuditPrompt } from "@/lib/prompt-guard";

function getClient() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not configured on the server.");
  }
  return new GoogleGenAI({ apiKey });
}

export async function generateAuditReport(params: {
  target: string;
  chain: string;
  blockchainContext: string;
}): Promise<string> {
  const ai = getClient();
  const model = process.env.GEMINI_MODEL || "gemini-3.8-flash";
  const prompt = buildAuditPrompt(params);

  const response = await ai.models.generateContent({
    model,
    contents: prompt,
  });

  return response.text || "Audit completed with no textual response.";
}
