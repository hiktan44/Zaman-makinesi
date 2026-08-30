/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import React, { useEffect, useRef, useState } from 'react';
import { ERAS } from '../constants/eraConstants';
import { playCameraShutter, playSuccess, playTick, playWarp } from '../lib/sfxUtils';

interface VideoStudioPageProps {
    images: { eraId: string; url: string }[];
    originalImage: string | null;
    onNavigateToCockpit: () => void;
}

// Robust image loader with error handling
function loadImage(src: string): Promise<HTMLImageElement> {
    return new Promise((resolve) => {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.onload = () => resolve(img);
        img.onerror = () => {
            console.warn('Image failed to load in Video Studio, fallback used:', src);
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

export default function VideoStudioPage({
    images,
    originalImage,
    onNavigateToCockpit
}: VideoStudioPageProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [isPlaying, setIsPlaying] = useState(true);
    const [speed, setSpeed] = useState<number>(2000); // ms per era
    const [isRecording, setIsRecording] = useState(false);
    const [recordProgress, setRecordProgress] = useState(0);
    const [progress, setProgress] = useState(0);
    const [activeTimelineIds, setActiveTimelineIds] = useState<string[]>([]);
    const [loadedImgMap, setLoadedImgMap] = useState<Record<string, HTMLImageElement>>({});
    const animFrameRef = useRef<number | null>(null);

    // Fallback curated demo portraits
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

    // Initialize timeline ids
    useEffect(() => {
        if (activeTimelineIds.length === 0) {
            setActiveTimelineIds(allAvailableItems.map(i => i.eraId));
        }
    }, [allAvailableItems.length]);

    // Preload all active images
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

        return () => { isMounted = false; };
    }, [allAvailableItems]);

    const activeItems = allAvailableItems.filter(i => activeTimelineIds.includes(i.eraId));

    const toggleItem = (id: string) => {
        playTick();
        setActiveTimelineIds(prev =>
            prev.includes(id) ? (prev.length > 2 ? prev.filter(x => x !== id) : prev) : [...prev, id]
        );
    };

    // Draw single video frame
    const drawVideoFrame = (
        ctx: CanvasRenderingContext2D,
        w: number,
        h: number,
        slideIndex: number,
        nextIndex: number,
        slideProgress: number
    ) => {
        const currentItem = activeItems[slideIndex];
        const nextItem = activeItems[nextIndex];

        const currentImg = currentItem ? loadedImgMap[currentItem.eraId] : null;
        const nextImg = nextItem ? loadedImgMap[nextItem.eraId] : null;

        // Background
        ctx.fillStyle = '#030712';
        ctx.fillRect(0, 0, w, h);

        // Draw current image
        if (currentImg && currentImg.complete && currentImg.naturalWidth > 0) {
            ctx.globalAlpha = 1;
            drawImageProp(ctx, currentImg, 0, 0, w, h, 0.5, 0.5);
        }

        // Crossfade into next image (last 35% of slide time)
        const fadeStart = 0.65;
        if (slideProgress > fadeStart && nextImg && nextImg.complete && nextImg.naturalWidth > 0) {
            const alpha = (slideProgress - fadeStart) / (1 - fadeStart);
            ctx.globalAlpha = Math.min(1, Math.max(0, alpha));
            drawImageProp(ctx, nextImg, 0, 0, w, h, 0.5, 0.5);
        }

        ctx.globalAlpha = 1;

        // Cinematic Vignette
        const grad = ctx.createRadialGradient(w / 2, h / 2, h * 0.25, w / 2, h / 2, h * 0.7);
        grad.addColorStop(0, 'rgba(0,0,0,0)');
        grad.addColorStop(1, 'rgba(0,0,0,0.65)');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, w, h);

        // Time Travel Top Header
        ctx.fillStyle = 'rgba(15, 23, 42, 0.8)';
        ctx.fillRect(40, 60, w - 80, 110);
        ctx.strokeStyle = 'rgba(251, 191, 36, 0.6)';
        ctx.lineWidth = 3;
        ctx.strokeRect(40, 60, w - 80, 110);

        ctx.fillStyle = '#fbbf24';
        ctx.font = 'bold 36px monospace';
        ctx.textAlign = 'center';
        ctx.fillText('⚡ ZAMAN MAKİNESİ — TIMELAPSE', w / 2, 115);
        ctx.fillStyle = '#ffffff';
        ctx.font = '22px monospace';
        ctx.fillText('9:16 VERTICAL CHRONO MORPH', w / 2, 150);

        // Lower Era Title Banner
        if (currentItem) {
            ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
            ctx.fillRect(40, h - 230, w - 80, 130);
            ctx.strokeStyle = 'rgba(251, 191, 36, 0.7)';
            ctx.lineWidth = 3;
            ctx.strokeRect(40, h - 230, w - 80, 130);

            ctx.fillStyle = '#fbbf24';
            ctx.font = 'bold 44px sans-serif';
            ctx.fillText(currentItem.title, w / 2, h - 160);

            ctx.fillStyle = '#94a3b8';
            ctx.font = '24px monospace';
            ctx.fillText(`KARE: ${slideIndex + 1} / ${activeItems.length}`, w / 2, h - 120);
        }
    };

    // Live Canvas Loop
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

            drawVideoFrame(ctx, canvas.width, canvas.height, slideIndex, nextIndex, slideProgress);

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

    // High-Precision Video Export Engine
    const handleRecordAndDownload = async () => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        playWarp();
        setIsRecording(true);
        setRecordProgress(0);

        try {
            const { mimeType, extension } = getSupportedMimeType();
            const stream = canvas.captureStream(30);
            
            const recorderOptions: MediaRecorderOptions = {
                videoBitsPerSecond: 6000000
            };
            if (mimeType) {
                recorderOptions.mimeType = mimeType;
            }

            const mediaRecorder = new MediaRecorder(stream, recorderOptions);
            const chunks: Blob[] = [];

            mediaRecorder.ondataavailable = (e) => {
                if (e.data && e.data.size > 0) {
                    chunks.push(e.data);
                }
            };

            mediaRecorder.onstop = () => {
                const finalBlob = new Blob(chunks, { type: mimeType || 'video/webm' });
                const url = URL.createObjectURL(finalBlob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `zaman-makinesi-timelapse-9x16.${extension}`;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                playSuccess();
                setIsRecording(false);
                setRecordProgress(100);
            };

            mediaRecorder.start(100);

            // Deterministic animation render for recording
            const ctx = canvas.getContext('2d')!;
            const totalDuration = activeItems.length * speed;
            const fps = 30;
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

                drawVideoFrame(ctx, canvas.width, canvas.height, slideIndex, nextIndex, slideProgress);

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
            alert('Tarayıcınızda video kaydı başlatılamadı. Lütfen Chrome, Edge veya güncel bir Safari tarayıcısı kullanın.');
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
                                9:16 VİDEO MORPH & REELS STÜDYOSU
                            </h2>
                            <span className="bg-cyan-500 text-slate-950 text-[10px] font-black px-2 py-0.5 rounded-full uppercase">
                                TIKTOK & REELS
                            </span>
                        </div>
                        <p className="text-xs text-slate-400">
                            Fotoğrafınızdan çağlar boyu kesintisiz akıp giden dikey sosyal medya timelapse videosu oluşturun.
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

            {/* Studio Layout: Video Preview Left, Timeline Manager Right */}
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

                        {/* Top live badge */}
                        <div className="absolute top-4 right-4 bg-red-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 animate-pulse">
                            <span className="w-1.5 h-1.5 rounded-full bg-white"></span>
                            <span>{isRecording ? `KAYDEDİLİYOR %${recordProgress}` : '9:16 REELS CANLI'}</span>
                        </div>

                        {/* Bottom Floating Controls */}
                        <div className="absolute bottom-4 inset-x-4 flex items-center justify-between gap-2 p-2.5 rounded-2xl bg-slate-950/80 backdrop-blur-md border border-slate-800">
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
                                    className="h-full bg-gradient-to-r from-amber-400 to-cyan-400 transition-all duration-100"
                                    style={{ width: `${(isRecording ? recordProgress / 100 : progress) * 100}%` }}
                                />
                            </div>

                            <button
                                disabled={isRecording}
                                onClick={() => {
                                    playTick();
                                    setSpeed(prev => (prev === 2000 ? 1200 : prev === 1200 ? 3000 : 2000));
                                }}
                                className="px-2.5 py-1 rounded-lg bg-slate-800 text-[10px] font-mono font-bold text-amber-300 hover:bg-slate-700 transition cursor-pointer"
                            >
                                {speed === 1200 ? '⚡ HIZLI' : speed === 3000 ? '🐌 SİNEMA' : '⏱ NORMAL'}
                            </button>
                        </div>
                    </div>

                    {/* Big Download Button */}
                    <button
                        disabled={isRecording}
                        onClick={handleRecordAndDownload}
                        className="w-full max-w-[340px] mt-4 py-3.5 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-black text-sm shadow-xl shadow-cyan-500/20 active:scale-95 transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                    >
                        <span>{isRecording ? '⏳' : '📥'}</span>
                        <span>{isRecording ? `Video İşleniyor (%${recordProgress})...` : '9:16 Video Olarak İndir (Reels / TikTok)'}</span>
                    </button>
                </div>

                {/* RIGHT: Timeline & Era Customization */}
                <div className="lg:col-span-7 flex flex-col space-y-6">
                    {/* Control Card */}
                    <div className="rounded-3xl bg-slate-900/90 border border-slate-800 p-6 space-y-4">
                        <div className="flex items-center justify-between">
                            <h3 className="text-base font-black text-white flex items-center gap-2">
                                <span>🎞️</span> Video Zaman Tüneli & Sıralama
                            </h3>
                            <span className="text-xs text-amber-400 font-mono font-bold">
                                {activeItems.length} Çağ Seçili
                            </span>
                        </div>

                        <p className="text-xs text-slate-400">
                            Videoda görünmesini istediğiniz çağları seçin veya çıkarın. Akıcı bir video için en az 3 çağ önerilir.
                        </p>

                        {/* Era Checkboxes / Chips */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
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
                                            <div className="text-[10px] text-amber-300 font-mono">
                                                Kare #{idx + 1}
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

                    {/* Features Card */}
                    <div className="rounded-3xl bg-slate-900/90 border border-slate-800 p-6 space-y-4">
                        <h4 className="text-sm font-black text-white flex items-center gap-2">
                            <span>✨</span> 9:16 Video Özellikleri
                        </h4>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                            <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
                                <div className="font-bold text-cyan-400">📱 1080 x 1920 Dikey</div>
                                <p className="text-[11px] text-slate-400">Instagram Reels, TikTok & YouTube Shorts uyumlu</p>
                            </div>
                            <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
                                <div className="font-bold text-amber-400">⚡ Kesintisiz Morph</div>
                                <p className="text-[11px] text-slate-400">Fotoğraflar arası sinematik yumuşak geçiş</p>
                            </div>
                            <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
                                <div className="font-bold text-emerald-400">📜 Tarihi HUD Başlıklar</div>
                                <p className="text-[11px] text-slate-400">Her dönemin yılı ve başlığı ekrana yazılır</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
