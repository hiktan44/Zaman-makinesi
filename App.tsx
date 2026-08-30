/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import React, { useState, ChangeEvent, useRef, useEffect } from 'react';
import { generateDecadeImage } from './services/geminiService';
import PolaroidCard from './components/PolaroidCard';
import { createAlbumPage } from './lib/albumUtils';
import { addTimestampToImage } from './lib/imageUtils';
import { usePayment } from './contexts/PaymentContext';
import { useAuth } from './contexts/AuthContext';
import PricingModal from './components/PricingModal';
import AuthModal from './components/AuthModal';
import Footer from './components/Footer';
import Header from './components/Header';
import IntroPage from './components/IntroPage';
import TimeCockpit from './components/TimeCockpit';
import HistoricalNewspaper from './components/HistoricalNewspaper';
import VideoMorphModal from './components/VideoMorphModal';
import { ERAS, EraDefinition, ALL_ERA_IDS } from './constants/eraConstants';
import { useT } from './lib/useT';
import { playCameraShutter, playSuccess, playTick, playWarp } from './lib/sfxUtils';

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
        'ancient_rome',
        'viking_age',
        'gatsby_1920',
        'synthwave_1980',
        'cyberpunk_2077'
    ]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isDownloading, setIsDownloading] = useState<boolean>(false);
    const [appState, setAppState] = useState<'idle' | 'image-uploaded' | 'generating' | 'results-shown'>('idle');
    const dragAreaRef = useRef<HTMLDivElement>(null);
    const isMobile = useMediaQuery('(max-width: 768px)');

    // Navigation & Modals
    const [view, setView] = useState<'intro' | 'app'>('app');
    const [showPricingModal, setShowPricingModal] = useState(false);
    const [showAuthModal, setShowAuthModal] = useState(false);
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
        setAppState('generating');

        const initialImages: Record<string, GeneratedImage> = {};
        selectedEraIds.forEach(id => {
            initialImages[id] = { status: 'pending' };
        });
        setGeneratedImages(initialImages);

        // Process sequentially to protect rate-limits & ensure stability
        const eraQueue = [...selectedEraIds];

        const processEra = async (eraId: string) => {
            try {
                const eraDef = ERAS.find(e => e.id === eraId);
                const eraDisplay = eraDef ? eraDef.yearDisplay : eraId;

                const resultUrl = await generateDecadeImage(uploadedImage, eraId);
                const timestampedUrl = await addTimestampToImage(resultUrl, eraDisplay);

                if (!isPremium) {
                    useCredit(costs.SINGLE_PHOTO);
                }

                playCameraShutter();
                setGeneratedImages(prev => ({
                    ...prev,
                    [eraId]: { status: 'done', url: timestampedUrl },
                }));
            } catch (err) {
                const errorMessage = err instanceof Error ? err.message : t('error.unknown');
                setGeneratedImages(prev => ({
                    ...prev,
                    [eraId]: { status: 'error', error: errorMessage },
                }));
            }
        };

        for (const eraId of eraQueue) {
            await processEra(eraId);
            await new Promise(resolve => setTimeout(resolve, 1200));
        }

        playSuccess();
        setIsLoading(false);
        setAppState('results-shown');
    };

    const handleRegenerateEra = async (eraId: string) => {
        if (!uploadedImage) return;

        if (!isPremium && credits < costs.SINGLE_PHOTO) {
            setShowPricingModal(true);
            return;
        }

        playWarp();
        setGeneratedImages(prev => ({
            ...prev,
            [eraId]: { status: 'pending' },
        }));

        try {
            const eraDef = ERAS.find(e => e.id === eraId);
            const eraDisplay = eraDef ? eraDef.yearDisplay : eraId;

            const resultUrl = await generateDecadeImage(uploadedImage, eraId);
            const timestampedUrl = await addTimestampToImage(resultUrl, eraDisplay);

            if (!isPremium) {
                useCredit(costs.SINGLE_PHOTO);
            }

            playSuccess();
            setGeneratedImages(prev => ({
                ...prev,
                [eraId]: { status: 'done', url: timestampedUrl },
            }));
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : t('error.unknown');
            setGeneratedImages(prev => ({
                ...prev,
                [eraId]: { status: 'error', error: errorMessage },
            }));
        }
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
        selectedEraIds.forEach((eraId, index) => {
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
        setTimeout(() => setIsDownloading(false), selectedEraIds.length * 400 + 500);
    };

    const handleDownloadAlbum = async () => {
        setIsDownloading(true);
        playCameraShutter();
        try {
            const validImages = selectedEraIds
                .map(id => {
                    const era = ERAS.find(e => e.id === id);
                    return {
                        decade: era ? `${era.yearDisplay} ${era.titleTr}` : id,
                        url: generatedImages[id]?.url
                    };
                })
                .filter((img): img is { decade: string; url: string } => !!img.url);

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
            console.error('Albüm oluşturma hatası:', error);
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

    const completedImagesList = selectedEraIds
        .filter(id => generatedImages[id]?.status === 'done' && generatedImages[id]?.url)
        .map(id => ({ eraId: id, url: generatedImages[id]!.url! }));

    if (view === 'intro') {
        return (
            <IntroPage
                onStart={() => { playTick(); setView('app'); }}
                onOpenPricing={() => setShowPricingModal(true)}
                onOpenAuth={() => setShowAuthModal(true)}
            />
        );
    }

    return (
        <div className="relative min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-amber-500 selection:text-black">
            {/* Header */}
            <Header
                onOpenPricing={() => setShowPricingModal(true)}
                onOpenAuth={() => setShowAuthModal(true)}
                onToggleView={() => setView('intro')}
                viewMode="app"
            />

            <main className="flex-grow">
                {/* STATE 1 & 2: Cockpit Mode (Upload & Era Selection) */}
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

                {/* STATE 3 & 4: Generating & Results Showcase */}
                {(appState === 'generating' || appState === 'results-shown') && (
                    <div className="w-full max-w-7xl mx-auto px-4 py-8 flex flex-col items-center space-y-8 animate-in fade-in duration-300">
                        {/* Results Top Action Bar */}
                        <div className="w-full flex flex-wrap items-center justify-between gap-4 bg-slate-900/90 border border-slate-800 p-4 rounded-3xl shadow-xl">
                            <div className="flex items-center gap-3">
                                <button
                                    onClick={handleReset}
                                    className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-300 flex items-center gap-1.5 transition cursor-pointer"
                                >
                                    <span>←</span>
                                    <span>Yeni Zaman Yolculuğu</span>
                                </button>
                                <div className="text-xs text-slate-400 font-mono">
                                    Tamamlanan: <span className="text-amber-400 font-bold">{completedImagesList.length} / {selectedEraIds.length}</span>
                                </div>
                            </div>

                            {/* Batch Actions & Video Morph Trigger */}
                            <div className="flex flex-wrap items-center gap-2.5">
                                {completedImagesList.length > 0 && (
                                    <>
                                        <button
                                            onClick={() => { playTick(); setShowVideoMorphModal(true); }}
                                            className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-black text-xs shadow-md hover:brightness-110 active:scale-95 transition flex items-center gap-1.5 cursor-pointer"
                                        >
                                            <span>🎬</span>
                                            <span>Zaman Tüneli Klip (9:16)</span>
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

                        {/* Polaroid Cards Grid */}
                        <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                            {selectedEraIds.map((eraId) => {
                                const eraDef = ERAS.find(e => e.id === eraId);
                                const caption = eraDef ? `${eraDef.yearDisplay} ${eraDef.titleTr}` : eraId;
                                return (
                                    <div key={eraId} className="flex justify-center w-full">
                                        <PolaroidCard
                                            caption={caption}
                                            status={generatedImages[eraId]?.status || 'pending'}
                                            imageUrl={generatedImages[eraId]?.url}
                                            error={generatedImages[eraId]?.error}
                                            onShake={() => handleRegenerateEra(eraId)}
                                            onDownload={() => handleDownloadIndividualImage(eraId)}
                                            onOpenNewspaper={(cap, url) => {
                                                setNewspaperModalData({
                                                    isOpen: true,
                                                    eraId: eraId,
                                                    imageUrl: url
                                                });
                                            }}
                                            isMobile={isMobile}
                                        />
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}
            </main>

            {/* Footer */}
            <Footer />

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
