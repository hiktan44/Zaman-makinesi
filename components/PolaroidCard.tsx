
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React, { useState, useEffect, useRef } from 'react';
import { DraggableCardContainer, DraggableCardBody } from './ui/draggable-card';
import { cn } from '../lib/utils';
import type { PanInfo } from 'framer-motion';
import { useT } from '../lib/useT';

type ImageStatus = 'pending' | 'done' | 'error';

interface PolaroidCardProps {
    imageUrl?: string;
    caption: string;
    status: ImageStatus;
    error?: string;
    dragConstraintsRef?: React.RefObject<HTMLElement>;
    onShake?: (caption: string) => void;
    onDownload?: (caption: string) => void;
    isMobile?: boolean;
}

const LoadingSpinner = () => (
    <div className="flex items-center justify-center h-full">
        <svg className="animate-spin h-6 w-6 sm:h-8 sm:w-8 text-neutral-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
    </div>
);

const ErrorDisplay = ({ onRetry, t }: { onRetry?: () => void; t: (key: string) => string }) => (
    <div
        className="flex flex-col items-center justify-center h-full text-red-400 gap-1 sm:gap-2 cursor-pointer group/error"
        onClick={(e) => {
            e.stopPropagation();
            onRetry?.();
        }}
        title={t('card.retryTitle')}
    >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 sm:h-10 sm:w-10 group-hover/error:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span className="font-permanent-marker text-xs sm:text-sm text-center opacity-75 group-hover/error:opacity-100">{t('card.retry')}</span>
    </div>
);

const Placeholder = ({ t }: { t: (key: string) => string }) => (
    <div className="flex flex-col items-center justify-center h-full text-neutral-500 group-hover:text-neutral-300 transition-colors duration-300">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 sm:h-16 sm:w-16 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
        <span className="font-permanent-marker text-lg sm:text-xl text-center">{t('card.upload')}</span>
    </div>
);


