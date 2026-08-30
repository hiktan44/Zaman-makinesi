/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import React, { ChangeEvent, useRef, useState, useEffect } from 'react';
import { ERAS } from '../constants/eraConstants';
import EraSelector from './EraSelector';
import { playWarp, playTick, isSfxMuted, toggleSfxMute } from '../lib/sfxUtils';
import { usePayment } from '../contexts/PaymentContext';

interface TimeCockpitProps {
    uploadedImage: string | null;
    onImageUpload: (e: ChangeEvent<HTMLInputElement>) => void;
    selectedEraIds: string[];
    onToggleEra: (eraId: string) => void;
    onSelectAll: () => void;
    onClearAll: () => void;
    onLaunchTravel: () => void;
    isLoading: boolean;
    onOpenPricing: () => void;
}

export default function TimeCockpit({
    uploadedImage,
    onImageUpload,
    selectedEraIds,
    onToggleEra,
    onSelectAll,
    onClearAll,
    onLaunchTravel,
    isLoading,
    onOpenPricing
}: TimeCockpitProps) {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const { credits } = usePayment();
    const [sfxMuted, setSfxMuted] = useState(isSfxMuted());
    const [currentTimeStr, setCurrentTimeStr] = useState('');

    useEffect(() => {
        const updateTime = () => {
            const now = new Date();
            const dateStr = now.toLocaleDateString('tr-TR', { day: '2-digit', month: 'short', year: 'numeric' }).toUpperCase();
            const timeStr = now.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
            setCurrentTimeStr(`${dateStr} ${timeStr}`);
        };
        updateTime();
        const interval = setInterval(updateTime, 1000);
        return () => clearInterval(interval);
    }, []);

    // Get display string for primary selected destination
    const latestSelectedEra = ERAS.find(e => selectedEraIds.includes(e.id));
    const destinationYearDisplay = latestSelectedEra ? latestSelectedEra.yearDisplay : '---';
    const destinationTitleDisplay = latestSelectedEra ? latestSelectedEra.titleTr : 'HEDEF ÇAĞ SEÇİLMEDİ';

    const handleToggleSfx = () => {
        const next = toggleSfxMute();
        setSfxMuted(next);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            const fakeEvent = {
                target: { files: e.dataTransfer.files }
            } as unknown as ChangeEvent<HTMLInputElement>;
            onImageUpload(fakeEvent);
        }
    };

    return (
        <div className="w-full max-w-7xl mx-auto px-4 py-6 md:py-10 space-y-8 animate-in fade-in duration-300">
            {/* DeLorean Time Circuits Display */}
            <div className="relative rounded-3xl bg-gradient-to-b from-slate-950 via-slate-900 to-black p-6 md:p-8 border-2 border-amber-500/40 shadow-[0_0_50px_rgba(245,158,11,0.15)] overflow-hidden">
                {/* Glow Ambient */}
                <div className="absolute -top-24 -left-24 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-red-500/10 rounded-full blur-3xl pointer-events-none" />

                {/* Cockpit Top Bar */}
                <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4 mb-6">
                    <div className="flex items-center gap-3">
                        <div className="h-3 w-3 rounded-full bg-emerald-400 animate-ping" />
                        <span className="font-mono text-xs font-black tracking-widest text-amber-400 uppercase">
                            ZAMAN KONTROL MERKEZİ // V4.0 DE LOREAN FLUX
                        </span>
                    </div>

                    <div className="flex items-center gap-3">
                        {/* Audio Toggle */}
                        <button
                            onClick={handleToggleSfx}
                            className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold transition cursor-pointer border ${
                                sfxMuted
                                    ? 'bg-slate-800 text-slate-400 border-slate-700'
                                    : 'bg-amber-500/20 text-amber-300 border-amber-500/40 shadow-sm'
                            }`}
                            title="Ses Efektlerini Aç / Kapat"
                        >
                            <span>{sfxMuted ? '🔇' : '🔊'}</span>
                            <span>{sfxMuted ? 'Ses Kapalı' : 'SFX Aktif'}</span>
                        </button>

                        {/* Credit Fuel Meter */}
                        <div
                            onClick={onOpenPricing}
                            className="flex items-center gap-2 rounded-full bg-gradient-to-r from-amber-500/20 to-yellow-500/20 border border-amber-400/40 px-3.5 py-1 text-xs font-bold text-amber-300 hover:brightness-125 transition cursor-pointer"
                        >
                            <span>⚡ Plütonyum:</span>
                            <span className="font-mono font-black text-white">{credits} Kredi</span>
                            <span className="text-[10px] bg-amber-400 text-slate-950 px-1.5 py-0.5 rounded font-black">+ YÜKLE</span>
                        </div>
                    </div>
                </div>

                {/* 3 Digital LED Displays */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* 1. DESTINATION TIME (RED/AMBER LED) */}
                    <div className="rounded-2xl bg-black/90 p-4 border border-red-500/40 shadow-[inset_0_0_20px_rgba(239,68,68,0.2)] flex flex-col justify-between">
                        <div className="flex items-center justify-between text-[11px] font-mono font-black text-red-500 tracking-wider">
                            <span>HEDEF ZAMAN</span>
                            <span className="text-[10px] bg-red-950/80 px-2 py-0.5 rounded text-red-400">DESTINATION</span>
                        </div>
                        <div className="my-2 text-center">
                            <div className="font-mono text-3xl sm:text-4xl font-black text-red-500 tracking-wider drop-shadow-[0_0_10px_rgba(239,68,68,0.8)]">
                                {destinationYearDisplay}
                            </div>
                            <div className="text-xs text-red-300/80 font-medium truncate mt-1">
                                {destinationTitleDisplay}
                            </div>
                        </div>
                        <div className="text-[10px] font-mono text-red-500/60 text-right">
                            FLUX KİLİTLENDİ
                        </div>
                    </div>

                    {/* 2. PRESENT TIME (GREEN LED) */}
                    <div className="rounded-2xl bg-black/90 p-4 border border-emerald-500/40 shadow-[inset_0_0_20px_rgba(16,185,129,0.2)] flex flex-col justify-between">
                        <div className="flex items-center justify-between text-[11px] font-mono font-black text-emerald-400 tracking-wider">
                            <span>ŞİMDİKİ ZAMAN</span>
                            <span className="text-[10px] bg-emerald-950/80 px-2 py-0.5 rounded text-emerald-300">PRESENT</span>
                        </div>
                        <div className="my-2 text-center">
                            <div className="font-mono text-2xl sm:text-3xl font-black text-emerald-400 tracking-wider drop-shadow-[0_0_10px_rgba(16,185,129,0.8)]">
                                {currentTimeStr.split(' ')[0] || '30 AĞU 2026'}
                            </div>
                            <div className="text-xs font-mono text-emerald-300/90 font-bold mt-1">
                                {currentTimeStr.split(' ')[1] || '11:15:00'}
                            </div>
                        </div>
                        <div className="text-[10px] font-mono text-emerald-500/60 text-right">
                            EVREN SAATİ
                        </div>
                    </div>

                    {/* 3. LAST TIME DEPARTED (YELLOW/AMBER LED) */}
                    <div className="rounded-2xl bg-black/90 p-4 border border-amber-500/40 shadow-[inset_0_0_20px_rgba(245,158,11,0.2)] flex flex-col justify-between">
                        <div className="flex items-center justify-between text-[11px] font-mono font-black text-amber-400 tracking-wider">
                            <span>SON AYRILIŞ</span>
                            <span className="text-[10px] bg-amber-950/80 px-2 py-0.5 rounded text-amber-300">DEPARTED</span>
                        </div>
                        <div className="my-2 text-center">
                            <div className="font-mono text-3xl sm:text-4xl font-black text-amber-400 tracking-wider drop-shadow-[0_0_10px_rgba(245,158,11,0.8)]">
                                26 EKİM 1985
                            </div>
                            <div className="text-xs text-amber-300/80 font-medium truncate mt-1">
                                HILL VALLEY // ZAMAN YOLCULUĞU BAŞLANGICI
                            </div>
                        </div>
                        <div className="text-[10px] font-mono text-amber-500/60 text-right">
                            88 MPH SİSTEMİ
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Interactive Work Area (Upload + Era Selector) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Left Column: Photo Upload Zone */}
                <div className="lg:col-span-5 flex flex-col space-y-4">
                    <div
                        onDrop={handleDrop}
                        onDragOver={(e) => e.preventDefault()}
                        className={`relative flex flex-col items-center justify-center rounded-3xl border-2 border-dashed p-6 transition-all duration-300 min-h-[380px] text-center ${
                            uploadedImage
                                ? 'border-amber-400 bg-slate-900/90 shadow-lg'
                                : 'border-slate-700 hover:border-amber-400/80 bg-slate-900/60 hover:bg-slate-900/90'
                        }`}
                    >
                        <input
                            type="file"
                            ref={fileInputRef}
                            className="hidden"
                            accept="image/png, image/jpeg, image/webp"
                            onChange={onImageUpload}
                        />

                        {uploadedImage ? (
                            <div className="flex flex-col items-center space-y-4 w-full">
                                <div className="relative group rounded-2xl overflow-hidden shadow-2xl border-2 border-amber-400/80 max-h-72">
                                    <img
                                        src={uploadedImage}
                                        alt="Yüklenen Fotoğraf"
                                        className="object-cover max-h-72 w-auto"
                                    />
                                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                        <button
                                            onClick={() => fileInputRef.current?.click()}
                                            className="px-4 py-2 rounded-xl bg-amber-400 text-slate-950 font-bold text-xs shadow-md hover:bg-amber-300"
                                        >
                                            Fotoğrafı Değiştir
                                        </button>
                                    </div>
                                </div>
                                <p className="text-xs text-emerald-400 font-semibold flex items-center gap-1.5">
                                    <span>✓</span> Fotoğraf Zaman Kapsülüne Yüklendi
                                </p>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center space-y-4">
                                <div className="w-20 h-20 rounded-3xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-4xl shadow-inner">
                                    📸
                                </div>
                                <div>
                                    <h4 className="text-lg font-bold text-white">Portrenizi Yükleyin</h4>
                                    <p className="text-xs text-slate-400 mt-1 max-w-xs">
                                        Tek kişilik veya vesikalık net bir fotoğraf sürükleyin veya dosyalardan seçin.
                                    </p>
                                </div>
                                <button
                                    onClick={() => fileInputRef.current?.click()}
                                    className="px-6 py-3 rounded-2xl bg-gradient-to-r from-amber-400 to-yellow-500 text-slate-950 font-black text-sm shadow-lg shadow-amber-500/20 hover:brightness-110 active:scale-95 transition cursor-pointer"
                                >
                                    Fotoğraf Seç
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Launch Travel CTA Button */}
                    <button
                        disabled={!uploadedImage || selectedEraIds.length === 0 || isLoading}
                        onClick={() => {
                            playWarp();
                            onLaunchTravel();
                        }}
                        className={`w-full py-5 px-8 rounded-3xl font-black text-lg md:text-xl tracking-tight transition-all duration-300 flex items-center justify-center gap-3 cursor-pointer shadow-2xl ${
                            !uploadedImage || selectedEraIds.length === 0 || isLoading
                                ? 'bg-slate-800 text-slate-500 border border-slate-700 cursor-not-allowed opacity-60'
                                : 'bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 text-slate-950 hover:scale-[1.02] hover:shadow-[0_0_35px_rgba(245,158,11,0.5)] active:scale-95 border-2 border-yellow-300'
                        }`}
                    >
                        {isLoading ? (
                            <>
                                <span className="animate-spin text-2xl">⏳</span>
                                <span>ZAMAN TÜNELİNE GİRİLİYOR...</span>
                            </>
                        ) : (
                            <>
                                <span className="text-2xl">⚡</span>
                                <span>ZAMANDA YOLCULUK YAP ({selectedEraIds.length} ÇAĞ)</span>
                            </>
                        )}
                    </button>
                </div>

                {/* Right Column: Multi-Era Selector */}
                <div className="lg:col-span-7 bg-slate-900/80 rounded-3xl p-6 border border-slate-800 shadow-xl">
                    <EraSelector
                        selectedEraIds={selectedEraIds}
                        onToggleEra={onToggleEra}
                        onSelectAll={onSelectAll}
                        onClearAll={onClearAll}
                    />
                </div>
            </div>
        </div>
    );
}
