"use client";

import { AppProvider } from "@/contexts/app-context";
import { LanguageProvider } from "@/contexts/language-context";
import { TradingProvider } from "@/contexts/trading-context";
import { TooltipProvider } from "@/components/ui/tooltip";

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <AppProvider>
      <TooltipProvider>
        <LanguageProvider>
          <TradingProvider>{children}</TradingProvider>
        </LanguageProvider>
      </TooltipProvider>
    </AppProvider>
  );
}
