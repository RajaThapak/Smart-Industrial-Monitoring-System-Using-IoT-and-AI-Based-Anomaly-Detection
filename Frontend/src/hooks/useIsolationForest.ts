import { useEffect, useMemo, useRef, useState } from "react";
import { IsolationForest } from "@/lib/isolationForest";
import type { Telemetry } from "./useTelemetry";


export type ScorePoint = { t: number; v: number };

export type IFPrediction = {
  isAnomaly: boolean;
  score: number; // 0..1, higher = more anomalous
  threshold: number;
  trained: boolean;
  trainSize: number;
  features: { temperature: number; pressure: number; rpm: number; vibration: number };
  history: ScorePoint[];
};

const DEFAULT_THRESHOLD = 0.6;
const MAX_HISTORY = 60;

/**
 * Builds feature vectors from the latest aligned telemetry samples,
 * fits an Isolation Forest on the rolling window, and scores the most
 * recent point. Also keeps a rolling history of scores for charting.
 */
export function useIsolationForest(data: Telemetry, threshold: number = DEFAULT_THRESHOLD): IFPrediction {
  const forestRef = useRef(new IsolationForest());
  const lastFitRef = useRef(0);
  const lastTsRef = useRef(0);
  const [history, setHistory] = useState<ScorePoint[]>([]);

  // Build aligned matrix [n][4]: temperature, pressure, rpm, vibration
  const samples = useMemo(() => {
    const n = Math.min(
      data.temperature.length,
      data.pressure.length,
      data.rpm.length,
      data.vibration.length
    );
    const out: number[][] = [];
    for (let i = 0; i < n; i++) {
      out.push([
        data.temperature[i].v,
        data.pressure[i].v,
        data.rpm[i].v,
        data.vibration[i].v,
      ]);
    }
    return out;
  }, [data]);

  // Refit periodically so the forest reflects the current operating regime.
  useEffect(() => {
    if (samples.length < 12) return;
    if (samples.length - lastFitRef.current >= 10 || lastFitRef.current === 0) {
      forestRef.current.fit(samples, 80, Math.min(48, samples.length));
      lastFitRef.current = samples.length;
    }
  }, [samples]);

  const last = samples.at(-1);
  const score = last ? forestRef.current.score(last) : 0;
  const lastT = data.temperature.at(-1)?.t ?? 0;

  // Append to history once per new telemetry tick.
  useEffect(() => {
    if (!last || samples.length < 12 || lastT === lastTsRef.current) return;
    lastTsRef.current = lastT;
    setHistory(prev => {
      const next = [...prev, { t: lastT, v: +score.toFixed(3) }];
      return next.length > MAX_HISTORY ? next.slice(-MAX_HISTORY) : next;
    });
  }, [lastT, score, last, samples.length]);

  return {
    isAnomaly: score > threshold,
    score,
    threshold,
    trained: samples.length >= 12,
    trainSize: samples.length,
    features: last
      ? { temperature: last[0], pressure: last[1], rpm: last[2], vibration: last[3] }
      : { temperature: 0, pressure: 0, rpm: 0, vibration: 0 },
    history,
  };
}
