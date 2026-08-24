/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import React from 'react';
import { useLang } from '../lib/use-lang';
import { t } from '../lib/i18n';

const LangSwitch: React.FC = () => {
  const { lang, setLang, isLoading } = useLang();

  if (isLoading) {
    return (
      <button
        disabled
        className="flex items-center justify-center w-10 h-10 rounded-lg bg-stone-100 dark:bg-surface-dark border border-stone-200 dark:border-border-dark opacity-50 cursor-not-allowed"
        aria-label="Loading language"
      >
        <span className="text-sm font-bold text-text-light dark:text-text-dark">...</span>
      </button>
    );
  }

  const handleToggle = () => {
    setLang(lang === 'tr' ? 'en' : 'tr');
  };

  const nextLang = lang === 'tr' ? 'en' : 'tr';

  return (
    <button
      onClick={handleToggle}
      className="flex items-center justify-center w-10 h-10 rounded-lg bg-stone-100 dark:bg-surface-dark border border-stone-200 dark:border-border-dark hover:bg-stone-200 dark:hover:bg-border-dark transition-colors"
      aria-label={`Switch to ${nextLang.toUpperCase()}`}
      title={`Switch to ${nextLang.toUpperCase()}`}
    >
      <span className="text-sm font-bold text-text-light dark:text-text-dark">
        {t('lang.switch', lang)}
      </span>
    </button>
  );
};

export default LangSwitch;
