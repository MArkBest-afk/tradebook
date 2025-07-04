export type Trade = {
  id: string;
  symbol: string;
  type: 'buy' | 'sell';
  amount: number;
  price: number;
  timestamp: number;
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
