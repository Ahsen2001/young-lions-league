import { cn } from "@/lib/utils";

/* ── Types ───────────────────────────────────────────────────────────── */
export type BadgeVariant =
  | "primary"
  | "secondary"
  | "accent"
  | "success"
  | "warning"
  | "error"
  | "info"
  | "neutral";

export type BadgeSize = "sm" | "md";

/* ── Style maps ──────────────────────────────────────────────────────── */
const variantCls: Record<BadgeVariant, string> = {
  primary:
    "bg-[var(--color-primary)]/15 text-[var(--color-primary)] border border-[var(--color-primary)]/25",
  secondary:
    "bg-[var(--color-secondary)]/15 text-[#5a6218] border border-[var(--color-secondary)]/30",
  accent:
    "bg-[var(--color-accent)]/20 text-[var(--color-accent-dark)] border border-[var(--color-accent)]/35",
  success:
    "bg-[var(--color-success-bg)] text-[#15803d] border border-[var(--color-success)]/30",
  warning:
    "bg-[var(--color-warning-bg)] text-[#b45309] border border-[var(--color-warning)]/30",
  error:
    "bg-[var(--color-error-bg)] text-[#b91c1c] border border-[var(--color-error)]/30",
  info:
    "bg-[var(--color-info-bg)] text-[#1d4ed8] border border-[var(--color-info)]/30",
  neutral:
    "bg-[var(--color-bg-muted)] text-[var(--color-text-muted)] border border-[var(--color-border)]",
};

const sizeCls: Record<BadgeSize, string> = {
  sm: "px-2 py-0.5 text-[10px] gap-1",
  md: "px-2.5 py-1 text-xs gap-1.5",
};

/* ── Component ───────────────────────────────────────────────────────── */
export interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  size?: BadgeSize;
  className?: string;
  /** Optional dot indicator */
  dot?: boolean;
}

export function Badge({
  children,
  variant = "neutral",
  size = "md",
  className,
  dot = false,
}: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full font-display tracking-widest uppercase font-semibold whitespace-nowrap",
        variantCls[variant],
        sizeCls[size],
        className
      )}
    >
      {dot && (
        <span
          className="w-1.5 h-1.5 rounded-full bg-current shrink-0"
          aria-hidden="true"
        />
      )}
      {children}
    </span>
  );
}
