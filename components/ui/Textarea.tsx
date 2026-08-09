"use client";

import { forwardRef, useId } from "react";
import { cn } from "@/lib/utils";

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  hint?: string;
  wrapperClassName?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  function Textarea(
    { label, error, hint, id, className, wrapperClassName, disabled, ...props },
    ref
  ) {
    const generatedId = useId();
    const textareaId = id ?? generatedId;
    const errorId = `${textareaId}-error`;
    const hintId = `${textareaId}-hint`;

    return (
      <div className={cn("flex flex-col gap-1.5", wrapperClassName)}>
        {label && (
          <label
            htmlFor={textareaId}
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

        <textarea
          ref={ref}
          id={textareaId}
          disabled={disabled}
          aria-invalid={!!error}
          aria-describedby={error ? errorId : hint ? hintId : undefined}
          rows={props.rows ?? 4}
          className={cn(
            "w-full rounded-[var(--radius-md)] border bg-[var(--color-bg-card)]",
            "px-3 py-2.5 text-sm text-[var(--color-text)]",
            "placeholder:text-[var(--color-text-subtle)]",
            "resize-y min-h-[80px]",
            "transition-colors duration-150",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1",
            "disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-[var(--color-bg-muted)] disabled:resize-none",
            error
              ? "border-[var(--color-error)] focus-visible:ring-[var(--color-error)]"
              : "border-[var(--color-border)] hover:border-[var(--color-border-strong)] focus-visible:ring-[var(--color-accent)] focus-visible:border-[var(--color-primary)]",
            className
          )}
          {...props}
        />

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
  }
);
