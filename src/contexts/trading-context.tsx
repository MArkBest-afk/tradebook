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
  const [isTrading, setIsTrading] = useLocalStorage<boolean>('is-trading-v6', false);
  
  const [demoEndTime, setDemoEndTime] = useLocalStorage<number | null>('demo-end-time-v1', null);
  const [remainingTime, setRemainingTime] = useState(TRADING_TIME_LIMIT_SECONDS);

  const balanceRef = useRef(balance);
  const isTradingRef = useRef(isTrading);

  useEffect(() => {
    balanceRef.current = balance;
  }, [balance]);

  useEffect(() => {
    isTradingRef.current = isTrading;
  }, [isTrading]);

  const { toast } = useToast();
  const { t } = useLanguage();
  const { selectedBot } = useAppContext();
  
  const shuffledNamesRef = useRef(shuffleArray(names));

  const isTimeLimitReached = useMemo(() => demoEndTime !== null && Date.now() >= demoEndTime, [demoEndTime]);

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
  
  const stopTrading = useCallback(() => {
    setIsTrading(false);
  }, [setIsTrading]);

  const addCompletedTrade = useCallback((trade: CompletedTrade) => {
    setTrades(prevTrades => [trade, ...prevTrades]);
    setBalance(prevBalance => prevBalance + trade.profit);
    toast({
        variant: 'info',
        title: t('trade_closed_title'),
        description: t('trade_closed_description')
          .replace('{profit}', `${trade.profit.toFixed(2)} €`)
          .replace('{symbol}', trade.symbol),
    });
  }, [setBalance, setTrades, toast, t]);


  const runBotTrade = useCallback(() => {
    const tradeValueEur = 16 + Math.random() * 9; 

    if (balanceRef.current < tradeValueEur) {
      console.log("Not enough balance for a new trade.");
      return;
    }

    const isProfitable = Math.random() < 0.8;
    const profitAmount = 0.5 + Math.random() * 2;
    const profit = isProfitable ? profitAmount : -(profitAmount / 2);

    const buyPrice = 50000 * (1 + (Math.random() - 0.49) * 0.05);
    const cryptoAmount = tradeValueEur / buyPrice;
    const sellPrice = buyPrice + (profit / cryptoAmount);
    
    const buyTimestamp = Date.now();
    const sellTimestamp = buyTimestamp + 3000 + Math.random() * 4000;

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

    setTimeout(() => {
      if (isTradingRef.current) {
        addCompletedTrade(newTrade);
      }
    }, sellTimestamp - buyTimestamp);
  }, [addCompletedTrade]);


  const startTrading = () => {
    if (demoEndTime && Date.now() >= demoEndTime) {
      showTimeLimitToast();
      return;
    }
    
    if (!demoEndTime) {
      setDemoEndTime(Date.now() + TRADING_TIME_LIMIT_SECONDS * 1000);
    }
    setIsTrading(true);
  };

  // Offline trading simulation logic
  useEffect(() => {
    const handleUnload = () => {
      if (isTradingRef.current) {
        window.localStorage.setItem('trading-last-seen-v4', JSON.stringify(Date.now()));
      }
    };
    window.addEventListener('beforeunload', handleUnload);

    const wasTrading = JSON.parse(window.localStorage.getItem('is-trading-v6') || 'false');
    const lastSeenRaw = window.localStorage.getItem('trading-last-seen-v4');

    if (wasTrading && lastSeenRaw && demoEndTime) {
      const lastSeenTimestamp = JSON.parse(lastSeenRaw);
      
      const effectiveEndTime = Math.min(Date.now(), demoEndTime);
      const offlineDurationMs = effectiveEndTime - lastSeenTimestamp;

      if (offlineDurationMs > 15000) { // More than 15s
        const simulationDurationMinutes = Math.min(offlineDurationMs / (1000 * 60), 60); // Cap at 1 hour
        const actualSimulationSeconds = simulationDurationMinutes * 60;

        if (actualSimulationSeconds > 0) {
          const tradesToSimulate = Math.floor(actualSimulationSeconds / 40); // Avg 40s per trade
          let totalOfflineProfit = 0;
          const newOfflineTrades: CompletedTrade[] = [];
          let tempBalance = balanceRef.current;

          for (let i = 0; i < tradesToSimulate; i++) {
            const tradeValueEur = 16 + Math.random() * 9;
            if (tempBalance < tradeValueEur) continue;

            const isProfitable = Math.random() < 0.8;
            const profitAmount = 0.5 + Math.random() * 2;
            const profit = isProfitable ? profitAmount : -(profitAmount / 2);

            const buyPrice = 50000 * (1 + (Math.random() - 0.49) * 0.05);
            const cryptoAmount = tradeValueEur / buyPrice;
            const sellPrice = buyPrice + (profit / cryptoAmount);
            const timestamp = lastSeenTimestamp + ((i + 1) * 40 * 1000);

            newOfflineTrades.push({
              id: `offline-${timestamp}-${i}`,
              symbol: 'BTC/EUR',
              amount: cryptoAmount,
              buyPrice,
              sellPrice,
              buyTimestamp: timestamp - 2000,
              sellTimestamp: timestamp,
              profit,
            });
            totalOfflineProfit += profit;
            tempBalance += profit;
          }

          if (newOfflineTrades.length > 0) {
            setBalance(prev => prev + totalOfflineProfit);
            setTrades(prev => [...newOfflineTrades.reverse(), ...prev]);
            
            const amountString = new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(totalOfflineProfit);
            const description = t('offline_earnings_report')
              .replace('{minutes}', Math.round(simulationDurationMinutes).toString())
              .replace('{amount}', amountString);
            
            toast({
              title: t('welcome_back_title'),
              description: description,
              duration: 15000,
              variant: 'info'
            });
          }
        }
      }
    }
    window.localStorage.removeItem('trading-last-seen-v4');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [demoEndTime]);


  // Bot trading effect
  useEffect(() => {
    let interval: NodeJS.Timeout | undefined;
    if (isTrading && demoEndTime && Date.now() < demoEndTime) {
      runBotTrade(); // Run first trade immediately
      
      interval = setInterval(() => {
        if (Date.now() >= demoEndTime) {
          stopTrading();
        } else {
          runBotTrade();
        }
      }, 20000 + Math.random() * 40000); // 20s to 60s
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isTrading, demoEndTime, runBotTrade, stopTrading]);


  // Countdown timer effect
  useEffect(() => {
    let timerInterval: NodeJS.Timeout | undefined;

    const updateRemainingTime = () => {
        if (!demoEndTime) {
            setRemainingTime(TRADING_TIME_LIMIT_SECONDS);
            return;
        }
        const now = Date.now();
        const newRemaining = Math.max(0, Math.floor((demoEndTime - now) / 1000));
        setRemainingTime(newRemaining);

        if (newRemaining <= 0) {
            if (isTradingRef.current) {
                stopTrading();
            }
            // Fire toast only when timer just hits 0, not on subsequent reloads
            const timeSinceExpiry = now - demoEndTime;
            if (timeSinceExpiry >= 0 && timeSinceExpiry < 2000) { // Check if expired within the last 2 seconds
                showTimeLimitToast();
            }
        }
    };
    
    timerInterval = setInterval(updateRemainingTime, 1000);
    updateRemainingTime(); // Initial call
    
    return () => {
      if (timerInterval) clearInterval(timerInterval);
    };
  }, [demoEndTime, stopTrading, showTimeLimitToast]);


  const getUniqueName = useCallback(() => {
    if (shuffledNamesRef.current.length === 0) {
      shuffledNamesRef.current = shuffleArray(names);
    }
    return shuffledNamesRef.current.pop()!;
  }, []);

  // Withdrawal notification effect
  useEffect(() => {
    if (!isTrading) return;

    let timeoutId: NodeJS.Timeout;

    const showRandomWithdrawal = () => {
      if (!isTradingRef.current) return;

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

      const nextInterval = 25000 + Math.random() * 35000;
      timeoutId = setTimeout(showRandomWithdrawal, nextInterval);
    };

    timeoutId = setTimeout(showRandomWithdrawal, 15000 + Math.random() * 10000);

    return () => clearTimeout(timeoutId);
  }, [isTrading, t, toast, getUniqueName]);


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

    