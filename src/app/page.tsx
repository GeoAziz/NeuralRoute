"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ChevronDown, Hexagon, Github, ArrowRight, Activity, Zap, Shield, Cpu, Code, Brain, Database, Server } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PROVIDERS, TASK_TYPES } from "@/lib/mock-data";
import { ProviderBadge } from "@/components/shared/ProviderBadge";

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Navigation */}
      <nav className="h-16 sticky top-0 z-50 transition-all border-b border-white/5 bg-bg/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto h-full px-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Hexagon className="w-8 h-8 text-primary fill-primary/10 shadow-glow-blue" />
            <span className="font-headline font-bold text-xl tracking-tight">NeuralRoute</span>
          </div>

          <div className="hidden md:flex items-center gap-8">
            <Link href="/dashboard" className="text-sm font-medium text-text-secondary hover:text-white transition-colors">Dashboard</Link>
            <Link href="/dashboard/playground" className="text-sm font-medium text-text-secondary hover:text-white transition-colors">Playground</Link>
            <Link href="#" className="text-sm font-medium text-text-secondary hover:text-white transition-colors">Docs</Link>
          </div>

          <div className="flex items-center gap-4">
            <Link href="https://github.com" className="text-text-secondary hover:text-white">
              <Github className="w-5 h-5" />
            </Link>
            <Button asChild className="bg-primary text-bg hover:brightness-110 shadow-glow-blue">
              <Link href="/dashboard">Launch Dashboard <ArrowRight className="ml-2 w-4 h-4" /></Link>
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative flex-1 flex flex-col items-center justify-center py-20 px-6 overflow-hidden min-h-[90vh]">
        {/* Animated Blobs */}
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
          <motion.div 
            animate={{ x: [0, 50, -30, 0], y: [0, -40, 60, 0] }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-primary/10 rounded-full blur-[100px]"
          />
          <motion.div 
            animate={{ x: [0, -60, 40, 0], y: [0, 50, -20, 0] }}
            transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
            className="absolute top-1/2 right-1/4 w-[500px] h-[500px] bg-accent/10 rounded-full blur-[120px]"
          />
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-[900px] text-center space-y-8 z-10"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/30 bg-primary/5 text-xs font-medium text-primary">
            <span>FREE TIER</span>
            <span className="opacity-40">•</span>
            <span>OPEN SOURCE</span>
            <span className="opacity-40">•</span>
            <span>LIVE DATA</span>
          </div>

          <h1 className="text-5xl md:text-7xl lg:text-8xl font-headline font-extrabold text-gradient leading-[1.05] tracking-tight">
            Stop guessing which LLM to call.
          </h1>
          
          <p className="text-lg md:text-xl text-text-secondary max-w-2xl mx-auto leading-relaxed">
            NeuralRoute auto-classifies your prompts and routes them to the best free provider for every task. Faster inference, zero cost.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Button size="lg" asChild className="h-12 px-8 bg-primary text-bg hover:scale-[1.02] transition-transform text-base">
              <Link href="/dashboard">Launch Dashboard <ArrowRight className="ml-2 w-4 h-4" /></Link>
            </Button>
            <Button size="lg" variant="outline" className="h-12 px-8 border-border hover:border-primary/50 text-base">
              View on GitHub <Github className="ml-2 w-4 h-4" />
            </Button>
          </div>
        </motion.div>

        <motion.div 
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2"
        >
          <ChevronDown className="w-6 h-6 text-text-muted" />
        </motion.div>
      </section>

      {/* Live Metrics Bar */}
      <div className="border-y border-border-subtle bg-surface">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 divide-x divide-border-subtle">
          {[
            { label: 'Requests Routed', value: '12,483' },
            { label: 'Success Rate', value: '98.7%' },
            { label: 'Avg Latency', value: '147ms' },
            { label: 'Providers Live', value: '3' },
          ].map((stat) => (
            <div key={stat.label} className="p-8 text-center md:text-left">
              <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest mb-2">{stat.label}</p>
              <p className="text-3xl font-headline font-bold text-white">{stat.value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* How it works */}
      <section className="py-32 px-6 max-w-7xl mx-auto w-full">
        <div className="text-center mb-20 space-y-4">
          <h2 className="text-4xl md:text-5xl font-headline font-bold">How NeuralRoute thinks</h2>
          <p className="text-text-secondary text-lg">Three steps. Zero config. Better results.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {[
            { 
              step: '01', 
              title: 'Classify', 
              desc: 'Your prompt is classified into one of 5 task types using a fast 8B model.',
              icon: Zap
            },
            { 
              step: '02', 
              title: 'Benchmark', 
              desc: 'Live latency & quality scores per provider per task. Updated every 6 hours.',
              icon: Activity
            },
            { 
              step: '03', 
              title: 'Route', 
              desc: 'The winning provider gets the request. Fallback is automatic.',
              icon: Shield
            },
          ].map((item, idx) => (
            <div key={item.step} className="p-8 rounded-xl bg-surface border border-border relative overflow-hidden group hover:border-primary transition-all">
              <span className="absolute top-2 right-4 text-7xl font-headline font-bold opacity-5 group-hover:opacity-10 transition-opacity">{item.step}</span>
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary mb-6">
                <item.icon className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold mb-3">{item.title}</h3>
              <p className="text-text-secondary leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Architecture SVG Flow Section */}
      <section className="py-32 bg-bg overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-8">
            <h2 className="text-4xl md:text-5xl font-headline font-bold">The Neural Pipeline</h2>
            <p className="text-text-secondary text-lg leading-relaxed">
              Every request passes through our proprietary routing engine. We don't just pick a model; we pick the right model at the right time.
            </p>
            <div className="space-y-6">
              {[
                { label: 'Classification', desc: 'Instant task detection (Code, Reasoning, etc.)', icon: Brain },
                { label: 'Load Balancing', desc: 'Real-time RPM and Latency monitoring', icon: Activity },
                { label: 'Optimal Dispatch', desc: 'Direct routing to the highest-scoring available provider', icon: Zap }
              ].map(feat => (
                <div key={feat.label} className="flex gap-4">
                  <div className="mt-1 w-6 h-6 text-primary"><feat.icon className="w-full h-full" /></div>
                  <div>
                    <h4 className="font-bold text-white">{feat.label}</h4>
                    <p className="text-sm text-text-muted">{feat.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="relative p-12 rounded-2xl bg-surface/50 border border-border backdrop-blur-sm">
            <svg viewBox="0 0 400 300" className="w-full h-auto">
              {/* Nodes */}
              <rect x="150" y="20" width="100" height="40" rx="8" className="fill-bg stroke-primary/30" />
              <text x="200" y="45" textAnchor="middle" className="fill-white text-[10px] font-bold uppercase tracking-widest">User Prompt</text>

              <rect x="50" y="120" width="100" height="40" rx="8" className="fill-bg stroke-primary/30" />
              <text x="100" y="145" textAnchor="middle" className="fill-white text-[10px] font-bold uppercase tracking-widest">Classifier</text>

              <rect x="250" y="120" width="100" height="40" rx="8" className="fill-bg stroke-primary/30" />
              <text x="300" y="145" textAnchor="middle" className="fill-white text-[10px] font-bold uppercase tracking-widest">Benchmark Data</text>

              <rect x="150" y="220" width="100" height="40" rx="8" className="fill-bg stroke-primary" />
              <text x="200" y="245" textAnchor="middle" className="fill-primary text-[10px] font-bold uppercase tracking-widest">Router Engine</text>

              {/* Paths */}
              <motion.path 
                d="M200 60 L100 120" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="1.5" 
                className="text-primary/20"
                strokeDasharray="4 4"
                animate={{ strokeDashoffset: [0, -20] }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              />
              <motion.path 
                d="M200 60 L300 120" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="1.5" 
                className="text-primary/20"
                strokeDasharray="4 4"
                animate={{ strokeDashoffset: [0, -20] }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              />
              <motion.path 
                d="M100 160 L200 220" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                className="text-primary"
                strokeDasharray="100"
                strokeDashoffset="100"
                animate={{ strokeDashoffset: 0 }}
                transition={{ duration: 1, delay: 0.5, repeat: Infinity, repeatDelay: 2 }}
              />
              <motion.path 
                d="M300 160 L200 220" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                className="text-primary"
                strokeDasharray="100"
                strokeDashoffset="100"
                animate={{ strokeDashoffset: 0 }}
                transition={{ duration: 1, delay: 0.5, repeat: Infinity, repeatDelay: 2 }}
              />
            </svg>
          </div>
        </div>
      </section>

      {/* Live Benchmark Preview */}
      <section className="py-24 bg-surface border-y border-border">
        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-6">
            <h2 className="text-4xl font-headline font-bold">Real benchmarks. Live data.</h2>
            <p className="text-text-secondary text-lg leading-relaxed">
              We monitor free-tier LLM providers around the clock. Our automated eval runner tests code generation, reasoning, and extraction quality so you don't have to.
            </p>
            <Button variant="link" className="text-primary p-0 h-auto font-semibold">View all benchmarks →</Button>
          </div>
          
          <div className="rounded-xl border border-border bg-bg overflow-hidden shadow-2xl">
            <table className="w-full text-sm">
              <thead className="bg-white/5 text-text-muted text-[10px] font-bold uppercase tracking-widest">
                <tr>
                  <th className="px-6 py-4 text-left">Task</th>
                  <th className="px-6 py-4 text-left">Provider</th>
                  <th className="px-6 py-4 text-left">Quality</th>
                  <th className="px-6 py-4 text-left">Latency</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-subtle">
                {[
                  { task: 'Code Gen', provider: 'nvidia-nim', quality: 4.3, latency: '142ms' },
                  { task: 'Reasoning', provider: 'gemini', quality: 4.7, latency: '310ms' },
                  { task: 'Summarise', provider: 'groq', quality: 4.1, latency: '98ms' },
                ].map((row, i) => (
                  <tr key={i} className="hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4 font-medium">{row.task}</td>
                    <td className="px-6 py-4"><ProviderBadge providerId={row.provider as any} /></td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-1.5 w-16 bg-white/10 rounded-full overflow-hidden">
                          <div className="h-full bg-success" style={{ width: `${(row.quality/5)*100}%` }}></div>
                        </div>
                        <span className="text-xs font-mono">{row.quality}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-xs font-mono text-text-muted">{row.latency}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="p-4 text-center border-t border-border-subtle">
              <span className="text-xs text-text-muted">Filtered for top 3 tasks. See full table in dashboard.</span>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="pt-24 pb-12 px-6 border-t border-border-subtle mt-auto">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12 mb-20">
            <div className="col-span-2 md:col-span-1 space-y-4">
              <div className="flex items-center gap-2">
                <Hexagon className="w-6 h-6 text-primary" />
                <span className="font-headline font-bold text-lg">NeuralRoute</span>
              </div>
              <p className="text-sm text-text-secondary leading-relaxed">
                Route smarter. Infer faster. Built with love on free tier compute.
              </p>
            </div>
            <div>
              <h4 className="font-bold text-sm mb-6 uppercase tracking-widest text-white">Product</h4>
              <ul className="space-y-4 text-sm text-text-secondary">
                <li><Link href="/dashboard" className="hover:text-primary transition-colors">Dashboard</Link></li>
                <li><Link href="/dashboard/playground" className="hover:text-primary transition-colors">Playground</Link></li>
                <li><Link href="/dashboard/benchmarks" className="hover:text-primary transition-colors">Benchmarks</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-sm mb-6 uppercase tracking-widest text-white">Resources</h4>
              <ul className="space-y-4 text-sm text-text-secondary">
                <li><Link href="#" className="hover:text-primary transition-colors">GitHub</Link></li>
                <li><Link href="#" className="hover:text-primary transition-colors">Docs</Link></li>
                <li><Link href="#" className="hover:text-primary transition-colors">API Reference</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-sm mb-6 uppercase tracking-widest text-white">Stack</h4>
              <ul className="space-y-4 text-sm text-text-secondary">
                <li><Link href="#" className="hover:text-primary transition-colors">Groq SDK</Link></li>
                <li><Link href="#" className="hover:text-primary transition-colors">NVIDIA NIM</Link></li>
                <li><Link href="#" className="hover:text-primary transition-colors">Gemini AI</Link></li>
              </ul>
            </div>
          </div>
          <div className="flex flex-col md:flex-row items-center justify-between pt-12 border-t border-border-subtle gap-6">
            <span className="text-xs text-text-muted">MIT License · 2026 NeuralRoute Inc.</span>
            <div className="flex items-center gap-2 px-3 py-1 rounded-full border border-border bg-surface text-[10px] font-bold uppercase tracking-widest text-text-secondary">
              <Cpu className="w-3 h-3" />
              Built on free compute
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
