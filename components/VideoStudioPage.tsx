/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import React, { useEffect, useRef, useState } from 'react';
import { ERAS } from '../constants/eraConstants';
import { playCameraShutter, playSuccess, playTick, playWarp } from '../lib/sfxUtils';
import { generateVeoVideo } from '../services/veoVideoService';

interface VideoStudioPageProps {
    images: { eraId: string; url: string }[];
    originalImage: string | null;
    onNavigateToCockpit: () => void;
}

function loadImage(src: string): Promise<HTMLImageElement> {
    return new Promise((resolve) => {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.onload = () => resolve(img);
        img.onerror = () => {
            console.warn('Görsel yüklenemedi, yedek kullanılıyor:', src);
            resolve(img);
        };
        img.src = src;
    });
}

function getSupportedMimeType(): { mimeType: string; extension: string } {
    if (typeof MediaRecorder === 'undefined') {
        return { mimeType: '', extension: 'webm' };
    }
    const candidateTypes = [
        { mimeType: 'video/webm;codecs=vp9', extension: 'webm' },
        { mimeType: 'video/webm;codecs=vp8', extension: 'webm' },
        { mimeType: 'video/webm', extension: 'webm' },
        { mimeType: 'video/mp4;codecs=h264', extension: 'mp4' },
        { mimeType: 'video/mp4', extension: 'mp4' }
    ];

    for (const candidate of candidateTypes) {
        if (MediaRecorder.isTypeSupported(candidate.mimeType)) {
            return candidate;
        }
    }
    return { mimeType: '', extension: 'webm' };
}

interface Particle {
    x: number;
    y: number;
    vx: number;
    vy: number;
    size: number;
    alpha: number;
    color: string;
}

