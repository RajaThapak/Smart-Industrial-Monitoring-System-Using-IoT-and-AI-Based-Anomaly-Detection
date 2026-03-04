import { KPICards } from "@/components/dashboard/KPICards";
import { ChartsSection } from "@/components/dashboard/ChartsSection";
import { AnomalyPanel } from "@/components/dashboard/AnomalyPanel";
import { ActuatorPanel } from "@/components/dashboard/ActuatorPanel";
import { AlertsTable } from "@/components/dashboard/AlertsTable";

const Index = () => {
  return (
    <div className="space-y-6 max-w-[1600px] mx-auto">
      <KPICards />
      <ChartsSection />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <AnomalyPanel />
        <ActuatorPanel />
      </div>
      <AlertsTable />
    </div>
  );
};

export default Index;
