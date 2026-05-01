'use server';
/**
 * @fileOverview A Genkit flow for routing user prompts to the best LLM provider
 * based on classified task type and live performance benchmarks (mocked).
 *
 * - routeLlm - A function that handles the LLM routing decision and inference.
 * - RouteLlmInput - The input type for the routeLlm function.
 * - RouteLlmOutput - The return type for the routeLlm function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

// --- Schemas ---

const TaskTypeSchema = z.enum([
  'code',
  'reasoning',
  'summarisation',
  'extraction',
  'rag',
]);

const ProviderStatusSchema = z.enum(['active', 'degraded', 'down']);

// Represents a provider's benchmark data
const ProviderBenchmarkSchema = z.object({
  id: z.string(), // e.g., 'groq', 'nvidia-nim', 'gemini'
  name: z.string(), // e.g., 'Groq', 'NVIDIA NIM', 'Gemini'
  // modelId here is what the provider conceptually *would* use.
  // Due to Genkit setup, actual inference might use a substitute model.
  modelId: z.string(),
  status: ProviderStatusSchema,
  taskQuality: z.record(TaskTypeSchema, z.number().min(0).max(5)), // Quality score for each task type
  taskLatencyP50: z.record(TaskTypeSchema, z.number().min(0)), // Latency p50 for each task type (ms)
  rpmHeadroom: z.number().min(0).max(1), // Remaining RPM capacity (0 to 1)
});

export type ProviderBenchmark = z.infer<typeof ProviderBenchmarkSchema>;

const RouteLlmInputSchema = z.object({
  userPrompt: z.string().describe('The user’s input prompt.'),
  classifiedTaskType: TaskTypeSchema.describe(
    'The task type classified for the user prompt.'
  ),
});
export type RouteLlmInput = z.infer<typeof RouteLlmInputSchema>;

// Detailed info for each provider considered during routing
const RoutingDecisionDetailSchema = z.object({
  providerId: z.string(),
  providerName: z.string(),
  modelId: z.string(), // The model this provider *would* use
  status: ProviderStatusSchema,
  qualityScore: z.number().describe('Quality score for the given task type.'),
  latencyP50: z.number().describe('p50 latency for the given task type (ms).'),
  rpmHeadroom: z
    .number()
    .describe('Remaining RPM capacity for the provider (0 to 1).'),
  compositeScore: z.number().describe('Calculated composite score used for ranking.'),
  reason: z.string().describe('Reason for selection or non-selection.'),
});
export type RoutingDecisionDetail = z.infer<typeof RoutingDecisionDetailSchema>;

const RouteLlmOutputSchema = z.object({
  selectedProviderId: z.string().describe('The ID of the chosen LLM provider.'),
  selectedProviderName: z.string().describe('The name of the chosen LLM provider.'),
  // This field indicates the actual Genkit model identifier used for inference,
  // which might be a substitute if the original provider's model is not configured.
  actualLlmModelUsed: z.string().describe('The actual Genkit model identifier used for inference.'),
  llmResponse: z.string().describe('The generated response from the selected LLM.'),
  routingDecisionDetails: z
    .array(RoutingDecisionDetailSchema)
    .describe('Detailed breakdown of the routing decision for all considered providers.'),
});
export type RouteLlmOutput = z.infer<typeof RouteLlmOutputSchema>;

// --- Mock Data (Simulated Live Performance Benchmarks) ---

const MOCK_BENCHMARKS: ProviderBenchmark[] = [
  {
    id: 'groq',
    name: 'Groq',
    modelId: 'groq/llama3-8b-8192', // Hypothetical Groq model ID
    status: 'active',
    taskQuality: {
      code: 3.9,
      reasoning: 3.8,
      summarisation: 4.1,
      extraction: 4.4,
      rag: 3.2,
    },
    taskLatencyP50: {
      code: 98,
      reasoning: 110,
      summarisation: 85,
      extraction: 105,
      rag: 120,
    },
    rpmHeadroom: 0.62, // 62%
  },
  {
    id: 'nvidia-nim',
    name: 'NVIDIA NIM',
    modelId: 'nvidia/some-nim-model', // Hypothetical NVIDIA NIM model ID
    status: 'active',
    taskQuality: {
      code: 4.3,
      reasoning: 3.7,
      summarisation: 3.5,
      extraction: 3.8,
      rag: 3.0,
    },
    taskLatencyP50: {
      code: 142,
      reasoning: 160,
      summarisation: 130,
      extraction: 150,
      rag: 180,
    },
    rpmHeadroom: 0.85, // 85%
  },
  {
    id: 'gemini',
    name: 'Gemini',
    modelId: 'googleai/gemini-pro', // Actual Genkit Google AI model
    status: 'active',
    taskQuality: {
      code: 3.9,
      reasoning: 4.7,
      summarisation: 4.2,
      extraction: 4.0,
      rag: 4.5,
    },
    taskLatencyP50: {
      code: 310,
      reasoning: 280,
      summarisation: 320,
      extraction: 300,
      rag: 290,
    },
    rpmHeadroom: 0.80, // 80%
  },
  {
    id: 'gemini-degraded',
    name: 'Gemini (Degraded)',
    modelId: 'googleai/gemini-pro',
    status: 'degraded',
    taskQuality: {
      code: 3.0,
      reasoning: 3.5,
      summarisation: 3.2,
      extraction: 3.0,
      rag: 3.5,
    },
    taskLatencyP50: {
      code: 450,
      reasoning: 400,
      summarisation: 420,
      extraction: 410,
      rag: 430,
    },
    rpmHeadroom: 0.20, // 20%
  },
  {
    id: 'groq-down',
    name: 'Groq (Down)',
    modelId: 'groq/llama3-8b-8192',
    status: 'down',
    taskQuality: { // These values are irrelevant as it's down
      code: 0, reasoning: 0, summarisation: 0, extraction: 0, rag: 0,
    },
    taskLatencyP50: { // These values are irrelevant as it's down
      code: Infinity, reasoning: Infinity, summarisation: Infinity, extraction: Infinity, rag: Infinity,
    },
    rpmHeadroom: 0,
  },
];

// --- Utility Function for Provider Selection ---

function selectBestProvider(
  taskType: z.infer<typeof TaskTypeSchema>,
  benchmarks: ProviderBenchmark[]
): { best: ProviderBenchmark | null; decisions: RoutingDecisionDetail[] } {
  let bestProvider: ProviderBenchmark | null = null;
  let maxCompositeScore = -Infinity;
  const decisionDetails: RoutingDecisionDetail[] = [];

  const WEIGHT_QUALITY = 0.5;
  const WEIGHT_LATENCY = 0.3;
  const WEIGHT_RPM = 0.2;

  // Max expected values for normalization. Adjust as needed.
  const MAX_QUALITY = 5;
  const MIN_LATENCY_IDEAL = 50; // ms, a good target latency
  const MAX_LATENCY_PENALTY = 500; // ms, beyond this point, latency is very bad
  const MAX_RPM_HEADROOM = 1;

  for (const provider of benchmarks) {
    let compositeScore = 0;
    let reason = '';

    if (provider.status === 'down') {
      reason = `${provider.name} is currently down and cannot be selected.`;
      compositeScore = -Infinity; // Effectively disqualifies
    } else {
      const quality = provider.taskQuality[taskType] || 0;
      const latency = provider.taskLatencyP50[taskType] || Infinity;
      const rpmHeadroom = provider.rpmHeadroom || 0;

      // Normalize metrics to a 0-1 scale
      const normalizedQuality = quality / MAX_QUALITY; // Higher is better
      const normalizedLatency = Math.max(
        0,
        1 - (latency - MIN_LATENCY_IDEAL) / (MAX_LATENCY_PENALTY - MIN_LATENCY_IDEAL)
      ); // Higher for lower latency (50ms -> 1, 500ms -> 0)
      const normalizedRpm = rpmHeadroom / MAX_RPM_HEADROOM; // Higher is better

      // Apply weights
      compositeScore =
        normalizedQuality * WEIGHT_QUALITY +
        normalizedLatency * WEIGHT_LATENCY +
        normalizedRpm * WEIGHT_RPM;

      // Penalize degraded providers
      if (provider.status === 'degraded') {
        reason = `${provider.name} is degraded, applying a penalty.`;
        compositeScore *= 0.7; // Reduce score by 30% for degraded
      }

      compositeScore *= 100; // Scale to 0-100 for easier comparison
      if (!reason) { // If no specific reason yet
        reason = `Evaluated for ${taskType}.`;
      }
    }


    decisionDetails.push({
      providerId: provider.id,
      providerName: provider.name,
      modelId: provider.modelId,
      status: provider.status,
      qualityScore: provider.taskQuality[taskType] || 0,
      latencyP50: provider.taskLatencyP50[taskType] || 0,
      rpmHeadroom: provider.rpmHeadroom || 0,
      compositeScore: compositeScore,
      reason: reason,
    });

    if (compositeScore > maxCompositeScore) {
      maxCompositeScore = compositeScore;
      bestProvider = provider;
    }
  }

  // Finalize reasons
  if (bestProvider) {
    for (const detail of decisionDetails) {
      if (detail.providerId === bestProvider.id) {
        detail.reason = `Selected as the best provider for '${taskType}' with a composite score of ${detail.compositeScore.toFixed(2)}.`;
      } else if (detail.compositeScore > -Infinity) { // Only for providers that weren't "down"
        detail.reason = `${detail.providerName} was not selected. Composite score: ${detail.compositeScore.toFixed(2)}.`;
      }
    }
  } else {
    // If no provider was selected (e.g., all were down)
    for (const detail of decisionDetails) {
      if (detail.compositeScore === -Infinity) {
          detail.reason = `${detail.providerName} was unavailable (down).`;
      } else {
          detail.reason = `No provider was selected. ${detail.providerName} was considered but not optimal.`;
      }
    }
  }


  // Sort decision details by composite score descending
  decisionDetails.sort((a, b) => b.compositeScore - a.compositeScore);

  return { best: bestProvider, decisions: decisionDetails };
}

// --- Genkit Prompt Definition ---
// This prompt uses a generic model placeholder as the actual model is selected dynamically.
// The content will be filled by the flow before calling ai.generate.
const dynamicRoutingPrompt = ai.definePrompt({
  name: 'dynamicRoutingPrompt',
  input: { schema: RouteLlmInputSchema },
  output: { schema: z.string() }, // Output is just the LLM's response text
  // The actual prompt content is simple, as the routing logic is external.
  prompt: `You are an AI assistant tasked with responding to the user's request.
The classified task for this prompt is: {{{classifiedTaskType}}}.
Please provide a comprehensive and helpful response to the following:

User Prompt: {{{userPrompt}}} `,
});

// --- Genkit Flow Definition ---

const routeLlmFlow = ai.defineFlow(
  {
    name: 'routeLlmFlow',
    inputSchema: RouteLlmInputSchema,
    outputSchema: RouteLlmOutputSchema,
  },
  async (input) => {
    // Step 1: Select the best provider based on mock benchmarks
    const { best: selectedProvider, decisions: routingDecisionDetails } =
      selectBestProvider(input.classifiedTaskType, MOCK_BENCHMARKS);

    if (!selectedProvider) {
      throw new Error('No suitable LLM provider could be selected.');
    }

    // Step 2: Determine the actual model to use for ai.generate
    // IMPORTANT: Due to Genkit initialization in src/ai/genkit.ts only including googleAI(),
    // we must use a googleAI model for actual inference.
    // In a production setup with other Genkit plugins (e.g., @genkit-ai/groq),
    // `selectedProvider.modelId` could be used directly if it's correctly registered.
    let actualModelToUse = 'googleai/gemini-pro'; // Default fallback Google model
    let actualLlmModelUsedName = 'Gemini Pro (Fallback)';

    // If the selected provider is actually a Google AI model, use its specific modelId
    if (selectedProvider.modelId.startsWith('googleai/')) {
        actualModelToUse = selectedProvider.modelId;
        actualLlmModelUsedName = selectedProvider.name;
    } else {
        // If the selected provider is not a Google AI model, log a warning and use the fallback.
        console.warn(
            `Selected provider '${selectedProvider.name}' (model: '${selectedProvider.modelId}') is not a Google AI model. ` +
            `Falling back to '${actualModelToUse}' for inference due to Genkit plugin configuration.`
        );
    }


    // Step 3: Call the LLM using the selected (or fallback) model
    const { output } = await dynamicRoutingPrompt(
      {
        userPrompt: input.userPrompt,
        classifiedTaskType: input.classifiedTaskType,
      },
      { model: actualModelToUse } // Dynamically set the model
    );

    if (!output) {
      throw new Error('LLM response was empty.');
    }

    return {
      selectedProviderId: selectedProvider.id,
      selectedProviderName: selectedProvider.name,
      actualLlmModelUsed: actualModelToUse,
      llmResponse: output,
      routingDecisionDetails: routingDecisionDetails,
    };
  }
);

// --- Wrapper Function ---

export async function routeLlm(
  input: RouteLlmInput
): Promise<RouteLlmOutput> {
  return routeLlmFlow(input);
}
