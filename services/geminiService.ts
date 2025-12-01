import { GoogleGenAI, Type } from "@google/genai";
import { FileCategory } from "../types";

const apiKey = process.env.API_KEY || '';

// Initialize Gemini Client
// Note: In a production app, do not expose API keys on the client side without proper restrictions.
const ai = new GoogleGenAI({ apiKey });

interface AutoClassificationResult {
  category: FileCategory;
  tags: string[];
  summary: string;
}

export const classifyFile = async (fileName: string, fileType: string, fileSize: number): Promise<AutoClassificationResult> => {
  if (!apiKey) {
    console.warn("API Key missing, returning default classification.");
    return {
      category: FileCategory.LAINNYA,
      tags: ['manual', 'upload'],
      summary: 'API Key not provided. Manual classification required.'
    };
  }

  try {
    const prompt = `
      Analyze the following file metadata and suggest a categorization for a government archive system.
      File Name: "${fileName}"
      File Type: "${fileType}"
      File Size: ${fileSize} bytes.

      Available Categories:
      - Administrasi (Surat keputusan, surat masuk/keluar, undangan)
      - Laporan (Laporan kegiatan, laporan bulanan, evaluasi)
      - Keuangan (Laporan anggaran, kwitansi, bukti bayar)
      - Produk Hukum (Peraturan daerah, undang-undang, SK Bupati/Gubernur)
      - Dokumentasi Foto (Foto kegiatan, spanduk, visual)
      - Lainnya

      Task:
      1. Select the best matching Category from the list.
      2. Generate 3-5 relevant tags based on the filename keywords.
      3. Write a very short 1-sentence summary of what this file might contain.
    `;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            category: {
              type: Type.STRING,
              enum: Object.values(FileCategory),
              description: "The classified category of the file"
            },
            tags: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "List of relevant tags"
            },
            summary: {
              type: Type.STRING,
              description: "A short summary description"
            }
          },
          required: ["category", "tags", "summary"]
        }
      }
    });

    if (response.text) {
      const result = JSON.parse(response.text) as AutoClassificationResult;
      return result;
    }
    
    throw new Error("Empty response from AI");

  } catch (error) {
    console.error("Gemini Classification Failed:", error);
    return {
      category: FileCategory.LAINNYA,
      tags: ['auto-generated', 'error'],
      summary: 'Classification failed. Please review manually.'
    };
  }
};