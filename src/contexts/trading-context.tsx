"use client";

import { createContext, useContext, ReactNode, useCallback, useEffect, useState, useMemo, useRef } from 'react';
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
  remainingTime: number;
}

const TradingContext = createContext<TradingContextType | undefined>(undefined);

const INITIAL_BALANCE = 150;
const INITIAL_TRADES: CompletedTrade[] = [];
const TRADING_TIME_LIMIT_SECONDS = 6 * 60 * 60; // 6 hours in seconds

let tradeCounter = 0;

// Helper function to shuffle an array (Fisher-Yates shuffle)
function shuffleArray(array: any[]) {
    const newArr = [...array];
    for (let i = newArr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArr[i], newArr[j]] = [newArr[j], newArr[i]];
    }
    return newArr;
}

export function TradingProvider({ children }: { children: ReactNode }) {
  const [balance, setBalance] = useLocalStorage<number>('trading-balance-v6', INITIAL_BALANCE);
  const [trades, setTrades] = useLocalStorage<CompletedTrade[]>('trading-trades-v6', INITIAL_TRADES);
  const [isTrading, setIsTrading] = useLocalStorage<boolean>('is-trading-v5', false);
  const [currentPrice, setCurrentPrice] = useState(50000);
  const [totalTradingTime, setTotalTradingTime] = useLocalStorage<number>('trading-time-v3', 0);
  const [sessionStartTime, setSessionStartTime] = useState<number | null>(null);
  const [remainingTime, setRemainingTime] = useState(TRADING_TIME_LIMIT_SECONDS - totalTradingTime);

  const balanceRef = useRef(balance);
  const currentPriceRef = useRef(currentPrice);

  useEffect(() => {
    balanceRef.current = balance;
  }, [balance]);

  useEffect(() => {
    currentPriceRef.current = currentPrice;
  }, [currentPrice]);


  const { toast } = useToast();
  const { t } = useLanguage();
  const { selectedBot } = useAppContext();
  
  const shuffledNamesRef = useRef(shuffleArray(names));

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
        variant: 'default',
        title: t('trade_closed_title'),
        description: t('trade_closed_description')
          .replace('{profit}', `${trade.profit.toFixed(2)} €`)
          .replace('{symbol}', trade.symbol),
    });
  }, [setBalance, setTrades, toast, t]);


  const runBotTrade = useCallback(() => {
    // Trades are opened for an amount in the range of 16-25 EUR.
    const tradeValueEur = 16 + Math.random() * 9; 

    if (balanceRef.current < tradeValueEur) {
      console.log("Not enough balance for a new trade.");
      return;
    }

    const isProfitable = Math.random() < 0.8; // 80% chance for profit
    
    // Profit is in the range of 0.5 - 2.5 EUR
    const profitAmount = 0.5 + Math.random() * 2;
    const profit = isProfitable ? profitAmount : -(profitAmount / 2); // Loss is half of the potential profit

    // Simulate price fluctuation for buy/sell
    const newPrice = currentPriceRef.current * (1 + (Math.random() - 0.49) * 0.02); // Fluctuate up to 1% up or down
    setCurrentPrice(newPrice);
    
    const buyPrice = newPrice;
    const cryptoAmount = tradeValueEur / buyPrice;

    // Calculate sell price based on profit
    const sellPrice = buyPrice + (profit / cryptoAmount);
    
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

  }, [addCompletedTrade]);


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
    let interval: NodeJS.Timeout | undefined;
    if (isTrading && selectedBot && sessionStartTime) {
      // Run the first trade immediately
      runBotTrade();
      
      interval = setInterval(() => {
        const elapsed = (Date.now() - sessionStartTime) / 1000;
        if (totalTradingTime + elapsed >= TRADING_TIME_LIMIT_SECONDS) {
            stopTrading();
            showTimeLimitToast();
        } else {
            runBotTrade();
        }
      }, 20000 + Math.random() * 40000); // 20s to 60s
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isTrading, selectedBot, runBotTrade, sessionStartTime, totalTradingTime, stopTrading, showTimeLimitToast]);

  // Effect for the countdown timer
  useEffect(() => {
    let timerInterval: NodeJS.Timeout | undefined;

    const updateRemainingTime = () => {
      if (isTrading && sessionStartTime) {
        const sessionDuration = (Date.now() - sessionStartTime) / 1000;
        const newRemaining = TRADING_TIME_LIMIT_SECONDS - (totalTradingTime + sessionDuration);
        setRemainingTime(Math.max(0, newRemaining));
      } else {
        const newRemaining = TRADING_TIME_LIMIT_SECONDS - totalTradingTime;
        setRemainingTime(Math.max(0, newRemaining));
      }
    };
    
    if (isTrading) {
      timerInterval = setInterval(updateRemainingTime, 1000);
    } else {
      updateRemainingTime();
    }
    
    return () => {
      if (timerInterval) {
        clearInterval(timerInterval);
      }
    };
  }, [isTrading, sessionStartTime, totalTradingTime]);

  const getUniqueName = useCallback(() => {
    if (shuffledNamesRef.current.length === 0) {
      shuffledNamesRef.current = shuffleArray(names);
    }
    return shuffledNamesRef.current.pop()!;
  }, []);

  useEffect(() => {
    if (!isTrading || !sessionStartTime) {
      return;
    }

    let timeoutId: NodeJS.Timeout;

    const showRandomWithdrawal = () => {
      // Check again inside timeout in case trading stopped
      if (!isTrading || !sessionStartTime) {
        return;
      }

      const randomName = getUniqueName();
      const randomAmount = Math.floor(Math.random() * (399 - 53 + 1)) + 53;
      const amountString = new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(randomAmount);
      
      const descriptionText = t('withdrawal_notification_description')
        .replace('{name}', randomName)
        .replace('{amount}', amountString);

      toast({
        position: 'top-right',
        variant: 'info',
        title: <span className="font-bold text-white">{t('withdrawal_notification_title')}</span>,
        description: <span className="font-bold text-white">{descriptionText}</span>,
        duration: 3000,
      });

      const elapsedSeconds = (Date.now() - sessionStartTime) / 1000;
      let nextInterval;

      if (elapsedSeconds < 300) { // First 5 minutes
        nextInterval = 30000 + Math.random() * 5000; // 30-35 seconds
      } else {
        nextInterval = 25000 + Math.random() * 35000; // 25-60 seconds
      }

      timeoutId = setTimeout(showRandomWithdrawal, nextInterval);
    };

    // Determine the first timeout interval
    const calculateFirstInterval = () => {
        const elapsedSeconds = (Date.now() - sessionStartTime) / 1000;
        if (elapsedSeconds < 300) {
            return 30000 + Math.random() * 5000; // 30-35s
        } else {
            return 25000 + Math.random() * 35000; // 25-60s
        }
    };
    
    timeoutId = setTimeout(showRandomWithdrawal, calculateFirstInterval());

    return () => clearTimeout(timeoutId);
  }, [isTrading, t, toast, getUniqueName, sessionStartTime]);


  const value = {
    balance,
    trades,
    isTrading,
    startTrading,
    stopTrading,
    dailyProfit,
    isTimeLimitReached,
    remainingTime,
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
