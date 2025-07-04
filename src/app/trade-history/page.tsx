"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/contexts/language-context";
import { useTrading } from "@/contexts/trading-context";

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
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t('symbol')}</TableHead>
                <TableHead>{t('type')}</TableHead>
                <TableHead>{t('amount')}</TableHead>
                <TableHead>{t('price')}</TableHead>
                <TableHead className="text-right">{t('date')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {trades.map((trade) => (
                <TableRow key={trade.id}>
                  <TableCell className="font-medium">{trade.symbol}</TableCell>
                  <TableCell>
                    <Badge variant={trade.type === 'buy' ? 'default' : 'destructive'} className={`${trade.type === 'buy' ? 'bg-green-500' : 'bg-red-500'} text-white`}>
                      {t(trade.type)}
                    </Badge>
                  </TableCell>
                  <TableCell>{trade.amount}</TableCell>
                  <TableCell>${trade.price.toFixed(2)}</TableCell>
                  <TableCell className="text-right">
                    {new Date(trade.timestamp).toLocaleString()}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <p className="text-sm text-muted-foreground">{t('no_trades_yet')}</p>
        )}
      </CardContent>
    </Card>
  );
}
