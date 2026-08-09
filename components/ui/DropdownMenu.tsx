"use client";

import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu";
import { cn } from "@/lib/utils";

/* ── Content ─────────────────────────────────────────────────────────── */
const Content = ({
  children,
  className,
  align = "end",
  sideOffset = 6,
  ...props
}: React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Content>) => (
  <DropdownMenuPrimitive.Portal>
    <DropdownMenuPrimitive.Content
      align={align}
      sideOffset={sideOffset}
      className={cn(
        "z-50 min-w-[10rem] overflow-hidden",
        "rounded-[var(--radius-md)] border border-[var(--color-border)]",
        "bg-[var(--color-bg-card)] shadow-[var(--shadow-md)]",
        "p-1",
        "data-[side=bottom]:animate-[slide-down_150ms_ease]",
        "data-[side=top]:animate-[slide-up_150ms_ease]",
        "focus:outline-none",
        className
      )}
      {...props}
    >
      {children}
    </DropdownMenuPrimitive.Content>
  </DropdownMenuPrimitive.Portal>
);

/* ── Item ────────────────────────────────────────────────────────────── */
const Item = ({
  children,
  className,
  icon,
  destructive = false,
  ...props
}: React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Item> & {
  icon?: React.ReactNode;
  destructive?: boolean;
}) => (
  <DropdownMenuPrimitive.Item
    className={cn(
      "relative flex w-full cursor-default select-none items-center gap-2.5",
      "rounded-[var(--radius-sm)] px-2.5 py-2 text-sm",
      "outline-none transition-colors duration-100",
      "data-[disabled]:pointer-events-none data-[disabled]:opacity-40",
      destructive
        ? "text-[var(--color-error)] focus:bg-[var(--color-error-bg)] focus:text-[var(--color-error)]"
        : "text-[var(--color-text)] focus:bg-[var(--color-primary)] focus:text-white",
      className
    )}
    {...props}
  >
    {icon && (
      <span className="w-4 h-4 shrink-0 flex items-center justify-center">
        {icon}
      </span>
    )}
    {children}
  </DropdownMenuPrimitive.Item>
);

/* ── Label ───────────────────────────────────────────────────────────── */
const Label = ({
  children,
  className,
  ...props
}: React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Label>) => (
  <DropdownMenuPrimitive.Label
    className={cn(
      "px-2.5 py-1.5 text-[10px] font-display tracking-widest uppercase text-[var(--color-text-subtle)]",
      className
    )}
    {...props}
  >
    {children}
  </DropdownMenuPrimitive.Label>
);

/* ── Separator ───────────────────────────────────────────────────────── */
const Separator = ({
  className,
  ...props
}: React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Separator>) => (
  <DropdownMenuPrimitive.Separator
    className={cn("-mx-1 my-1 h-px bg-[var(--color-border)]", className)}
    {...props}
  />
);

/* ── Exports ─────────────────────────────────────────────────────────── */
export const DropdownMenu = {
  Root: DropdownMenuPrimitive.Root,
  Trigger: DropdownMenuPrimitive.Trigger,
  Content,
  Item,
  Label,
  Separator,
};
