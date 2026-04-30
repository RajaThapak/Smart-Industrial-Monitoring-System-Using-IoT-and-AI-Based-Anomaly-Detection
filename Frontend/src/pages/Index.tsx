import { useCallback, useMemo, useState } from "react";
import { Activity, Gauge, Thermometer, Waves } from "lucide-react";
import { ThemeProvider } from "@/components/dashboard/ThemeProvider";
import { Header } from "@/components/dashboard/Header";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { ChartCard } from "@/components/dashboard/ChartCard";
import { AnomalyPanel, type AnomalyAlert } from "@/components/dashboard/AnomalyPanel";
import { ControlPanel, type MachineStatus } from "@/components/dashboard/ControlPanel";
import { ThresholdPanel, type Thresholds } from "@/components/dashboard/ThresholdPanel";
import { IsolationForestCard } from "@/components/dashboard/IsolationForestCard";
import { AnomalyScoreChart } from "@/components/dashboard/AnomalyScoreChart";
import { SustainedAlertConfig } from "@/components/dashboard/SustainedAlertConfig";
import { useBackendTelemetry } from "@/hooks/useBackendTelemetry";
import { useSustainedAnomaly, type SustainedAlert } from "@/hooks/useSustainedAnomaly";
import { useAlarm } from "@/hooks/useAlarm";
import { toast } from "@/hooks/use-toast";
import type { IFPrediction } from "@/hooks/useIsolationForest";

