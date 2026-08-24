import React from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { useT } from '../lib/useT';
import LangSwitch from './LangSwitch';

interface IntroPageProps {
    onStart: () => void;
}

const IntroPage: React.FC<IntroPageProps> = ({ onStart }) => {
    const { theme, toggleTheme } = useTheme();
    const { t } = useT();

    return (
        <div className="relative flex h-auto min-h-screen w-full flex-col group/design-root overflow-x-hidden bg-background-light dark:bg-background-dark font-display">
            <div className="layout-container flex h-full grow flex-col">
                <div className="px-4 md:px-10 lg:px-20 xl:px-40 flex flex-1 justify-center py-5">
                    <div className="layout-content-container flex flex-col max-w-[960px] flex-1">

                        {/* Header */}
                        <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-stone-200 dark:border-border-dark px-4 md:px-10 py-3">
                            <div className="flex items-center gap-4 text-text-light dark:text-text-dark">
                                <div className="size-6 text-primary">
                                    <svg fill="currentColor" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M4 42.4379C4 42.4379 14.0962 36.0744 24 41.1692C35.0664 46.8624 44 42.2078 44 42.2078L44 7.01134C44 7.01134 35.068 11.6577 24.0031 5.96913C14.0971 0.876274 4 7.27094 4 7.27094L4 42.4379Z"></path>
                                    </svg>
                                </div>
                                <h2 className="text-lg font-bold leading-tight tracking-[-0.015em]">{t('nav.title')}</h2>
                            </div>
                            <nav className="flex flex-1 justify-end gap-4 md:gap-8">
                                <div className="hidden md:flex items-center gap-9">
                                    <a className="text-text-light dark:text-text-dark text-sm font-medium leading-normal hover:text-primary transition-colors" href="#features">{t('nav.features')}</a>
                                    <a className="text-text-light dark:text-text-dark text-sm font-medium leading-normal hover:text-primary transition-colors" href="#about">{t('nav.about')}</a>
                                </div>
                                <LangSwitch />
                                <button
                                    onClick={toggleTheme}
                                    className="flex items-center justify-center w-10 h-10 rounded-lg bg-stone-100 dark:bg-surface-dark border border-stone-200 dark:border-border-dark hover:bg-stone-200 dark:hover:bg-border-dark transition-colors"
                                    aria-label="Toggle theme"
                                >
                                    {theme === 'dark' ? (
                                        <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                                        </svg>
                                    ) : (
                                        <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                                        </svg>
                                    )}
                                </button>
                                <button
                                    onClick={onStart}
                                    className="hidden md:flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-transparent border border-primary text-primary text-sm font-bold leading-normal tracking-[0.015em] hover:bg-primary hover:text-background-dark transition-colors"
                                >
                                    <span className="truncate">{t('nav.startNow')}</span>
                                </button>
                            </nav>
                        </header>

                        <main>
                            {/* Hero Section */}
                            <section className="py-10 md:py-20">
                                <div className="@container">
                                    <div className="flex flex-col gap-6 px-4 py-10 @[480px]:gap-8 @[864px]:flex-row-reverse">
                                        <div
                                            className="w-full bg-center bg-no-repeat aspect-square md:aspect-video bg-cover rounded-xl @[480px]:h-auto @[480px]:min-w-[400px] @[864px]:w-full"
                                            style={{ backgroundImage: 'url("/images/hero-example.jpg")' }}
                                        ></div>
                                        <div className="flex flex-col gap-6 @[480px]:min-w-[400px] @[480px]:gap-8 @[864px]:justify-center">
                                            <div className="flex flex-col gap-2 text-left">
                                                <h1 className="text-text-light dark:text-text-dark text-4xl font-black leading-tight tracking-[-0.033em] @[480px]:text-5xl">{t('intro.hero.title')}</h1>
                                                <h2 className="text-text-muted-light dark:text-text-muted-dark text-sm font-normal leading-normal @[480px]:text-base">{t('intro.hero.subtitle')}</h2>
                                            </div>
                                            <button
                                                onClick={onStart}
                                                className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 @[480px]:h-12 @[480px]:px-5 bg-primary text-background-dark text-sm font-bold leading-normal tracking-[0.015em] @[480px]:text-base hover:bg-yellow-500 transition-colors"
                                            >
                                                <span className="truncate">{t('intro.tryApp')}</span>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </section>

                            {/* How It Works Section */}
                            <section className="py-10 md:py-20" id="how-it-works">
                                <div className="flex flex-col gap-10 px-4 py-10 @container">
                                    <div className="flex flex-col gap-4 text-center items-center">
                                        <h1 className="text-text-light dark:text-text-dark tracking-light text-[32px] font-bold leading-tight @[480px]:text-4xl max-w-[720px]">{t('intro.howItWorks.title')}</h1>
                                        <p className="text-text-muted-light dark:text-text-muted-dark text-base font-normal leading-normal max-w-[720px]">{t('intro.howItWorks.subtitle')}</p>
                                    </div>
                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-0">
                                        <div className="flex flex-1 gap-3 rounded-lg border border-stone-200 dark:border-border-dark bg-stone-50 dark:bg-surface-dark p-4 flex-col text-center items-center">
                                            <span className="material-symbols-outlined text-primary" style={{ fontSize: '36px' }}>upload_file</span>
                                            <div className="flex flex-col gap-1">
                                                <h2 className="text-text-light dark:text-text-dark text-base font-bold leading-tight">{t('intro.step1.title')}</h2>
                                                <p className="text-text-muted-light dark:text-text-muted-dark text-sm font-normal leading-normal">{t('intro.step1.desc')}</p>
                                            </div>
                                        </div>
                                        <div className="flex flex-1 gap-3 rounded-lg border border-stone-200 dark:border-border-dark bg-stone-50 dark:bg-surface-dark p-4 flex-col text-center items-center">
                                            <span className="material-symbols-outlined text-primary" style={{ fontSize: '36px' }}>calendar_month</span>
                                            <div className="flex flex-col gap-1">
                                                <h2 className="text-text-light dark:text-text-dark text-base font-bold leading-tight">{t('intro.step2.title')}</h2>
                                                <p className="text-text-muted-light dark:text-text-muted-dark text-sm font-normal leading-normal">{t('intro.step2.desc')}</p>
                                            </div>
                                        </div>
                                        <div className="flex flex-1 gap-3 rounded-lg border border-stone-200 dark:border-border-dark bg-stone-50 dark:bg-surface-dark p-4 flex-col text-center items-center">
                                            <span className="material-symbols-outlined text-primary" style={{ fontSize: '36px' }}>auto_awesome</span>
                                            <div className="flex flex-col gap-1">
                                                <h2 className="text-text-light dark:text-text-dark text-base font-bold leading-tight">{t('intro.step3.title')}</h2>
                                                <p className="text-text-muted-light dark:text-text-muted-dark text-sm font-normal leading-normal">{t('intro.step3.desc')}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </section>

                            {/* Features Section */}
                            <section className="py-10 md:py-20" id="features">
                                <div className="flex flex-col gap-10 px-4 py-10 @container">
                                    <div className="flex flex-col gap-4 text-center items-center">
                                        <h1 className="text-text-light dark:text-text-dark tracking-light text-[32px] font-bold leading-tight @[480px]:text-4xl max-w-[720px]">{t('intro.features.title')}</h1>
                                        <p className="text-text-muted-light dark:text-text-muted-dark text-base font-normal leading-normal max-w-[720px]">{t('intro.features.subtitle')}</p>
                                    </div>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                                        <div className="flex flex-col gap-3 pb-3">
                                            <div className="w-full rounded-xl overflow-hidden bg-stone-100 dark:bg-surface-dark border border-stone-200 dark:border-border-dark">
                                                <img src="/images/feature-1.jpg" alt="Zaman Yolculuğu Örneği" className="w-full h-auto object-contain" />
                                            </div>
                                            <div>
                                                <p className="text-text-light dark:text-text-dark text-base font-medium leading-normal">{t('intro.feature1.title')}</p>
                                                <p className="text-text-muted-light dark:text-text-muted-dark text-sm font-normal leading-normal">{t('intro.feature1.desc')}</p>
                                            </div>
                                        </div>
                                        <div className="flex flex-col gap-3 pb-3">
                                            <div className="w-full rounded-xl overflow-hidden bg-stone-100 dark:bg-surface-dark border border-stone-200 dark:border-border-dark">
                                                <img src="/images/feature-2-v2.jpg" alt="İnteraktif Arayüz Örneği" className="w-full h-auto object-contain" />
                                            </div>
                                            <div>
                                                <p className="text-text-light dark:text-text-dark text-base font-medium leading-normal">{t('intro.feature2.title')}</p>
                                                <p className="text-text-muted-light dark:text-text-muted-dark text-sm font-normal leading-normal">{t('intro.feature2.desc')}</p>
                                            </div>
                                        </div>
                                        <div className="flex flex-col gap-3 pb-3">
                                            <div className="w-full rounded-xl overflow-hidden bg-stone-100 dark:bg-surface-dark border border-stone-200 dark:border-border-dark">
                                                <img src="/images/feature-3-v2.jpg" alt="İndirme ve Paylaşım Örneği" className="w-full h-auto object-contain" />
                                            </div>
                                            <div>
                                                <p className="text-text-light dark:text-text-dark text-base font-medium leading-normal">{t('intro.feature3.title')}</p>
                                                <p className="text-text-muted-light dark:text-text-muted-dark text-sm font-normal leading-normal">{t('intro.feature3.desc')}</p>
                                            </div>
                                        </div>
                                        <div className="flex flex-col gap-3 pb-3">
                                            <div className="w-full rounded-xl overflow-hidden bg-stone-100 dark:bg-surface-dark border border-stone-200 dark:border-border-dark">
                                                <img src="/images/feature-4.jpg" alt="Gerçekçi Dönüşüm Örneği" className="w-full h-auto object-contain" />
                                            </div>
                                            <div>
                                                <p className="text-text-light dark:text-text-dark text-base font-medium leading-normal">{t('intro.feature4.title')}</p>
                                                <p className="text-text-muted-light dark:text-text-muted-dark text-sm font-normal leading-normal">{t('intro.feature4.desc')}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </section>

                            {/* CTA Section */}
                            <section className="py-10 md:py-20">
                                <div className="flex flex-col gap-6 text-center items-center px-4 py-10 bg-stone-50 dark:bg-surface-dark rounded-xl">
                                    <h2 className="text-text-light dark:text-text-dark text-3xl font-bold leading-tight tracking-[-0.015em] max-w-xl">{t('intro.cta.title')}</h2>
                                    <p className="text-text-muted-light dark:text-text-muted-dark text-base font-normal leading-normal max-w-2xl">{t('intro.cta.subtitle')}</p>
                                    <button
                                        onClick={onStart}
                                        className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-12 px-6 bg-primary text-background-dark text-base font-bold leading-normal tracking-[0.015em] hover:bg-yellow-500 transition-colors"
                                    >
                                        <span className="truncate">{t('intro.cta.button')}</span>
                                    </button>
                                </div>
                            </section>
                        </main>

                        {/* Footer */}
                        <footer className="py-10 mt-10 border-t border-solid border-stone-200 dark:border-border-dark" id="about">
                            <div className="flex flex-col md:flex-row items-center justify-between gap-6 px-4">
                                <div className="flex flex-col md:flex-row items-center gap-4 text-text-muted-light dark:text-text-muted-dark text-sm">
                                    <span>{t('footer.madeBy')}</span>
                                    <span className="hidden md:inline">•</span>
                                    <a href="https://www.thirdhand.com.tr" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">
                                        {t('footer.visit')}
                                    </a>
                                </div>
                                <div className="flex items-center gap-4 text-text-muted-light dark:text-text-muted-dark">
                                    <a
                                        href="https://wa.me/905306042829"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center justify-center w-10 h-10 rounded-full bg-[#25D366] text-white hover:bg-[#128C7E] transition-all duration-300 hover:scale-110 animate-bounce shadow-lg"
                                        aria-label={t('footer.whatsapp')}
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                                            <path d="M13.601 2.326A7.854 7.854 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.933 7.933 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.898 7.898 0 0 0 13.6 2.326zM7.994 14.521a6.573 6.573 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.557 6.557 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592zm3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.729.729 0 0 0-.529.247c-.182.198-.691.677-.691 1.654 0 .977.71 1.916.81 2.049.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232z" />
                                        </svg>
                                    </a>
                                </div>
                            </div>
                        </footer>

                    </div>
                </div>
            </div>
        </div>
    );
};

export default IntroPage;
