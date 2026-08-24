/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import React, { useState } from 'react';
import { signInWithEmail, signUpWithEmail, signInWithGoogle } from '../services/supabaseService';
import { useT } from '../lib/useT';

interface AuthModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function AuthModal({ isOpen, onClose }: AuthModalProps) {
    const { t } = useT();
    const [isSignUp, setIsSignUp] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    if (!isOpen) return null;

    const handleEmailAuth = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (isSignUp && password !== confirmPassword) {
            setError(t('auth.error.match'));
            return;
        }

        if (password.length < 6) {
            setError(t('auth.error.length'));
            return;
        }

        setLoading(true);

        try {
            let result;
            if (isSignUp) {
                result = await signUpWithEmail(email, password);
            } else {
                result = await signInWithEmail(email, password);
            }

            if (result.error) {
                setError(result.error.message);
            } else {
                onClose();
                resetForm();
            }
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleSignIn = async () => {
        setError('');
        setLoading(true);

        try {
            await signInWithGoogle();
            onClose();
            resetForm();
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const resetForm = () => {
        setEmail('');
        setPassword('');
        setConfirmPassword('');
        setError('');
        setIsSignUp(false);
    };

    const handleClose = () => {
        resetForm();
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="relative w-full max-w-md bg-white dark:bg-surface-dark rounded-2xl shadow-2xl overflow-hidden">
                {/* Close button */}
                <button
                    onClick={handleClose}
                    className="absolute top-4 right-4 z-10 w-10 h-10 flex items-center justify-center rounded-full bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 transition-colors"
                    aria-label={t('auth.close')}
                >
                    <span className="text-2xl text-stone-600 dark:text-stone-300">×</span>
                </button>

                {/* Header */}
                <div className="bg-gradient-to-r from-yellow-400 to-orange-500 p-6 text-center">
                    <h2 className="text-3xl font-bold text-white mb-1">
                        {isSignUp ? t('auth.signUp') : t('auth.signIn')}
                    </h2>
                    <p className="text-white/90 text-sm">
                        {isSignUp ? t('auth.signUp.subtitle') : t('auth.signIn.subtitle')}
                    </p>
                </div>

                {/* Content */}
                <div className="p-6 space-y-4">
                    {/* Error Message */}
                    {error && (
                        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-lg text-sm">
                            {error}
                        </div>
                    )}

                    {/* Google Sign In */}
                    <button
                        onClick={handleGoogleSignIn}
                        disabled={loading}
                        className="w-full flex items-center justify-center gap-3 bg-white dark:bg-stone-800 border-2 border-stone-300 dark:border-stone-600 text-stone-700 dark:text-stone-200 px-6 py-3 rounded-lg font-semibold hover:bg-stone-50 dark:hover:bg-stone-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <svg className="w-5 h-5" viewBox="0 0 24 24">
                            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                        </svg>
                        {t('auth.google.button', { action: isSignUp ? t('auth.signUp') : t('auth.signIn') })}
                    </button>

                    {/* Divider */}
                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-stone-300 dark:border-stone-600"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-2 bg-white dark:bg-surface-dark text-stone-500 dark:text-stone-400">
                                {t('auth.or')}
                            </span>
                        </div>
                    </div>

                    {/* Email/Password Form */}
                    <form onSubmit={handleEmailAuth} className="space-y-4">
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-1">
                                {t('auth.email')}
                            </label>
                            <input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="w-full px-4 py-3 border border-stone-300 dark:border-stone-600 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent bg-white dark:bg-stone-800 text-stone-900 dark:text-white"
                                placeholder={t('auth.email.placeholder')}
                            />
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-1">
                                {t('auth.password')}
                            </label>
                            <input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className="w-full px-4 py-3 border border-stone-300 dark:border-stone-600 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent bg-white dark:bg-stone-800 text-stone-900 dark:text-white"
                                placeholder={t('auth.password.placeholder')}
                            />
                        </div>

                        {isSignUp && (
                            <div>
                                <label htmlFor="confirmPassword" className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-1">
                                    {t('auth.confirmPassword')}
                                </label>
                                <input
                                    id="confirmPassword"
                                    type="password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    required
                                    className="w-full px-4 py-3 border border-stone-300 dark:border-stone-600 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent bg-white dark:bg-stone-800 text-stone-900 dark:text-white"
                                    placeholder={t('auth.password.placeholder')}
                                />
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-6 py-3 rounded-lg font-semibold hover:from-yellow-500 hover:to-orange-600 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? t('auth.loading') : (isSignUp ? t('auth.signUp') : t('auth.signIn'))}
                        </button>
                    </form>

                    {/* Toggle Sign Up/Sign In */}
                    <div className="text-center pt-4 border-t border-stone-200 dark:border-stone-700">
                        <p className="text-sm text-stone-600 dark:text-stone-400">
                            {isSignUp ? t('auth.hasAccount') : t('auth.noAccount')}
                            {' '}
                            <button
                                onClick={() => {
                                    setIsSignUp(!isSignUp);
                                    setError('');
                                }}
                                className="text-yellow-600 dark:text-yellow-400 font-semibold hover:underline"
                            >
                                {isSignUp ? t('auth.signIn') : t('auth.signUp')}
                            </button>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
