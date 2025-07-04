"use client"

import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { useLanguage } from "@/contexts/language-context"
import { useTrading } from "@/contexts/trading-context"
import { Button } from "../ui/button"
import { TrendingUp, TrendingDown } from "lucide-react"


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
                <div className={`p-2 rounded-full ${trade.type === 'buy' ? 'bg-green-100 dark:bg-green-900/50' : 'bg-red-100 dark:bg-red-900/50'}`}>
                    {trade.type === 'buy' ? <TrendingUp className="h-5 w-5 text-green-600 dark:text-green-400" /> : <TrendingDown className="h-5 w-5 text-red-600 dark:text-red-400" />}
                </div>
                <div className="flex-grow">
                    <p className="font-medium">
                        <span className={`capitalize font-semibold ${trade.type === 'buy' ? 'text-green-600' : 'text-red-600'}`}>{t(trade.type)}</span> of {trade.symbol}
                    </p>
                    <p className="text-sm text-muted-foreground">
                        at ${trade.price.toFixed(2)}
                    </p>
                </div>
                <p className="text-sm text-muted-foreground">
                  {new Date(trade.timestamp).toLocaleTimeString()}
                </p>
              </div>
            ))}
          </div>
        ) : (
           <p className="text-sm text-muted-foreground text-center py-8">{t('no_trades_yet')}</p>
        )}
      </CardContent>
      {trades.length > 5 && (
        <CardFooter className="justify-center border-t pt-4">
          <Button asChild variant="link">
            <Link href="/trade-history">{t('view_all')}</Link>
          </Button>
        </CardFooter>
      )}
    </Card>
  )
}
