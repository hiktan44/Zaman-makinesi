/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import { GoogleGenerativeAI, Part } from "@google/generative-ai";
import { ERAS } from "../constants/eraConstants";

const API_KEY = import.meta.env.VITE_API_KEY?.trim() || "";
const KIE_API_KEY = import.meta.env.VITE_KIE_API_KEY?.trim() || "";

const genAI = new GoogleGenerativeAI(API_KEY);
// Gemini Image generation model
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-image" });

/**
 * Builds the high-fidelity prompt for a given era.
 */
export function getEraPrompt(eraIdOrDecade: string): { prompt: string; fallbackPrompt: string; title: string } {
    const era = ERAS.find(e => e.id === eraIdOrDecade || e.yearDisplay === eraIdOrDecade);
    if (era) {
        return {
            prompt: era.promptEn,
            fallbackPrompt: `Generate a portrait of the person in this image as if they were living in the ${era.yearDisplay} (${era.titleEn}). Maintain exact facial features and identity.`,
            title: era.titleTr
        };
    }

    // Default numeric decade fallback (e.g. "1950s" or "1950'ler")
    const yearMatch = eraIdOrDecade.match(/\d+/);
    const decadeStr = yearMatch ? `${yearMatch[0]}s` : eraIdOrDecade;

    return {
        prompt: `Reimagine the person in this photo in the style of the ${decadeStr}. This includes authentic period clothing, hairstyle, lighting, and film aesthetic of that decade. The output must be a clear photorealistic image preserving the exact facial identity, gaze, and features of the person.`,
        fallbackPrompt: `Generate a photo of the person in this image as if they were living in the ${decadeStr}. Reflect authentic fashion and hairstyles of that era while strictly preserving their face.`,
        title: eraIdOrDecade
    };
}

/**
 * Processes the Gemini API response, extracting inline image data or throwing an informative error.
 */
function processGeminiResponse(response: any): string {
    const candidate = response.response?.candidates?.[0];
    const imagePart = candidate?.content?.parts?.find((part: Part) => (part as any).inlineData);

    if ((imagePart as any)?.inlineData) {
        const { mimeType, data } = (imagePart as any).inlineData;
        return `data:${mimeType};base64,${data}`;
    }

    // Check if parts contain image text or URL
    const text = response.response?.text?.() || "";
    if (text.startsWith("data:image/")) {
        return text.trim();
    }

    console.error("API did not return inline image data. Response text:", text);
    throw new Error(`Model görsel yerine metin yanıtı döndürdü: "${text.substring(0, 100)}..."`);
}

/**
 * Calls Gemini with retry and exponential backoff.
 */
async function callGeminiWithRetry(imagePart: Part, textPart: Part) {
    const maxRetries = 4;
    let retryDelay = 1500;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
            const result = await model.generateContent([textPart, imagePart]);
            return result;
        } catch (error) {
            console.error(`Gemini API Çağrısı (Deneme ${attempt}/${maxRetries}):`, error);
            const errorMessage = error instanceof Error ? error.message : JSON.stringify(error);

            const isInternalError = errorMessage.includes('500') || errorMessage.includes('INTERNAL');
            const isQuotaError = errorMessage.includes('429') || errorMessage.includes('RESOURCE_EXHAUSTED');

            if ((isInternalError || isQuotaError) && attempt < maxRetries) {
                let waitTime = isQuotaError ? retryDelay * 2 : 1000 * Math.pow(2, attempt - 1);
                console.log(`[Zaman Makinesi] Hata algılandı. ${waitTime}ms sonra tekrar deneniyor...`);
                await new Promise(resolve => setTimeout(resolve, waitTime));
                continue;
            }
            throw error;
        }
    }
    throw new Error("Gemini API çağrısı tüm denemelerden sonra başarısız oldu.");
}

/**
 * Kie.ai / Seedance fast image generation endpoint integration
 * Ultra-low cost (~10:1 cheaper) & high fidelity
 */
async function generateWithKieSeedance(imageBase64: string, mimeType: string, prompt: string): Promise<string> {
    const endpoint = "/api/kie/generate-image";
    const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            image: `data:${mimeType};base64,${imageBase64}`,
            prompt: prompt,
            model: "seedance-5-fast",
            aspectRatio: "1:1"
        })
    });

    if (!res.ok) {
        throw new Error(`Kie.ai API Hatası: ${res.statusText}`);
    }

    const data = await res.json();
    return data.imageUrl || data.dataUrl;
}

/**
 * Generates an era-styled image from a source image and era identifier.
 */
export async function generateDecadeImage(imageDataUrl: string, eraIdOrDecade: string): Promise<string> {
    const match = imageDataUrl.match(/^data:(image\/\w+);base64,(.*)$/);
    if (!match) {
        throw new Error("Geçersiz resim formatı.");
    }
    const [, mimeType, base64Data] = match;

    const { prompt, fallbackPrompt } = getEraPrompt(eraIdOrDecade);

    // If Kie API key or endpoint proxy is configured, try Kie Seedance first
    if (KIE_API_KEY) {
        try {
            console.log(`[Zaman Makinesi] Kie.ai Seedance motoru ile üretiliyor: ${eraIdOrDecade}`);
            return await generateWithKieSeedance(base64Data, mimeType, prompt);
        } catch (kieErr) {
            console.warn("[Zaman Makinesi] Kie.ai Seedance başarısız oldu, Gemini motoruna geçiliyor...", kieErr);
        }
    }

    // Gemini Primary Image Generation
    const imagePart: Part = {
        inlineData: {
            mimeType: mimeType,
            data: base64Data
        }
    };

    try {
        console.log(`[Zaman Makinesi] Gemini motoru çalışıyor: ${eraIdOrDecade}`);
        const textPart: Part = { text: prompt };
        const response = await callGeminiWithRetry(imagePart, textPart);
        return processGeminiResponse(response);
    } catch (error) {
        console.warn(`[Zaman Makinesi] Ana prompt başarısız oldu, yedek prompt deneniyor: ${eraIdOrDecade}`, error);
        try {
            const fallbackTextPart: Part = { text: fallbackPrompt };
            const fallbackResponse = await callGeminiWithRetry(imagePart, fallbackTextPart);
            return processGeminiResponse(fallbackResponse);
        } catch (fallbackError) {
            console.error("[Zaman Makinesi] Yedek prompt da başarısız oldu:", fallbackError);
            throw new Error(`Görsel üretilemedi. Lütfen bağlantınızı kontrol edip tekrar deneyin.`);
        }
    }
}
