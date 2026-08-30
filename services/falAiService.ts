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
    onProgress?: (message: string) => void;
}

export interface FalAiVideoResponse {
    status: 'COMPLETED' | 'PROCESSING' | 'FAILED';
    videoUrl?: string;
    requestId?: string;
    message?: string;
}

/**
 * Builds the hyper-realistic, action-oriented prompt specifically tuned for
 * Image-to-Video models (Veo 2, Kling 1.5, Minimax, Luma).
 */
export function buildFalOmniPrompt(customNote?: string): string {
    return [
        `Cinematic ultra-realistic 9:16 portrait video starting directly from the input photo.`,
        `The person in the photo comes to life immediately: breathing deeply with natural chest expansion, smiling warmly, making direct eye contact, with natural head movement and wind blowing dynamically through their hair.`,
        `Dramatically transform the clothing in real time with continuous motion:`,
        `A glowing vertical sweep of golden and cyan temporal energy washes over the person's torso. As this glowing light passes over the body, their clothes dynamically morph across historical eras:`,
        `1. Modern clothing magically dissolves into an authentic 1920s Great Gatsby vintage beaded dress with swaying pearl necklaces and shimmering fringe tassels.`,
        `2. Then seamlessly transforms into a 1550 Ottoman imperial silk velvet kaftan embroidered with golden thread and royal emerald brooches.`,
        `3. Then shifts into an 1885 Wild West cowboy leather vest with a shining silver sheriff star.`,
        `4. Finally electrifies into a 2077 Cyberpunk neon illuminated tech jacket with pulsing cyber circuits.`,
        `The facial features, gaze, identity, and background remain 100% stable and consistent.`,
        `Continuous slow push-in camera, hyperrealistic cloth physics, rich fabric wrinkling and flowing, masterpiece quality, 60fps, 4K render.`,
        customNote ? `Director note: ${customNote}.` : ''
    ].filter(Boolean).join(' ');
}

/**
 * Uploads a base64 image to Fal.ai storage if needed, or returns the data URI
 */
async function uploadToFalStorage(base64DataUrl: string, apiKey: string): Promise<string> {
    if (!base64DataUrl.startsWith('data:')) {
        return base64DataUrl;
    }

    try {
        const authHeader = apiKey.startsWith('Key ') ? apiKey : `Key ${apiKey}`;
        const match = base64DataUrl.match(/^data:(image\/\w+);base64,(.*)$/);
        if (!match) return base64DataUrl;

        const mimeType = match[1];
        const binaryString = atob(match[2]);
        const bytes = new Uint8Array(binaryString.length);
        for (let i = 0; i < binaryString.length; i++) {
            bytes[i] = binaryString.charCodeAt(i);
        }
        const blob = new Blob([bytes], { type: mimeType });

        // Request upload url
        const initRes = await fetch('https://rest.alpha.fal.ai/storage/upload/initiate', {
            method: 'POST',
            headers: {
                'Authorization': authHeader,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                file_name: `portrait_${Date.now()}.${mimeType.split('/')[1] || 'jpg'}`,
                content_type: mimeType
            })
        });

        if (initRes.ok) {
            const initData = await initRes.json();
            if (initData.upload_url && initData.file_url) {
                await fetch(initData.upload_url, {
                    method: 'PUT',
                    headers: { 'Content-Type': mimeType },
                    body: blob
                });
                return initData.file_url;
            }
        }
    } catch (e) {
        console.warn('[Fal.ai Storage] Upload denemesi başarısız, data URI kullanılıyor:', e);
    }

    return base64DataUrl;
}

/**
 * Executes an image-to-video generation job on Fal.ai with automatic queue polling
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
    const targetModel = request.model || 'fal-ai/veo-2';

    try {
        request.onProgress?.('[1/3] Fotoğraf hazırlanıyor ve Fal.ai modeline gönderiliyor...');
        const imageUrl = await uploadToFalStorage(request.image, falKey);

        console.log(`[Fal.ai] Model çağrılıyor: ${targetModel}`);
        
        // Prepare comprehensive payload matching all Fal image-to-video models
        const payload: Record<string, any> = {
            prompt: prompt,
            image_url: imageUrl,
            first_frame_image: imageUrl,
            image: imageUrl,
            aspect_ratio: request.aspectRatio || '9:16',
            duration: request.duration || '5'
        };

        // 1. Submit Request to Fal Queue
        const queueUrl = `https://queue.fal.run/${targetModel}`;
        const submitRes = await fetch(queueUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': authHeader
            },
            body: JSON.stringify(payload)
        });

        if (!submitRes.ok) {
            const errText = await submitRes.text();
            throw new Error(`Fal.ai Kuyruk Hatası (${submitRes.status}): ${errText}`);
        }

        const submitData = await submitRes.json();
        const requestId = submitData.request_id;
        const responseUrl = submitData.response_url || `https://queue.fal.run/${targetModel}/requests/${requestId}`;
        const statusUrl = submitData.status_url || `https://queue.fal.run/${targetModel}/requests/${requestId}/status`;

        console.log(`[Fal.ai] İşlem kuyruğa alındı (Request ID: ${requestId}).`);
        request.onProgress?.(`[2/3] Model çalışıyor (Kuyruk ID: ${requestId.substring(0, 8)}...)...`);

        // 2. Poll Status until completed (max 120 seconds)
        const startTime = Date.now();
        const maxWaitMs = 120000;
        let pollCount = 0;

        while (Date.now() - startTime < maxWaitMs) {
            await new Promise(resolve => setTimeout(resolve, 3000));
            pollCount++;

            const pollRes = await fetch(statusUrl, {
                headers: { 'Authorization': authHeader }
            });

            if (!pollRes.ok) continue;

            const pollData = await pollRes.json();
            const status = pollData.status || 'IN_PROGRESS';
            console.log(`[Fal.ai] Durum: ${status} (Yoklama: ${pollCount})`);

            if (status === 'IN_QUEUE') {
                request.onProgress?.(`[2/3] Sırada bekleniyor (Sıra pozisyonu: ${pollData.queue_position || 'Öncelikli'})...`);
            } else if (status === 'IN_PROGRESS') {
                const logs = pollData.logs?.map((l: any) => l.message).join(' ') || '';
                request.onProgress?.(`[2/3] AI Canlı Kareleri ve Kıyafet Dönüşümünü İşliyor (${pollCount * 3}s)...`);
            } else if (status === 'COMPLETED') {
                request.onProgress?.('[3/3] Video tamamlandı, indiriliyor...');
                
                // Fetch final result
                const resultRes = await fetch(responseUrl, {
                    headers: { 'Authorization': authHeader }
                });

                if (resultRes.ok) {
                    const resultData = await resultRes.json();
                    const videoUrl = resultData.video?.url || resultData.video_url || resultData.output?.url || resultData.data?.video?.url;
                    if (videoUrl) {
                        return { status: 'COMPLETED', videoUrl: videoUrl };
                    }
                }
                break;
            } else if (status === 'FAILED') {
                throw new Error(`Fal.ai işlemi başarısız oldu: ${pollData.error || pollData.message || 'Bilinmeyen hata'}`);
            }
        }

        return {
            status: 'PROCESSING',
            requestId: requestId,
            message: 'Fal.ai işlemi zaman aşımına uğradı veya devam ediyor.'
        };
    } catch (err: any) {
        console.warn('[Fal.ai] Video üretim hatası:', err);
        return {
            status: 'FAILED',
            message: err.message || 'Fal.ai API çağrısı sırasında bir hata oluştu.'
        };
    }
}
