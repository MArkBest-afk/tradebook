"use client";

import { createContext, useContext, ReactNode, useCallback, useEffect, useState, useMemo } from 'react';
import type { CompletedTrade } from '@/lib/types';
import { useLocalStorage } from '@/hooks/use-local-storage';
import { useToast } from '@/hooks/use-toast';
import { useAppContext } from './app-context';
import { useLanguage } from './language-context';
import { names } from '@/lib/data';

interface TradingContextType {
  balance: number;
  trades: CompletedTrade[];
  isTrading: boolean;
  startTrading: () => void;
  stopTrading: () => void;
  dailyProfit: number;
  isTimeLimitReached: boolean;
}

const TradingContext = createContext<TradingContextType | undefined>(undefined);

const INITIAL_BALANCE = 150;
const INITIAL_TRADES: CompletedTrade[] = [];
const TRADING_TIME_LIMIT_SECONDS = 6 * 60 * 60; // 6 hours in seconds

let tradeCounter = 0;

export function TradingProvider({ children }: { children: ReactNode }) {
  const [balance, setBalance] = useLocalStorage<number>('trading-balance-v5', INITIAL_BALANCE);
  const [trades, setTrades] = useLocalStorage<CompletedTrade[]>('trading-trades-v5', INITIAL_TRADES);
  const [isTrading, setIsTrading] = useLocalStorage<boolean>('is-trading-v4', false);
  const [currentPrice, setCurrentPrice] = useState(50000);
  const [totalTradingTime, setTotalTradingTime] = useLocalStorage<number>('trading-time-v2', 0);
  const [sessionStartTime, setSessionStartTime] = useState<number | null>(null);

  const { toast } = useToast();
  const { t } = useLanguage();
  const { selectedBot } = useAppContext();

  const isTimeLimitReached = totalTradingTime >= TRADING_TIME_LIMIT_SECONDS;

  const dailyProfit = useMemo(() => {
    const now = Date.now();
    const twentyFourHoursAgo = now - 24 * 60 * 60 * 1000;
    
    return trades
      .filter(trade => trade.sellTimestamp > twentyFourHoursAgo)
      .reduce((sum, trade) => sum + trade.profit, 0);
  }, [trades]);

  const showTimeLimitToast = useCallback(() => {
    toast({
      title: t('trading_limit_reached_title'),
      description: t('trading_limit_reached_description'),
      duration: 10000,
      variant: 'destructive',
    });
  }, [t, toast]);

  const addCompletedTrade = useCallback((trade: CompletedTrade) => {
    setTrades(prevTrades => [trade, ...prevTrades]);
    setBalance(prevBalance => prevBalance + trade.profit);
    toast({
        title: t('trade_closed_title'),
        description: t('trade_closed_description')
          .replace('{profit}', `${trade.profit.toFixed(2)} €`)
          .replace('{symbol}', trade.symbol),
    });
  }, [setBalance, setTrades, toast, t]);


  const runBotTrade = useCallback(() => {
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
    }, sellTimestamp - buyTimestamp);

  }, [addCompletedTrade, currentPrice, balance]);


  const stopTrading = useCallback(() => {
      if (sessionStartTime) {
        const sessionDuration = (Date.now() - sessionStartTime) / 1000;
        setTotalTradingTime(prevTime => prevTime + sessionDuration);
        setSessionStartTime(null);
      }
      setIsTrading(false);
  }, [sessionStartTime, setIsTrading, setTotalTradingTime]);
  
  const startTrading = () => {
    if (isTimeLimitReached) {
      showTimeLimitToast();
      return;
    }
    setIsTrading(true);
    setSessionStartTime(Date.now());
  };

  useEffect(() => {
    // When the component loads, if it's already in a trading state, ensure sessionStartTime is set.
    // This handles page reloads during an active trading session.
    if (isTrading && !sessionStartTime) {
        setSessionStartTime(Date.now());
    }
  }, [isTrading, sessionStartTime]);

  useEffect(() => {
    if (isTrading && selectedBot && sessionStartTime) {
      const intervalId = setInterval(() => {
        const elapsed = (Date.now() - sessionStartTime) / 1000;
        if (totalTradingTime + elapsed >= TRADING_TIME_LIMIT_SECONDS) {
            stopTrading();
            showTimeLimitToast();
            clearInterval(intervalId);
        } else {
            runBotTrade();
        }
      }, 20000 + Math.random() * 40000); // 20s to 60s
      return () => clearInterval(intervalId);
    }
  }, [isTrading, selectedBot, runBotTrade, sessionStartTime, totalTradingTime, stopTrading, showTimeLimitToast]);

  useEffect(() => {
    if (!isTrading) {
      return;
    }

    let timeoutId: NodeJS.Timeout;

    const showRandomWithdrawal = () => {
      if (!isTrading) {
        return;
      }

      const randomName = names[Math.floor(Math.random() * names.length)];
      const randomAmount = Math.floor(Math.random() * (399 - 53 + 1)) + 53;
      const amountString = new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(randomAmount);
      
      const description = t('withdrawal_notification_description')
        .replace('{name}', randomName)
        .replace('{amount}', amountString);

      toast({
        title: t('withdrawal_notification_title'),
        description: description,
        duration: 5000,
      });

      const nextInterval = 45000 + Math.random() * 45000; // 45s to 90s
      timeoutId = setTimeout(showRandomWithdrawal, nextInterval);
    };

    const firstTimeout = 45000 + Math.random() * 45000;
    timeoutId = setTimeout(showRandomWithdrawal, firstTimeout);

    return () => clearTimeout(timeoutId);
  }, [isTrading, t, toast]);


  const value = {
    balance,
    trades,
    isTrading,
    startTrading,
    stopTrading,
    dailyProfit,
    isTimeLimitReached,
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
