"use client"

import React, { useState } from "react"
import { AccountOverview } from "@/components/dashboard/account-overview"
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
import { AIAssistant } from "@/components/dashboard/ai-assistant"
import { TradingChart } from "@/components/dashboard/trading-chart"
import { TradePanel } from "@/components/dashboard/trade-panel"
import { Settings } from "@/components/settings"

function TradingControls() {
  const { isTrading, startTrading, stopTrading, isTimeLimitReached } = useTrading();
  const { t } = useLanguage();

  if (isTimeLimitReached) {
    return (
      <Card>
        <CardContent className="pt-6">
          <Button disabled className="w-full bg-destructive/50 text-lg h-12">
            {t('trading_locked')}
          </Button>
        </CardContent>
      </Card>
    );
  }

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
  const [currentPrice, setCurrentPrice] = useState(0);

  const handlePriceUpdate = (price: number) => {
    if (price) {
        setCurrentPrice(price);
    }
  };
  
  return (
    <div className="w-full max-w-2xl mx-auto space-y-6">
      <AccountOverview />
      <TradingControls />
      <AIAssistant />
      <TradingChart onPriceUpdate={handlePriceUpdate} />
      {currentPrice > 0 && <TradePanel currentPrice={currentPrice} />}
      <TradeHistory />
      <Settings />
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
      <div className="w-full max-w-2xl mx-auto space-y-6">
        <Skeleton className="h-[280px] w-full" />
        <Skeleton className="h-[88px] w-full" />
        <Skeleton className="h-[240px] w-full" />
        <Skeleton className="h-[500px] w-full" />
        <Skeleton className="h-[300px] w-full" />
        <Skeleton className="h-[420px] w-full" />
        <Skeleton className="h-[250px] w-full" />
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
