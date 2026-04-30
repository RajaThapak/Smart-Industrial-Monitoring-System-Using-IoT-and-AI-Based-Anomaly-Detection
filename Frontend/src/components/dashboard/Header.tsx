import { Activity, LogOut, Moon, Sun, User, Volume2, VolumeX } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { useTheme } from "./ThemeProvider";
import { useAlarm } from "@/hooks/useAlarm";
import { useAuthSession } from "@/hooks/useAuthSession";
import { Button } from "@/components/ui/button";

export function Header() {
  const { toggle } = useTheme();
  const { muted, toggleMute } = useAlarm();
  const { user, logout } = useAuthSession();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <header className="glass-strong sticky top-4 z-30 mx-auto flex items-center justify-between gap-4 rounded-2xl px-4 py-3 sm:px-6">
      <div className="flex items-center gap-3">
        <div className="relative grid h-10 w-10 place-items-center rounded-xl bg-[image:var(--gradient-primary)] text-primary-foreground shadow-[var(--shadow-glow)]">
          <Activity className="h-5 w-5" strokeWidth={2.5} />
          <span className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 animate-pulse rounded-full bg-success ring-2 ring-background" />
        </div>
        <div className="leading-tight">
          <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-muted-foreground">SIMS · v2.4</p>
          <h1 className="font-display text-base font-semibold sm:text-lg">
            Smart Industrial <span className="text-gradient-primary">Monitoring</span> System
          </h1>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <div className="hidden items-center gap-2 rounded-full border border-border/60 bg-background/40 px-3 py-1.5 text-xs font-mono text-muted-foreground md:flex">
          <span className="status-dot inline-block h-2 w-2 rounded-full text-success bg-success" />
          <span>LIVE</span>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleMute}
          aria-label={muted ? "Unmute alarm" : "Mute alarm"}
          title={muted ? "Alarm muted" : "Alarm armed"}
          className="relative rounded-full border border-border/60 bg-background/40 backdrop-blur transition-all hover:scale-105 hover:bg-background/70"
        >
          {muted ? (
            <VolumeX className="h-4 w-4 text-muted-foreground" />
          ) : (
            <Volume2 className="h-4 w-4 text-success" />
          )}
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={toggle}
          aria-label="Toggle theme"
          className="rounded-full border border-border/60 bg-background/40 backdrop-blur transition-all hover:scale-105 hover:bg-background/70"
        >
          <Sun className="h-4 w-4 rotate-0 scale-100 transition-all duration-500 dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all duration-500 dark:rotate-0 dark:scale-100" />
        </Button>
        <div className="hidden items-center gap-2 rounded-full border border-border/60 bg-background/40 px-3 py-1.5 text-xs font-mono text-muted-foreground lg:flex">
          <User className="h-3.5 w-3.5" />
          <span>{user?.username ?? "Operator"}</span>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={handleLogout}
          aria-label="Logout"
          title="Logout"
          className="rounded-full border border-border/60 bg-background/40 backdrop-blur hover:bg-background/70"
        >
          <LogOut className="h-4 w-4" />
        </Button>
      </div>
    </header>
  );
}
