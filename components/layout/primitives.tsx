import type { HTMLAttributes, ReactNode } from "react";

const gaps = { sm: "gap-2", md: "gap-4", lg: "gap-8", xl: "gap-12" } as const;

type PrimitiveProps = HTMLAttributes<HTMLDivElement> & { children: ReactNode; gap?: keyof typeof gaps };

export function Stack({ children, className = "", gap = "md", ...props }: PrimitiveProps) {
  return <div className={`flex flex-col ${gaps[gap]} ${className}`} {...props}>{children}</div>;
}

export function Cluster({ children, className = "", gap = "md", ...props }: PrimitiveProps) {
  return <div className={`flex flex-wrap items-center ${gaps[gap]} ${className}`} {...props}>{children}</div>;
}

type GridProps = PrimitiveProps & { columns?: 1 | 2 | 3 | 4 };
const columns = { 1: "grid-cols-1", 2: "grid-cols-1 sm:grid-cols-2", 3: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3", 4: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4" } as const;

export function Grid({ children, className = "", columns: count = 3, gap = "md", ...props }: GridProps) {
  return <div className={`grid ${columns[count]} ${gaps[gap]} ${className}`} {...props}>{children}</div>;
}
