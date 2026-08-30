/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import React, { useRef, useState } from 'react';
import html2canvas from 'html2canvas';
import { ERAS, EraDefinition } from '../constants/eraConstants';
import { playCameraShutter, playSuccess, playTick } from '../lib/sfxUtils';
import { useAuth } from '../contexts/AuthContext';

interface HistoricalNewspaperProps {
    isOpen: boolean;
    onClose: () => void;
    imageUrl: string;
    eraId: string;
}

export default function HistoricalNewspaper({
    isOpen,
    onClose,
    imageUrl,
    eraId
}: HistoricalNewspaperProps) {
    const newspaperRef = useRef<HTMLDivElement>(null);
    const passportRef = useRef<HTMLDivElement>(null);
    const [mode, setMode] = useState<'newspaper' | 'passport'>('newspaper');
    const [isExporting, setIsExporting] = useState(false);
    const { user } = useAuth();

    const era: EraDefinition = ERAS.find(e => e.id === eraId) || {
        id: eraId,
        yearDisplay: '1920s',
        titleTr: 'Zamanın İzi',
        titleEn: 'Vintage Era',
        category: 'retro',
        icon: '⏳',
        badge: 'Tarihi Arşiv',
        bgGradient: 'from-amber-900 to-black',
        promptEn: '',
        newspaperHeadlineTr: 'TARİHTE BÜYÜK YOLCULUK: ÇAĞLAR ARASI KEŞİF!',
        newspaperSubTr: 'Zaman Gezgini tarihin en önemli anlarına bizzat tanıklık etti.',
        historicalFactTr: 'Tarih boyunca insanlık geçmişi anlamak ve geleceği inşa etmek için zamanın izlerini takip etti.'
    };

    if (!isOpen) return null;

    const travelerName = user?.email ? user.email.split('@')[0].toUpperCase() : 'HİKMET SEYMATA';
    const passportNo = `ZM-${era.yearDisplay.replace(/\D/g, '') || '1985'}-${Math.floor(1000 + Math.random() * 9000)}`;

    const handleDownload = async () => {
        const targetRef = mode === 'newspaper' ? newspaperRef.current : passportRef.current;
        if (!targetRef) return;

        playCameraShutter();
        setIsExporting(true);

        try {
            const canvas = await html2canvas(targetRef, {
                scale: 2,
                useCORS: true,
                backgroundColor: null
            });

            const link = document.createElement('a');
            link.download = `zaman-makinesi-${mode}-${era.yearDisplay}.png`;
            link.href = canvas.toDataURL('image/png');
            link.click();
            playSuccess();
        } catch (error) {
            console.error('İndirme hatası:', error);
            alert('Görsel indirilirken bir sorun oluştu.');
        } finally {
            setIsExporting(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 overflow-y-auto animate-in fade-in duration-200">
            <div className="relative w-full max-w-3xl rounded-3xl bg-slate-900 border border-amber-500/40 p-6 md:p-8 shadow-2xl text-white my-6">
                {/* Top Close & Mode Switch */}
                <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4 mb-6">
                    {/* Tabs */}
                    <div className="flex items-center gap-2 bg-slate-800/90 p-1.5 rounded-2xl border border-slate-700">
                        <button
                            onClick={() => { playTick(); setMode('newspaper'); }}
                            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                                mode === 'newspaper'
                                    ? 'bg-amber-400 text-slate-950 shadow-md font-black'
                                    : 'text-slate-300 hover:text-white'
                            }`}
                        >
                            🗞️ Dönem Gazetesi
                        </button>
                        <button
                            onClick={() => { playTick(); setMode('passport'); }}
                            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                                mode === 'passport'
                                    ? 'bg-amber-400 text-slate-950 shadow-md font-black'
                                    : 'text-slate-300 hover:text-white'
                            }`}
                        >
                            🛂 Zaman Pasaportu
                        </button>
                    </div>

                    <button
                        onClick={() => { playTick(); onClose(); }}
                        className="rounded-full bg-slate-800 p-2 text-slate-400 hover:text-white hover:bg-slate-700 transition cursor-pointer"
                        aria-label="Kapat"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* ================= MODE 1: HISTORICAL NEWSPAPER ================= */}
                {mode === 'newspaper' && (
                    <div className="flex flex-col items-center">
                        <div
                            ref={newspaperRef}
                            className="w-full max-w-xl bg-[#f4ecd8] text-[#1c1813] p-6 sm:p-8 rounded-lg shadow-2xl border-4 border-[#3d3224] font-serif space-y-4 select-none relative overflow-hidden"
                            style={{
                                backgroundImage: 'radial-gradient(#d6c6a5 1px, transparent 1px)',
                                backgroundSize: '16px 16px'
                            }}
                        >
                            {/* Paper Header */}
                            <div className="text-center border-b-2 border-[#3d3224] pb-3">
                                <div className="flex items-center justify-between text-[11px] font-mono tracking-widest text-[#5c4d38] border-b border-[#3d3224]/30 pb-1 mb-2">
                                    <span>YIL: {era.yearDisplay} // ÖZEL BASKI</span>
                                    <span>SAYI: NO. {Math.floor(100 + Math.random() * 900)}</span>
                                    <span>FİYAT: 5 KURUŞ</span>
                                </div>
                                <h1 className="text-3xl sm:text-4xl font-black tracking-tight font-serif uppercase text-[#1c1813]">
                                    THE TIME TRAVELER POST
                                </h1>
                                <p className="text-[10px] sm:text-xs tracking-wider uppercase text-[#5c4d38] italic mt-0.5">
                                    Cihan Havadisleri & Çağlar Arası Tarih Mecmuası
                                </p>
                            </div>

                            {/* Headline */}
                            <div className="text-center my-3">
                                <h2 className="text-xl sm:text-2xl font-black leading-tight text-[#1c1813] uppercase border-y-2 border-[#3d3224] py-2">
                                    {era.newspaperHeadlineTr}
                                </h2>
                                <p className="text-xs sm:text-sm font-semibold text-[#3d3224] mt-1.5 italic">
                                    {era.newspaperSubTr}
                                </p>
                            </div>

                            {/* Center Content: Photo & Article */}
                            <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
                                <div className="sm:col-span-6 flex flex-col items-center">
                                    <div className="border-2 border-[#3d3224] p-1.5 bg-[#eae0c8] shadow-md">
                                        <img
                                            src={imageUrl}
                                            alt="Tarihi Portre"
                                            className="w-full h-auto object-cover grayscale contrast-125 sepia-[0.3]"
                                        />
                                    </div>
                                    <span className="text-[10px] text-[#5c4d38] italic mt-1 text-center font-mono">
                                        Görsel: {travelerName} ({era.yearDisplay})
                                    </span>
                                </div>

                                <div className="sm:col-span-6 text-[11px] leading-relaxed text-[#2c2419] space-y-2 text-justify">
                                    <p>
                                        <span className="text-2xl font-black float-left mr-1.5 leading-none">B</span>
                                        ugün tarihe geçecek olağanüstü bir hadiseye şahitlik edildi. Zaman tünelinden intikal eden seyyah <strong>{travelerName}</strong>, dönemin önde gelen cemiyeti tarafından karşılandı.
                                    </p>
                                    <p>
                                        Dönemin atmosferine bizzat intibak eden seyyah, <em>"{era.historicalFactTr}"</em> notunu düşerek tarihi arşive mühür vurdu.
                                    </p>
                                </div>
                            </div>

                            {/* Footer Bar */}
                            <div className="border-t-2 border-[#3d3224] pt-2 text-[9px] font-mono text-[#5c4d38] flex justify-between items-center">
                                <span>ZAMAN BAKANLIĞI RESMİ ARŞİVİ</span>
                                <span>KOD: {passportNo}</span>
                            </div>
                        </div>
                    </div>
                )}

                {/* ================= MODE 2: TIME TRAVEL PASSPORT ================= */}
                {mode === 'passport' && (
                    <div className="flex flex-col items-center">
                        <div
                            ref={passportRef}
                            className="w-full max-w-md bg-gradient-to-br from-indigo-950 via-slate-900 to-black p-6 sm:p-8 rounded-3xl border-2 border-amber-400 shadow-2xl relative overflow-hidden select-none"
                        >
                            {/* Hologram Badge */}
                            <div className="absolute top-4 right-4 w-12 h-12 rounded-full bg-gradient-to-tr from-cyan-400 via-fuchsia-400 to-amber-300 opacity-80 blur-[1px] animate-pulse flex items-center justify-center text-xs font-black text-black shadow-lg">
                                🌐 VISA
                            </div>

                            {/* Header */}
                            <div className="border-b border-amber-400/30 pb-3 mb-4">
                                <div className="text-[10px] font-mono tracking-widest text-amber-400 uppercase">
                                    TEMPORAL TRAVEL AUTHORITY // PASAPORT
                                </div>
                                <h2 className="text-xl font-black text-white tracking-wide">
                                    ZAMAN BAKANLIĞI VİZESİ
                                </h2>
                            </div>

                            {/* Body Grid */}
                            <div className="flex gap-4 items-center">
                                <div className="w-28 h-36 rounded-xl overflow-hidden border-2 border-amber-400/80 shadow-md shrink-0">
                                    <img
                                        src={imageUrl}
                                        alt="Seyyah Portresi"
                                        className="w-full h-full object-cover"
                                    />
                                </div>

                                <div className="space-y-2 text-xs">
                                    <div>
                                        <div className="text-[9px] font-mono text-slate-400 uppercase">Seyyah Adı</div>
                                        <div className="font-bold text-white text-sm">{travelerName}</div>
                                    </div>
                                    <div>
                                        <div className="text-[9px] font-mono text-slate-400 uppercase">Hedef Çağ / Yıl</div>
                                        <div className="font-bold text-amber-400">{era.titleTr} ({era.yearDisplay})</div>
                                    </div>
                                    <div>
                                        <div className="text-[9px] font-mono text-slate-400 uppercase">Pasaport No</div>
                                        <div className="font-mono font-bold text-emerald-400 text-xs">{passportNo}</div>
                                    </div>
                                    <div>
                                        <div className="text-[9px] font-mono text-slate-400 uppercase">Yetki Düzeyi</div>
                                        <div className="font-bold text-cyan-300">SINIRSIZ ZAMAN YOLCUSU ⚡</div>
                                    </div>
                                </div>
                            </div>

                            {/* Passport Footer Stamp */}
                            <div className="mt-5 pt-3 border-t border-slate-800 flex items-center justify-between text-[9px] font-mono text-slate-400">
                                <span>ONAYLANDI: HILL VALLEY 1985</span>
                                <span className="text-amber-400 font-bold">MÜHÜRLÜ & GEÇERLİ</span>
                            </div>
                        </div>
                    </div>
                )}

                {/* Bottom Actions */}
                <div className="flex items-center justify-center gap-4 mt-6 pt-4 border-t border-slate-800">
                    <button
                        disabled={isExporting}
                        onClick={handleDownload}
                        className="px-6 py-3 rounded-2xl bg-gradient-to-r from-amber-400 to-yellow-500 text-slate-950 font-black text-sm shadow-lg shadow-amber-500/20 hover:brightness-110 active:scale-95 transition flex items-center gap-2 cursor-pointer"
                    >
                        <span>📥</span>
                        <span>{isExporting ? 'Hazırlanıyor...' : `${mode === 'newspaper' ? 'Gazeteyi' : 'Pasaportu'} İndir (PNG)`}</span>
                    </button>
                    <button
                        onClick={() => { playTick(); onClose(); }}
                        className="px-5 py-3 rounded-2xl bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 text-sm font-bold transition cursor-pointer"
                    >
                        Kapat
                    </button>
                </div>
            </div>
        </div>
    );
}
