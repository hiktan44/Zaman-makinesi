/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import React, { useState } from 'react';
import { ERAS } from '../constants/eraConstants';
import { createAlbumPage } from '../lib/albumUtils';
import { playCameraShutter, playSuccess, playTick } from '../lib/sfxUtils';
import { useT } from '../lib/useT';
import { eraText } from '../constants/eraDisplay';

interface AlbumStudioPageProps {
    images: { eraId: string; url: string }[];
    originalImage: string | null;
    onNavigateToCockpit: () => void;
}

export default function AlbumStudioPage({
    images,
    originalImage,
    onNavigateToCockpit
}: AlbumStudioPageProps) {
    const [isDownloading, setIsDownloading] = useState(false);
    const { t, lang } = useT();

    // Fallback demo album if user hasn't generated any yet
    const demoItems = [
        { eraId: '1920s', title: t('al.d1.title'), yearDisplay: t('al.d1.year'), url: '/images/demo-gatsby.jpg', fact: t('al.d1.fact') },
        { eraId: 'ottoman_sultan', title: t('al.d2.title'), yearDisplay: '1550', url: '/images/demo-ottoman.jpg', fact: t('al.d2.fact') },
        { eraId: 'wild_west_1880', title: t('al.d3.title'), yearDisplay: '1885', url: '/images/demo-west.jpg', fact: t('al.d3.fact') },
        { eraId: 'ancient_egypt', title: t('al.d4.title'), yearDisplay: t('al.d4.year'), url: '/images/demo-egypt.jpg', fact: t('al.d4.fact') },
        { eraId: 'cyberpunk_2077', title: t('al.d5.title'), yearDisplay: '2077', url: '/images/demo-cyberpunk.jpg', fact: t('al.d5.fact') }
    ];

    const hasUserImages = images.length > 0;

    const userAlbumItems = images.map(img => {
        const era = ERAS.find(e => e.id === img.eraId);
        return {
            eraId: img.eraId,
            title: era ? `${eraText(era, lang).year} ${eraText(era, lang).title}` : img.eraId,
            yearDisplay: era ? eraText(era, lang).year : img.eraId,
            url: img.url,
            fact: era ? eraText(era, lang).fact : t('al.archive')
        };
    });

    const activeAlbumItems = hasUserImages ? userAlbumItems : demoItems;

    const handleDownloadPdfAlbum = async () => {
        setIsDownloading(true);
        playCameraShutter();
        try {
            const validImages = activeAlbumItems.map(item => ({
                decade: item.title,
                url: item.url
            }));

            const pdfBlob = await createAlbumPage(validImages);
            const link = document.createElement('a');
            link.href = URL.createObjectURL(pdfBlob);
            link.download = 'zaman-makinesi-tarih-albumu.pdf';
            link.click();
            playSuccess();
        } catch (error) {
            console.error('Albüm indirme hatası:', error);
            alert(t('al.alertFail'));
        } finally {
            setIsDownloading(false);
        }
    };

    const handleDownloadAllPhotos = () => {
        playSuccess();
        activeAlbumItems.forEach((item, index) => {
            setTimeout(() => {
                const link = document.createElement('a');
                link.href = item.url;
                link.download = `zaman-makinesi-${item.eraId}.jpg`;
                link.click();
            }, index * 300);
        });
    };

    return (
        <div className="w-full max-w-7xl mx-auto px-4 py-8 flex flex-col space-y-8 animate-in fade-in duration-300">
            {/* Top Studio Header */}
            <div className="flex flex-wrap items-center justify-between gap-4 bg-slate-900/90 border border-slate-800 p-6 rounded-3xl shadow-xl">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-2xl">
                        📖
                    </div>
                    <div>
                        <div className="flex items-center gap-2">
                            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                                {t('al.title')}
                            </h2>
                            <span className="bg-amber-400 text-slate-950 text-[10px] font-black px-2 py-0.5 rounded-full uppercase">
                                {t('al.badge')}
                            </span>
                        </div>
                        <p className="text-xs text-slate-400">
                            {t('al.sub')}
                        </p>
                    </div>
                </div>

                {/* Batch Download Actions */}
                <div className="flex items-center gap-3">
                    <button
                        onClick={handleDownloadAllPhotos}
                        className="px-4 py-2.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs border border-slate-700 transition flex items-center gap-2 cursor-pointer"
                    >
                        <span>📥</span>
                        <span>{t('al.photos')}</span>
                    </button>
                    <button
                        disabled={isDownloading}
                        onClick={handleDownloadPdfAlbum}
                        className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-300 text-slate-950 font-black text-xs shadow-md active:scale-95 transition flex items-center gap-2 cursor-pointer"
                    >
                        <span>{isDownloading ? '⏳' : '📖'}</span>
                        <span>{isDownloading ? t('al.compiling') : t('al.pdf')}</span>
                    </button>
                </div>
            </div>

            {!hasUserImages && (
                <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <span className="text-2xl">💡</span>
                        <p className="text-xs text-amber-200">
                            {t('al.demoA')}<strong>{t('al.demoB')}</strong>{t('al.demoC')}
                        </p>
                    </div>
                    <button
                        onClick={onNavigateToCockpit}
                        className="px-4 py-2 bg-amber-400 hover:bg-amber-300 text-slate-950 rounded-xl font-black text-xs transition whitespace-nowrap cursor-pointer"
                    >
                        {t('al.upload')}
                    </button>
                </div>
            )}

            {/* Antique Album Scrapbook Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {activeAlbumItems.map((item, idx) => (
                    <div
                        key={item.eraId}
                        className="relative rounded-3xl bg-[#f5ede0] text-[#2d2417] p-5 shadow-2xl border-4 border-[#523d24] font-serif flex flex-col justify-between space-y-4 group hover:-translate-y-1 transition-transform duration-300"
                    >
                        {/* Vintage Photo Corner Accents */}
                        <div className="absolute top-3 left-3 w-5 h-5 border-t-2 border-l-2 border-[#806038] pointer-events-none"></div>
                        <div className="absolute top-3 right-3 w-5 h-5 border-t-2 border-r-2 border-[#806038] pointer-events-none"></div>
                        <div className="absolute bottom-3 left-3 w-5 h-5 border-b-2 border-l-2 border-[#806038] pointer-events-none"></div>
                        <div className="absolute bottom-3 right-3 w-5 h-5 border-b-2 border-r-2 border-[#806038] pointer-events-none"></div>

                        {/* Top Scrapbook Header */}
                        <div className="flex items-center justify-between border-b border-[#c2b093] pb-2 text-[11px] font-mono text-[#6b5131]">
                            <span>{t('al.page')}{idx + 1}</span>
                            <span className="font-black text-[#3d2b17]">{item.yearDisplay}</span>
                        </div>

                        {/* Centered Photo Frame */}
                        <div className="w-full aspect-square rounded-xl overflow-hidden border-2 border-[#695030] shadow-md bg-[#e3d5be] p-1.5">
                            <img
                                src={item.url}
                                alt={item.title}
                                className="w-full h-full object-cover rounded-lg group-hover:scale-105 transition-transform duration-500"
                            />
                        </div>

                        {/* Handwritten Caption & Historical Note */}
                        <div className="space-y-1.5 pt-1">
                            <h3 className="text-sm font-black uppercase tracking-tight text-[#1c140b]">
                                {item.title}
                            </h3>
                            <p className="text-xs italic text-[#574127] leading-relaxed line-clamp-3">
                                "{item.fact}"
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
