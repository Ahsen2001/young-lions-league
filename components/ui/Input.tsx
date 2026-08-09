"use client";

import { forwardRef, useId } from "react";
import { cn } from "@/lib/utils";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  leadingIcon?: React.ReactNode;
  trailingIcon?: React.ReactNode;
  /** Wrap in a div with label/error layout */
  wrapperClassName?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  {
    label,
    error,
    hint,
    leadingIcon,
    trailingIcon,
    id,
    className,
    wrapperClassName,
    disabled,
    ...props
  },
  ref
) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const errorId = `${inputId}-error`;
  const hintId = `${inputId}-hint`;

  return (
    <div className={cn("flex flex-col gap-1.5", wrapperClassName)}>
      {label && (
        <label
          htmlFor={inputId}
          className="font-display text-sm tracking-wide text-[var(--color-text)] select-none"
        >
          {label}
          {props.required && (
            <span className="text-[var(--color-error)] ml-0.5" aria-hidden="true">
              *
            </span>
          )}
        </label>
      )}

      <div className="relative flex items-center">
        {leadingIcon && (
          <span className="absolute left-3 flex items-center text-[var(--color-text-subtle)] pointer-events-none">
            {leadingIcon}
          </span>
        )}
        <input
          ref={ref}
          id={inputId}
          disabled={disabled}
          aria-invalid={!!error}
          aria-describedby={
            error ? errorId : hint ? hintId : undefined
          }
          className={cn(
            "w-full h-10 rounded-[var(--radius-md)] border bg-[var(--color-bg-card)]",
            "px-3 py-2 text-sm text-[var(--color-text)]",
            "placeholder:text-[var(--color-text-subtle)]",
            "transition-colors duration-150",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1",
            "disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-[var(--color-bg-muted)]",
            error
              ? "border-[var(--color-error)] focus-visible:ring-[var(--color-error)] focus-visible:border-[var(--color-error)]"
              : "border-[var(--color-border)] hover:border-[var(--color-border-strong)] focus-visible:ring-[var(--color-accent)] focus-visible:border-[var(--color-primary)]",
            leadingIcon && "pl-9",
            trailingIcon && "pr-9",
            className
          )}
          {...props}
        />
        {trailingIcon && (
          <span className="absolute right-3 flex items-center text-[var(--color-text-subtle)] pointer-events-none">
            {trailingIcon}
          </span>
        )}
      </div>

      {error && (
        <p id={errorId} role="alert" className="text-xs text-[var(--color-error)] flex items-center gap-1">
          <svg className="w-3.5 h-3.5 shrink-0" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          {error}
        </p>
      )}
      {hint && !error && (
        <p id={hintId} className="text-xs text-[var(--color-text-subtle)]">
          {hint}
        </p>
      )}
    </div>
  );
});
