"use client";

import * as TabsPrimitive from "@radix-ui/react-tabs";
import { cn } from "@/lib/utils";

/* ── Style variants ──────────────────────────────────────────────────── */
type TabsVariant = "underline" | "pill";

/* ── List ────────────────────────────────────────────────────────────── */
interface ListProps extends React.ComponentPropsWithoutRef<typeof TabsPrimitive.List> {
  variant?: TabsVariant;
}

const List = ({ children, className, variant = "underline", ...props }: ListProps) => (
  <TabsPrimitive.List
    className={cn(
      "flex",
      variant === "underline"
        ? "border-b border-[var(--color-border)] gap-0"
        : "bg-[var(--color-bg-muted)] rounded-[var(--radius-md)] p-1 gap-1",
      className
    )}
    {...props}
  >
    {children}
  </TabsPrimitive.List>
);

/* ── Trigger ─────────────────────────────────────────────────────────── */
interface TriggerProps extends React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger> {
  variant?: TabsVariant;
}

const Trigger = ({ children, className, variant = "underline", ...props }: TriggerProps) => (
  <TabsPrimitive.Trigger
    className={cn(
      "inline-flex items-center justify-center whitespace-nowrap",
      "font-display text-xs tracking-widest uppercase font-semibold",
      "transition-all duration-150",
      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[var(--color-accent)]",
      "disabled:pointer-events-none disabled:opacity-50",
      variant === "underline"
        ? [
            "px-4 py-2.5 -mb-px border-b-2 border-transparent",
            "text-[var(--color-text-muted)] hover:text-[var(--color-text)]",
            "data-[state=active]:border-[var(--color-accent)] data-[state=active]:text-[var(--color-primary)]",
          ]
        : [
            "px-3 py-1.5 rounded-[var(--radius-sm)]",
            "text-[var(--color-text-muted)] hover:text-[var(--color-text)]",
            "data-[state=active]:bg-[var(--color-bg-card)] data-[state=active]:text-[var(--color-primary)] data-[state=active]:shadow-[var(--shadow-sm)]",
          ],
      className
    )}
    {...props}
  >
    {children}
  </TabsPrimitive.Trigger>
);

/* ── Content ─────────────────────────────────────────────────────────── */
const Content = ({
  children,
  className,
  ...props
}: React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>) => (
  <TabsPrimitive.Content
    className={cn(
      "mt-4",
      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] rounded-[var(--radius-sm)]",
      "data-[state=active]:animate-[fade-in_150ms_ease]",
      className
    )}
    {...props}
  >
    {children}
  </TabsPrimitive.Content>
);

/* ── Exports ─────────────────────────────────────────────────────────── */
export const Tabs = {
  Root: TabsPrimitive.Root,
  List,
  Trigger,
  Content,
};
