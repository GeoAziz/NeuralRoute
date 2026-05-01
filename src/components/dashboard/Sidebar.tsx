"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, PlayCircle, BarChart3, ListOrdered, Settings, Github, FileText, Hexagon } from "lucide-react";
import { cn } from "@/lib/utils";
import { StatusDot } from "@/components/shared/StatusDot";
import { PROVIDERS } from "@/lib/mock-data";

export const NAVIGATION = [
  { name: 'Dashboard', icon: LayoutDashboard, href: '/dashboard' },
  { name: 'Playground', icon: PlayCircle, href: '/dashboard/playground' },
  { name: 'Benchmarks', icon: BarChart3, href: '/dashboard/benchmarks' },
  { name: 'Request Log', icon: ListOrdered, href: '/dashboard/logs' },
  { name: 'Settings', icon: Settings, href: '/dashboard/settings' },
];

export function SidebarContent({ onItemClick }: { onItemClick?: () => void }) {
  const pathname = usePathname();

  return (
    <div className="flex flex-col h-full bg-surface border-r border-border">
      <div className="p-6 flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-bg shadow-glow-blue">
          <Hexagon className="w-5 h-5 fill-current" />
        </div>
        <span className="font-headline font-bold text-xl tracking-tight text-white">NeuralRoute</span>
      </div>

      <nav className="flex-1 px-3 space-y-1 overflow-y-auto">
        <div className="px-3 py-2 text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em] mb-1">
          Navigation
        </div>
        {NAVIGATION.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              onClick={onItemClick}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-md transition-all group",
                isActive 
                  ? "bg-primary/10 text-primary border-l-2 border-primary rounded-l-none" 
                  : "text-text-secondary hover:bg-white/5 hover:text-white"
              )}
            >
              <item.icon className={cn("w-5 h-5", isActive ? "text-primary" : "text-text-secondary group-hover:text-white")} />
              <span className="text-sm font-medium">{item.name}</span>
            </Link>
          );
        })}

        <div className="pt-8 px-3 py-2 text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em] mb-1">
          Providers
        </div>
        {Object.values(PROVIDERS).map((provider) => (
          <div key={provider.id} className="flex items-center justify-between px-3 py-2 group cursor-default">
            <div className="flex items-center gap-3">
              <StatusDot status={provider.status} />
              <span className="text-sm font-medium text-text-secondary group-hover:text-white transition-colors">{provider.name}</span>
            </div>
            <span className="text-[10px] font-mono text-muted-foreground">{provider.p50}ms</span>
          </div>
        ))}
      </nav>

      <div className="p-4 border-t border-border-subtle space-y-2">
        <Link href="#" className="flex items-center gap-2 text-xs text-text-secondary hover:text-white px-2 py-1 transition-colors">
          <FileText className="w-4 h-4" />
          Docs
        </Link>
        <Link href="https://github.com" className="flex items-center gap-2 text-xs text-text-secondary hover:text-white px-2 py-1 transition-colors">
          <Github className="w-4 h-4" />
          GitHub
        </Link>
      </div>
    </div>
  );
}

export function Sidebar() {
  return (
    <aside className="w-[260px] fixed inset-y-0 left-0 hidden lg:block z-50">
      <SidebarContent />
    </aside>
  );
}