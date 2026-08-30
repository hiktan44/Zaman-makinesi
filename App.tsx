/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import React, { useState, ChangeEvent, useEffect } from 'react';
import { generateDecadeImage } from './services/geminiService';
import PolaroidCard from './components/PolaroidCard';
import { createAlbumPage } from './lib/albumUtils';
import { addTimestampToImage } from './lib/imageUtils';
import { usePayment } from './contexts/PaymentContext';
import { useAuth } from './contexts/AuthContext';
import PricingModal from './components/PricingModal';
import AuthModal from './components/AuthModal';
import AdminPanel from './components/AdminPanel';
import Footer from './components/Footer';
import Header, { AppMainTab } from './components/Header';
import IntroPage from './components/IntroPage';
import TimeCockpit from './components/TimeCockpit';
import HistoricalNewspaper from './components/HistoricalNewspaper';
import VideoMorphModal from './components/VideoMorphModal';
import VideoStudioPage from './components/VideoStudioPage';
import NewspaperStudioPage from './components/NewspaperStudioPage';
import AlbumStudioPage from './components/AlbumStudioPage';
import { ERAS, ALL_ERA_IDS, ERA_CATEGORIES, EraCategory } from './constants/eraConstants';
import { useT } from './lib/useT';
import { playCameraShutter, playSuccess, playTick, playWarp } from './lib/sfxUtils';
import { addAdminLog } from './lib/adminStore';

type ImageStatus = 'pending' | 'done' | 'error';
interface GeneratedImage {
    status: ImageStatus;
    url?: string;
    error?: string;
}

const useMediaQuery = (query: string) => {
    const [matches, setMatches] = useState(false);
    useEffect(() => {
        const media = window.matchMedia(query);
        if (media.matches !== matches) {
            setMatches(media.matches);
        }
        const listener = () => setMatches(media.matches);
        window.addEventListener('resize', listener);
        return () => window.removeEventListener('resize', listener);
    }, [matches, query]);
    return matches;
};

