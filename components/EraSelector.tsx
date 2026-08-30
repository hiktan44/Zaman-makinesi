/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import React, { useState } from 'react';
import { ERAS, ERA_CATEGORIES, EraCategory, EraDefinition } from '../constants/eraConstants';
import { playTick } from '../lib/sfxUtils';

interface EraSelectorProps {
    selectedEraIds: string[];
    onToggleEra: (eraId: string) => void;
    onSelectAll: () => void;
    onClearAll: () => void;
}

export default function EraSelector({
    selectedEraIds,
    onToggleEra,
    onSelectAll,
    onClearAll,
}: EraSelectorProps) {
    const [activeCategory, setActiveCategory] = useState<EraCategory | 'all'>('all');

    const filteredEras = activeCategory === 'all'
        ? ERAS
        : ERAS.filter(e => e.category === activeCategory);

    return (
        <div className="flex flex-col space-y-4">
            {/* Header & Category Tabs */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-700/60 pb-3">
                <div className="flex items-center gap-2">
                    <span className="text-xl">🌌</span>
                    <h3 className="text-base md:text-lg font-bold text-white tracking-tight">
                        Hedef Çağları Seçin
                    </h3>
                    <span className="ml-2 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 px-2.5 py-0.5 text-xs font-bold">
                        {selectedEraIds.length} Seçildi
                    </span>
                </div>

                {/* Bulk Actions */}
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => { playTick(); onSelectAll(); }}
                        className="text-xs font-semibold text-amber-400 hover:text-amber-300 hover:underline px-2 py-1"
                    >
                        Tümünü Seç
                    </button>
                    <span className="text-slate-600">|</span>
                    <button
                        onClick={() => { playTick(); onClearAll(); }}
                        className="text-xs font-semibold text-slate-400 hover:text-white hover:underline px-2 py-1"
                    >
                        Temizle
                    </button>
                </div>
            </div>

            {/* Category Filter Pills */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
                <button
                    onClick={() => { playTick(); setActiveCategory('all'); }}
                    className={`shrink-0 rounded-xl px-3.5 py-1.5 text-xs font-bold transition-all cursor-pointer ${
                        activeCategory === 'all'
                            ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                            : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                    }`}
                >
                    ✨ Tümü ({ERAS.length})
                </button>
                {ERA_CATEGORIES.map((cat) => (
                    <button
                        key={cat.id}
                        onClick={() => { playTick(); setActiveCategory(cat.id); }}
                        className={`shrink-0 flex items-center gap-1.5 rounded-xl px-3.5 py-1.5 text-xs font-bold transition-all cursor-pointer ${
                            activeCategory === cat.id
                                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                        }`}
                    >
                        <span>{cat.icon}</span>
                        <span>{cat.labelTr}</span>
                    </button>
                ))}
            </div>

            {/* Era Grid Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 max-h-[460px] overflow-y-auto pr-1">
                {filteredEras.map((era) => {
                    const isSelected = selectedEraIds.includes(era.id);
                    return (
                        <div
                            key={era.id}
                            onClick={() => { playTick(); onToggleEra(era.id); }}
                            className={`group relative rounded-2xl p-3.5 border transition-all duration-200 cursor-pointer select-none ${
                                isSelected
                                    ? 'bg-gradient-to-br ' + era.bgGradient + ' border-amber-400 shadow-lg shadow-amber-500/10 scale-[1.02]'
                                    : 'bg-slate-800/80 border-slate-700/80 hover:border-slate-500 hover:bg-slate-800'
                            }`}
                        >
                            {/* Checkbox Icon */}
                            <div className="flex items-start justify-between gap-2 mb-2">
                                <div className="flex items-center gap-2">
                                    <span className="text-2xl">{era.icon}</span>
                                    <div>
                                        <div className="text-sm font-bold text-white leading-tight">
                                            {era.titleTr}
                                        </div>
                                        <div className="text-[11px] font-mono text-amber-300/90 font-bold">
                                            {era.yearDisplay}
                                        </div>
                                    </div>
                                </div>
                                <div className={`w-5 h-5 rounded-md flex items-center justify-center border transition-all ${
                                    isSelected
                                        ? 'bg-amber-400 border-amber-300 text-slate-950'
                                        : 'border-slate-500 bg-slate-900/60 group-hover:border-slate-400'
                                }`}>
                                    {isSelected && (
                                        <svg className="w-3.5 h-3.5" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                        </svg>
                                    )}
                                </div>
                            </div>

                            {/* Badge & Fact Snippet */}
                            <div className="flex items-center justify-between text-[10px] text-slate-300 mt-2 border-t border-white/10 pt-2">
                                <span className="bg-black/30 px-2 py-0.5 rounded-full font-medium">
                                    {era.badge}
                                </span>
                                <span className="text-slate-400 group-hover:text-slate-200 truncate max-w-[140px]">
                                    {era.newspaperHeadlineTr.substring(0, 24)}...
                                </span>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
