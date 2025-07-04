"use client"

import React from "react"
import { AccountOverview } from "@/components/dashboard/account-overview"
import { AIAssistant } from "@/components/dashboard/ai-assistant"
import { TradeHistory } from "@/components/dashboard/trade-history"
import { useAppContext } from "@/contexts/app-context"
import { Onboarding } from "@/components/onboarding"
import { BotSelection } from "@/components/bot-selection"
import { Skeleton } from "@/components/ui/skeleton"

function Dashboard() {
  return (
    <div className="max-w-xl mx-auto space-y-6">
      <AccountOverview />
      <AIAssistant />
      <TradeHistory />
    </div>
  )
}

export default function DashboardPage() {
  const [isClient, setIsClient] = React.useState(false);
  React.useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return (
      <div className="max-w-xl mx-auto space-y-6">
        <Skeleton className="h-[200px] w-full" />
        <Skeleton className="h-[200px] w-full" />
        <Skeleton className="h-[200px] w-full" />
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
