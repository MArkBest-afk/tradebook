"use client"

import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { useLanguage } from "@/contexts/language-context"
import { useTrading } from "@/contexts/trading-context"
import { Landmark } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { Separator } from "../ui/separator"
import Link from "next/link"

export function AccountOverview() {
  const { t } = useLanguage()
  const { balance, dailyProfit, remainingTime, isTimeLimitReached } = useTrading()
  const { toast } = useToast()

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(value);
  }
  
  const handleWithdraw = () => {
    toast({
      title: t('withdraw_funds_title'),
      description: t('withdraw_funds_notification'),
      duration: 10000,
    })
  }

  const formatTime = (totalSeconds: number) => {
    if (totalSeconds <= 0) return '00:00:00';
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = Math.floor(totalSeconds % 60);

    return [hours, minutes, seconds]
        .map(v => v < 10 ? '0' + String(v) : String(v))
        .join(':');
  };

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
            <p className={`text-lg font-semibold ${dailyProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {formatCurrency(dailyProfit)}
            </p>
          </div>
        </div>
        <Separator className="my-4" />
        <div className="text-center">
          {isTimeLimitReached ? (
            <p className="text-sm text-destructive font-semibold px-4">{t('trading_limit_reached_description')}</p>
          ) : (
            <div className="space-y-1">
              <p className="text-sm font-semibold uppercase text-muted-foreground">{t('demo_account')}</p>
              <p className="text-3xl font-mono font-bold text-primary">{formatTime(remainingTime)}</p>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="pt-4 flex flex-col gap-4">
        <Button onClick={handleWithdraw} className="w-full bg-emerald-600 hover:bg-emerald-700 text-lg h-12">
            {t('withdraw_funds_button')}
        </Button>
        <Link href="/payment" passHref className="w-full">
          <Button variant="outline" className="w-full text-lg h-12">
              {t('switch_to_real_account_button')}
          </Button>
        </Link>
      </CardFooter>
    </Card>
  )
}
