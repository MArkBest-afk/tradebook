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

// Helper to shuffle an array
const shuffleArray = (arr: any[]) => [...arr].sort(() => 0.5 - Math.random());


const generateLeaderboardData = (): LeaderboardEntry[] => {
    // 1. Define mandatory names
    const mandatoryNames = ['Ivan', 'Maria', 'Alexandr'];

    // 2. Get the rest of the names, excluding mandatory ones to ensure uniqueness
    const otherNames = names.filter(name => !mandatoryNames.includes(name));
    
    // 3. Pick 7 other names
    const pickedOtherNames = shuffleAndPick(otherNames, 7);

    // 4. Create two groups of people: mandatory and others
    const topGroup = shuffleArray(mandatoryNames);
    const otherGroup = shuffleArray(pickedOtherNames);

    // 5. Generate amounts: 3 high values for the top group, 7 lower for others
    const topAmounts = [
        2500 + Math.random() * (3972 - 2500),
        1500 + Math.random() * (2499 - 1500),
        1000 + Math.random() * (1499 - 1000),
    ].sort((a,b) => b-a);

    const otherAmounts: number[] = [];
    for (let i = 0; i < 7; i++) {
        otherAmounts.push(512 + Math.random() * (999 - 512));
    }
    otherAmounts.sort((a,b) => b-a);
    
    // 6. Combine names with amounts
    const topThree = topGroup.map((name, index) => ({ name, amount: topAmounts[index] }));
    const bottomSeven = otherGroup.map((name, index) => ({ name, amount: otherAmounts[index] }));
    
    // 7. Combine both groups and sort by amount to assign ranks
    const leaderboardData = [...topThree, ...bottomSeven].sort((a, b) => b.amount - a.amount);

    return leaderboardData.map((entry, index) => ({
        rank: index + 1,
        name: entry.name,
        amount: parseFloat(entry.amount.toFixed(2)),
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
