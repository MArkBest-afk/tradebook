"use client";

import { createContext, useContext, ReactNode, useCallback, useMemo } from 'react';
import type { Trade } from '@/lib/types';
import { useLocalStorage } from '@/hooks/use-local-storage';
import { useToast } from '@/hooks/use-toast';

interface TradingContextType {
  balance: number;
  trades: Trade[];
  executeTrade: (trade: Omit<Trade, 'id' | 'timestamp'>) => void;
}

const TradingContext = createContext<TradingContextType | undefined>(undefined);

const INITIAL_BALANCE = 150;

export function TradingProvider({ children }: { children: ReactNode }) {
  const [balance, setBalance] = useLocalStorage<number>('trading-balance', INITIAL_BALANCE);
  const initialTrades = useMemo(() => [], []);
  const [trades, setTrades] = useLocalStorage<Trade[]>('trading-trades', initialTrades);
  const { toast } = useToast();

  const executeTrade = useCallback((trade: Omit<Trade, 'id' | 'timestamp'>) => {
    const cost = trade.amount * trade.price;
    if (trade.type === 'buy' && balance < cost) {
      toast({
        title: 'Error',
        description: 'Not enough balance to execute trade.',
        variant: 'destructive',
      });
      return;
    }

    const newTrade: Trade = {
      ...trade,
      id: new Date().toISOString(),
      timestamp: Date.now(),
    };

    setTrades(prevTrades => [newTrade, ...prevTrades]);
    setBalance(prevBalance => trade.type === 'buy' ? prevBalance - cost : prevBalance + cost);

    toast({
      title: 'Trade Executed',
      description: `${trade.type.toUpperCase()} ${trade.amount} ${trade.symbol} at €${trade.price.toFixed(2)}`,
    });
  }, [balance, setBalance, setTrades, toast]);

  const value = {
    balance,
    trades,
    executeTrade,
  };

  return (
    <TradingContext.Provider value={value}>
      {children}
    </TradingContext.Provider>
  );
}

export function useTrading() {
  const context = useContext(TradingContext);
  if (context === undefined) {
    throw new Error('useTrading must be used within a TradingProvider');
  }
  return context;
}
