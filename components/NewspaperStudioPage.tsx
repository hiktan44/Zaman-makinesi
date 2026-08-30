/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import React, { useState, useRef } from 'react';
import html2canvas from 'html2canvas';
import { ERAS, EraDefinition } from '../constants/eraConstants';
import { playCameraShutter, playSuccess, playTick } from '../lib/sfxUtils';
import { useAuth } from '../contexts/AuthContext';

interface NewspaperStudioPageProps {
    images: { eraId: string; url: string }[];
    originalImage: string | null;
    onNavigateToCockpit: () => void;
}

export default function NewspaperStudioPage({
    images,
    originalImage,
    onNavigateToCockpit
}: NewspaperStudioPageProps) {
    const newspaperRef = useRef<HTMLDivElement>(null);
    const passportRef = useRef<HTMLDivElement>(null);
    const [mode, setMode] = useState<'newspaper' | 'passport'>('newspaper');
    const [selectedEraId, setSelectedEraId] = useState<string>('1920s');
    const [isExporting, setIsExporting] = useState(false);
    const { user } = useAuth();

    // Default demo images if user hasn't generated any yet
    const demoMap: Record<string, string> = {
        '1920s': '/images/demo-gatsby.jpg',
        'ottoman_sultan': '/images/demo-ottoman.jpg',
        'wild_west_1880': '/images/demo-west.jpg',
        'ancient_egypt': '/images/demo-egypt.jpg',
        'cyberpunk_2077': '/images/demo-cyberpunk.jpg'
    };

    // Find the current image to display
    const userImageObj = images.find(img => img.eraId === selectedEraId);
    const currentPhotoUrl = userImageObj ? userImageObj.url : (demoMap[selectedEraId] || originalImage || '/images/demo-gatsby.jpg');

    const era: EraDefinition = ERAS.find(e => e.id === selectedEraId) || ERAS[0];

    // Editable headline states
    const [customHeadline, setCustomHeadline] = useState<string>('');
    const [customSubhead, setCustomSubhead] = useState<string>('');

    const displayHeadline = customHeadline || era.newspaperHeadlineTr;
    const displaySubhead = customSubhead || era.newspaperSubTr;

    const travelerName = user?.email ? user.email.split('@')[0].toUpperCase() : 'HİKMET SEYMATA';
    const passportNo = `ZM-${era.yearDisplay.replace(/\D/g, '') || '1920'}-${Math.floor(1000 + Math.random() * 9000)}`;

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
            link.download = mode === 'newspaper'
                ? `tarihi-gazete-${era.id}.png`
                : `zaman-pasaportu-${era.id}.png`;
            link.href = canvas.toDataURL('image/png');
            link.click();
            playSuccess();
        } catch (err) {
            console.error('Export hatası:', err);
            alert('Görsel oluşturulurken bir hata oluştu.');
        } finally {
            setIsExporting(false);
        }
    };

    return (
        <div className="w-full max-w-7xl mx-auto px-4 py-8 flex flex-col space-y-8 animate-in fade-in duration-300">
            {/* Top Studio Header */}
            <div className="flex flex-wrap items-center justify-between gap-4 bg-slate-900/90 border border-slate-800 p-6 rounded-3xl shadow-xl">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-2xl">
                        📰
                    </div>
                    <div>
                        <div className="flex items-center gap-2">
                            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                                TARİHİ GAZETE & PASAPORT BASIMEVİ
                            </h2>
                            <span className="bg-amber-400 text-slate-950 text-[10px] font-black px-2 py-0.5 rounded-full uppercase">
                                ARŞİV BASKISI
                            </span>
                        </div>
                        <p className="text-xs text-slate-400">
                            Fotoğrafınızı o dönemin 1. sayfa manşet gazetesine veya holografik Zaman Gezgini Pasaportuna dönüştürün.
                        </p>
                    </div>
                </div>

                {/* Mode Selector & Download Action */}
                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-slate-950 border border-slate-800">
                        <button
                            onClick={() => { playTick(); setMode('newspaper'); }}
                            className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
                                mode === 'newspaper'
                                    ? 'bg-amber-400 text-slate-950 font-black shadow-md'
                                    : 'text-slate-400 hover:text-white'
                            }`}
                        >
                            <span>📰</span>
                            <span>Tarihi Gazete</span>
                        </button>
                        <button
                            onClick={() => { playTick(); setMode('passport'); }}
                            className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
                                mode === 'passport'
                                    ? 'bg-amber-400 text-slate-950 font-black shadow-md'
                                    : 'text-slate-400 hover:text-white'
                            }`}
                        >
                            <span>🛂</span>
                            <span>Zaman Pasaportu</span>
                        </button>
                    </div>

                    <button
                        disabled={isExporting}
                        onClick={handleDownload}
                        className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-300 hover:to-yellow-400 text-slate-950 font-black text-xs shadow-md active:scale-95 transition flex items-center gap-2 cursor-pointer"
                    >
                        <span>{isExporting ? '⏳' : '📥'}</span>
                        <span>{isExporting ? 'Basılıyor...' : 'Yüksek Kalitede İndir (PNG)'}</span>
                    </button>
                </div>
            </div>

            {/* Era Picker Horizontal Bar */}
            <div className="flex items-center gap-2.5 overflow-x-auto pb-2">
                {ERAS.map((e) => {
                    const isSelected = e.id === selectedEraId;
                    const hasGen = images.some(img => img.eraId === e.id);
                    return (
                        <button
                            key={e.id}
                            onClick={() => {
                                playTick();
                                setSelectedEraId(e.id);
                                setCustomHeadline('');
                                setCustomSubhead('');
                            }}
                            className={`px-3.5 py-2 rounded-2xl border text-xs font-bold whitespace-nowrap transition cursor-pointer flex items-center gap-2 ${
                                isSelected
                                    ? 'bg-amber-500/20 border-amber-400 text-amber-300 font-black shadow-lg shadow-amber-500/10'
                                    : 'bg-slate-900/90 border-slate-800 text-slate-400 hover:text-slate-200'
                            }`}
                        >
                            <span>{e.icon}</span>
                            <span>{e.yearDisplay} {e.titleTr.split('—')[0]}</span>
                            {hasGen && <span className="w-2 h-2 rounded-full bg-emerald-400"></span>}
                        </button>
                    );
                })}
            </div>

            {/* Main Canvas / Newspaper Area */}
            <div className="flex flex-col lg:flex-row gap-8 items-start justify-center">
                
                {/* Visual Output Box */}
                <div className="w-full max-w-2xl flex justify-center">
                    {mode === 'newspaper' ? (
                        /* VINTAGE NEWSPAPER CARD */
                        <div
                            ref={newspaperRef}
                            className="w-full max-w-xl bg-[#f4ecd8] text-[#2c2416] p-6 sm:p-8 rounded-xl shadow-2xl border-4 border-[#3d3222] font-serif selection:bg-amber-700 selection:text-white"
                            style={{
                                backgroundImage: `radial-gradient(#d6c7a1 1px, transparent 1px), radial-gradient(#d6c7a1 1px, #f4ecd8 1px)`,
                                backgroundSize: `20px 20px`
                            }}
                        >
                            {/* Newspaper Header */}
                            <div className="border-b-4 border-double border-[#2c2416] pb-3 mb-4 text-center">
                                <div className="text-[10px] tracking-widest uppercase font-mono font-bold text-[#5c4d36] flex justify-between border-b border-[#8c7a5e] pb-1 mb-2">
                                    <span>SAYI: #{era.yearDisplay.replace(/\D/g, '') || '1920'}</span>
                                    <span>TARİH: {era.yearDisplay} BASKISI</span>
                                    <span>FİYAT: 5 KURUŞ</span>
                                </div>
                                <h1 className="text-2xl sm:text-4xl font-black tracking-tight font-serif uppercase">
                                    ZAMAN VE HAKİKAT GAZETESİ
                                </h1>
                                <p className="text-[11px] italic text-[#5c4d36] mt-1">
                                    "Geçmişin yankıları, bugünün ve yarının en büyük pusulasıdır."
                                </p>
                            </div>

                            {/* Main Headline */}
                            <div className="text-center my-4 border-b-2 border-[#2c2416] pb-3">
                                <h2 className="text-lg sm:text-2xl font-black leading-tight uppercase tracking-tight text-[#1a140a]">
                                    {displayHeadline}
                                </h2>
                                <p className="text-xs sm:text-sm font-semibold italic text-[#4a3b25] mt-1.5">
                                    {displaySubhead}
                                </p>
                            </div>

                            {/* 2-Column Content Layout */}
                            <div className="grid grid-cols-1 sm:grid-cols-12 gap-5 items-start mt-4">
                                {/* Photo Container */}
                                <div className="sm:col-span-6 flex flex-col items-center">
                                    <div className="w-full aspect-square border-2 border-[#2c2416] p-1.5 bg-[#eae0c8] shadow-md">
                                        <img
                                            src={currentPhotoUrl}
                                            alt={era.titleTr}
                                            className="w-full h-full object-cover grayscale contrast-125 sepia-[0.3]"
                                        />
                                    </div>
                                    <span className="text-[9px] font-mono italic text-[#5c4d36] mt-1.5 text-center">
                                        Fotoğraf: {travelerName}, {era.yearDisplay}
                                    </span>
                                </div>

                                {/* Article Text Column */}
                                <div className="sm:col-span-6 text-justify text-xs leading-relaxed space-y-2.5">
                                    <p className="first-letter:text-3xl first-letter:font-black first-letter:float-left first-letter:mr-1.5 first-letter:text-[#1a140a]">
                                        {era.historicalFactTr}
                                    </p>
                                    <p className="text-[11px] text-[#4a3b25]">
                                        Dönemin tanıkları, {travelerName} adlı zaman yolcusunun bu çağın en saygın simalarından biri olduğunu ve tarihin akışına bizzat tanıklık ettiğini bildirdi.
                                    </p>
                                    <div className="p-2.5 bg-[#e5d8b8] border border-[#a89570] rounded text-[10px] italic">
                                        <strong>Resmi Arşiv Notu:</strong> Bu belge Zaman Makinesi V4 Krono-Kayıt Dairesi tarafından onaylanmıştır.
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        /* OFFICIAL TIME-TRAVEL PASSPORT */
                        <div
                            ref={passportRef}
                            className="w-full max-w-lg bg-gradient-to-br from-slate-900 via-blue-950 to-slate-950 text-white p-6 sm:p-8 rounded-2xl shadow-2xl border-2 border-amber-400/60 font-sans relative overflow-hidden"
                        >
                            {/* Watermark Background Stamp */}
                            <div className="absolute right-4 top-12 text-8xl opacity-5 pointer-events-none select-none">
                                🌐
                            </div>

                            {/* Passport Header */}
                            <div className="flex items-center justify-between border-b border-amber-400/40 pb-4 mb-4">
                                <div className="flex items-center gap-2.5">
                                    <span className="text-3xl">🛂</span>
                                    <div>
                                        <div className="text-[10px] tracking-widest text-amber-400 uppercase font-mono font-bold">
                                            CHRONO BORDER AUTHORITY
                                        </div>
                                        <div className="text-base font-black tracking-tight text-white">
                                            ZAMAN GEZGİNİ PASAPORTU
                                        </div>
                                    </div>
                                </div>
                                <div className="text-right font-mono">
                                    <div className="text-[9px] text-slate-400">PASAPORT NO</div>
                                    <div className="text-xs font-black text-amber-400">{passportNo}</div>
                                </div>
                            </div>

                            {/* Passport Body */}
                            <div className="grid grid-cols-12 gap-5 items-center">
                                {/* Portrait Photo with Security Stamp */}
                                <div className="col-span-5 relative">
                                    <div className="w-full aspect-[3/4] rounded-xl overflow-hidden border-2 border-amber-400 shadow-xl bg-slate-950">
                                        <img
                                            src={currentPhotoUrl}
                                            alt={travelerName}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                    <div className="absolute -bottom-2 -right-2 bg-amber-400 text-slate-950 text-[9px] font-black px-2 py-0.5 rounded-full uppercase border border-white">
                                        ONAYLANDI
                                    </div>
                                </div>

                                {/* Identity Data Fields */}
                                <div className="col-span-7 space-y-2 text-xs">
                                    <div>
                                        <div className="text-[9px] text-slate-400 font-mono">GEZGİN ADI (TRAVELER)</div>
                                        <div className="font-black text-white text-sm">{travelerName}</div>
                                    </div>
                                    <div>
                                        <div className="text-[9px] text-slate-400 font-mono">HEDEF ÇAĞ & DÖNEM</div>
                                        <div className="font-bold text-amber-300">{era.yearDisplay} {era.titleTr}</div>
                                    </div>
                                    <div>
                                        <div className="text-[9px] text-slate-400 font-mono">YETKİ DERECESİ</div>
                                        <div className="font-mono text-emerald-400 font-bold">SINIF-A DOKUNULMAZ</div>
                                    </div>
                                    <div>
                                        <div className="text-[9px] text-slate-400 font-mono">GÖREV STATÜSÜ</div>
                                        <div className="text-[11px] text-slate-300">{era.badge}</div>
                                    </div>
                                </div>
                            </div>

                            {/* Machine Readable Zone (MRZ) */}
                            <div className="mt-6 pt-3 border-t border-slate-800 font-mono text-[10px] text-amber-300 tracking-wider break-all bg-slate-950/80 p-2 rounded-lg">
                                {`P<ZM<${travelerName.replace(/\s+/g, '<')}<<<<<<<<<<<<<<<<<<<<`}
                                <br />
                                {`${passportNo}4TUR${era.yearDisplay.replace(/\D/g, '') || '1985'}0M3008298<<<<<<<<<<<<<<06`}
                            </div>
                        </div>
                    )}
                </div>

                {/* Edit Controls Sidebar */}
                <div className="w-full lg:w-80 flex flex-col space-y-4">
                    <div className="rounded-3xl bg-slate-900/90 border border-slate-800 p-6 space-y-4">
                        <h3 className="text-sm font-black text-white flex items-center gap-2">
                            <span>✏️</span> Manşet & Yazı Düzenle
                        </h3>

                        <div>
                            <label className="block text-xs font-bold text-slate-300 mb-1">
                                Ana Manşet Başlığı:
                            </label>
                            <input
                                type="text"
                                value={displayHeadline}
                                onChange={(e) => setCustomHeadline(e.target.value)}
                                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-amber-400"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-slate-300 mb-1">
                                Alt Başlık & Açıklama:
                            </label>
                            <textarea
                                rows={3}
                                value={displaySubhead}
                                onChange={(e) => setCustomSubhead(e.target.value)}
                                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-amber-400"
                            />
                        </div>

                        <button
                            onClick={() => {
                                setCustomHeadline('');
                                setCustomSubhead('');
                                playTick();
                            }}
                            className="text-xs text-amber-400 hover:underline cursor-pointer"
                        >
                            ↺ Orijinal Tarihi Metne Sıfırla
                        </button>
                    </div>

                    <div className="rounded-3xl bg-slate-900/90 border border-slate-800 p-6 space-y-2 text-xs">
                        <div className="font-bold text-white flex items-center gap-1.5">
                            <span>💡</span> İpucu
                        </div>
                        <p className="text-slate-400 text-[11px] leading-relaxed">
                            Yüksek çözünürlüklü PNG çıktısını doğrudan indirip poster olarak bastırabilir veya sosyal medyada hikaye olarak paylaşabilirsiniz.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
