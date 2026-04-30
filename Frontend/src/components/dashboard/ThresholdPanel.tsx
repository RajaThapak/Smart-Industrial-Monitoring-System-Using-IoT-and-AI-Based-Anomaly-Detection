import { Sliders } from "lucide-react";
import { Slider } from "@/components/ui/slider";

export type Thresholds = {
  temperature: number;
  pressure: number;
  rpm: number;
  vibration: number;
};

type Props = {
  thresholds: Thresholds;
  onChange: (t: Thresholds) => void;
};

const defs: Array<{ key: keyof Thresholds; label: string; min: number; max: number; step: number; unit: string }> = [
  { key: "temperature", label: "Temperature", min: 40, max: 120, step: 1, unit: "°C" },
  { key: "pressure", label: "Pressure", min: 1, max: 8, step: 0.1, unit: "bar" },
  { key: "rpm", label: "RPM", min: 800, max: 2400, step: 10, unit: "rpm" },
  { key: "vibration", label: "Vibration", min: 0.5, max: 6, step: 0.1, unit: "mm/s" },
];

export function ThresholdPanel({ thresholds, onChange }: Props) {
  return (
    <div className="glass rounded-2xl p-5">
      <div className="mb-4 flex items-center gap-2">
        <Sliders className="h-4 w-4 text-primary" />
        <h3 className="font-display text-sm font-semibold">Threshold Settings</h3>
        <span className="ml-auto text-[10px] font-mono text-muted-foreground">Operator-tunable</span>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        {defs.map(d => {
          const v = thresholds[d.key];
          const pct = ((v - d.min) / (d.max - d.min)) * 100;
          return (
            <div key={d.key}>
              <div className="mb-2 flex items-baseline justify-between">
                <label className="text-xs font-medium text-muted-foreground">{d.label}</label>
                <span className="font-mono-tabular text-sm font-semibold">
                  {d.step < 1 ? v.toFixed(1) : v}
                  <span className="ml-1 text-[10px] font-mono text-muted-foreground">{d.unit}</span>
                </span>
              </div>
              <Slider
                value={[v]}
                min={d.min}
                max={d.max}
                step={d.step}
                onValueChange={([nv]) => onChange({ ...thresholds, [d.key]: nv })}
              />
              <div className="mt-1 flex justify-between text-[10px] font-mono text-muted-foreground/70">
                <span>{d.min}</span>
                <span>{Math.round(pct)}%</span>
                <span>{d.max}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
