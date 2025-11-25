/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React, { useState, ChangeEvent, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { generateDecadeImage } from './services/geminiService';
import PolaroidCard from './components/PolaroidCard';
import { createAlbumPage } from './lib/albumUtils';
import Footer from './components/Footer';
import Header from './components/Header';
import LandingPage, { ALL_DECADES } from './components/LandingPage';
import IntroPage from './components/IntroPage';

// Pre-defined positions for a scattered look on desktop (12 positions)
// We might need more positions if we have more decades now (19 decades)
const POSITIONS = [
    { top: '2%', left: '3%', rotate: -6 },
    { top: '5%', left: '28%', rotate: 4 },
    { top: '1%', left: '53%', rotate: -3 },
    { top: '4%', left: '75%', rotate: 5 },

    { top: '20%', left: '10%', rotate: 2 },
    { top: '15%', left: '35%', rotate: -2 },
    { top: '18%', left: '60%', rotate: 6 },
    { top: '22%', left: '80%', rotate: -4 },

    { top: '35%', left: '5%', rotate: 7 },
    { top: '40%', left: '26%', rotate: -5 },
    { top: '38%', left: '55%', rotate: 3 },
    { top: '36%', left: '72%', rotate: -4 },

    { top: '55%', left: '8%', rotate: -3 },
    { top: '50%', left: '32%', rotate: 5 },
    { top: '52%', left: '58%', rotate: -2 },
    { top: '58%', left: '82%', rotate: 4 },

    { top: '75%', left: '2%', rotate: -2 },
    { top: '70%', left: '30%', rotate: 6 },
    { top: '72%', left: '52%', rotate: -5 },
    { top: '78%', left: '76%', rotate: 3 },
];

type ImageStatus = 'pending' | 'done' | 'error';
interface GeneratedImage {
    status: ImageStatus;
    url?: string;
    error?: string;
}

// Enhanced Button Styles (kept for results screen buttons)
const primaryButtonClasses = "font-permanent-marker text-xl text-center text-black bg-yellow-400 border-2 border-yellow-500 py-4 px-10 rounded-lg transform transition-all duration-300 hover:scale-105 hover:-rotate-1 hover:bg-yellow-300 hover:shadow-[0px_0px_20px_rgba(250,204,21,0.6)] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-1 active:translate-y-1";
const secondaryButtonClasses = "font-permanent-marker text-xl text-center text-white bg-white/5 backdrop-blur-md border-2 border-white/60 py-4 px-10 rounded-lg transform transition-all duration-300 hover:scale-105 hover:rotate-1 hover:bg-white hover:text-black hover:border-white hover:shadow-[0px_0px_15px_rgba(255,255,255,0.4)] shadow-[4px_4px_0px_0px_rgba(255,255,255,0.2)] active:shadow-none active:translate-x-1 active:translate-y-1";

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
    const [uploadedImage, setUploadedImage] = useState<string | null>(null);
    const [generatedImages, setGeneratedImages] = useState<Record<string, GeneratedImage>>({});
    const [selectedDecades, setSelectedDecades] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isDownloading, setIsDownloading] = useState<boolean>(false);
    const [appState, setAppState] = useState<'idle' | 'image-uploaded' | 'generating' | 'results-shown'>('idle');
    const dragAreaRef = useRef<HTMLDivElement>(null);
    const isMobile = useMediaQuery('(max-width: 768px)');


    const [view, setView] = useState<'intro' | 'app'>('intro');

    const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const reader = new FileReader();
            reader.onloadend = () => {
                setUploadedImage(reader.result as string);
                setAppState('image-uploaded');
                setGeneratedImages({}); // Clear previous results
                // setSelectedDecades(ALL_DECADES); // Keep selection or reset? Let's keep it.
            };
            reader.readAsDataURL(file);
        }
    };

    const toggleDecade = (decade: string) => {
        setSelectedDecades(prev =>
            prev.includes(decade)
                ? prev.filter(d => d !== decade)
                : [...prev, decade]
        );
    };

    const handleSelectAll = () => setSelectedDecades(ALL_DECADES);
    const handleClearAll = () => setSelectedDecades([]);

    const handleGenerateClick = async () => {
        if (!uploadedImage || selectedDecades.length === 0) return;

        setIsLoading(true);
        setAppState('generating');

        const initialImages: Record<string, GeneratedImage> = {};
        selectedDecades.forEach(decade => {
            initialImages[decade] = { status: 'pending' };
        });
        setGeneratedImages(initialImages);

        // Reduced concurrency to 1 to avoid 429 RESOURCE_EXHAUSTED errors
        const concurrencyLimit = 1;
        const decadesQueue = [...selectedDecades];

        const processDecade = async (decade: string) => {
            try {
                // Pass the decade string directly. The service handles the English prompt construction.
                const resultUrl = await generateDecadeImage(uploadedImage, decade);
                setGeneratedImages(prev => ({
                    ...prev,
                    [decade]: { status: 'done', url: resultUrl },
                }));
            } catch (err) {
                const errorMessage = err instanceof Error ? err.message : "Bilinmeyen bir hata oluştu.";
                setGeneratedImages(prev => ({
                    ...prev,
                    [decade]: { status: 'error', error: errorMessage },
                }));
                console.error(`Failed to generate image for ${decade}:`, err);
            }
        };

        const workers = Array(concurrencyLimit).fill(null).map(async () => {
            while (decadesQueue.length > 0) {
                const decade = decadesQueue.shift();
                if (decade) {
                    await processDecade(decade);
                    // Add a delay between requests to respect rate limits
                    if (decadesQueue.length > 0) {
                        await new Promise(resolve => setTimeout(resolve, 2000));
                    }
                }
            }
        });

        await Promise.all(workers);

        setIsLoading(false);
        setAppState('results-shown');
    };

    const handleRegenerateDecade = async (decade: string) => {
        if (!uploadedImage) return;

        // Prevent re-triggering if a generation is already in progress
        if (generatedImages[decade]?.status === 'pending') {
            return;
        }

        console.log(`Regenerating image for ${decade}...`);

        // Set the specific decade to 'pending' to show the loading spinner
        setGeneratedImages(prev => ({
            ...prev,
            [decade]: { status: 'pending' },
        }));

        // Call the generation service for the specific decade
        try {
            // Pass the decade string directly
            const resultUrl = await generateDecadeImage(uploadedImage, decade);
            setGeneratedImages(prev => ({
                ...prev,
                [decade]: { status: 'done', url: resultUrl },
            }));
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : "Bilinmeyen bir hata oluştu.";
            setGeneratedImages(prev => ({
                ...prev,
                [decade]: { status: 'error', error: errorMessage },
            }));
            console.error(`Failed to regenerate image for ${decade}:`, err);
        }
    };

    const handleReset = () => {
        setUploadedImage(null);
        setGeneratedImages({});
        setAppState('idle');
    };

    const handleDownloadIndividualImage = (decade: string) => {
        const image = generatedImages[decade];
        if (image?.status === 'done' && image.url) {
            const link = document.createElement('a');
            link.href = image.url;
            // Sanitize filename to remove apostrophes/special chars
            const safeDecade = decade.replace(/[^a-zA-Z0-9]/g, '');
            link.download = `past-forward-${safeDecade}.jpg`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    };

    const handleDownloadAlbum = async () => {
        setIsDownloading(true);
        try {
            // Explicitly type the entries to help TypeScript inference
            const entries = Object.entries(generatedImages) as [string, GeneratedImage][];

            const imageData = entries
                .filter(([, image]) => image.status === 'done' && image.url)
                .reduce((acc, [decade, image]) => {
                    if (image.url) {
                        acc[decade] = image.url;
                    }
                    return acc;
                }, {} as Record<string, string>);

            if (Object.keys(imageData).length === 0) {
                alert("İndirilecek oluşturulmuş resim yok.");
                return;
            }

            // Ask the user if they want to add the credit
            const addCredit = window.confirm("Albüm resimlerinin alt köşesine 'Hikmet Tanrıverdi tarafından oluşturuldu' yazısı eklensin mi?");

            const albumDataUrl = await createAlbumPage(imageData, addCredit);

            const link = document.createElement('a');
            link.href = albumDataUrl;
            link.download = 'past-forward-albumu.jpg';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

        } catch (error) {
            console.error("Failed to create or download album:", error);
            alert("Üzgünüz, albümünüz oluşturulurken bir hata meydana geldi. Lütfen tekrar deneyin.");
        } finally {
            setIsDownloading(false);
        }
    };

    if (view === 'intro') {
        return <IntroPage onStart={() => setView('app')} />;
    }

    return (
        <div className="font-display bg-background-light dark:bg-background-dark min-h-screen flex flex-col">
            <div className="relative flex h-auto min-h-screen w-full flex-col group/design-root overflow-x-hidden">
                <div className="layout-container flex h-full grow flex-col">
                    <div className="px-4 sm:px-8 md:px-16 lg:px-24 xl:px-40 flex flex-1 justify-center py-5">
                        <div className="layout-content-container flex flex-col w-full max-w-6xl flex-1">
                            <Header />

                            {(appState === 'idle' || appState === 'image-uploaded') && (
                                <LandingPage
                                    onImageUpload={handleImageUpload}
                                    uploadedImage={uploadedImage}
                                    selectedDecades={selectedDecades}
                                    onToggleDecade={toggleDecade}
                                    onSelectAll={handleSelectAll}
                                    onClearAll={handleClearAll}
                                    onGenerate={handleGenerateClick}
                                />
                            )}

                            {(appState === 'generating' || appState === 'results-shown') && (
                                <div className="flex-grow py-8 flex flex-col items-center">
                                    {isMobile ? (
                                        <div className="w-full max-w-5xl flex-1 overflow-y-auto mt-4 p-4">
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pb-20">
                                                {ALL_DECADES.map((decade) => {
                                                    if (!generatedImages[decade]) return null;
                                                    return (
                                                        <div key={decade} className="flex justify-center w-full">
                                                            <PolaroidCard
                                                                caption={decade}
                                                                status={generatedImages[decade]?.status || 'pending'}
                                                                imageUrl={generatedImages[decade]?.url}
                                                                error={generatedImages[decade]?.error}
                                                                onShake={handleRegenerateDecade}
                                                                onDownload={handleDownloadIndividualImage}
                                                                isMobile={isMobile}
                                                            />
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    ) : (
                                        <div ref={dragAreaRef} className="relative w-full max-w-7xl h-[900px] mt-4 bg-stone-100 dark:bg-surface-dark/30 rounded-xl border border-stone-200 dark:border-border-dark overflow-hidden">
                                            {ALL_DECADES.map((decade, index) => {
                                                // Only render if it's in the generatedImages map (i.e. was selected)
                                                if (!generatedImages[decade]) return null;

                                                const { top, left, rotate } = POSITIONS[index % POSITIONS.length] || { top: '0%', left: '0%', rotate: 0 };

                                                // Generate a random float duration and delay for organic movement
                                                const floatDuration = 3 + Math.random() * 2; // 3-5 seconds
                                                const floatDelay = Math.random() * 2;

                                                return (
                                                    <motion.div
                                                        key={decade}
                                                        className="absolute cursor-grab active:cursor-grabbing"
                                                        style={{ top, left }}
                                                        initial={{ opacity: 0, scale: 0.5, y: 100, rotate: 0 }}
                                                        animate={{
                                                            opacity: 1,
                                                            scale: 1,
                                                            // Float animation logic:
                                                            // If loading is done, bob up and down. Otherwise sit at 0.
                                                            y: appState === 'results-shown' ? [0, -15, 0] : 0,
                                                            rotate: `${rotate}deg`,
                                                        }}
                                                        transition={{
                                                            // Entrance transition
                                                            opacity: { duration: 0.5 },
                                                            scale: { type: 'spring', stiffness: 100, delay: index * 0.1 },
                                                            // Floating transition (loop)
                                                            y: {
                                                                duration: floatDuration,
                                                                repeat: Infinity,
                                                                ease: "easeInOut",
                                                                delay: floatDelay
                                                            }
                                                        }}
                                                    >
                                                        <PolaroidCard
                                                            dragConstraintsRef={dragAreaRef}
                                                            caption={decade}
                                                            status={generatedImages[decade]?.status || 'pending'}
                                                            imageUrl={generatedImages[decade]?.url}
                                                            error={generatedImages[decade]?.error}
                                                            onShake={handleRegenerateDecade}
                                                            onDownload={handleDownloadIndividualImage}
                                                            isMobile={isMobile}
                                                        />
                                                    </motion.div>
                                                );
                                            })}
                                        </div>
                                    )}
                                    <div className="h-24 mt-8 flex items-center justify-center z-20 w-full px-4 sm:px-0">
                                        {appState === 'results-shown' && (
                                            <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-6 bg-white/80 dark:bg-surface-dark/80 backdrop-blur-md p-3 sm:p-4 rounded-xl border border-stone-200 dark:border-border-dark shadow-2xl w-full sm:w-auto max-w-md sm:max-w-none">
                                                <button
                                                    onClick={handleDownloadAlbum}
                                                    disabled={isDownloading}
                                                    className={`${primaryButtonClasses} disabled:opacity-50 disabled:cursor-not-allowed py-3 px-6 text-base sm:text-lg whitespace-nowrap w-full sm:w-auto`}
                                                >
                                                    {isDownloading ? 'Albüm Hazırlanıyor...' : 'Albümü İndir'}
                                                </button>
                                                <button onClick={handleReset} className={`${secondaryButtonClasses} !text-text-light dark:!text-text-dark !border-stone-300 dark:!border-border-dark !bg-white/50 dark:!bg-surface-dark/50 hover:!bg-stone-100 dark:hover:!bg-surface-dark py-3 px-6 text-base sm:text-lg whitespace-nowrap w-full sm:w-auto`}>
                                                    Başa Dön
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            <Footer />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default App;
