/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import React, { useEffect, useRef, useState } from 'react';
import { ERAS } from '../constants/eraConstants';
import { playSuccess, playTick, playWarp } from '../lib/sfxUtils';

interface VideoMorphModalProps {
    isOpen: boolean;
    onClose: () => void;
    images: { eraId: string; url: string }[];
    originalImage: string | null;
}

export default function VideoMorphModal({
    isOpen,
    onClose,
    images,
    originalImage
}: VideoMorphModalProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [isPlaying, setIsPlaying] = useState(true);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [progress, setProgress] = useState(0);
    const [isRecording, setIsRecording] = useState(false);
    const animFrameRef = useRef<number | null>(null);

    // Build timeline list: Original first, then generated era images
    const timelineItems = [
        ...(originalImage ? [{ eraId: 'present', title: '2026 GÜNÜMÜZ', url: originalImage }] : []),
        ...images.map(img => {
            const era = ERAS.find(e => e.id === img.eraId);
            return {
                eraId: img.eraId,
                title: era ? `${era.yearDisplay} — ${era.titleTr}` : img.eraId,
                url: img.url
            };
        })
    ];

    useEffect(() => {
        if (!isOpen || timelineItems.length === 0) return;

        let startTime = performance.now();
        const durationPerSlide = 2200; // ms per era
        const totalDuration = timelineItems.length * durationPerSlide;

        // Preload image elements
        const loadedImgs: HTMLImageElement[] = [];
        timelineItems.forEach(item => {
            const img = new Image();
            img.crossOrigin = 'anonymous';
            img.src = item.url;
            loadedImgs.push(img);
        });

        const render = (now: number) => {
            if (!isPlaying) {
                animFrameRef.current = requestAnimationFrame(render);
                return;
            }

            const elapsed = (now - startTime) % totalDuration;
            const currentItemIdx = Math.floor(elapsed / durationPerSlide);
            const nextItemIdx = (currentItemIdx + 1) % timelineItems.length;
            const slideProgress = (elapsed % durationPerSlide) / durationPerSlide;

            setCurrentIndex(currentItemIdx);
            setProgress(Math.round((elapsed / totalDuration) * 100));

            const canvas = canvasRef.current;
            if (canvas) {
                const ctx = canvas.getContext('2d');
                if (ctx) {
                    const width = canvas.width;
                    const height = canvas.height;

                    // Clear black
                    ctx.fillStyle = '#050508';
                    ctx.fillRect(0, 0, width, height);

                    const currImg = loadedImgs[currentItemIdx];
                    const nextImg = loadedImgs[nextItemIdx];

                    // Draw Cross-fade transition
                    if (currImg && currImg.complete) {
                        ctx.globalAlpha = 1;
                        drawImageProp(ctx, currImg, 0, 0, width, height);
                    }

                    // Smooth 30% fade transition at the end of each slide
                    if (slideProgress > 0.7 && nextImg && nextImg.complete) {
                        const fadeAlpha = (slideProgress - 0.7) / 0.3;
                        ctx.globalAlpha = fadeAlpha;
                        drawImageProp(ctx, nextImg, 0, 0, width, height);
                    }

                    ctx.globalAlpha = 1;

                    // Draw Cinematic Vignette
                    const grad = ctx.createRadialGradient(width / 2, height / 2, width / 3, width / 2, height / 2, height / 1.2);
                    grad.addColorStop(0, 'rgba(0,0,0,0)');
                    grad.addColorStop(1, 'rgba(0,0,0,0.7)');
                    ctx.fillStyle = grad;
                    ctx.fillRect(0, 0, width, height);

                    // Draw Retro Scanlines
                    ctx.fillStyle = 'rgba(255, 255, 255, 0.03)';
                    for (let y = 0; y < height; y += 4) {
                        ctx.fillRect(0, y, width, 1.5);
                    }

                    // Draw Bottom Title Badge
                    const currentTitle = timelineItems[currentItemIdx]?.title || '';
                    ctx.fillStyle = 'rgba(10, 10, 15, 0.85)';
                    ctx.roundRect?.(24, height - 100, width - 48, 64, 16);
                    ctx.fill();
                    ctx.strokeStyle = 'rgba(245, 158, 11, 0.6)';
                    ctx.lineWidth = 2;
                    ctx.stroke();

                    // Text
                    ctx.fillStyle = '#f59e0b';
                    ctx.font = 'bold 20px -apple-system, BlinkMacSystemFont, sans-serif';
                    ctx.textAlign = 'center';
                    ctx.fillText(currentTitle, width / 2, height - 60);

                    // Watermark
                    ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
                    ctx.font = '11px monospace';
                    ctx.fillText('ZAMAN MAKİNESİ AI // TIMELAPSE', width / 2, 32);
                }
            }

            animFrameRef.current = requestAnimationFrame(render);
        };

        animFrameRef.current = requestAnimationFrame(render);

        return () => {
            if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
        };
    }, [isOpen, isPlaying, timelineItems.length]);

    if (!isOpen) return null;

    // Helper to draw image proportional object-cover
    function drawImageProp(ctx: CanvasRenderingContext2D, img: HTMLImageElement, x: number, y: number, w: number, h: number) {
        const hRatio = w / img.width;
        const vRatio = h / img.height;
        const ratio = Math.max(hRatio, vRatio);
        const centerShiftX = (w - img.width * ratio) / 2;
        const centerShiftY = (h - img.height * ratio) / 2;
        ctx.drawImage(img, 0, 0, img.width, img.height, x + centerShiftX, y + centerShiftY, img.width * ratio, img.height * ratio);
    }

    const handleRecordVideo = async () => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        playWarp();
        setIsRecording(true);

        try {
            const stream = canvas.captureStream(30);
            const mediaRecorder = new MediaRecorder(stream, { mimeType: 'video/webm;codecs=vp9' });
            const chunks: Blob[] = [];

            mediaRecorder.ondataavailable = (e) => {
                if (e.data.size > 0) chunks.push(e.data);
            };

            mediaRecorder.onstop = () => {
                const blob = new Blob(chunks, { type: 'video/webm' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'zaman-yolculugu-timelapse.webm';
                a.click();
                playSuccess();
                setIsRecording(false);
            };

            mediaRecorder.start();
            // Record full loop
            setTimeout(() => {
                mediaRecorder.stop();
            }, timelineItems.length * 2200);
        } catch (err) {
            console.error('Video kayıt hatası:', err);
            alert('Video kaydedilemedi.');
            setIsRecording(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4 overflow-y-auto animate-in fade-in duration-200">
            <div className="relative w-full max-w-lg rounded-3xl bg-slate-900 border border-amber-500/40 p-6 shadow-2xl text-white my-4 flex flex-col items-center">
                {/* Header */}
                <div className="w-full flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
                    <div className="flex items-center gap-2">
                        <span className="text-xl">🎬</span>
                        <h3 className="text-base font-black text-white">Zaman Tüneli Klip (9:16 Reels / TikTok)</h3>
                    </div>
                    <button
                        onClick={() => { playTick(); onClose(); }}
                        className="rounded-full bg-slate-800 p-1.5 text-slate-400 hover:text-white"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* 9:16 Canvas Container */}
                <div className="relative rounded-2xl overflow-hidden border-2 border-amber-400/80 shadow-2xl bg-black">
                    <canvas
                        ref={canvasRef}
                        width={450}
                        height={750}
                        className="w-[270px] sm:w-[320px] h-auto aspect-[9/16] object-cover"
                    />

                    {/* Recording Indicator */}
                    {isRecording && (
                        <div className="absolute top-4 right-4 flex items-center gap-2 bg-red-600/90 text-white text-xs font-black px-3 py-1 rounded-full animate-pulse shadow-lg">
                            <span className="w-2 h-2 rounded-full bg-white animate-ping" />
                            KAYDEDİLİYOR...
                        </div>
                    )}
                </div>

                {/* Progress Bar */}
                <div className="w-full max-w-xs mt-4">
                    <div className="flex justify-between text-[11px] font-mono text-slate-400 mb-1">
                        <span>Dönüşüm İlerlemesi</span>
                        <span className="text-amber-400 font-bold">{progress}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-gradient-to-r from-amber-400 to-yellow-500 transition-all duration-100"
                            style={{ width: `${progress}%` }}
                        />
                    </div>
                </div>

                {/* Controls */}
                <div className="flex items-center justify-center gap-3 mt-5 w-full">
                    <button
                        onClick={() => setIsPlaying(!isPlaying)}
                        className="p-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-white font-bold transition text-sm flex items-center gap-2"
                    >
                        <span>{isPlaying ? '⏸️ Durdur' : '▶️ Oynat'}</span>
                    </button>

                    <button
                        disabled={isRecording}
                        onClick={handleRecordVideo}
                        className="px-6 py-3 rounded-2xl bg-gradient-to-r from-amber-400 to-yellow-500 text-slate-950 font-black text-sm shadow-lg shadow-amber-500/20 hover:brightness-110 active:scale-95 transition flex items-center gap-2"
                    >
                        <span>🎥</span>
                        <span>{isRecording ? 'Klip Oluşturuluyor...' : 'Videoyu İndir (.webm)'}</span>
                    </button>
                </div>
            </div>
        </div>
    );
}
