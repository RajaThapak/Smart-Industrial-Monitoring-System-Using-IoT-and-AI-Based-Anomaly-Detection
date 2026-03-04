import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area,
} from "recharts";
import { useTheme } from "@/hooks/use-theme";

const generateData = (base: number, variance: number, points = 20) =>
  Array.from({ length: points }, (_, i) => ({
    time: `${i}s`,
    value: +(base + (Math.random() - 0.5) * variance).toFixed(1),
  }));

const tempData = generateData(72, 8);
const vibData = generateData(3.8, 2);
const soundData = generateData(68, 15);

const chartConfig = {
  style: {
    backgroundColor: "transparent",
  },
};

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="panel !p-2 text-xs">
      <p className="text-muted-foreground">{label}</p>
      <p className="font-mono font-semibold text-foreground">{payload[0].value}</p>
    </div>
  );
};

function ChartCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="panel">
      <h3 className="text-sm font-semibold text-foreground mb-4">{title}</h3>
      <div className="h-48">{children}</div>
    </div>
  );
}

function useChartColors() {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  return {
    grid: isDark ? "hsl(215 28% 17%)" : "hsl(214 32% 91%)",
    tick: isDark ? "hsl(215 20% 55%)" : "hsl(215 16% 47%)",
    primary: isDark ? "hsl(217 91% 60%)" : "hsl(217 91% 50%)",
    amber: "hsl(38 92% 50%)",
    emerald: isDark ? "hsl(152 69% 41%)" : "hsl(152 69% 36%)",
  };
}

export function ChartsSection() {
  const colors = useChartColors();

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      <ChartCard title="Temperature (°C)">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={tempData}>
            <CartesianGrid strokeDasharray="3 3" stroke={colors.grid} />
            <XAxis dataKey="time" tick={{ fontSize: 10, fill: colors.tick }} axisLine={false} />
            <YAxis tick={{ fontSize: 10, fill: colors.tick }} axisLine={false} domain={["auto", "auto"]} />
            <Tooltip content={<CustomTooltip />} />
            <Line type="monotone" dataKey="value" stroke={colors.primary} strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </ChartCard>

      <ChartCard title="Vibration Amplitude (RMS)">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={vibData}>
            <CartesianGrid strokeDasharray="3 3" stroke={colors.grid} />
            <XAxis dataKey="time" tick={{ fontSize: 10, fill: colors.tick }} axisLine={false} />
            <YAxis tick={{ fontSize: 10, fill: colors.tick }} axisLine={false} domain={["auto", "auto"]} />
            <Tooltip content={<CustomTooltip />} />
            <Area type="monotone" dataKey="value" stroke={colors.amber} fill={`${colors.amber.slice(0, -1)} / 0.08)`} strokeWidth={2} />
          </AreaChart>
        </ResponsiveContainer>
      </ChartCard>

      <ChartCard title="Sound Waveform (dB)">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={soundData}>
            <CartesianGrid strokeDasharray="3 3" stroke={colors.grid} />
            <XAxis dataKey="time" tick={{ fontSize: 10, fill: colors.tick }} axisLine={false} />
            <YAxis tick={{ fontSize: 10, fill: colors.tick }} axisLine={false} domain={["auto", "auto"]} />
            <Tooltip content={<CustomTooltip />} />
            <Area type="monotone" dataKey="value" stroke={colors.emerald} fill={`${colors.emerald.slice(0, -1)} / 0.08)`} strokeWidth={2} />
          </AreaChart>
        </ResponsiveContainer>
      </ChartCard>
    </div>
  );
}
