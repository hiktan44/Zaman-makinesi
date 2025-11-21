
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

const DECADES = [
    '1860\'lar', '1870\'ler', '1880\'ler', '1890\'lar',
    '1950\'ler', '1960\'lar', '1970\'ler', '1980\'ler', '1990\'lar', '2000\'ler',
    '2030\'lar', '2040\'lar'
];

// Pre-defined positions for a scattered look on desktop (12 positions)
const POSITIONS = [
    { top: '2%', left: '3%', rotate: -6 },
    { top: '5%', left: '28%', rotate: 4 },
    { top: '1%', left: '53%', rotate: -3 },
    { top: '4%', left: '75%', rotate: 5 },
    
    { top: '30%', left: '5%', rotate: 7 },
    { top: '35%', left: '26%', rotate: -5 },
    { top: '32%', left: '55%', rotate: 3 },
    { top: '28%', left: '72%', rotate: -4 },

    { top: '60%', left: '2%', rotate: -2 },
    { top: '65%', left: '30%', rotate: 6 },
    { top: '58%', left: '52%', rotate: -5 },
    { top: '62%', left: '76%', rotate: 3 },
];

const GHOST_POLAROIDS_CONFIG = [
  { initial: { x: "-150%", y: "-100%", rotate: -30 }, transition: { delay: 0.2 } },
  { initial: { x: "150%", y: "-80%", rotate: 25 }, transition: { delay: 0.4 } },
  { initial: { x: "-120%", y: "120%", rotate: 45 }, transition: { delay: 0.6 } },
  { initial: { x: "180%", y: "90%", rotate: -20 }, transition: { delay: 0.8 } },
  { initial: { x: "0%", y: "-200%", rotate: 0 }, transition: { delay: 0.5 } },
  { initial: { x: "100%", y: "150%", rotate: 10 }, transition: { delay: 0.3 } },
];


type ImageStatus = 'pending' | 'done' | 'error';
interface GeneratedImage {
    status: ImageStatus;
    url?: string;
    error?: string;
}

