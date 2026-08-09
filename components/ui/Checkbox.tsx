"use client";

import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import { useId } from "react";
import { cn } from "@/lib/utils";

export interface CheckboxProps {
  label?: string;
  description?: string;
  error?: string;
  id?: string;
  checked?: boolean | "indeterminate";
  onCheckedChange?: (checked: boolean | "indeterminate") => void;
  disabled?: boolean;
  required?: boolean;
  className?: string;
  name?: string;
  value?: string;
}

const CheckIcon = () => (
  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3} aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
  </svg>
);

const MinusIcon = () => (
  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3} aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" d="M20 12H4" />
  </svg>
);

export function Checkbox({
  label,
  description,
  error,
  id,
  checked,
  onCheckedChange,
  disabled,
  required,
  className,
  name,
  value,
}: CheckboxProps) {
  const generatedId = useId();
  const checkboxId = id ?? generatedId;
  const errorId = `${checkboxId}-error`;
  const descId = `${checkboxId}-desc`;

  return (
    <div className={cn("flex flex-col gap-1", className)}>
      <div className="flex items-start gap-3">
        <CheckboxPrimitive.Root
          id={checkboxId}
          checked={checked}
          onCheckedChange={onCheckedChange}
          disabled={disabled}
          required={required}
          name={name}
          value={value}
          aria-invalid={!!error}
          aria-describedby={
            error ? errorId : description ? descId : undefined
          }
          className={cn(
            "flex w-5 h-5 shrink-0 items-center justify-center rounded-[var(--radius-sm)] border-2 mt-0.5",
            "transition-colors duration-150",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[var(--color-accent)]",
            "disabled:opacity-50 disabled:cursor-not-allowed",
            error
              ? "border-[var(--color-error)] data-[state=checked]:bg-[var(--color-error)] data-[state=checked]:border-[var(--color-error)]"
              : "border-[var(--color-border-strong)] data-[state=checked]:bg-[var(--color-primary)] data-[state=checked]:border-[var(--color-primary)] data-[state=indeterminate]:bg-[var(--color-primary)] data-[state=indeterminate]:border-[var(--color-primary)]"
          )}
        >
          <CheckboxPrimitive.Indicator className="text-white">
            {checked === "indeterminate" ? <MinusIcon /> : <CheckIcon />}
          </CheckboxPrimitive.Indicator>
        </CheckboxPrimitive.Root>

        {(label || description) && (
          <div className="flex flex-col gap-0.5">
            {label && (
              <label
                htmlFor={checkboxId}
                className={cn(
                  "text-sm text-[var(--color-text)] select-none cursor-pointer",
                  disabled && "opacity-50 cursor-not-allowed"
                )}
              >
                {label}
                {required && (
                  <span className="text-[var(--color-error)] ml-0.5" aria-hidden="true">*</span>
                )}
              </label>
            )}
            {description && (
              <p id={descId} className="text-xs text-[var(--color-text-subtle)]">
                {description}
              </p>
            )}
          </div>
        )}
      </div>

      {error && (
        <p id={errorId} role="alert" className="text-xs text-[var(--color-error)] flex items-center gap-1 ml-8">
          <svg className="w-3.5 h-3.5 shrink-0" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
          {error}
        </p>
      )}
    </div>
  );
}
