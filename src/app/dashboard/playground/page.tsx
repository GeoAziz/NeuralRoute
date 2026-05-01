"use client";

import { useState } from "react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Send, Loader2, Sparkles, AlertCircle, Info } from "lucide-react";
import { TaskChip } from "@/components/shared/TaskChip";
import { ProviderBadge } from "@/components/shared/ProviderBadge";
import { classifyPrompt } from "@/ai/flows/classify-prompt-flow";
import { routeLlm, RouteLlmOutput } from "@/ai/flows/route-llm-flow";
import { cn } from "@/lib/utils";

const EXAMPLES = [
  "Write a binary search in Python",
  "Summarise this: NeuralRoute is an AI-powered router for LLMs...",
  "Extract the main topics from this text about quantum physics.",
  "Why is the sky blue? Explain logically."
];

export default function PlaygroundPage() {
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<'idle' | 'classifying' | 'routing' | 'complete'>('idle');
  const [result, setResult] = useState<RouteLlmOutput | null>(null);
  const [classification, setClassification] = useState<{ taskType: string; confidence: number } | null>(null);

  const handleSend = async () => {
    if (!prompt.trim()) return;
    setLoading(true);
    setResult(null);
    setClassification(null);
    
    try {
      setStep('classifying');
      const cls = await classifyPrompt({ prompt });
      setClassification(cls);
      
      setStep('routing');
      const routeRes = await routeLlm({ userPrompt: prompt, classifiedTaskType: cls.taskType as any });
      setResult(routeRes);
      
      setStep('complete');
    } catch (error) {
      console.error(error);
      setStep('idle');
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout title="Playground">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-[calc(100vh-12rem)]">
        {/* Input Panel */}
        <Card className="bg-surface border-border flex flex-col p-6 space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-bold uppercase tracking-widest text-text-secondary">Prompt Input</h3>
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-text-muted font-bold uppercase">Auto-Detect</span>
              <div className="w-8 h-4 rounded-full bg-primary/20 flex items-center px-1">
                <div className="w-2.5 h-2.5 rounded-full bg-primary"></div>
              </div>
            </div>
          </div>

          <Textarea 
            placeholder="Enter a prompt — NeuralRoute will classify and route it automatically..."
            className="flex-1 bg-white/5 border-border focus:ring-primary/20 font-mono text-sm p-4 resize-none leading-relaxed"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
          />

          <div className="flex justify-between items-center">
            <span className="text-[10px] text-text-muted font-mono">{prompt.length} chars</span>
            <Button 
              onClick={handleSend} 
              disabled={loading || !prompt}
              className="bg-primary text-bg hover:brightness-110 shadow-glow-blue"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Send className="w-4 h-4 mr-2" />}
              Send Request
            </Button>
          </div>

          <div className="pt-4 border-t border-border-subtle">
            <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest mb-3">Example Prompts</p>
            <div className="flex flex-wrap gap-2">
              {EXAMPLES.map(ex => (
                <button 
                  key={ex}
                  onClick={() => setPrompt(ex)}
                  className="text-[11px] px-2.5 py-1 rounded-sm bg-white/5 border border-border hover:border-primary/50 text-text-secondary hover:text-white transition-all max-w-[200px] truncate"
                >
                  {ex}
                </button>
              ))}
            </div>
          </div>
        </Card>

        {/* Output Panel */}
        <Card className="bg-surface border-border flex flex-col overflow-hidden">
          {step === 'idle' ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-10 space-y-4">
              <Sparkles className="w-12 h-12 text-text-muted opacity-20" />
              <div className="space-y-2">
                <h3 className="text-xl font-headline font-bold">Ready to route</h3>
                <p className="text-sm text-text-secondary max-w-xs">Enter a prompt to see NeuralRoute classify and select the optimal provider.</p>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex flex-col overflow-hidden">
              <div className="p-6 border-b border-border-subtle space-y-6">
                {/* Step Indicators */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {step === 'classifying' ? <Loader2 className="w-4 h-4 animate-spin text-primary" /> : <div className="w-4 h-4 rounded-full bg-success/20 text-success flex items-center justify-center text-[10px]">✓</div>}
                      <span className="text-xs font-bold uppercase tracking-widest">Classification</span>
                    </div>
                    {classification && <TaskChip taskId={classification.taskType as any} />}
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {step === 'routing' ? <Loader2 className="w-4 h-4 animate-spin text-primary" /> : step === 'classifying' ? <div className="w-4 h-4 rounded-full border border-border" /> : <div className="w-4 h-4 rounded-full bg-success/20 text-success flex items-center justify-center text-[10px]">✓</div>}
                      <span className="text-xs font-bold uppercase tracking-widest">Routing</span>
                    </div>
                    {result && <ProviderBadge providerId={result.selectedProviderId as any} />}
                  </div>
                </div>
              </div>

              {result && (
                <div className="flex-1 overflow-auto p-6 space-y-6">
                  <div className="space-y-3">
                    <h4 className="text-[10px] font-bold text-text-muted uppercase tracking-widest">LLM Response</h4>
                    <div className="bg-white/5 border border-border rounded-md p-4 font-mono text-sm leading-relaxed whitespace-pre-wrap">
                      {result.llmResponse}
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div className="p-3 rounded-md bg-white/5 border border-border">
                      <p className="text-[9px] font-bold text-text-muted uppercase tracking-widest mb-1">Latency</p>
                      <p className="text-sm font-bold font-mono text-primary">142ms</p>
                    </div>
                    <div className="p-3 rounded-md bg-white/5 border border-border">
                      <p className="text-[9px] font-bold text-text-muted uppercase tracking-widest mb-1">Confidence</p>
                      <p className="text-sm font-bold font-mono text-primary">{(classification?.confidence || 0 * 100).toFixed(0)}%</p>
                    </div>
                    <div className="p-3 rounded-md bg-white/5 border border-border">
                      <p className="text-[9px] font-bold text-text-muted uppercase tracking-widest mb-1">Fallback</p>
                      <p className="text-sm font-bold font-mono text-text-muted">No</p>
                    </div>
                  </div>

                  <div className="pt-6 border-t border-border-subtle space-y-4">
                    <h4 className="text-[10px] font-bold text-text-muted uppercase tracking-widest">Routing Decision Detail</h4>
                    <div className="space-y-2">
                      {result.routingDecisionDetails.map((decision, i) => (
                        <div key={decision.providerId} className={cn(
                          "flex items-center justify-between p-2 rounded-sm text-[11px]",
                          i === 0 ? "bg-primary/10 border border-primary/20" : "bg-white/5"
                        )}>
                          <div className="flex items-center gap-2">
                            {i === 0 && <span className="text-primary text-[10px]">★</span>}
                            <span className={cn("font-medium", i === 0 ? "text-primary" : "text-text-secondary")}>{decision.providerName}</span>
                          </div>
                          <div className="flex items-center gap-4 font-mono">
                            <span className="text-text-muted">{decision.compositeScore.toFixed(1)}/100</span>
                            <span className="text-text-muted w-12 text-right">{decision.latencyP50}ms</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </Card>
      </div>
    </DashboardLayout>
  );
}