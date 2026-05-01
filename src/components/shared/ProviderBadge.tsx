import { PROVIDERS, ProviderId } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

interface ProviderBadgeProps {
  providerId: ProviderId;
  className?: string;
}

export function ProviderBadge({ providerId, className }: ProviderBadgeProps) {
  const provider = PROVIDERS[providerId];
  if (!provider) return null;

  return (
    <div 
      className={cn(
        "inline-flex items-center gap-2 px-2.5 py-0.5 rounded-sm border text-xs font-medium",
        className
      )}
      style={{
        backgroundColor: `${provider.color}15`,
        borderColor: `${provider.color}35`,
        color: provider.color,
        borderLeftWidth: '3px',
        borderLeftColor: provider.color
      }}
    >
      <span className="w-2 h-2 rounded-full" style={{ backgroundColor: provider.color }} />
      {provider.name}
    </div>
  );
}