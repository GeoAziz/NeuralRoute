"use client";

import { useState } from "react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { MOCK_REQUESTS } from "@/lib/mock-data";
import { ProviderBadge } from "@/components/shared/ProviderBadge";
import { TaskChip } from "@/components/shared/TaskChip";
import { format } from "date-fns";
import { Search, Filter, ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function LogsPage() {
  const [search, setSearch] = useState("");
  const itemsPerPage = 15;
  const [page, setPage] = useState(1);

  const filtered = MOCK_REQUESTS.filter(r => 
    r.prompt.toLowerCase().includes(search.toLowerCase()) || 
    r.id.toLowerCase().includes(search.toLowerCase())
  );

  const paginated = filtered.slice((page - 1) * itemsPerPage, page * itemsPerPage);
  const totalPages = Math.ceil(filtered.length / itemsPerPage);

  return (
    <DashboardLayout title="Request Log">
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative w-full md:max-w-md group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted group-hover:text-primary transition-colors" />
            <Input 
              placeholder="Search by prompt hash or content..." 
              className="pl-10 bg-surface border-border focus:ring-primary/20"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" className="border-border bg-surface text-xs h-9">
              <Filter className="w-3 h-3 mr-2" /> Filters
            </Button>
            <div className="h-6 w-px bg-border-subtle mx-2" />
            <span className="text-[11px] font-bold text-text-muted uppercase tracking-widest">{filtered.length} Results</span>
          </div>
        </div>

        <Card className="bg-surface border-border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-white/5 text-text-muted text-[10px] font-bold uppercase tracking-widest">
                <tr>
                  <th className="px-6 py-4 text-left">Time</th>
                  <th className="px-6 py-4 text-left">Request ID</th>
                  <th className="px-6 py-4 text-left">Task</th>
                  <th className="px-6 py-4 text-left">Provider</th>
                  <th className="px-6 py-4 text-left">Latency</th>
                  <th className="px-6 py-4 text-left">Status</th>
                  <th className="px-6 py-4 text-right"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-subtle">
                {paginated.map((req) => (
                  <tr key={req.id} className="hover:bg-white/5 transition-colors group cursor-pointer">
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="text-xs font-medium text-white">{format(new Date(req.time), 'MMM d, HH:mm')}</span>
                        <span className="text-[10px] text-text-muted">{format(new Date(req.time), 'ss')}s</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-mono text-xs text-text-muted group-hover:text-primary transition-colors">#{req.id}</td>
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
                    <td className="px-6 py-4 text-right">
                      <MoreHorizontal className="w-4 h-4 text-text-muted" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="px-6 py-4 border-t border-border-subtle flex items-center justify-between bg-white/5">
            <span className="text-xs text-text-muted">Page {page} of {totalPages}</span>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                disabled={page === 1}
                onClick={() => setPage(p => p - 1)}
                className="border-border bg-surface text-xs h-8 px-3"
              >
                <ChevronLeft className="w-4 h-4 mr-1" /> Previous
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                disabled={page === totalPages}
                onClick={() => setPage(p => p + 1)}
                className="border-border bg-surface text-xs h-8 px-3"
              >
                Next <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
}