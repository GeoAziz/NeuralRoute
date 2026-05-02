export type ProviderId = 'groq' | 'nvidia-nim' | 'gemini';
export type TaskTypeId = 'code' | 'reasoning' | 'summarisation' | 'extraction' | 'rag';

export interface Provider {
  id: ProviderId;
  name: string;
  color: string;
  status: 'active' | 'degraded' | 'down';
  p50: number;
  p95: number;
  rpm: number;
  quality: number;
  models: string[];
}

export const PROVIDERS: Record<ProviderId, Provider> = {
  groq: {
    id: 'groq',
    name: 'Groq',
    color: '#06b6d4',
    status: 'active',
    p50: 98,
    p95: 210,
    rpm: 78,
    quality: 4.1,
    models: ['llama-3.3-70b', 'mixtral-8x7b']
  },
  'nvidia-nim': {
    id: 'nvidia-nim',
    name: 'NVIDIA NIM',
    color: '#76b900',
    status: 'active',
    p50: 142,
    p95: 295,
    rpm: 85,
    quality: 4.3,
    models: ['llama-3.1-405b', 'nemotron-70b']
  },
  gemini: {
    id: 'gemini',
    name: 'Gemini',
    color: '#8b5cf6',
    status: 'active',
    p50: 310,
    p95: 580,
    rpm: 80,
    quality: 4.7,
    models: ['gemini-1.5-pro', 'gemini-1.5-flash']
  }
};

export const TASK_TYPES = [
  { id: 'code', label: 'Code Gen', icon: 'Code', color: 'blue' },
  { id: 'reasoning', label: 'Reasoning', icon: 'Brain', color: 'purple' },
  { id: 'summarisation', label: 'Summarise', icon: 'Layers', color: 'teal' },
  { id: 'extraction', label: 'Extraction', icon: 'Brackets', color: 'orange' },
  { id: 'rag', label: 'RAG', icon: 'Search', color: 'green' }
] as const;

export const BENCHMARKS = [
  { task: 'code', provider: 'nvidia-nim', quality: 4.3, p50: 142 },
  { task: 'reasoning', provider: 'gemini', quality: 4.7, p50: 310 },
  { task: 'summarisation', provider: 'groq', quality: 4.1, p50: 98 },
  { task: 'extraction', provider: 'groq', quality: 4.4, p50: 105 },
  { task: 'rag', provider: 'gemini', quality: 4.5, p50: 290 },
];

export const MOCK_REQUESTS = Array.from({ length: 200 }).map((_, i) => {
  const providers = Object.keys(PROVIDERS) as ProviderId[];
  const taskIds = TASK_TYPES.map(t => t.id);
  const providerId = providers[Math.floor(Math.random() * providers.length)];
  const taskId = taskIds[Math.floor(Math.random() * taskIds.length)];
  
  return {
    id: Math.random().toString(36).substr(2, 9),
    time: new Date(Date.now() - Math.random() * 10000000).toISOString(),
    taskType: taskId,
    provider: providerId,
    latency: Math.floor(Math.random() * 400) + 100,
    quality: (Math.random() * 1.5 + 3.3).toFixed(1),
    fallback: Math.random() > 0.9,
    status: Math.random() > 0.05 ? 'success' : 'error' as const,
    prompt: "Mock request prompt for " + taskId + " task instance #" + i,
    response: "This is a simulated response from " + providerId + " for the " + taskId + " request."
  };
}).sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime());
