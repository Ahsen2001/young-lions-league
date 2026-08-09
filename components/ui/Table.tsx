import { cn } from "@/lib/utils";

/* ── Table wrapper (responsive scroll) ───────────────────────────────── */
export interface TableProps {
  children: React.ReactNode;
  className?: string;
  /** Stretch to container width */
  fullWidth?: boolean;
}

export function Table({ children, className, fullWidth = true }: TableProps) {
  return (
    <div className="w-full overflow-x-auto rounded-[var(--radius-md)] border border-[var(--color-border)]">
      <table
        className={cn(
          "border-collapse text-sm",
          fullWidth && "w-full",
          className
        )}
      >
        {children}
      </table>
    </div>
  );
}

/* ── Thead ───────────────────────────────────────────────────────────── */
export function TableHead({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <thead
      className={cn("bg-[var(--color-primary)] text-white", className)}
    >
      {children}
    </thead>
  );
}

/* ── Tbody ───────────────────────────────────────────────────────────── */
export function TableBody({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <tbody
      className={cn(
        "[&_tr:last-child_td]:border-b-0",
        "[&_tr:nth-child(even)]:bg-[var(--color-bg-muted)]/60",
        className
      )}
    >
      {children}
    </tbody>
  );
}

/* ── Tr ──────────────────────────────────────────────────────────────── */
export function TableRow({
  children,
  className,
  onClick,
}: {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}) {
  return (
    <tr
      onClick={onClick}
      className={cn(
        "border-b border-[var(--color-border)] transition-colors",
        onClick && "cursor-pointer hover:bg-[var(--color-primary)]/5",
        className
      )}
    >
      {children}
    </tr>
  );
}

/* ── Th ──────────────────────────────────────────────────────────────── */
export interface TableHeaderProps {
  children: React.ReactNode;
  className?: string;
  align?: "left" | "center" | "right";
  /** Show sort indicator */
  sort?: "asc" | "desc" | "none";
  onClick?: () => void;
  scope?: "col" | "row";
}

export function TableHeader({
  children,
  className,
  align = "left",
  sort,
  onClick,
  scope = "col",
}: TableHeaderProps) {
  return (
    <th
      scope={scope}
      onClick={onClick}
      aria-sort={
        sort === "asc" ? "ascending" : sort === "desc" ? "descending" : undefined
      }
      className={cn(
        "px-4 py-3 font-display text-xs tracking-widest uppercase font-semibold text-white/90",
        align === "center" && "text-center",
        align === "right" && "text-right",
        onClick && "cursor-pointer select-none hover:text-white transition-colors",
        className
      )}
    >
      <span className="inline-flex items-center gap-1.5">
        {children}
        {sort && onClick && (
          <span aria-hidden="true" className="opacity-70">
            {sort === "asc" ? "↑" : sort === "desc" ? "↓" : "↕"}
          </span>
        )}
      </span>
    </th>
  );
}

/* ── Td ──────────────────────────────────────────────────────────────── */
export interface TableCellProps {
  children: React.ReactNode;
  className?: string;
  align?: "left" | "center" | "right";
  muted?: boolean;
}

export function TableCell({
  children,
  className,
  align = "left",
  muted = false,
}: TableCellProps) {
  return (
    <td
      className={cn(
        "px-4 py-3",
        align === "center" && "text-center",
        align === "right" && "text-right",
        muted && "text-[var(--color-text-muted)] text-xs",
        className
      )}
    >
      {children}
    </td>
  );
}
