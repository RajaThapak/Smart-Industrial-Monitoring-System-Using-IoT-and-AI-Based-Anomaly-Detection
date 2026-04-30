import { useEffect, useRef, useState } from "react";

export type Point = { t: number; v: number };
export type Telemetry = {
  temperature: Point[];
  pressure: Point[];
  rpm: Point[];
  vibration: Point[];
};

const MAX_POINTS = 40;

function next(prev: number, target: number, volatility: number, min: number, max: number) {
  const drift = (target - prev) * 0.08;
  const noise = (Math.random() - 0.5) * volatility;
  return Math.max(min, Math.min(max, prev + drift + noise));
}

export function useTelemetry(running: boolean) {
  const seed = (n: number, base: number): Point[] =>
    Array.from({ length: n }).map((_, i) => ({ t: Date.now() - (n - i) * 1500, v: base }));

  const [data, setData] = useState<Telemetry>({
    temperature: seed(MAX_POINTS, 68),
    pressure: seed(MAX_POINTS, 4.2),
    rpm: seed(MAX_POINTS, 1450),
    vibration: seed(MAX_POINTS, 1.2),
  });

  const targetRef = useRef({ temp: 70, press: 4.3, rpm: 1500, vib: 1.2 });

  useEffect(() => {
    const id = setInterval(() => {
      // occasionally drift target to create realistic motion
      if (Math.random() < 0.12) {
        targetRef.current = {
          temp: 60 + Math.random() * 35,
          press: 3.5 + Math.random() * 2.5,
          rpm: running ? 1200 + Math.random() * 600 : 0,
          vib: 0.5 + Math.random() * (Math.random() < 0.1 ? 4.5 : 1.8),
        };
      }
      const tgt = targetRef.current;
      setData(prev => {
        const t = Date.now();
        const tempV = next(prev.temperature.at(-1)!.v, running ? tgt.temp : 25, 1.2, 15, 120);
        const pressV = next(prev.pressure.at(-1)!.v, running ? tgt.press : 1.0, 0.15, 0, 8);
        const rpmV = next(prev.rpm.at(-1)!.v, tgt.rpm, 40, 0, 2400);
        const vibV = next(prev.vibration.at(-1)!.v, running ? tgt.vib : 0.2, 0.25, 0, 6);
        return {
          temperature: [...prev.temperature.slice(-MAX_POINTS + 1), { t, v: +tempV.toFixed(1) }],
          pressure: [...prev.pressure.slice(-MAX_POINTS + 1), { t, v: +pressV.toFixed(2) }],
          rpm: [...prev.rpm.slice(-MAX_POINTS + 1), { t, v: Math.round(rpmV) }],
          vibration: [...prev.vibration.slice(-MAX_POINTS + 1), { t, v: +vibV.toFixed(2) }],
        };
      });
    }, 1500);
    return () => clearInterval(id);
  }, [running]);

  return data;
}