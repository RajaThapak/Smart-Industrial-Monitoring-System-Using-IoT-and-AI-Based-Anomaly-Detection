import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, AreaChart, Area } from "recharts";

const generateHistorical = (base: number, variance: number, points = 50) =>
  Array.from({ length: points }, (_, i) => ({
    time: `${i}m`,
    value: +(base + Math.sin(i / 5) * variance + (Math.random() - 0.5) * variance * 0.5).toFixed(1),
  }));

const tempHistory = generateHistorical(70, 10);
const vibHistory = generateHistorical(3.5, 1.5);

const Historical = () => {
  return (
    <div className="space-y-6 max-w-[1600px] mx-auto">
      <div>
        <h2 className="text-lg font-semibold text-foreground mb-1">Historical View</h2>
        <p className="text-sm text-muted-foreground">Past sensor readings and trends</p>
      </div>

      <div className="panel">
        <h3 className="text-sm font-semibold text-foreground mb-4">Temperature History (1h)</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={tempHistory}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(220 13% 22%)" />
              <XAxis dataKey="time" tick={{ fontSize: 10, fill: "hsl(215 15% 55%)" }} axisLine={false} />
              <YAxis tick={{ fontSize: 10, fill: "hsl(215 15% 55%)" }} axisLine={false} />
              <Line type="monotone" dataKey="value" stroke="hsl(160 64% 40%)" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="panel">
        <h3 className="text-sm font-semibold text-foreground mb-4">Vibration History (1h)</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={vibHistory}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(220 13% 22%)" />
              <XAxis dataKey="time" tick={{ fontSize: 10, fill: "hsl(215 15% 55%)" }} axisLine={false} />
              <YAxis tick={{ fontSize: 10, fill: "hsl(215 15% 55%)" }} axisLine={false} />
              <Area type="monotone" dataKey="value" stroke="hsl(43 96% 56%)" fill="hsl(43 96% 56% / 0.1)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Historical;
