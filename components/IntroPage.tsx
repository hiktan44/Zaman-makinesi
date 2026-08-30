import React from 'react';
import { useT } from '../lib/useT';
import Header from './Header';

interface IntroPageProps {
    onStart: () => void;
    onOpenPricing?: () => void;
    onOpenAuth?: () => void;
}

const IntroPage: React.FC<IntroPageProps> = ({ onStart, onOpenPricing, onOpenAuth }) => {
    const { t } = useT();

    return (
        <div className="relative flex h-auto min-h-screen w-full flex-col group/design-root overflow-x-hidden bg-slate-950 text-slate-100 font-sans">
            <Header
                onOpenPricing={onOpenPricing}
                onOpenAuth={onOpenAuth}
                onToggleView={onStart}
                viewMode="intro"
            />

            <div className="layout-container flex h-full grow flex-col">
                <div className="px-4 md:px-10 lg:px-20 xl:px-40 flex flex-1 justify-center py-5">
                    <div className="layout-content-container flex flex-col max-w-[960px] flex-1">
                        <main>
                            {/* Hero Section */}
                            <section className="py-10 md:py-20">
                                <div className="flex flex-col gap-6 px-4 py-10 md:flex-row-reverse items-center">
                                    <div
                                        className="w-full bg-center bg-no-repeat aspect-square md:aspect-video bg-cover rounded-2xl md:w-1/2 border-2 border-amber-500/40 shadow-2xl"
                                        style={{ backgroundImage: 'url("/images/hero-example.jpg")' }}
                                    ></div>
                                    <div className="flex flex-col gap-6 md:w-1/2 justify-center">
                                        <div className="flex flex-col gap-3 text-left">
                                            <div className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/30 px-3.5 py-1 rounded-full text-amber-400 text-xs font-black uppercase tracking-wider w-fit">
                                                <span>⚡</span> YENİ NESİL ZAMAN YOLCULUĞU
                                            </div>
                                            <h1 className="text-white text-4xl font-black leading-tight tracking-tight md:text-5xl">
                                                {t('intro.hero.title')}
                                            </h1>
                                            <h2 className="text-slate-400 text-sm font-normal leading-relaxed md:text-base">
                                                {t('intro.hero.subtitle')}
                                            </h2>
                                        </div>
                                        <button
                                            onClick={onStart}
                                            className="flex items-center justify-center rounded-2xl h-12 px-6 bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 text-slate-950 font-black text-base hover:brightness-110 shadow-lg shadow-amber-500/25 active:scale-95 transition cursor-pointer w-fit"
                                        >
                                            <span className="truncate">🚀 ZAMAN KOKPİTİNİ AÇ</span>
                                        </button>
                                    </div>
                                </div>
                            </section>

                            {/* How It Works Section */}
                            <section className="py-10 md:py-16 border-t border-slate-800" id="how-it-works">
                                <div className="flex flex-col gap-10 px-4">
                                    <div className="flex flex-col gap-3 text-center items-center">
                                        <h2 className="text-white text-3xl font-black">{t('intro.howItWorks.title')}</h2>
                                        <p className="text-slate-400 text-sm max-w-lg">{t('intro.howItWorks.subtitle')}</p>
                                    </div>
                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                                        <div className="flex flex-col items-center text-center p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
                                            <span className="text-4xl">📸</span>
                                            <h3 className="text-white font-bold text-base">{t('intro.step1.title')}</h3>
                                            <p className="text-slate-400 text-xs">{t('intro.step1.desc')}</p>
                                        </div>
                                        <div className="flex flex-col items-center text-center p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
                                            <span className="text-4xl">⏳</span>
                                            <h3 className="text-white font-bold text-base">{t('intro.step2.title')}</h3>
                                            <p className="text-slate-400 text-xs">{t('intro.step2.desc')}</p>
                                        </div>
                                        <div className="flex flex-col items-center text-center p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
                                            <span className="text-4xl">✨</span>
                                            <h3 className="text-white font-bold text-base">{t('intro.step3.title')}</h3>
                                            <p className="text-slate-400 text-xs">{t('intro.step3.desc')}</p>
                                        </div>
                                    </div>
                                </div>
                            </section>
                        </main>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default IntroPage;
