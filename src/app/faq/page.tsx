"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useLanguage } from "@/contexts/language-context";

const faqItems = [
  {
    questionKey: "faq_q1_question",
    answerKey: "faq_q1_answer",
  },
  {
    questionKey: "faq_q2_question",
    answerKey: "faq_q2_answer",
  },
  {
    questionKey: "faq_q3_question",
    answerKey: "faq_q3_answer",
  },
  {
    questionKey: "faq_q4_question",
    answerKey: "faq_q4_answer",
  },
  {
    questionKey: "faq_q5_question",
    answerKey: "faq_q5_answer",
  },
];

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
              <AccordionTrigger>{t(item.questionKey)}</AccordionTrigger>
              <AccordionContent>{t(item.answerKey)}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </CardContent>
    </Card>
  );
}
