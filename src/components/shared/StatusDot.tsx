import { cn } from "@/lib/utils";

interface StatusDotProps {
  status: 'active' | 'degraded' | 'down';
  className?: string;
}

export function StatusDot({ status, className }: StatusDotProps) {
  return (
    <div className={cn("relative flex h-2 w-2", className)}>
      {status === 'active' && (
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75"></span>
      )}
      <span className={cn(
        "relative inline-flex rounded-full h-2 w-2",
        status === 'active' ? "bg-success" : 
        status === 'degraded' ? "bg-warning" : "bg-danger"
      )}></span>
    </div>
  );
}