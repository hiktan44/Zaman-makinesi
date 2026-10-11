export function browserAuthConfig(env: Record<string, string | undefined>) {
    const url = env.VITE_SUPABASE_URL?.trim();
    const key = env.VITE_SUPABASE_PUBLISHABLE_KEY?.trim() || env.VITE_SUPABASE_ANON_KEY?.trim();
    if (!url || !key) return null;
    try {
        const parsed = new URL(url);
        if (!['http:', 'https:'].includes(parsed.protocol) || !parsed.hostname ||
            parsed.username || parsed.password || parsed.search || parsed.hash) return null;
        if (/^sb_publishable_[A-Za-z0-9_-]+$/.test(key)) return { url, key };
        // Eski anon anahtarı yalnız tarayıcı anahtar türünü ayırt etmek için okunur.
        // Bu işlem kullanıcı JWT'sini doğrulamaz ve yetki kararı vermez.
        const parts = key.split('.');
        if (parts.length !== 3 || parts.some(part => !part)) return null;
        const payload = JSON.parse(atob(parts[1].replace(/-/g, '+').replace(/_/g, '/')));
        return payload.role === 'anon' ? { url, key } : null;
    } catch {
        return null;
    }
}