function Dashboard() {
  const [status, setStatus] = useState<MachineStatus>("running");
  const [thresholds, setThresholds] = useState<Thresholds>({
    temperature: 90,
    pressure: 6,
    rpm: 2000,
    vibration: 3,
  });
  const [ifThreshold, setIfThreshold] = useState(0.6);
  const [sustainedSec, setSustainedSec] = useState(5);

  const data = useBackendTelemetry();
  const { trigger: triggerAlarm } = useAlarm();

  const last = {
    temperature: data.temperature.at(-1)?.v ?? 0,
    pressure: data.pressure.at(-1)?.v ?? 0,
    rpm: data.rpm.at(-1)?.v ?? 0,
    vibration: data.vibration.at(-1)?.v ?? 0,
  };

  const prediction: IFPrediction = useMemo(
    () => ({
      isAnomaly: (data.anomalyScores.at(-1)?.v ?? 0.5) > ifThreshold,
      score: data.anomalyScores.at(-1)?.v ?? 0.5,
      threshold: ifThreshold,
      trained: data.anomalyScores.length > 0,
      trainSize: data.anomalyScores.length,
      features: {
        temperature: last.temperature,
        pressure: last.pressure,
        rpm: last.rpm,
        vibration: last.vibration,
      },
      history: data.anomalyScores,
    }),
    [data.anomalyScores, ifThreshold, last.pressure, last.rpm, last.temperature, last.vibration]
  );

  const handleSustained = useCallback(
    (alert: SustainedAlert) => {
      triggerAlarm();
      toast({
        title: "Sustained ML anomaly",
        description: `Anomaly detected for ${(alert.durationMs / 1000).toFixed(1)}s · score ${alert.peakScore.toFixed(2)}`,
        variant: "destructive",
      });
    },
    [triggerAlarm]
  );

  const sustained = useSustainedAnomaly(prediction.score, {
    threshold: ifThreshold,
    durationSec: sustainedSec,
    onTrigger: handleSustained,
  });

  const sustainedAsAlerts: AnomalyAlert[] = useMemo(
    () =>
      sustained.alerts.map(a => ({
        id: a.id,
        level: "critical",
        metric: "Backend ML · Anomaly Detection",
        message: `Score above ${ifThreshold.toFixed(2)} for ${(a.durationMs / 1000).toFixed(1)}s`,
        value: `peak ${a.peakScore.toFixed(2)}`,
        ts: a.endedAt,
      })),
    [sustained.alerts, ifThreshold]
  );

  // Show loading state if no data yet
  if (data.temperature.length === 0) {
    return (
      <main className="mx-auto max-w-[1500px] px-4 py-4 sm:px-6 sm:py-6">
        <Header />
        <div className="mt-20 flex flex-col items-center justify-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          <p className="text-muted-foreground">Loading real-time data from backend...</p>
          <p className="text-sm text-muted-foreground">Connecting to http://127.0.0.1:8000/api/predictions/</p>
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-[1500px] px-4 py-4 sm:px-6 sm:py-6">
      <Header />

      <section className="mt-6">
        <div className="mb-4 flex items-end justify-between">
          <div>
            <h2 className="font-display text-2xl font-semibold sm:text-3xl">
              Plant Floor · <span className="text-gradient-primary">Line A-7</span>
            </h2>
            <p className="text-sm text-muted-foreground">Real-time telemetry · sampling every 1.5s</p>
          </div>
          <p className="hidden font-mono text-xs text-muted-foreground sm:block">
            {new Date().toLocaleString([], { dateStyle: "medium", timeStyle: "short" })}
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <MetricCard label="Temperature" unit="°C" value={last.temperature} data={data.temperature}
            icon={Thermometer} threshold={thresholds.temperature} accentVar="--primary" decimals={1} />
          <MetricCard label="Pressure" unit="bar" value={last.pressure} data={data.pressure}
            icon={Gauge} threshold={thresholds.pressure} accentVar="--accent" decimals={2} />
          <MetricCard label="RPM" unit="" value={last.rpm} data={data.rpm}
            icon={Activity} threshold={thresholds.rpm} accentVar="--primary-glow" decimals={0} />
          <MetricCard label="Vibration" unit=" mm/s" value={last.vibration} data={data.vibration}
            icon={Waves} threshold={thresholds.vibration} accentVar="--warning" decimals={2} />
        </div>
      </section>

      <section className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-2">
        <ChartCard title="Temperature Trend" subtitle="°C over time" data={data.temperature} unit="°C"
          threshold={thresholds.temperature} colorVar="--primary" variant="area" />
        <ChartCard title="Pressure Trend" subtitle="bar over time" data={data.pressure} unit="bar"
          threshold={thresholds.pressure} colorVar="--accent" variant="area" />
        <ChartCard title="RPM Trend" subtitle="rotations per minute" data={data.rpm} unit=""
          threshold={thresholds.rpm} colorVar="--primary-glow" variant="line" />
        <ChartCard title="Vibration · Anomaly Detection" subtitle="mm/s · spikes flagged" data={data.vibration} unit="mm/s"
          threshold={thresholds.vibration} colorVar="--warning" variant="line" />
      </section>

      <section className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-3">
        <IsolationForestCard prediction={prediction} />
        <AnomalyScoreChart
          history={prediction.history}
          threshold={prediction.threshold}
          current={prediction.score}
          isAnomaly={prediction.isAnomaly}
        />
        <SustainedAlertConfig
          durationSec={sustainedSec}
          onDurationChange={setSustainedSec}
          threshold={ifThreshold}
          onThresholdChange={setIfThreshold}
          elapsedSec={sustained.elapsedSec}
          progress={sustained.progress}
          active={sustained.active}
          currentScore={prediction.score}
        />
      </section>

      <section className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-3">
        <AnomalyPanel data={data} thresholds={thresholds} extraAlerts={sustainedAsAlerts} />
        <ControlPanel
          status={status}
          onStart={() => setStatus("running")}
          onStop={() => setStatus("stopped")}
          onEmergency={() => setStatus("error")}
        />
        <div className="lg:col-span-1">
          <ThresholdPanel thresholds={thresholds} onChange={setThresholds} />
        </div>
      </section>

      <footer className="mt-8 pb-4 text-center text-[11px] font-mono text-muted-foreground">
        SIMS · Smart Industrial Monitoring System · © {new Date().getFullYear()} · Secured Telemetry Channel
      </footer>
    </main>
  );
}

const Index = () => (
  <ThemeProvider>
    <Dashboard />
  </ThemeProvider>
);

export default Index;
