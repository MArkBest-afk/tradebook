"use client"

import { useState } from "react"
import { AccountOverview } from "@/components/dashboard/account-overview"
import { AIAssistant } from "@/components/dashboard/ai-assistant"
import { TradeHistory } from "@/components/dashboard/trade-history"
import { TradePanel } from "@/components/dashboard/trade-panel"
import { TradingChart } from "@/components/dashboard/trading-chart"

export default function DashboardPage() {
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
