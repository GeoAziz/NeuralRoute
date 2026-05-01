'use server';
/**
 * @fileOverview A Genkit flow for generating a text response from an LLM.
 *
 * - generateLlmResponse - A function that handles the LLM response generation.
 * - GenerateLlmResponseInput - The input type for the generateLlmResponse function.
 * - GenerateLlmResponseOutput - The return type for the generateLlmResponse function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateLlmResponseInputSchema = z
  .string()
  .describe('The user prompt for the LLM.');
export type GenerateLlmResponseInput = z.infer<typeof GenerateLlmResponseInputSchema>;

const GenerateLlmResponseOutputSchema = z
  .string()
  .describe('The generated response from the LLM.');
export type GenerateLlmResponseOutput = z.infer<typeof GenerateLlmResponseOutputSchema>;

export async function generateLlmResponse(
  input: GenerateLlmResponseInput
): Promise<GenerateLlmResponseOutput> {
  return generateLlmResponseFlow(input);
}

const generateLlmResponsePrompt = ai.definePrompt({
  name: 'generateLlmResponsePrompt',
  input: {schema: GenerateLlmResponseInputSchema},
  output: {schema: GenerateLlmResponseOutputSchema},
  prompt: `You are a helpful and concise AI assistant. Respond to the user's request.\n  \n  User request:\n  {{{input}}}`,
});

const generateLlmResponseFlow = ai.defineFlow(
  {
    name: 'generateLlmResponseFlow',
    inputSchema: GenerateLlmResponseInputSchema,
    outputSchema: GenerateLlmResponseOutputSchema,
  },
  async (input) => {
    const {output} = await generateLlmResponsePrompt(input);
    return output!;
  }
);
