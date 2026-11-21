/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import React, { useState } from 'react';
import { useT } from '../lib/useT';
import Header from './Header';
import { ERAS } from '../constants/eraConstants';
import { eraText } from '../constants/eraDisplay';
import { playTick, playWarp } from '../lib/sfxUtils';

interface IntroPageProps {
    onStart: () => void;
    onOpenPricing?: () => void;
    onOpenAuth?: () => void;
    onOpenAdmin?: () => void;
}

export default function IntroPage({ onStart, onOpenPricing, onOpenAuth, onOpenAdmin }: IntroPageProps) {
    const { t, lang } = useT();

    // Interactive Before/After slider state
    const [sliderPos, setSliderPos] = useState<number>(50);
    const [activeDemoEraIndex, setActiveDemoEraIndex] = useState<number>(0);
    const [openFaq, setOpenFaq] = useState<number | null>(null);

    const demoEras = [
        {
            title: t('ip.demo1.title'),
            year: '1925',
            badge: t('ip.demo1.badge'),
            icon: '🎷',
            afterImg: '/images/demo-gatsby.jpg',
            fact: t('ip.demo1.fact')
        },
        {
            title: t('ip.demo2.title'),
            year: '1550',
            badge: t('ip.demo2.badge'),
            icon: '👑',
            afterImg: '/images/demo-ottoman.jpg',
            fact: t('ip.demo2.fact')
        },
        {
            title: t('ip.demo3.title'),
            year: '2077',
            badge: t('ip.demo3.badge'),
            icon: '🤖',
            afterImg: '/images/demo-cyberpunk.jpg',
            fact: t('ip.demo3.fact')
        },
        {
            title: t('ip.demo4.title'),
            year: t('ip.demo4.year'),
            badge: t('ip.demo4.badge'),
            icon: '🏺',
            afterImg: '/images/demo-egypt.jpg',
            fact: t('ip.demo4.fact')
        },
        {
            title: t('ip.demo5.title'),
            year: '1885',
            badge: t('ip.demo5.badge'),
            icon: '🤠',
            afterImg: '/images/demo-west.jpg',
            fact: t('ip.demo5.fact')
        }
    ];

    const currentDemo = demoEras[activeDemoEraIndex];

    const faqs = [
        {
            q: t('ip.faq1.q'),
            a: t('ip.faq1.a')
        },
        {
            q: t('ip.faq2.q'),
            a: t('ip.faq2.a')
        },
        {
            q: t('ip.faq3.q'),
            a: t('ip.faq3.a')
        },
        {
            q: t('ip.faq4.q'),
            a: t('ip.faq4.a')
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
                                    {t('ip.hero.badge')}
                                </span>
                            </div>

                            {/* Main Title */}
                            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-[1.1]">
                                {t('ip.hero.title1')}<span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-amber-400 to-yellow-500">{t('ip.hero.title2')}</span>{t('ip.hero.title3')}
                            </h1>

                            <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-xl">
                                {t('ip.hero.p1')}<strong>{t('ip.hero.p2')}</strong>{t('ip.hero.p3')}
                            </p>

                            {/* CTA Button & Fuel Bonus */}
                            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full sm:w-auto pt-2">
                                <button
                                    onClick={() => { playWarp(); onStart(); }}
                                    className="px-8 py-4 rounded-2xl bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 text-slate-950 font-black text-base md:text-lg shadow-xl shadow-amber-500/25 hover:shadow-amber-500/40 hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-3 cursor-pointer group"
                                >
                                    <span>{t('ip.cta.launch')}</span>
                                    <span className="group-hover:translate-x-1 transition-transform">→</span>
                                </button>

                                <div className="flex items-center gap-2.5 bg-slate-900/90 border border-slate-800 px-4 py-3 rounded-2xl">
                                    <span className="text-2xl">🎁</span>
                                    <div className="text-left">
                                        <div className="text-xs font-black text-amber-400">{t('ip.bonus.title')}</div>
                                        <div className="text-[10px] text-slate-400">{t('ip.bonus.sub')}</div>
                                    </div>
                                </div>
                            </div>

                            {/* Trust Proof Badges */}
                            <div className="grid grid-cols-3 gap-4 pt-4 border-t border-slate-800/80 w-full">
                                <div>
                                    <div className="text-2xl font-black text-white font-mono">30+</div>
                                    <div className="text-xs text-slate-400">{t('ip.proof.eras')}</div>
                                </div>
                                <div>
                                    <div className="text-2xl font-black text-amber-400 font-mono">{t('ip.proof.speed')}</div>
                                    <div className="text-xs text-slate-400">{t('ip.proof.speedLabel')}</div>
                                </div>
                                <div>
                                    <div className="text-2xl font-black text-cyan-400 font-mono">%100</div>
                                    <div className="text-xs text-slate-400">{t('ip.proof.likeness')}</div>
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
                                        {t('ip.original')}
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
                                        {t('ip.slide')}
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
                            {t('ip.feat.badge')}
                        </div>
                        <h2 className="text-3xl sm:text-4xl font-black text-white">
                            {t('ip.feat.title1')}<span className="text-amber-400">{t('ip.feat.title2')}</span>
                        </h2>
                        <p className="text-slate-400 text-sm md:text-base max-w-2xl mx-auto">
                            {t('ip.feat.sub')}
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
                                    {t('ip.f1.title')}
                                </h3>
                                <p className="text-xs md:text-sm text-slate-400 leading-relaxed">
                                    {t('ip.f1.desc')}
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
                                    {t('ip.f2.title')}
                                </h3>
                                <p className="text-xs md:text-sm text-slate-400 leading-relaxed">
                                    {t('ip.f2.desc')}
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
                                    {t('ip.f3.title')}
                                </h3>
                                <p className="text-xs md:text-sm text-slate-400 leading-relaxed">
                                    {t('ip.f3.desc')}
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
                                {t('ip.cat.badge')}
                            </div>
                            <h2 className="text-2xl sm:text-3xl font-black text-white">
                                {t('ip.cat.title')}
                            </h2>
                        </div>
                        <button
                            onClick={() => { playTick(); onStart(); }}
                            className="text-xs font-bold text-amber-400 hover:text-amber-300 transition flex items-center gap-1 cursor-pointer"
                        >
                            <span>{t('ip.cat.link')}</span>
                            <span>→</span>
                        </button>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3.5">
                        {ERAS.slice(0, 12).map((era) => {
                            const et = eraText(era, lang);
                            return (
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
                                            {et.year}
                                        </span>
                                    </div>
                                    <div>
                                        <div className="text-xs font-bold text-white line-clamp-1 group-hover:text-amber-300 transition">
                                            {et.title}
                                        </div>
                                        <div className="text-[10px] text-slate-400 line-clamp-1">
                                            {et.badge}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            );
                        })}
                    </div>
                </section>

                {/* 4. PRICING & FUEL SECTION */}
                <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="rounded-3xl bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-800 p-8 md:p-12 text-center space-y-8 shadow-2xl">
                        <div className="space-y-3">
                            <div className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/30 px-3.5 py-1 rounded-full text-amber-400 text-xs font-black uppercase">
                                {t('ip.price.badge')}
                            </div>
                            <h2 className="text-3xl sm:text-4xl font-black text-white">
                                {t('ip.price.title')}
                            </h2>
                            <p className="text-slate-400 text-xs md:text-sm max-w-xl mx-auto">
                                {t('ip.price.sub')}
                            </p>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-4xl mx-auto text-left">
                            {/* Starter */}
                            <div className="rounded-2xl bg-slate-950 border border-slate-800 p-6 space-y-4 hover:border-slate-700 transition">
                                <div className="text-xs font-bold text-slate-400">{t('ip.p1.name')}</div>
                                <div className="text-3xl font-black text-white">₺49</div>
                                <div className="text-amber-400 font-mono text-sm font-bold">{t('ip.p1.cr')}</div>
                                <ul className="text-xs text-slate-300 space-y-2 pt-2 border-t border-slate-800">
                                    <li>{t('ip.p1.l1')}</li>
                                    <li>{t('ip.p1.l2')}</li>
                                    <li>{t('ip.p1.l3')}</li>
                                </ul>
                                <button
                                    onClick={() => onOpenPricing && onOpenPricing()}
                                    className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs transition cursor-pointer"
                                >
                                    {t('ip.pick')}
                                </button>
                            </div>

                            {/* Popular */}
                            <div className="relative rounded-2xl bg-gradient-to-b from-amber-950/40 to-slate-950 border-2 border-amber-400 p-6 space-y-4 shadow-xl shadow-amber-500/10">
                                <div className="absolute -top-3 right-4 bg-amber-400 text-slate-950 text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase">
                                    {t('ip.popular')}
                                </div>
                                <div className="text-xs font-bold text-amber-300">{t('ip.p2.name')}</div>
                                <div className="text-3xl font-black text-white">₺99</div>
                                <div className="text-amber-400 font-mono text-sm font-bold">{t('ip.p2.cr')}</div>
                                <ul className="text-xs text-slate-300 space-y-2 pt-2 border-t border-slate-800">
                                    <li>{t('ip.p2.l1')}</li>
                                    <li>{t('ip.p2.l2')}</li>
                                    <li>{t('ip.p2.l3')}</li>
                                </ul>
                                <button
                                    onClick={() => onOpenPricing && onOpenPricing()}
                                    className="w-full py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs transition cursor-pointer shadow-md"
                                >
                                    {t('ip.p2.btn')}
                                </button>
                            </div>

                            {/* Pro */}
                            <div className="rounded-2xl bg-slate-950 border border-slate-800 p-6 space-y-4 hover:border-slate-700 transition">
                                <div className="text-xs font-bold text-slate-400">{t('ip.p3.name')}</div>
                                <div className="text-3xl font-black text-white">₺199</div>
                                <div className="text-amber-400 font-mono text-sm font-bold">{t('ip.p3.cr')}</div>
                                <ul className="text-xs text-slate-300 space-y-2 pt-2 border-t border-slate-800">
                                    <li>{t('ip.p3.l1')}</li>
                                    <li>{t('ip.p3.l2')}</li>
                                    <li>{t('ip.p3.l3')}</li>
                                </ul>
                                <button
                                    onClick={() => onOpenPricing && onOpenPricing()}
                                    className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs transition cursor-pointer"
                                >
                                    {t('ip.pick')}
                                </button>
                            </div>
                        </div>
                    </div>
                </section>

                {/* 5. FAQ SECTION */}
                <section className="max-w-3xl mx-auto px-4 sm:px-6">
                    <div className="text-center space-y-3 mb-10">
                        <h2 className="text-2xl sm:text-3xl font-black text-white">{t('ip.faq.title')}</h2>
                        <p className="text-slate-400 text-xs sm:text-sm">{t('ip.faq.sub')}</p>
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
                            {t('ip.bottom.title')}
                        </h2>
                        <p className="text-slate-900 font-medium text-sm md:text-base max-w-xl mx-auto">
                            {t('ip.bottom.sub')}
                        </p>
                        <button
                            onClick={() => { playWarp(); onStart(); }}
                            className="px-10 py-4 rounded-2xl bg-slate-950 text-white font-black text-base shadow-2xl hover:scale-105 active:scale-95 transition cursor-pointer"
                        >
                            {t('ip.bottom.btn')}
                        </button>
                    </div>
                </section>
            </main>
        </div>
    );
}
