export type CompletedTrade = {
  id: string;
  symbol: string;
  amount: number; // The amount of crypto traded
  buyPrice: number;
  sellPrice: number;
  buyTimestamp: number;
  sellTimestamp: number;
  profit: number; // The profit/loss in EUR
};

export type Language = 'en' | 'ru' | 'de' | 'bg' | 'pl' | 'mo' | 'sr';

export const languages: { value: Language; label: string }[] = [
    { value: 'en', label: 'English' },
    { value: 'ru', label: 'Русский' },
    { value: 'de', label: 'Deutsch' },
    { value: 'bg', label: 'Български' },
    { value: 'pl', label: 'Polski' },
    { value: 'mo', label: 'Moldovenesc' },
    { value: 'sr', label: 'Српски' },
];

export type BotType = 'cautious' | 'balanced' | 'high-yield';
