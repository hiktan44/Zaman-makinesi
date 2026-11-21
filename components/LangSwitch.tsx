/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import React from 'react';
import { useLang, type Lang } from '../lib/use-lang';
import { t } from '../lib/i18n';

const OPTIONS: Array<{ code: Lang; label: string; aria: string }> = [
  { code: 'tr', label: 'TR', aria: 'Türkçe' },
  { code: 'en', label: 'EN', aria: 'English' },
];

interface LangSwitchProps {
  className?: string;
}

/** TR / EN dil seçici. Tespit sürerken de tıklanabilir: bilinçli seçim her zaman kazanır. */
const LangSwitch: React.FC<LangSwitchProps> = ({ className = '' }) => {
  const { lang, setLang } = useLang();

  return (
    <div
      role="group"
      title={t('common.langTitle', lang)}
      aria-label={t('common.langTitle', lang)}
      className={`flex items-center gap-0.5 rounded-lg bg-slate-800 border border-slate-700 p-0.5 ${className}`}
    >
      {OPTIONS.map((o) => (
        <button
          key={o.code}
          type="button"
          onClick={() => setLang(o.code)}
          aria-label={o.aria}
          aria-pressed={lang === o.code}
          className={`px-2 py-1 rounded-md text-xs font-bold transition-colors cursor-pointer ${
            lang === o.code ? 'bg-amber-400 text-slate-950' : 'text-slate-300 hover:bg-slate-700'
          }`}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
};

export default LangSwitch;
