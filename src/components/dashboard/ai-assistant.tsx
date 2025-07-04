"use client"

import { useState } from "react"
import { Bot, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useLanguage } from "@/contexts/language-context"
import { useTrading } from "@/contexts/trading-context"
import { getMarketInsights, type MarketInsightsOutput } from "@/ai/flows/market-insights"
import { Skeleton } from "../ui/skeleton"

export function AIAssistant() {
  const { t } = useLanguage()
  const { trades } = useTrading()
  const [insight, setInsight] = useState<MarketInsightsOutput | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const fetchInsight = async () => {
    setIsLoading(true)
    setInsight(null)
    try {
      const pastTradesString = trades.length > 0
        ? trades.map(t => `${t.type} ${t.amount} ${t.symbol} at ${t.price}`).join(', ')
        : 'No past trades.';

      const marketData = "The S&P 500 is up 0.5% today, showing strong bullish momentum after a week of consolidation. Tech stocks are leading the rally, while energy stocks are lagging. Market sentiment is generally positive, but volatility remains a concern due to upcoming inflation data."

      const result = await getMarketInsights({
        marketData,
        pastTrades: pastTradesString,
      })
      setInsight(result)
    } catch (error) {
      console.error("Failed to get market insights:", error)
      setInsight({
        recommendation: "Error",
        reasoning: "Could not fetch AI insight. Please try again later."
      });
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
            <div>
                <CardTitle className="flex items-center gap-2">
                    <Bot className="h-5 w-5" />
                    {t('ai_assistant')}
                </CardTitle>
                <CardDescription>AI-powered trade recommendations</CardDescription>
            </div>
             <Button variant="ghost" size="icon" onClick={fetchInsight} disabled={isLoading}>
                <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            </Button>
        </div>
      </CardHeader>
      <CardContent className="min-h-[160px]">
        {isLoading && (
          <div className="space-y-4">
            <Skeleton className="h-4 w-1/3" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
          </div>
        )}
        {insight && !isLoading && (
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold">Recommendation:</h4>
              <p className="text-sm text-primary">{insight.recommendation}</p>
            </div>
            <div>
              <h4 className="font-semibold">Reasoning:</h4>
              <p className="text-sm text-muted-foreground">{insight.reasoning}</p>
            </div>
          </div>
        )}
         {!insight && !isLoading && (
            <div className="flex flex-col items-center justify-center text-center h-full">
                <p className="text-sm text-muted-foreground">Click the refresh button to get your first AI insight.</p>
            </div>
         )}
      </CardContent>
    </Card>
  )
}
