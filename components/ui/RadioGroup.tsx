"use client";

import * as RadioGroupPrimitive from "@radix-ui/react-radio-group";
import { useId } from "react";
import { cn } from "@/lib/utils";

export interface RadioOption {
  value: string;
  label: string;
  description?: string;
  disabled?: boolean;
}

export interface RadioGroupProps {
  options: RadioOption[];
  value?: string;
  onValueChange?: (value: string) => void;
  label?: string;
  error?: string;
  hint?: string;
  orientation?: "vertical" | "horizontal";
  disabled?: boolean;
  required?: boolean;
  name?: string;
  wrapperClassName?: string;
}

export function RadioGroup({
  options,
  value,
  onValueChange,
  label,
  error,
  hint,
  orientation = "vertical",
  disabled,
  required,
  name,
  wrapperClassName,
}: RadioGroupProps) {
  const id = useId();
  const groupLabelId = `${id}-label`;
  const errorId = `${id}-error`;
  const hintId = `${id}-hint`;

  return (
    <div className={cn("flex flex-col gap-2", wrapperClassName)}>
      {label && (
        <p
          id={groupLabelId}
          className="font-display text-sm tracking-wide text-[var(--color-text)]"
        >
          {label}
          {required && (
            <span className="text-[var(--color-error)] ml-0.5" aria-hidden="true">*</span>
          )}
        </p>
      )}

      <RadioGroupPrimitive.Root
        value={value}
        onValueChange={onValueChange}
        disabled={disabled}
        name={name}
        required={required}
        aria-labelledby={label ? groupLabelId : undefined}
        aria-invalid={!!error}
        aria-describedby={error ? errorId : hint ? hintId : undefined}
        orientation={orientation}
        className={cn(
          "flex gap-3",
          orientation === "vertical" ? "flex-col" : "flex-row flex-wrap"
        )}
      >
        {options.map((opt) => {
          const itemId = `${id}-${opt.value}`;
          const descId = `${itemId}-desc`;
          return (
            <div key={opt.value} className="flex items-start gap-3">
              <RadioGroupPrimitive.Item
                id={itemId}
                value={opt.value}
                disabled={opt.disabled || disabled}
                aria-describedby={opt.description ? descId : undefined}
                className={cn(
                  "flex w-5 h-5 shrink-0 items-center justify-center rounded-full border-2 mt-0.5",
                  "transition-colors duration-150",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[var(--color-accent)]",
                  "disabled:opacity-50 disabled:cursor-not-allowed",
                  error
                    ? "border-[var(--color-error)] data-[state=checked]:border-[var(--color-error)]"
                    : "border-[var(--color-border-strong)] data-[state=checked]:border-[var(--color-primary)]"
                )}
              >
                <RadioGroupPrimitive.Indicator
                  className={cn(
                    "flex items-center justify-center w-2.5 h-2.5 rounded-full",
                    error ? "bg-[var(--color-error)]" : "bg-[var(--color-primary)]"
                  )}
                />
              </RadioGroupPrimitive.Item>

              <div className="flex flex-col gap-0.5">
                <label
                  htmlFor={itemId}
                  className={cn(
                    "text-sm text-[var(--color-text)] select-none cursor-pointer",
                    (opt.disabled || disabled) && "opacity-50 cursor-not-allowed"
                  )}
                >
                  {opt.label}
                </label>
                {opt.description && (
                  <p id={descId} className="text-xs text-[var(--color-text-subtle)]">
                    {opt.description}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </RadioGroupPrimitive.Root>

      {error && (
        <p id={errorId} role="alert" className="text-xs text-[var(--color-error)] flex items-center gap-1">
          <svg className="w-3.5 h-3.5 shrink-0" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
          {error}
        </p>
      )}
      {hint && !error && (
        <p id={hintId} className="text-xs text-[var(--color-text-subtle)]">{hint}</p>
      )}
    </div>
  );
}
