"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useLanguage } from "@/contexts/language-context"
import { useTrading } from "@/contexts/trading-context"
import { TrendingUp, TrendingDown } from "lucide-react"

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(value);
};

export function TradeHistory() {
  const { t } = useLanguage()
  const { trades } = useTrading()

  const recentTrades = trades.slice(0, 5);

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('recent_trades')}</CardTitle>
        <CardDescription>A summary of your most recent trades.</CardDescription>
      </CardHeader>
      <CardContent>
        {recentTrades.length > 0 ? (
          <div className="space-y-4">
            {recentTrades.map((trade) => (
              <div key={trade.id} className="flex items-center gap-4">
                <div className={`p-2 rounded-full ${trade.profit >= 0 ? 'bg-green-100 dark:bg-green-900/50' : 'bg-red-100 dark:bg-red-900/50'}`}>
                    {trade.profit >= 0 ? <TrendingUp className="h-5 w-5 text-green-600 dark:text-green-400" /> : <TrendingDown className="h-5 w-5 text-red-600 dark:text-red-400" />}
                </div>
                <div className="flex-grow">
                    <p className="font-medium">
                        {trade.symbol}
                    </p>
                    <p className={`text-sm font-semibold ${trade.profit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {formatCurrency(trade.profit)}
                    </p>
                </div>
                <div className="text-right text-sm text-muted-foreground">
                  <p>{new Date(trade.buyTimestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                  <p>{new Date(trade.sellTimestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
           <p className="text-sm text-muted-foreground text-center py-8">{t('no_trades_yet')}</p>
        )}
      </CardContent>
    </Card>
  )
}
