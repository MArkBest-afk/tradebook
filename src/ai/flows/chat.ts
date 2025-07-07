'use server';

import {ai} from '@/ai/genkit';
import { Language } from '@/lib/types';

// The chat history format expected by the component
export type ChatMessage = {
    role: 'user' | 'assistant';
    content: string;
};

export async function askChatbot(history: ChatMessage[], language: Language): Promise<string> {
  // Filter out any messages that might be malformed to prevent errors.
  const cleanHistory = history.filter(m => m && typeof m.content === 'string');

  const {text} = await ai.generate({
    // Convert my component's history format to Genkit's format
    history: cleanHistory.map(m => ({
        role: m.role === 'assistant' ? 'model' : 'user',
        content: [{text: m.content}]
    })),
    // System prompt to give the bot context
    system: `You are a friendly and professional chat operator for 'Facebook AI', an AI-powered trading application.
Your main goal is to help users by answering their questions about the app and general trading topics.
Always be helpful and keep your answers clear and concise.
You MUST respond in the following language: ${language}.

Key information about the app:
- The user is on a demo account.
- The demo account has a 6-hour time limit for trading.
- To withdraw funds or switch to a real account, the user must contact their personal manager. This is a very important point.
- The app has three trading bots: Cautious, Balanced, and High-yield.
- There is a leaderboard page showing top withdrawals.
`,
  });
  // Ensure we always return a string, even if the AI response is empty.
  return text ?? "";
}
