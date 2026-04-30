import { AlertTriangle, CheckCircle2, ShieldAlert } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { Telemetry } from "@/hooks/useTelemetry";
import type { Thresholds } from "./ThresholdPanel";
import { useAlarm } from "@/hooks/useAlarm";
import { cn } from "@/lib/utils";

export type AnomalyAlert = {
  id: string;
  level: "critical" | "warning" | "info";
  metric: string;
  message: string;
  value: string;
  ts: number;
};

type Props = {
  data: Telemetry;
  thresholds: Thresholds;
  extraAlerts?: AnomalyAlert[];
};

const fmt = (t: number) => new Date(t).toLocaleTimeString();

export function AnomalyPanel({ data, thresholds, extraAlerts = [] }: Props) {
  const [alerts, setAlerts] = useState<AnomalyAlert[]>([]);
  const lastTs = useRef(0);
  const { trigger } = useAlarm();

  useEffect(() => {
    const checks: Array<{ key: keyof Telemetry; label: string; thr: number; unit: string }> = [
      { key: "temperature", label: "Temperature", thr: thresholds.temperature, unit: "°C" },
      { key: "pressure", label: "Pressure", thr: thresholds.pressure, unit: "bar" },
      { key: "rpm", label: "RPM", thr: thresholds.rpm, unit: "rpm" },
      { key: "vibration", label: "Vibration", thr: thresholds.vibration, unit: "mm/s" },
    ];
    const newOnes: AnomalyAlert[] = [];
    const now = Date.now();
    if (now - lastTs.current < 1000) return;
    checks.forEach(c => {
      const last = data[c.key].at(-1)!;
      if (last.v > c.thr) {
        const ratio = last.v / c.thr;
        newOnes.push({
          id: `${c.key}-${last.t}`,
          level: ratio > 1.25 ? "critical" : "warning",
          metric: c.label,
          message: ratio > 1.25 ? `${c.label} critically exceeds threshold` : `${c.label} above safe range`,
          value: `${last.v}${c.unit}`,
          ts: last.t,
        });
      }
    });
    if (newOnes.length) {
      lastTs.current = now;
      // Sound alarm only for critical vibration anomalies
      if (newOnes.some(a => a.level === "critical" && a.metric === "Vibration")) {
        trigger();
      }
      setAlerts(prev => [...newOnes, ...prev].slice(0, 12));
    }
  }, [data, thresholds, trigger]);

  const merged = [...extraAlerts, ...alerts]
    .sort((a, b) => b.ts - a.ts)
    .slice(0, 14);
  const allOk = merged.length === 0;

  return (
    <div className="glass flex h-full flex-col rounded-2xl p-5">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ShieldAlert className="h-4 w-4 text-primary" />
          <h3 className="font-display text-sm font-semibold">Anomaly Detection</h3>
        </div>
        <span
          className={cn(
            "rounded-full px-2.5 py-0.5 text-[10px] font-mono uppercase tracking-wider",
            allOk ? "bg-success/15 text-success" : "bg-destructive/15 text-destructive"
          )}
        >
          {allOk ? "All Systems Normal" : `${merged.length} Active`}
        </span>
      </div>

      <div className="flex-1 space-y-2 overflow-y-auto pr-1" style={{ maxHeight: 320 }}>
        {allOk ? (
          <div className="flex h-full flex-col items-center justify-center gap-2 py-10 text-center">
            <div className="grid h-12 w-12 place-items-center rounded-full bg-success/15 text-success">
              <CheckCircle2 className="h-6 w-6" />
            </div>
            <p className="font-display text-sm font-medium">All readings nominal</p>
            <p className="text-xs text-muted-foreground">No anomalies detected in the last cycle</p>
          </div>
        ) : (
          merged.map(a => (
            <div
              key={a.id}
              className={cn(
                "animate-float-up flex items-start gap-3 rounded-xl border px-3 py-2.5",
                a.level === "critical"
                  ? "border-destructive/40 bg-destructive/10"
                  : "border-warning/40 bg-warning/10"
              )}
            >
              <AlertTriangle
                className={cn("mt-0.5 h-4 w-4 shrink-0", a.level === "critical" ? "text-destructive" : "text-warning")}
              />
              <div className="min-w-0 flex-1">
                <div className="flex items-baseline justify-between gap-2">
                  <p className="truncate font-display text-sm font-medium">{a.metric}</p>
                  <span className="font-mono text-[10px] text-muted-foreground">{fmt(a.ts)}</span>
                </div>
                <p className="text-xs text-muted-foreground">{a.message}</p>
                <p className="mt-0.5 font-mono-tabular text-xs font-semibold">
                  Value: <span className={a.level === "critical" ? "text-destructive" : "text-warning"}>{a.value}</span>
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
