/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import React from 'react';
import { PRICING_TIERS } from '../services/stripeService';
import { useT } from '../lib/useT';

interface PricingModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSelectPlan: (planType: 'PREMIUM' | 'PAY_AS_YOU_GO') => void;
}

export default function PricingModal({ isOpen, onClose, onSelectPlan }: PricingModalProps) {
    const { t } = useT();
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="relative w-full max-w-5xl max-h-[90vh] overflow-y-auto bg-white dark:bg-surface-dark rounded-2xl shadow-2xl">
                {/* Close button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 z-10 w-10 h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                    aria-label="Kapat"
                >
                    <span className="text-2xl text-white">×</span>
                </button>

                {/* Header */}
                <div className="bg-gradient-to-r from-yellow-400 to-orange-500 p-8 text-center">
                    <h2 className="text-4xl font-bold text-white mb-2">{t('pricing.title')}</h2>
                    <p className="text-white/90 text-lg">{t('pricing.subtitle')}</p>
                </div>

                {/* Pricing Cards */}
                <div className="grid md:grid-cols-3 gap-6 p-8">
                    {/* Free Plan */}
                    <div className="border-2 border-stone-200 dark:border-border-dark rounded-xl p-6 hover:shadow-lg transition-shadow">
                        <div className="text-center mb-6">
                            <h3 className="text-2xl font-bold text-stone-800 dark:text-text-dark mb-2">
                                {PRICING_TIERS.FREE.name}
                            </h3>
                            <div className="text-4xl font-bold text-stone-900 dark:text-white mb-1">
                                ₺0
                            </div>
                            <p className="text-stone-600 dark:text-stone-400 text-sm">
                                {PRICING_TIERS.FREE.credits} {t('pricing.visuals')}
                            </p>
                        </div>
                        <ul className="space-y-3 mb-6">
                            {PRICING_TIERS.FREE.features.map((feature, index) => (
                                <li key={index} className="flex items-start gap-2 text-stone-700 dark:text-stone-300">
                                    <span className="text-green-500 mt-1">✓</span>
                                    <span className="text-sm">{feature}</span>
                                </li>
                            ))}
                        </ul>
                        <button
                            onClick={onClose}
                            className="w-full py-3 px-6 bg-stone-200 dark:bg-stone-700 text-stone-800 dark:text-white rounded-lg font-semibold hover:bg-stone-300 dark:hover:bg-stone-600 transition-colors"
                        >
                            {t('pricing.currentPlan')}
                        </button>
                    </div>

                    {/* Pay As You Go */}
                    <div className="border-2 border-yellow-400 rounded-xl p-6 hover:shadow-lg transition-shadow relative">
                        <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-yellow-400 text-black px-4 py-1 rounded-full text-sm font-bold">
                            {t('pricing.popular')}
                        </div>
                        <div className="text-center mb-6">
                            <h3 className="text-2xl font-bold text-stone-800 dark:text-text-dark mb-2">
                                {PRICING_TIERS.PAY_AS_YOU_GO.name}
                            </h3>
                            <div className="text-4xl font-bold text-stone-900 dark:text-white mb-1">
                                ₺{PRICING_TIERS.PAY_AS_YOU_GO.price}
                            </div>
                            <p className="text-stone-600 dark:text-stone-400 text-sm">
                                {PRICING_TIERS.PAY_AS_YOU_GO.credits} {t('pricing.visuals')}
                            </p>
                        </div>
                        <ul className="space-y-3 mb-6">
                            {PRICING_TIERS.PAY_AS_YOU_GO.features.map((feature, index) => (
                                <li key={index} className="flex items-start gap-2 text-stone-700 dark:text-stone-300">
                                    <span className="text-green-500 mt-1">✓</span>
                                    <span className="text-sm">{feature}</span>
                                </li>
                            ))}
                        </ul>
                        <button
                            onClick={() => onSelectPlan('PAY_AS_YOU_GO')}
                            className="w-full py-3 px-6 bg-yellow-400 text-black rounded-lg font-semibold hover:bg-yellow-500 transition-colors shadow-lg"
                        >
                            {t('pricing.buy')}
                        </button>
                    </div>

                    {/* Premium Plan */}
                    <div className="border-2 border-purple-500 rounded-xl p-6 hover:shadow-lg transition-shadow bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20">
                        <div className="text-center mb-6">
                            <h3 className="text-2xl font-bold text-stone-800 dark:text-text-dark mb-2">
                                {PRICING_TIERS.PREMIUM.name}
                            </h3>
                            <div className="text-4xl font-bold text-stone-900 dark:text-white mb-1">
                                ₺{PRICING_TIERS.PREMIUM.price}
                            </div>
                            <p className="text-stone-600 dark:text-stone-400 text-sm">
                                {t('pricing.unlimited')}
                            </p>
                        </div>
                        <ul className="space-y-3 mb-6">
                            {PRICING_TIERS.PREMIUM.features.map((feature, index) => (
                                <li key={index} className="flex items-start gap-2 text-stone-700 dark:text-stone-300">
                                    <span className="text-green-500 mt-1">✓</span>
                                    <span className="text-sm">{feature}</span>
                                </li>
                            ))}
                        </ul>
                        <button
                            onClick={() => onSelectPlan('PREMIUM')}
                            className="w-full py-3 px-6 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg font-semibold hover:from-purple-600 hover:to-pink-600 transition-colors shadow-lg"
                        >
                            {t('pricing.upgrade')}
                        </button>
                    </div>
                </div>

                {/* Footer */}
                <div className="bg-stone-50 dark:bg-stone-900 p-6 text-center border-t border-stone-200 dark:border-border-dark">
                    <p className="text-stone-600 dark:text-stone-400 text-sm">
                        {t('pricing.secure')}
                    </p>
                </div>
            </div>
        </div>
    );
}
