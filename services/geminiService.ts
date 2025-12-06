import { GoogleGenAI } from "@google/genai";
import { GroundingMetadata, ImageAttachment } from "../types";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

export const searchArtifacts = async (
  query: string, 
  filter: string,
  image: ImageAttachment | null
): Promise<{ text: string; groundingMetadata: GroundingMetadata | null }> => {
  
  if (!apiKey) {
    throw new Error("API Key is missing. Please check your configuration.");
  }

  const modelId = "gemini-2.5-flash"; // Supports multimodal input and tools

  let promptText = "";
  
  if (image) {
    promptText = `
      Analyze the attached image of a potential metal detecting find or artifact.
      
      Tasks:
      1. **Identification**: Visually identify the object. Describe its likely material (e.g., copper alloy, silver, gold), classification (e.g., brooch, coin, buckle), and likely time period (e.g., Roman, Medieval).
      2. **Search**: Use this identification to perform a search for similar items on databases like finds.org.uk (PAS), UKDFD, and museum collections.
      3. **Visual Matching**: If you find records with images that look similar, YOU MUST attempt to embed them using Markdown image syntax (e.g. ![Description](url)). 
         - Focus on finding direct image URLs from the search results.
         - If you cannot embed the image, provide the direct link to the record.
      
      User's additional context: "${query}"
    `;
  } else {
    promptText = `
      Perform a detailed search for "${query}" specifically within the context of metal detecting finds and archaeological databases.
    `;
  }

  const basePrompt = `
    ${promptText}
    
    Target websites:
    - finds.org.uk (Portable Antiquities Scheme - PAS)
    - ukdfd.co.uk (UK Detector Finds Database)
    - British Museum Collection
    - Other reputable archaeological databases.

    Focus constraint: ${filter === 'All Databases' ? 'Search all relevant trusted databases.' : `Prioritize searching specifically on ${filter}.`}

    Your response must be in ENGLISH and include:
    1. **Summary**: The object's probable identity, material, and date.
    2. **Similar Finds**: Specific examples of similar finds from the databases.
    3. **Context**: Historical context and usage.
    4. **Images**: A section displaying any found images of similar artifacts (using markdown syntax).
    5. **References**: Mention specific ID numbers (e.g., SUR-123456) if found.

    Format the output in clear Markdown with headers.
  `;

  try {
    const parts: any[] = [];
    
    if (image) {
      parts.push({
        inlineData: {
          mimeType: image.mimeType,
          data: image.data
        }
      });
    }
    
    parts.push({ text: basePrompt });

    const response = await ai.models.generateContent({
      model: modelId,
      contents: { parts },
      config: {
        tools: [{ googleSearch: {} }],
      },
    });

    const text = response.text || "No results found.";
    const groundingMetadata = response.candidates?.[0]?.groundingMetadata as GroundingMetadata;

    return { text, groundingMetadata };
  } catch (error: any) {
    console.error("Gemini Search Error:", error);
    throw new Error(error.message || "Failed to perform search.");
  }
};