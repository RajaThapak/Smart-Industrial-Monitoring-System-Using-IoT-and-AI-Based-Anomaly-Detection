import { Navigate, Outlet, useLocation } from "react-router-dom";

import { ThemeProvider } from "@/components/dashboard/ThemeProvider";
import { useAuthSession } from "@/hooks/useAuthSession";

export default function RequireAuth() {
  const location = useLocation();
  const { authenticated, loading } = useAuthSession();

  if (loading) {
    return (
      <ThemeProvider>
        <main className="flex min-h-screen items-center justify-center px-4 py-10">
          <div className="glass-strong rounded-2xl px-6 py-5 text-center">
            <div className="mx-auto h-10 w-10 animate-spin rounded-full border-2 border-primary border-t-transparent" />
            <p className="mt-4 font-display text-sm font-medium">Checking access...</p>
          </div>
        </main>
      </ThemeProvider>
    );
  }

  if (!authenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return <Outlet />;
}
