import { CircleStop, Play, Power, Square } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export type MachineStatus = "running" | "stopped" | "error";

type Props = {
  status: MachineStatus;
  onStart: () => void;
  onStop: () => void;
  onEmergency: () => void;
};

const statusMap: Record<MachineStatus, { label: string; color: string; bg: string }> = {
  running: { label: "Running", color: "text-success", bg: "bg-success" },
  stopped: { label: "Stopped", color: "text-muted-foreground", bg: "bg-muted-foreground" },
  error: { label: "Emergency Stop", color: "text-destructive", bg: "bg-destructive" },
};

export function ControlPanel({ status, onStart, onStop, onEmergency }: Props) {
  const s = statusMap[status];
  return (
    <div className="glass flex h-full flex-col gap-5 rounded-2xl p-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Power className="h-4 w-4 text-primary" />
          <h3 className="font-display text-sm font-semibold">Machine Control</h3>
        </div>
        <div className="flex items-center gap-2 rounded-full border border-border/60 bg-background/40 px-3 py-1">
          <span className={cn("status-dot inline-block h-2 w-2 rounded-full", s.bg, s.color)} />
          <span className={cn("font-mono text-[11px] uppercase tracking-wider", s.color)}>{s.label}</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Button
          onClick={onStart}
          disabled={status === "running"}
          className="h-12 rounded-xl bg-[image:var(--gradient-primary)] font-display text-primary-foreground shadow-[var(--shadow-glow)] transition hover:scale-[1.02] disabled:opacity-50"
        >
          <Play className="mr-1.5 h-4 w-4 fill-current" /> Start
        </Button>
        <Button
          onClick={onStop}
          disabled={status === "stopped"}
          variant="secondary"
          className="h-12 rounded-xl font-display transition hover:scale-[1.02]"
        >
          <Square className="mr-1.5 h-3.5 w-3.5 fill-current" /> Stop
        </Button>
      </div>

      <button
        onClick={onEmergency}
        className={cn(
          "group relative mt-auto overflow-hidden rounded-xl bg-[image:var(--gradient-danger)] p-[2px] transition-transform hover:scale-[1.02]",
          status === "error" && "animate-pulse-glow"
        )}
      >
        <div className="flex items-center justify-center gap-2 rounded-[10px] bg-destructive py-3.5 font-display font-semibold uppercase tracking-wider text-destructive-foreground">
          <CircleStop className="h-5 w-5" />
          Emergency Stop
        </div>
        <div className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/30 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
      </button>

      <div className="grid grid-cols-3 gap-2 border-t border-border/60 pt-4 text-center">
        <Stat label="Uptime" value="14h 32m" />
        <Stat label="Cycles" value="1,284" />
        <Stat label="Efficiency" value="94%" />
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="font-display font-mono-tabular text-sm font-semibold">{value}</p>
      <p className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">{label}</p>
    </div>
  );
}
