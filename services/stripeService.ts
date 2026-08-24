/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import { loadStripe, Stripe } from '@stripe/stripe-js';

// Stripe public key - replace with your actual publishable key
const STRIPE_PUBLIC_KEY = import.meta.env.VITE_STRIPE_PUBLIC_KEY || '';

let stripePromise: Promise<Stripe | null> | null = null;

/**
 * Get or initialize Stripe instance
 */
export const getStripe = () => {
    if (!stripePromise) {
        stripePromise = loadStripe(STRIPE_PUBLIC_KEY);
    }
    return stripePromise;
};

/**
 * Create a Stripe Checkout session
 * @param priceId The Stripe Price ID for the product
 * @param successUrl URL to redirect after successful payment
 * @param cancelUrl URL to redirect if payment is cancelled
 */
export async function createCheckoutSession(
    priceId: string,
    successUrl: string,
    cancelUrl: string
): Promise<void> {
    const stripe = await getStripe();

    if (!stripe) {
        throw new Error('Stripe yüklenemedi. Lütfen sayfayı yenileyin.');
    }

    // In a real application, you would call your backend to create a checkout session
    // For now, we'll redirect directly to Stripe Checkout
    // You'll need to implement a backend endpoint for this

    try {
        // This is a placeholder - you need to implement your backend endpoint
        const response = await fetch('/api/create-checkout-session', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                priceId,
                successUrl,
                cancelUrl,
            }),
        });

        const session = await response.json();

        // Redirect to Stripe Checkout
        // @ts-ignore - redirectToCheckout may not be in the type definitions
        const result = await stripe.redirectToCheckout({
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
 * Pricing tiers
 */
export const PRICING_TIERS = {
    FREE: {
        name: 'Ücretsiz Deneme',
        price: 0,
        credits: 3,
        features: [
            '3 görsel oluşturma hakkı',
            'Tüm on yıllar erişimi',
            'Temel özellikler',
        ],
    },
    PREMIUM: {
        name: 'Premium',
        price: 49.99,
        priceId: 'price_premium', // Replace with your actual Stripe Price ID
        credits: -1, // Unlimited
        features: [
            'Sınırsız görsel oluşturma',
            'Tüm on yıllar erişimi',
            'Yüksek çözünürlük',
            'Toplu indirme',
            'Öncelikli destek',
            'Reklamsız deneyim',
        ],
    },
    PAY_AS_YOU_GO: {
        name: 'Kullandıkça Öde',
        price: 9.99,
        priceId: 'price_payg', // Replace with your actual Stripe Price ID
        credits: 10,
        features: [
            '10 görsel oluşturma hakkı',
            'Tüm on yıllar erişimi',
            'Standart özellikler',
            '30 gün geçerlilik',
        ],
    },
};