// Enhanced Button Styles
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
    const [selectedDecades, setSelectedDecades] = useState<string[]>(DECADES);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isDownloading, setIsDownloading] = useState<boolean>(false);
    const [appState, setAppState] = useState<'idle' | 'image-uploaded' | 'generating' | 'results-shown'>('idle');
    const dragAreaRef = useRef<HTMLDivElement>(null);
    const isMobile = useMediaQuery('(max-width: 768px)');


    const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const reader = new FileReader();
            reader.onloadend = () => {
                setUploadedImage(reader.result as string);
                setAppState('image-uploaded');
                setGeneratedImages({}); // Clear previous results
                setSelectedDecades(DECADES); // Reset selection to all
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

    const handleSelectAll = () => setSelectedDecades(DECADES);
    const handleDeselectAll = () => setSelectedDecades([]);

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

    return (
        <main className="bg-black text-neutral-200 min-h-screen w-full flex flex-col items-center justify-center p-4 pb-24 overflow-hidden relative">
            <div className="absolute top-0 left-0 w-full h-full bg-grid-white/[0.05]"></div>
            
            <div className="z-10 flex flex-col items-center justify-center w-full h-full flex-1 min-h-0">
                <div className="text-center mb-10">
                    <h1 className="text-6xl md:text-8xl font-caveat font-bold text-neutral-100 drop-shadow-lg">Past Forward</h1>
                    <p className="font-permanent-marker text-neutral-300 mt-2 text-xl tracking-wide drop-shadow-md">Kendinizi farklı on yıllarda yeniden hayal edin.</p>
                </div>

                {appState === 'idle' && (
                     <div className="relative flex flex-col items-center justify-center w-full">
                        {/* Ghost polaroids for intro animation */}
                        {GHOST_POLAROIDS_CONFIG.map((config, index) => (
                             <motion.div
                                key={index}
                                className="absolute w-80 h-[26rem] rounded-md p-4 bg-neutral-100/10 blur-sm"
                                initial={config.initial}
                                animate={{
                                    x: "0%", y: "0%", rotate: (Math.random() - 0.5) * 20,
                                    scale: 0,
                                    opacity: 0,
                                }}
                                transition={{
                                    ...config.transition,
                                    ease: "circOut",
                                    duration: 2,
                                }}
                            />
                        ))}
                        <motion.div
                             initial={{ opacity: 0, scale: 0.8 }}
                             animate={{ opacity: 1, scale: 1 }}
                             transition={{ delay: 2, duration: 0.8, type: 'spring' }}
                             className="flex flex-col items-center"
                        >
                            <label htmlFor="file-upload" className="cursor-pointer group transform hover:scale-105 transition-transform duration-300">
                                 <PolaroidCard 
                                     caption="Başlamak için tıkla"
                                     status="done"
                                 />
                            </label>
                            <input id="file-upload" type="file" className="hidden" accept="image/png, image/jpeg, image/webp" onChange={handleImageUpload} />
                            <p className="mt-8 font-permanent-marker text-neutral-500 text-center max-w-xs text-lg">
                                Fotoğrafınızı yüklemek ve zamanda yolculuğa çıkmak için polaroid'e tıklayın.
                            </p>
                        </motion.div>
                    </div>
                )}

                {appState === 'image-uploaded' && uploadedImage && (
                    <div className="flex flex-col items-center gap-6 w-full max-w-4xl">
                        <div className="flex flex-col md:flex-row items-center gap-8 w-full justify-center">
                            {/* Preview Card */}
                            <div className="flex-shrink-0">
                                <PolaroidCard 
                                    imageUrl={uploadedImage} 
                                    caption="Fotoğrafınız" 
                                    status="done"
                                />
                            </div>
                            
                            {/* Settings Panel */}
                            <div className="flex flex-col gap-4 bg-neutral-900/50 backdrop-blur-sm p-6 rounded-xl border border-neutral-800 w-full max-w-md">
                                <div className="flex justify-between items-center mb-2">
                                    <h3 className="font-permanent-marker text-xl text-yellow-400">Oluşturulacak Yılları Seçin</h3>
                                    <div className="flex gap-2 text-xs">
                                        <button onClick={handleSelectAll} className="text-neutral-400 hover:text-white underline">Tümünü Seç</button>
                                        <button onClick={handleDeselectAll} className="text-neutral-400 hover:text-white underline">Temizle</button>
                                    </div>
                                </div>
                                
                                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                                    {DECADES.map((decade) => (
                                        <button
                                            key={decade}
                                            onClick={() => toggleDecade(decade)}
                                            className={`
                                                px-2 py-2 rounded text-sm font-bold transition-all duration-200 border-2
                                                ${selectedDecades.includes(decade) 
                                                    ? 'bg-yellow-400 text-black border-yellow-400 shadow-[0_0_10px_rgba(250,204,21,0.4)] transform scale-105' 
                                                    : 'bg-transparent text-neutral-500 border-neutral-700 hover:border-neutral-500 hover:text-neutral-300'}
                                            `}
                                        >
                                            {decade}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row items-center gap-6 mt-4">
                            <button onClick={handleReset} className={secondaryButtonClasses}>
                                Farklı Fotoğraf
                            </button>
                            <button 
                                onClick={handleGenerateClick} 
                                className={`${primaryButtonClasses} ${selectedDecades.length === 0 ? 'opacity-50 cursor-not-allowed grayscale' : ''}`}
                                disabled={selectedDecades.length === 0}
                            >
                                {selectedDecades.length === 0 ? 'Yıl Seçiniz' : 'Zaman Yolculuğunu Başlat'}
                            </button>
                        </div>
                    </div>
                )}

                {(appState === 'generating' || appState === 'results-shown') && (
                     <>
                        {isMobile ? (
                            <div className="w-full max-w-5xl flex-1 overflow-y-auto mt-4 p-4">
                                <div className="grid grid-cols-2 gap-3 pb-20">
                                    {DECADES.map((decade) => {
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
                            <div ref={dragAreaRef} className="relative w-full max-w-7xl h-[900px] mt-4">
                                {DECADES.map((decade, index) => {
                                    // Only render if it's in the generatedImages map (i.e. was selected)
                                    if (!generatedImages[decade]) return null;

                                    const { top, left, rotate } = POSITIONS[index] || { top: '0%', left: '0%', rotate: 0 };
                                    
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
                         <div className="h-24 mt-4 flex items-center justify-center z-20 fixed bottom-20 md:static">
                            {appState === 'results-shown' && (
                                <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-6 bg-black/80 sm:bg-black/40 backdrop-blur-md p-3 sm:p-4 rounded-xl border border-white/10 shadow-2xl">
                                    <button 
                                        onClick={handleDownloadAlbum} 
                                        disabled={isDownloading} 
                                        className={`${primaryButtonClasses} disabled:opacity-50 disabled:cursor-not-allowed py-3 px-6 text-base sm:text-lg whitespace-nowrap w-full sm:w-auto`}
                                    >
                                        {isDownloading ? 'Albüm Hazırlanıyor...' : 'Albümü İndir'}
                                    </button>
                                    <button onClick={handleReset} className={`${secondaryButtonClasses} py-3 px-6 text-base sm:text-lg whitespace-nowrap w-full sm:w-auto`}>
                                        Başa Dön
                                    </button>
                                </div>
                            )}
                        </div>
                    </>
                )}
            </div>
            <Footer />
        </main>
    );
}

export default App;
