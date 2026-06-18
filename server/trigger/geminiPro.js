import { task } from "@trigger.dev/sdk/v3";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export const geminiProTask = task({
  id: "gemini-pro",
  run: async (payload) => {
    const { prompt, systemPrompt, imageUrl } = payload;
    
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-pro",
      systemInstruction: systemPrompt || undefined,
    });
    
    const parts = [prompt];
    
    if (imageUrl) {
      const response = await fetch(imageUrl);
      const arrayBuffer = await response.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      const base64Data = buffer.toString("base64");
      
      const mimeType = response.headers.get("content-type") || "image/jpeg";
      
      parts.push({
        inlineData: {
          data: base64Data,
          mimeType,
        },
      });
    }
    
    const result = await model.generateContent(parts);
    const response = await result.response;
    
    return {
      text: response.text(),
    };
  },
});
