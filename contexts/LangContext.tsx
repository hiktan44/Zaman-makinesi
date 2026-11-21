import React, { createContext, useContext, ReactNode } from 'react';
import { useLang, type Lang } from '../lib/use-lang';

interface LangContextValue {
  lang: Lang;
  setLang: (lang: Lang) => void;
}

const LangContext = createContext<LangContextValue | undefined>(undefined);

export function LangProvider({ children }: { children: ReactNode }) {
  const { lang, setLang } = useLang();
  return <LangContext.Provider value={{ lang, setLang }}>{children}</LangContext.Provider>;
}

export function useLangContext() {
  const context = useContext(LangContext);
  if (!context) {
    throw new Error('useLangContext must be used within a LangProvider');
  }
  return context;
}
