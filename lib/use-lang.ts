/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import { useCallback, useEffect, useState } from 'react';
import { LEGAL_LINKS, getLang, pickByLang as pick, setCurrentLang, t, type Lang } from './i18n';

export type { Lang };

const LANG_KEY = 'ui_lang';
const COOKIE_KEY = 'ui_lang';
// Kullanıcının bilinçli seçimini, eski sürümün otomatik yazdığı değerden ayırır.
const EXPLICIT_KEY = 'ui_lang_explicit';
const LANG_CHANGE_EVENT = 'ui_lang_change';
const IP_CACHE_KEY = 'ui_ip_country';
const IP_CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 saat

const isLang = (v: unknown): v is Lang => v === 'tr' || v === 'en';

const hasLangCookie = (): boolean => {
  try {
    return document.cookie.split(';').some((c) => c.trim().startsWith(`${COOKIE_KEY}=`));
  } catch {
    return false;
  }
};

/**
 * Kayıtlı (bilinçli) dil seçimi.
 * Eski sürüm algılanan dili de localStorage'a yazıyordu ama çerezi yalnızca
 * kullanıcı dil düğmesine bastığında yazıyordu. Çerezi ve işaretçisi olmayan bir
 * değer eski otomatik algılamadır; bir kez silinir ki yanlış algılanan ziyaretçi
 * sonsuza kadar o dilde kalmasın.
 */
const readStored = (): Lang | null => {
  try {
    const stored = localStorage.getItem(LANG_KEY);
    if (!isLang(stored)) return null;
    if (localStorage.getItem(EXPLICIT_KEY) === '1' || hasLangCookie()) return stored;
    localStorage.removeItem(LANG_KEY);
    return null;
  } catch {
    return null;
  }
};

/** IP'den ülke kodu (ipwho.is). Başarısız olursa null. */
const getIpCountry = async (): Promise<string | null> => {
  try {
    try {
      const cached = localStorage.getItem(IP_CACHE_KEY);
      if (cached) {
        const { country, timestamp } = JSON.parse(cached);
        if (country && Date.now() - timestamp < IP_CACHE_DURATION) return country;
      }
    } catch {
      // önbellek okunamazsa aramaya devam et
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2500);
    const res = await fetch('https://ipwho.is/', { signal: controller.signal, cache: 'no-store' });
    clearTimeout(timeoutId);
    if (!res.ok) return null;

    const data = await res.json();
    const country = typeof data?.country_code === 'string' ? data.country_code.toUpperCase() : null;
    if (country) {
      try {
        localStorage.setItem(IP_CACHE_KEY, JSON.stringify({ country, timestamp: Date.now() }));
      } catch {
        // yoksay
      }
    }
    return country;
  } catch {
    return null;
  }
};

/**
 * Dil tespiti:
 * 1) localStorage'daki kayıtlı seçim
 * 2) IP ülkesi: TR -> tr, başka ülke -> en
 * 3) IP sorgusu başarısızsa tarayıcı dili: Türkçe -> tr, diğer -> en
 */
const detectInitialLang = async (): Promise<Lang> => {
  const stored = readStored();
  if (stored) return stored;

  const country = await getIpCountry();
  if (country === 'TR') return 'tr';
  if (country) return 'en';

  if (typeof navigator !== 'undefined') {
    const langs = navigator.languages?.length ? navigator.languages : [navigator.language];
    const primary = (langs.find(Boolean) || '').toLowerCase();
    if (primary) return primary.startsWith('tr') ? 'tr' : 'en';
  }
  return 'tr';
};

// --- index.html içindeki statik metinlerin (başlık, meta, yasal alt bilgi) çalışma zamanı çevirisi ---

const setOriginal = (el: Element, attr: string, value: string) => {
  const k = `data-orig-${attr}`;
  if (!el.hasAttribute(k)) el.setAttribute(k, value);
};

const patchAttr = (selector: string, attr: string, key: string, lang: Lang) => {
  document.querySelectorAll(selector).forEach((el) => {
    const cur = el.getAttribute(attr) ?? '';
    setOriginal(el, attr, cur);
    el.setAttribute(attr, lang === 'tr' ? el.getAttribute(`data-orig-${attr}`) ?? cur : t(key, 'en'));
  });
};

