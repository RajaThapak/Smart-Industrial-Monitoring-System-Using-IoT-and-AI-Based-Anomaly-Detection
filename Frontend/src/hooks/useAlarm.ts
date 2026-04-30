import { useCallback, useEffect, useRef, useState } from "react";

type AlarmState = {
  muted: boolean;
  toggleMute: () => void;
  trigger: () => void;
};

// Lightweight singleton so mute state + audio context are shared app-wide.
let ctx: AudioContext | null = null;
let lastTrigger = 0;
const listeners = new Set<(m: boolean) => void>();
let muted = false;

function getCtx() {
  if (typeof window === "undefined") return null;
  if (!ctx) {
    const AC = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AC) return null;
    ctx = new AC();
  }
  if (ctx.state === "suspended") ctx.resume().catch(() => {});
  return ctx;
}

function playAlarm() {
  const ac = getCtx();
  if (!ac) return;
  const now = ac.currentTime;

  // Two-tone klaxon: alternates between two frequencies, sawtooth for industrial bite.
  const master = ac.createGain();
  master.gain.setValueAtTime(0, now);
  master.gain.linearRampToValueAtTime(0.18, now + 0.02);
  master.gain.linearRampToValueAtTime(0, now + 1.4);
  master.connect(ac.destination);

  const osc = ac.createOscillator();
  osc.type = "sawtooth";
  const f = osc.frequency;
  f.setValueAtTime(880, now);
  f.setValueAtTime(620, now + 0.18);
  f.setValueAtTime(880, now + 0.36);
  f.setValueAtTime(620, now + 0.54);
  f.setValueAtTime(880, now + 0.72);
  f.setValueAtTime(620, now + 0.9);
  osc.connect(master);
  osc.start(now);
  osc.stop(now + 1.4);
}

export function useAlarm(): AlarmState {
  const [m, setM] = useState(muted);

  useEffect(() => {
    const fn = (v: boolean) => setM(v);
    listeners.add(fn);
    return () => { listeners.delete(fn); };
  }, []);

  const toggleMute = useCallback(() => {
    muted = !muted;
    listeners.forEach(l => l(muted));
    if (!muted) getCtx(); // unlock audio on user gesture
  }, []);

  const trigger = useCallback(() => {
    if (muted) return;
    const now = Date.now();
    if (now - lastTrigger < 4000) return; // throttle
    lastTrigger = now;
    playAlarm();
  }, []);

  return { muted: m, toggleMute, trigger };
}
