"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/language-context";
import Image from "next/image";
import { useToast } from "@/hooks/use-toast";

export default function PaymentPage() {
  const { t } = useLanguage();
  const { toast } = useToast();

  const handlePayment = (method: string) => {
    // In a real app, this would redirect to a payment gateway.
    toast({
      title: "Redirection",
      description: `Redirecting to ${method} payment gateway...`,
    });
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <Card>
        <CardHeader className="text-center">
          <CardTitle>{t('activate_real_account_title')}</CardTitle>
          <CardDescription>{t('activate_real_account_description')}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center p-4 rounded-lg bg-muted">
            <p className="text-sm text-muted-foreground">{t('deposit_amount')}</p>
            <p className="text-4xl font-bold">150 €</p>
          </div>
          <div className="space-y-4">
            <Button
              variant="outline"
              className="w-full h-20 justify-start text-lg p-4"
              onClick={() => handlePayment('Visa')}
            >
              <Image src="/visa-svgrepo-com.svg" width={80} height={48} alt="Visa" className="mr-4" />
              {t('visa')}
            </Button>
            <Button
              variant="outline"
              className="w-full h-20 justify-start text-lg p-4"
              onClick={() => handlePayment('Mastercard')}
            >
              <Image src="/mastercard-svgrepo-com.svg" width={80} height={48} alt="Mastercard" className="mr-4" />
              {t('mastercard')}
            </Button>
            <Button
              variant="outline"
              className="w-full h-20 justify-start text-lg p-4"
              onClick={() => handlePayment('SEPA')}
            >
              <Image src="/sepa-svgrepo-com.svg" width={80} height={48} alt="SEPA" className="mr-4" />
              {t('sepa')}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
