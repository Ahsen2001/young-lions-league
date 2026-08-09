import { cn } from "@/lib/utils";

/* ── Root ────────────────────────────────────────────────────────────── */
export interface CardProps {
  children: React.ReactNode;
  className?: string;
  /** Show a lift shadow on hover */
  hoverable?: boolean;
  /** Padding preset */
  padding?: "none" | "sm" | "md" | "lg";
  /** Remove border */
  noBorder?: boolean;
}

const paddingCls = {
  none: "",
  sm: "p-3",
  md: "p-5",
  lg: "p-7",
};

export function Card({
  children,
  className,
  hoverable = false,
  padding = "md",
  noBorder = false,
}: CardProps) {
  return (
    <div
      className={cn(
        "bg-[var(--color-bg-card)] rounded-[var(--radius-lg)]",
        !noBorder && "border border-[var(--color-border)]",
        "shadow-[var(--shadow-sm)]",
        hoverable &&
          "transition-shadow duration-200 hover:shadow-[var(--shadow-md)] hover:-translate-y-0.5",
        paddingCls[padding],
        className
      )}
    >
      {children}
    </div>
  );
}

/* ── Sub-components ──────────────────────────────────────────────────── */
export function CardHeader({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "px-5 py-4 border-b border-[var(--color-border)] flex items-center justify-between gap-4",
        className
      )}
    >
      {children}
    </div>
  );
}

export function CardBody({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <div className={cn("p-5", className)}>{children}</div>;
}

export function CardFooter({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "px-5 py-4 border-t border-[var(--color-border)] bg-[var(--color-bg-muted)] rounded-b-[var(--radius-lg)] flex items-center justify-end gap-3",
        className
      )}
    >
      {children}
    </div>
  );
}
