"use client";

import { createContext, useContext, ReactNode, useCallback, useEffect, useState, useMemo } from 'react';
import type { CompletedTrade } from '@/lib/types';
import { useLocalStorage } from '@/hooks/use-local-storage';
import { useToast } from '@/hooks/use-toast';
import { useAppContext } from './app-context';

interface TradingContextType {
  balance: number;
  trades: CompletedTrade[];
  isTrading: boolean;
  startTrading: () => void;
  stopTrading: () => void;
  dailyProfit: number;
}

const TradingContext = createContext<TradingContextType | undefined>(undefined);

const INITIAL_BALANCE = 150;
const INITIAL_TRADES: CompletedTrade[] = [];

let tradeCounter = 0;

export function TradingProvider({ children }: { children: ReactNode }) {
  const [balance, setBalance] = useLocalStorage<number>('trading-balance-v5', INITIAL_BALANCE);
  const [trades, setTrades] = useLocalStorage<CompletedTrade[]>('trading-trades-v5', INITIAL_TRADES);
  const [isTrading, setIsTrading] = useLocalStorage<boolean>('is-trading-v4', false);
  const [currentPrice, setCurrentPrice] = useState(50000);

  const { toast } = useToast();
  const { selectedBot } = useAppContext();

  const dailyProfit = useMemo(() => {
    const now = Date.now();
    const twentyFourHoursAgo = now - 24 * 60 * 60 * 1000;
    
    return trades
      .filter(trade => trade.sellTimestamp > twentyFourHoursAgo)
      .reduce((sum, trade) => sum + trade.profit, 0);
  }, [trades]);

  const addCompletedTrade = useCallback((trade: CompletedTrade) => {
    setTrades(prevTrades => [trade, ...prevTrades]);
    setBalance(prevBalance => prevBalance + trade.profit);
  }, [setBalance, setTrades]);


  const runBotTrade = useCallback(() => {
    if (!selectedBot) return;

    // Unified trading strategy for all bots.
    // Trades are opened for an amount in the range of 16-25 EUR.
    const tradeValueEur = 16 + Math.random() * 9; 

    if (balance < tradeValueEur) {
      console.log("Not enough balance for a new trade.");
      return;
    }

    const isProfitable = Math.random() < 0.8; // 80% chance for profit, within 70-85% range
    // Profit margin is 10-20% of the trade amount.
    const profitMargin = 0.1 + Math.random() * 0.1;

    // Simulate price fluctuation for buy/sell
    const newPrice = currentPrice * (1 + (Math.random() - 0.49) * 0.02); // Fluctuate up to 1% up or down
    setCurrentPrice(newPrice);
    
    const buyPrice = newPrice;
    const cryptoAmount = tradeValueEur / buyPrice;
    const sellPrice = isProfitable ? buyPrice * (1 + profitMargin) : buyPrice * (1 - (profitMargin / 2));
    
    const profit = (sellPrice - buyPrice) * cryptoAmount;
    
    const buyTimestamp = Date.now();
    const sellTimestamp = buyTimestamp + 3000 + Math.random() * 4000; // Sell 3-7 seconds later

    const newTrade: CompletedTrade = {
      id: `${Date.now()}-${tradeCounter++}`,
      symbol: 'BTC/EUR',
      amount: cryptoAmount,
      buyPrice,
      sellPrice,
      buyTimestamp,
      sellTimestamp,
      profit
    };

    // Use a timeout to simulate the delay between buying and selling
    setTimeout(() => {
        addCompletedTrade(newTrade);
        toast({
            title: 'Trade Closed',
            description: `Profit of ${profit.toFixed(2)} € from trading ${newTrade.symbol}`,
        });
    }, sellTimestamp - buyTimestamp);

  }, [selectedBot, addCompletedTrade, currentPrice, balance, toast]);

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
    isTrading,
    startTrading,
    stopTrading,
    dailyProfit,
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
