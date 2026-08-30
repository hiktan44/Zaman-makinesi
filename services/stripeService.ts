/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import { loadStripe, Stripe } from '@stripe/stripe-js';

const STRIPE_PUBLIC_KEY = import.meta.env.VITE_STRIPE_PUBLIC_KEY || '';

let stripePromise: Promise<Stripe | null> | null = null;

export const getStripe = () => {
    if (!stripePromise) {
        stripePromise = loadStripe(STRIPE_PUBLIC_KEY);
    }
    return stripePromise;
};

export async function createCheckoutSession(
    priceId: string,
    successUrl: string,
    cancelUrl: string
): Promise<void> {
    const stripe = await getStripe();

    if (!stripe) {
        throw new Error('Stripe yüklenemedi. Lütfen sayfayı yenileyin.');
    }

    try {
        const response = await fetch('/api/create-checkout-session', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ priceId, successUrl, cancelUrl }),
        });

        const session = await response.json();
        const result = await (stripe as any).redirectToCheckout({
            sessionId: session.id,
        });

        if (result.error) {
            throw new Error(result.error.message);
        }
    } catch (error) {
        console.error('Stripe checkout error:', error);
        throw error;
    }
}

/**
 * Modern Tiered Credit Packages
 */
export const PRICING_PACKAGES = [
    {
        id: 'capsule_25',
        name: 'Zaman Kapsülü',
        price: '49 ₺',
        priceUsd: '$1.49',
        credits: 25,
        badge: 'Başlangıç',
        isPopular: false,
        features: [
            '25 Adet Zaman Yolculuğu Görseli',
            'Tüm Tarihi & Gelecek Çağlar Açık',
            'Tarihi Gazete & Pasaport Oluşturma',
            'Yüksek Çözünürlüklü Polaroid İndirme',
            'Süre sınırı yok (Krediler yanmaz)'
        ]
    },
    {
        id: 'traveler_75',
        name: 'Zaman Gezgini',
        price: '99 ₺',
        priceUsd: '$2.99',
        credits: 75,
        badge: 'En Popüler 🔥',
        isPopular: true,
        features: [
            '75 Adet Zaman Yolculuğu Görseli',
            '15 Video Morph / Timelapse Klip Hakkı',
            'Öncelikli Ultra Hızlı AI Motoru',
            'Tarihi Gazete & Pasaport PDF/PNG Çıktısı',
            'Ticari Kullanım İzni',
            'Süre sınırı yok (Krediler yanmaz)'
        ]
    },
    {
        id: 'timelord_250',
        name: 'Zaman Lordu',
        price: '199 ₺',
        priceUsd: '$5.99',
        credits: 250,
        badge: 'En Avantajlı ⚡',
        isPopular: false,
        features: [
            '250 Adet Zaman Yolculuğu Görseli',
            '50 Video Morph / Timelapse Klip Hakkı',
            '4K Ultra HD Upscaling Desteği',
            'Toplu İndirme & Özel Albüm PDF',
            'Sınırsız Tarihi Gazete & Pasaport',
            '7/24 VIP Destek'
        ]
    }
];

export const PRICING_TIERS = {
    FREE: {
        name: 'Ücretsiz Deneme',
        price: 0,
        credits: 5,
        features: [
            '5 Ücretsiz Görsel Oluşturma',
            'Tüm Çağlara Erişim',
            'Standart Kalite',
        ],
    },
    PREMIUM: {
        name: 'Zaman Gezgini',
        price: 99,
        priceId: 'price_traveler_75',
        credits: 75,
        features: [
            '75 Görsel + Video Morph',
            'Öncelikli Render',
            'Tarihi Gazete & Pasaport'
        ],
    }
};
