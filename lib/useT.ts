/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import { useLang } from './use-lang';
import { t } from './i18n';

export const useT = () => {
  const { lang, setLang, isLoading, isTR, isEN } = useLang();

  return {
    lang,
    setLang,
    isLoading,
    isTR,
    isEN,
    t: (key: string, vars?: Record<string, string | number>) => t(key, lang, vars),
  };
};
