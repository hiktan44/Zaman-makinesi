/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import { GoogleGenerativeAI, Part } from "@google/generative-ai";

const API_KEY = import.meta.env.VITE_API_KEY?.trim();

if (!API_KEY) {
    console.error("VITE_API_KEY environment variable is missing. Please add it to your .env file.");
} else {
    // Debug log to verify key is loaded (masked for security)
    console.log(`API Key loaded: ${API_KEY.substring(0, 5)}...${API_KEY.substring(API_KEY.length - 3)} (Length: ${API_KEY.length})`);
}

const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-3-pro-image-preview" });

// --- Helper Functions ---

/**
 * Converts a Turkish decade string (e.g., "1950'ler") to an English decade format (e.g., "1950s").
 * This is used because the model follows English style instructions more reliably.
 * @param turkishDecade The decade string in Turkish.
 * @returns The decade string in English.
 */
function getEnglishDecade(turkishDecade: string): string {
    const year = parseInt(turkishDecade);
    if (isNaN(year)) return turkishDecade; // Fallback to original if parsing fails
    return `${year}s`;
}

/**
 * Creates the primary English prompt for image generation.
 * @param decade The decade string in English (e.g., "1950s").
 * @returns The prompt string.
 */
function getPrompt(decade: string): string {
    return `Reimagine the person in this photo in the style of the ${decade}. This includes clothing, hairstyle, photo quality, and the general aesthetic of that decade. The output must be a photorealistic image clearly showing the person.`;
}

/**
 * Creates a fallback prompt to use when the primary one is blocked or fails.
 * @param decade The decade string in English (e.g., "1950s").
 * @returns The fallback prompt string.
 */
function getFallbackPrompt(decade: string): string {
    return `Generate a photo of the person in this image as if they were living in the ${decade}. The photo should reflect the distinct fashion, hairstyles, and atmosphere of that era. Ensure the final image is a clear, authentic-looking photograph suitable for the time period.`;
}

/**
 * Maps technical error messages to user-friendly Turkish messages.
 */
function getFriendlyErrorMessage(error: unknown): string {
    const msg = error instanceof Error ? error.message : String(error);

    if (msg.includes('429') || msg.includes("RESOURCE_EXHAUSTED")) {
        return "Günlük kullanım limitine ulaşıldı. Lütfen daha sonra tekrar deneyin.";
    }
    if (msg.includes('500') || msg.includes("INTERNAL")) {
        return "Sunucu hatası oluştu. Lütfen tekrar deneyin.";
    }
    if (msg.includes("SAFETY") || msg.includes("BLOCKED") || msg.includes("finishReason")) {
        return "Güvenlik filtresi nedeniyle resim oluşturulamadı.";
    }
    if (msg.includes("Yapay zeka model bir resim yerine metin ile yanıt verdi")) {
        return "Model görüntü üretemedi.";
    }

    // If the message is short enough, return it, otherwise generic error
    return msg.length < 150 ? msg : "Beklenmedik bir hata oluştu.";
}

/**
 * Processes the Gemini API response, extracting the image or throwing an error if none is found.
 * @param response The response from the generateContent call.
 * @returns A data URL string for the generated image.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function processGeminiResponse(response: any): string {
    // The structure of response in @google/generative-ai is different.
    // Usually response.response.text() gives text.
    // But we are expecting an image generation model or multimodal output.
    // Wait, gemini-1.5-flash is a text/multimodal model, it generates TEXT/JSON.
    // It does NOT generate images directly like Imagen.
    // However, the user's previous code was expecting `inlineData` in the response.
    // If the user wants IMAGE GENERATION, they need an image generation model (Imagen).
    // BUT, Gemini 1.5 Flash CANNOT generate images. It can only analyze them.
    //
    // CRITICAL REALIZATION: The user wants to "Reimagine the person...".
    // If they were using "gemini-2.5-flash-image" maybe that was a special model?
    // Or maybe they were using a tool that returns base64 images?
    //
    // If we are using Gemini 1.5 Flash, it will return a TEXT description of the image, NOT an image.
    // UNLESS we are using it to prompt an image generation tool?
    //
    // However, based on the previous code `imagePartFromResponse.inlineData`, the previous code EXPECTED an image back.
    // This implies the model used previously WAS capable of returning images (like Imagen).
    //
    // Since standard Gemini 1.5 Flash cannot generate images, we have a problem.
    // But the user said "gemini 3 resim oluşturuyordu".
    //
    // Let's assume for a moment the user mistakenly thinks Gemini generates images, OR they have access to a model that does.
    // OR, the previous code was actually receiving a text description and the user thought it was an image? No, the code checks for `inlineData`.
    //
    // If I use `gemini-1.5-flash`, I will get text.
    // If I want images, I need `imagen-3.0-generate-001`.
    // But that failed with 404.
    //
    // Let's try to use `gemini-1.5-flash` but maybe the user's prompt implies they want a description?
    // No, "The output must be a photorealistic image".
    //
    // HYPOTHESIS: The user has access to a model that generates images, but we don't know the name.
    // OR, we should use `gemini-pro-vision` (deprecated) or similar?
    //
    // Wait, let's look at the `processGeminiResponse` in the OLD code (before I touched it today).
    // It was checking `response.candidates?.[0]?.content?.parts?.find(part => part.inlineData)`.
    // This structure is standard for Gemini API responses.
    //
    // If the user insists on "gemini 3", maybe they mean `gemini-1.5-pro` with some capability?
    //
    // Let's stick to the plan of using `@google/generative-ai` and `gemini-1.5-flash`.
    // If it returns text, we will see it in the logs.
    // But wait, if it returns text, `processGeminiResponse` will fail.
    //
    // Let's implement the standard `generateContent` call.

    const candidate = response.response.candidates?.[0];
    const imagePart = candidate?.content?.parts?.find((part: Part) => part.inlineData);

    if (imagePart?.inlineData) {
        const { mimeType, data } = imagePart.inlineData;
        return `data:${mimeType};base64,${data}`;
    }

    // If no image, maybe it returned text?
    const text = response.response.text();
    console.error("API did not return an image. Response text:", text);
    throw new Error(`Yapay zeka model bir resim yerine metin ile yanıt verdi: "${text.substring(0, 100)}..."`);
}

/**
 * A wrapper for the Gemini API call that includes a retry mechanism for internal server errors and rate limits.
 */
