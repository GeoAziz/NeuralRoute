"use client";

import { useState } from "react";
import { Search, Bell, Menu, User, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { SidebarContent } from "./Sidebar";
import { cn } from "@/lib/utils";

interface TopBarProps {
  title: string;
}

export function TopBar({ title }: TopBarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="h-16 border-b border-border bg-bg/80 backdrop-blur-md sticky top-0 z-40 flex items-center justify-between px-6">
      <div className="flex items-center gap-4">
        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="lg:hidden">
              <Menu className="w-5 h-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0 border-r-border w-[260px] bg-bg">
            <SidebarContent onItemClick={() => setMobileOpen(false)} />
          </SheetContent>
        </Sheet>
        
        <div className="flex items-center gap-2 text-sm">
          <span className="text-text-muted hidden sm:inline">Dashboard</span>
          <span className="text-text-muted hidden sm:inline">/</span>
          <span className="text-text-primary font-medium">{title}</span>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div 
          onClick={() => window.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', metaKey: true }))}
          className="hidden md:flex items-center px-3 py-1.5 rounded-md bg-surface border border-border text-text-muted text-xs cursor-pointer hover:border-primary transition-all group"
        >
          <Search className="w-4 h-4 mr-2 group-hover:text-primary" />
          <span>Search...</span>
          <kbd className="ml-4 px-1.5 py-0.5 rounded bg-border text-[10px] font-mono">⌘K</kbd>
        </div>

        <Popover>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="w-5 h-5 text-text-secondary" />
              <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-danger rounded-full border-2 border-bg"></span>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80 p-0 bg-elevated border-border" align="end">
            <div className="p-4 border-b border-border flex justify-between items-center">
              <h4 className="text-xs font-bold uppercase tracking-widest">Notifications</h4>
              <button className="text-[10px] text-primary hover:underline">Mark all read</button>
            </div>
            <div className="max-h-64 overflow-y-auto">
              {[
                { id: 1, text: "Gemini latency increased by 15%", time: "2m ago", type: "warning" },
                { id: 2, text: "Weekly routing report ready", time: "1h ago", type: "info" },
                { id: 3, text: "System maintenance scheduled", time: "5h ago", type: "system" }
              ].map(n => (
                <div key={n.id} className="p-4 border-b border-border-subtle hover:bg-white/5 cursor-pointer last:border-0">
                  <p className="text-xs text-text-primary mb-1">{n.text}</p>
                  <p className="text-[10px] text-text-muted">{n.time}</p>
                </div>
              ))}
            </div>
            <div className="p-3 text-center border-t border-border">
              <button className="text-[10px] text-text-muted hover:text-white transition-colors">View all history</button>
            </div>
          </PopoverContent>
        </Popover>

        <div className="hidden sm:flex items-center gap-2 px-2 py-1 rounded-full bg-success/10 border border-success/20 animate-pulse">
          <div className="w-1.5 h-1.5 rounded-full bg-success"></div>
          <span className="text-[10px] font-bold text-success uppercase tracking-wider">Live</span>
        </div>

        <Avatar className="w-8 h-8 border border-border">
          <AvatarImage src="https://picsum.photos/seed/user1/32/32" />
          <AvatarFallback className="bg-elevated"><User className="w-4 h-4" /></AvatarFallback>
        </Avatar>
      </div>
    </header>
  );
}