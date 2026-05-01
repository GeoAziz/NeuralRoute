"use client";

import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { StatCard } from "@/components/shared/StatCard";
import { ProviderBadge } from "@/components/shared/ProviderBadge";
import { TaskChip } from "@/components/shared/TaskChip";
import { StatusDot } from "@/components/shared/StatusDot";
import { PROVIDERS, MOCK_REQUESTS, TASK_TYPES } from "@/lib/mock-data";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Card } from "@/components/ui/card";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

const volumeData = [
  { time: '00:00', groq: 40, nvidia: 24, gemini: 24 },
  { time: '04:00', groq: 30, nvidia: 13, gemini: 22 },
  { time: '08:00', groq: 20, nvidia: 98, gemini: 22 },
  { time: '12:00', groq: 27, nvidia: 39, gemini: 20 },
  { time: '16:00', groq: 18, nvidia: 48, gemini: 21 },
  { time: '20:00', groq: 23, nvidia: 38, gemini: 25 },
  { time: '23:59', groq: 34, nvidia: 43, gemini: 21 },
];

const distributionData = [
  { name: 'Code', value: 400, color: '#60a5fa' },
  { name: 'Reasoning', value: 300, color: '#c084fc' },
  { name: 'Summarise', value: 300, color: '#34d399' },
  { name: 'Extraction', value: 200, color: '#fbbf24' },
  { name: 'RAG', value: 278, color: '#f87171' },
];