const PolaroidCard: React.FC<PolaroidCardProps> = ({ imageUrl, caption, status, error, dragConstraintsRef, onShake, onDownload, isMobile }) => {
    const { t } = useT();
    const [isDeveloped, setIsDeveloped] = useState(false);
    const [isImageLoaded, setIsImageLoaded] = useState(false);
    const lastShakeTime = useRef(0);
    const lastVelocity = useRef({ x: 0, y: 0 });

    const imgRef = useRef<HTMLImageElement>(null);

    // Reset states when the image URL changes or status goes to pending.
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

    // Check if image is already loaded (e.g. from cache)
    useEffect(() => {
        if (imgRef.current && imgRef.current.complete) {
            setIsImageLoaded(true);
        }
    }, [imageUrl]);

    // When the image is loaded, start the developing animation.
    useEffect(() => {
        if (isImageLoaded) {
            const timer = setTimeout(() => {
                setIsDeveloped(true);
            }, 200); // Short delay before animation starts
            return () => clearTimeout(timer);
        }
    }, [isImageLoaded]);

    const handleDragStart = () => {
        // Reset velocity on new drag to prevent false triggers from old data
        lastVelocity.current = { x: 0, y: 0 };
    };

    const handleDrag = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
        if (!onShake || isMobile) return;

        const velocityThreshold = 1500; // Require a high velocity to be considered a "shake".
        const shakeCooldown = 2000; // 2 seconds cooldown to prevent spamming.

        const { x, y } = info.velocity;
        const { x: prevX, y: prevY } = lastVelocity.current;
        const now = Date.now();

        // A true "shake" is a rapid movement AND a sharp change in direction.
        // We detect this by checking if the velocity is high and if its direction
        // has reversed from the last frame (i.e., the dot product is negative).
        const magnitude = Math.sqrt(x * x + y * y);
        const dotProduct = (x * prevX) + (y * prevY);

        if (magnitude > velocityThreshold && dotProduct < 0 && (now - lastShakeTime.current > shakeCooldown)) {
            lastShakeTime.current = now;
            onShake(caption);
        }

        lastVelocity.current = { x, y };
    };

    const handleRetry = () => {
        if (onShake) {
            onShake(caption);
        }
    };

    const cardInnerContent = (
        <>
            <div className="w-full h-full bg-neutral-900 shadow-inner flex-grow relative overflow-hidden group">
                {status === 'pending' && <LoadingSpinner />}
                {status === 'error' && <ErrorDisplay onRetry={handleRetry} t={t} />}
                {status === 'done' && imageUrl && (
                    <>
                        <div className={cn(
                            "absolute top-2 right-2 z-20 flex flex-col gap-2 transition-opacity duration-300",
                            !isMobile && "opacity-0 group-hover:opacity-100",
                        )}>
                            {onDownload && (
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation(); // Prevent drag from starting on click
                                        onDownload(caption);
                                    }}
                                    className="p-1.5 sm:p-2 bg-black/50 rounded-full text-white hover:bg-black/75 focus:outline-none focus:ring-2 focus:ring-white"
                                    aria-label={t('card.download', { caption })}
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                    </svg>
                                </button>
                            )}
                            {isMobile && onShake && (
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onShake(caption);
                                    }}
                                    className="p-1.5 sm:p-2 bg-black/50 rounded-full text-white hover:bg-black/75 focus:outline-none focus:ring-2 focus:ring-white"
                                    aria-label={t('card.refresh', { caption })}
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.899 2.186l-1.42.71a5.002 5.002 0 00-8.479-1.554H10a1 1 0 110 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm12 14a1 1 0 01-1-1v-2.101a7.002 7.002 0 01-11.899-2.186l1.42-.71a5.002 5.002 0 008.479 1.554H10a1 1 0 110-2h6a1 1 0 011 1v6a1 1 0 01-1 1z" clipRule="evenodd" />
                                    </svg>
                                </button>
                            )}
                        </div>


                        {/* The developing chemical overlay - fades out */}
                        <div
                            className={`absolute inset-0 z-10 bg-[#3a322c] transition-opacity duration-[3500ms] ease-out ${isDeveloped ? 'opacity-0' : 'opacity-100'
                                }`}
                            aria-hidden="true"
                        />

                        {/* The Image - fades in and color corrects */}
                        <img
                            ref={imgRef}
                            key={imageUrl}
                            src={imageUrl}
                            alt={caption}
                            onLoad={() => setIsImageLoaded(true)}
                            className={`w-full h-full object-cover transition-all duration-[4000ms] ease-in-out ${isDeveloped
                                ? 'opacity-100 filter-none'
                                : 'opacity-80 filter sepia(1) contrast(0.8) brightness(0.8)'
                                }`}
                        />

                        {/* Timestamp Overlay */}
                        <div className="absolute bottom-4 right-4 z-20 pointer-events-none">
                            <p className="font-mono text-[#ff9900] text-xl sm:text-2xl font-bold tracking-widest drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)] opacity-90" style={{ fontFamily: "'Courier New', Courier, monospace" }}>
                                {caption}
                            </p>
                        </div>
                    </>
                )}
                {status === 'done' && !imageUrl && <Placeholder t={t} />}
            </div>
        </>
    );

    if (isMobile) {
        return (
            <div className="bg-neutral-900 dark:bg-neutral-900 !p-0 flex flex-col items-center justify-start aspect-[3/4] w-full rounded-xl shadow-lg relative overflow-hidden border border-neutral-800">
                {cardInnerContent}
            </div>
        );
    }

    return (
        <DraggableCardContainer>
            <DraggableCardBody
                className="bg-neutral-900 dark:bg-neutral-900 !p-0 flex flex-col items-center justify-start aspect-[3/4] w-80 max-w-full rounded-xl overflow-hidden border border-neutral-800"
                dragConstraintsRef={dragConstraintsRef}
                onDragStart={handleDragStart}
                onDrag={handleDrag}
            >
                {cardInnerContent}
            </DraggableCardBody>
        </DraggableCardContainer>
    );
};

export default PolaroidCard;
