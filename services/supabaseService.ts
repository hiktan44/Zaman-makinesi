/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import { createClient, SupabaseClient, User } from '@supabase/supabase-js';
import { browserAuthConfig } from './auth-config';

const config = browserAuthConfig(import.meta.env);
const UNAVAILABLE = 'Giriş şu anda kullanılamıyor. Lütfen daha sonra tekrar deneyin.';
// Önceki demo kaydı gerçek oturum olarak kullanılmaz; diğer tarayıcı verileri korunur.
try { localStorage.removeItem('zm_local_user'); } catch { /* Depolama kapalı olabilir. */ }

export const supabase: SupabaseClient | null = config ? createClient(config.url, config.key, {
    auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
    }
}) : null;

export const isSupabaseConfigured = !!supabase;

interface EmailAuthResult {
    user: User | null;
    error: Error | null;
    requiresEmailConfirmation?: boolean;
}

/**
 * Sign in with email and password
 */
export async function signInWithEmail(email: string, password: string): Promise<EmailAuthResult> {
    if (!supabase) return { user: null, error: new Error(UNAVAILABLE) };

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
export async function signUpWithEmail(email: string, password: string): Promise<EmailAuthResult> {
    if (!supabase) return { user: null, error: new Error(UNAVAILABLE) };

    const { data, error } = await supabase.auth.signUp({
        email,
        password,
    });

    if (error) {
        return { user: null, error: new Error(translateAuthError(error.message)) };
    }

    return { user: data.user, error: null, requiresEmailConfirmation: !!data.user && !data.session };
}

/**
 * Sign in with Google
 */
export async function signInWithGoogle() {
    if (!supabase) throw new Error(UNAVAILABLE);

    const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
            redirectTo: window.location.origin,
        }
    });

    if (error) {
        throw new Error(translateAuthError(error.message));
    }
}

/**
 * Sign out current user
 */
export async function logOut(): Promise<void> {
    try { localStorage.removeItem('zm_local_user'); } catch { /* Depolama kapalı olabilir. */ }
    if (supabase) {
        await supabase.auth.signOut();
    }
}

/**
 * Translate Supabase error messages to Turkish
 */
function translateAuthError(message: string): string {
    if (message.includes('Invalid login credentials')) {
        return 'E-posta adresi veya şifre hatalı.';
    }
    if (message.includes('User already registered')) {
        return 'Bu e-posta adresi ile zaten bir hesap mevcut.';
    }
    if (message.includes('Password should be at least')) {
        return 'Şifre en az 6 karakter olmalıdır.';
    }
    if (message.includes('rate limit')) {
        return 'Çok fazla istek gönderildi. Lütfen birkaç dakika sonra tekrar deneyin.';
    }
    return 'Giriş işlemi tamamlanamadı. Lütfen tekrar deneyin.';
}
