"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import {
  LayoutDashboard,
  PlayCircle,
  BarChart3,
  ListOrdered,
  Settings,
  Search,
} from "lucide-react";

import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { NAVIGATION } from "./Sidebar";
import { cn } from "@/lib/utils";

export function CommandPalette() {
  const [open, setOpen] = React.useState(false);
  const [search, setSearch] = React.useState("");
  const router = useRouter();

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const filteredItems = NAVIGATION.filter((item) =>
    item.name.toLowerCase().includes(search.toLowerCase())
  );

  const onSelect = (href: string) => {
    router.push(href);
    setOpen(false);
    setSearch("");
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-xl p-0 overflow-hidden bg-elevated border-border gap-0 top-[20%] translate-y-0">
        <div className="flex items-center border-b border-border px-4 py-3">
          <Search className="w-5 h-5 text-text-muted mr-3" />
          <Input
            placeholder="Search commands or navigate..."
            className="border-0 bg-transparent focus-visible:ring-0 text-base h-auto p-0"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            autoFocus
          />
          <kbd className="ml-auto px-2 py-0.5 rounded bg-white/5 border border-border text-[10px] text-text-muted font-mono">
            ESC
          </kbd>
        </div>
        <div className="max-h-[300px] overflow-y-auto p-2">
          {filteredItems.length > 0 ? (
            <div className="space-y-1">
              {filteredItems.map((item) => (
                <button
                  key={item.href}
                  onClick={() => onSelect(item.href)}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-md hover:bg-primary/10 hover:text-primary transition-all text-left text-sm font-medium group"
                >
                  <item.icon className="w-4 h-4 text-text-muted group-hover:text-primary" />
                  {item.name}
                </button>
              ))}
            </div>
          ) : (
            <div className="py-10 text-center text-sm text-text-muted">
              No results found for &quot;{search}&quot;
            </div>
          )}
        </div>
        <div className="bg-bg/50 px-4 py-2 border-t border-border flex items-center gap-4">
          <div className="flex items-center gap-1.5 text-[10px] text-text-muted font-bold uppercase tracking-wider">
            <span className="px-1.5 py-0.5 rounded bg-white/10">Enter</span> to select
          </div>
          <div className="flex items-center gap-1.5 text-[10px] text-text-muted font-bold uppercase tracking-wider">
            <span className="px-1.5 py-0.5 rounded bg-white/10">↑↓</span> to navigate
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}