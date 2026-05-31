import { cn } from "@/lib/utils";
import type { Stage, ConvStatus, DocStatus } from "@prisma/client";

const stageConfig: Record<Stage, { label: string; color: string; bg: string; dot: string }> = {
  LEADS: { label: "Leads", color: "text-blue-700", bg: "bg-blue-50 border-blue-200", dot: "bg-blue-500" },
  MEETING: { label: "Meeting", color: "text-amber-700", bg: "bg-amber-50 border-amber-200", dot: "bg-amber-500" },
  CLOSING: { label: "Closing", color: "text-emerald-700", bg: "bg-emerald-50 border-emerald-200", dot: "bg-emerald-500" },
};

export function StageBadge({ stage, size = "sm" }: { stage: Stage; size?: "sm" | "md" }) {
  const config = stageConfig[stage];
  return (
    <span className={cn(
      "inline-flex items-center gap-1.5 border rounded-full font-semibold",
      config.bg, config.color,
      size === "sm" ? "px-2.5 py-0.5 text-[11px]" : "px-3 py-1 text-xs"
    )}>
      <span className={cn("w-1.5 h-1.5 rounded-full pulse-dot", config.dot)} />
      {config.label}
    </span>
  );
}

const convStatusConfig: Record<ConvStatus, { label: string; color: string; bg: string; icon: string }> = {
  AI_HANDLING: { label: "AI", color: "text-violet-700", bg: "bg-violet-50 border-violet-200", icon: "🤖" },
  WAITING_CS: { label: "Menunggu CS", color: "text-red-700", bg: "bg-red-50 border-red-200", icon: "⏳" },
  CS_HANDLING: { label: "CS Aktif", color: "text-blue-700", bg: "bg-blue-50 border-blue-200", icon: "👤" },
  RESOLVED: { label: "Selesai", color: "text-gray-600", bg: "bg-gray-50 border-gray-200", icon: "✅" },
};

export function ConvStatusBadge({ status }: { status: ConvStatus }) {
  const config = convStatusConfig[status];
  return (
    <span className={cn(
      "inline-flex items-center gap-1 px-2 py-0.5 border rounded-full text-[11px] font-semibold",
      config.bg, config.color
    )}>
      <span>{config.icon}</span>
      {config.label}
    </span>
  );
}

const docStatusConfig: Record<DocStatus, { label: string; color: string; bg: string }> = {
  PROCESSING: { label: "Processing...", color: "text-amber-700", bg: "bg-amber-50 border-amber-200" },
  INDEXED: { label: "Indexed", color: "text-emerald-700", bg: "bg-emerald-50 border-emerald-200" },
  FAILED: { label: "Failed", color: "text-red-700", bg: "bg-red-50 border-red-200" },
};

export function DocStatusBadge({ status }: { status: DocStatus }) {
  const config = docStatusConfig[status];
  return (
    <span className={cn(
      "inline-flex items-center gap-1.5 px-2.5 py-0.5 border rounded-full text-[11px] font-semibold",
      config.bg, config.color
    )}>
      {status === "PROCESSING" && (
        <span className="w-3 h-3 border-2 border-amber-400 border-t-transparent rounded-full animate-spin" />
      )}
      {config.label}
    </span>
  );
}
