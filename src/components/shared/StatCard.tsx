"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { TrendingUp, TrendingDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  label: string;
  value: string;
  delta?: string;
  trend?: 'up' | 'down' | 'neutral';
  sparklineData?: number[];
  className?: string;
}

export function StatCard({ label, value, delta, trend, className }: StatCardProps) {
  const [displayValue, setDisplayValue] = useState("0");

  useEffect(() => {
    // Basic counter animation mock
    const numericValue = parseInt(value.replace(/[^0-9]/g, '')) || 0;
    const duration = 800;
    const steps = 20;
    const stepValue = numericValue / steps;
    let current = 0;
    const timer = setInterval(() => {
      current += stepValue;
      if (current >= numericValue) {
        setDisplayValue(value);
        clearInterval(timer);
      } else {
        setDisplayValue(Math.floor(current).toLocaleString() + (value.includes('%') ? '%' : value.includes('ms') ? 'ms' : ''));
      }
    }, duration / steps);
    return () => clearInterval(timer);
  }, [value]);

  return (
    <Card className={cn(
      "p-5 transition-all duration-300 hover:border-primary hover:shadow-glow-blue bg-surface border-border overflow-hidden relative group",
      className
    )}>
      <div className="flex justify-between items-start mb-2">
        <span className="text-xs font-medium text-text-secondary uppercase tracking-wider">{label}</span>
        {delta && (
          <span className={cn(
            "text-[10px] font-bold px-1.5 py-0.5 rounded-full flex items-center gap-0.5",
            trend === 'up' ? "text-success bg-success/10" : "text-danger bg-danger/10"
          )}>
            {trend === 'up' ? <TrendingUp className="w-2.5 h-2.5" /> : <TrendingDown className="w-2.5 h-2.5" />}
            {delta}
          </span>
        )}
      </div>
      <div className="text-3xl font-headline font-bold text-text-primary tracking-tight">
        {displayValue}
      </div>
      
      {/* Mini Mock Sparkline */}
      <div className="mt-4 flex items-end gap-1 h-8">
        {[40, 70, 45, 90, 65, 80, 50].map((h, i) => (
          <div 
            key={i} 
            className="flex-1 bg-primary/20 rounded-t-sm group-hover:bg-primary/40 transition-colors" 
            style={{ height: `${h}%` }}
          />
        ))}
      </div>
    </Card>
  );
}