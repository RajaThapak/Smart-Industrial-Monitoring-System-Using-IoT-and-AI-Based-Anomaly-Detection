import { useEffect, useRef, useState } from "react";

export type SustainedAlert = {
  id: string;
  startedAt: number;
  endedAt: number;
  durationMs: number;
  peakScore: number;
};

type Options = {
  /** Score threshold (0..1) above which we consider the system anomalous. */
  threshold: number;
  /** Required sustained duration (seconds) before firing an alert. */
  durationSec: number;
  /** Called once when a sustained anomaly is confirmed (rising edge). */
  onTrigger?: (alert: SustainedAlert) => void;
};

export type SustainedState = {
  /** True once durationSec has been continuously exceeded. */
  active: boolean;
  /** Seconds the score has been above threshold (0 if currently below). */
  elapsedSec: number;
  /** Ratio 0..1 of progress toward firing. */
  progress: number;
  alerts: SustainedAlert[];
};

/**
 * Watches a streaming score and fires when it stays above `threshold` for
 * at least `durationSec` consecutive seconds.
 */
export function useSustainedAnomaly(
  score: number,
  { threshold, durationSec, onTrigger }: Options
): SustainedState {
  const aboveSinceRef = useRef<number | null>(null);
  const firedRef = useRef(false);
  const peakRef = useRef(0);
  const onTriggerRef = useRef(onTrigger);
  onTriggerRef.current = onTrigger;

  const [state, setState] = useState<SustainedState>({
    active: false,
    elapsedSec: 0,
    progress: 0,
    alerts: [],
  });

  useEffect(() => {
    const tick = () => {
      const now = Date.now();
      const above = score > threshold;

      if (above) {
        if (aboveSinceRef.current == null) {
          aboveSinceRef.current = now;
          peakRef.current = score;
          firedRef.current = false;
        } else {
          peakRef.current = Math.max(peakRef.current, score);
        }
        const elapsedMs = now - aboveSinceRef.current;
        const elapsedSec = elapsedMs / 1000;
        const progress = Math.min(1, elapsedSec / Math.max(0.001, durationSec));
        const reached = elapsedSec >= durationSec;

        if (reached && !firedRef.current) {
          firedRef.current = true;
          const alert: SustainedAlert = {
            id: `if-${aboveSinceRef.current}`,
            startedAt: aboveSinceRef.current,
            endedAt: now,
            durationMs: elapsedMs,
            peakScore: +peakRef.current.toFixed(3),
          };
          onTriggerRef.current?.(alert);
          setState(prev => ({
            active: true,
            elapsedSec,
            progress: 1,
            alerts: [alert, ...prev.alerts].slice(0, 20),
          }));
        } else {
          setState(prev => ({
            ...prev,
            active: reached,
            elapsedSec,
            progress,
          }));
        }
      } else {
        if (aboveSinceRef.current != null) {
          aboveSinceRef.current = null;
          firedRef.current = false;
          peakRef.current = 0;
        }
        setState(prev =>
          prev.elapsedSec === 0 && !prev.active
            ? prev
            : { ...prev, active: false, elapsedSec: 0, progress: 0 }
        );
      }
    };

    tick();
    const id = setInterval(tick, 250);
    return () => clearInterval(id);
  }, [score, threshold, durationSec]);

  return state;
}
