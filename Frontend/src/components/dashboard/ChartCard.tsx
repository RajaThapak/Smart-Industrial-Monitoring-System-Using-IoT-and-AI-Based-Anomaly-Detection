import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis, ReferenceLine, Area, AreaChart } from "recharts";
import type { Point } from "@/hooks/useTelemetry";

type Props = {
  title: string;
  subtitle?: string;
  data: Point[];
  unit: string;
  threshold: number;
  colorVar?: string;
  variant?: "line" | "area" | "bars";
};

const fmtTime = (t: number) => new Date(t).toLocaleTimeString([], { minute: "2-digit", second: "2-digit" });

export function ChartCard({ title, subtitle, data, unit, threshold, colorVar = "--primary", variant = "line" }: Props) {
  const color = `hsl(var(${colorVar}))`;
  const id = `cc-${title.replace(/\s/g, "")}`;

  return (
    <div className="glass rounded-2xl p-5">
      <div className="mb-4 flex items-baseline justify-between">
        <div>
          <h3 className="font-display text-sm font-semibold">{title}</h3>
          {subtitle && <p className="text-[11px] font-mono text-muted-foreground">{subtitle}</p>}
        </div>
        <span className="rounded-full border border-border/60 bg-background/40 px-2 py-0.5 text-[10px] font-mono text-muted-foreground">
          last {data.length} pts
        </span>
      </div>
      <div className="h-48 w-full">
        <ResponsiveContainer>
          {variant === "area" ? (
            <AreaChart data={data} margin={{ top: 5, right: 8, left: -16, bottom: 0 }}>
              <defs>
                <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={color} stopOpacity={0.5} />
                  <stop offset="100%" stopColor={color} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="hsl(var(--border))" strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="t" tickFormatter={fmtTime} tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} stroke="hsl(var(--border))" />
              <YAxis tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} stroke="hsl(var(--border))" width={40} />
              <Tooltip
                contentStyle={{ background: "hsl(var(--popover))", border: "1px solid hsl(var(--border))", borderRadius: 12, fontSize: 12 }}
                labelFormatter={(t) => fmtTime(Number(t))}
                formatter={(v: number) => [`${v} ${unit}`, title]}
              />
              <ReferenceLine y={threshold} stroke="hsl(var(--destructive))" strokeDasharray="4 4" strokeWidth={1.5} label={{ value: `max ${threshold}`, fill: "hsl(var(--destructive))", fontSize: 10, position: "right" }} />
              <Area type="monotone" dataKey="v" stroke={color} strokeWidth={2} fill={`url(#${id})`} isAnimationActive={false} />
            </AreaChart>
          ) : (
            <LineChart data={data} margin={{ top: 5, right: 8, left: -16, bottom: 0 }}>
              <CartesianGrid stroke="hsl(var(--border))" strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="t" tickFormatter={fmtTime} tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} stroke="hsl(var(--border))" />
              <YAxis tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} stroke="hsl(var(--border))" width={40} />
              <Tooltip
                contentStyle={{ background: "hsl(var(--popover))", border: "1px solid hsl(var(--border))", borderRadius: 12, fontSize: 12 }}
                labelFormatter={(t) => fmtTime(Number(t))}
                formatter={(v: number) => [`${v} ${unit}`, title]}
              />
              <ReferenceLine y={threshold} stroke="hsl(var(--destructive))" strokeDasharray="4 4" strokeWidth={1.5} label={{ value: `max ${threshold}`, fill: "hsl(var(--destructive))", fontSize: 10, position: "right" }} />
              <Line type="monotone" dataKey="v" stroke={color} strokeWidth={2.2} dot={false} isAnimationActive={false} />
            </LineChart>
          )}
        </ResponsiveContainer>
      </div>
    </div>
  );
}
