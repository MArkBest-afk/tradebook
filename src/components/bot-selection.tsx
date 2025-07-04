"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAppContext } from "@/contexts/app-context";
import { useLanguage } from "@/contexts/language-context";
import type { BotType } from "@/lib/types";
import { Rocket, Shield, Scale } from "lucide-react";

const botOptions = [
    { type: 'cautious' as BotType, labelKey: 'cautious_bot', descriptionKey: 'cautious_bot_description', icon: Shield },
    { type: 'balanced' as BotType, labelKey: 'balanced_bot', descriptionKey: 'balanced_bot_description', icon: Scale },
    { type: 'high-yield' as BotType, labelKey: 'high_yield_bot', descriptionKey: 'high_yield_bot_description', icon: Rocket },
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
                <CardContent className="space-y-6">
                    {botOptions.map(bot => {
                        const Icon = bot.icon;
                        return (
                            <div key={bot.type}>
                                <Button className="w-full justify-start h-14 text-lg" variant="outline" onClick={() => selectBot(bot.type)}>
                                    <Icon className="mr-4 h-6 w-6" />
                                    {t(bot.labelKey)}
                                </Button>
                                <p className="text-sm text-muted-foreground mt-2 px-1 text-left">{t(bot.descriptionKey)}</p>
                            </div>
                        )
                    })}
                </CardContent>
            </Card>
        </div>
    );
}
