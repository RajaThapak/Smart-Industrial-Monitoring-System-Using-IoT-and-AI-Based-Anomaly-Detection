import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

const settingsGroups = [
  {
    title: "Notifications",
    items: [
      { label: "Email Alerts", desc: "Send alerts via email", defaultOn: true },
      { label: "Sound Alerts", desc: "Play sound on critical alerts", defaultOn: true },
      { label: "Push Notifications", desc: "Browser push notifications", defaultOn: false },
    ],
  },
  {
    title: "Monitoring",
    items: [
      { label: "Auto-refresh Data", desc: "Refresh sensor data every 5s", defaultOn: true },
      { label: "Predictive Alerts", desc: "AI-based early warnings", defaultOn: true },
      { label: "Log Raw Sensor Data", desc: "Store raw values for analysis", defaultOn: false },
    ],
  },
];

const SettingsPage = () => {
  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div>
        <h2 className="text-lg font-semibold text-foreground mb-1">Settings</h2>
        <p className="text-sm text-muted-foreground">Configure monitoring preferences</p>
      </div>

      {settingsGroups.map((group) => (
        <div key={group.title} className="panel space-y-4">
          <h3 className="text-sm font-semibold text-foreground">{group.title}</h3>
          <Separator />
          {group.items.map((item) => (
            <div key={item.label} className="flex items-center justify-between py-1">
              <div>
                <Label className="text-sm text-foreground">{item.label}</Label>
                <p className="text-xs text-muted-foreground">{item.desc}</p>
              </div>
              <Switch defaultChecked={item.defaultOn} />
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default SettingsPage;
