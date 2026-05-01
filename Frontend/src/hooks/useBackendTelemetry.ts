import { useEffect, useState } from "react";
import type { Telemetry, Point } from "./useTelemetry";
import { API_BASE } from "@/lib/api";

type BackendTelemetry = Telemetry & {
  anomalyScores: Point[];
  labels: Array<{ t: number; label: string }>;
};

export function useBackendTelemetry(): BackendTelemetry {
  const [data, setData] = useState<BackendTelemetry>({
    temperature: [],
    pressure: [],
    rpm: [],
    vibration: [],
    anomalyScores: [],
    labels: [],
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Force fresh fetch with cache-bust
        const timestamp = new Date().getTime();
        const url = `${API_BASE}/api/predictions/?t=${timestamp}`;
        console.log("🔄 Fetching predictions from backend...", url);
        const response = await fetch(url, {
          credentials: "include",
          cache: "no-store",
        });

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const records = await response.json();
        const dataArray = Array.isArray(records) ? records : records.value || [];

        if (dataArray.length === 0) {
          console.warn("⚠️ No records returned from backend");
          setData(prev => ({
            ...prev,
            temperature: [],
            pressure: [],
            rpm: [],
            vibration: [],
            anomalyScores: [],
            labels: [],
          }));
          return;
        }

        const telemetry: Telemetry = {
          temperature: dataArray.map((r: any) => ({ t: new Date(r.timestamp).getTime(), v: r.temperature })),
          pressure: dataArray.map((r: any) => ({ t: new Date(r.timestamp).getTime(), v: r.pressure })),
          rpm: dataArray.map((r: any) => ({ t: new Date(r.timestamp).getTime(), v: r.rpm })),
          vibration: dataArray.map((r: any) => ({ t: new Date(r.timestamp).getTime(), v: r.vibration })),
        };

        const anomalyScores = dataArray.map((r: any) => ({
          t: new Date(r.timestamp).getTime(),
          v: typeof r.anomaly_score === "number" ? r.anomaly_score : 0.5,
        }));

        const labels = dataArray.map((r: any) => ({
          t: new Date(r.timestamp).getTime(),
          label: r.label ?? "Normal",
        }));

        setData({ ...telemetry, anomalyScores, labels });
        console.log(`✅ Received ${dataArray.length} records from backend`);
      } catch (error) {
        console.error("❌ Failed to fetch telemetry:", error);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 2000); // Poll every 2 seconds instead of 5
    return () => clearInterval(interval);
  }, []);

  return data;
}
