import { Activity } from "lucide-react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { ScorePoint } from "@/hooks/useIsolationForest";

type Props = {
  history: ScorePoint[];
  threshold: number;
  current: number;
  isAnomaly: boolean;
};

const fmtTime = (t: number) =>
  new Date(t).toLocaleTimeString([], { minute: "2-digit", second: "2-digit" });

export function AnomalyScoreChart({ history, threshold, current, isAnomaly }: Props) {
  const pts = history.length
    ? history
    : [{ t: Date.now(), v: 0 }];

  return (
    <div className="glass rounded-2xl p-5">
      <div className="mb-4 flex items-baseline justify-between">
        <div className="flex items-center gap-2">
          <Activity className="h-4 w-4 text-primary" />
          <div>
            <h3 className="font-display text-sm font-semibold">
              Anomaly Score Trend{" "}
              <span className="text-muted-foreground">· Isolation Forest</span>
            </h3>
            <p className="text-[11px] font-mono text-muted-foreground">
              score 0–1 over time · threshold {threshold.toFixed(2)}
            </p>
          </div>
        </div>
        <span
          className={
            "rounded-full border px-2 py-0.5 text-[10px] font-mono uppercase tracking-wider " +
            (isAnomaly
              ? "border-destructive/40 bg-destructive/10 text-destructive"
              : "border-success/40 bg-success/10 text-success")
          }
        >
          {isAnomaly ? "Anomaly" : "Normal"} · {current.toFixed(2)}
        </span>
      </div>

      <div className="h-56 w-full">
        <ResponsiveContainer>
          <AreaChart data={pts} margin={{ top: 5, right: 8, left: -16, bottom: 0 }}>
            <defs>
              <linearGradient id="if-score-grad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="hsl(var(--destructive))" stopOpacity={0.45} />
                <stop offset="60%" stopColor="hsl(var(--primary))" stopOpacity={0.25} />
                <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid stroke="hsl(var(--border))" strokeDasharray="3 3" vertical={false} />
            <XAxis
              dataKey="t"
              tickFormatter={fmtTime}
              tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }}
              stroke="hsl(var(--border))"
            />
            <YAxis
              domain={[0, 1]}
              ticks={[0, 0.25, 0.5, 0.75, 1]}
              tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }}
              stroke="hsl(var(--border))"
              width={40}
            />
            <Tooltip
              contentStyle={{
                background: "hsl(var(--popover))",
                border: "1px solid hsl(var(--border))",
                borderRadius: 12,
                fontSize: 12,
              }}
              labelFormatter={(t) => fmtTime(Number(t))}
              formatter={(v: number) => [v.toFixed(3), "Score"]}
            />
            <ReferenceLine
              y={threshold}
              stroke="hsl(var(--destructive))"
              strokeDasharray="4 4"
              strokeWidth={1.5}
              label={{
                value: `threshold ${threshold.toFixed(2)}`,
                fill: "hsl(var(--destructive))",
                fontSize: 10,
                position: "right",
              }}
            />
            <Area
              type="monotone"
              dataKey="v"
              stroke="hsl(var(--primary))"
              strokeWidth={2.2}
              fill="url(#if-score-grad)"
              isAnimationActive={false}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
