"use client";

import * as AlertDialogPrimitive from "@radix-ui/react-alert-dialog";
import { cn } from "@/lib/utils";

/* ── Overlay ─────────────────────────────────────────────────────────── */
const Overlay = () => (
  <AlertDialogPrimitive.Overlay
    className={cn(
      "fixed inset-0 z-50 bg-[var(--color-overlay)]",
      "data-[state=open]:animate-[overlay-show_200ms_ease]",
      "data-[state=closed]:animate-[overlay-hide_150ms_ease]"
    )}
  />
);

/* ── Content — NOTE: cannot be dismissed by clicking outside ─────────── */
export interface AlertDialogContentProps {
  children: React.ReactNode;
  className?: string;
}

const Content = ({ children, className }: AlertDialogContentProps) => (
  <AlertDialogPrimitive.Portal>
    <Overlay />
    <AlertDialogPrimitive.Content
      className={cn(
        "fixed left-1/2 top-1/2 z-50 w-full max-w-md -translate-x-1/2 -translate-y-1/2",
        "bg-[var(--color-bg-card)] rounded-[var(--radius-lg)] shadow-[var(--shadow-lg)]",
        "border border-[var(--color-border)] mx-4",
        "data-[state=open]:animate-[content-show_200ms_ease]",
        "data-[state=closed]:animate-[content-hide_150ms_ease]",
        "focus:outline-none",
        className
      )}
    >
      {children}
    </AlertDialogPrimitive.Content>
  </AlertDialogPrimitive.Portal>
);

/* ── Header ──────────────────────────────────────────────────────────── */
const Header = ({
  children,
  className,
  destructive = false,
}: {
  children: React.ReactNode;
  className?: string;
  destructive?: boolean;
}) => (
  <div className={cn("flex items-start gap-4 px-6 pt-6 pb-4", className)}>
    {destructive && (
      <div className="flex-shrink-0 flex items-center justify-center w-10 h-10 rounded-full bg-[var(--color-error-bg)]">
        <svg className="w-5 h-5 text-[var(--color-error)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      </div>
    )}
    <div className="flex-1">{children}</div>
  </div>
);

/* ── Body ────────────────────────────────────────────────────────────── */
const Body = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <div className={cn("px-6 pb-5 text-sm text-[var(--color-text-muted)]", className)}>
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

/* ── Pre-styled action buttons ───────────────────────────────────────── */
const CancelButton = ({
  children = "Cancel",
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) => (
  <AlertDialogPrimitive.Cancel asChild>
    <button
      className={cn(
        "inline-flex items-center justify-center h-9 px-4",
        "border-2 border-[var(--color-primary)] text-[var(--color-primary)] bg-transparent",
        "rounded-[var(--radius-md)] font-display text-xs tracking-widest uppercase font-semibold",
        "hover:bg-[var(--color-primary)]/10 transition-colors duration-150",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[var(--color-primary)]",
        className
      )}
      {...props}
    >
      {children}
    </button>
  </AlertDialogPrimitive.Cancel>
);

const ConfirmButton = ({
  children = "Confirm",
  destructive = false,
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { destructive?: boolean }) => (
  <AlertDialogPrimitive.Action asChild>
    <button
      className={cn(
        "inline-flex items-center justify-center h-9 px-4",
        "rounded-[var(--radius-md)] font-display text-xs tracking-widest uppercase font-semibold text-white",
        "transition-colors duration-150",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
        destructive
          ? "bg-[var(--color-error)] hover:bg-red-700 focus-visible:ring-[var(--color-error)]"
          : "bg-[var(--color-primary)] hover:bg-[var(--color-primary-dark)] focus-visible:ring-[var(--color-primary)]",
        className
      )}
      {...props}
    >
      {children}
    </button>
  </AlertDialogPrimitive.Action>
);

/* ── Exports ─────────────────────────────────────────────────────────── */
export const AlertDialog = {
  Root: AlertDialogPrimitive.Root,
  Trigger: AlertDialogPrimitive.Trigger,
  Content,
  Header,
  Body,
  Footer,
  Title: AlertDialogPrimitive.Title,
  Description: AlertDialogPrimitive.Description,
  CancelButton,
  ConfirmButton,
};
