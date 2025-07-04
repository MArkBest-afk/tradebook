"use client"

import React, { useState } from "react"
import { AccountOverview } from "@/components/dashboard/account-overview"
import { AIAssistant } from "@/components/dashboard/ai-assistant"
import { TradeHistory } from "@/components/dashboard/trade-history"
import { TradePanel } from "@/components/dashboard/trade-panel"
import { TradingChart } from "@/components/dashboard/trading-chart"
import { useAppContext } from "@/contexts/app-context"
import { Onboarding } from "@/components/onboarding"
import { BotSelection } from "@/components/bot-selection"
import { Skeleton } from "@/components/ui/skeleton"

function Dashboard() {
  const [currentPrice, setCurrentPrice] = useState(50000);

  return (
    <div className="grid gap-4 md:gap-8 lg:grid-cols-3">
      <div className="grid auto-rows-max items-start gap-4 md:gap-8 lg:col-span-2">
        <TradingChart onPriceUpdate={setCurrentPrice} />
        <TradeHistory />
      </div>
      <div className="grid auto-rows-max items-start gap-4 md:gap-8 lg:col-span-1">
        <AccountOverview />
        <TradePanel currentPrice={currentPrice} />
        <AIAssistant />
      </div>
    </div>
  )
}

export default function DashboardPage() {
  const [isClient, setIsClient] = React.useState(false);
  React.useEffect(() => {
    setIsClient(true);
  }, []);

  // We can't use the hook here directly because it relies on localStorage.
  // We'll call it inside the client-only block.
  if (!isClient) {
    // Show a loading skeleton on the server to avoid hydration errors
    return (
      <div className="grid gap-4 md:gap-8 lg:grid-cols-3">
        <div className="grid auto-rows-max items-start gap-4 md:gap-8 lg:col-span-2">
            <Skeleton className="h-[480px] w-full" />
            <Skeleton className="h-[200px] w-full" />
        </div>
        <div className="grid auto-rows-max items-start gap-4 md:gap-8 lg:col-span-1">
            <Skeleton className="h-[200px] w-full" />
            <Skeleton className="h-[200px] w-full" />
            <Skeleton className="h-[200px] w-full" />
        </div>
      </div>
    );
  }
  
  return <PageContent />;
}

function PageContent() {
  const { onboardingCompleted, selectedBot } = useAppContext();

  if (!onboardingCompleted) {
    return <Onboarding />;
  }

  if (!selectedBot) {
    return <BotSelection />;
  }
  
  return <Dashboard />;
}
