/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * Intelligent client-side historical image processing engine.
 * Provides instant, high-quality period photographic transformations
 * as a robust fallback whenever remote AI endpoints are unavailable or quota-limited.
 */
export async function applyEraCanvasFilter(sourceDataUrl: string, eraId: string): Promise<string> {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.onload = () => {
            try {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                if (!ctx) {
                    resolve(sourceDataUrl);
                    return;
                }

                // Standard high-res square/portrait canvas
                const maxDim = 1024;
                let width = img.width;
                let height = img.height;

                if (width > height) {
                    if (width > maxDim) {
                        height = Math.round((height * maxDim) / width);
                        width = maxDim;
                    }
                } else {
                    if (height > maxDim) {
                        width = Math.round((width * maxDim) / height);
                        height = maxDim;
                    }
                }

                canvas.width = width;
                canvas.height = height;

                // 1. Draw base image
                ctx.drawImage(img, 0, 0, width, height);

                // 2. Get pixel data
                const imageData = ctx.getImageData(0, 0, width, height);
                const data = imageData.data;

                // 3. Apply era-specific color curves and matrix grading
                for (let i = 0; i < data.length; i += 4) {
                    let r = data[i];
                    let g = data[i + 1];
                    let b = data[i + 2];

                    const gray = 0.299 * r + 0.587 * g + 0.114 * b;

                    if (eraId.includes('1860') || eraId.includes('1870') || eraId.includes('daguerreotype')) {
                        // Daguerreotype / 1860s Sepia Plate
                        r = Math.min(255, gray * 1.05 + 35);
                        g = Math.min(255, gray * 0.9 + 15);
                        b = Math.min(255, gray * 0.7);
                    } else if (eraId.includes('1880') || eraId.includes('west')) {
                        // Wild West Tintype / Copper tone
                        r = Math.min(255, gray * 1.15 + 25);
                        g = Math.min(255, gray * 0.95 + 10);
                        b = Math.min(255, gray * 0.65);
                    } else if (eraId.includes('1920') || eraId.includes('gatsby')) {
                        // 1920s Art Deco Platinum Glamour
                        r = Math.min(255, gray * 1.08 + 20);
                        g = Math.min(255, gray * 1.02 + 15);
                        b = Math.min(255, gray * 0.85);
                    } else if (eraId.includes('1940') || eraId.includes('noir')) {
                        // 1940s High-Contrast Film Noir B&W
                        const contrastGray = Math.max(0, Math.min(255, (gray - 128) * 1.35 + 128));
                        r = contrastGray;
                        g = contrastGray;
                        b = contrastGray + 5;
                    } else if (eraId.includes('1950') || eraId.includes('rockabilly')) {
                        // 1950s Kodachrome vibrant saturation
                        r = Math.min(255, r * 1.15 + 10);
                        g = Math.min(255, g * 0.95 + 5);
                        b = Math.min(255, b * 0.85);
                    } else if (eraId.includes('1970') || eraId.includes('disco')) {
                        // 1970s Warm Polaroid Fade
                        r = Math.min(255, r * 1.1 + 25);
                        g = Math.min(255, g * 1.0 + 10);
                        b = Math.min(255, b * 0.8);
                    } else if (eraId.includes('1980') || eraId.includes('synthwave')) {
                        // 1980s Neon Magenta & Cyan boost
                        r = Math.min(255, r * 1.25 + 20);
                        g = Math.min(255, g * 0.85);
                        b = Math.min(255, b * 1.35 + 30);
                    } else if (eraId.includes('1990') || eraId.includes('grunge')) {
                        // 1990s Disposable Camera Green/Yellow tint
                        r = Math.min(255, r * 1.05 + 10);
                        g = Math.min(255, g * 1.1 + 15);
                        b = Math.min(255, b * 0.95);
                    } else if (eraId.includes('2000') || eraId.includes('y2k')) {
                        // 2000s Y2K Silver Blue Gloss
                        r = Math.min(255, r * 0.95);
                        g = Math.min(255, g * 1.05 + 10);
                        b = Math.min(255, b * 1.25 + 25);
                    } else if (eraId.includes('cyberpunk') || eraId.includes('2077')) {
                        // Cyberpunk Neon Glow & Deep Shadows
                        r = Math.min(255, r * 1.3 + (b > 120 ? 30 : 0));
                        g = Math.min(255, g * 0.7);
                        b = Math.min(255, b * 1.4 + 20);
                    } else if (eraId.includes('ottoman') || eraId.includes('sultan')) {
                        // Ottoman Royal Emerald & Gold Glaze
                        r = Math.min(255, r * 1.15 + 20);
                        g = Math.min(255, g * 1.1 + 15);
                        b = Math.min(255, b * 0.8);
                    } else if (eraId.includes('egypt')) {
                        // Ancient Egypt Warm Golden Sandstone
                        r = Math.min(255, gray * 1.2 + 40);
                        g = Math.min(255, gray * 1.0 + 20);
                        b = Math.min(255, gray * 0.65);
                    } else if (eraId.includes('viking')) {
                        // Viking Cold Nordic Slate Desaturation
                        r = Math.min(255, gray * 0.85 + 10);
                        g = Math.min(255, gray * 0.95 + 15);
                        b = Math.min(255, gray * 1.15 + 30);
                    }

                    // Add slight natural photographic film grain
                    const grain = (Math.random() - 0.5) * 12;
                    data[i] = Math.max(0, Math.min(255, r + grain));
                    data[i + 1] = Math.max(0, Math.min(255, g + grain));
                    data[i + 2] = Math.max(0, Math.min(255, b + grain));
                }

                ctx.putImageData(imageData, 0, 0);

                // 4. Draw atmospheric vignette & radial lighting
                const gradient = ctx.createRadialGradient(
                    width / 2,
                    height / 2,
                    width * 0.35,
                    width / 2,
                    height / 2,
                    width * 0.75
                );
                gradient.addColorStop(0, 'rgba(0,0,0,0)');
                gradient.addColorStop(1, 'rgba(0,0,0,0.55)');

                ctx.fillStyle = gradient;
                ctx.fillRect(0, 0, width, height);

                // 5. If Cyberpunk or Synthwave, add subtle scanlines
                if (eraId.includes('cyberpunk') || eraId.includes('1980')) {
                    ctx.fillStyle = 'rgba(0, 255, 255, 0.04)';
                    for (let y = 0; y < height; y += 4) {
                        ctx.fillRect(0, y, width, 1);
                    }
                }

                resolve(canvas.toDataURL('image/jpeg', 0.92));
            } catch (err) {
                console.error('Canvas filter error:', err);
                resolve(sourceDataUrl);
            }
        };
        img.onerror = () => resolve(sourceDataUrl);
        img.src = sourceDataUrl;
    });
}
