"use client";

import { createContext, useContext, ReactNode } from 'react';
import type { BotType } from '@/lib/types';
import { useLocalStorage } from '@/hooks/use-local-storage';

interface AppContextType {
  onboardingCompleted: boolean;
  completeOnboarding: () => void;
  selectedBot: BotType | null;
  selectBot: (bot: BotType) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [onboardingCompleted, setOnboardingCompleted] = useLocalStorage<boolean>('onboarding-completed-v5', false);
  const [selectedBot, setSelectedBot] = useLocalStorage<BotType | null>('selected-bot-v5', null);

  const completeOnboarding = () => {
    setOnboardingCompleted(true);
  };

  const selectBot = (bot: BotType) => {
    setSelectedBot(bot);
  };

  const value = {
    onboardingCompleted,
    completeOnboarding,
    selectedBot,
    selectBot,
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
}
