"use client";

import * as SelectPrimitive from "@radix-ui/react-select";
import { useId } from "react";
import { cn } from "@/lib/utils";

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface SelectGroup {
  label: string;
  options: SelectOption[];
}

export interface SelectProps {
  /** Flat list of options */
  options?: SelectOption[];
  /** Grouped options */
  groups?: SelectGroup[];
  value?: string;
  onValueChange?: (value: string) => void;
  placeholder?: string;
  label?: string;
  error?: string;
  hint?: string;
  disabled?: boolean;
  id?: string;
  required?: boolean;
  wrapperClassName?: string;
}

const ChevronDown = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
  </svg>
);

const Check = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
  </svg>
);

function SelectItem({ value, label, disabled }: SelectOption) {
  return (
    <SelectPrimitive.Item
      value={value}
      disabled={disabled}
      className={cn(
        "relative flex w-full cursor-default select-none items-center",
        "rounded-[var(--radius-sm)] py-1.5 pl-2 pr-8 text-sm",
        "outline-none transition-colors",
        "focus:bg-[var(--color-primary)] focus:text-white",
        "data-[disabled]:pointer-events-none data-[disabled]:opacity-40"
      )}
    >
      <SelectPrimitive.ItemText>{label}</SelectPrimitive.ItemText>
      <SelectPrimitive.ItemIndicator className="absolute right-2 flex items-center">
        <Check />
      </SelectPrimitive.ItemIndicator>
    </SelectPrimitive.Item>
  );
}

export function Select({
  options = [],
  groups = [],
  value,
  onValueChange,
  placeholder = "Select an option…",
  label,
  error,
  hint,
  disabled,
  id,
  required,
  wrapperClassName,
}: SelectProps) {
  const generatedId = useId();
  const selectId = id ?? generatedId;
  const errorId = `${selectId}-error`;
  const hintId = `${selectId}-hint`;

  return (
    <div className={cn("flex flex-col gap-1.5", wrapperClassName)}>
      {label && (
        <label
          id={`${selectId}-label`}
          htmlFor={selectId}
          className="font-display text-sm tracking-wide text-[var(--color-text)] select-none"
        >
          {label}
          {required && (
            <span className="text-[var(--color-error)] ml-0.5" aria-hidden="true">*</span>
          )}
        </label>
      )}

      <SelectPrimitive.Root value={value} onValueChange={onValueChange} disabled={disabled}>
        <SelectPrimitive.Trigger
          id={selectId}
          aria-labelledby={label ? `${selectId}-label` : undefined}
          aria-invalid={!!error}
          aria-describedby={error ? errorId : hint ? hintId : undefined}
          className={cn(
            "flex h-10 w-full items-center justify-between gap-2",
            "rounded-[var(--radius-md)] border bg-[var(--color-bg-card)]",
            "px-3 py-2 text-sm",
            "transition-colors duration-150",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1",
            "disabled:opacity-50 disabled:cursor-not-allowed",
            "data-[placeholder]:text-[var(--color-text-subtle)]",
            error
              ? "border-[var(--color-error)] focus-visible:ring-[var(--color-error)]"
              : "border-[var(--color-border)] hover:border-[var(--color-border-strong)] focus-visible:ring-[var(--color-accent)] focus-visible:border-[var(--color-primary)]"
          )}
        >
          <SelectPrimitive.Value placeholder={placeholder} />
          <SelectPrimitive.Icon className="text-[var(--color-text-muted)] shrink-0">
            <ChevronDown />
          </SelectPrimitive.Icon>
        </SelectPrimitive.Trigger>

        <SelectPrimitive.Portal>
          <SelectPrimitive.Content
            className={cn(
              "relative z-50 min-w-[8rem] overflow-hidden",
              "rounded-[var(--radius-md)] border border-[var(--color-border)]",
              "bg-[var(--color-bg-card)] shadow-[var(--shadow-md)]",
              "animate-[slide-down_150ms_ease]"
            )}
            position="popper"
            sideOffset={4}
          >
            <SelectPrimitive.ScrollUpButton className="flex h-6 items-center justify-center text-[var(--color-text-muted)]">
              <svg className="w-4 h-4 rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
            </SelectPrimitive.ScrollUpButton>
            <SelectPrimitive.Viewport className="p-1">
              {groups.length > 0
                ? groups.map((group) => (
                    <SelectPrimitive.Group key={group.label}>
                      <SelectPrimitive.Label className="px-2 py-1 text-xs font-display tracking-widest uppercase text-[var(--color-text-subtle)]">
                        {group.label}
                      </SelectPrimitive.Label>
                      {group.options.map((opt) => (
                        <SelectItem key={opt.value} {...opt} />
                      ))}
                    </SelectPrimitive.Group>
                  ))
                : options.map((opt) => <SelectItem key={opt.value} {...opt} />)}
            </SelectPrimitive.Viewport>
            <SelectPrimitive.ScrollDownButton className="flex h-6 items-center justify-center text-[var(--color-text-muted)]">
              <ChevronDown />
            </SelectPrimitive.ScrollDownButton>
          </SelectPrimitive.Content>
        </SelectPrimitive.Portal>
      </SelectPrimitive.Root>

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
