import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Login",
  description: "Sign in to the Young Lions League admin panel.",
};

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--color-bg)] px-4">
      <div className="w-full max-w-md">
        {/* Logo / Brand */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[var(--color-primary)] mb-4">
            <span className="font-display text-2xl font-bold text-white">YL</span>
          </div>
          <h1 className="font-display text-3xl font-bold text-[var(--color-primary)] tracking-wide">
            Young Lions League
          </h1>
          <p className="text-sm text-[var(--color-text-muted)] mt-1">
            Admin Panel — Oddamavadi
          </p>
        </div>

        {/* Login form shell — auth implementation in auth sprint */}
        <div
          className="bg-[var(--color-bg-card)] rounded-[var(--radius-lg)] border border-[var(--color-border)] p-8"
          style={{ boxShadow: "var(--shadow-md)" }}
        >
          <p className="text-center text-[var(--color-text-muted)] text-sm">
            Authentication will be implemented in the auth sprint.
          </p>
        </div>
      </div>
    </div>
  );
}
