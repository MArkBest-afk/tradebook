"use client"

import React from "react"
import { AccountOverview } from "@/components/dashboard/account-overview"
import { AIAssistant } from "@/components/dashboard/ai-assistant"
import { TradeHistory } from "@/components/dashboard/trade-history"
import { useAppContext } from "@/contexts/app-context"
import { Onboarding } from "@/components/onboarding"
import { BotSelection } from "@/components/bot-selection"
import { Skeleton } from "@/components/ui/skeleton"
import { useTrading } from "@/contexts/trading-context"
import { useLanguage } from "@/contexts/language-context"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Loader } from "lucide-react"

function TradingControls() {
  const { isTrading, startTrading, stopTrading } = useTrading();
  const { t } = useLanguage();

  return (
    <Card>
      <CardContent className="pt-6">
        {!isTrading ? (
          <Button onClick={startTrading} className="w-full bg-green-600 hover:bg-green-700 text-lg h-12">
            {t('start_trading')}
          </Button>
        ) : (
          <Button onClick={stopTrading} variant="destructive" className="w-full text-lg h-12 flex items-center gap-2">
            <Loader className="animate-spin" />
            {t('stop_trading')}
          </Button>
        )}
      </CardContent>
    </Card>
  )
}

function Dashboard() {
  return (
    <div className="max-w-xl mx-auto space-y-6">
      <AccountOverview />
      <TradingControls />
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
        <Skeleton className="h-[100px] w-full" />
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
