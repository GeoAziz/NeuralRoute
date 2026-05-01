"use client";

import { Search, Bell, Menu, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

interface TopBarProps {
  title: string;
}

export function TopBar({ title }: TopBarProps) {
  return (
    <header className="h-16 border-bottom border-border bg-bg/80 backdrop-blur-md sticky top-0 z-40 flex items-center justify-between px-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" className="lg:hidden">
          <Menu className="w-5 h-5" />
        </Button>
        <div className="flex items-center gap-2 text-sm">
          <span className="text-text-muted">Dashboard</span>
          <span className="text-text-muted">/</span>
          <span className="text-text-primary font-medium">{title}</span>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="hidden md:flex items-center px-3 py-1.5 rounded-md bg-surface border border-border text-text-muted text-xs cursor-pointer hover:border-primary transition-all group">
          <Search className="w-4 h-4 mr-2 group-hover:text-primary" />
          <span>Search...</span>
          <kbd className="ml-4 px-1.5 py-0.5 rounded bg-border text-[10px] font-mono">⌘K</kbd>
        </div>

        <Button variant="ghost" size="icon" className="relative">
          <Bell className="w-5 h-5 text-text-secondary" />
          <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-danger rounded-full border-2 border-bg"></span>
        </Button>

        <div className="flex items-center gap-2 px-2 py-1 rounded-full bg-success/10 border border-success/20 animate-pulse">
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