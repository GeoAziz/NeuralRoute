"use client";

import { useState, Fragment, useEffect } from "react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Card } from "@/components/ui/card";
import { TASK_TYPES, PROVIDERS, BENCHMARKS as STATIC_BENCHMARKS } from "@/lib/mock-data";
import { Play, RotateCw, Star, Info, TrendingUp, BarChart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProviderBadge } from "@/components/shared/ProviderBadge";
import { TaskChip } from "@/components/shared/TaskChip";
import { cn } from "@/lib/utils";
import { runLlmBenchmarks, BenchmarkResult } from "@/ai/flows/run-llm-benchmarks-flow";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

const timeSeriesData = [
  { time: '08:00', groq: 4.1, nvidia: 4.2, gemini: 4.6 },
  { time: '10:00', groq: 4.0, nvidia: 4.3, gemini: 4.7 },
  { time: '12:00', groq: 4.2, nvidia: 4.1, gemini: 4.8 },
  { time: '14:00', groq: 4.1, nvidia: 4.3, gemini: 4.7 },
  { time: '16:00', groq: 4.3, nvidia: 4.4, gemini: 4.6 },
  { time: '18:00', groq: 4.1, nvidia: 4.2, gemini: 4.7 },
  { time: '20:00', groq: 4.2, nvidia: 4.3, gemini: 4.8 },
];

