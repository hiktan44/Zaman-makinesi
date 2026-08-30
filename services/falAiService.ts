/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import { getCustomApiKeys } from './geminiService';

export interface FalAiVideoRequest {
    image: string; // Base64 data URL or remote image URL
    prompt?: string;
    model?: string;
    aspectRatio?: '9:16' | '16:9' | '1:1';
    duration?: string;
}

export interface FalAiVideoResponse {
    status: 'COMPLETED' | 'PROCESSING' | 'FAILED';
    videoUrl?: string;
    requestId?: string;
    message?: string;
}

/**
 * Builds the high-fidelity prompt for Fal.ai Omni Latest / Veo 2:
 * Dynamic living person + seamless animated historical costume morphing
 */
export function buildFalOmniPrompt(customNote?: string): string {
    return [
        `Cinematic ultra-realistic 9:16 vertical video of the subject brought to life.`,
        `Subject maintains exact facial likeness and gaze while breathing naturally, micro-head swaying, and hair gently fluttering in the wind.`,
        `Dynamic animated outfit transformation: An organic golden and cyan temporal energy wave sweeps down the body, seamlessly morphing the clothing in real-time across historical eras: modern attire transforms into a 1920s Great Gatsby flapper dress with flowing pearl necklaces, then into an ornate gold-embroidered 1550 Ottoman imperial silk velvet kaftan, then into an 1885 Wild West leather frontier vest with silver badge, and finally into a glowing 2077 Cyberpunk neon jacket.`,
        `Realistic cloth motion and textile physics, photorealistic historical lighting, 4K resolution, 60fps cinematic smoothness.`,
        customNote ? `Additional director note: ${customNote}.` : ''
    ].filter(Boolean).join(' ');
}

/**
 * Executes a job on Fal.ai with automatic queue polling
 */
export async function generateFalAiVideo(request: FalAiVideoRequest): Promise<FalAiVideoResponse> {
    const { falKey } = getCustomApiKeys();

    if (!falKey) {
        return {
            status: 'FAILED',
            message: 'Fal.ai API Anahtarı (FAL_KEY) bulunamadı. Lütfen anahtarınızı girin.'
        };
    }

    const authHeader = falKey.startsWith('Key ') ? falKey : `Key ${falKey}`;
    const prompt = buildFalOmniPrompt(request.prompt);
    const targetModel = request.model || 'fal-ai/veo-2'; // or fal-ai/kling-video/v1.5/pro/image-to-video / omni-latest

    // Format image URL
    let imageUrl = request.image;

    try {
        console.log(`[Fal.ai] Model çağrılıyor: ${targetModel}`);
        
        // 1. Submit Request to Fal Queue
        const queueUrl = `https://queue.fal.run/${targetModel}`;
        const submitRes = await fetch(queueUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': authHeader
            },
            body: JSON.stringify({
                prompt: prompt,
                image_url: imageUrl,
                aspect_ratio: request.aspectRatio || '9:16',
                duration: request.duration || '5'
            })
        });

        if (!submitRes.ok) {
            const errText = await submitRes.text();
            throw new Error(`Fal.ai Kuyruk Hatası (${submitRes.status}): ${errText}`);
        }

        const submitData = await submitRes.json();
        const requestId = submitData.request_id;
        const responseUrl = submitData.response_url || `https://queue.fal.run/${targetModel}/requests/${requestId}`;
        const statusUrl = submitData.status_url || `https://queue.fal.run/${targetModel}/requests/${requestId}/status`;

        console.log(`[Fal.ai] İşlem kuyruğa alındı (Request ID: ${requestId}). Bekleniyor...`);

        // 2. Poll Status until completed (max 90 seconds)
        const startTime = Date.now();
        const maxWaitMs = 90000;

        while (Date.now() - startTime < maxWaitMs) {
            await new Promise(resolve => setTimeout(resolve, 2500));

            const pollRes = await fetch(statusUrl, {
                headers: { 'Authorization': authHeader }
            });

            if (!pollRes.ok) continue;

            const pollData = await pollRes.json();
            console.log(`[Fal.ai] Durum: ${pollData.status}`);

            if (pollData.status === 'COMPLETED') {
                // Fetch final result
                const resultRes = await fetch(responseUrl, {
                    headers: { 'Authorization': authHeader }
                });

                if (resultRes.ok) {
                    const resultData = await resultRes.json();
                    const videoUrl = resultData.video?.url || resultData.video_url || resultData.output?.url;
                    if (videoUrl) {
                        return { status: 'COMPLETED', videoUrl: videoUrl };
                    }
                }
                break;
            } else if (pollData.status === 'FAILED') {
                throw new Error(`Fal.ai işlemi başarısız oldu: ${pollData.error || 'Bilinmeyen hata'}`);
            }
        }

        return {
            status: 'PROCESSING',
            requestId: requestId,
            message: 'Fal.ai işlemi devam ediyor.'
        };
    } catch (err: any) {
        console.warn('[Fal.ai] Video üretim hatası:', err);
        return {
            status: 'FAILED',
            message: err.message || 'Fal.ai API çağrısı sırasında bir hata oluştu.'
        };
    }
}
