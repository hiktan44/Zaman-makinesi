/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface PaymentContextType {
    credits: number;
    isPremium: boolean;
    useCredit: () => boolean;
    addCredits: (amount: number) => void;
    setPremium: (value: boolean) => void;
}

const PaymentContext = createContext<PaymentContextType | undefined>(undefined);

const STORAGE_KEY = 'zaman_makinesi_credits';
const PREMIUM_KEY = 'zaman_makinesi_premium';

export function PaymentProvider({ children }: { children: ReactNode }) {
    const [credits, setCredits] = useState<number>(() => {
        const saved = localStorage.getItem(STORAGE_KEY);
        return saved ? parseInt(saved, 10) : 3; // Start with 3 free credits
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

    const useCredit = (): boolean => {
        if (isPremium) {
            return true; // Premium users have unlimited credits
        }

        if (credits > 0) {
            setCredits(prev => prev - 1);
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
        <PaymentContext.Provider value={{ credits, isPremium, useCredit, addCredits, setPremium }}>
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
