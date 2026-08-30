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

function loadImage(src: string): Promise<HTMLImageElement> {
    return new Promise((resolve) => {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.onload = () => resolve(img);
        img.onerror = () => {
            console.warn('Image failed to load in Video Morph modal, fallback used:', src);
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

export default function VideoMorphModal({
    isOpen,
    onClose,
    images,
    originalImage
}: VideoMorphModalProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [isPlaying, setIsPlaying] = useState(true);
    const [progress, setProgress] = useState(0);
    const [isRecording, setIsRecording] = useState(false);
    const [recordProgress, setRecordProgress] = useState(0);
    const [loadedImgMap, setLoadedImgMap] = useState<Record<string, HTMLImageElement>>({});
    const animFrameRef = useRef<number | null>(null);

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
        let isMounted = true;

        Promise.all(
            timelineItems.map(async (item) => {
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
    }, [isOpen, timelineItems.length]);

    const speed = 2000;

    const drawFrame = (
        ctx: CanvasRenderingContext2D,
        w: number,
        h: number,
        slideIndex: number,
        nextIndex: number,
        slideProgress: number
    ) => {
        const currentItem = timelineItems[slideIndex];
        const nextItem = timelineItems[nextIndex];

        const currentImg = currentItem ? loadedImgMap[currentItem.eraId] : null;
        const nextImg = nextItem ? loadedImgMap[nextItem.eraId] : null;

        ctx.fillStyle = '#030712';
        ctx.fillRect(0, 0, w, h);

        if (currentImg && currentImg.complete && currentImg.naturalWidth > 0) {
            ctx.globalAlpha = 1;
            drawImageProp(ctx, currentImg, 0, 0, w, h, 0.5, 0.5);
        }

        const fadeStart = 0.65;
        if (slideProgress > fadeStart && nextImg && nextImg.complete && nextImg.naturalWidth > 0) {
            const alpha = (slideProgress - fadeStart) / (1 - fadeStart);
            ctx.globalAlpha = Math.min(1, Math.max(0, alpha));
            drawImageProp(ctx, nextImg, 0, 0, w, h, 0.5, 0.5);
        }

        ctx.globalAlpha = 1;

        const grad = ctx.createRadialGradient(w / 2, h / 2, h * 0.25, w / 2, h / 2, h * 0.7);
        grad.addColorStop(0, 'rgba(0,0,0,0)');
        grad.addColorStop(1, 'rgba(0,0,0,0.65)');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, w, h);

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
        ctx.fillText('9:16 VERTICAL REELS KLİP', w / 2, 150);

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
            ctx.fillText(`KARE: ${slideIndex + 1} / ${timelineItems.length}`, w / 2, h - 120);
        }
    };

    useEffect(() => {
        if (!isOpen || timelineItems.length === 0 || isRecording) return;

        let startTime = performance.now();
        const totalDuration = timelineItems.length * speed;

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
            const nextIndex = (slideIndex + 1) % timelineItems.length;
            const slideProgress = (elapsed % speed) / speed;

            drawFrame(ctx, canvas.width, canvas.height, slideIndex, nextIndex, slideProgress);

            animFrameRef.current = requestAnimationFrame(render);
        };

        animFrameRef.current = requestAnimationFrame(render);

        return () => {
            if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
        };
    }, [isOpen, timelineItems, loadedImgMap, isPlaying, speed, isRecording]);

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
                a.download = `zaman-makinesi-timelapse-9x16.${extension}`;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                playSuccess();
                setIsRecording(false);
                setRecordProgress(100);
            };

            mediaRecorder.start(100);

            const ctx = canvas.getContext('2d')!;
            const totalDuration = timelineItems.length * speed;
            const fps = 30;
            const totalFrames = Math.round((totalDuration / 1000) * fps);
            let currentFrame = 0;

            const recordInterval = setInterval(() => {
                currentFrame++;
                const frameRatio = currentFrame / totalFrames;
                setRecordProgress(Math.min(99, Math.round(frameRatio * 100)));

                const elapsed = (currentFrame / fps) * 1000;
                const slideIndex = Math.floor(elapsed / speed) % timelineItems.length;
                const nextIndex = (slideIndex + 1) % timelineItems.length;
                const slideProgress = (elapsed % speed) / speed;

                drawFrame(ctx, canvas.width, canvas.height, slideIndex, nextIndex, slideProgress);

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

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/90 backdrop-blur-xl animate-in fade-in duration-200">
            <div className="relative w-full max-w-lg rounded-3xl bg-slate-950 border border-slate-800 shadow-2xl p-6 flex flex-col items-center space-y-4">
                
                {/* Header */}
                <div className="w-full flex items-center justify-between border-b border-slate-800 pb-3">
                    <div className="flex items-center gap-2">
                        <span className="text-xl">🎬</span>
                        <h3 className="font-black text-white text-base">
                            9:16 ZAMAN TÜNELİ KLİBİ (REELS)
                        </h3>
                    </div>
                    <button
                        onClick={() => { playTick(); onClose(); }}
                        className="w-8 h-8 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center font-bold text-sm transition cursor-pointer"
                    >
                        ✕
                    </button>
                </div>

                {/* 9:16 Canvas Screen */}
                <div className="relative w-full max-w-[280px] aspect-[9/16] rounded-2xl overflow-hidden border-2 border-slate-800 shadow-2xl bg-black">
                    <canvas
                        ref={canvasRef}
                        width={1080}
                        height={1920}
                        className="w-full h-full object-cover"
                    />

                    <div className="absolute top-3 right-3 bg-red-600 text-white text-[9px] font-black px-2 py-0.5 rounded-full animate-pulse">
                        {isRecording ? `%${recordProgress}` : 'CANLI'}
                    </div>

                    <div className="absolute bottom-3 inset-x-3 flex items-center justify-between gap-2 p-2 rounded-xl bg-slate-950/80 backdrop-blur-md border border-slate-800">
                        <button
                            disabled={isRecording}
                            onClick={() => { playTick(); setIsPlaying(!isPlaying); }}
                            className="w-7 h-7 rounded-lg bg-amber-400 text-slate-950 flex items-center justify-center font-black text-xs hover:bg-amber-300 transition cursor-pointer"
                        >
                            {isPlaying ? '⏸' : '▶'}
                        </button>
                        <div className="flex-1 h-1.5 rounded-full bg-slate-800 overflow-hidden">
                            <div
                                className="h-full bg-amber-400"
                                style={{ width: `${(isRecording ? recordProgress / 100 : progress) * 100}%` }}
                            />
                        </div>
                    </div>
                </div>

                {/* Download Action */}
                <button
                    disabled={isRecording}
                    onClick={handleRecordAndDownload}
                    className="w-full py-3 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-black text-xs shadow-xl active:scale-95 transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                    <span>{isRecording ? '⏳' : '📥'}</span>
                    <span>{isRecording ? `Video Kaydediliyor (%${recordProgress})...` : '9:16 Video Olarak İndir (Reels / TikTok)'}</span>
                </button>
            </div>
        </div>
    );
}
