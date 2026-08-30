/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import React, { useState } from 'react';
import { ERAS } from '../constants/eraConstants';
import { createAlbumPage } from '../lib/albumUtils';
import { playCameraShutter, playSuccess, playTick } from '../lib/sfxUtils';

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

    // Fallback demo album if user hasn't generated any yet
    const demoItems = [
        { eraId: '1920s', title: '1920’ler — Great Gatsby & Caz', yearDisplay: '1920’ler', url: '/images/demo-gatsby.jpg', fact: 'Caz çağı, flapper elbiseleri ve art-deco dönemi.' },
        { eraId: 'ottoman_sultan', title: '1550 Osmanlı Saray İhtişamı', yearDisplay: '1550', url: '/images/demo-ottoman.jpg', fact: 'Topkapı Sarayı, ipek kaftanlar ve altın işlemeli saray zarafeti.' },
        { eraId: 'wild_west_1880', title: '1885 Vahşi Batı Şerifi', yearDisplay: '1885', url: '/images/demo-west.jpg', fact: 'Altına hücum, kovboy çizmeleri ve frontier kasabaları.' },
        { eraId: 'ancient_egypt', title: 'M.Ö. 1350 Antik Mısır Kraliçesi', yearDisplay: 'M.Ö. 1350', url: '/images/demo-egypt.jpg', fact: 'Nil kıyısı, altın firavun taçları ve piramitler çağı.' },
        { eraId: 'cyberpunk_2077', title: '2077 Cyberpunk Neo-İstanbul', yearDisplay: '2077', url: '/images/demo-cyberpunk.jpg', fact: 'Neon gökdelenler, holografik köprüler ve sibernetik çağ.' }
    ];

    const hasUserImages = images.length > 0;

    const userAlbumItems = images.map(img => {
        const era = ERAS.find(e => e.id === img.eraId);
        return {
            eraId: img.eraId,
            title: era ? `${era.yearDisplay} ${era.titleTr}` : img.eraId,
            yearDisplay: era ? era.yearDisplay : img.eraId,
            url: img.url,
            fact: era ? era.historicalFactTr : 'Zaman Makinesi arşivi.'
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
            alert('PDF albüm oluşturulamadı.');
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
                                TARİH ALBÜMÜ & GEZGİN KOLEKSİYONU
                            </h2>
                            <span className="bg-amber-400 text-slate-950 text-[10px] font-black px-2 py-0.5 rounded-full uppercase">
                                PDF & BASKI
                            </span>
                        </div>
                        <p className="text-xs text-slate-400">
                            Tüm çağlardaki fotoğraflarınızı antika bir deri ciltli aile albümü şeklinde inceleyin ve tek tıkla PDF olarak indirin.
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
                        <span>Fotoğrafları İndir</span>
                    </button>
                    <button
                        disabled={isDownloading}
                        onClick={handleDownloadPdfAlbum}
                        className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-300 text-slate-950 font-black text-xs shadow-md active:scale-95 transition flex items-center gap-2 cursor-pointer"
                    >
                        <span>{isDownloading ? '⏳' : '📖'}</span>
                        <span>{isDownloading ? 'Albüm Derleniyor...' : 'Koleksiyonu PDF Olarak İndir'}</span>
                    </button>
                </div>
            </div>

            {!hasUserImages && (
                <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <span className="text-2xl">💡</span>
                        <p className="text-xs text-amber-200">
                            Şu anda <strong>Demo Gezgin Albümünü</strong> görüntülüyorsunuz. Kendi fotoğrafınızla tüm çağlara ait kişisel bir albüm oluşturmak için kokpite gidin!
                        </p>
                    </div>
                    <button
                        onClick={onNavigateToCockpit}
                        className="px-4 py-2 bg-amber-400 hover:bg-amber-300 text-slate-950 rounded-xl font-black text-xs transition whitespace-nowrap cursor-pointer"
                    >
                        Fotoğraf Yükle →
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
                            <span>SAYFA NO: {idx + 1}</span>
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
