/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * TTTT
*/
import React, { useState, ChangeEvent, useRef, useEffect } from 'react';
import { generateDecadeImage } from './services/geminiService';
import PolaroidCard from './components/PolaroidCard';
import { createAlbumPage } from './lib/albumUtils';
import Footer from './components/Footer';
import Header from './components/Header';
import LandingPage, { ALL_DECADES } from './components/LandingPage';
import IntroPage from './components/IntroPage';
import AdminPanel from './components/AdminPanel';
import PricingPage from './components/PricingPage';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import LoginForm from './components/auth/LoginForm';

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

// Inner App Component
function AppContent() {
    const { user, token, isAuthenticated, isLoading: authLoading, login, logout, refreshCredits, isAdmin } = useAuth();
    const [uploadedImage, setUploadedImage] = useState<string | null>(null);
    const [generatedImages, setGeneratedImages] = useState<Record<string, GeneratedImage>>({});
    const [selectedDecades, setSelectedDecades] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isDownloading, setIsDownloading] = useState<boolean>(false);
    const [appState, setAppState] = useState<'idle' | 'image-uploaded' | 'generating' | 'results-shown'>('idle');
    const dragAreaRef = useRef<HTMLDivElement>(null);
    const isMobile = useMediaQuery('(max-width: 768px)');

    const [view, setView] = useState<'intro' | 'app' | 'login' | 'admin' | 'pricing'>('intro');

    // Auth state değiştiğinde yönlendirme
    useEffect(() => {
        if (!authLoading) {
            // URL kontrolü
            const pathname = window.location.pathname;
            
            // Pricing sayfası
            if (pathname === '/pricing') {
                setView('pricing');
                return;
            }
            
            // Admin sayfası
            if (pathname === '/admin') {
                if (isAuthenticated && isAdmin) {
                    setView('admin');
                } else {
                    alert('Bu sayfaya erişim yetkiniz yok');
                    setView('app');
                }
                return;
            }
            
            // Eğer kullanıcı giriş yapmışsa
            if (isAuthenticated && user) {
                // Normal sayfa - eğer intro'daysa app'e geç
                if (view === 'intro') {
                    setView('app');
                }
            } else {
                // Giriş yapmamış - intro'da kalsın
                if (view === 'app' || view === 'admin' || view === 'pricing') {
                    setView('intro');
                }
            }
        }
    }, [isAuthenticated, user, authLoading, isAdmin]);

    // Kredi kullanma API call
    const useCreditAPI = async (description: string, metadata?: any) => {
        if (!user || !token) {
            throw new Error('Giriş yapmanız gerekiyor');
        }

        const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';
        const response = await fetch(`${API_URL}/image/use-credit`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify({
                userId: user.id,
                description,
                metadata,
            }),
        });

        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.error || 'Kredi kullanılamadı');
        }

        await refreshCredits();
        return data;
    };

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

        // Kredi kontrolü
        if (!user || !isAuthenticated) {
            setView('login');
            return;
        }

        const totalImages = selectedDecades.length;
        if (user.credits < totalImages) {
            alert(`Yetersiz kredi! Gereken: ${totalImages}, Mevcut: ${user.credits}. Lütfen kredi satın alın.`);
            return;
        }

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
                // Kredi kullan
                await useCreditAPI(`Görsel üretimi: ${decade}`, { decade });

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

        // Kredi kontrolü
        if (!user || user.credits < 1) {
            alert('Yetersiz kredi! Lütfen kredi satın alın.');
            return;
        }

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
            // Kredi kullan
            await useCreditAPI(`Görsel yeniden üretimi: ${decade}`, { decade });

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

    // Admin Panel
    if (view === 'admin') {
        if (!isAuthenticated || !isAdmin) {
            return (
                <div className="flex items-center justify-center min-h-screen bg-background-light dark:bg-background-dark">
                    <div className="text-center">
                        <p className="text-xl text-text-light dark:text-text-dark mb-4">Yetkisiz erişim</p>
                        <button
                            onClick={() => setView('login')}
                            className="px-6 py-3 bg-primary text-background-dark rounded-lg font-medium hover:bg-yellow-500"
                        >
                            Giriş Yap
                        </button>
                    </div>
                </div>
            );
        }

        return <AdminPanel />;
    }

    // Loading state
    if (authLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-background-light dark:bg-background-dark">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                    <p className="mt-4 text-text-light dark:text-text-dark">Yükleniyor...</p>
                </div>
            </div>
        );
    }

    if (view === 'login') {
        return (
            <div className="min-h-screen bg-background-light dark:bg-background-dark flex items-center justify-center py-12 px-4">
                <div className="max-w-md w-full">
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-primary rounded-full mb-4">
                            <svg className="w-10 h-10 text-background-dark" fill="currentColor" viewBox="0 0 48 48">
                                <path d="M4 42.4379C4 42.4379 14.0962 36.0744 24 41.1692C35.0664 46.8624 44 42.2078 44 42.2078L44 7.01134C44 7.01134 35.068 11.6577 24.0031 5.96913C14.0971 0.876274 4 7.27094 4 7.27094L4 42.4379Z"></path>
                            </svg>
                        </div>
                        <h1 className="text-3xl font-bold text-text-light dark:text-text-dark mb-2">Zaman Makinesi</h1>
                        <p className="text-text-muted-light dark:text-text-muted-dark">Devam etmek için giriş yapın</p>
                    </div>

                    <div className="bg-white dark:bg-surface-dark rounded-xl p-8 shadow-lg border border-stone-200 dark:border-border-dark">
                        <LoginForm 
                            onSuccess={() => setView('app')} 
                            onGoogleClick={() => {
                                const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';
                                window.location.href = `${API_URL}/auth/google`;
                            }} 
                        />
                    </div>

                    <div className="mt-6 text-center">
                        <button
                            onClick={() => setView('intro')}
                            className="text-sm text-text-muted-light dark:text-text-muted-dark hover:text-primary dark:hover:text-primary"
                        >
                            ← Ana sayfaya dön
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    if (view === 'intro') {
        return <IntroPage onStart={() => setView(user ? 'app' : 'login')} />;
    }

    if (view === 'pricing') {
        return <PricingPage />;
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
                                        <div className="w-full max-w-7xl mt-4 p-4">
                                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 pb-20">
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

// Main App with AuthProvider
function App() {
    return (
        <AuthProvider>
            <AppContent />
        </AuthProvider>
    );
}

export default App;
