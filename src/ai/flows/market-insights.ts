'use server';

/**
 * @fileOverview An AI-powered market insights agent that provides trade recommendations based on market data and user's past trades.
 *
 * - getMarketInsights - A function that handles the market insights process.
 * - MarketInsightsInput - The input type for the getMarketInsights function.
 * - MarketInsightsOutput - The return type for the getMarketInsights function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const MarketInsightsInputSchema = z.object({
  marketData: z.string().describe('The current market data.'),
  pastTrades: z.string().describe('The user\'s past trading history.'),
});
export type MarketInsightsInput = z.infer<typeof MarketInsightsInputSchema>;

const MarketInsightsOutputSchema = z.object({
  recommendation: z.string().describe('The AI-driven trade recommendation.'),
  reasoning: z.string().describe('The reasoning behind the recommendation.'),
});
export type MarketInsightsOutput = z.infer<typeof MarketInsightsOutputSchema>;

export async function getMarketInsights(input: MarketInsightsInput): Promise<MarketInsightsOutput> {
  return marketInsightsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'marketInsightsPrompt',
  input: {schema: MarketInsightsInputSchema},
  output: {schema: MarketInsightsOutputSchema},
  prompt: `You are an AI trading assistant providing trade recommendations.

  Analyze the current market data and the user's past trades to provide an informed trade recommendation.
  Explain the reasoning behind your recommendation.

  Market Data: {{{marketData}}}
  Past Trades: {{{pastTrades}}}

  Format your repsonse as:
  Recommendation: <recommendation>
  Reasoning: <reasoning>`,
});

const marketInsightsFlow = ai.defineFlow(
  {
    name: 'marketInsightsFlow',
    inputSchema: MarketInsightsInputSchema,
    outputSchema: MarketInsightsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
