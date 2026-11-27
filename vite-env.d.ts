/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_API_KEY?: string
    readonly VITE_GEMINI_IMAGE_MODEL?: string
    readonly VITE_GEMINI_IMAGE_FALLBACK_MODEL?: string
    readonly VITE_KIE_API_KEY?: string
    readonly VITE_FAL_KEY?: string
    // more env variables...
}

interface ImportMeta {
    readonly env: ImportMetaEnv
}
