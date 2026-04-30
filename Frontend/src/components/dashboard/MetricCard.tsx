import { Area, AreaChart, ResponsiveContainer } from "recharts";
import { ArrowDownRight, ArrowUpRight, LucideIcon } from "lucide-react";
import type { Point } from "@/hooks/useTelemetry";
import { cn } from "@/lib/utils";

type Props = {
  label: string;
  unit: string;
  value: number;
  data: Point[];
  icon: LucideIcon;
  threshold: number;
  accentVar?: string; // CSS color variable name e.g. "--primary"
  decimals?: number;
};

export function MetricCard({ label, unit, value, data, icon: Icon, threshold, accentVar = "--primary", decimals = 1 }: Props) {
  const prev = data.length > 1 ? data[data.length - 2].v : value;
  const delta = value - prev;
  const trendUp = delta >= 0;
  const exceeded = value > threshold;
  const id = `g-${label.replace(/\s/g, "")}`;

  const stroke = exceeded ? "hsl(var(--destructive))" : `hsl(var(${accentVar}))`;

  return (
    <div className="glass animate-float-up group relative overflow-hidden rounded-2xl p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-[var(--shadow-elegant)]">
      <div
        className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full opacity-20 blur-3xl transition-opacity group-hover:opacity-40"
        style={{ background: stroke }}
      />
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-2.5">
          <div
            className="grid h-9 w-9 place-items-center rounded-lg border border-border/60"
            style={{ background: `${stroke.replace("hsl", "hsla").replace(")", " / 0.12)")}` }}
          >
            <Icon className="h-4 w-4" style={{ color: stroke }} />
          </div>
          <div>
            <p className="text-[10px] font-mono uppercase tracking-[0.18em] text-muted-foreground">{label}</p>
            <p className="text-[10px] font-mono text-muted-foreground/70">Threshold {threshold}{unit}</p>
          </div>
        </div>
        <span
          className={cn(
            "flex items-center gap-0.5 rounded-full px-2 py-0.5 text-[10px] font-mono",
            trendUp ? "bg-success/15 text-success" : "bg-primary/10 text-primary"
          )}
        >
          {trendUp ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
          {Math.abs(delta).toFixed(decimals)}
        </span>
      </div>

      <div className="mt-4 flex items-end justify-between gap-3">
        <div>
          <div className="font-display font-mono-tabular text-3xl font-semibold leading-none sm:text-4xl">
            {value.toFixed(decimals)}
            <span className="ml-1 text-base font-medium text-muted-foreground">{unit}</span>
          </div>
          <p className={cn("mt-1.5 text-[11px] font-mono", exceeded ? "text-destructive" : "text-success")}>
            ● {exceeded ? "ABOVE THRESHOLD" : "NOMINAL"}
          </p>
        </div>
        <div className="h-14 w-1/2">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <defs>
                <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={stroke} stopOpacity={0.6} />
                  <stop offset="100%" stopColor={stroke} stopOpacity={0} />
                </linearGradient>
              </defs>
              <Area type="monotone" dataKey="v" stroke={stroke} strokeWidth={2} fill={`url(#${id})`} isAnimationActive={false} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
