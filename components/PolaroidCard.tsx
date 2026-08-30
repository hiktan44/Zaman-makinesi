/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import React, { useState, useEffect, useRef } from 'react';
import { DraggableCardContainer, DraggableCardBody } from './ui/draggable-card';
import { useT } from '../lib/useT';
import { playCameraShutter, playTick } from '../lib/sfxUtils';

type ImageStatus = 'pending' | 'done' | 'error';

interface PolaroidCardProps {
    imageUrl?: string;
    caption: string;
    status: ImageStatus;
    error?: string;
    dragConstraintsRef?: React.RefObject<HTMLElement>;
    onShake?: (caption: string) => void;
    onDownload?: (caption: string) => void;
    onOpenNewspaper?: (caption: string, imageUrl: string) => void;
    isMobile?: boolean;
}

const LoadingSpinner = () => (
    <div className="flex flex-col items-center justify-center h-full gap-3 p-4 text-center">
        <div className="relative w-12 h-12">
            <div className="absolute inset-0 rounded-full border-4 border-amber-500/20 border-t-amber-400 animate-spin" />
            <span className="absolute inset-0 flex items-center justify-center text-lg">⏳</span>
        </div>
        <p className="text-xs font-mono text-amber-400 font-bold animate-pulse">
            Zaman Tüneli İşleniyor...
        </p>
    </div>
);

const ErrorDisplay = ({ onRetry, t, error }: { onRetry?: () => void; t: (key: string) => string; error?: string }) => (
    <div
        className="flex flex-col items-center justify-center h-full text-red-400 gap-2 p-4 text-center cursor-pointer group/error"
        onClick={(e) => {
            e.stopPropagation();
            onRetry?.();
        }}
        title={t('card.retryTitle')}
    >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 group-hover/error:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span className="font-bold text-xs">{error || t('card.retry')}</span>
        <span className="text-[10px] bg-red-950/80 border border-red-800 text-red-300 px-3 py-1 rounded-full mt-1">Tekrar Dene 🔄</span>
    </div>
);

const Placeholder = ({ t }: { t: (key: string) => string }) => (
    <div className="flex flex-col items-center justify-center h-full text-neutral-500 group-hover:text-neutral-300 transition-colors duration-300">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 sm:h-16 sm:w-16 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
        <span className="font-bold text-base text-center">{t('card.upload')}</span>
    </div>
);

const PolaroidCard: React.FC<PolaroidCardProps> = ({
    imageUrl,
    caption,
    status,
    error,
    dragConstraintsRef,
    onShake,
    onDownload,
    onOpenNewspaper,
    isMobile
}) => {
    const { t } = useT();
    const [isDeveloped, setIsDeveloped] = useState(false);
    const [isImageLoaded, setIsImageLoaded] = useState(false);

    const imgRef = useRef<HTMLImageElement>(null);

    useEffect(() => {
        if (status === 'pending') {
            setIsDeveloped(false);
            setIsImageLoaded(false);
        }
        if (status === 'done' && imageUrl) {
            setIsDeveloped(false);
            setIsImageLoaded(false);
        }
    }, [imageUrl, status]);

    useEffect(() => {
        if (imgRef.current && imgRef.current.complete) {
            setIsImageLoaded(true);
        }
    }, [imageUrl]);

    useEffect(() => {
        if (isImageLoaded) {
            const timer = setTimeout(() => {
                setIsDeveloped(true);
            }, 200);
            return () => clearTimeout(timer);
        }
    }, [isImageLoaded]);

    const cardInnerContent = (
        <div className="relative w-full h-full p-3 flex flex-col justify-between">
            {/* Top Toolbar */}
            <div className="relative w-full aspect-square rounded-xl overflow-hidden bg-slate-950 border border-slate-800">
                {status === 'pending' && <LoadingSpinner />}
                {status === 'error' && (
                    <ErrorDisplay onRetry={() => onShake?.(caption)} t={t} error={error} />
                )}
                {status === 'done' && imageUrl && (
                    <>
                        {/* Top floating action buttons */}
                        <div className="absolute top-2 right-2 z-30 flex items-center gap-1.5 bg-black/60 backdrop-blur-md p-1 rounded-full border border-white/20">
                            {onOpenNewspaper && (
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        playTick();
                                        onOpenNewspaper(caption, imageUrl);
                                    }}
                                    className="px-2 py-1 bg-amber-500/80 hover:bg-amber-400 rounded-full text-slate-950 font-black text-[10px] shadow-sm flex items-center gap-1 cursor-pointer transition"
                                    title="Tarihi Gazete & Pasaport Çıkar"
                                >
                                    <span>🗞️</span>
                                    <span>Gazete</span>
                                </button>
                            )}
                            {onDownload && (
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        playCameraShutter();
                                        onDownload(caption);
                                    }}
                                    className="p-1.5 bg-white/20 hover:bg-white/40 rounded-full text-white transition cursor-pointer"
                                    title="Polaroid İndir"
                                >
                                    <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                    </svg>
                                </button>
                            )}
                        </div>

                        {/* Developing vintage chemical overlay */}
                        <div
                            className={`absolute inset-0 z-10 bg-[#2d2218] transition-opacity duration-[3500ms] ease-out pointer-events-none ${
                                isDeveloped ? 'opacity-0' : 'opacity-100'
                            }`}
                        />

                        {/* The Image */}
                        <img
                            ref={imgRef}
                            key={imageUrl}
                            src={imageUrl}
                            alt={caption}
                            onLoad={() => setIsImageLoaded(true)}
                            className={`w-full h-full object-cover transition-all duration-[3000ms] ease-in-out ${
                                isDeveloped ? 'opacity-100 filter-none' : 'opacity-70 filter sepia(1) contrast(0.8)'
                            }`}
                        />

                        {/* Timestamp Overlay */}
                        <div className="absolute bottom-2 right-2 z-20 pointer-events-none bg-black/60 backdrop-blur-sm px-2.5 py-0.5 rounded-md border border-amber-500/30">
                            <p className="font-mono text-amber-400 text-xs font-black tracking-widest">
                                {caption}
                            </p>
                        </div>
                    </>
                )}
                {status === 'done' && !imageUrl && <Placeholder t={t} />}
            </div>

            {/* Bottom Caption Bar */}
            <div className="mt-2 text-center">
                <div className="text-xs font-black text-white truncate px-1">
                    {caption}
                </div>
            </div>
        </div>
    );

    if (isMobile) {
        return (
            <div className="bg-slate-900 !p-0 flex flex-col items-center justify-start aspect-[3/4] w-full rounded-2xl shadow-xl relative overflow-hidden border border-slate-800">
                {cardInnerContent}
            </div>
        );
    }

    return (
        <DraggableCardContainer>
            <DraggableCardBody
                className="bg-slate-900 !p-0 flex flex-col items-center justify-start aspect-[3/4] w-80 max-w-full rounded-2xl overflow-hidden border border-slate-800 shadow-2xl"
                dragConstraintsRef={dragConstraintsRef}
            >
                {cardInnerContent}
            </DraggableCardBody>
        </DraggableCardContainer>
    );
};

export default PolaroidCard;
