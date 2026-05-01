import { TASK_TYPES, TaskTypeId } from "@/lib/mock-data";
import { Code, Brain, Layers, Brackets, Search, LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

const ICONS: Record<string, LucideIcon> = {
  Code: Code,
  Brain: Brain,
  Layers: Layers,
  Brackets: Brackets,
  Search: Search
};

interface TaskChipProps {
  taskId: TaskTypeId;
  className?: string;
}

export function TaskChip({ taskId, className }: TaskChipProps) {
  const task = TASK_TYPES.find(t => t.id === taskId);
  if (!task) return null;

  const Icon = ICONS[task.icon];

  return (
    <div className={cn(
      "inline-flex items-center gap-1.5 px-2 py-0.5 rounded-sm text-xs font-medium border",
      taskId === 'code' && "bg-blue-500/10 border-blue-500/20 text-blue-400",
      taskId === 'reasoning' && "bg-purple-500/10 border-purple-500/20 text-purple-400",
      taskId === 'summarisation' && "bg-teal-500/10 border-teal-500/20 text-teal-400",
      taskId === 'extraction' && "bg-orange-500/10 border-orange-500/20 text-orange-400",
      taskId === 'rag' && "bg-green-500/10 border-green-500/20 text-green-400",
      className
    )}>
      {Icon && <Icon className="w-3 h-3" />}
      {task.label}
    </div>
  );
}