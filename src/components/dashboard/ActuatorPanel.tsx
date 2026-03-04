import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Fan, ShieldOff, RotateCcw, OctagonX } from "lucide-react";

export function ActuatorPanel() {
  const [fanOn, setFanOn] = useState(true);
  const [brakeActive, setBrakeActive] = useState(false);

  return (
    <div className="panel space-y-5">
      <h3 className="text-sm font-semibold text-foreground">Actuator Controls</h3>

      <div className="space-y-4">
        {/* Cooling Fan */}
        <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
          <div className="flex items-center gap-3">
            <Fan className={`h-5 w-5 ${fanOn ? "text-primary animate-spin" : "text-muted-foreground"}`} style={fanOn ? { animationDuration: "2s" } : {}} />
            <div>
              <p className="text-sm font-medium text-foreground">Cooling Fan</p>
              <p className="text-xs text-muted-foreground">{fanOn ? "Running" : "Stopped"}</p>
            </div>
          </div>
          <Switch checked={fanOn} onCheckedChange={setFanOn} />
        </div>

        {/* Brake System */}
        <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
          <div className="flex items-center gap-3">
            <ShieldOff className={`h-5 w-5 ${brakeActive ? "text-warning" : "text-muted-foreground"}`} />
            <div>
              <p className="text-sm font-medium text-foreground">Brake System</p>
              <p className="text-xs text-muted-foreground">{brakeActive ? "Engaged" : "Released"}</p>
            </div>
          </div>
          <Button
            size="sm"
            variant={brakeActive ? "destructive" : "secondary"}
            onClick={() => setBrakeActive(!brakeActive)}
          >
            {brakeActive ? "Release" : "Activate"}
          </Button>
        </div>

        {/* Reset Machine */}
        <Button variant="outline" className="w-full justify-start gap-3">
          <RotateCcw className="h-4 w-4" />
          Reset Machine
        </Button>

        {/* Emergency Stop */}
        <Button className="emergency-btn w-full h-12 text-destructive-foreground rounded-lg">
          <OctagonX className="h-5 w-5 mr-2" />
          Emergency Stop
        </Button>
      </div>
    </div>
  );
}
