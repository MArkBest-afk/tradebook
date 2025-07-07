
"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useLanguage } from "@/contexts/language-context";
import { names } from '@/lib/data';
import { useLocalStorage } from '@/hooks/use-local-storage';
import { Skeleton } from '@/components/ui/skeleton';

type LeaderboardEntry = {
  rank: number;
  name: string;
  amount: number;
};

type CachedLeaderboard = {
  timestamp: number;
  data: LeaderboardEntry[];
};

// Helper to shuffle array and pick N items
const shuffleAndPick = (arr: string[], count: number): string[] => {
    const shuffled = [...arr].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
};

const generateLeaderboardData = (): LeaderboardEntry[] => {
    const topNames = shuffleAndPick(names, 10);
    
    const maxAmount = 1000 + Math.random() * (3972 - 1000);
    const minAmount = 512 + Math.random() * (814 - 512);

    const amounts = [maxAmount, minAmount];
    for (let i = 0; i < 8; i++) {
        amounts.push(minAmount + Math.random() * (maxAmount - minAmount));
    }

    amounts.sort((a, b) => b - a);

    return topNames.map((name, index) => ({
        rank: index + 1,
        name: name,
        amount: parseFloat(amounts[index].toFixed(2)),
    }));
};

const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2 }).format(value);
};


export default function LeaderboardPage() {
    const { t } = useLanguage();
    const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [cachedData, setCachedData] = useLocalStorage<CachedLeaderboard | null>('leaderboard-cache-v1', null);

    useEffect(() => {
        const now = Date.now();
        const oneDay = 24 * 60 * 60 * 1000;

        if (cachedData && (now - cachedData.timestamp < oneDay)) {
            setLeaderboard(cachedData.data);
        } else {
            const newData = generateLeaderboardData();
            setLeaderboard(newData);
            setCachedData({ timestamp: now, data: newData });
        }
        setIsLoading(false);
    }, [cachedData, setCachedData]);

    if (isLoading) {
        return (
            <Card>
                <CardHeader>
                    <Skeleton className="h-8 w-3/4" />
                    <Skeleton className="h-4 w-1/2 mt-2" />
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {[...Array(10)].map((_, i) => (
                            <div key={i} className="flex items-center space-x-4">
                                <Skeleton className="h-10 w-10" />
                                <Skeleton className="h-6 flex-1" />
                                <Skeleton className="h-6 w-1/4" />
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        )
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>{t('leaderboard_title')}</CardTitle>
                <CardDescription>{t('leaderboard_description')}</CardDescription>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[80px]">#</TableHead>
                            <TableHead>{t('name')}</TableHead>
                            <TableHead className="text-right">{t('withdrawal_amount')}</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {leaderboard.map((entry) => (
                            <TableRow key={entry.rank}>
                                <TableCell className="font-medium">{entry.rank}</TableCell>
                                <TableCell>{entry.name}</TableCell>
                                <TableCell className="text-right font-semibold text-green-600">{formatCurrency(entry.amount)}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
}
