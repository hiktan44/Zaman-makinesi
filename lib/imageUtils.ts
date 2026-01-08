/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * Adds a timestamp watermark to an image
 * @param imageDataUrl The original image data URL
 * @param decade The decade text to add (e.g., "1950s", "1980s")
 * @returns A promise that resolves to a new data URL with the timestamp
 */
export async function addTimestampToImage(imageDataUrl: string, decade: string): Promise<string> {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = 'anonymous';

        img.onload = () => {
            const canvas = document.createElement('canvas');
            canvas.width = img.naturalWidth;
            canvas.height = img.naturalHeight;

            const ctx = canvas.getContext('2d');
            if (!ctx) {
                reject(new Error('Could not get 2D canvas context'));
                return;
            }

            // Draw the original image
            ctx.drawImage(img, 0, 0);

            // Calculate font size based on image dimensions (responsive sizing)
            const baseFontSize = Math.min(canvas.width, canvas.height) * 0.05;
            const fontSize = Math.max(24, Math.min(baseFontSize, 72));

            // Add semi-transparent background for better readability
            const padding = fontSize * 0.5;
            const textMetrics = ctx.measureText(decade);
            const textWidth = textMetrics.width;
            const textHeight = fontSize;

            // Position in bottom-right corner
            const x = canvas.width - textWidth - padding * 2;
            const y = canvas.height - textHeight - padding * 2;

            // Draw background rectangle
            ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
            ctx.fillRect(
                x - padding,
                y - padding,
                textWidth + padding * 2,
                textHeight + padding * 2
            );

            // Draw the decade text
            ctx.font = `bold ${fontSize}px 'Permanent Marker', 'Arial Black', sans-serif`;
            ctx.fillStyle = '#FFD700'; // Gold color
            ctx.textAlign = 'left';
            ctx.textBaseline = 'top';
            ctx.fillText(decade, x, y);

            // Add a subtle shadow for depth
            ctx.shadowColor = 'rgba(0, 0, 0, 0.8)';
            ctx.shadowBlur = 4;
            ctx.shadowOffsetX = 2;
            ctx.shadowOffsetY = 2;
            ctx.fillText(decade, x, y);

            // Convert to data URL
            resolve(canvas.toDataURL('image/jpeg', 0.95));
        };

        img.onerror = () => {
            reject(new Error('Failed to load image for timestamp processing'));
        };

        img.src = imageDataUrl;
    });
}
