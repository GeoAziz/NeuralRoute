import { config } from 'dotenv';
config();

import '@/ai/flows/classify-prompt-flow.ts';
import '@/ai/flows/run-llm-benchmarks-flow.ts';
import '@/ai/flows/generate-llm-response-flow.ts';
import '@/ai/flows/route-llm-flow.ts';