function App() {
    const { t } = useT();
    const [uploadedImage, setUploadedImage] = useState<string | null>(null);
    const [generatedImages, setGeneratedImages] = useState<Record<string, GeneratedImage>>({});
    const [selectedEraIds, setSelectedEraIds] = useState<string[]>([
        'ottoman_sultan',
        '1920s',
        'ancient_rome',
        'viking_age',
        '1980s',
        'cyberpunk_2077',
        'pera_1890'
    ]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isDownloading, setIsDownloading] = useState<boolean>(false);
    const [appState, setAppState] = useState<'idle' | 'image-uploaded' | 'generating' | 'results-shown'>('idle');
    const [resultsActiveCategory, setResultsActiveCategory] = useState<EraCategory>('all');
    const isMobile = useMediaQuery('(max-width: 768px)');

    // Primary Tab Navigation
    const [activeTab, setActiveTab] = useState<AppMainTab>('cockpit');

    // Modals
    const [showPricingModal, setShowPricingModal] = useState(false);
    const [showAuthModal, setShowAuthModal] = useState(false);
    const [showAdminPanel, setShowAdminPanel] = useState(false);
    const [showVideoMorphModal, setShowVideoMorphModal] = useState(false);
    const [newspaperModalData, setNewspaperModalData] = useState<{ isOpen: boolean; eraId: string; imageUrl: string }>({
        isOpen: false,
        eraId: '',
        imageUrl: ''
    });

    const { credits, isPremium, useCredit, costs } = usePayment();
    const { user, isAuthenticated } = useAuth();

    const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const reader = new FileReader();
            reader.onloadend = () => {
                playTick();
                setUploadedImage(reader.result as string);
                setAppState('image-uploaded');
                setGeneratedImages({});
            };
            reader.readAsDataURL(file);
        }
    };

    const toggleEra = (eraId: string) => {
        setSelectedEraIds(prev =>
            prev.includes(eraId)
                ? prev.filter(id => id !== eraId)
                : [...prev, eraId]
        );
    };

    const handleSelectAll = () => setSelectedEraIds(ALL_ERA_IDS);
    const handleClearAll = () => setSelectedEraIds([]);

    const generateSingleEra = async (eraId: string, sourceImg: string) => {
        const startTime = Date.now();
        const eraDef = ERAS.find(e => e.id === eraId);
        const eraDisplay = eraDef ? eraDef.yearDisplay : eraId;

        setGeneratedImages(prev => ({
            ...prev,
            [eraId]: { status: 'pending' }
        }));

        try {
            const resultUrl = await generateDecadeImage(sourceImg, eraId);
            const timestampedUrl = await addTimestampToImage(resultUrl, eraDisplay);

            if (!isPremium) {
                useCredit(costs.SINGLE_PHOTO);
            }

            playCameraShutter();
            setGeneratedImages(prev => ({
                ...prev,
                [eraId]: { status: 'done', url: timestampedUrl }
            }));

            setSelectedEraIds(prev => prev.includes(eraId) ? prev : [...prev, eraId]);

            addAdminLog({
                userEmail: user?.email || 'anonim@zamanmakinesi.app',
                action: 'IMAGE_GENERATE',
                eraTitle: eraDef?.titleTr || eraId,
                creditsUsed: 1,
                latencyMs: Date.now() - startTime,
                status: 'SUCCESS',
                details: 'Yapay Zeka Dönem Dönüşümü'
            });
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : t('error.unknown');
            setGeneratedImages(prev => ({
                ...prev,
                [eraId]: { status: 'error', error: errorMessage }
            }));

            addAdminLog({
                userEmail: user?.email || 'anonim@zamanmakinesi.app',
                action: 'IMAGE_GENERATE',
                eraTitle: eraDef?.titleTr || eraId,
                creditsUsed: 0,
                latencyMs: Date.now() - startTime,
                status: 'ERROR',
                details: errorMessage
            });
        }
    };

    const handleGenerateClick = async () => {
        if (!uploadedImage || selectedEraIds.length === 0) return;

        if (!isAuthenticated) {
            setShowAuthModal(true);
            return;
        }

        const requiredCredits = selectedEraIds.length * costs.SINGLE_PHOTO;
        if (!isPremium && credits < requiredCredits) {
            alert(`Yetersiz Plütonyum Kredisi! ${selectedEraIds.length} çağ için ${requiredCredits} kredi gerekiyor. Mevcut bakiyeniz: ${credits}`);
            setShowPricingModal(true);
            return;
        }

        playWarp();
        setIsLoading(true);
        setAppState('results-shown');

        const eraQueue = [...selectedEraIds];
        for (const eraId of eraQueue) {
            await generateSingleEra(eraId, uploadedImage);
            await new Promise(resolve => setTimeout(resolve, 800));
        }

        playSuccess();
        setIsLoading(false);
    };

    const handleBatchGenerateCategory = async (cat: EraCategory) => {
        if (!uploadedImage) return;

        const targetEras = cat === 'all' ? ERAS : ERAS.filter(e => e.category === cat);
        const ungeneratedEras = targetEras.filter(e => !generatedImages[e.id] || generatedImages[e.id].status !== 'done');

        if (ungeneratedEras.length === 0) {
            alert('Bu sekmedeki tüm çağlar zaten üretilmiş durumda!');
            return;
        }

        const requiredCredits = ungeneratedEras.length * costs.SINGLE_PHOTO;
        if (!isPremium && credits < requiredCredits) {
            alert(`Yetersiz Kredi! Bu kategorideki ${ungeneratedEras.length} çağ için ${requiredCredits} kredi gerekiyor.`);
            setShowPricingModal(true);
            return;
        }

        playWarp();
        setIsLoading(true);
        for (const era of ungeneratedEras) {
            await generateSingleEra(era.id, uploadedImage);
            await new Promise(resolve => setTimeout(resolve, 800));
        }
        playSuccess();
        setIsLoading(false);
    };

    const handleDownloadIndividualImage = (eraId: string) => {
        const image = generatedImages[eraId];
        if (image && image.status === 'done' && image.url) {
            playCameraShutter();
            const link = document.createElement('a');
            link.href = image.url;
            link.download = `zaman-makinesi-${eraId}.jpg`;
            link.click();
        }
    };

    const handleDownloadAllImages = () => {
        playSuccess();
        setIsDownloading(true);
        const doneEraIds = Object.keys(generatedImages).filter(id => generatedImages[id]?.status === 'done');
        doneEraIds.forEach((eraId, index) => {
            const image = generatedImages[eraId];
            if (image && image.status === 'done' && image.url) {
                setTimeout(() => {
                    const link = document.createElement('a');
                    link.href = image.url!;
                    link.download = `zaman-makinesi-${eraId}.jpg`;
                    link.click();
                }, index * 400);
            }
        });
        setTimeout(() => setIsDownloading(false), doneEraIds.length * 400 + 500);
    };

    const handleDownloadAlbum = async () => {
        setIsDownloading(true);
        playCameraShutter();
        try {
            const validImages = Object.keys(generatedImages)
                .filter(id => generatedImages[id]?.status === 'done' && generatedImages[id]?.url)
                .map(id => {
                    const era = ERAS.find(e => e.id === id);
                    return {
                        decade: era ? `${era.yearDisplay} ${era.titleTr}` : id,
                        url: generatedImages[id]!.url!
                    };
                });

            if (validImages.length === 0) {
                alert('İndirilecek hazır görsel bulunamadı.');
                return;
            }

            const pdfBlob = await createAlbumPage(validImages);
            const link = document.createElement('a');
            link.href = URL.createObjectURL(pdfBlob);
            link.download = 'zaman-makinesi-tarih-albumu.pdf';
            link.click();
            playSuccess();
        } catch (error) {
            console.error('Albüm indirme hatası:', error);
            alert('Albüm PDF oluşturulurken bir hata oluştu.');
        } finally {
            setIsDownloading(false);
        }
    };

    const handleReset = () => {
        playTick();
        setAppState('idle');
        setUploadedImage(null);
        setGeneratedImages({});
    };

    const displayedEras = resultsActiveCategory === 'all'
        ? ERAS
        : ERAS.filter(e => e.category === resultsActiveCategory);

    const completedImagesList = Object.keys(generatedImages)
        .filter(id => generatedImages[id]?.status === 'done' && generatedImages[id]?.url)
        .map(id => ({ eraId: id, url: generatedImages[id]!.url! }));

    return (
        <div className="relative min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-amber-500 selection:text-black">
            {/* Header with full tab navigation */}
            <Header
                onOpenPricing={() => setShowPricingModal(true)}
                onOpenAuth={() => setShowAuthModal(true)}
                onOpenAdmin={() => setShowAdminPanel(true)}
                activeTab={activeTab}
                onSelectTab={(t) => {
                    playTick();
                    setActiveTab(t);
                }}
            />

            <main className="flex-grow">
                {/* TAB 1: INTRO / LANDING PAGE */}
                {activeTab === 'intro' && (
                    <IntroPage
                        onStart={() => { playTick(); setActiveTab('cockpit'); }}
                        onOpenPricing={() => setShowPricingModal(true)}
                        onOpenAuth={() => setShowAuthModal(true)}
                        onOpenAdmin={() => setShowAdminPanel(true)}
                    />
                )}

                {/* TAB 2: COCKPIT & TIME JUMP */}
                {activeTab === 'cockpit' && (
                    <>
                        {(appState === 'idle' || appState === 'image-uploaded') && (
                            <TimeCockpit
                                uploadedImage={uploadedImage}
                                onImageUpload={handleImageUpload}
                                selectedEraIds={selectedEraIds}
                                onToggleEra={toggleEra}
                                onSelectAll={handleSelectAll}
                                onClearAll={handleClearAll}
                                onLaunchTravel={handleGenerateClick}
                                isLoading={isLoading}
                                onOpenPricing={() => setShowPricingModal(true)}
                            />
                        )}

                        {(appState === 'generating' || appState === 'results-shown') && (
                            <div className="w-full max-w-7xl mx-auto px-4 py-8 flex flex-col items-center space-y-6 animate-in fade-in duration-300">
                                {/* Results Top Action Bar */}
                                <div className="w-full flex flex-wrap items-center justify-between gap-4 bg-slate-900/90 border border-slate-800 p-4 rounded-3xl shadow-xl backdrop-blur-md">
                                    <div className="flex items-center gap-3">
                                        <button
                                            onClick={handleReset}
                                            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-300 flex items-center gap-1.5 transition cursor-pointer"
                                        >
                                            <span>←</span>
                                            <span>Yeni Fotoğraf Yükle</span>
                                        </button>
                                        <div className="text-xs text-slate-400 font-mono">
                                            Hazır Portreler: <span className="text-amber-400 font-bold">{completedImagesList.length} Çağ</span>
                                        </div>
                                    </div>

                                    {/* Batch Actions & Video Morph Trigger */}
                                    <div className="flex flex-wrap items-center gap-2.5">
                                        {completedImagesList.length > 0 && (
                                            <>
                                                <button
                                                    onClick={() => { playTick(); setActiveTab('video'); }}
                                                    className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-black text-xs shadow-md hover:brightness-110 active:scale-95 transition flex items-center gap-1.5 cursor-pointer"
                                                >
                                                    <span>🎬</span>
                                                    <span>9:16 Video Stüdyosu</span>
                                                </button>
                                                <button
                                                    onClick={() => { playTick(); setActiveTab('newspaper'); }}
                                                    className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 font-bold text-xs border border-slate-700 flex items-center gap-1.5 transition cursor-pointer"
                                                >
                                                    <span>📰</span>
                                                    <span>Gazete & Pasaport</span>
                                                </button>
                                                <button
                                                    disabled={isDownloading}
                                                    onClick={handleDownloadAlbum}
                                                    className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs border border-slate-700 flex items-center gap-1.5 transition cursor-pointer"
                                                >
                                                    <span>📖</span>
                                                    <span>PDF Albüm</span>
                                                </button>
                                                <button
                                                    disabled={isDownloading}
                                                    onClick={handleDownloadAllImages}
                                                    className="px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs shadow-md transition cursor-pointer flex items-center gap-1.5"
                                                >
                                                    <span>📥</span>
                                                    <span>Tümünü İndir</span>
                                                </button>
                                            </>
                                        )}
                                    </div>
                                </div>

                                {/* CATEGORY TABS IN RESULTS VIEW */}
                                <div className="w-full flex flex-col space-y-3">
                                    <div className="flex items-center justify-between flex-wrap gap-2">
                                        <div className="flex items-center gap-2 overflow-x-auto pb-1 max-w-full">
                                            {ERA_CATEGORIES.map((cat) => (
                                                <button
                                                    key={cat.id}
                                                    onClick={() => { playTick(); setResultsActiveCategory(cat.id); }}
                                                    className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition cursor-pointer flex items-center gap-1.5 ${
                                                        resultsActiveCategory === cat.id
                                                            ? 'bg-amber-400 text-slate-950 font-black shadow-lg shadow-amber-400/20'
                                                            : 'bg-slate-900/90 border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800'
                                                    }`}
                                                >
                                                    <span>{cat.icon}</span>
                                                    <span>{cat.labelTr}</span>
                                                </button>
                                            ))}
                                        </div>

                                        <button
                                            disabled={isLoading}
                                            onClick={() => handleBatchGenerateCategory(resultsActiveCategory)}
                                            className="px-3.5 py-2 rounded-xl bg-emerald-500/20 border border-emerald-500/40 hover:bg-emerald-500/30 text-emerald-300 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
                                        >
                                            <span>⚡</span>
                                            <span>Bu Sekmedeki Tümünü Işınla</span>
                                        </button>
                                    </div>
                                </div>

                                {/* Polaroid Cards & Era Portals Grid */}
                                <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                                    {displayedEras.map((era) => {
                                        const genState = generatedImages[era.id];
                                        const isDone = genState?.status === 'done';
                                        const isPending = genState?.status === 'pending';
                                        const isError = genState?.status === 'error';
                                        const caption = `${era.yearDisplay} ${era.titleTr}`;

                                        if (isDone || isPending || isError) {
                                            return (
                                                <div key={era.id} className="flex justify-center w-full">
                                                    <PolaroidCard
                                                        caption={caption}
                                                        status={genState.status}
                                                        imageUrl={genState.url}
                                                        error={genState.error}
                                                        onShake={() => uploadedImage && generateSingleEra(era.id, uploadedImage)}
                                                        onDownload={() => handleDownloadIndividualImage(era.id)}
                                                        onOpenNewspaper={(cap, url) => {
                                                            setNewspaperModalData({
                                                                isOpen: true,
                                                                eraId: era.id,
                                                                imageUrl: url
                                                            });
                                                        }}
                                                        isMobile={isMobile}
                                                    />
                                                </div>
                                            );
                                        }

                                        return (
                                            <div
                                                key={era.id}
                                                className="relative w-full rounded-2xl border border-dashed border-slate-700 bg-slate-900/60 p-4 flex flex-col items-center justify-between min-h-[380px] hover:border-amber-400/60 hover:bg-slate-900/90 transition group overflow-hidden"
                                            >
                                                <div
                                                    className="absolute inset-0 bg-cover bg-center opacity-15 group-hover:opacity-25 transition duration-500 pointer-events-none"
                                                    style={{ backgroundImage: `url(${era.bgImage})` }}
                                                />

                                                <div className="relative z-10 w-full flex items-center justify-between">
                                                    <span className="text-xl">{era.icon}</span>
                                                    <span className="text-[10px] bg-slate-800 text-slate-300 font-mono px-2 py-0.5 rounded-full">
                                                        {era.badge}
                                                    </span>
                                                </div>

                                                <div className="relative z-10 flex flex-col items-center text-center space-y-2 my-auto p-4">
                                                    <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                                                        ⏳
                                                    </div>
                                                    <h4 className="text-sm font-bold text-white leading-tight">
                                                        {era.titleTr}
                                                    </h4>
                                                    <p className="text-[11px] text-slate-400 line-clamp-2">
                                                        {era.newspaperSubTr}
                                                    </p>
                                                </div>

                                                <button
                                                    disabled={isLoading}
                                                    onClick={() => uploadedImage && generateSingleEra(era.id, uploadedImage)}
                                                    className="relative z-10 w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-yellow-500 text-slate-950 font-black text-xs shadow-md hover:brightness-110 active:scale-95 transition flex items-center justify-center gap-1.5 cursor-pointer"
                                                >
                                                    <span>⚡</span>
                                                    <span>Bu Çağa Işınlan (1 Kredi)</span>
                                                </button>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        )}
                    </>
                )}

                {/* TAB 3: 9:16 VIDEO STUDIO */}
                {activeTab === 'video' && (
                    <VideoStudioPage
                        images={completedImagesList}
                        originalImage={uploadedImage}
                        onNavigateToCockpit={() => setActiveTab('cockpit')}
                    />
                )}

                {/* TAB 4: HISTORICAL NEWSPAPER & PASSPORT STUDIO */}
                {activeTab === 'newspaper' && (
                    <NewspaperStudioPage
                        images={completedImagesList}
                        originalImage={uploadedImage}
                        onNavigateToCockpit={() => setActiveTab('cockpit')}
                    />
                )}

                {/* TAB 5: PDF ALBUM & ARCHIVE */}
                {activeTab === 'album' && (
                    <AlbumStudioPage
                        images={completedImagesList}
                        originalImage={uploadedImage}
                        onNavigateToCockpit={() => setActiveTab('cockpit')}
                    />
                )}
            </main>

            {/* Footer */}
            <Footer />

            {/* Admin Panel Modal */}
            <AdminPanel
                isOpen={showAdminPanel}
                onClose={() => setShowAdminPanel(false)}
            />

            {/* Pricing Modal */}
            <PricingModal
                isOpen={showPricingModal}
                onClose={() => setShowPricingModal(false)}
            />

            {/* Auth Modal */}
            <AuthModal
                isOpen={showAuthModal}
                onClose={() => setShowAuthModal(false)}
            />

            {/* Historical Newspaper & Passport Modal */}
            <HistoricalNewspaper
                isOpen={newspaperModalData.isOpen}
                onClose={() => setNewspaperModalData(prev => ({ ...prev, isOpen: false }))}
                imageUrl={newspaperModalData.imageUrl}
                eraId={newspaperModalData.eraId}
            />

            {/* 9:16 Video Morph Modal */}
            <VideoMorphModal
                isOpen={showVideoMorphModal}
                onClose={() => setShowVideoMorphModal(false)}
                images={completedImagesList}
                originalImage={uploadedImage}
            />
        </div>
    );
}

export default App;
