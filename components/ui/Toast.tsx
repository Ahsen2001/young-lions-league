"use client";

import { Toaster as SonnerToaster, toast as sonnerToast } from "sonner";

/**
 * Toaster — place once in the root layout.
 * Styled to match the Young Lions brand palette.
 */
export function Toaster() {
  return (
    <SonnerToaster
      position="bottom-right"
      expand={false}
      richColors={false}
      toastOptions={{
        duration: 4000,
        classNames: {
          toast: [
            "group font-body text-sm",
            "bg-[var(--color-bg-card)] text-[var(--color-text)]",
            "border border-[var(--color-border)] shadow-[var(--shadow-md)]",
            "rounded-[var(--radius-md)] px-4 py-3",
          ].join(" "),
          title: "font-display tracking-wide text-sm text-[var(--color-text)]",
          description: "text-xs text-[var(--color-text-muted)] mt-0.5",
          actionButton:
            "font-display text-xs tracking-widest uppercase bg-[var(--color-primary)] text-white px-3 py-1.5 rounded-[var(--radius-sm)]",
          cancelButton:
            "font-display text-xs tracking-widest uppercase text-[var(--color-text-muted)] px-3 py-1.5 rounded-[var(--radius-sm)] border border-[var(--color-border)]",
          closeButton:
            "text-[var(--color-text-muted)] hover:text-[var(--color-text)]",
          success:
            "border-l-4 !border-l-[var(--color-success)] !border-[var(--color-border)]",
          error:
            "border-l-4 !border-l-[var(--color-error)] !border-[var(--color-border)]",
          warning:
            "border-l-4 !border-l-[var(--color-warning)] !border-[var(--color-border)]",
          info: "border-l-4 !border-l-[var(--color-info)] !border-[var(--color-border)]",
        },
      }}
    />
  );
}

/**
 * toast — branded toast helpers.
 * Import and call from any Client Component.
 *
 * @example
 * import { toast } from '@/components/ui/Toast'
 * toast.success('Match result saved.')
 */
export const toast = {
  success: (message: string, description?: string) =>
    sonnerToast.success(message, { description }),

  error: (message: string, description?: string) =>
    sonnerToast.error(message, { description }),

  warning: (message: string, description?: string) =>
    sonnerToast(message, {
      description,
      // No built-in warning in sonner — use custom icon
      icon: (
        <svg className="w-4 h-4 text-[var(--color-warning)] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
        </svg>
      ),
    }),

  info: (message: string, description?: string) =>
    sonnerToast.info(message, { description }),

  /** Raw sonner access for advanced use */
  raw: sonnerToast,
};
