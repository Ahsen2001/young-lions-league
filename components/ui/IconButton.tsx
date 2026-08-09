"use client";

import { forwardRef } from "react";
import { cn } from "@/lib/utils";
import { Spinner } from "./Spinner";
import type { ButtonVariant, ButtonSize } from "./Button";

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
    "bg-[var(--color-accent)] text-[var(--color-primary)] hover:bg-[var(--color-accent-dark)] focus-visible:ring-[var(--color-accent)]",
  destructive:
    "bg-[var(--color-error)] text-white hover:bg-red-700 focus-visible:ring-[var(--color-error)]",
};

const sizeCls: Record<ButtonSize, string> = {
  sm: "w-8 h-8 rounded-[var(--radius-sm)]",
  md: "w-10 h-10 rounded-[var(--radius-md)]",
  lg: "w-12 h-12 rounded-[var(--radius-md)]",
};

const iconSizeCls: Record<ButtonSize, string> = {
  sm: "w-3.5 h-3.5",
  md: "w-4.5 h-4.5",
  lg: "w-5 h-5",
};

export interface IconButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  /** Required for accessibility */
  "aria-label": string;
  children: React.ReactNode;
}

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  function IconButton(
    {
      variant = "ghost",
      size = "md",
      loading = false,
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
          "inline-flex items-center justify-center shrink-0",
          "transition-all duration-150",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
          "disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none",
          "active:scale-[0.93]",
          variantCls[variant],
          sizeCls[size],
          className
        )}
        {...props}
      >
        {loading ? (
          <Spinner size="sm" />
        ) : (
          <span className={cn("flex items-center justify-center", iconSizeCls[size])}>
            {children}
          </span>
        )}
      </button>
    );
  }
);
