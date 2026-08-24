/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import { useState, useEffect } from 'react';

export type Lang = 'tr' | 'en';

const LANG_KEY = 'ui_lang';
const LANG_CHANGE_EVENT = 'ui_lang_change';

// IP Detection with fallback APIs
const detectCountryFromIP = async (): Promise<string> => {
  // Check sessionStorage cache first (24h cache)
  const cached = sessionStorage.getItem('ip_country_cache');
  if (cached) {
    const { country, timestamp } = JSON.parse(cached);
    const age = Date.now() - timestamp;
    if (age < 24 * 60 * 60 * 1000) { // 24 hours
      return country;
    }
  }

  // Try ipwho.is first (faster, more reliable)
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2500);

    const response = await fetch('https://ipwho.is/', {
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (response.ok) {
      const data = await response.json();
      const country = data.country_code || 'TR';
      
      // Cache the result
      sessionStorage.setItem('ip_country_cache', JSON.stringify({
        country,
        timestamp: Date.now()
      }));
      
      return country;
    }
  } catch (error) {
    console.warn('ipwho.is failed, trying ipapi.co:', error);
  }

  // Fallback to ipapi.co
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2500);

    const response = await fetch('https://ipapi.co/json/', {
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (response.ok) {
      const data = await response.json();
      const country = data.country_code || 'TR';
      
      // Cache the result
      sessionStorage.setItem('ip_country_cache', JSON.stringify({
        country,
        timestamp: Date.now()
      }));
      
      return country;
    }
  } catch (error) {
    console.warn('ipapi.co failed:', error);
  }

  // Final fallback to navigator.language
  const lang = navigator.language || navigator.languages?.[0] || 'tr';
  return lang.startsWith('tr') ? 'TR' : 'EN';
};

export const getInitialLang = async (): Promise<Lang> => {
  // 1. Check localStorage preference (highest priority)
  const stored = localStorage.getItem(LANG_KEY);
  if (stored === 'tr' || stored === 'en') {
    return stored;
  }

  // 2. Check cookie
  const cookies = document.cookie.split(';');
  const langCookie = cookies.find(c => c.trim().startsWith(`${LANG_KEY}=`));
  if (langCookie) {
    const value = langCookie.split('=')[1]?.trim();
    if (value === 'tr' || value === 'en') {
      localStorage.setItem(LANG_KEY, value);
      return value;
    }
  }

  // 3. IP-based detection
  const country = await detectCountryFromIP();
  const detectedLang: Lang = country === 'TR' ? 'tr' : 'en';
  localStorage.setItem(LANG_KEY, detectedLang);
  
  return detectedLang;
};

export const setLang = (lang: Lang) => {
  localStorage.setItem(LANG_KEY, lang);
  
  // Set cookie for 1 year
  const expiry = new Date();
  expiry.setFullYear(expiry.getFullYear() + 1);
  document.cookie = `${LANG_KEY}=${lang}; expires=${expiry.toUTCString()}; path=/; SameSite=Lax`;
  
  // Dispatch event for other components
  window.dispatchEvent(new CustomEvent(LANG_CHANGE_EVENT, { detail: lang }));
};

export const pickByLang = <T>(lang: Lang, tr: T, en: T): T => {
  return lang === 'tr' ? tr : en;
};

export const useLang = () => {
  const [lang, setLangState] = useState<Lang>(() => {
    // Initialize with stored preference or default to 'tr'
    const stored = localStorage.getItem(LANG_KEY);
    return (stored === 'tr' || stored === 'en') ? stored : 'tr';
  });
  
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    // Initialize language on mount
    getInitialLang().then((initialLang) => {
      if (mounted) {
        setLangState(initialLang);
        setIsLoading(false);
      }
    });

    // Listen for language change events
    const handleLangChange = (e: CustomEvent) => {
      if (mounted) {
        setLangState(e.detail);
      }
    };

    window.addEventListener(LANG_CHANGE_EVENT, handleLangChange as EventListener);

    return () => {
      mounted = false;
      window.removeEventListener(LANG_CHANGE_EVENT, handleLangChange as EventListener);
    };
  }, []);

  return {
    lang,
    setLang,
    isLoading,
    isTR: lang === 'tr',
    isEN: lang === 'en',
  };
};
