import type { SupabaseClient, User, Session } from '@supabase/supabase-js';

export interface VerifiedAuthState {
    user: User | null;
    session: Session | null;
    loading: boolean;
}

export function observeVerifiedAuth(client: SupabaseClient | null, publish: (state: VerifiedAuthState) => void) {
    let active = true;
    let version = 0;
    const timers = new Set<ReturnType<typeof setTimeout>>();
    publish({ user: null, session: null, loading: !!client });
    if (!client) return () => { active = false; };

    const { data: { subscription } } = client.auth.onAuthStateChange((_event, session) => {
        if (!active) return;
        const expected = ++version;
        publish({ user: null, session: null, loading: !!session });
        if (!session) return;
        // SDK callback'i içinde başka bir Auth çağrısı beklenmez.
        const timer = setTimeout(async () => {
            timers.delete(timer);
            if (!active || expected !== version) return;
            try {
                const { data, error } = await client.auth.getUser(session.access_token);
                if (!active || expected !== version) return;
                if (error || !data.user || data.user.id !== session.user.id) {
                    publish({ user: null, session: null, loading: false });
                    return;
                }
                publish({ user: data.user, session: { ...session, user: data.user }, loading: false });
            } catch {
                if (active && expected === version) publish({ user: null, session: null, loading: false });
            }
        }, 0);
        timers.add(timer);
    });

    return () => {
        active = false;
        version++;
        for (const timer of timers) clearTimeout(timer);
        timers.clear();
        subscription.unsubscribe();
    };
}
