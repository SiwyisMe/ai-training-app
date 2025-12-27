import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = process.env.EXPO_PUBLIC_GEMINI_API_KEY;

if (!API_KEY) {
  console.warn("Missing EXPO_PUBLIC_GEMINI_API_KEY environment variable");
}

const genAI = new GoogleGenerativeAI(API_KEY || "");
const model = genAI.getGenerativeModel({ model: "gemini-3-flash-preview" });

export const generateContent = async (prompt: string) => {
  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};

export const generateJSON = async (prompt: string) => {
  try {
    const result = await model.generateContent(
      prompt +
        "\n\nIMPORTANT: Return ONLY valid JSON. No markdown formatting, no code blocks, no intro/outro text."
    );
    const response = await result.response;
    const text = response.text();

    console.log("Raw AI Response:", text); // Debug log

    // Robust JSON extraction
    const jsonStartIndex = text.indexOf("{");
    const jsonEndIndex = text.lastIndexOf("}");

    if (jsonStartIndex === -1 || jsonEndIndex === -1) {
      throw new Error("No JSON object found in response");
    }

    const jsonString = text.substring(jsonStartIndex, jsonEndIndex + 1);

    return JSON.parse(jsonString);
  } catch (error) {
    console.error("Gemini JSON Generation Error:", error);
    throw error;
  }
};
