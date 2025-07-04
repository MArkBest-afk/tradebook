"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useLanguage } from "@/contexts/language-context"
import { useTrading } from "@/contexts/trading-context"

export function TradePanel({ currentPrice }: { currentPrice: number }) {
  const { t } = useLanguage()
  const { executeTrade } = useTrading()
  const [amount, setAmount] = useState('10')
  const [activeTab, setActiveTab] = useState('buy')

  const handleExecuteTrade = () => {
    const tradeAmount = parseFloat(amount);
    if (!isNaN(tradeAmount) && tradeAmount > 0) {
      executeTrade({
        symbol: 'BTC/USD',
        type: activeTab as 'buy' | 'sell',
        amount: tradeAmount,
        price: currentPrice
      })
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('trade_panel')}</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="buy" className="w-full" onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="buy">{t('buy')}</TabsTrigger>
            <TabsTrigger value="sell">{t('sell')}</TabsTrigger>
          </TabsList>
          <div className="pt-6">
              <div className="space-y-2">
                  <Label htmlFor="amount">{t('amount')}</Label>
                  <Input 
                    id="amount" 
                    type="number" 
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="e.g. 10" 
                  />
              </div>
              <div className="mt-4 space-y-1 text-sm">
                <p className="flex justify-between"><span>Price:</span> <span>${currentPrice.toFixed(2)}</span></p>
                <p className="flex justify-between font-semibold"><span>Total:</span> <span>${(parseFloat(amount || '0') * currentPrice).toFixed(2)}</span></p>
              </div>
              <Button onClick={handleExecuteTrade} className="w-full mt-6">{t('execute_trade')}</Button>
          </div>
        </Tabs>
      </CardContent>
    </Card>
  )
}
