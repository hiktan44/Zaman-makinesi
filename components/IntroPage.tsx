/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import React, { useState } from 'react';
import { useT } from '../lib/useT';
import Header from './Header';
import { ERAS } from '../constants/eraConstants';
import { playTick, playWarp } from '../lib/sfxUtils';

interface IntroPageProps {
    onStart: () => void;
    onOpenPricing?: () => void;
    onOpenAuth?: () => void;
    onOpenAdmin?: () => void;
}

export default function IntroPage({ onStart, onOpenPricing, onOpenAuth, onOpenAdmin }: IntroPageProps) {
    const { t } = useT();

    // Interactive Before/After slider state
    const [sliderPos, setSliderPos] = useState<number>(50);
    const [activeDemoEraIndex, setActiveDemoEraIndex] = useState<number>(0);
    const [openFaq, setOpenFaq] = useState<number | null>(null);

    const demoEras = [
        {
            title: '1920’ler — Great Gatsby',
            year: '1925',
            badge: 'Caz Çağı',
            icon: '🎷',
            afterImg: '/images/demo-gatsby.jpg',
            fact: 'Pinstripe zarafet, şampanya kadehleri, art-deco speakeasy balosu ve inci saç bandı.'
        },
        {
            title: '1550 — Osmanlı Saray Sultanı',
            year: '1550',
            badge: 'Topkapı Sarayı',
            icon: '👑',
            afterImg: '/images/demo-ottoman.jpg',
            fact: 'Altın işlemeli zümrüt kadife kaftan, mücevherli saray tacı ve İznik çinili kemerli avlu.'
        },
        {
            title: '2077 — Cyberpunk Neo-İstanbul',
            year: '2077',
            badge: 'Sibernetik İmplant',
            icon: '🤖',
            afterImg: '/images/demo-cyberpunk.jpg',
            fact: 'Işıldayan nöral şakak devreleri, holografik neon yaka ve yağmurlu siber gökdelenler.'
        },
        {
            title: 'M.Ö. 1350 — Antik Mısır Kraliçesi',
            year: 'M.Ö. 1350',
            badge: 'Nil Krallığı',
            icon: '🏺',
            afterImg: '/images/demo-egypt.jpg',
            fact: 'Lapis lazuli ve altın Nemes tacı, turkuaz geniş gerdanlık ve hiyeroglifli taş tapınak.'
        },
        {
            title: '1885 — Vahşi Batı Şerifi',
            year: '1885',
            badge: 'Frontier Kovboyu',
            icon: '🤠',
            afterImg: '/images/demo-west.jpg',
            fact: 'Tozlu deri trençkot, gümüş şerif yıldızı, kovboy şapkası ve batı kasabası boardwalk.'
        }
    ];

    const currentDemo = demoEras[activeDemoEraIndex];

    const faqs = [
        {
            q: 'Zaman Makinesi yüz benzerliğimi nasıl koruyor?',
            a: 'Gelişmiş yüz tanıma ve yüz koruma (Face-Fidelity) algoritmalarımız sayesinde göz, burun, çene ve bakış yapınız birebir korunurken; kıyafetleriniz, saç stiliniz, ışıklandırma ve fotoğraf dokusu seçtiğiniz tarihi döneme kusursuzca uyarlanır.'
        },
        {
            q: 'Ücretsiz deneme yapabilir miyim?',
            a: 'Evet! Google ile giriş yapan her yeni kullanıcıya anında 5 Ücretsiz Plütonyum Kredisi tanımlanır. İstediğiniz 5 farklı çağa anında ücretsiz seyahat edebilirsiniz.'
        },
        {
            q: 'Tarihi Gazete ve Zaman Pasaportu çıktısı nedir?',
            a: 'Ürettiğiniz her dönem portresi için o yılın gerçek tarihi manşetini (örneğin 1923 Cumhuriyet ilanı veya 1969 Ay’a iniş) içeren sararmış antika gazete sayfası ve Zaman Bakanlığı onaylı seyahat pasaportu oluşturup yüksek çözünürlüklü PNG ve PDF olarak indirebilirsiniz.'
        },
        {
            q: '9:16 Video Klip (Timelapse) nasıl çalışır?',
            a: 'Orijinal fotoğrafınızdan başlayıp geçmiş ve gelecekteki tüm çağlarınıza akıcı bir geçiş (morph) yapan dikey reels/TikTok videosu oluşturur. Sosyal medyada paylaşmaya hazır tek tıkla indirilir.'
        }
    ];

    return (
        <div className="relative min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-amber-400 selection:text-slate-950 overflow-x-hidden">
            {/* Header */}
            <Header
                onOpenPricing={onOpenPricing}
                onOpenAuth={onOpenAuth}
                onOpenAdmin={onOpenAdmin}
                onToggleView={onStart}
                viewMode="intro"
            />

            {/* Glowing Ambient Background Orbs */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
                <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[700px] h-[500px] bg-gradient-to-b from-amber-500/20 via-cyan-500/10 to-transparent blur-[120px] rounded-full" />
                <div className="absolute top-1/3 -left-40 w-[500px] h-[500px] bg-purple-600/15 blur-[140px] rounded-full" />
                <div className="absolute bottom-10 -right-40 w-[600px] h-[600px] bg-amber-500/15 blur-[160px] rounded-full" />
            </div>

            <main className="flex-grow space-y-24 md:space-y-32 py-8 md:py-16">
                {/* 1. HERO SECTION WITH INTERACTIVE SPLIT COMPARISON SLIDER */}
                <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                        {/* Hero Text */}
                        <div className="lg:col-span-6 flex flex-col items-start space-y-6 text-left">
                            {/* Animated Badge */}
                            <div className="inline-flex items-center gap-2.5 bg-gradient-to-r from-amber-500/15 via-yellow-500/20 to-amber-500/10 border border-amber-500/30 px-4 py-1.5 rounded-full shadow-lg shadow-amber-500/10 backdrop-blur-md animate-pulse">
                                <span className="text-amber-400 text-sm">⚡</span>
                                <span className="text-xs font-black tracking-wider text-amber-300 uppercase">
                                    V4 FLUX — YENİ NESİL ZAMAN YOLCULUĞU
                                </span>
                            </div>

                            {/* Main Title */}
                            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-[1.1]">
                                Kendinizi <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-amber-400 to-yellow-500">Tarihin ve Geleceğin</span> İçinde Görün.
                            </h1>

                            <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-xl">
                                Tek bir portrenizi yükleyin; <strong>Osmanlı Sarayı'ndan 1920 Gatsby Caz Kulübü'ne, Antik Mısır'dan 2077 Cyberpunk Şehrine</strong> kadar 30+ farklı çağda yüz hatlarınız bozulmadan zamanda sıçrayın.
                            </p>

                            {/* CTA Button & Fuel Bonus */}
                            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full sm:w-auto pt-2">
                                <button
                                    onClick={() => { playWarp(); onStart(); }}
                                    className="px-8 py-4 rounded-2xl bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 text-slate-950 font-black text-base md:text-lg shadow-xl shadow-amber-500/25 hover:shadow-amber-500/40 hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-3 cursor-pointer group"
                                >
                                    <span>🚀 ZAMAN KOKPİTİNİ ÇALIŞTIR</span>
                                    <span className="group-hover:translate-x-1 transition-transform">→</span>
                                </button>

                                <div className="flex items-center gap-2.5 bg-slate-900/90 border border-slate-800 px-4 py-3 rounded-2xl">
                                    <span className="text-2xl">🎁</span>
                                    <div className="text-left">
                                        <div className="text-xs font-black text-amber-400">5 Ücretsiz Sıçrama</div>
                                        <div className="text-[10px] text-slate-400">Giriş yap ve hemen dene</div>
                                    </div>
                                </div>
                            </div>

                            {/* Trust Proof Badges */}
                            <div className="grid grid-cols-3 gap-4 pt-4 border-t border-slate-800/80 w-full">
                                <div>
                                    <div className="text-2xl font-black text-white font-mono">30+</div>
                                    <div className="text-xs text-slate-400">Tarihi & Siber Çağ</div>
                                </div>
                                <div>
                                    <div className="text-2xl font-black text-amber-400 font-mono">3 Saniye</div>
                                    <div className="text-xs text-slate-400">Hızlı AI Motoru</div>
                                </div>
                                <div>
                                    <div className="text-2xl font-black text-cyan-400 font-mono">%100</div>
                                    <div className="text-xs text-slate-400">Yüz Benzerliği</div>
                                </div>
                            </div>
                        </div>

                        {/* Interactive Before/After Split Comparison Showcase */}
                        <div className="lg:col-span-6 flex flex-col items-center">
                            {/* Era Selector Tabs */}
                            <div className="flex flex-wrap items-center justify-center gap-2 mb-4">
                                {demoEras.map((item, idx) => (
                                    <button
                                        key={item.year}
                                        onClick={() => { playTick(); setActiveDemoEraIndex(idx); }}
                                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                                            activeDemoEraIndex === idx
                                                ? 'bg-amber-400 text-slate-950 font-black shadow-lg shadow-amber-500/30 scale-105'
                                                : 'bg-slate-900 border border-slate-800 text-slate-300 hover:bg-slate-800'
                                        }`}
                                    >
                                        <span>{item.icon}</span>
                                        <span>{item.title}</span>
                                    </button>
                                ))}
                            </div>

                            {/* Interactive Comparison Box */}
                            <div className="relative w-full aspect-[3/4] max-w-sm sm:max-w-md rounded-3xl overflow-hidden border-2 border-slate-800 shadow-2xl bg-slate-900 select-none group">
                                {/* After Image (Historical Result) */}
                                <img
                                    src={currentDemo.afterImg}
                                    alt="Historical Era Result"
                                    className="absolute inset-0 w-full h-full object-cover"
                                />

                                {/* Before Image (Modern Portrait) Clipped */}
                                <div
                                    className="absolute inset-0 overflow-hidden border-r-2 border-amber-400 shadow-[0_0_20px_rgba(251,191,36,0.9)]"
                                    style={{ width: `${sliderPos}%` }}
                                >
                                    <img
                                        src="/images/demo-original.png"
                                        alt="Modern Original Photo"
                                        className="absolute inset-0 w-full h-full object-cover max-w-none"
                                        style={{ width: '100%', height: '100%', minWidth: '380px' }}
                                    />
                                    <div className="absolute top-4 left-4 bg-slate-950/85 backdrop-blur-md text-slate-200 border border-slate-700 px-3 py-1 rounded-full text-xs font-bold shadow-md">
                                        📷 Orijinal Portre
                                    </div>
                                </div>

                                {/* After Tag */}
                                <div className="absolute top-4 right-4 bg-amber-500/90 backdrop-blur-md text-slate-950 font-black px-3 py-1 rounded-full text-xs shadow-md">
                                    ✨ {currentDemo.year} {currentDemo.badge}
                                </div>

                                {/* Slider Handle */}
                                <div
                                    className="absolute top-0 bottom-0 -ml-4 flex items-center justify-center pointer-events-none"
                                    style={{ left: `${sliderPos}%` }}
                                >
                                    <div className="w-8 h-8 rounded-full bg-amber-400 text-slate-950 flex items-center justify-center font-black text-xs shadow-2xl border-2 border-white ring-4 ring-amber-500/40">
                                        ↔
                                    </div>
                                </div>

                                {/* Invisible Slider Range Input */}
                                <input
                                    type="range"
                                    min="5"
                                    max="95"
                                    value={sliderPos}
                                    onChange={(e) => setSliderPos(Number(e.target.value))}
                                    className="absolute inset-0 opacity-0 cursor-ew-resize w-full h-full z-30"
                                />

                                {/* Bottom Info Caption */}
                                <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black via-black/80 to-transparent p-4 flex items-center justify-between text-xs">
                                    <span className="text-slate-200 font-medium line-clamp-2">
                                        {currentDemo.fact}
                                    </span>
                                    <span className="text-amber-400 font-bold font-mono shrink-0 ml-2">
                                        ◀ Kaydırın ▶
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* 2. BENTO GRID FEATURES */}
                <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center space-y-4 mb-14">
                        <div className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/30 px-3.5 py-1 rounded-full text-amber-400 text-xs font-black uppercase">
                            ✨ ÇIĞIR AÇAN ÖZELLİKLER
                        </div>
                        <h2 className="text-3xl sm:text-4xl font-black text-white">
                            Basit Bir Filtre Değil, <span className="text-amber-400">Eksiksiz Bir Zaman Makinesi</span>
                        </h2>
                        <p className="text-slate-400 text-sm md:text-base max-w-2xl mx-auto">
                            Tarihi gazete baskısından TikTok timelapse videolarına, DeLorean ses efektlerinden çoklu çağ seçimine kadar hepsi elinizin altında.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Feature 1: DeLorean Cockpit */}
                        <div className="rounded-3xl bg-slate-900/80 border border-slate-800 p-6 md:p-8 flex flex-col justify-between hover:border-amber-500/40 transition group">
                            <div className="space-y-4">
                                <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-2xl">
                                    ⚡
                                </div>
                                <h3 className="text-xl font-bold text-white group-hover:text-amber-300 transition">
                                    DeLorean LED Zaman Devreleri & SFX
                                </h3>
                                <p className="text-xs md:text-sm text-slate-400 leading-relaxed">
                                    Geleceğe Dönüş filmindeki gibi çalışan hedef, şimdiki zaman ve ayrılış LED göstergeleri ve tarayıcıda üretilen mekanik kadran sesleri.
                                </p>
                            </div>
                            <div className="mt-6 rounded-2xl bg-black/60 p-3 border border-slate-800 font-mono text-xs flex items-center justify-between text-amber-400">
                                <span>DESTINATION: 1550 OCT 26</span>
                                <span className="text-emerald-400 font-bold">● FLUX ACTIVE</span>
                            </div>
                        </div>

                        {/* Feature 2: Historical Newspaper & Passport */}
                        <div className="rounded-3xl bg-slate-900/80 border border-slate-800 p-6 md:p-8 flex flex-col justify-between hover:border-cyan-500/40 transition group">
                            <div className="space-y-4">
                                <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-2xl">
                                    🗞️
                                </div>
                                <h3 className="text-xl font-bold text-white group-hover:text-cyan-300 transition">
                                    Tarihi Gazete & Zaman Pasaportu
                                </h3>
                                <p className="text-xs md:text-sm text-slate-400 leading-relaxed">
                                    Gittiğiniz çağın gerçek tarihi manşetleriyle sararmış antika gazete küpürü veya Zaman Bakanlığı onaylı dijital pasaport çıktısı alın.
                                </p>
                            </div>
                            <div className="mt-6 rounded-2xl bg-black/60 p-3 border border-slate-800 text-xs flex items-center justify-between text-slate-300">
                                <span className="font-serif">The Time Traveler Post</span>
                                <span className="bg-amber-400 text-slate-950 font-black px-2 py-0.5 rounded text-[10px]">PDF / PNG</span>
                            </div>
                        </div>

                        {/* Feature 3: 9:16 Video Morph Timelapse */}
                        <div className="rounded-3xl bg-slate-900/80 border border-slate-800 p-6 md:p-8 flex flex-col justify-between hover:border-purple-500/40 transition group">
                            <div className="space-y-4">
                                <div className="w-12 h-12 rounded-2xl bg-purple-500/20 border border-purple-500/40 flex items-center justify-center text-2xl">
                                    🎬
                                </div>
                                <h3 className="text-xl font-bold text-white group-hover:text-purple-300 transition">
                                    9:16 Reels & TikTok Video Klip
                                </h3>
                                <p className="text-xs md:text-sm text-slate-400 leading-relaxed">
                                    Orijinal fotoğrafınızdan tüm çağlara akıcı bir yüz morph timelapse geçişi. Sosyal medyada viral olacak formatta anında hazır.
                                </p>
                            </div>
                            <div className="mt-6 rounded-2xl bg-black/60 p-3 border border-slate-800 text-xs flex items-center justify-between text-purple-300">
                                <span>9:16 Cross-Fade Timelapse</span>
                                <span className="text-white font-bold">WebM Video</span>
                            </div>
                        </div>
                    </div>
                </section>

                {/* 3. INTERACTIVE ERA EXPLORER TRACK */}
                <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
                        <div>
                            <div className="text-amber-400 text-xs font-black uppercase tracking-wider mb-2">
                                🌌 GENİŞ EVREN KATALOĞU
                            </div>
                            <h2 className="text-2xl sm:text-3xl font-black text-white">
                                30+ Zengin Tarih ve Gelecek Portalı
                            </h2>
                        </div>
                        <button
                            onClick={() => { playTick(); onStart(); }}
                            className="text-xs font-bold text-amber-400 hover:text-amber-300 transition flex items-center gap-1 cursor-pointer"
                        >
                            <span>Tüm Portalları Kokpitte Gör</span>
                            <span>→</span>
                        </button>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3.5">
                        {ERAS.slice(0, 12).map((era) => (
                            <div
                                key={era.id}
                                onClick={() => { playTick(); onStart(); }}
                                className="group relative rounded-2xl p-3 border border-slate-800 hover:border-amber-400 overflow-hidden cursor-pointer transition-all hover:scale-105 select-none"
                            >
                                <div
                                    className="absolute inset-0 bg-cover bg-center opacity-30 group-hover:opacity-45 transition-opacity"
                                    style={{ backgroundImage: `url(${era.bgImage})` }}
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent" />
                                <div className="relative z-10 flex flex-col justify-between h-28">
                                    <div className="flex items-center justify-between">
                                        <span className="text-2xl">{era.icon}</span>
                                        <span className="text-[10px] bg-black/60 border border-white/10 px-1.5 py-0.5 rounded font-mono text-amber-300">
                                            {era.yearDisplay}
                                        </span>
                                    </div>
                                    <div>
                                        <div className="text-xs font-bold text-white line-clamp-1 group-hover:text-amber-300 transition">
                                            {era.titleTr}
                                        </div>
                                        <div className="text-[10px] text-slate-400 line-clamp-1">
                                            {era.badge}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* 4. PRICING & FUEL SECTION */}
                <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="rounded-3xl bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-800 p-8 md:p-12 text-center space-y-8 shadow-2xl">
                        <div className="space-y-3">
                            <div className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/30 px-3.5 py-1 rounded-full text-amber-400 text-xs font-black uppercase">
                                ⚡ ŞEFFAF VE DÜŞÜK MALİYETLİ
                            </div>
                            <h2 className="text-3xl sm:text-4xl font-black text-white">
                                5 Ücretsiz Kredi ile Başlayın, Diledikçe Yükleyin
                            </h2>
                            <p className="text-slate-400 text-xs md:text-sm max-w-xl mx-auto">
                                Abonelik tuzağı yok. Kullandığın kadar öde mantığıyla dilediğin zaman paket al, süresiz kullan.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-4xl mx-auto text-left">
                            {/* Starter */}
                            <div className="rounded-2xl bg-slate-950 border border-slate-800 p-6 space-y-4 hover:border-slate-700 transition">
                                <div className="text-xs font-bold text-slate-400">Zaman Kapsülü</div>
                                <div className="text-3xl font-black text-white">₺49</div>
                                <div className="text-amber-400 font-mono text-sm font-bold">25 Plütonyum Kredisi</div>
                                <ul className="text-xs text-slate-300 space-y-2 pt-2 border-t border-slate-800">
                                    <li>✓ 25 Fotoğraf Sıçraması</li>
                                    <li>✓ Tarihi Gazete & Pasaport</li>
                                    <li>✓ HD İndirme</li>
                                </ul>
                                <button
                                    onClick={() => onOpenPricing && onOpenPricing()}
                                    className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs transition cursor-pointer"
                                >
                                    Paketi Seç
                                </button>
                            </div>

                            {/* Popular */}
                            <div className="relative rounded-2xl bg-gradient-to-b from-amber-950/40 to-slate-950 border-2 border-amber-400 p-6 space-y-4 shadow-xl shadow-amber-500/10">
                                <div className="absolute -top-3 right-4 bg-amber-400 text-slate-950 text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase">
                                    En Popüler
                                </div>
                                <div className="text-xs font-bold text-amber-300">Zaman Gezgini</div>
                                <div className="text-3xl font-black text-white">₺99</div>
                                <div className="text-amber-400 font-mono text-sm font-bold">75 Plütonyum Kredisi</div>
                                <ul className="text-xs text-slate-300 space-y-2 pt-2 border-t border-slate-800">
                                    <li>✓ 75 Fotoğraf Sıçraması</li>
                                    <li>✓ 9:16 Video Timelapse Klip</li>
                                    <li>✓ Öncelikli Hızlı Üretim</li>
                                </ul>
                                <button
                                    onClick={() => onOpenPricing && onOpenPricing()}
                                    className="w-full py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs transition cursor-pointer shadow-md"
                                >
                                    Hemen Yükle
                                </button>
                            </div>

                            {/* Pro */}
                            <div className="rounded-2xl bg-slate-950 border border-slate-800 p-6 space-y-4 hover:border-slate-700 transition">
                                <div className="text-xs font-bold text-slate-400">Zaman Lordu</div>
                                <div className="text-3xl font-black text-white">₺199</div>
                                <div className="text-amber-400 font-mono text-sm font-bold">250 Plütonyum Kredisi</div>
                                <ul className="text-xs text-slate-300 space-y-2 pt-2 border-t border-slate-800">
                                    <li>✓ 250 Fotoğraf Sıçraması</li>
                                    <li>✓ Sınırsız Video Klip & Albüm</li>
                                    <li>✓ En Yüksek Çözünürlük</li>
                                </ul>
                                <button
                                    onClick={() => onOpenPricing && onOpenPricing()}
                                    className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs transition cursor-pointer"
                                >
                                    Paketi Seç
                                </button>
                            </div>
                        </div>
                    </div>
                </section>

                {/* 5. FAQ SECTION */}
                <section className="max-w-3xl mx-auto px-4 sm:px-6">
                    <div className="text-center space-y-3 mb-10">
                        <h2 className="text-2xl sm:text-3xl font-black text-white">Sıkça Sorulan Sorular</h2>
                        <p className="text-slate-400 text-xs sm:text-sm">Aklınıza takılan tüm soruların yanıtları</p>
                    </div>

                    <div className="space-y-3">
                        {faqs.map((faq, i) => (
                            <div
                                key={i}
                                className="rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden transition"
                            >
                                <button
                                    onClick={() => { playTick(); setOpenFaq(openFaq === i ? null : i); }}
                                    className="w-full p-4 text-left flex items-center justify-between text-sm font-bold text-white hover:text-amber-300 transition cursor-pointer"
                                >
                                    <span>{faq.q}</span>
                                    <span className="text-amber-400 text-base">{openFaq === i ? '−' : '+'}</span>
                                </button>
                                {openFaq === i && (
                                    <div className="p-4 pt-0 text-xs sm:text-sm text-slate-300 leading-relaxed border-t border-slate-800/60 bg-slate-950/40">
                                        {faq.a}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </section>

                {/* 6. BOTTOM ACTION BANNER */}
                <section className="max-w-5xl mx-auto px-4 sm:px-6">
                    <div className="rounded-3xl bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-600 p-8 md:p-12 text-center text-slate-950 space-y-6 shadow-2xl">
                        <h2 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
                            Zaman Sizi Bekliyor. Tarihinize Bugün Tanıklık Edin.
                        </h2>
                        <p className="text-slate-900 font-medium text-sm md:text-base max-w-xl mx-auto">
                            Hemen bir fotoğrafınızı yükleyin, 5 ücretsiz sıçrama hakkınızla geçmişe ve geleceğe ilk adımınızı atın.
                        </p>
                        <button
                            onClick={() => { playWarp(); onStart(); }}
                            className="px-10 py-4 rounded-2xl bg-slate-950 text-white font-black text-base shadow-2xl hover:scale-105 active:scale-95 transition cursor-pointer"
                        >
                            🚀 KOKPİTE GİT VE BAŞLA
                        </button>
                    </div>
                </section>
            </main>
        </div>
    );
}
