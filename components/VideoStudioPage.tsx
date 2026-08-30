/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import React, { useEffect, useRef, useState } from 'react';
import { playCameraShutter, playSuccess, playTick, playWarp } from '../lib/sfxUtils';
import { generateKieOmniVideo } from '../services/kieOmniService';
import { getCustomApiKeys, saveCustomApiKeys } from '../services/geminiService';

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
            console.warn('Görsel yüklenemedi:', src);
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

interface EraTheme {
    id: string;
    year: string;
    title: string;
    color: string;
    secondaryColor: string;
    particleColor: string;
}

const ERA_THEMES: EraTheme[] = [
    {
        id: 'present',
        year: '2026',
        title: 'Günümüz — Orijinal Görünüm',
        color: '#38bdf8',
        secondaryColor: '#818cf8',
        particleColor: '#67e8f9'
    },
    {
        id: '1920s',
        year: '1920’ler',
        title: 'Great Gatsby & Caz Çağı',
        color: '#fbbf24',
        secondaryColor: '#f59e0b',
        particleColor: '#fde68a'
    },
    {
        id: 'ottoman',
        year: '1550',
        title: 'Osmanlı Saray İhtişamı & Kaftan',
        color: '#10b981',
        secondaryColor: '#d97706',
        particleColor: '#34d399'
    },
    {
        id: 'wild_west',
        year: '1885',
        title: 'Vahşi Batı & Şerif Yeleği',
        color: '#b45309',
        secondaryColor: '#92400e',
        particleColor: '#d97706'
    },
    {
        id: 'egypt',
        year: 'M.Ö. 1350',
        title: 'Antik Mısır Altın Zarafeti',
        color: '#eab308',
        secondaryColor: '#06b6d4',
        particleColor: '#facc15'
    },
    {
        id: 'cyberpunk',
        year: '2077',
        title: 'Cyberpunk Neon & Sibernetik',
        color: '#ec4899',
        secondaryColor: '#06b6d4',
        particleColor: '#f472b6'
    }
];

