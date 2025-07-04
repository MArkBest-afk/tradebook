"use client"

import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useLanguage } from "@/contexts/language-context"
import { useTrading } from "@/contexts/trading-context"
import { Button } from "../ui/button"
import { Badge } from "../ui/badge"

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
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t('symbol')}</TableHead>
                <TableHead>{t('type')}</TableHead>
                <TableHead className="text-right">{t('price')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentTrades.map((trade) => (
                <TableRow key={trade.id}>
                  <TableCell className="font-medium">{trade.symbol}</TableCell>
                  <TableCell>
                    <Badge variant={trade.type === 'buy' ? 'default' : 'destructive'} className={`${trade.type === 'buy' ? 'bg-green-500' : 'bg-red-500'} text-white`}>
                      {t(trade.type)}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">${trade.price.toFixed(2)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <p className="text-sm text-muted-foreground">{t('no_trades_yet')}</p>
        )}
      </CardContent>
      <CardFooter className="justify-end">
        <Button asChild variant="link">
          <Link href="/trade-history">{t('view_all')}</Link>
        </Button>
      </CardFooter>
    </Card>
  )
}
