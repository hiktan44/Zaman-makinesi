/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase, isSupabaseConfigured, logOut } from '../services/supabaseService';
import { checkIsAdmin } from '../lib/adminStore';

interface AuthContextType {
    user: User | null;
    session: Session | null;
    loading: boolean;
    isAuthenticated: boolean;
    isAdmin: boolean;
    signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(() => {
        try {
            const saved = localStorage.getItem('zm_local_user');
            return saved ? JSON.parse(saved) : null;
        } catch {
            return null;
        }
    });
    const [session, setSession] = useState<Session | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!isSupabaseConfigured) {
            // Local storage auth listener
            const handleLocalAuth = (e: CustomEvent) => {
                setUser(e.detail);
            };
            window.addEventListener('zm_auth_changed', handleLocalAuth as EventListener);
            return () => {
                window.removeEventListener('zm_auth_changed', handleLocalAuth as EventListener);
            };
        }

        // Supabase session check
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
            if (session?.user) {
                setUser(session.user);
            }
            setLoading(false);
        }).catch(() => setLoading(false));

        // Listen for Supabase auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
            setUser(session?.user ?? null);
            setLoading(false);
        });

        return () => subscription.unsubscribe();
    }, []);

    const signOut = async () => {
        await logOut();
        setUser(null);
        setSession(null);
    };

    const isAdmin = checkIsAdmin(user?.email);

    const value = {
        user,
        session,
        loading,
        isAuthenticated: !!user,
        isAdmin,
        signOut,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
