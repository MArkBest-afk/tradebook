"use client";

import { createContext, useContext, ReactNode, useCallback, useEffect, useState } from 'react';
import type { Trade } from '@/lib/types';
import { useLocalStorage } from '@/hooks/use-local-storage';
import { useToast } from '@/hooks/use-toast';
import { useAppContext } from './app-context';

interface TradingContextType {
  balance: number;
  trades: Trade[];
  executeTrade: (trade: Omit<Trade, 'id' | 'timestamp'>) => void;
  isTrading: boolean;
  startTrading: () => void;
  stopTrading: () => void;
}

const TradingContext = createContext<TradingContextType | undefined>(undefined);

const INITIAL_BALANCE = 150;
const INITIAL_TRADES: Trade[] = [];

let tradeCounter = 0;

export function TradingProvider({ children }: { children: ReactNode }) {
  const [balance, setBalance] = useLocalStorage<number>('trading-balance-v3', INITIAL_BALANCE);
  const [trades, setTrades] = useLocalStorage<Trade[]>('trading-trades-v3', INITIAL_TRADES);
  const [isTrading, setIsTrading] = useLocalStorage<boolean>('is-trading-v3', false);
  const [currentPrice, setCurrentPrice] = useState(50000);

  const { toast } = useToast();
  const { selectedBot } = useAppContext();

  const executeTrade = useCallback((trade: Omit<Trade, 'id' | 'timestamp'>) => {
    const cost = trade.amount * trade.price;
    const timestamp = Date.now();
    tradeCounter += 1;

    const newTrade: Trade = {
      ...trade,
      id: `${timestamp}-${tradeCounter}`,
      timestamp: timestamp,
    };

    setBalance(prevBalance => {
      if (trade.type === 'buy' && prevBalance < cost) {
        toast({
          title: 'Error',
          description: 'Not enough balance to execute trade.',
          variant: 'destructive',
        });
        return prevBalance;
      }
      
      setTrades(prevTrades => [newTrade, ...prevTrades]);

      if (trade.type === 'sell') {
         toast({
          title: 'Trade Closed',
          description: `Sold ${trade.amount.toFixed(2)} ${trade.symbol} at €${trade.price.toFixed(2)}`,
        });
      }

      return trade.type === 'buy' ? prevBalance - cost : prevBalance + cost;
    });
  }, [setBalance, setTrades, toast]);

  const runBotTrade = useCallback(() => {
    if (!selectedBot) return;

    let minAmount: number, maxAmount: number;

    switch (selectedBot) {
      case 'cautious':
        minAmount = 10; maxAmount = 15;
        break;
      case 'balanced':
        minAmount = 16; maxAmount = 25;
        break;
      case 'high-yield':
        minAmount = 26; maxAmount = 45;
        break;
      default:
        return;
    }

    const tradeAmount = minAmount + Math.random() * (maxAmount - minAmount);
    const isProfitable = Math.random() < 0.8; // 80% chance for profit, within 70-85% range
    const profitMargin = 0.1 + Math.random() * 0.1; // 10-20%

    setCurrentPrice(prevPrice => {
      const buyPrice = prevPrice * (1 + (Math.random() - 0.5) * 0.01); // Fluctuate price slightly
      const sellPrice = isProfitable ? buyPrice * (1 + profitMargin) : buyPrice * (1 - profitMargin);
      
      const baseTrade = {
        symbol: 'BTC/EUR',
        amount: tradeAmount,
      };

      executeTrade({
        ...baseTrade,
        type: 'buy',
        price: buyPrice,
      });

      setTimeout(() => {
        executeTrade({
          ...baseTrade,
          type: 'sell',
          price: sellPrice,
        });
      }, 3000 + Math.random() * 4000);

      return buyPrice;
    });
  }, [selectedBot, executeTrade]);

  useEffect(() => {
    if (isTrading && selectedBot) {
      const randomInterval = 20000 + Math.random() * 40000; // 20s to 60s
      const intervalId = setInterval(runBotTrade, randomInterval);
      return () => clearInterval(intervalId);
    }
  }, [isTrading, selectedBot, runBotTrade]);


  const startTrading = () => setIsTrading(true);
  const stopTrading = () => setIsTrading(false);

  const value = {
    balance,
    trades,
    executeTrade,
    isTrading,
    startTrading,
    stopTrading,
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
