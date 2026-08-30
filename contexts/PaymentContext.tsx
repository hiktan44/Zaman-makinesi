/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface CreditCosts {
    SINGLE_PHOTO: number;
    NEWSPAPER_EXPORT: number;
    PASSPORT_EXPORT: number;
    VIDEO_MORPH: number;
}

export const CREDIT_COSTS: CreditCosts = {
    SINGLE_PHOTO: 1,
    NEWSPAPER_EXPORT: 1,
    PASSPORT_EXPORT: 1,
    VIDEO_MORPH: 5,
};

interface PaymentContextType {
    credits: number;
    isPremium: boolean;
    useCredit: (amount?: number) => boolean;
    addCredits: (amount: number) => void;
    setPremium: (value: boolean) => void;
    costs: CreditCosts;
}

const PaymentContext = createContext<PaymentContextType | undefined>(undefined);

const STORAGE_KEY = 'zaman_makinesi_credits';
const PREMIUM_KEY = 'zaman_makinesi_premium';
const INITIAL_FREE_CREDITS = 5; // 5 Ücretsiz Başlangıç Kredisi

export function PaymentProvider({ children }: { children: ReactNode }) {
    const [credits, setCredits] = useState<number>(() => {
        const saved = localStorage.getItem(STORAGE_KEY);
        return saved ? parseInt(saved, 10) : INITIAL_FREE_CREDITS;
    });

    const [isPremium, setIsPremium] = useState<boolean>(() => {
        const saved = localStorage.getItem(PREMIUM_KEY);
        return saved === 'true';
    });

    // Save to localStorage whenever credits change
    useEffect(() => {
        localStorage.setItem(STORAGE_KEY, credits.toString());
    }, [credits]);

    // Save to localStorage whenever premium status changes
    useEffect(() => {
        localStorage.setItem(PREMIUM_KEY, isPremium.toString());
    }, [isPremium]);

    const useCredit = (amount: number = 1): boolean => {
        if (isPremium) {
            return true; // Premium users have unlimited credits
        }

        if (credits >= amount) {
            setCredits(prev => Math.max(0, prev - amount));
            return true;
        }

        return false;
    };

    const addCredits = (amount: number) => {
        setCredits(prev => prev + amount);
    };

    const setPremium = (value: boolean) => {
        setIsPremium(value);
    };

    return (
        <PaymentContext.Provider value={{ credits, isPremium, useCredit, addCredits, setPremium, costs: CREDIT_COSTS }}>
            {children}
        </PaymentContext.Provider>
    );
}

export function usePayment() {
    const context = useContext(PaymentContext);
    if (context === undefined) {
        throw new Error('usePayment must be used within a PaymentProvider');
    }
    return context;
}
