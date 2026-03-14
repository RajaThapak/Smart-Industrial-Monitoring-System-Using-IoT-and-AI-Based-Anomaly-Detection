import { Thermometer, Activity, Volume2, Brain, Zap, Gauge } from "lucide-react";

const kpis = [
  {
    label: "Temperature",
    value: "72.4",
    unit: "°C",
    icon: Thermometer,
    status: "normal" as const,
    trend: "+1.2%",
  },
  {
    label: "Vibration",
    value: "3.82",
    unit: "RMS",
    icon: Activity,
    status: "warning" as const,
    trend: "+8.5%",
  },
  {
    label: "Sound Level",
    value: "68.1",
    unit: "dB",
    icon: Volume2,
    status: "normal" as const,
    trend: "-0.4%",
  },
  {
    label: "Motor Current",
    value: "4.6",
    unit: "A",
    icon: Gauge,
    status: "purple" as const,
    trend: "+1.8%",
  },
  {
    label: "AI Anomaly Score",
    value: "23",
    unit: "%",
    icon: Brain,
    status: "normal" as const,
    trend: "-2.1%",
  },
  {
    label: "Actuator Status",
    value: "ON",
    unit: "",
    icon: Zap,
    status: "active" as const,
    trend: "",
  },
];

const statusColors: Record<string, string> = {
  normal: "text-primary",
  warning: "text-warning",
  critical: "text-destructive",
  active: "text-primary",
  purple: "text-violet-500",
};

const statusBg: Record<string, string> = {
  normal: "bg-primary/10",
  warning: "bg-warning/10",
  critical: "bg-destructive/10",
  active: "bg-primary/10",
  purple: "bg-violet-500/10",
};

export function KPICards() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
      {kpis.map((kpi) => (
        <div key={kpi.label} className="kpi-card">
          <div className="relative z-10 flex items-start justify-between">
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">{kpi.label}</p>
              <div className="flex items-baseline gap-1">
                <span className={`text-2xl font-bold font-mono ${statusColors[kpi.status]}`}>
                  {kpi.value}
                </span>
                <span className="text-sm text-muted-foreground">{kpi.unit}</span>
              </div>
              {kpi.trend && (
                <span className={`text-xs mt-1 inline-block ${kpi.trend.startsWith("+") ? "text-warning" : "text-primary"}`}>
                  {kpi.trend}
                </span>
              )}
            </div>
            <div className={`p-2.5 rounded-lg ${statusBg[kpi.status]}`}>
              <kpi.icon className={`h-5 w-5 ${statusColors[kpi.status]}`} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