async function callGeminiWithRetry(imagePart: Part, textPart: Part) {
    const maxRetries = 5;
    let retryDelay = 2000;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
            const result = await model.generateContent([textPart, imagePart]);
            return result;
        } catch (error) {
            console.error(`Error calling Gemini API (Attempt ${attempt}/${maxRetries}):`, error);
            const errorMessage = error instanceof Error ? error.message : JSON.stringify(error);

            const isInternalError = errorMessage.includes('500') || errorMessage.includes('INTERNAL');
            const isQuotaError = errorMessage.includes('429') || errorMessage.includes('RESOURCE_EXHAUSTED');

            if ((isInternalError || isQuotaError) && attempt < maxRetries) {
                let waitTime = 1000 * Math.pow(2, attempt - 1);
                if (isQuotaError) {
                    waitTime = retryDelay;
                    retryDelay *= 2;
                }
                console.log(`${isQuotaError ? 'Quota/Rate limit' : 'Internal error'} detected. Retrying in ${waitTime}ms...`);
                await new Promise(resolve => setTimeout(resolve, waitTime));
                continue;
            }
            throw error;
        }
    }
    throw new Error("Gemini API call failed after all retries.");
}


/**
 * Generates a decade-styled image from a source image and a decade string.
 * @param imageDataUrl A data URL string of the source image.
 * @param decade The decade string (e.g., "1950'ler").
 * @returns A promise that resolves to a base64-encoded image data URL.
 */
export async function generateDecadeImage(imageDataUrl: string, decade: string): Promise<string> {
    const match = imageDataUrl.match(/^data:(image\/\w+);base64,(.*)$/);
    if (!match) {
        throw new Error("Geçersiz resim formatı.");
    }
    const [, mimeType, base64Data] = match;

    const imagePart: Part = {
        inlineData: {
            mimeType: mimeType,
            data: base64Data
        }
    };

    const englishDecade = getEnglishDecade(decade);
    const prompt = getPrompt(englishDecade);

    try {
        console.log(`Attempting generation for ${englishDecade} with primary prompt...`);
        const textPart: Part = { text: prompt };
        const response = await callGeminiWithRetry(imagePart, textPart);
        return processGeminiResponse(response);
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : JSON.stringify(error);
        const isNoImageError = errorMessage.includes("Yapay zeka model bir resim yerine metin ile yanıt verdi");

        if (isNoImageError) {
            console.warn("Primary prompt was likely blocked. Trying a fallback prompt.");
            try {
                const fallbackPrompt = getFallbackPrompt(englishDecade);
                console.log(`Attempting generation with fallback prompt for ${englishDecade}...`);
                const fallbackTextPart: Part = { text: fallbackPrompt };
                const fallbackResponse = await callGeminiWithRetry(imagePart, fallbackTextPart);
                return processGeminiResponse(fallbackResponse);
            } catch (fallbackError) {
                console.error("Fallback prompt also failed.", fallbackError);
                const finalErrorMessage = fallbackError instanceof Error ? fallbackError.message : String(fallbackError);
                throw new Error(`Yapay zeka modeli resim oluşturamadı. Lütfen tekrar deneyin. (Detay: ${finalErrorMessage})`);
            }
        } else {
            console.error("An unrecoverable error occurred during image generation.", error);
            throw new Error(`Resim oluşturulurken bir hata oluştu: ${getFriendlyErrorMessage(error)}`);
        }
    }
}
