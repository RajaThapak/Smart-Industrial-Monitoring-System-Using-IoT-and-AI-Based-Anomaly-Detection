import { Search, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const alerts = [
  { time: "14:32:05", sensor: "Vibration", desc: "Amplitude exceeded threshold (4.2 RMS)", severity: "high", status: "Pending" },
  { time: "14:28:11", sensor: "Temperature", desc: "Gradual increase detected (74°C)", severity: "medium", status: "Pending" },
  { time: "14:15:42", sensor: "Sound", desc: "Unusual frequency pattern at 2.4kHz", severity: "medium", status: "Resolved" },
  { time: "13:58:30", sensor: "AI Model", desc: "Anomaly score spike to 45%", severity: "high", status: "Resolved" },
  { time: "13:42:18", sensor: "Temperature", desc: "Brief fluctuation (±3°C)", severity: "low", status: "Resolved" },
  { time: "13:20:01", sensor: "Vibration", desc: "Minor resonance detected", severity: "low", status: "Resolved" },
];

const severityClass: Record<string, string> = {
  high: "badge-severity-high",
  medium: "badge-severity-medium",
  low: "badge-severity-low",
};

export function AlertsTable() {
  return (
    <div className="panel">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <h3 className="text-sm font-semibold text-foreground">Recent Alerts</h3>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
            <Input placeholder="Search alerts..." className="pl-8 h-8 text-xs w-48 bg-muted/50" />
          </div>
          <Button variant="outline" size="sm" className="h-8 text-xs gap-1.5">
            <Filter className="h-3 w-3" /> Filter
          </Button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-border text-muted-foreground">
              <th className="text-left py-2.5 px-3 font-medium">Time</th>
              <th className="text-left py-2.5 px-3 font-medium">Sensor</th>
              <th className="text-left py-2.5 px-3 font-medium">Description</th>
              <th className="text-left py-2.5 px-3 font-medium">Severity</th>
              <th className="text-left py-2.5 px-3 font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {alerts.map((alert, i) => (
              <tr key={i} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                <td className="py-2.5 px-3 font-mono text-muted-foreground">{alert.time}</td>
                <td className="py-2.5 px-3 text-foreground">{alert.sensor}</td>
                <td className="py-2.5 px-3 text-muted-foreground max-w-[200px] truncate">{alert.desc}</td>
                <td className="py-2.5 px-3">
                  <Badge variant="outline" className={`text-[10px] ${severityClass[alert.severity]}`}>
                    {alert.severity.toUpperCase()}
                  </Badge>
                </td>
                <td className="py-2.5 px-3">
                  <span className={`text-xs ${alert.status === "Pending" ? "text-warning" : "text-primary"}`}>
                    {alert.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
