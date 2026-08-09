"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { toast } from "@/components/ui/Toast";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirectTo") || "/admin";
  const reason = searchParams.get("reason");
  const errorParam = searchParams.get("error");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (reason === "expired") {
      setErrorMessage("Your session has expired. Please sign in again.");
    } else if (errorParam === "unauthorized") {
      setErrorMessage("You do not have authorization to access admin operations.");
    }
  }, [reason, errorParam]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!email.trim() || !password.trim()) {
      setErrorMessage("Please enter both email and password.");
      return;
    }

    setLoading(true);

    try {
      const supabase = createClient();
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: password,
      });

      if (error) {
        if (error.message.includes("Invalid login credentials")) {
          setErrorMessage("Invalid email or password. Please check your credentials.");
        } else {
          setErrorMessage(error.message);
        }
        setLoading(false);
        return;
      }

      if (data.session) {
        toast.success("Welcome Back", "Authentication successful.");
        router.push(redirectTo);
        router.refresh();
      }
    } catch (err: unknown) {
      console.error("[Login Error]", err);
      setErrorMessage("Network error connecting to authentication server. Please try again.");
      setLoading(false);
    }
  };

  return (
    <Card padding="lg" className="border-t-4 border-t-[var(--color-accent)] shadow-[var(--shadow-lg)]">
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <h2 className="font-display text-2xl font-bold text-[var(--color-primary)]">
            Admin Sign In
          </h2>
          <p className="text-xs text-[var(--color-text-muted)] mt-1">
            Access official tournament management & scheduling
          </p>
        </div>

        {errorMessage && (
          <div
            role="alert"
            className="p-3.5 rounded-[var(--radius-sm)] bg-[var(--color-error-bg)] border border-[var(--color-error)]/30 text-xs text-[var(--color-error)] font-medium flex items-start gap-2.5"
          >
            <svg className="w-4 h-4 shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <span>{errorMessage}</span>
          </div>
        )}

        <div className="space-y-4">
          <Input
            label="Email Address"
            type="email"
            placeholder="admin@younglions.lk"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading}
            required
            leadingIcon={
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
              </svg>
            }
          />

          <Input
            label="Password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={loading}
            required
            leadingIcon={
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            }
          />
        </div>

        <Button type="submit" fullWidth loading={loading} variant="primary" size="lg">
          {loading ? "Authenticating…" : "Sign In to Admin"}
        </Button>
      </form>
    </Card>
  );
}

export default function AdminLoginPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[var(--color-bg)] p-4 sm:p-6">
      <div className="w-full max-w-md space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[var(--color-primary)] border-4 border-[var(--color-accent)] shadow-[var(--shadow-md)] mb-2">
            <span className="font-display font-bold text-white text-2xl">YL</span>
          </div>
          <h1 className="font-display text-3xl font-bold text-[var(--color-primary)] tracking-wide">
            YOUNG LIONS SC
          </h1>
          <div className="flex items-center justify-center gap-2">
            <Badge variant="primary" size="sm">Oddamavadi League</Badge>
            <Badge variant="accent" size="sm">Admin Portal</Badge>
          </div>
        </div>

        <Suspense fallback={<div className="h-64 bg-[var(--color-bg-card)] rounded-[var(--radius-lg)] animate-pulse" />}>
          <LoginForm />
        </Suspense>

        <div className="text-center">
          <a
            href="/"
            className="text-xs text-[var(--color-text-muted)] hover:text-[var(--color-primary)] font-display uppercase tracking-widest transition-colors"
          >
            ← Return to Public League Website
          </a>
        </div>
      </div>
    </div>
  );
}
