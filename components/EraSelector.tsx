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
    const [activeCategory, setActiveCategory] = useState<EraCategory>('all');

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
                    <span className="ml-2 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 px-2.5 py-0.5 text-xs font-bold font-mono">
                        {selectedEraIds.length} Çağ Seçili
                    </span>
                </div>

                {/* Bulk Actions */}
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => { playTick(); onSelectAll(); }}
                        className="text-xs font-bold text-amber-400 hover:text-amber-300 transition px-2 py-1 cursor-pointer"
                    >
                        Tümünü Seç
                    </button>
                    <span className="text-slate-600">|</span>
                    <button
                        onClick={() => { playTick(); onClearAll(); }}
                        className="text-xs font-bold text-slate-400 hover:text-white transition px-2 py-1 cursor-pointer"
                    >
                        Temizle
                    </button>
                </div>
            </div>

            {/* Category Filter Tabs */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin scrollbar-thumb-slate-700">
                {ERA_CATEGORIES.map((cat) => {
                    const count = cat.id === 'all' ? ERAS.length : ERAS.filter(e => e.category === cat.id).length;
                    const isActive = activeCategory === cat.id;
                    return (
                        <button
                            key={cat.id}
                            onClick={() => { playTick(); setActiveCategory(cat.id); }}
                            className={`shrink-0 flex items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-bold transition-all cursor-pointer select-none ${
                                isActive
                                    ? 'bg-amber-400 text-slate-950 shadow-md shadow-amber-500/25 font-black scale-105'
                                    : 'bg-slate-900/90 text-slate-300 border border-slate-800 hover:bg-slate-800 hover:text-white'
                            }`}
                        >
                            <span>{cat.icon}</span>
                            <span>{cat.labelTr}</span>
                            <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-mono ${
                                isActive ? 'bg-slate-950 text-amber-400 font-bold' : 'bg-slate-800 text-slate-400'
                            }`}>
                                {count}
                            </span>
                        </button>
                    );
                })}
            </div>

            {/* Era Grid Cards with Atmospheric Background Portals */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 max-h-[500px] overflow-y-auto pr-1">
                {filteredEras.map((era) => {
                    const isSelected = selectedEraIds.includes(era.id);
                    return (
                        <div
                            key={era.id}
                            onClick={() => { playTick(); onToggleEra(era.id); }}
                            className={`group relative rounded-2xl p-4 border overflow-hidden transition-all duration-200 cursor-pointer select-none ${
                                isSelected
                                    ? 'border-amber-400 ring-2 ring-amber-400/40 shadow-xl shadow-amber-500/20 scale-[1.02]'
                                    : 'border-slate-800 hover:border-slate-600 hover:scale-[1.01]'
                            }`}
                        >
                            {/* Low-opacity Atmospheric Background Photo & Gradient */}
                            <div
                                className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110 opacity-30 mix-blend-luminosity pointer-events-none"
                                style={{ backgroundImage: `url(${era.bgImage})` }}
                            />
                            <div className={`absolute inset-0 bg-gradient-to-br ${era.bgGradient} opacity-85 pointer-events-none`} />

                            {/* Card Content Overlay */}
                            <div className="relative z-10 flex flex-col justify-between h-full space-y-2.5">
                                <div className="flex items-start justify-between gap-2">
                                    <div className="flex items-center gap-2.5">
                                        <span className="text-2xl drop-shadow-md">{era.icon}</span>
                                        <div>
                                            <div className="flex items-center gap-1.5">
                                                <span className="font-mono text-xs font-black text-amber-300 tracking-wider">
                                                    {era.yearDisplay}
                                                </span>
                                                <span className="rounded bg-black/50 backdrop-blur-sm border border-white/10 px-1.5 py-0.5 text-[10px] font-semibold text-slate-300">
                                                    {era.badge}
                                                </span>
                                            </div>
                                            <h4 className="text-sm font-bold text-white leading-snug line-clamp-1 mt-0.5 drop-shadow-sm">
                                                {era.titleTr}
                                            </h4>
                                        </div>
                                    </div>

                                    {/* Checkbox Indicator */}
                                    <div className={`shrink-0 flex items-center justify-center w-5 h-5 rounded-md border transition-all ${
                                        isSelected
                                            ? 'bg-amber-400 border-amber-300 text-slate-950 font-bold'
                                            : 'border-slate-500/60 bg-black/40 group-hover:border-slate-400'
                                    }`}>
                                        {isSelected && (
                                            <svg className="w-3.5 h-3.5 stroke-[3]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                            </svg>
                                        )}
                                    </div>
                                </div>

                                <p className="text-[11px] text-slate-300/90 leading-tight line-clamp-2 drop-shadow">
                                    {era.historicalFactTr}
                                </p>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
