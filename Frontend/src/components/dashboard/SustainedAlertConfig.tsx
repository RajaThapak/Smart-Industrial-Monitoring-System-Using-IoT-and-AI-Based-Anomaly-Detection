import { Timer } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";

type Props = {
  durationSec: number;
  onDurationChange: (v: number) => void;
  threshold: number;
  onThresholdChange: (v: number) => void;
  elapsedSec: number;
  progress: number;
  active: boolean;
  currentScore: number;
};

export function SustainedAlertConfig({
  durationSec,
  onDurationChange,
  threshold,
  onThresholdChange,
  elapsedSec,
  progress,
  active,
  currentScore,
}: Props) {
  return (
    <div className="glass flex h-full flex-col gap-4 rounded-2xl p-5">
      <div className="flex items-center gap-2">
        <Timer className="h-4 w-4 text-primary" />
        <h3 className="font-display text-sm font-semibold">Sustained Anomaly Alert</h3>
        <span
          className={cn(
            "ml-auto rounded-full px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider",
            active
              ? "bg-destructive/15 text-destructive"
              : progress > 0
                ? "bg-warning/15 text-warning"
                : "bg-success/15 text-success"
          )}
        >
          {active ? "Triggered" : progress > 0 ? "Building" : "Idle"}
        </span>
      </div>

      <div>
        <div className="mb-2 flex items-baseline justify-between">
          <label className="text-xs font-medium text-muted-foreground">
            Trigger duration
          </label>
          <span className="font-mono-tabular text-sm font-semibold">
            {durationSec}
            <span className="ml-1 text-[10px] font-mono text-muted-foreground">sec</span>
          </span>
        </div>
        <Slider
          value={[durationSec]}
          min={2}
          max={60}
          step={1}
          onValueChange={([v]) => onDurationChange(v)}
        />
        <div className="mt-1 flex justify-between text-[10px] font-mono text-muted-foreground/70">
          <span>2s</span>
          <span>60s</span>
        </div>
      </div>

      <div>
        <div className="mb-2 flex items-baseline justify-between">
          <label className="text-xs font-medium text-muted-foreground">
            Score threshold
          </label>
          <span className="font-mono-tabular text-sm font-semibold">
            {threshold.toFixed(2)}
          </span>
        </div>
        <Slider
          value={[threshold]}
          min={0.3}
          max={0.9}
          step={0.01}
          onValueChange={([v]) => onThresholdChange(+v.toFixed(2))}
        />
        <div className="mt-1 flex justify-between text-[10px] font-mono text-muted-foreground/70">
          <span>0.30</span>
          <span>0.90</span>
        </div>
      </div>

      <div className="mt-auto">
        <div className="mb-1.5 flex items-center justify-between text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
          <span>Above-threshold time</span>
          <span>
            {elapsedSec.toFixed(1)}s / {durationSec}s · score {currentScore.toFixed(2)}
          </span>
        </div>
        <div className="relative h-2 overflow-hidden rounded-full bg-muted">
          <div
            className={cn(
              "absolute left-0 top-0 h-full rounded-full transition-all",
              active
                ? "bg-destructive"
                : progress > 0
                  ? "bg-warning"
                  : "bg-muted-foreground/30"
            )}
            style={{ width: `${Math.round(progress * 100)}%` }}
          />
        </div>
      </div>
    </div>
  );
}
