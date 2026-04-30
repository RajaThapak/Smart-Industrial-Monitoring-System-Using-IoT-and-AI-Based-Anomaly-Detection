import { useState } from "react";
import { Activity, ArrowRight, Moon, ShieldCheck, Sparkles, Sun, UserRound } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

import { useTheme } from "@/components/dashboard/ThemeProvider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { API_BASE, readApiResponse } from "@/lib/api";

type AuthMode = "login" | "register";

type AuthScreenProps = {
  mode: AuthMode;
};

export function AuthScreen({ mode }: AuthScreenProps) {
  const { theme, toggle } = useTheme();
  const navigate = useNavigate();
  const isLogin = mode === "login";

  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const updateField = (key: keyof typeof form) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setForm(prev => ({ ...prev, [key]: event.target.value }));
  };

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);

    try {
      const payload = isLogin
        ? {
            identifier: form.username || form.email,
            password: form.password,
          }
        : {
            username: form.username,
            email: form.email,
            password: form.password,
            confirmPassword: form.confirmPassword,
          };

      const response = await fetch(`${API_BASE}/api/auth/${isLogin ? "login" : "register"}/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(payload),
      });

      const { data: result, rawText } = await readApiResponse<{ message?: string; user?: { id?: number; username?: string; email?: string } }>(response);

      if (!response.ok) {
        throw new Error(result?.message || rawText || "Request failed");
      }

      localStorage.setItem("sims-user", JSON.stringify(result.user ?? {}));

      toast({
        title: isLogin ? "Welcome back" : "Account created",
        description: result.message || (isLogin ? "Login successful" : "Registration successful"),
      });

      navigate("/");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Something went wrong";
      toast({
        title: isLogin ? "Login failed" : "Registration failed",
        description: message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const ctaLabel = isLogin ? "Sign in" : "Create account";
  const switchLabel = isLogin ? "Create a new account" : "Sign in to your account";
  const switchPath = isLogin ? "/register" : "/login";

  return (
    <main className="relative min-h-screen overflow-hidden px-4 py-6 sm:px-6 lg:px-8">
      <div className="pointer-events-none absolute inset-0 opacity-80">
        <div className="absolute left-[-10%] top-[-10%] h-72 w-72 rounded-full bg-primary/20 blur-3xl" />
        <div className="absolute right-[-10%] bottom-[-10%] h-80 w-80 rounded-full bg-accent/20 blur-3xl" />
      </div>

      <div className="relative mx-auto grid min-h-[calc(100vh-3rem)] max-w-7xl items-center gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        <section className="glass-strong relative overflow-hidden rounded-[2rem] p-6 sm:p-8 lg:p-10">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,hsla(var(--primary)/0.12),transparent_45%),radial-gradient(circle_at_bottom_right,hsla(var(--accent)/0.12),transparent_40%)]" />

          <div className="relative flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="grid h-12 w-12 place-items-center rounded-2xl bg-[image:var(--gradient-primary)] text-primary-foreground shadow-[var(--shadow-glow)]">
                <Activity className="h-6 w-6" />
              </div>
              <div>
                <p className="text-[10px] font-mono uppercase tracking-[0.28em] text-muted-foreground">SIMS · Secure Access</p>
                <h1 className="font-display text-2xl font-semibold sm:text-3xl">Industrial Monitoring Portal</h1>
              </div>
            </div>

            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={toggle}
              className="rounded-full border border-border/60 bg-background/50 backdrop-blur hover:bg-background/80"
              aria-label="Toggle theme"
            >
              <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            </Button>
          </div>

          <div className="relative mt-10 space-y-6">
            <span className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-background/50 px-3 py-1.5 text-xs font-mono uppercase tracking-[0.2em] text-muted-foreground">
              <Sparkles className="h-3.5 w-3.5 text-primary" />
              Real-time telemetry dashboard
            </span>

            <div className="max-w-xl space-y-4">
              <h2 className="font-display text-4xl font-semibold leading-tight sm:text-5xl">
                Secure access for the <span className="text-gradient-primary">SIMS</span> control room.
              </h2>
              <p className="max-w-lg text-sm leading-6 text-muted-foreground sm:text-base">
                Sign in or register to monitor temperature, pressure, RPM, vibration, and ML anomaly detection in a
                single industrial dashboard.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <Feature
                title="Live telemetry"
                description="Continuous sensor updates from the backend."
                icon={<Activity className="h-4 w-4" />}
              />
              <Feature
                title="ML alerts"
                description="Isolation Forest based anomaly scoring."
                icon={<ShieldCheck className="h-4 w-4" />}
              />
              <Feature
                title="Industrial theme"
                description="Glass cards, gradients, and dark/light mode."
                icon={<UserRound className="h-4 w-4" />}
              />
            </div>
          </div>
        </section>

        <section className="glass rounded-[2rem] p-6 shadow-[var(--shadow-card)] sm:p-8 lg:p-10">
          <div className="mb-8">
            <p className="text-[10px] font-mono uppercase tracking-[0.28em] text-muted-foreground">
              {isLogin ? "Operator Login" : "Operator Registration"}
            </p>
            <h2 className="mt-2 font-display text-3xl font-semibold">
              {isLogin ? "Welcome back" : "Create your account"}
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              {isLogin
                ? "Use your username or email to access the dashboard."
                : "Register once, then use the same account for future dashboard access."}
            </p>
          </div>

          <form className="space-y-5" onSubmit={submit}>
            {!isLogin && (
              <Field label="Username" htmlFor="username">
                <Input
                  id="username"
                  value={form.username}
                  onChange={updateField("username")}
                  placeholder="yourname"
                  autoComplete="username"
                  required
                />
              </Field>
            )}

            {!isLogin && (
              <Field label="Email" htmlFor="email">
                <Input
                  id="email"
                  type="email"
                  value={form.email}
                  onChange={updateField("email")}
                  placeholder="name@company.com"
                  autoComplete="email"
                  required
                />
              </Field>
            )}

            {isLogin && (
              <Field label="Username or Email" htmlFor="identifier">
                <Input
                  id="identifier"
                  value={form.username || form.email}
                  onChange={event => setForm(prev => ({ ...prev, username: event.target.value, email: event.target.value }))}
                  placeholder="username or email"
                  autoComplete="username"
                  required
                />
              </Field>
            )}

            <Field label="Password" htmlFor="password">
              <Input
                id="password"
                type="password"
                value={form.password}
                onChange={updateField("password")}
                placeholder="••••••••"
                autoComplete={isLogin ? "current-password" : "new-password"}
                required
              />
            </Field>

            {!isLogin && (
              <Field label="Confirm password" htmlFor="confirmPassword">
                <Input
                  id="confirmPassword"
                  type="password"
                  value={form.confirmPassword}
                  onChange={updateField("confirmPassword")}
                  placeholder="••••••••"
                  autoComplete="new-password"
                  required
                />
              </Field>
            )}

            <Button
              type="submit"
              disabled={loading}
              className="h-12 w-full rounded-xl bg-[image:var(--gradient-primary)] font-display text-base text-primary-foreground shadow-[var(--shadow-glow)] transition hover:scale-[1.01]"
            >
              {loading ? "Please wait..." : ctaLabel}
              {!loading && <ArrowRight className="h-4 w-4" />}
            </Button>
          </form>

          <div className="mt-6 border-t border-border/60 pt-5 text-sm text-muted-foreground">
            {isLogin ? "Need an account?" : "Already have an account?"}{" "}
            <Link to={switchPath} className="font-medium text-primary underline-offset-4 hover:underline">
              {switchLabel}
            </Link>
          </div>

          <p className="mt-3 text-[11px] font-mono text-muted-foreground">
            Backend endpoint: {API_BASE}/api/auth/{isLogin ? "login" : "register"}/
          </p>
        </section>
      </div>
    </main>
  );
}

function Field({ label, htmlFor, children }: { label: string; htmlFor: string; children: React.ReactNode }) {
  return (
    <div className="space-y-2">
      <Label htmlFor={htmlFor} className="text-sm text-foreground">
        {label}
      </Label>
      {children}
    </div>
  );
}

function Feature({ title, description, icon }: { title: string; description: string; icon: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-border/60 bg-background/50 p-4 backdrop-blur-sm">
      <div className="mb-3 inline-flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
        {icon}
      </div>
      <h3 className="font-display text-sm font-semibold">{title}</h3>
      <p className="mt-1 text-xs leading-5 text-muted-foreground">{description}</p>
    </div>
  );
}