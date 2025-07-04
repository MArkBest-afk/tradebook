"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAppContext } from "@/contexts/app-context";
import { useLanguage } from "@/contexts/language-context";
import type { BotType } from "@/lib/types";
import { Rocket, Shield, Scale } from "lucide-react";

const botOptions = [
    { type: 'cautious' as BotType, labelKey: 'cautious_bot', icon: Shield },
    { type: 'balanced' as BotType, labelKey: 'balanced_bot', icon: Scale },
    { type: 'high-yield' as BotType, labelKey: 'high_yield_bot', icon: Rocket },
]

export function BotSelection() {
    const { selectBot } = useAppContext();
    const { t } = useLanguage();

    return (
        <div className="flex items-center justify-center min-h-[80vh]">
            <Card className="w-full max-w-md">
                <CardHeader className="text-center">
                    <CardTitle>{t('bot_selection_title')}</CardTitle>
                    <CardDescription>{t('bot_selection_description')}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    {botOptions.map(bot => {
                        const Icon = bot.icon;
                        return (
                            <Button key={bot.type} className="w-full justify-start h-14 text-lg" variant="outline" onClick={() => selectBot(bot.type)}>
                                <Icon className="mr-4 h-6 w-6" />
                                {t(bot.labelKey)}
                            </Button>
                        )
                    })}
                </CardContent>
            </Card>
        </div>
    );
}
