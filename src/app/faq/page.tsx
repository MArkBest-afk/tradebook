"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useLanguage } from "@/contexts/language-context";

const faqItems = Array.from({ length: 14 }, (_, i) => ({
  questionKey: `faq_q${i + 1}_question`,
  answerKey: `faq_q${i + 1}_answer`,
}));


export default function FaqPage() {
  const { t } = useLanguage();

  return (
    <Card className="max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle>{t('faq_title')}</CardTitle>
        <CardDescription>{t('faq_description')}</CardDescription>
      </CardHeader>
      <CardContent>
        <Accordion type="single" collapsible className="w-full">
          {faqItems.map((item, index) => (
            <AccordionItem key={index} value={`item-${index}`}>
              <AccordionTrigger className="text-left">{t(item.questionKey)}</AccordionTrigger>
              <AccordionContent className="whitespace-pre-wrap text-muted-foreground">
                {t(item.answerKey)}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </CardContent>
    </Card>
  );
}
