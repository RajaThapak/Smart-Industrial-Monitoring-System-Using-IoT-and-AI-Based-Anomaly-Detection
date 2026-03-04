import { SidebarTrigger } from "@/components/ui/sidebar";
import { Wifi, Sun, Moon } from "lucide-react";
import { useTheme } from "@/hooks/use-theme";
import { Button } from "@/components/ui/button";

export function DashboardHeader() {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="h-14 flex items-center justify-between border-b border-border bg-card/50 backdrop-blur-sm px-4">
      <div className="flex items-center gap-3">
        <SidebarTrigger className="text-muted-foreground hover:text-foreground" />
        <h1 className="text-sm md:text-base font-semibold text-foreground">
          AI + IoT Machine Health Monitor
        </h1>
      </div>

      <div className="hidden md:flex items-center gap-2 text-sm text-muted-foreground font-mono">
        {new Date().toLocaleString("en-US", {
          weekday: "short",
          month: "short",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        })}
      </div>

      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleTheme}
          className="h-8 w-8 text-muted-foreground hover:text-foreground"
          aria-label="Toggle theme"
        >
          {theme === "light" ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
        </Button>
        <span className="status-dot bg-primary" />
        <span className="text-xs text-muted-foreground hidden sm:inline">Connected</span>
        <Wifi className="h-4 w-4 text-primary" />
      </div>
    </header>
  );
}
