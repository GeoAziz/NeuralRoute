'use server';
/**
 * @fileOverview A Genkit flow for running (simulated) LLM performance benchmarks.
 *
 * - runLlmBenchmarks - A function that simulates running performance evaluations on LLM providers.
 * - RunLlmBenchmarksInput - The input type for the runLlmBenchmarks function.
 * - RunLlmBenchmarksOutput - The return type for the runLlmBenchmarks function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

// Define the input schema (empty, as it's an automatic run)
const RunLlmBenchmarksInputSchema = z.object({});
export type RunLlmBenchmarksInput = z.infer<typeof RunLlmBenchmarksInputSchema>;

// Define the schema for a single benchmark result
const BenchmarkResultSchema = z.object({
  provider: z.enum(['Groq', 'NVIDIA NIM', 'Gemini']).describe('The name of the LLM provider.'),
  taskType: z.enum(['code', 'reasoning', 'summarisation', 'extraction', 'rag']).describe('The task type for the benchmark.'),
  qualityScore: z.number().min(3.2).max(4.8).describe('The simulated quality score (3.2-4.8).'),
  latencyMs: z.number().min(80).max(500).describe('The simulated latency in milliseconds.'),
});
export type BenchmarkResult = z.infer<typeof BenchmarkResultSchema>;

// Define the output schema (an array of benchmark results)
const RunLlmBenchmarksOutputSchema = z.array(BenchmarkResultSchema);
export type RunLlmBenchmarksOutput = z.infer<typeof RunLlmBenchmarksOutputSchema>;

// Helper function to generate a random number within a range
function getRandomNumber(min: number, max: number): number {
  return Math.random() * (max - min) + min;
}

const runLlmBenchmarksFlow = ai.defineFlow(
  {
    name: 'runLlmBenchmarksFlow',
    inputSchema: RunLlmBenchmarksInputSchema,
    outputSchema: RunLlmBenchmarksOutputSchema,
  },
  async (input) => {
    const providers = ['Groq', 'NVIDIA NIM', 'Gemini'] as const;
    const taskTypes = ['code', 'reasoning', 'summarisation', 'extraction', 'rag'] as const;

    const results: BenchmarkResult[] = [];

    for (const provider of providers) {
      for (const taskType of taskTypes) {
        let latencyMin: number;
        let latencyMax: number;

        // Set latency ranges based on provider
        switch (provider) {
          case 'Groq':
            latencyMin = 80;
            latencyMax = 250;
            break;
          case 'NVIDIA NIM':
            latencyMin = 120;
            latencyMax = 350;
            break;
          case 'Gemini':
            latencyMin = 200;
            latencyMax = 500;
            break;
          default:
            latencyMin = 100; // Default fallback
            latencyMax = 400;
        }

        const qualityScore = parseFloat(getRandomNumber(3.2, 4.8).toFixed(1));
        const latencyMs = Math.round(getRandomNumber(latencyMin, latencyMax));

        results.push({
          provider,
          taskType,
          qualityScore,
          latencyMs,
        });
      }
    }
    return results;
  }
);

export async function runLlmBenchmarks(
  input: RunLlmBenchmarksInput
): Promise<RunLlmBenchmarksOutput> {
  return runLlmBenchmarksFlow(input);
}
