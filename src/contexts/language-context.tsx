"use client";

import { createContext, useContext, useMemo, ReactNode } from 'react';
import type { Language } from '@/lib/types';
import { useLocalStorage } from '@/hooks/use-local-storage';
import { translations } from '@/lib/i18n';

interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useLocalStorage<Language>('language', 'en');

  const t = useMemo(() => (key: string): string => {
    const translationSet = translations[language] || translations.en;
    if (Object.prototype.hasOwnProperty.call(translationSet, key)) {
      return translationSet[key];
    }
    return key;
  }, [language]);

  const value = {
    language,
    setLanguage,
    t,
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
