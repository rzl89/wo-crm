import { Sparkles } from "lucide-react";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[var(--color-bg)] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="flex flex-col items-center text-center mb-8">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[var(--color-gold-400)] to-[var(--color-gold-700)] flex items-center justify-center shadow-lg mb-4">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <h1 className="font-display text-2xl font-bold text-[var(--color-primary-950)]">
            Wina CRM
          </h1>
          <p className="text-sm text-[var(--color-muted)] mt-1">
            Wedding & Catering System
          </p>
        </div>
        {children}
      </div>
    </div>
  );
}
