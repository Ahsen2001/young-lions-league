"use client";

import { forwardRef } from "react";
import { cn } from "@/lib/utils";
import { Spinner } from "./Spinner";

/* ── Types ───────────────────────────────────────────────────────────── */
export type ButtonVariant =
  | "primary"
  | "secondary"
  | "outline"
  | "ghost"
  | "accent"
  | "destructive";

export type ButtonSize = "sm" | "md" | "lg";

/* ── Style maps ──────────────────────────────────────────────────────── */
const variantCls: Record<ButtonVariant, string> = {
  primary:
    "bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-dark)] focus-visible:ring-[var(--color-primary)]",
  secondary:
    "bg-[var(--color-secondary)] text-white hover:bg-[var(--color-secondary-dark)] focus-visible:ring-[var(--color-secondary)]",
  outline:
    "border-2 border-[var(--color-primary)] text-[var(--color-primary)] bg-transparent hover:bg-[var(--color-primary)]/10 focus-visible:ring-[var(--color-primary)]",
  ghost:
    "text-[var(--color-primary)] bg-transparent hover:bg-[var(--color-primary)]/10 focus-visible:ring-[var(--color-primary)]",
  accent:
    "bg-[var(--color-accent)] text-[var(--color-primary)] font-bold hover:bg-[var(--color-accent-dark)] focus-visible:ring-[var(--color-accent)]",
  destructive:
    "bg-[var(--color-error)] text-white hover:bg-red-700 focus-visible:ring-[var(--color-error)]",
};

const sizeCls: Record<ButtonSize, string> = {
  sm: "h-8 px-3 text-xs gap-1.5 rounded-[var(--radius-sm)]",
  md: "h-10 px-5 text-sm gap-2 rounded-[var(--radius-md)]",
  lg: "h-12 px-7 text-base gap-2.5 rounded-[var(--radius-md)]",
};

/* ── Component ───────────────────────────────────────────────────────── */
export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  fullWidth?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  function Button(
    {
      variant = "primary",
      size = "md",
      loading = false,
      fullWidth = false,
      disabled,
      className,
      children,
      ...props
    },
    ref
  ) {
    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        aria-busy={loading || undefined}
        className={cn(
          // base
          "inline-flex items-center justify-center",
          "font-display tracking-widest uppercase font-semibold whitespace-nowrap select-none",
          "transition-all duration-150",
          // focus
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
          // disabled
          "disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none",
          // press
          "active:scale-[0.97]",
          variantCls[variant],
          sizeCls[size],
          fullWidth && "w-full",
          className
        )}
        {...props}
      >
        {loading && <Spinner size="sm" />}
        {children}
      </button>
    );
  }
);
