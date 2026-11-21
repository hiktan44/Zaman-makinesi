import React from 'react';
import { useLang, type Lang } from '../lib/use-lang';
import { t } from '../lib/i18n';

interface LangSwitchProps {
  className?: string;
}

const OPTIONS: Array<{ code: Lang; label: string; aria: string }> = [
  { code: 'tr', label: 'TR', aria: 'Türkçe' },
  { code: 'en', label: 'EN', aria: 'English' },
];

export const LangSwitch: React.FC<LangSwitchProps> = ({ className = '' }) => {
  const { lang, setLang } = useLang();

  return (
    <div
      className={`flex items-center gap-1 rounded-lg bg-stone-100 dark:bg-surface-dark border border-stone-200 dark:border-border-dark p-1 ${className}`}
      title={t('common.langTitle', lang)}
      role="group"
    >
      {OPTIONS.map((o) => (
        <button
          key={o.code}
          type="button"
          onClick={() => setLang(o.code)}
          aria-label={o.aria}
          aria-pressed={lang === o.code}
          className={`px-2 py-1 rounded-md text-sm font-bold transition-colors ${
            lang === o.code
              ? 'bg-primary text-background-dark'
              : 'text-text-light dark:text-text-dark hover:bg-stone-200 dark:hover:bg-border-dark'
          }`}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
};

export default LangSwitch;
