import { Brain, AlertOctagon, CheckCircle2 } from "lucide-react";
import type { IFPrediction } from "@/hooks/useIsolationForest";
import { cn } from "@/lib/utils";

type Props = { prediction: IFPrediction };

export function IsolationForestCard({ prediction }: Props) {
  const { isAnomaly, score, threshold, trained, trainSize, features } = prediction;
  const pct = Math.round(score * 100);
  const thrPct = Math.round(threshold * 100);

  return (
    <div className="glass flex h-full flex-col gap-4 rounded-2xl p-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Brain className="h-4 w-4 text-primary" />
          <h3 className="font-display text-sm font-semibold">
            Isolation Forest <span className="text-muted-foreground">· ML Anomaly</span>
          </h3>
        </div>
        <span className="rounded-full border border-border/60 bg-background/40 px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
          {trained ? `n=${trainSize}` : "warming up"}
        </span>
      </div>

      <div
        className={cn(
          "flex items-center gap-3 rounded-xl border px-4 py-3 transition-colors",
          !trained
            ? "border-border/60 bg-background/40"
            : isAnomaly
              ? "border-destructive/50 bg-destructive/10"
              : "border-success/40 bg-success/10"
        )}
      >
        <div
          className={cn(
            "grid h-11 w-11 shrink-0 place-items-center rounded-full",
            !trained
              ? "bg-muted text-muted-foreground"
              : isAnomaly
                ? "bg-destructive/20 text-destructive animate-pulse-glow"
                : "bg-success/20 text-success"
          )}
        >
          {isAnomaly ? <AlertOctagon className="h-5 w-5" /> : <CheckCircle2 className="h-5 w-5" />}
        </div>
        <div className="min-w-0 flex-1">
          <p
            className={cn(
              "font-display text-base font-semibold",
              !trained ? "text-muted-foreground" : isAnomaly ? "text-destructive" : "text-success"
            )}
          >
            {!trained ? "Collecting samples…" : isAnomaly ? "Anomaly Detected" : "No Anomaly"}
          </p>
          <p className="text-xs text-muted-foreground">
            Predicted from temperature, pressure, RPM, vibration
          </p>
        </div>
        <div className="text-right">
          <p className="font-mono-tabular font-display text-xl font-bold">{pct}</p>
          <p className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
            score / 100
          </p>
        </div>
      </div>

      <div>
        <div className="mb-1.5 flex items-center justify-between text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
          <span>Anomaly score</span>
          <span>threshold {thrPct}</span>
        </div>
        <div className="relative h-2 overflow-hidden rounded-full bg-muted">
          <div
            className={cn(
              "absolute left-0 top-0 h-full rounded-full transition-all duration-500",
              isAnomaly ? "bg-destructive" : "bg-success"
            )}
            style={{ width: `${pct}%` }}
          />
          <div
            className="absolute top-[-2px] h-3 w-px bg-foreground/60"
            style={{ left: `${thrPct}%` }}
          />
        </div>
      </div>

      <div className="grid grid-cols-4 gap-2 border-t border-border/60 pt-3">
        <Feat label="Temp" value={features.temperature.toFixed(1)} unit="°C" />
        <Feat label="Press" value={features.pressure.toFixed(2)} unit="bar" />
        <Feat label="RPM" value={Math.round(features.rpm).toString()} unit="" />
        <Feat label="Vib" value={features.vibration.toFixed(2)} unit="mm/s" />
      </div>
    </div>
  );
}

function Feat({ label, value, unit }: { label: string; value: string; unit: string }) {
  return (
    <div className="text-center">
      <p className="font-mono-tabular font-display text-sm font-semibold">{value}</p>
      <p className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
        {label}
        {unit && <span className="ml-0.5 normal-case">{unit}</span>}
      </p>
    </div>
  );
}
