/**
 * Web Audio API based procedural SFX engine for Zaman Makinesi
 * Zero external audio files required!
 */

let audioCtx: AudioContext | null = null;
let isMuted: boolean = (() => {
    try {
        return localStorage.getItem('zaman_makinesi_sfx_muted') === 'true';
    } catch {
        return false;
    }
})();

function getAudioContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!audioCtx) {
        const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        if (AudioContextClass) {
            audioCtx = new AudioContextClass();
        }
    }
    if (audioCtx && audioCtx.state === 'suspended') {
        audioCtx.resume().catch(() => {});
    }
    return audioCtx;
}

export function isSfxMuted(): boolean {
    return isMuted;
}

export function toggleSfxMute(): boolean {
    isMuted = !isMuted;
    try {
        localStorage.setItem('zaman_makinesi_sfx_muted', isMuted ? 'true' : 'false');
    } catch {}
    return isMuted;
}

/**
 * Mechanical dial tick sound
 */
export function playTick(): void {
    if (isMuted) return;
    const ctx = getAudioContext();
    if (!ctx) return;

    try {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const now = ctx.currentTime;

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(1200, now);
        osc.frequency.exponentialRampToValueAtTime(300, now + 0.04);

        gain.gain.setValueAtTime(0.12, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now);
        osc.stop(now + 0.05);
    } catch {}
}

/**
 * Sci-Fi Time Warp / Dimensional Jump sweep sound
 */
export function playWarp(): void {
    if (isMuted) return;
    const ctx = getAudioContext();
    if (!ctx) return;

    try {
        const osc = ctx.createOscillator();
        const osc2 = ctx.createOscillator();
        const filter = ctx.createBiquadFilter();
        const gain = ctx.createGain();
        const now = ctx.currentTime;

        // Primary Sweep
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(150, now);
        osc.frequency.exponentialRampToValueAtTime(1800, now + 0.35);
        osc.frequency.exponentialRampToValueAtTime(220, now + 0.7);

        // Sub harmonic bass
        osc2.type = 'sine';
        osc2.frequency.setValueAtTime(80, now);
        osc2.frequency.linearRampToValueAtTime(240, now + 0.3);
        osc2.frequency.linearRampToValueAtTime(60, now + 0.7);

        // Resonant filter
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(400, now);
        filter.frequency.exponentialRampToValueAtTime(3500, now + 0.35);
        filter.frequency.exponentialRampToValueAtTime(300, now + 0.7);
        filter.Q.setValueAtTime(6, now);

        // Gain envelope
        gain.gain.setValueAtTime(0.01, now);
        gain.gain.linearRampToValueAtTime(0.2, now + 0.1);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.75);

        osc.connect(filter);
        osc2.connect(filter);
        filter.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now);
        osc2.start(now);
        osc.stop(now + 0.8);
        osc2.stop(now + 0.8);
    } catch {}
}

/**
 * Vintage Polaroid mechanical shutter & motor ejection sound
 */
export function playCameraShutter(): void {
    if (isMuted) return;
    const ctx = getAudioContext();
    if (!ctx) return;

    try {
        const now = ctx.currentTime;

        // 1. Shutter Click (high freq burst)
        const clickOsc = ctx.createOscillator();
        const clickGain = ctx.createGain();
        clickOsc.type = 'square';
        clickOsc.frequency.setValueAtTime(2200, now);
        clickOsc.frequency.exponentialRampToValueAtTime(400, now + 0.05);
        clickGain.gain.setValueAtTime(0.2, now);
        clickGain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);
        clickOsc.connect(clickGain);
        clickGain.connect(ctx.destination);
        clickOsc.start(now);
        clickOsc.stop(now + 0.07);

        // 2. Motor Whir (ejecting Polaroid)
        const motorOsc = ctx.createOscillator();
        const motorGain = ctx.createGain();
        motorOsc.type = 'sawtooth';
        motorOsc.frequency.setValueAtTime(440, now + 0.08);
        motorOsc.frequency.linearRampToValueAtTime(520, now + 0.28);
        motorGain.gain.setValueAtTime(0.001, now);
        motorGain.gain.setValueAtTime(0.12, now + 0.08);
        motorGain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
        motorOsc.connect(motorGain);
        motorGain.connect(ctx.destination);
        motorOsc.start(now + 0.08);
        motorOsc.stop(now + 0.36);
    } catch {}
}

/**
 * Success chord chime
 */
export function playSuccess(): void {
    if (isMuted) return;
    const ctx = getAudioContext();
    if (!ctx) return;

    try {
        const notes = [523.25, 659.25, 783.99, 1046.5]; // C Major
        notes.forEach((freq, idx) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            const now = ctx.currentTime + idx * 0.08;

            osc.type = 'sine';
            osc.frequency.setValueAtTime(freq, now);

            gain.gain.setValueAtTime(0.12, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);

            osc.connect(gain);
            gain.connect(ctx.destination);

            osc.start(now);
            osc.stop(now + 0.55);
        });
    } catch {}
}
