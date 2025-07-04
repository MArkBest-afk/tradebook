"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useLanguage } from "@/contexts/language-context";
import { useTrading } from "@/contexts/trading-context";
import { TrendingUp, TrendingDown } from "lucide-react";

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(value);
};

export default function TradeHistoryPage() {
  const { t } = useLanguage();
  const { trades } = useTrading();

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('trade_history')}</CardTitle>
        <CardDescription>A complete log of all your trades.</CardDescription>
      </CardHeader>
      <CardContent>
        {trades.length > 0 ? (
          <div className="space-y-4">
            {trades.map((trade) => (
              <div key={trade.id} className="flex items-center gap-4 p-2 rounded-lg hover:bg-muted/50">
                <div className={`p-3 rounded-full ${trade.type === 'buy' ? 'bg-green-100 dark:bg-green-900/50' : 'bg-red-100 dark:bg-red-900/50'}`}>
                    {trade.type === 'buy' ? <TrendingUp className="h-5 w-5 text-green-600 dark:text-green-400" /> : <TrendingDown className="h-5 w-5 text-red-600 dark:text-red-400" />}
                </div>
                <div className="flex-grow">
                    <p className="font-medium">
                      <span className={`capitalize font-semibold ${trade.type === 'buy' ? 'text-green-600' : 'text-red-600'}`}>{t(trade.type)}</span> {trade.amount.toFixed(2)} of {trade.symbol}
                    </p>
                    <p className="text-sm text-muted-foreground">
                        at {formatCurrency(trade.price)}
                    </p>
                </div>
                <div className="text-right">
                    <p className="text-sm text-muted-foreground">
                      {new Date(trade.timestamp).toLocaleDateString()}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(trade.timestamp).toLocaleTimeString()}
                    </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground text-center py-8">{t('no_trades_yet')}</p>
        )}
      </CardContent>
    </Card>
  );
}
