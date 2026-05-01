"use client";

import { useState, Fragment } from "react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Card } from "@/components/ui/card";
import { TASK_TYPES, PROVIDERS, BENCHMARKS } from "@/lib/mock-data";
import { Play, RotateCw, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProviderBadge } from "@/components/shared/ProviderBadge";
import { TaskChip } from "@/components/shared/TaskChip";
import { cn } from "@/lib/utils";

export default function BenchmarksPage() {
  const [metric, setMetric] = useState<'quality' | 'latency'>('quality');
  const [running, setRunning] = useState(false);

  const runEval = () => {
    setRunning(true);
    setTimeout(() => setRunning(false), 2000);
  };

  return (
    <DashboardLayout title="Benchmarks">
      <div className="space-y-10">
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-2">
            <h2 className="text-3xl font-headline font-bold">Performance Data</h2>
            <p className="text-text-secondary max-w-xl">Live performance data across all task × provider combinations. Updated every 6 hours via automated eval runner.</p>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-[10px] font-mono text-text-muted">Last updated: 14m ago</span>
            <Button 
              onClick={runEval}
              disabled={running}
              variant="outline" 
              className="border-border bg-surface text-xs font-bold uppercase tracking-wider h-9"
            >
              {running ? <RotateCw className="w-3 h-3 mr-2 animate-spin" /> : <Play className="w-3 h-3 mr-2" />}
              Run Eval Now
            </Button>
          </div>
        </header>

        {/* Filters */}
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
            Latency p50
          </button>
        </div>

        {/* Heatmap Grid */}
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
                <div key={`${task.id}-label`} className="p-6 border-r border-b border-border-subtle last:border-b-0 flex items-center">
                  <TaskChip taskId={task.id as any} />
                </div>
                {Object.keys(PROVIDERS).map(providerId => {
                  const data = BENCHMARKS.find(b => b.task === task.id && b.provider === providerId);
                  const val = metric === 'quality' ? data?.quality : data?.p50;
                  const isBest = metric === 'quality' 
                    ? data?.quality === Math.max(...BENCHMARKS.filter(b => b.task === task.id).map(b => b.quality))
                    : data?.p50 === Math.min(...BENCHMARKS.filter(b => b.task === task.id).map(b => b.p50));

                  return (
                    <div 
                      key={`${task.id}-${providerId}`} 
                      className={cn(
                        "p-6 border-r border-b border-border-subtle last:border-r-0 flex flex-col items-center justify-center gap-2 relative transition-all group hover:bg-white/5",
                        isBest && "bg-success/5"
                      )}
                    >
                      {isBest && <Star className="absolute top-2 right-2 w-3 h-3 text-success fill-success" />}
                      <span className="text-2xl font-headline font-bold font-mono">
                        {metric === 'quality' ? val : `${val}ms`}
                      </span>
                      {metric === 'quality' && (
                        <div className="flex gap-0.5">
                          {[1,2,3,4,5].map(i => (
                            <div key={i} className={cn(
                              "w-3 h-1 rounded-full",
                              i <= Math.floor(val || 0) ? "bg-success" : (i === Math.ceil(val || 0) && val! % 1 !== 0) ? "bg-success/40" : "bg-white/10"
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

        {/* Details Table */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-widest text-text-secondary">Benchmark Detail</h3>
          <Card className="bg-surface border-border overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-white/5 text-text-muted text-[10px] font-bold uppercase tracking-widest">
                <tr>
                  <th className="px-6 py-4 text-left">Task</th>
                  <th className="px-6 py-4 text-left">Provider</th>
                  <th className="px-6 py-4 text-left">Quality Score</th>
                  <th className="px-6 py-4 text-left">Latency p50</th>
                  <th className="px-6 py-4 text-left">RPM Cap</th>
                  <th className="px-6 py-4 text-left">Trend</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-subtle">
                {BENCHMARKS.map((b, i) => (
                  <tr key={i} className="hover:bg-white/5 transition-colors group">
                    <td className="px-6 py-4"><TaskChip taskId={b.task as any} /></td>
                    <td className="px-6 py-4"><ProviderBadge providerId={b.provider as any} /></td>
                    <td className="px-6 py-4 font-mono font-bold text-success">{b.quality}/5</td>
                    <td className="px-6 py-4 font-mono text-text-muted">{b.p50}ms</td>
                    <td className="px-6 py-4 text-xs">
                      <div className="flex items-center gap-2">
                        <div className="w-12 h-1 bg-white/5 rounded-full overflow-hidden">
                          <div className="h-full bg-primary" style={{ width: '70%' }} />
                        </div>
                        <span className="text-text-muted">70%</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-end gap-0.5 h-4">
                        {[20, 50, 40, 80, 60, 90, 75].map((h, j) => (
                          <div key={j} className="w-1 bg-primary/20 rounded-t-sm" style={{ height: `${h}%` }} />
                        ))}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