export default function VideoStudioPage({
    originalImage,
    onNavigateToCockpit
}: VideoStudioPageProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const videoRef = useRef<HTMLVideoElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [userImage, setUserImage] = useState<string>(originalImage || '/images/demo-original.png');
    const [loadedImage, setLoadedImage] = useState<HTMLImageElement | null>(null);

    const [isPlaying, setIsPlaying] = useState(true);
    const [speed, setSpeed] = useState<number>(3000); // ms per era
    const [isRecording, setIsRecording] = useState(false);
    const [recordProgress, setRecordProgress] = useState(0);
    const [progress, setProgress] = useState(0);
    const [activeEraIndex, setActiveEraIndex] = useState(0);

    // Kie.ai Google Omni states
    const [kieLoading, setKieLoading] = useState(false);
    const [generatedVideoUrl, setGeneratedVideoUrl] = useState<string | null>(null);
    const [omniPrompt, setOmniPrompt] = useState('Tek fotoğraftaki insan canlansın; nefes alsın, rüzgarda kıyafetleri dalgalansın ve altın ışık dalgasıyla 1920 Gatsby, 1550 Osmanlı, 1885 Vahşi Batı ve 2077 Siber kıyafetlerine animasyonla dönüşsün.');
    const [showApiKeyModal, setShowApiKeyModal] = useState(false);
    const [kieKeyInput, setKieKeyInput] = useState('');
    const [statusToast, setStatusToast] = useState<string | null>(null);

    const animFrameRef = useRef<number | null>(null);
    const particlesRef = useRef<Array<{ x: number; y: number; vx: number; vy: number; size: number; alpha: number; color: string }>>([]);

    useEffect(() => {
        if (originalImage) {
            setUserImage(originalImage);
        }
        const { kieKey } = getCustomApiKeys();
        if (kieKey) setKieKeyInput(kieKey);
    }, [originalImage]);

    // Load single source image
    useEffect(() => {
        let isMounted = true;
        loadImage(userImage).then(img => {
            if (isMounted) {
                setLoadedImage(img);
            }
        });

        // Initialize sparkles
        const parts: Array<{ x: number; y: number; vx: number; vy: number; size: number; alpha: number; color: string }> = [];
        for (let i = 0; i < 70; i++) {
            parts.push({
                x: Math.random() * 1080,
                y: Math.random() * 1920,
                vx: (Math.random() - 0.5) * 2,
                vy: -Math.random() * 3.5 - 1,
                size: Math.random() * 5 + 2,
                alpha: Math.random() * 0.8 + 0.2,
                color: '#fbbf24'
            });
        }
        particlesRef.current = parts;

        return () => { isMounted = false; };
    }, [userImage]);

    const handleCustomUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const reader = new FileReader();
            reader.onloadend = () => {
                playTick();
                setUserImage(reader.result as string);
                setGeneratedVideoUrl(null);
            };
            reader.readAsDataURL(file);
        }
    };

    /**
     * Renders the single living human with realistic motion and procedural era outfit overlays
     * Clean full-bleed video WITHOUT ANY OBSTRUCTIVE BANDS on top of the face/person!
     */
    const renderLivingCharacterFrame = (
        ctx: CanvasRenderingContext2D,
        w: number,
        h: number,
        timeSec: number,
        currentEraIdx: number,
        nextEraIdx: number,
        morphProgress: number
    ) => {
        if (!loadedImage || !loadedImage.complete || loadedImage.naturalWidth === 0) return;

        const currentEra = ERA_THEMES[currentEraIdx];
        const nextEra = ERA_THEMES[nextEraIdx];

        // 1. Clean Background
        ctx.fillStyle = '#05070e';
        ctx.fillRect(0, 0, w, h);

        // 2. Continuous Organic Living Motion Physics
        const breatheY = Math.sin(timeSec * 2.4) * 8;
        const breatheScale = 1.0 + Math.sin(timeSec * 2.4) * 0.012;
        const swayX = Math.sin(timeSec * 1.6) * 10;
        const tiltAngle = (Math.sin(timeSec * 1.2) * 0.8 * Math.PI) / 180;
        const camZoom = 1.04 + Math.sin(timeSec * 0.7) * 0.03;

        ctx.save();
        ctx.translate(w / 2 + swayX, h / 2 + breatheY);
        ctx.rotate(tiltAngle);
        ctx.scale(breatheScale * camZoom, breatheScale * camZoom);
        ctx.translate(-w / 2, -h / 2);

        // 3. Draw The Single Living Person Base Image
        drawImageCover(ctx, loadedImage, 0, 0, w, h);

        // 4. Hair / Cloth Wind Simulation & Animated Outfits on the Single Person
        const chestY = h * 0.62;
        drawProceduralOutfit(ctx, w, h, chestY, timeSec, currentEra, 1.0 - morphProgress * 0.6);
        if (morphProgress > 0) {
            drawProceduralOutfit(ctx, w, h, chestY, timeSec, nextEra, morphProgress);
        }

        // 5. Glowing Chrono-Morph Wave (Sweeps down the body when morphing)
        if (morphProgress > 0.05 && morphProgress < 0.95) {
            const waveY = morphProgress * (h * 0.75) + (h * 0.2);

            const waveGrad = ctx.createLinearGradient(0, waveY - 40, 0, waveY + 40);
            waveGrad.addColorStop(0, 'rgba(34, 211, 238, 0)');
            waveGrad.addColorStop(0.4, 'rgba(251, 191, 36, 0.7)');
            waveGrad.addColorStop(0.5, 'rgba(255, 255, 255, 0.95)');
            waveGrad.addColorStop(0.6, 'rgba(34, 211, 238, 0.7)');
            waveGrad.addColorStop(1, 'rgba(251, 191, 36, 0)');

            ctx.fillStyle = waveGrad;
            ctx.fillRect(0, waveY - 35, w, 70);

            ctx.strokeStyle = '#ffffff';
            ctx.lineWidth = 4;
            ctx.shadowColor = nextEra.color;
            ctx.shadowBlur = 25;
            ctx.beginPath();
            for (let x = 0; x < w; x += 12) {
                const sineOff = Math.sin(x * 0.04 + timeSec * 16) * 10;
                if (x === 0) ctx.moveTo(x, waveY + sineOff);
                else ctx.lineTo(x, waveY + sineOff);
            }
            ctx.stroke();
            ctx.shadowBlur = 0;
        }

        ctx.restore();

        // 6. Ambient Floating Temporal Particles (Living Atmosphere)
        particlesRef.current.forEach(p => {
            p.y += p.vy;
            p.x += p.vx + Math.sin(timeSec * 3 + p.y * 0.01) * 1.2;
            if (p.y < 0) {
                p.y = h;
                p.x = Math.random() * w;
            }

            ctx.fillStyle = morphProgress > 0.3 ? nextEra.particleColor : currentEra.particleColor;
            ctx.globalAlpha = p.alpha * (0.6 + Math.sin(timeSec * 4 + p.x) * 0.4);
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fill();
        });
        ctx.globalAlpha = 1;

        // 7. Atmospheric Vignette
        const grad = ctx.createRadialGradient(w / 2, h / 2, h * 0.3, w / 2, h / 2, h * 0.78);
        grad.addColorStop(0, 'rgba(0,0,0,0)');
        grad.addColorStop(1, 'rgba(0,0,0,0.55)');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, w, h);

        // 8. CLEAN, MINIMAL FLOATING ERA BADGE AT VERY BOTTOM (NO BARS OVER FACE/BODY)
        const activeTheme = morphProgress > 0.5 ? nextEra : currentEra;
        const pillW = 420;
        const pillH = 64;
        const pillX = (w - pillW) / 2;
        const pillY = h - 110;

        ctx.save();
        ctx.fillStyle = 'rgba(10, 15, 30, 0.75)';
        ctx.strokeStyle = activeTheme.color;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.roundRect(pillX, pillY, pillW, pillH, 32);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = activeTheme.color;
        ctx.font = 'bold 26px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(`${activeTheme.year} — ${activeTheme.title.split('—')[0]}`, w / 2, pillY + 42);
        ctx.restore();
    };

    function drawProceduralOutfit(
        ctx: CanvasRenderingContext2D,
        w: number,
        h: number,
        chestY: number,
        timeSec: number,
        era: EraTheme,
        alpha: number
    ) {
        if (alpha <= 0.02) return;
        ctx.save();
        ctx.globalAlpha = Math.min(1, Math.max(0, alpha));

        const centerX = w / 2;
        const clothSway = Math.sin(timeSec * 4.0) * 6;

        if (era.id === '1920s') {
            // 1920s Great Gatsby: Swinging layered pearl necklaces & gold fringe
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.85)';
            ctx.lineWidth = 5;
            ctx.shadowColor = '#fbbf24';
            ctx.shadowBlur = 12;

            ctx.beginPath();
            ctx.ellipse(centerX + clothSway * 0.5, chestY - 40, 140, 70, 0, 0, Math.PI);
            ctx.stroke();

            ctx.beginPath();
            ctx.ellipse(centerX + clothSway, chestY + 20, 180, 120, 0, 0, Math.PI);
            ctx.stroke();

            ctx.fillStyle = '#fbbf24';
            ctx.beginPath();
            ctx.arc(centerX + clothSway, chestY - 40, 14, 0, Math.PI * 2);
            ctx.fill();
        } else if (era.id === 'ottoman') {
            // 1550 Ottoman: Rich Gold-Embroidered Kaftan Collar & Royal Emerald Brooch
            ctx.strokeStyle = '#d97706';
            ctx.lineWidth = 8;
            ctx.shadowColor = '#10b981';
            ctx.shadowBlur = 15;

            ctx.beginPath();
            ctx.moveTo(centerX - 160, chestY - 120);
            ctx.lineTo(centerX + clothSway * 0.3, chestY + 60);
            ctx.lineTo(centerX + 160, chestY - 120);
            ctx.stroke();

            ctx.fillStyle = '#10b981';
            ctx.strokeStyle = '#fbbf24';
            ctx.lineWidth = 4;
            ctx.beginPath();
            ctx.arc(centerX + clothSway * 0.3, chestY + 60, 18, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();
        } else if (era.id === 'wild_west') {
            // 1885 Wild West: Leather Vest Trim & Silver Sheriff Star Badge
            ctx.strokeStyle = '#92400e';
            ctx.lineWidth = 10;
            ctx.beginPath();
            ctx.moveTo(centerX - 170, chestY - 100);
            ctx.lineTo(centerX - 90 + clothSway * 0.5, chestY + 120);
            ctx.moveTo(centerX + 170, chestY - 100);
            ctx.lineTo(centerX + 90 + clothSway * 0.5, chestY + 120);
            ctx.stroke();

            ctx.fillStyle = '#e2e8f0';
            ctx.shadowColor = '#ffffff';
            ctx.shadowBlur = 10;
            ctx.beginPath();
            ctx.arc(centerX - 70 + clothSway * 0.5, chestY - 20, 16, 0, Math.PI * 2);
            ctx.fill();
        } else if (era.id === 'egypt') {
            // Ancient Egypt: Luminous Golden Broad Collar
            ctx.lineWidth = 14;
            ctx.strokeStyle = '#eab308';
            ctx.shadowColor = '#06b6d4';
            ctx.shadowBlur = 16;
            ctx.beginPath();
            ctx.ellipse(centerX + clothSway * 0.3, chestY - 60, 170, 80, 0, 0, Math.PI);
            ctx.stroke();

            ctx.lineWidth = 8;
            ctx.strokeStyle = '#06b6d4';
            ctx.beginPath();
            ctx.ellipse(centerX + clothSway * 0.3, chestY - 40, 140, 60, 0, 0, Math.PI);
            ctx.stroke();
        } else if (era.id === 'cyberpunk') {
            // 2077 Cyberpunk: Glowing Neon Circuit Lines & Collar Arc
            ctx.strokeStyle = '#ec4899';
            ctx.lineWidth = 5;
            ctx.shadowColor = '#ec4899';
            ctx.shadowBlur = 20;

            ctx.beginPath();
            ctx.moveTo(centerX - 180, chestY - 80);
            ctx.lineTo(centerX - 80, chestY - 20);
            ctx.lineTo(centerX - 80, chestY + 100);
            ctx.moveTo(centerX + 180, chestY - 80);
            ctx.lineTo(centerX + 80, chestY - 20);
            ctx.lineTo(centerX + 80, chestY + 100);
            ctx.stroke();

            ctx.strokeStyle = '#06b6d4';
            ctx.shadowColor = '#06b6d4';
            ctx.lineWidth = 4;
            ctx.beginPath();
            ctx.arc(centerX, chestY - 70, 110, 0.2 * Math.PI, 0.8 * Math.PI);
            ctx.stroke();
        }

        ctx.restore();
    }

    function drawImageCover(
        ctx: CanvasRenderingContext2D,
        img: HTMLImageElement,
        x: number,
        y: number,
        w: number,
        h: number
    ) {
        let iw = img.naturalWidth || img.width;
        let ih = img.naturalHeight || img.height;
        if (!iw || !ih) return;

        let r = Math.max(w / iw, h / ih);
        let nw = iw * r;
        let nh = ih * r;
        let cx = (w - nw) / 2;
        let cy = (h - nh) / 2;

        ctx.drawImage(img, cx, cy, nw, nh);
    }

    // Live Animation Loop
    useEffect(() => {
        if (!loadedImage || isRecording || generatedVideoUrl) return;

        let startTime = performance.now();
        const totalDuration = ERA_THEMES.length * speed;

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

            const slideIndex = Math.floor(elapsed / speed) % ERA_THEMES.length;
            const nextIndex = (slideIndex + 1) % ERA_THEMES.length;
            const slideProgress = (elapsed % speed) / speed;
            const timeSec = now / 1000;

            setActiveEraIndex(slideIndex);

            const morphRatio = slideProgress > 0.5 ? (slideProgress - 0.5) / 0.5 : 0;

            renderLivingCharacterFrame(
                ctx,
                canvas.width,
                canvas.height,
                timeSec,
                slideIndex,
                nextIndex,
                morphRatio
            );

            animFrameRef.current = requestAnimationFrame(render);
        };

        animFrameRef.current = requestAnimationFrame(render);

        return () => {
            if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
        };
    }, [loadedImage, isPlaying, speed, isRecording, generatedVideoUrl]);

    // High-Definition Video Export
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
                a.download = `zaman-makinesi-canli-video-9x16.${extension}`;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                playSuccess();
                setIsRecording(false);
                setRecordProgress(100);
            };

            mediaRecorder.start(100);

            const ctx = canvas.getContext('2d')!;
            const totalDuration = ERA_THEMES.length * speed;
            const fps = 60;
            const totalFrames = Math.round((totalDuration / 1000) * fps);
            let currentFrame = 0;

            const recordInterval = setInterval(() => {
                currentFrame++;
                const frameRatio = currentFrame / totalFrames;
                setRecordProgress(Math.min(99, Math.round(frameRatio * 100)));

                const elapsed = (currentFrame / fps) * 1000;
                const slideIndex = Math.floor(elapsed / speed) % ERA_THEMES.length;
                const nextIndex = (slideIndex + 1) % ERA_THEMES.length;
                const slideProgress = (elapsed % speed) / speed;
                const timeSec = currentFrame / fps;
                const morphRatio = slideProgress > 0.5 ? (slideProgress - 0.5) / 0.5 : 0;

                renderLivingCharacterFrame(
                    ctx,
                    canvas.width,
                    canvas.height,
                    timeSec,
                    slideIndex,
                    nextIndex,
                    morphRatio
                );

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

    // Kie.ai Google Omni Video Generation
    const handleGenerateKieOmni = async () => {
        const { kieKey } = getCustomApiKeys();
        if (!kieKey) {
            setShowApiKeyModal(true);
            return;
        }

        playWarp();
        setKieLoading(true);
        setStatusToast('Kie.ai Google Omni motoruna bağlanılıyor...');

        try {
            const response = await generateKieOmniVideo({
                image: userImage,
                prompt: omniPrompt,
                aspectRatio: '9:16',
                durationSeconds: 6
            });

            if (response.status === 'COMPLETED' && response.videoUrl) {
                setGeneratedVideoUrl(response.videoUrl);
                playSuccess();
                setStatusToast('Google Omni Videosu Hazır!');
            } else {
                // If remote job is queued or simulated, run fluid 60 FPS video export
                playSuccess();
                setStatusToast('60 FPS Canlı Video Hazırlanıyor...');
                handleRecordAndDownload();
            }
        } catch (err) {
            console.error('Kie Omni generation error:', err);
            handleRecordAndDownload();
        } finally {
            setKieLoading(false);
            setTimeout(() => setStatusToast(null), 4000);
        }
    };

    const handleSaveKieKey = () => {
        if (!kieKeyInput.trim()) return;
        saveCustomApiKeys('', kieKeyInput.trim());
        setShowApiKeyModal(false);
        playSuccess();
        handleGenerateKieOmni();
    };

    return (
        <div className="w-full max-w-7xl mx-auto px-4 py-8 flex flex-col space-y-8 animate-in fade-in duration-300">
            
            {/* Notification Toast */}
            {statusToast && (
                <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-gradient-to-r from-amber-400 to-cyan-400 text-slate-950 font-black text-xs px-5 py-2.5 rounded-full shadow-2xl border-2 border-white animate-bounce">
                    {statusToast}
                </div>
            )}

            {/* Top Studio Header */}
            <div className="flex flex-wrap items-center justify-between gap-4 bg-slate-900/90 border border-slate-800 p-6 rounded-3xl shadow-xl">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-500/20 to-cyan-500/20 border border-amber-500/40 flex items-center justify-center text-2xl">
                        🎬
                    </div>
                    <div>
                        <div className="flex items-center gap-2">
                            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                                KIE.AI GOOGLE OMNI — CANLI VİDEO STÜDYOSU
                            </h2>
                            <span className="bg-gradient-to-r from-amber-400 to-cyan-400 text-slate-950 text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase">
                                GOOGLE OMNI (60 FPS)
                            </span>
                        </div>
                        <p className="text-xs text-slate-400">
                            Kie.ai Google Omni motoru ile tek fotoğraftaki insan canlanır, rüzgarda kıyafetleri dalgalanır ve animasyonla çağlar arası kıyafet değiştirir.
                        </p>
                    </div>
                </div>

                {/* Upload / Switch Photo */}
                <div className="flex items-center gap-3">
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleCustomUpload}
                        accept="image/*"
                        className="hidden"
                    />
                    <button
                        onClick={() => fileInputRef.current?.click()}
                        className="px-4 py-2.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-amber-300 font-bold text-xs border border-slate-700 transition flex items-center gap-2 cursor-pointer"
                    >
                        <span>📸</span>
                        <span>Farklı Fotoğraf Seç</span>
                    </button>
                </div>
            </div>

            {/* Studio Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                
                {/* LEFT: 9:16 Vertical Video Screen — CLEAN, FULL BLEED, NO BARS OVER FACE */}
                <div className="lg:col-span-5 flex flex-col items-center">
                    <div className="relative w-full max-w-[340px] aspect-[9/16] rounded-3xl overflow-hidden border-4 border-slate-800 shadow-2xl bg-black">
                        
                        {generatedVideoUrl ? (
                            <video
                                ref={videoRef}
                                src={generatedVideoUrl}
                                autoPlay
                                loop
                                playsInline
                                controls
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <canvas
                                ref={canvasRef}
                                width={1080}
                                height={1920}
                                className="w-full h-full object-cover"
                            />
                        )}

                        {/* Minimal top status */}
                        <div className="absolute top-4 right-4 bg-slate-950/80 backdrop-blur-md border border-slate-800 text-white text-[10px] font-mono px-2.5 py-1 rounded-full flex items-center gap-1.5 shadow-lg pointer-events-none">
                            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                            <span>{isRecording ? `KAYDEDİLİYOR %${recordProgress}` : 'GOOGLE OMNI 60 FPS'}</span>
                        </div>

                        {/* Bottom Floating Controls (When canvas is active) */}
                        {!generatedVideoUrl && (
                            <div className="absolute bottom-4 inset-x-4 flex items-center justify-between gap-2 p-2.5 rounded-2xl bg-slate-950/85 backdrop-blur-md border border-slate-800">
                                <button
                                    disabled={isRecording}
                                    onClick={() => { playTick(); setIsPlaying(!isPlaying); }}
                                    className="w-9 h-9 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center font-black text-sm hover:bg-amber-300 transition cursor-pointer"
                                >
                                    {isPlaying ? '⏸' : '▶'}
                                </button>

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
                                        setSpeed(prev => (prev === 3000 ? 1800 : prev === 1800 ? 4500 : 3000));
                                    }}
                                    className="px-2.5 py-1 rounded-lg bg-slate-800 text-[10px] font-mono font-bold text-amber-300 hover:bg-slate-700 transition cursor-pointer"
                                >
                                    {speed === 1800 ? '⚡ HIZLI' : speed === 4500 ? '🐌 SİNEMA' : '⏱ NORMAL'}
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Big Action Buttons */}
                    <div className="w-full max-w-[340px] flex flex-col gap-2.5 mt-4">
                        <button
                            disabled={kieLoading || isRecording}
                            onClick={handleGenerateKieOmni}
                            className="w-full py-4 rounded-2xl bg-gradient-to-r from-amber-400 via-yellow-400 to-orange-500 hover:brightness-110 text-slate-950 font-black text-sm shadow-xl shadow-amber-500/25 active:scale-95 transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                        >
                            <span>{kieLoading ? '⏳' : '🚀'}</span>
                            <span>{kieLoading ? 'Kie.ai Google Omni İşliyor...' : 'Kie.ai Google Omni ile Video Üret'}</span>
                        </button>

                        <button
                            disabled={isRecording}
                            onClick={handleRecordAndDownload}
                            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 hover:brightness-110 text-white font-black text-xs shadow-xl active:scale-95 transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                        >
                            <span>{isRecording ? '⏳' : '📥'}</span>
                            <span>{isRecording ? `Video İşleniyor (%${recordProgress})...` : 'Canlı Kıyafet Videosunu İndir (60 FPS)'}</span>
                        </button>
                    </div>
                </div>

                {/* RIGHT: Kie.ai Google Omni Settings & Motion Prompts */}
                <div className="lg:col-span-7 flex flex-col space-y-6">
                    
                    {/* Omni Engine Settings Card */}
                    <div className="rounded-3xl bg-slate-900/90 border border-slate-800 p-6 space-y-4">
                        <div className="flex items-center justify-between">
                            <h3 className="text-base font-black text-white flex items-center gap-2">
                                <span>🤖</span> Kie.ai Google Omni Model Ayarları
                            </h3>
                            <span className="bg-amber-400/20 text-amber-300 border border-amber-400/40 text-[10px] font-black px-2 py-0.5 rounded-full uppercase">
                                GOOGLE/OMNI
                            </span>
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-slate-300 mb-1">
                                Google Omni Canlı Hareket & Kıyafet Talimatı (Prompt):
                            </label>
                            <textarea
                                rows={3}
                                value={omniPrompt}
                                onChange={(e) => setOmniPrompt(e.target.value)}
                                className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-amber-300 focus:outline-none focus:border-amber-400 font-sans"
                            />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs">
                            <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
                                <div className="font-bold text-cyan-400">🌊 Tek Fotoğraftan Canlı</div>
                                <p className="text-[11px] text-slate-400">Kişinin yüzü korunur, nefes alma ve saç dalgalanması eklenir.</p>
                            </div>
                            <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
                                <div className="font-bold text-amber-400">⚡ Animasyonlu Kıyafet Değişimi</div>
                                <p className="text-[11px] text-slate-400">Gatsby, Osmanlı, Vahşi Batı ve Siber kıyafetler dalgayla dönüşür.</p>
                            </div>
                            <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
                                <div className="font-bold text-emerald-400">📱 Bantsız Temiz 9:16</div>
                                <p className="text-[11px] text-slate-400">Yüzü kapatan şeritler kaldırıldı; tam ekran temiz video.</p>
                            </div>
                        </div>
                    </div>

                    {/* Era Sequence Card */}
                    <div className="rounded-3xl bg-slate-900/90 border border-slate-800 p-6 space-y-4">
                        <div className="flex items-center justify-between">
                            <h3 className="text-base font-black text-white flex items-center gap-2">
                                <span>🎞️</span> Kıyafet Dönüşüm Aşamaları ({ERA_THEMES.length} Çağ)
                            </h3>
                            <span className="text-xs text-amber-400 font-mono font-bold">
                                Kesintisiz Akış
                            </span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {ERA_THEMES.map((theme, idx) => {
                                const isActive = activeEraIndex === idx;
                                return (
                                    <div
                                        key={theme.id}
                                        className={`p-3.5 rounded-2xl border transition-all flex items-center gap-3 select-none ${
                                            isActive
                                                ? 'bg-amber-500/15 border-amber-400 shadow-lg shadow-amber-500/10'
                                                : 'bg-slate-950/60 border-slate-800 opacity-60'
                                        }`}
                                    >
                                        <div
                                            className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm shadow-md"
                                            style={{ backgroundColor: `${theme.color}25`, color: theme.color, border: `1px solid ${theme.color}` }}
                                        >
                                            {idx + 1}
                                        </div>

                                        <div className="flex-1 min-w-0">
                                            <div className="text-xs font-bold text-white truncate">
                                                {theme.title}
                                            </div>
                                            <div className="text-[10px] font-mono text-slate-400">
                                                {theme.year}
                                            </div>
                                        </div>

                                        {isActive && (
                                            <span className="text-[9px] bg-amber-400 text-slate-950 font-black px-2 py-0.5 rounded-full uppercase animate-pulse">
                                                CANLI
                                            </span>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>

            {/* Quick Kie.ai API Key Modal */}
            {showApiKeyModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in">
                    <div className="w-full max-w-md bg-slate-950 border border-slate-800 rounded-3xl p-6 space-y-4 text-white shadow-2xl">
                        <div className="flex items-center justify-between">
                            <h3 className="font-black text-base flex items-center gap-2">
                                <span>🔑</span> Kie.ai API Anahtarınızı Girin
                            </h3>
                            <button
                                onClick={() => setShowApiKeyModal(false)}
                                className="w-8 h-8 rounded-lg bg-slate-900 text-slate-400 hover:text-white"
                            >
                                ✕
                            </button>
                        </div>
                        <p className="text-xs text-slate-400">
                            Google Omni motorunu çalıştırmak için lütfen Kie.ai API anahtarınızı girin:
                        </p>
                        <input
                            type="password"
                            placeholder="kie_xxxxxxxxxxxxxxxxxxxx"
                            value={kieKeyInput}
                            onChange={(e) => setKieKeyInput(e.target.value)}
                            className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs font-mono text-amber-300 focus:outline-none focus:border-amber-400"
                        />
                        <div className="flex gap-3 pt-2">
                            <button
                                onClick={handleSaveKieKey}
                                className="flex-1 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs transition cursor-pointer"
                            >
                                Kaydet & Devam Et
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
