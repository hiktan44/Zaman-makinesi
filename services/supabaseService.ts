/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import { createClient, SupabaseClient, User } from '@supabase/supabase-js';

// Supabase configuration
const rawUrl = import.meta.env.VITE_SUPABASE_URL?.trim();
const rawKey = import.meta.env.VITE_SUPABASE_ANON_KEY?.trim();

const isValidSupabase = !!rawUrl && rawUrl.startsWith('http') && !!rawKey;

const supabaseUrl = isValidSupabase ? rawUrl : 'https://placeholder-zaman-makinesi.supabase.co';
const supabaseAnonKey = isValidSupabase ? rawKey : 'placeholder-anon-key';

// Safely initialize Supabase without throwing errors
export const supabase: SupabaseClient = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
    }
});

export const isSupabaseConfigured = isValidSupabase;

/**
 * Sign in with email and password
 */
export async function signInWithEmail(email: string, password: string): Promise<{ user: User | null; error: Error | null }> {
    if (!isValidSupabase) {
        // Fallback local mock authentication
        const mockUser = {
            id: 'mock_user_' + Date.now().toString(36),
            email: email,
            app_metadata: {},
            user_metadata: { name: email.split('@')[0] },
            aud: 'authenticated',
            created_at: new Date().toISOString(),
        } as unknown as User;
        localStorage.setItem('zm_local_user', JSON.stringify(mockUser));
        window.dispatchEvent(new CustomEvent('zm_auth_changed', { detail: mockUser }));
        return { user: mockUser, error: null };
    }

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
    if (!isValidSupabase) {
        const mockUser = {
            id: 'mock_user_' + Date.now().toString(36),
            email: email,
            app_metadata: {},
            user_metadata: { name: email.split('@')[0] },
            aud: 'authenticated',
            created_at: new Date().toISOString(),
        } as unknown as User;
        localStorage.setItem('zm_local_user', JSON.stringify(mockUser));
        window.dispatchEvent(new CustomEvent('zm_auth_changed', { detail: mockUser }));
        return { user: mockUser, error: null };
    }

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
 */
export async function signInWithGoogle() {
    if (!isValidSupabase) {
        const mockUser = {
            id: 'google_user_hikmet',
            email: 'hikmet044@gmail.com',
            app_metadata: { provider: 'google' },
            user_metadata: { name: 'Hikmet (Admin)', full_name: 'Hikmet', avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100' },
            aud: 'authenticated',
            created_at: new Date().toISOString(),
        } as unknown as User;
        localStorage.setItem('zm_local_user', JSON.stringify(mockUser));
        window.dispatchEvent(new CustomEvent('zm_auth_changed', { detail: mockUser }));
        return;
    }

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
    localStorage.removeItem('zm_local_user');
    window.dispatchEvent(new CustomEvent('zm_auth_changed', { detail: null }));
    if (isValidSupabase) {
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
    return message;
}
