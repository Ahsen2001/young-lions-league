"use client";

import * as DialogPrimitive from "@radix-ui/react-dialog";
import { cn } from "@/lib/utils";

/* ── Overlay ─────────────────────────────────────────────────────────── */
const Overlay = () => (
  <DialogPrimitive.Overlay
    className={cn(
      "fixed inset-0 z-50 bg-[var(--color-overlay)]",
      "data-[state=open]:animate-[overlay-show_200ms_ease]",
      "data-[state=closed]:animate-[overlay-hide_150ms_ease]"
    )}
  />
);

/* ── Content ─────────────────────────────────────────────────────────── */
export interface DialogContentProps {
  children: React.ReactNode;
  className?: string;
  /** Width preset */
  size?: "sm" | "md" | "lg" | "xl";
}

const sizeCls = {
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-lg",
  xl: "max-w-xl",
};

const Content = ({ children, className, size = "md" }: DialogContentProps) => (
  <DialogPrimitive.Portal>
    <Overlay />
    <DialogPrimitive.Content
      className={cn(
        "fixed left-1/2 top-1/2 z-50 w-full -translate-x-1/2 -translate-y-1/2",
        "bg-[var(--color-bg-card)] rounded-[var(--radius-lg)] shadow-[var(--shadow-lg)]",
        "border border-[var(--color-border)]",
        "mx-4",
        "data-[state=open]:animate-[content-show_200ms_ease]",
        "data-[state=closed]:animate-[content-hide_150ms_ease]",
        "focus:outline-none",
        sizeCls[size],
        className
      )}
    >
      {children}
    </DialogPrimitive.Content>
  </DialogPrimitive.Portal>
);

/* ── Header ──────────────────────────────────────────────────────────── */
const Header = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <div
    className={cn(
      "flex items-start justify-between gap-4 px-6 pt-6 pb-4 border-b border-[var(--color-border)]",
      className
    )}
  >
    {children}
  </div>
);

/* ── Close button ────────────────────────────────────────────────────── */
const CloseButton = () => (
  <DialogPrimitive.Close
    className={cn(
      "flex items-center justify-center w-8 h-8 shrink-0 rounded-[var(--radius-sm)]",
      "text-[var(--color-text-muted)] hover:text-[var(--color-text)] hover:bg-[var(--color-bg-muted)]",
      "transition-colors duration-150",
      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)]"
    )}
    aria-label="Close dialog"
  >
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
  </DialogPrimitive.Close>
);

/* ── Body ────────────────────────────────────────────────────────────── */
const Body = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <div className={cn("px-6 py-5 text-sm text-[var(--color-text-muted)]", className)}>
    {children}
  </div>
);

/* ── Footer ──────────────────────────────────────────────────────────── */
const Footer = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <div
    className={cn(
      "flex items-center justify-end gap-3 px-6 py-4 border-t border-[var(--color-border)]",
      "bg-[var(--color-bg-muted)] rounded-b-[var(--radius-lg)]",
      className
    )}
  >
    {children}
  </div>
);

/* ── Exports ─────────────────────────────────────────────────────────── */
export const Dialog = {
  Root: DialogPrimitive.Root,
  Trigger: DialogPrimitive.Trigger,
  Content,
  Header,
  CloseButton,
  Title: DialogPrimitive.Title,
  Description: DialogPrimitive.Description,
  Body,
  Footer,
  Close: DialogPrimitive.Close,
};

export type { DialogPrimitive };
