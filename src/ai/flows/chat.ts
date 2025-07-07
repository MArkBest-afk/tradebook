'use server';

import {ai} from '@/ai/genkit';
import { Language } from '@/lib/types';

// The chat history format expected by the component
export type ChatMessage = {
    role: 'user' | 'assistant';
    content: string;
};

export async function askChatbot(history: ChatMessage[], language: Language): Promise<string> {
  const {text} = await ai.generate({
    // Convert my component's history format to Genkit's format
    history: history.map(m => ({
        role: m.role === 'assistant' ? 'model' : 'user',
        content: [{text: m.content}]
    })),
    // System prompt to give the bot context
    system: `You are a helpful AI assistant for a trading application named 'Facebook AI'.
    Your purpose is to answer user questions about the application, trading concepts, and provide general assistance.
    Keep your answers friendly and concise.
    You MUST respond in the following language: ${language}.
    
    Key information about the app:
    - The user is on a demo account.
    - The demo account has a 6-hour time limit for trading.
    - To withdraw funds or switch to a real account, the user must contact their personal manager. This is a very important point.
    - The app has three trading bots: Cautious, Balanced, and High-yield.
    - There is a leaderboard page showing top withdrawals.
    `,
  });
  return text;
}
