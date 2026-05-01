'use server';
/**
 * @fileOverview A Genkit flow for classifying a user prompt into a specific task type.
 *
 * - classifyPrompt - A function that handles the prompt classification process.
 * - ClassifyPromptInput - The input type for the classifyPrompt function.
 * - ClassifyPromptOutput - The return type for the classifyPrompt function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ClassifyPromptInputSchema = z.object({
  prompt: z.string().describe('The user prompt to classify.'),
});
export type ClassifyPromptInput = z.infer<typeof ClassifyPromptInputSchema>;

const ClassifyPromptOutputSchema = z.object({
  taskType: z
    .enum(['code', 'reasoning', 'summarisation', 'extraction', 'rag'])
    .describe(
      "The classified task type. One of 'code', 'reasoning', 'summarisation', 'extraction', or 'rag'."
    ),
  confidence: z
    .number()
    .min(0)
    .max(1)
    .describe('A confidence score (0-1) for the classification.'),
});
export type ClassifyPromptOutput = z.infer<typeof ClassifyPromptOutputSchema>;

export async function classifyPrompt(
  input: ClassifyPromptInput
): Promise<ClassifyPromptOutput> {
  return classifyPromptFlow(input);
}

const classifyPromptPrompt = ai.definePrompt({
  name: 'classifyPromptPrompt',
  input: {schema: ClassifyPromptInputSchema},
  output: {schema: ClassifyPromptOutputSchema},
  prompt: `You are an expert prompt classifier for an AI routing system.
Your goal is to classify the user's prompt into one of the following categories:
- 'code': The user is asking for code generation, explanation, or manipulation.
- 'reasoning': The user is asking for logical thinking, problem-solving, or complex analysis.
- 'summarisation': The user is asking to condense information.
- 'extraction': The user is asking to pull specific pieces of information from text.
- 'rag': The user is asking a question that implies retrieval augmented generation, usually involving external documents or knowledge bases.

Analyze the following user prompt and output its primary task type and a confidence score (between 0 and 1) that reflects your certainty in the classification. Only use the provided task types.

User Prompt: {{{prompt}}}`,
});

const classifyPromptFlow = ai.defineFlow(
  {
    name: 'classifyPromptFlow',
    inputSchema: ClassifyPromptInputSchema,
    outputSchema: ClassifyPromptOutputSchema,
  },
  async (input) => {
    const {output} = await classifyPromptPrompt(input);
    return output!;
  }
);
