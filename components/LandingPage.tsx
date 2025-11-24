import React, { ChangeEvent, useRef } from 'react';

interface LandingPageProps {
    onImageUpload: (e: ChangeEvent<HTMLInputElement>) => void;
    uploadedImage: string | null;
    selectedDecades: string[];
    onToggleDecade: (decade: string) => void;
    onSelectAll: () => void;
    onGenerate: () => void;
}

export const ALL_DECADES = [
    "1860s", "1870s", "1880s", "1890s", "1900s", "1910s", "1920s", "1930s",
    "1940s", "1950s", "1960s", "1970s", "1980s", "1990s", "2000s", "2010s",
    "2020s", "2030s", "2040s"
];

const LandingPage: React.FC<LandingPageProps> = ({
    onImageUpload,
    uploadedImage,
    selectedDecades,
    onToggleDecade,
    onSelectAll,
    onGenerate
}) => {
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            // Create a fake event to reuse the handler
            const fakeEvent = {
                target: { files: e.dataTransfer.files }
            } as unknown as ChangeEvent<HTMLInputElement>;
            onImageUpload(fakeEvent);
        }
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
    };

    return (
        <main className="flex-grow py-8 md:py-16">
            <div className="px-4 sm:px-6 md:px-10">
                <div className="flex flex-wrap justify-between gap-3 mb-8">
                    <div className="flex flex-col gap-3">
                        <p className="text-4xl font-black leading-tight tracking-[-0.033em] text-text-light dark:text-text-dark">Zamanda Yolculuk</p>
                        <p className="text-base font-normal leading-normal text-text-muted-light dark:text-text-muted-dark">1. Fotoğraf Yükle → 2. Yılları Seç → 3. Yolculuğa Başla.</p>
                    </div>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12">
                    <div className="flex flex-col p-4 bg-white dark:bg-surface-dark border border-stone-200 dark:border-border-dark rounded-xl">
                        <div
                            className="flex flex-col items-center justify-center gap-6 rounded-lg border-2 border-dashed border-stone-300 dark:border-dashed-border-dark px-6 py-14 h-full transition-colors hover:bg-stone-50 dark:hover:bg-surface-dark/50"
                            onDrop={handleDrop}
                            onDragOver={handleDragOver}
                        >
                            <div className="flex max-w-[480px] flex-col items-center gap-2">
                                {uploadedImage ? (
                                    <img src={uploadedImage} alt="Uploaded" className="max-h-64 object-contain rounded-lg shadow-md" />
                                ) : (
                                    <>
                                        <p className="text-lg font-bold leading-tight tracking-[-0.015em] text-center text-text-light dark:text-text-dark">Fotoğrafını Buraya Sürükle ve Bırak</p>
                                        <p className="text-sm font-normal leading-normal text-center text-text-muted-light dark:text-text-muted-dark">veya dosya seç. Kabul edilenler: JPG, PNG, maks 5MB.</p>
                                    </>
                                )}
                            </div>
                            <input
                                type="file"
                                ref={fileInputRef}
                                className="hidden"
                                accept="image/png, image/jpeg, image/webp"
                                onChange={onImageUpload}
                            />
                            <button
                                onClick={() => fileInputRef.current?.click()}
                                className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-stone-200 dark:bg-border-dark text-sm font-bold leading-normal tracking-[0.015em] text-text-light dark:text-text-dark hover:bg-stone-300 dark:hover:bg-dashed-border-dark transition-colors"
                            >
                                <span className="truncate">{uploadedImage ? 'Fotoğrafı Değiştir' : 'Fotoğraf Yükle'}</span>
                            </button>
                        </div>
                    </div>
                    <div className="flex flex-col space-y-6">
                        <div className="flex flex-col p-4 bg-white dark:bg-surface-dark border border-stone-200 dark:border-border-dark rounded-xl flex-grow">
                            <div className="flex justify-between items-center px-4 pt-5 pb-3">
                                <h2 className="text-text-light dark:text-text-dark text-[22px] font-bold leading-tight tracking-[-0.015em]">Gideceğin Yılları Seç</h2>
                                <button onClick={onSelectAll} className="text-sm font-medium text-primary hover:underline">Tümünü Seç</button>
                            </div>
                            <div className="px-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-x-4 gap-y-1">
                                {ALL_DECADES.map((decade) => (
                                    <label key={decade} className="flex gap-x-3 py-3 flex-row cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={selectedDecades.includes(decade)}
                                            onChange={() => onToggleDecade(decade)}
                                            className="h-5 w-5 rounded border-stone-300 dark:border-dashed-border-dark border-2 bg-transparent text-primary checked:bg-primary checked:border-primary checked:bg-[image:--checkbox-tick-svg] focus:ring-0 focus:ring-offset-0 focus:border-dashed-border-dark focus:outline-none"
                                        />
                                        <p className="text-text-light dark:text-text-dark text-base font-normal leading-normal">{decade}</p>
                                    </label>
                                ))}
                            </div>
                        </div>
                        <button
                            onClick={onGenerate}
                            disabled={!uploadedImage || selectedDecades.length === 0}
                            className={`flex w-full cursor-pointer items-center justify-center overflow-hidden rounded-xl h-12 px-6 bg-primary text-background-dark text-base font-bold leading-normal tracking-[0.015em] hover:bg-yellow-500 transition-colors ${(!uploadedImage || selectedDecades.length === 0) ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                            <span className="truncate">Zaman Yolculuğunu Başlat</span>
                        </button>
                    </div>
                </div>
            </div>
        </main>
    );
};

export default LandingPage;
