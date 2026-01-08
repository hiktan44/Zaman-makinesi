/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import { createClient, User } from '@supabase/supabase-js';

// Supabase configuration
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Initialize Supabase
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

/**
 * Sign in with email and password
 */
export async function signInWithEmail(email: string, password: string): Promise<{ user: User | null; error: Error | null }> {
    const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
    });

    if (error) {
        return { user: null, error: new Error(translateAuthError(error.message)) };
    }

    return { user: data.user, error: null };
}

/**
 * Create new account with email and password
 */
export async function signUpWithEmail(email: string, password: string): Promise<{ user: User | null; error: Error | null }> {
    const { data, error } = await supabase.auth.signUp({
        email,
        password,
    });

    if (error) {
        return { user: null, error: new Error(translateAuthError(error.message)) };
    }

    return { user: data.user, error: null };
}

/**
 * Sign in with Google
 * Note: Requires Google Provider to be enabled in Supabase Dashboard
 * and valid redirect URL configuration.
 */
export async function signInWithGoogle() {
    const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
            redirectTo: window.location.origin, // Redirect back to the app after login
        }
    });

    if (error) {
        throw new Error(translateAuthError(error.message));
    }

    return data;
}

/**
 * Sign out current user
 */
export async function logOut(): Promise<void> {
    const { error } = await supabase.auth.signOut();
    if (error) {
        throw new Error('Çıkış yapılırken bir hata oluştu.');
    }
}

/**
 * Get current session
 */
export async function getSession() {
    const { data, error } = await supabase.auth.getSession();
    return { session: data.session, error };
}

/**
 * Translate Supabase auth errors to Turkish
 */
function translateAuthError(message: string): string {
    if (message.includes('Invalid login credentials')) return 'Hatalı e-posta veya şifre.';
    if (message.includes('User already registered')) return 'Bu e-posta adresi zaten kayıtlı.';
    if (message.includes('Email not confirmed')) return 'Lütfen e-posta adresinizi doğrulayın.';
    if (message.includes('Password should be')) return 'Şifre en az 6 karakter olmalı.';
    if (message.includes('Database error')) return 'Veritabanı hatası oluştu.';

    return 'Bir hata oluştu: ' + message;
}