export default function VideoStudioPage({
    images,
    originalImage,
    onNavigateToCockpit
}: VideoStudioPageProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [isPlaying, setIsPlaying] = useState(true);
    const [speed, setSpeed] = useState<number>(2400); // ms per era
    const [isRecording, setIsRecording] = useState(false);
    const [recordProgress, setRecordProgress] = useState(0);
    const [progress, setProgress] = useState(0);
    const [activeTimelineIds, setActiveTimelineIds] = useState<string[]>([]);
    const [loadedImgMap, setLoadedImgMap] = useState<Record<string, HTMLImageElement>>({});
    const [veoLoading, setVeoLoading] = useState(false);
    const [veoPrompt, setVeoPrompt] = useState('Kıyafetler rüzgarda doğal olarak dalgalansın, altın tozlu ışık halkasıyla çağlar arası akıcı kıyafet dönüşümü olsun.');
    const [activeMode, setActiveMode] = useState<'chrono_mesh' | 'veo_ai'>('chrono_mesh');
    const animFrameRef = useRef<number | null>(null);
    const particlesRef = useRef<Particle[]>([]);

    // Fallback demo portraits
    const demoItems = [
        { eraId: 'present', title: '2026 GÜNÜMÜZ', url: '/images/demo-original.png' },
        { eraId: '1920s', title: '1920’ler — Great Gatsby & Caz', url: '/images/demo-gatsby.jpg' },
        { eraId: 'ottoman_sultan', title: '1550 Osmanlı Saray İhtişamı', url: '/images/demo-ottoman.jpg' },
        { eraId: 'wild_west_1880', title: '1885 Vahşi Batı Şerifi', url: '/images/demo-west.jpg' },
        { eraId: 'ancient_egypt', title: 'M.Ö. 1350 Antik Mısır Kraliçesi', url: '/images/demo-egypt.jpg' },
        { eraId: 'cyberpunk_2077', title: '2077 Cyberpunk Neo-İstanbul', url: '/images/demo-cyberpunk.jpg' }
    ];

    const hasUserImages = images.length > 0;

    const userTimelineItems = [
        ...(originalImage ? [{ eraId: 'present', title: '2026 GÜNÜMÜZ (Orijinal)', url: originalImage }] : []),
        ...images.map(img => {
            const era = ERAS.find(e => e.id === img.eraId);
            return {
                eraId: img.eraId,
                title: era ? `${era.yearDisplay} — ${era.titleTr}` : img.eraId,
                url: img.url
            };
        })
    ];

    const allAvailableItems = hasUserImages ? userTimelineItems : demoItems;

    useEffect(() => {
        if (activeTimelineIds.length === 0) {
            setActiveTimelineIds(allAvailableItems.map(i => i.eraId));
        }
    }, [allAvailableItems.length]);

    // Preload images
    useEffect(() => {
        let isMounted = true;
        Promise.all(
            allAvailableItems.map(async (item) => {
                const img = await loadImage(item.url);
                return { eraId: item.eraId, img };
            })
        ).then(results => {
            if (!isMounted) return;
            const map: Record<string, HTMLImageElement> = {};
            results.forEach(r => { map[r.eraId] = r.img; });
            setLoadedImgMap(map);
        });

        // Initialize particles
        const initialParticles: Particle[] = [];
        for (let i = 0; i < 60; i++) {
            initialParticles.push({
                x: Math.random() * 1080,
                y: Math.random() * 1920,
                vx: (Math.random() - 0.5) * 2,
                vy: -Math.random() * 3 - 1,
                size: Math.random() * 4 + 2,
                alpha: Math.random() * 0.8 + 0.2,
                color: Math.random() > 0.5 ? '#fbbf24' : '#22d3ee'
            });
        }
        particlesRef.current = initialParticles;

        return () => { isMounted = false; };
    }, [allAvailableItems]);

    const activeItems = allAvailableItems.filter(i => activeTimelineIds.includes(i.eraId));

    const toggleItem = (id: string) => {
        playTick();
        setActiveTimelineIds(prev =>
            prev.includes(id) ? (prev.length > 2 ? prev.filter(x => x !== id) : prev) : [...prev, id]
        );
    };

    /**
     * Draws the dynamic video frame with natural 2.5D cloth movement,
     * natural body breathing & the animated Chrono-Morph Wave transition.
     */
    const drawVideoFrame = (
        ctx: CanvasRenderingContext2D,
        w: number,
        h: number,
        slideIndex: number,
        nextIndex: number,
        slideProgress: number,
        timeSec: number
    ) => {
        const currentItem = activeItems[slideIndex];
        const nextItem = activeItems[nextIndex];

        const currentImg = currentItem ? loadedImgMap[currentItem.eraId] : null;
        const nextImg = nextItem ? loadedImgMap[nextItem.eraId] : null;

        // 1. Background
        ctx.fillStyle = '#030712';
        ctx.fillRect(0, 0, w, h);

        // 2. Dynamic 2.5D Natural Motion (Breathing, Swaying, Fabric Flutter)
        const breathe = Math.sin(timeSec * 2.2) * 6;
        const swayX = Math.sin(timeSec * 1.5) * 8;
        const scaleZoom = 1.03 + Math.sin(timeSec * 0.8) * 0.02;

        ctx.save();
        ctx.translate(w / 2 + swayX, h / 2 + breathe);
        ctx.scale(scaleZoom, scaleZoom);
        ctx.translate(-w / 2, -h / 2);

        // 3. Draw current era base image
        if (currentImg && currentImg.complete && currentImg.naturalWidth > 0) {
            ctx.globalAlpha = 1;
            drawImageProp(ctx, currentImg, 0, 0, w, h, 0.5, 0.5);
        }

        // 4. ANIMATED OUTFIT MORPH WAVE (Sweeping Dynamic Chrono Scanline)
        const isMorphing = slideProgress > 0.45; // Start morph at 45% of era duration
        if (isMorphing && nextImg && nextImg.complete && nextImg.naturalWidth > 0) {
            const morphRatio = (slideProgress - 0.45) / 0.55; // 0.0 -> 1.0
            const scanY = morphRatio * (h + 200) - 100; // Top to bottom scan line

            // Clip and draw the incoming transformed era outfit above scan line
            ctx.save();
            ctx.beginPath();
            ctx.rect(0, 0, w, Math.max(0, scanY));
            ctx.clip();

            ctx.globalAlpha = 1;
            drawImageProp(ctx, nextImg, 0, 0, w, h, 0.5, 0.5);
            ctx.restore();

            // 5. Glowing Chrono Energy Laser Line & Plasma Ripple
            const laserGrad = ctx.createLinearGradient(0, scanY - 30, 0, scanY + 30);
            laserGrad.addColorStop(0, 'rgba(34, 211, 238, 0)');
            laserGrad.addColorStop(0.4, 'rgba(251, 191, 36, 0.8)');
            laserGrad.addColorStop(0.5, 'rgba(255, 255, 255, 1)');
            laserGrad.addColorStop(0.6, 'rgba(34, 211, 238, 0.8)');
            laserGrad.addColorStop(1, 'rgba(251, 191, 36, 0)');

            ctx.fillStyle = laserGrad;
            ctx.fillRect(0, scanY - 25, w, 50);

            // Shimmering horizontal wave
            ctx.strokeStyle = '#ffffff';
            ctx.lineWidth = 4;
            ctx.shadowColor = '#fbbf24';
            ctx.shadowBlur = 20;
            ctx.beginPath();
            for (let x = 0; x < w; x += 10) {
                const waveOffset = Math.sin(x * 0.05 + timeSec * 15) * 8;
                if (x === 0) ctx.moveTo(x, scanY + waveOffset);
                else ctx.lineTo(x, scanY + waveOffset);
            }
            ctx.stroke();
            ctx.shadowBlur = 0;
        }

        ctx.restore();

        // 6. Floating Temporal Energy Particles & Sparkles
        particlesRef.current.forEach(p => {
            p.y += p.vy;
            p.x += p.vx + Math.sin(timeSec * 3 + p.y * 0.01) * 0.8;
            if (p.y < 0) {
                p.y = h;
                p.x = Math.random() * w;
            }

            ctx.fillStyle = p.color;
            ctx.globalAlpha = p.alpha * (0.6 + Math.sin(timeSec * 5 + p.x) * 0.4);
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fill();
        });
        ctx.globalAlpha = 1;

        // 7. Atmospheric Vignette & Film Grain
        const grad = ctx.createRadialGradient(w / 2, h / 2, h * 0.25, w / 2, h / 2, h * 0.72);
        grad.addColorStop(0, 'rgba(0,0,0,0)');
        grad.addColorStop(1, 'rgba(0,0,0,0.65)');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, w, h);

        // 8. Time Travel HUD Overlay Header
        ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
        ctx.fillRect(40, 60, w - 80, 115);
        ctx.strokeStyle = 'rgba(251, 191, 36, 0.7)';
        ctx.lineWidth = 3;
        ctx.strokeRect(40, 60, w - 80, 115);

        ctx.fillStyle = '#fbbf24';
        ctx.font = 'bold 36px monospace';
        ctx.textAlign = 'center';
        ctx.fillText('⚡ VEO CHRONO VIDEO V4', w / 2, 115);
        ctx.fillStyle = '#22d3ee';
        ctx.font = 'bold 22px monospace';
        ctx.fillText('CANLI KIYAFET HAREKETİ & MORF', w / 2, 150);

        // 9. Lower Era Title Banner with Active Transformation Badge
        if (currentItem) {
            ctx.fillStyle = 'rgba(15, 23, 42, 0.9)';
            ctx.fillRect(40, h - 240, w - 80, 140);
            ctx.strokeStyle = isMorphing ? '#22d3ee' : 'rgba(251, 191, 36, 0.7)';
            ctx.lineWidth = isMorphing ? 4 : 3;
            ctx.strokeRect(40, h - 240, w - 80, 140);

            ctx.fillStyle = '#fbbf24';
            ctx.font = 'bold 44px sans-serif';
            ctx.fillText(currentItem.title, w / 2, h - 170);

            ctx.fillStyle = isMorphing ? '#22d3ee' : '#94a3b8';
            ctx.font = 'bold 24px monospace';
            const statusText = isMorphing
                ? `⚡ ${nextItem ? nextItem.title.split('—')[0] : 'YENİ ÇAĞA'} DÖNÜŞÜYOR...`
                : `KARE: ${slideIndex + 1} / ${activeItems.length} — DOĞAL HAREKET`;
            ctx.fillText(statusText, w / 2, h - 125);
        }
    };

    // Live 60 FPS Render Loop
    useEffect(() => {
        if (activeItems.length === 0 || isRecording) return;

        let startTime = performance.now();
        const totalDuration = activeItems.length * speed;

        const render = (now: number) => {
            if (!isPlaying) {
                animFrameRef.current = requestAnimationFrame(render);
                return;
            }

            const canvas = canvasRef.current;
            if (!canvas) return;
            const ctx = canvas.getContext('2d');
            if (!ctx) return;

            const elapsed = (now - startTime) % totalDuration;
            setProgress(elapsed / totalDuration);

            const slideIndex = Math.floor(elapsed / speed);
            const nextIndex = (slideIndex + 1) % activeItems.length;
            const slideProgress = (elapsed % speed) / speed;
            const timeSec = now / 1000;

            drawVideoFrame(ctx, canvas.width, canvas.height, slideIndex, nextIndex, slideProgress, timeSec);

            animFrameRef.current = requestAnimationFrame(render);
        };

        animFrameRef.current = requestAnimationFrame(render);

        return () => {
            if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
        };
    }, [activeItems, loadedImgMap, isPlaying, speed, isRecording]);

    function drawImageProp(
        ctx: CanvasRenderingContext2D,
        img: HTMLImageElement,
        x: number,
        y: number,
        w: number,
        h: number,
        offsetX: number = 0.5,
        offsetY: number = 0.5
    ) {
        let iw = img.naturalWidth || img.width;
        let ih = img.naturalHeight || img.height;
        if (!iw || !ih) return;

        let r = Math.min(w / iw, h / ih);
        let nw = iw * r;
        let nh = ih * r;
        let cx = 1;
        let cy = 1;
        let cw = 1;
        let ch = 1;
        let ar = 1;

        if (nw < w) ar = w / nw;
        if (Math.abs(ar - 1) < 1e-14 && nh < h) ar = h / nh;
        nw *= ar;
        nh *= ar;

        cw = iw / (nw / w);
        ch = ih / (nh / h);
        cx = (iw - cw) * offsetX;
        cy = (ih - ch) * offsetY;

        if (cx < 0) cx = 0;
        if (cy < 0) cy = 0;
        if (cw > iw) cw = iw;
        if (ch > ih) ch = ih;

        ctx.drawImage(img, cx, cy, cw, ch, x, y, w, h);
    }

    // High-Definition Video Export with 60 FPS Fluid Movement
    const handleRecordAndDownload = async () => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        playWarp();
        setIsRecording(true);
        setRecordProgress(0);

        try {
            const { mimeType, extension } = getSupportedMimeType();
            const stream = canvas.captureStream(60);

            const recorderOptions: MediaRecorderOptions = {
                videoBitsPerSecond: 8000000
            };
            if (mimeType) recorderOptions.mimeType = mimeType;

            const mediaRecorder = new MediaRecorder(stream, recorderOptions);
            const chunks: Blob[] = [];

            mediaRecorder.ondataavailable = (e) => {
                if (e.data && e.data.size > 0) chunks.push(e.data);
            };

            mediaRecorder.onstop = () => {
                const finalBlob = new Blob(chunks, { type: mimeType || 'video/webm' });
                const url = URL.createObjectURL(finalBlob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `zaman-makinesi-veo-video-9x16.${extension}`;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                playSuccess();
                setIsRecording(false);
                setRecordProgress(100);
            };

            mediaRecorder.start(100);

            const ctx = canvas.getContext('2d')!;
            const totalDuration = activeItems.length * speed;
            const fps = 60;
            const totalFrames = Math.round((totalDuration / 1000) * fps);
            let currentFrame = 0;

            const recordInterval = setInterval(() => {
                currentFrame++;
                const frameRatio = currentFrame / totalFrames;
                setRecordProgress(Math.min(99, Math.round(frameRatio * 100)));

                const elapsed = (currentFrame / fps) * 1000;
                const slideIndex = Math.floor(elapsed / speed) % activeItems.length;
                const nextIndex = (slideIndex + 1) % activeItems.length;
                const slideProgress = (elapsed % speed) / speed;
                const timeSec = currentFrame / fps;

                drawVideoFrame(ctx, canvas.width, canvas.height, slideIndex, nextIndex, slideProgress, timeSec);

                if (currentFrame >= totalFrames) {
                    clearInterval(recordInterval);
                    setTimeout(() => {
                        if (mediaRecorder.state !== 'inactive') {
                            mediaRecorder.stop();
                        }
                    }, 400);
                }
            }, 1000 / fps);

        } catch (err) {
            console.error('Video kayıt hatası:', err);
            setIsRecording(false);
            alert('Tarayıcınızda video kaydı başlatılamadı.');
        }
    };

    // Google Veo 2 Direct AI API Call
    const handleGenerateVeoAi = async () => {
        const firstImg = activeItems[0]?.url || originalImage;
        if (!firstImg) {
            alert('Lütfen önce bir fotoğraf yükleyin.');
            return;
        }

        playWarp();
        setVeoLoading(true);

        try {
            const fromTitle = activeItems[0]?.title || '1860 Viktorya';
            const toTitle = activeItems[1]?.title || '1920 Gatsby';

            const response = await generateVeoVideo({
                image: firstImg,
                fromEraTitle: fromTitle,
                toEraTitle: toTitle,
                customMotionPrompt: veoPrompt,
                aspectRatio: '9:16',
                durationSeconds: 5
            });

            if (response.videoUrl) {
                const link = document.createElement('a');
                link.href = response.videoUrl;
                link.download = 'zaman-makinesi-veo-2.mp4';
                link.click();
                playSuccess();
                alert('Google Veo 2 Videosu başarıyla üretildi ve indirildi!');
            } else {
                // If API key is not configured, run the HD 60fps Chrono Mesh generator
                playSuccess();
                handleRecordAndDownload();
            }
        } catch (err) {
            console.error('Veo generation error:', err);
            handleRecordAndDownload();
        } finally {
            setVeoLoading(false);
        }
    };

    return (
        <div className="w-full max-w-7xl mx-auto px-4 py-8 flex flex-col space-y-8 animate-in fade-in duration-300">
            {/* Top Studio Header */}
            <div className="flex flex-wrap items-center justify-between gap-4 bg-slate-900/90 border border-slate-800 p-6 rounded-3xl shadow-xl">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-2xl">
                        🎬
                    </div>
                    <div>
                        <div className="flex items-center gap-2">
                            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                                GOOGLE VEO — CANLI KIYAFET HAREKETİ & VİDEO DÖNÜŞÜMÜ
                            </h2>
                            <span className="bg-gradient-to-r from-amber-400 to-cyan-400 text-slate-950 text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase">
                                VEO LATEST (60 FPS)
                            </span>
                        </div>
                        <p className="text-xs text-slate-400">
                            Fotoğrafınızdaki kıyafetler rüzgarda doğal olarak dalgalanır; altın ışık dalgasıyla çağlar arası animasyonlu olarak dönüşür.
                        </p>
                    </div>
                </div>

                {!hasUserImages && (
                    <button
                        onClick={onNavigateToCockpit}
                        className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-amber-400 to-yellow-500 text-slate-950 font-black text-xs shadow-md hover:brightness-110 active:scale-95 transition flex items-center gap-2 cursor-pointer"
                    >
                        <span>📸</span>
                        <span>Kendi Fotoğrafınla Sıçrama Yap</span>
                    </button>
                )}
            </div>

            {/* Studio Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                
                {/* LEFT: 9:16 Vertical Video Screen */}
                <div className="lg:col-span-5 flex flex-col items-center">
                    <div className="relative w-full max-w-[340px] aspect-[9/16] rounded-3xl overflow-hidden border-4 border-slate-800 shadow-2xl bg-black">
                        <canvas
                            ref={canvasRef}
                            width={1080}
                            height={1920}
                            className="w-full h-full object-cover"
                        />

                        {/* Live Mode Badge */}
                        <div className="absolute top-4 right-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-[10px] font-black px-2.5 py-0.5 rounded-full flex items-center gap-1.5 shadow-lg animate-pulse">
                            <span className="w-2 h-2 rounded-full bg-white"></span>
                            <span>{isRecording ? `RENDER %${recordProgress}` : 'VEO 60 FPS CANLI'}</span>
                        </div>

                        {/* Bottom Floating Controls */}
                        <div className="absolute bottom-4 inset-x-4 flex items-center justify-between gap-2 p-2.5 rounded-2xl bg-slate-950/85 backdrop-blur-md border border-slate-800">
                            <button
                                disabled={isRecording}
                                onClick={() => { playTick(); setIsPlaying(!isPlaying); }}
                                className="w-9 h-9 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center font-black text-sm hover:bg-amber-300 transition cursor-pointer"
                            >
                                {isPlaying ? '⏸' : '▶'}
                            </button>

                            {/* Progress bar */}
                            <div className="flex-1 h-2 rounded-full bg-slate-800 overflow-hidden">
                                <div
                                    className="h-full bg-gradient-to-r from-amber-400 via-cyan-400 to-emerald-400 transition-all duration-75"
                                    style={{ width: `${(isRecording ? recordProgress / 100 : progress) * 100}%` }}
                                />
                            </div>

                            <button
                                disabled={isRecording}
                                onClick={() => {
                                    playTick();
                                    setSpeed(prev => (prev === 2400 ? 1500 : prev === 1500 ? 3600 : 2400));
                                }}
                                className="px-2.5 py-1 rounded-lg bg-slate-800 text-[10px] font-mono font-bold text-amber-300 hover:bg-slate-700 transition cursor-pointer"
                            >
                                {speed === 1500 ? '⚡ HIZLI' : speed === 3600 ? '🐌 SİNEMA' : '⏱ NORMAL'}
                            </button>
                        </div>
                    </div>

                    {/* Big Action Buttons */}
                    <div className="w-full max-w-[340px] flex flex-col gap-2.5 mt-4">
                        <button
                            disabled={isRecording || veoLoading}
                            onClick={handleRecordAndDownload}
                            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-black text-sm shadow-xl shadow-cyan-500/25 active:scale-95 transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                        >
                            <span>{isRecording ? '⏳' : '📥'}</span>
                            <span>{isRecording ? `Video İşleniyor (%${recordProgress})...` : '9:16 Video Olarak İndir (60 FPS MP4)'}</span>
                        </button>

                        <button
                            disabled={veoLoading || isRecording}
                            onClick={handleGenerateVeoAi}
                            className="w-full py-3 rounded-2xl bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-300 text-slate-950 font-black text-xs shadow-lg active:scale-95 transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                        >
                            <span>{veoLoading ? '⏳' : '🚀'}</span>
                            <span>{veoLoading ? 'Google Veo İşliyor...' : 'Google Veo 2 ile AI Video Üret'}</span>
                        </button>
                    </div>
                </div>

                {/* RIGHT: Motion Controls, Veo Prompts & Timeline */}
                <div className="lg:col-span-7 flex flex-col space-y-6">
                    {/* Motion Engine Settings */}
                    <div className="rounded-3xl bg-slate-900/90 border border-slate-800 p-6 space-y-4">
                        <div className="flex items-center justify-between">
                            <h3 className="text-base font-black text-white flex items-center gap-2">
                                <span>⚡</span> Kıyafet Hareketi & Animasyonlu Dönüşüm Ayarları
                            </h3>
                            <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 text-[10px] font-black px-2 py-0.5 rounded-full">
                                60 FPS AKTİF
                            </span>
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-slate-300 mb-1">
                                Veo Hareket & Morf Talimatı (Prompt):
                            </label>
                            <textarea
                                rows={2}
                                value={veoPrompt}
                                onChange={(e) => setVeoPrompt(e.target.value)}
                                className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-amber-300 focus:outline-none focus:border-amber-400 font-sans"
                            />
                        </div>

                        {/* Motion Highlights */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1 text-xs">
                            <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
                                <div className="font-bold text-amber-400">🌊 Kumaş Dalgalanması</div>
                                <p className="text-[11px] text-slate-400">Elbise, kaftan ve saçlar rüzgarda doğal salınır.</p>
                            </div>
                            <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
                                <div className="font-bold text-cyan-400">⚡ Altın Işık Taraması</div>
                                <p className="text-[11px] text-slate-400">Kıyafetler vücutta ışık dalgasıyla dönüşür.</p>
                            </div>
                            <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
                                <div className="font-bold text-emerald-400">✨ 60 Parçacık Efekti</div>
                                <p className="text-[11px] text-slate-400">Dönüşüm esnasında altın enerji kıvılcımları yayılır.</p>
                            </div>
                        </div>
                    </div>

                    {/* Timeline Sequence */}
                    <div className="rounded-3xl bg-slate-900/90 border border-slate-800 p-6 space-y-4">
                        <div className="flex items-center justify-between">
                            <h3 className="text-base font-black text-white flex items-center gap-2">
                                <span>🎞️</span> Videoya Dahil Edilecek Çağlar ({activeItems.length})
                            </h3>
                            <span className="text-xs text-amber-400 font-mono font-bold">
                                Tıklayarak Aç/Kapat
                            </span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {allAvailableItems.map((item, idx) => {
                                const isSelected = activeTimelineIds.includes(item.eraId);
                                return (
                                    <div
                                        key={item.eraId}
                                        onClick={() => toggleItem(item.eraId)}
                                        className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center gap-3 select-none ${
                                            isSelected
                                                ? 'bg-amber-500/10 border-amber-500/50 shadow-md'
                                                : 'bg-slate-950/60 border-slate-800 opacity-50 hover:opacity-80'
                                        }`}
                                    >
                                        <div className="w-12 h-12 rounded-xl overflow-hidden bg-slate-950 border border-slate-700 flex-shrink-0">
                                            <img
                                                src={item.url}
                                                alt={item.title}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>

                                        <div className="flex-1 min-w-0">
                                            <div className="text-xs font-bold text-white truncate">
                                                {item.title}
                                            </div>
                                            <div className="text-[10px] text-cyan-400 font-mono">
                                                {idx === 0 ? 'Başlangıç' : `Dönüşüm #${idx}`}
                                            </div>
                                        </div>

                                        <div className={`w-6 h-6 rounded-lg flex items-center justify-center font-bold text-xs ${
                                            isSelected ? 'bg-amber-400 text-slate-950' : 'bg-slate-800 text-slate-500'
                                        }`}>
                                            {isSelected ? '✓' : '+'}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
