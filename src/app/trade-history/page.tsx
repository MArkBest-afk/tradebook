"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useLanguage } from "@/contexts/language-context";
import { useTrading } from "@/contexts/trading-context";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

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
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t('asset')}</TableHead>
                <TableHead>{t('open_time')}</TableHead>
                <TableHead>{t('close_time')}</TableHead>
                <TableHead>{t('date')}</TableHead>
                <TableHead className="text-right">{t('profit')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {trades.map((trade) => (
                <TableRow key={trade.id}>
                  <TableCell className="font-medium">{trade.symbol}</TableCell>
                  <TableCell>{new Date(trade.buyTimestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</TableCell>
                  <TableCell>{new Date(trade.sellTimestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</TableCell>
                  <TableCell>{new Date(trade.sellTimestamp).toLocaleDateString()}</TableCell>
                  <TableCell className={`text-right font-semibold ${trade.profit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {formatCurrency(trade.profit)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <p className="text-sm text-muted-foreground text-center py-8">{t('no_trades_yet')}</p>
        )}
      </CardContent>
    </Card>
  );
}
