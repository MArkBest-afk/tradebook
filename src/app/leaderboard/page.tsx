"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useLanguage } from "@/contexts/language-context";
import { names } from '@/lib/data';
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
    // 1. Define mandatory names
    const mandatoryNames = ['Ivan', 'Maria', 'Alexandr'];

    // 2. Get the rest of the names, excluding the mandatory ones to ensure uniqueness
    const otherNames = names.filter(name => !mandatoryNames.includes(name));
    
    // 3. Pick 7 other names
    const pickedOtherNames = shuffleAndPick(otherNames, 7);

    // 4. Combine and shuffle the final list of 10 names
    const topNames = [...mandatoryNames, ...pickedOtherNames].sort(() => 0.5 - Math.random());
    
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

    useEffect(() => {
        const cacheKey = 'leaderboard-cache-v1';
        const now = Date.now();
        const oneDay = 24 * 60 * 60 * 1000;

        try {
            const cachedItem = localStorage.getItem(cacheKey);
            if (cachedItem) {
                const cachedData: CachedLeaderboard = JSON.parse(cachedItem);
                if (now - cachedData.timestamp < oneDay) {
                    setLeaderboard(cachedData.data);
                    setIsLoading(false);
                    return; // Exit early if valid cache is found
                }
            }
        } catch (error) {
            console.error("Failed to read from localStorage", error);
        }

        // If no valid cache, generate new data
        const newData = generateLeaderboardData();
        const newCachedData: CachedLeaderboard = { timestamp: now, data: newData };
        
        try {
            localStorage.setItem(cacheKey, JSON.stringify(newCachedData));
        } catch (error) {
            console.error("Failed to write to localStorage", error);
        }
        
        setLeaderboard(newData);
        setIsLoading(false);
    }, []); // Empty dependency array ensures this runs only once on the client

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
