/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import { getCustomApiKeys, saveCustomApiKeys } from './geminiService';

export interface KieOmniVideoRequest {
    image: string; // Base64 data URL or Image URL
    prompt?: string;
    aspectRatio?: '9:16' | '16:9' | '1:1';
    durationSeconds?: number;
}

export interface KieOmniVideoResponse {
    status: 'COMPLETED' | 'PROCESSING' | 'FAILED';
    videoUrl?: string;
    jobId?: string;
    message?: string;
}

/**
 * Builds the high-impact Google Omni prompt for dynamic character life,
 * cloth wave physics and animated era outfit transitions.
 */
export function buildKieOmniPrompt(customNote?: string): string {
    return [
        `Google Omni Cinematic Living Character & Outfit Transformation Video.`,
        `Subject from the input image is brought fully to life with organic micro-movements: natural breathing, subtle head tilt, eye contact, and hair swaying in the breeze.`,
        `Keep the exact facial identity and features 100% consistent.`,
        `Animate the clothing dynamically: The subject's clothes seamlessly morph and animate across historical eras: starting from modern attire, transforming into a 1920s Great Gatsby flapper dress with flowing pearl fringe, then into an ornate gold-embroidered 1550 Ottoman imperial velvet kaftan, then into an 1885 Wild West leather vest with silver star badge, and finally into a 2077 Cyberpunk neon illuminated jacket.`,
        `Realistic textile physics, fabric flutter in wind, smooth morphing lighting, 9:16 vertical reels aspect ratio, 4K 60fps ultra-realistic motion.`,
        customNote ? `Director instruction: ${customNote}.` : ''
    ].filter(Boolean).join(' ');
}

/**
 * Calls Kie.ai Google Omni video/multimodal endpoint
 */
export async function generateKieOmniVideo(request: KieOmniVideoRequest): Promise<KieOmniVideoResponse> {
    const { kieKey, geminiKey } = getCustomApiKeys();
    const activeKey = kieKey || geminiKey;
    const prompt = buildKieOmniPrompt(request.prompt);

    const match = request.image.match(/^data:(image\/\w+);base64,(.*)$/);
    const mimeType = match ? match[1] : 'image/jpeg';
    const base64Data = match ? match[2] : '';

    if (!activeKey) {
        return {
            status: 'FAILED',
            message: 'Kie.ai API Anahtarı bulunamadı. Lütfen anahtarınızı girin.'
        };
    }

    // 1. Try Kie.ai Google Omni / Veo Endpoint
    try {
        console.log('[Kie.ai Omni] Google Omni API çağrılıyor...');
        const endpoint = 'https://api.kie.ai/v1/videos/generations';
        const res = await fetch(endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${activeKey}`
            },
            body: JSON.stringify({
                model: 'google/omni',
                prompt: prompt,
                image: `data:${mimeType};base64,${base64Data}`,
                aspect_ratio: request.aspectRatio || '9:16',
                duration: request.durationSeconds || 6
            })
        });

        if (res.ok) {
            const data = await res.json();
            if (data.video_url || data.url || data.data?.[0]?.url) {
                return {
                    status: 'COMPLETED',
                    videoUrl: data.video_url || data.url || data.data?.[0]?.url
                };
            }
            if (data.id || data.job_id || data.task_id) {
                return {
                    status: 'PROCESSING',
                    jobId: data.id || data.job_id || data.task_id
                };
            }
        }
    } catch (err) {
        console.warn('[Kie.ai Omni] İlk endpoint denemesi başarısız, yedek deniyor...', err);
    }

    // 2. Fallback Kie.ai Chat / Completions with Google Omni Multimodal
    try {
        const chatEndpoint = 'https://api.kie.ai/v1/chat/completions';
        const res = await fetch(chatEndpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${activeKey}`
            },
            body: JSON.stringify({
                model: 'google/omni',
                messages: [
                    {
                        role: 'user',
                        content: [
                            { type: 'text', text: prompt },
                            {
                                type: 'image_url',
                                image_url: { url: `data:${mimeType};base64,${base64Data}` }
                            }
                        ]
                    }
                ],
                max_tokens: 1000
            })
        });

        if (res.ok) {
            const data = await res.json();
            const textResponse = data.choices?.[0]?.message?.content || '';
            const urlMatch = textResponse.match(/https:\/\/[^\s]+\.(mp4|webm)/);
            if (urlMatch) {
                return { status: 'COMPLETED', videoUrl: urlMatch[0] };
            }
        }
    } catch (err) {
        console.warn('[Kie.ai Omni] Chat fallback hatası:', err);
    }

    return {
        status: 'FAILED',
        message: 'Kie.ai Google Omni video oluşturma tamamlanamadı.'
    };
}
