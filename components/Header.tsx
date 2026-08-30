/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import React from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { usePayment } from '../contexts/PaymentContext';
import { useAuth } from '../contexts/AuthContext';
import { useT } from '../lib/useT';
import LangSwitch from './LangSwitch';
import { playTick } from '../lib/sfxUtils';

export type AppMainTab = 'intro' | 'cockpit' | 'video' | 'newspaper' | 'album';

interface HeaderProps {
    onOpenPricing?: () => void;
    onOpenAuth?: () => void;
    onOpenAdmin?: () => void;
    activeTab?: AppMainTab;
    onSelectTab?: (tab: AppMainTab) => void;
    onToggleView?: () => void;
    viewMode?: 'intro' | 'app';
}

const Header: React.FC<HeaderProps> = ({
    onOpenPricing,
    onOpenAuth,
    onOpenAdmin,
    activeTab = 'cockpit',
    onSelectTab,
    onToggleView,
    viewMode
}) => {
    const { theme, toggleTheme } = useTheme();
    const { credits } = usePayment();
    const { user, isAuthenticated, isAdmin, signOut } = useAuth();
    const { t } = useT();

    const navTabs: { id: AppMainTab; label: string; icon: string }[] = [
        { id: 'cockpit', label: '⏳ Zaman Sıçraması', icon: '⏳' },
        { id: 'video', label: '🎬 9:16 Video Klip', icon: '🎬' },
        { id: 'newspaper', label: '📰 Gazete & Pasaport', icon: '📰' },
        { id: 'album', label: '📖 Tarih Albümü', icon: '📖' },
    ];

    return (
        <header className="flex flex-col border-b border-solid border-slate-800 bg-slate-950/95 backdrop-blur-md sticky top-0 z-40">
            {/* Top Bar */}
            <div className="flex items-center justify-between whitespace-nowrap px-4 sm:px-6 md:px-10 py-2.5">
                {/* Logo */}
                <div
                    onClick={() => {
                        playTick();
                        if (onSelectTab) onSelectTab('intro');
                        else if (onToggleView) onToggleView();
                    }}
                    className="flex items-center gap-3 text-white cursor-pointer select-none"
                >
                    <div className="size-7 text-amber-400">
                        <svg fill="currentColor" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                            <path d="M4 42.4379C4 42.4379 14.0962 36.0744 24 41.1692C35.0664 46.8624 44 42.2078 44 42.2078L44 7.01134C44 7.01134 35.068 11.6577 24.0031 5.96913C14.0971 0.876274 4 7.27094 4 7.27094L4 42.4379Z"></path>
                        </svg>
                    </div>
                    <div className="flex flex-col">
                        <h2 className="text-base sm:text-lg font-black tracking-tight text-white flex items-center gap-2">
                            <span>ZAMAN MAKİNESİ</span>
                            <span className="text-[10px] bg-amber-500/20 text-amber-400 border border-amber-500/40 px-2 py-0.5 rounded-full font-mono">
                                V4 FLUX
                            </span>
                        </h2>
                    </div>
                </div>

                {/* Primary Nav Tabs (Desktop) */}
                <nav className="hidden md:flex items-center gap-1 bg-slate-900/90 border border-slate-800 p-1 rounded-2xl">
                    <button
                        onClick={() => { playTick(); onSelectTab && onSelectTab('intro'); }}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
                            activeTab === 'intro'
                                ? 'bg-amber-400 text-slate-950 font-black shadow-md'
                                : 'text-slate-400 hover:text-slate-200'
                        }`}
                    >
                        <span>🏠</span>
                        <span>Tanıtım</span>
                    </button>

                    {navTabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => { playTick(); onSelectTab && onSelectTab(tab.id); }}
                            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
                                activeTab === tab.id
                                    ? 'bg-amber-400 text-slate-950 font-black shadow-md'
                                    : 'text-slate-400 hover:text-slate-200'
                            }`}
                        >
                            <span>{tab.icon}</span>
                            <span>{tab.label.split(' ')[1] || tab.label}</span>
                        </button>
                    ))}
                </nav>

                {/* Navigation & Actions Right */}
                <div className="flex items-center gap-2.5 sm:gap-3">
                    {/* Admin Button */}
                    {(isAdmin || user?.email === 'hikmet044@gmail.com') && onOpenAdmin && (
                        <button
                            onClick={() => { playTick(); onOpenAdmin(); }}
                            className="flex items-center gap-1.5 rounded-xl bg-amber-500/20 border border-amber-500/50 px-3 py-1.5 text-xs font-black text-amber-300 hover:bg-amber-500/30 transition cursor-pointer shadow-lg shadow-amber-500/10 animate-pulse"
                        >
                            <span>🛡️</span>
                            <span>Admin Panel</span>
                        </button>
                    )}

                    {/* Credit Fuel Meter */}
                    {onOpenPricing && (
                        <button
                            onClick={() => { playTick(); onOpenPricing(); }}
                            className="flex items-center gap-2 rounded-full bg-amber-500/10 border border-amber-500/30 px-3 py-1 text-xs font-bold text-amber-300 hover:bg-amber-500/20 transition cursor-pointer shadow-sm"
                        >
                            <span>⚡</span>
                            <span className="font-mono">{credits} Kredi</span>
                            <span className="text-[10px] bg-amber-400 text-slate-950 font-black px-1.5 py-0.5 rounded">
                                + AL
                            </span>
                        </button>
                    )}

                    <LangSwitch />

                    {/* Auth Profile / Google Button */}
                    {isAuthenticated ? (
                        <div className="flex items-center gap-2">
                            <div className="hidden sm:flex flex-col items-end">
                                <span className="text-xs font-bold text-white leading-tight">
                                    {user?.user_metadata?.name || user?.email?.split('@')[0]}
                                </span>
                                {isAdmin && (
                                    <span className="text-[9px] font-black text-amber-400 font-mono">
                                        ADMIN
                                    </span>
                                )}
                            </div>
                            <button
                                onClick={() => signOut()}
                                className="text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 px-3 py-1.5 rounded-xl font-bold transition cursor-pointer"
                            >
                                Çıkış
                            </button>
                        </div>
                    ) : (
                        onOpenAuth && (
                            <button
                                onClick={() => { playTick(); onOpenAuth(); }}
                                className="flex items-center gap-2 bg-white text-slate-900 hover:bg-slate-100 px-3.5 py-1.5 rounded-xl font-bold text-xs shadow-md transition cursor-pointer"
                            >
                                <svg className="h-4 w-4" viewBox="0 0 24 24">
                                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                                </svg>
                                <span>Giriş Yap</span>
                            </button>
                        )
                    )}

                    {/* Theme Toggle */}
                    <button
                        onClick={toggleTheme}
                        className="flex items-center justify-center w-8 h-8 rounded-lg bg-slate-800 border border-slate-700 hover:bg-slate-700 text-amber-400 transition cursor-pointer"
                        aria-label="Toggle theme"
                    >
                        {theme === 'dark' ? '☀️' : '🌙'}
                    </button>
                </div>
            </div>

            {/* Mobile Sub-Navigation Bar */}
            <div className="flex md:hidden items-center gap-1 px-4 py-2 border-t border-slate-800 bg-slate-900/60 overflow-x-auto">
                <button
                    onClick={() => { playTick(); onSelectTab && onSelectTab('intro'); }}
                    className={`px-3 py-1 rounded-xl text-xs font-bold whitespace-nowrap transition cursor-pointer ${
                        activeTab === 'intro' ? 'bg-amber-400 text-slate-950 font-black' : 'text-slate-400'
                    }`}
                >
                    🏠 Tanıtım
                </button>
                {navTabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => { playTick(); onSelectTab && onSelectTab(tab.id); }}
                        className={`px-3 py-1 rounded-xl text-xs font-bold whitespace-nowrap transition cursor-pointer ${
                            activeTab === tab.id ? 'bg-amber-400 text-slate-950 font-black' : 'text-slate-400'
                        }`}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>
        </header>
    );
};

export default Header;
