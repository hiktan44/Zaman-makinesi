/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import { initializeApp } from 'firebase/app';
import {
    getAuth,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signInWithPopup,
    GoogleAuthProvider,
    signOut,
    onAuthStateChanged,
    User
} from 'firebase/auth';

// Firebase configuration - replace with your actual config
const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

// Google Provider
const googleProvider = new GoogleAuthProvider();

/**
 * Sign in with email and password
 */
export async function signInWithEmail(email: string, password: string): Promise<User> {
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        return userCredential.user;
    } catch (error: any) {
        throw new Error(getAuthErrorMessage(error.code));
    }
}

/**
 * Create new account with email and password
 */
export async function signUpWithEmail(email: string, password: string): Promise<User> {
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        return userCredential.user;
    } catch (error: any) {
        throw new Error(getAuthErrorMessage(error.code));
    }
}

/**
 * Sign in with Google
 */
export async function signInWithGoogle(): Promise<User> {
    try {
        const result = await signInWithPopup(auth, googleProvider);
        return result.user;
    } catch (error: any) {
        throw new Error(getAuthErrorMessage(error.code));
    }
}

/**
 * Sign out current user
 */
export async function logOut(): Promise<void> {
    try {
        await signOut(auth);
    } catch (error: any) {
        throw new Error('Çıkış yapılırken bir hata oluştu.');
    }
}

/**
 * Listen to auth state changes
 */
export function onAuthChange(callback: (user: User | null) => void) {
    return onAuthStateChanged(auth, callback);
}

/**
 * Get user-friendly error messages
 */
function getAuthErrorMessage(errorCode: string): string {
    switch (errorCode) {
        case 'auth/email-already-in-use':
            return 'Bu e-posta adresi zaten kullanımda.';
        case 'auth/invalid-email':
            return 'Geçersiz e-posta adresi.';
        case 'auth/operation-not-allowed':
            return 'Bu işlem şu anda kullanılamıyor.';
        case 'auth/weak-password':
            return 'Şifre çok zayıf. En az 6 karakter olmalı.';
        case 'auth/user-disabled':
            return 'Bu hesap devre dışı bırakılmış.';
        case 'auth/user-not-found':
            return 'Bu e-posta adresiyle kayıtlı kullanıcı bulunamadı.';
        case 'auth/wrong-password':
            return 'Hatalı şifre.';
        case 'auth/popup-closed-by-user':
            return 'Giriş penceresi kapatıldı.';
        case 'auth/cancelled-popup-request':
            return 'Giriş işlemi iptal edildi.';
        default:
            return 'Bir hata oluştu. Lütfen tekrar deneyin.';
    }
}
