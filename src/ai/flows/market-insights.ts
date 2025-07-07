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
  pastTrades: z.string().describe("The user's past trading history."),
  selectedBot: z.string().describe('The selected trading bot strategy: "cautious", "balanced", or "high-yield".'),
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
  Your recommendation should align with the user's selected trading bot strategy: {{{selectedBot}}}.
  - Cautious: Prioritize capital preservation, suggest smaller, safer trades.
  - Balanced: A mix of growth and safety.
  - High-yield: Aim for higher returns, accepting higher risk.

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
    const {output} = await prompt(input, { model: ai.model });
    return output!;
  }
);
