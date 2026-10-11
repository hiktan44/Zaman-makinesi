/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase, isSupabaseConfigured, logOut } from '../services/supabaseService';
import { checkIsAdmin } from '../lib/adminStore';
import { observeVerifiedAuth, VerifiedAuthState } from '../services/auth-session';

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
    const [{ user, session, loading }, setAuth] = useState<VerifiedAuthState>({
        user: null, session: null, loading: isSupabaseConfigured,
    });

    useEffect(() => observeVerifiedAuth(supabase, setAuth), []);

    const signOut = async () => {
        await logOut();
        setAuth({ user: null, session: null, loading: false });
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
        throw new Error('useAuth, AuthProvider içinde kullanılmalıdır.');
    }
    return context;
}
