/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import React from 'react';
import { usePayment } from '../contexts/PaymentContext';
import { PRICING_PACKAGES } from '../services/stripeService';
import { useT } from '../lib/useT';
import { playSuccess, playTick } from '../lib/sfxUtils';

interface PricingModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function PricingModal({ isOpen, onClose }: PricingModalProps) {
    const { credits, addCredits } = usePayment();
    const { t } = useT();

    if (!isOpen) return null;

    const handleSelectPackage = (pkg: typeof PRICING_PACKAGES[0]) => {
        playSuccess();
        // Demo purchase: instantly credit the account
        addCredits(pkg.credits);
        alert(`Tebrikler! ${pkg.name} paketi (${pkg.credits} Kredi) hesabınıza eklendi.`);
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 overflow-y-auto animate-in fade-in duration-200">
            <div className="relative w-full max-w-4xl rounded-3xl bg-slate-900 border border-amber-500/30 p-6 md:p-8 shadow-2xl text-white my-8">
                {/* Close Button */}
                <button
                    onClick={() => { playTick(); onClose(); }}
                    className="absolute right-4 top-4 rounded-full bg-slate-800 p-2 text-slate-400 hover:text-white hover:bg-slate-700 transition"
                    aria-label="Kapat"
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>

                {/* Header */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/30 px-4 py-1.5 rounded-full text-amber-400 text-xs font-black uppercase tracking-wider mb-3">
                        <span>⚡</span> Zaman Yakıtı & Kredi Paketleri
                    </div>
                    <h2 className="text-3xl md:text-4xl font-black text-white tracking-tight">
                        Zamanda Sınırsız Yolculuğa Çıkın
                    </h2>
                    <p className="mt-2 text-sm md:text-base text-slate-400 max-w-xl mx-auto">
                        Mevcut Bakiyeniz: <span className="text-amber-400 font-bold text-lg">{credits} Kredi</span>. Kredileriniz bittiğinde dilediğiniz paketi seçerek yolculuğa devam edebilirsiniz.
                    </p>
                </div>

                {/* Pricing Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    {PRICING_PACKAGES.map((pkg) => (
                        <div
                            key={pkg.id}
                            className={`relative rounded-2xl p-6 flex flex-col justify-between transition-all duration-300 ${
                                pkg.isPopular
                                    ? 'bg-gradient-to-b from-amber-500/20 via-slate-800 to-slate-900 border-2 border-amber-400 shadow-xl shadow-amber-500/10 scale-105 md:-translate-y-2'
                                    : 'bg-slate-800/80 border border-slate-700 hover:border-slate-600'
                            }`}
                        >
                            {pkg.badge && (
                                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 px-3 py-0.5 rounded-full text-xs font-black uppercase tracking-wider shadow-md">
                                    {pkg.badge}
                                </div>
                            )}

                            <div>
                                <h3 className="text-xl font-bold text-white mb-1">{pkg.name}</h3>
                                <div className="flex items-baseline gap-1 my-3">
                                    <span className="text-4xl font-black text-white">{pkg.price}</span>
                                    <span className="text-xs text-slate-400">/ {pkg.credits} Kredi</span>
                                </div>
                                <div className="text-xs text-amber-400/90 font-medium mb-4">
                                    Görsel Başına Sadece {(parseInt(pkg.price) / pkg.credits).toFixed(2)} ₺
                                </div>

                                <div className="border-t border-slate-700/60 my-4" />

                                <ul className="space-y-2.5 text-xs text-slate-300 mb-6">
                                    {pkg.features.map((feat, idx) => (
                                        <li key={idx} className="flex items-start gap-2">
                                            <svg className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                                            </svg>
                                            <span>{feat}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <button
                                onClick={() => handleSelectPackage(pkg)}
                                className={`w-full py-3.5 px-4 rounded-xl font-bold text-sm transition-all duration-200 cursor-pointer shadow-lg active:scale-95 ${
                                    pkg.isPopular
                                        ? 'bg-gradient-to-r from-amber-400 to-yellow-500 text-slate-950 hover:brightness-110 shadow-amber-500/20'
                                        : 'bg-slate-700 text-white hover:bg-slate-600'
                                }`}
                            >
                                Hemen Satın Al ({pkg.credits} Kredi)
                            </button>
                        </div>
                    ))}
                </div>

                {/* Free Credit Notice */}
                <div className="text-center text-xs text-slate-400 border-t border-slate-800 pt-4 flex flex-wrap items-center justify-center gap-4">
                    <span>🔒 256-Bit SSL Güvenli Ödeme</span>
                    <span>⚡ Krediler anında hesaba yüklenir</span>
                    <span>🔄 Kredilerin son kullanma tarihi yoktur</span>
                </div>
            </div>
        </div>
    );
}
