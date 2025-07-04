"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useLanguage } from "@/contexts/language-context"
import { useTrading } from "@/contexts/trading-context"
import { Landmark } from "lucide-react"

export function AccountOverview() {
  const { t } = useLanguage()
  const { balance } = useTrading()

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(value);
  }

  // Dummy value for profit
  const profit24h = 12.75; 

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{t('account_overview')}</CardTitle>
        <Landmark className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <p className="text-xs text-muted-foreground">{t('balance')}</p>
            <p className="text-2xl font-bold">{formatCurrency(balance)}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">{t('profit_24h')}</p>
            <p className={`text-lg font-semibold ${profit24h >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {formatCurrency(profit24h)}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