export default function DashboardPage() {
  const recentRequests = MOCK_REQUESTS.slice(0, 8);

  return (
    <DashboardLayout title="Overview">
      <div className="space-y-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard label="Requests Routed" value="12,483" delta="+8.3% today" trend="up" />
          <StatCard label="Avg Latency" value="147ms" delta="-12ms vs yesterday" trend="up" />
          <StatCard label="Success Rate" value="98.7%" delta="+0.2%" trend="up" />
          <StatCard label="Active Providers" value="3 / 3" />
        </div>

        {/* Provider Health */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {Object.values(PROVIDERS).map((p) => (
            <Card key={p.id} className="p-6 bg-surface border-border group hover:border-primary transition-all overflow-hidden relative">
              <div className="absolute top-0 left-0 h-1 w-full" style={{ backgroundColor: p.color }} />
              <div className="flex justify-between items-start mb-6">
                <div className="flex items-center gap-3">
                  <StatusDot status={p.status} />
                  <span className="font-headline font-bold text-lg">{p.name}</span>
                </div>
                <div className={cn(
                  "px-2 py-0.5 rounded-sm text-[10px] font-bold uppercase tracking-widest",
                  p.status === 'active' ? "bg-success/10 text-success border border-success/20" : "bg-danger/10 text-danger border border-danger/20"
                )}>
                  {p.status === 'active' ? 'Live' : 'Degraded'}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest mb-1">p50 Latency</p>
                  <p className="text-xl font-bold font-mono">{p.p50}ms</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest mb-1">p95 Latency</p>
                  <p className="text-xl font-bold font-mono">{p.p95}ms</p>
                </div>
                <div className="col-span-2 mt-2">
                  <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest mb-2 flex justify-between">
                    <span>RPM Usage</span>
                    <span>{p.rpm}%</span>
                  </p>
                  <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full" style={{ backgroundColor: p.color, width: `${p.rpm}%` }} />
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          <Card className="lg:col-span-3 p-6 bg-surface border-border">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-sm font-bold uppercase tracking-widest text-text-secondary">Routing Volume</h3>
              <div className="flex gap-2">
                {['1H', '6H', '24H', '7D'].map((t) => (
                  <button key={t} className={cn(
                    "px-2 py-1 rounded-sm text-[10px] font-bold transition-all",
                    t === '24H' ? "bg-primary text-bg" : "bg-white/5 text-text-muted hover:text-white"
                  )}>{t}</button>
                ))}
              </div>
            </div>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={volumeData}>
                  <defs>
                    <linearGradient id="colorGroq" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={PROVIDERS.groq.color} stopOpacity={0.3}/>
                      <stop offset="95%" stopColor={PROVIDERS.groq.color} stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorNvidia" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={PROVIDERS['nvidia-nim'].color} stopOpacity={0.3}/>
                      <stop offset="95%" stopColor={PROVIDERS['nvidia-nim'].color} stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorGemini" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={PROVIDERS.gemini.color} stopOpacity={0.3}/>
                      <stop offset="95%" stopColor={PROVIDERS.gemini.color} stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1e3a5f" opacity={0.3} />
                  <XAxis dataKey="time" stroke="#475569" fontSize={10} axisLine={false} tickLine={false} />
                  <YAxis stroke="#475569" fontSize={10} axisLine={false} tickLine={false} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1a2342', border: '1px solid #1e3a5f', borderRadius: '8px' }}
                    itemStyle={{ fontSize: '12px' }}
                  />
                  <Area type="monotone" dataKey="groq" stackId="1" stroke={PROVIDERS.groq.color} fillOpacity={1} fill="url(#colorGroq)" />
                  <Area type="monotone" dataKey="nvidia" stackId="1" stroke={PROVIDERS['nvidia-nim'].color} fillOpacity={1} fill="url(#colorNvidia)" />
                  <Area type="monotone" dataKey="gemini" stackId="1" stroke={PROVIDERS.gemini.color} fillOpacity={1} fill="url(#colorGemini)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>

          <Card className="lg:col-span-2 p-6 bg-surface border-border">
            <h3 className="text-sm font-bold uppercase tracking-widest text-text-secondary mb-8">Task Distribution</h3>
            <div className="h-[300px] w-full flex flex-col items-center justify-center">
              <ResponsiveContainer width="100%" height={240}>
                <PieChart>
                  <Pie
                    data={distributionData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {distributionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1a2342', border: '1px solid #1e3a5f', borderRadius: '8px' }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="grid grid-cols-3 gap-y-2 gap-x-4 mt-4">
                {distributionData.map((d) => (
                  <div key={d.name} className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: d.color }} />
                    <span className="text-[10px] text-text-muted font-medium">{d.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </div>

        {/* Recent Requests Table */}
        <Card className="bg-surface border-border overflow-hidden">
          <div className="px-6 py-4 flex justify-between items-center border-b border-border-subtle">
            <h3 className="text-sm font-bold uppercase tracking-widest text-text-secondary">Recent Requests</h3>
            <button className="text-xs text-primary hover:underline">View all →</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-white/5 text-text-muted text-[10px] font-bold uppercase tracking-widest">
                <tr>
                  <th className="px-6 py-4 text-left">Time</th>
                  <th className="px-6 py-4 text-left">Task</th>
                  <th className="px-6 py-4 text-left">Provider</th>
                  <th className="px-6 py-4 text-left">Latency</th>
                  <th className="px-6 py-4 text-left">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-subtle">
                {recentRequests.map((req) => (
                  <tr key={req.id} className="hover:bg-white/5 transition-colors group cursor-pointer">
                    <td className="px-6 py-4 text-xs text-text-muted">{format(new Date(req.time), 'HH:mm:ss')}</td>
                    <td className="px-6 py-4"><TaskChip taskId={req.taskType as any} /></td>
                    <td className="px-6 py-4"><ProviderBadge providerId={req.provider as any} /></td>
                    <td className="px-6 py-4">
                      <span className={cn(
                        "font-mono font-medium",
                        req.latency < 200 ? "text-success" : req.latency < 500 ? "text-warning" : "text-danger"
                      )}>{req.latency}ms</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        {req.status === 'success' ? (
                          <div className="w-4 h-4 rounded-full bg-success/20 text-success flex items-center justify-center text-[10px]">✓</div>
                        ) : (
                          <div className="w-4 h-4 rounded-full bg-danger/20 text-danger flex items-center justify-center text-[10px]">✗</div>
                        )}
                        <span className="text-xs capitalize">{req.status}</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
}