const applyDocument = (lang: Lang) => {
  if (typeof document === 'undefined') return;
  try {
    document.documentElement.lang = lang;

    // Başlık
    if (!document.documentElement.hasAttribute('data-orig-title')) {
      document.documentElement.setAttribute('data-orig-title', document.title);
    }
    document.title = lang === 'tr' ? document.documentElement.getAttribute('data-orig-title') || document.title : t('meta.title', 'en');

    // Meta etiketleri (index.html'de iki açıklama var: sayfa ve site açıklaması)
    document.querySelectorAll('meta[name="description"]').forEach((el, i) => {
      const cur = el.getAttribute('content') ?? '';
      setOriginal(el, 'content', cur);
      el.setAttribute(
        'content',
        lang === 'tr' ? el.getAttribute('data-orig-content') ?? cur : t(i === 0 ? 'meta.description' : 'meta.siteDescription', 'en')
      );
    });
    patchAttr('meta[property="og:title"]', 'content', 'meta.title', lang);
    patchAttr('meta[property="og:description"]', 'content', 'meta.ogDescription', lang);
    patchAttr('meta[property="og:locale"]', 'content', 'meta.ogLocale', lang);

    // index.html alt bilgisindeki yasal sayfa bağlantıları
    Object.entries(LEGAL_LINKS).forEach(([trHref, info]) => {
      document
        .querySelectorAll<HTMLAnchorElement>(`body > footer a[href="${trHref}"], body > footer a[data-orig-href="${trHref}"]`)
        .forEach((a) => {
          if (!a.hasAttribute('data-orig-href')) {
            a.setAttribute('data-orig-href', trHref);
            a.setAttribute('data-orig-text', a.textContent || '');
          }
          a.setAttribute('href', lang === 'tr' ? trHref : info.en);
          a.textContent = lang === 'tr' ? a.getAttribute('data-orig-text') || '' : t(info.key, 'en');
        });
    });
  } catch {
    // statik sayfa metinleri yoksayılabilir
  }
};

// --- Paylaşılan modül durumu ---

let initialized = false;
let userChose = false;
let detection: Promise<void> | null = null;
let detecting = false;

const commit = (lang: Lang) => {
  setCurrentLang(lang);
  applyDocument(lang);
  window.dispatchEvent(new CustomEvent(LANG_CHANGE_EVENT, { detail: lang }));
};

/** Kayıtlı dili modül yüklenir yüklenmez uygular (React dışı kodlar da doğru dili görsün). */
const initFromStorage = () => {
  if (initialized || typeof window === 'undefined') return;
  initialized = true;
  const stored = readStored();
  if (stored) {
    setCurrentLang(stored);
    applyDocument(stored);
  }
};
initFromStorage();

/** Dil tespiti sayfa başına bir kez çalışır; sonuç tüm hook örneklerine yayınlanır. */
const ensureDetected = () => {
  if (detection || typeof window === 'undefined') return;
  if (readStored()) return; // bilinçli seçim zaten var, arama yapma
  detecting = true;
  detection = detectInitialLang().then((detected) => {
    detecting = false;
    if (userChose) return; // tespit sürerken kullanıcı elle seçtiyse onu ezme
    commit(detected); // algılanan dil kullanıcı seçimi olarak SAKLANMAZ
  });
};

/** Kullanıcının bilinçli seçimi: saklanır ve tüm hook örneklerine yayınlanır. */
export const setLang = (newLang: Lang) => {
  userChose = true;
  try {
    localStorage.setItem(LANG_KEY, newLang);
    localStorage.setItem(EXPLICIT_KEY, '1');
    document.cookie = `${COOKIE_KEY}=${newLang}; path=/; max-age=${365 * 24 * 60 * 60}; SameSite=Lax`;
  } catch {
    // yoksay
  }
  commit(newLang);
};

export { pick as pickByLang };

export const useLang = () => {
  const [lang, setLangState] = useState<Lang>(() => readStored() ?? getLang());
  const [isLoading, setIsLoading] = useState<boolean>(detecting);

  useEffect(() => {
    const onChange = (e: Event) => {
      const next = (e as CustomEvent<Lang>).detail;
      if (isLang(next)) setLangState(next);
      setIsLoading(false);
    };
    // Başka sekmede yapılan seçim
    const onStorage = (e: StorageEvent) => {
      if (e.key === LANG_KEY && isLang(e.newValue)) {
        setCurrentLang(e.newValue);
        applyDocument(e.newValue);
        setLangState(e.newValue);
      }
    };
    window.addEventListener(LANG_CHANGE_EVENT, onChange);
    window.addEventListener('storage', onStorage);
    // Efekt başlamadan önce yayınlanmış bir değişiklik olduysa yakala
    setLangState(getLang());
    ensureDetected();
    setIsLoading(detecting);
    return () => {
      window.removeEventListener(LANG_CHANGE_EVENT, onChange);
      window.removeEventListener('storage', onStorage);
    };
  }, []);

  const setLanguage = useCallback((newLang: Lang) => setLang(newLang), []);

  return {
    lang,
    setLang: setLanguage,
    isLoading,
    isTR: lang === 'tr',
    isEN: lang === 'en',
  };
};
