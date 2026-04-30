import { ThemeProvider } from "@/components/dashboard/ThemeProvider";
import { AuthScreenEnhanced } from "@/components/auth/AuthScreenEnhanced";

export default function RegisterEnhanced() {
  return (
    <ThemeProvider>
      <AuthScreenEnhanced mode="register" />
    </ThemeProvider>
  );
}