export default function BenchmarksPage() {
  const [metric, setMetric] = useState<'quality' | 'latency'>('quality');
  const [running, setRunning] = useState(false);
  const [results, setResults] = useState<BenchmarkResult[]>([]);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  useEffect(() => {
    const initial = STATIC_BENCHMARKS.map(b => ({
      provider: PROVIDERS[b.provider as keyof typeof PROVIDERS].name as any,
      taskType: b.task as any,
      qualityScore: b.quality,
      latencyMs: b.p50
    }));
    setResults(initial);
  }, []);

  const runEval = async () => {
    setRunning(true);
    try {
      const newResults = await runLlmBenchmarks({});
      setResults(newResults);
      setLastUpdated(new Date());
    } catch (error) {
      console.error("Benchmark failed:", error);
    } finally {
      setRunning(false);
    }
  };

  const getVal = (taskId: string, providerId: string) => {
    const providerName = PROVIDERS[providerId as keyof typeof PROVIDERS].name;
    const match = results.find(r => r.taskType === taskId && r.provider === providerName);
    return metric === 'quality' ? match?.qualityScore : match?.latencyMs;
  };

  const isBestInRow = (taskId: string, providerId: string) => {
    const rowValues = Object.keys(PROVIDERS).map(pId => getVal(taskId, pId) || 0);
    const currentVal = getVal(taskId, providerId) || 0;
    if (metric === 'quality') return currentVal === Math.max(...rowValues);
    return currentVal === Math.min(...rowValues.filter(v => v > 0));
  };

  return (
    <DashboardLayout title="Benchmarks">
      <div className="space-y-10">
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-2">
            <h2 className="text-3xl font-headline font-bold">Performance Data</h2>
            <p className="text-text-secondary max-w-xl">Live performance data across all task × provider combinations. Trigger real-time evaluations using the Genkit runner.</p>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-[10px] font-mono text-text-muted">Last updated: {lastUpdated.toLocaleTimeString()}</span>
            <Button 
              onClick={runEval}
              disabled={running}
              variant="outline" 
              className="border-border bg-surface text-xs font-bold uppercase tracking-wider h-9"
            >
              {running ? <RotateCw className="w-3 h-3 mr-2 animate-spin" /> : <Play className="w-3 h-3 mr-2" />}
              {running ? "Running Eval..." : "Run Eval Now"}
            </Button>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2 p-6 bg-surface border-border">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <TrendingUp className="w-4 h-4 text-primary" />
                <h3 className="text-sm font-bold uppercase tracking-widest text-white">Comparison Trend</h3>
              </div>
              <div className="text-[10px] font-bold text-text-muted uppercase">Global Quality (avg)</div>
            </div>
            <div className="h-[240px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={timeSeriesData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1e3a5f" opacity={0.3} />
                  <XAxis dataKey="time" stroke="#475569" fontSize={10} axisLine={false} tickLine={false} />
                  <YAxis domain={[3.5, 5]} stroke="#475569" fontSize={10} axisLine={false} tickLine={false} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1a2342', border: '1px solid #1e3a5f', borderRadius: '8px' }}
                  />
                  <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px', fontSize: '10px' }} />
                  <Line type="monotone" dataKey="groq" name="Groq" stroke={PROVIDERS.groq.color} strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                  <Line type="monotone" dataKey="nvidia" name="NVIDIA" stroke={PROVIDERS['nvidia-nim'].color} strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                  <Line type="monotone" dataKey="gemini" name="Gemini" stroke={PROVIDERS.gemini.color} strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Card>

          <Card className="p-6 bg-surface border-border">
            <div className="flex items-center gap-3 mb-6">
              <BarChart className="w-4 h-4 text-primary" />
              <h3 className="text-sm font-bold uppercase tracking-widest text-white">Metric Insights</h3>
            </div>
            <div className="space-y-6">
              <div className="p-4 rounded-lg bg-white/5 border border-border">
                <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest mb-1">Consistency Leader</p>
                <div className="flex justify-between items-end">
                  <span className="text-lg font-bold">Gemini 1.5 Pro</span>
                  <span className="text-xs text-success font-bold font-mono">99.2%</span>
                </div>
              </div>
              <div className="p-4 rounded-lg bg-white/5 border border-border">
                <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest mb-1">Latency King</p>
                <div className="flex justify-between items-end">
                  <span className="text-lg font-bold">Groq Llama 3</span>
                  <span className="text-xs text-primary font-bold font-mono">82ms</span>
                </div>
              </div>
              <div className="p-4 rounded-lg bg-white/5 border border-border">
                <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest mb-1">Quality Peak</p>
                <div className="flex justify-between items-end">
                  <span className="text-lg font-bold">NVIDIA NIM</span>
                  <span className="text-xs text-accent font-bold font-mono">4.8/5.0</span>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Heatmap Section */}
        <div className="space-y-6">
          <div className="flex flex-wrap gap-2 items-center">
            <span className="text-[10px] font-bold text-text-muted uppercase tracking-widest mr-2">Metric:</span>
            <button 
              onClick={() => setMetric('quality')}
              className={cn(
                "px-3 py-1.5 rounded-sm text-[11px] font-bold transition-all border",
                metric === 'quality' ? "bg-primary/10 border-primary text-primary" : "bg-surface border-border text-text-muted hover:text-white"
              )}
            >
              Quality Score
            </button>
            <button 
              onClick={() => setMetric('latency')}
              className={cn(
                "px-3 py-1.5 rounded-sm text-[11px] font-bold transition-all border",
                metric === 'latency' ? "bg-primary/10 border-primary text-primary" : "bg-surface border-border text-text-muted hover:text-white"
              )}
            >
              Latency (ms)
            </button>
          </div>

          <Card className="bg-surface border-border overflow-hidden p-1">
            <div className="grid grid-cols-4 bg-bg/50">
              <div className="p-6 border-r border-b border-border-subtle bg-bg/50"></div>
              {Object.values(PROVIDERS).map(p => (
                <div key={p.id} className="p-6 text-center border-b border-r border-border-subtle last:border-r-0">
                  <span className="text-sm font-headline font-bold" style={{ color: p.color }}>{p.name}</span>
                </div>
              ))}

              {TASK_TYPES.map(task => (
                <Fragment key={task.id}>
                  <div className="p-6 border-r border-b border-border-subtle last:border-b-0 flex items-center">
                    <TaskChip taskId={task.id as any} />
                  </div>
                  {Object.keys(PROVIDERS).map(providerId => {
                    const val = getVal(task.id, providerId);
                    const best = isBestInRow(task.id, providerId);

                    return (
                      <div 
                        key={`${task.id}-${providerId}`} 
                        className={cn(
                          "p-6 border-r border-b border-border-subtle last:border-r-0 flex flex-col items-center justify-center gap-2 relative transition-all group hover:bg-white/5",
                          best && "bg-success/5"
                        )}
                      >
                        {best && <Star className="absolute top-2 right-2 w-3 h-3 text-success fill-success" />}
                        <span className="text-2xl font-headline font-bold font-mono">
                          {val ? (metric === 'quality' ? val.toFixed(1) : `${Math.round(val)}ms`) : '—'}
                        </span>
                        {metric === 'quality' && val && (
                          <div className="flex gap-0.5">
                            {[1,2,3,4,5].map(i => (
                              <div key={i} className={cn(
                                "w-3 h-1 rounded-full",
                                i <= Math.floor(val) ? "bg-success" : (i === Math.ceil(val) && val % 1 !== 0) ? "bg-success/40" : "bg-white/10"
                              )} />
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </Fragment>
              ))}
            </div>
          </Card>
        </div>

        {/* Details Table */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-widest text-text-secondary">Raw Benchmark Data</h3>
          <Card className="bg-surface border-border overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-white/5 text-text-muted text-[10px] font-bold uppercase tracking-widest">
                <tr>
                  <th className="px-6 py-4 text-left">Task</th>
                  <th className="px-6 py-4 text-left">Provider</th>
                  <th className="px-6 py-4 text-left">Quality</th>
                  <th className="px-6 py-4 text-left">Latency</th>
                  <th className="px-6 py-4 text-left">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-subtle">
                {results.map((r, i) => {
                  const pId = Object.keys(PROVIDERS).find(k => PROVIDERS[k as keyof typeof PROVIDERS].name === r.provider);
                  return (
                    <tr key={i} className="hover:bg-white/5 transition-colors group">
                      <td className="px-6 py-4"><TaskChip taskId={r.taskType as any} /></td>
                      <td className="px-6 py-4"><ProviderBadge providerId={pId as any} /></td>
                      <td className="px-6 py-4 font-mono font-bold text-success">{r.qualityScore.toFixed(1)}/5.0</td>
                      <td className="px-6 py-4 font-mono text-text-muted">{Math.round(r.latencyMs)}ms</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                           <div className="w-2 h-2 rounded-full bg-success"></div>
                           <span className="text-[10px] uppercase font-bold text-success">Verified</span>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
