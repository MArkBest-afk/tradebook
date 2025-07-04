"use client"

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useAppContext } from "@/contexts/app-context";
import { useLanguage } from "@/contexts/language-context";
import { ArrowRight, Bot, DollarSign, BarChart } from "lucide-react";

const onboardingSteps = [
    {
        icon: DollarSign,
        titleKey: "onboarding_demo_account_title",
        descriptionKey: "onboarding_demo_account_text",
    },
    {
        icon: BarChart,
        titleKey: "onboarding_trade_panel_title",
        descriptionKey: "onboarding_trade_panel_text",
    },
    {
        icon: Bot,
        titleKey: "onboarding_ai_assistant_title",
        descriptionKey: "onboarding_ai_assistant_text",
    },
    {
        icon: ArrowRight,
        titleKey: "onboarding_finish_title",
        descriptionKey: "onboarding_finish_text",
    }
];

export function Onboarding() {
    const { completeOnboarding } = useAppContext();
    const { t } = useLanguage();
    const [step, setStep] = useState(0);

    const currentStep = onboardingSteps[step];
    const Icon = currentStep.icon;

    const handleNext = () => {
        if (step < onboardingSteps.length - 1) {
            setStep(step + 1);
        } else {
            completeOnboarding();
        }
    };

    const handleBack = () => {
        if (step > 0) {
            setStep(step - 1);
        }
    };

    return (
        <Dialog open={true}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <div className="flex justify-center items-center h-12 w-12 rounded-full bg-primary/10 mx-auto mb-4">
                        <Icon className="h-6 w-6 text-primary" />
                    </div>
                    <DialogTitle className="text-center">{t('onboarding_welcome_title')}</DialogTitle>
                    <DialogDescription className="text-center">
                        {t('onboarding_welcome_text')}
                    </DialogDescription>
                </DialogHeader>

                <div className="py-4 text-center">
                    <h3 className="font-semibold text-lg mb-2">{t(currentStep.titleKey)}</h3>
                    <p className="text-sm text-muted-foreground">{t(currentStep.descriptionKey)}</p>
                </div>
                
                <div className="flex justify-center items-center space-x-2 my-4">
                    {onboardingSteps.map((_, index) => (
                        <div key={index} className={`h-2 w-2 rounded-full ${index === step ? 'bg-primary' : 'bg-muted'}`} />
                    ))}
                </div>

                <DialogFooter className={step > 0 ? "sm:justify-between" : "sm:justify-end"}>
                    {step > 0 && (
                        <Button variant="outline" onClick={handleBack}>{t('previous_step')}</Button>
                    )}
                    <Button onClick={handleNext} className="w-full sm:w-auto">
                        {step === onboardingSteps.length - 1 ? t('finish_onboarding') : t('next_step')}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
