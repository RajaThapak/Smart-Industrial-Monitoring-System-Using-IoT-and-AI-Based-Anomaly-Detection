import { Progress } from "@/components/ui/progress";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Cell } from "recharts";
import { Brain, ShieldAlert } from "lucide-react";
import { useTheme } from "@/hooks/use-theme";

function useAnomalyColors() {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  return {
    tick: isDark ? "hsl(215 20% 55%)" : "hsl(215 16% 47%)",
    primary: isDark ? "hsl(217 91% 60%)" : "hsl(217 91% 50%)",
    amber: "hsl(38 92% 50%)",
    emerald: isDark ? "hsl(152 69% 41%)" : "hsl(152 69% 36%)",
  };
}

export function AnomalyPanel() {
  const colors = useAnomalyColors();
  const score = 23;
  const prediction = "Normal";
  const confidence = 87;

  const contributionData = [
    { name: "Temperature", value: 35, color: colors.primary },
    { name: "Vibration", value: 45, color: colors.amber },
    { name: "Sound", value: 20, color: colors.emerald },
  ];

  return (
    <div className="panel space-y-5">
      <div className="flex items-center gap-2">
        <Brain className="h-5 w-5 text-primary" />
        <h3 className="text-sm font-semibold text-foreground">AI Anomaly Detection</h3>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-xs text-muted-foreground mb-1">Anomaly Score</p>
          <span className="text-3xl font-bold font-mono text-primary">{score}%</span>
        </div>
        <div>
          <p className="text-xs text-muted-foreground mb-1">Prediction</p>
          <div className="flex items-center gap-2 mt-1">
            <ShieldAlert className="h-4 w-4 text-primary" />
            <span className="text-sm font-semibold text-primary">{prediction}</span>
          </div>
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-1.5">
          <p className="text-xs text-muted-foreground">Confidence</p>
          <span className="text-xs font-mono text-foreground">{confidence}%</span>
        </div>
        <Progress value={confidence} className="h-2 bg-muted [&>div]:bg-primary" />
      </div>

      <div>
        <p className="text-xs text-muted-foreground mb-3">Feature Contributions</p>
        <div className="h-32">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={contributionData} layout="vertical">
              <XAxis type="number" tick={{ fontSize: 10, fill: colors.tick }} axisLine={false} />
              <YAxis type="category" dataKey="name" tick={{ fontSize: 10, fill: colors.tick }} axisLine={false} width={80} />
              <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={14}>
                {contributionData.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
