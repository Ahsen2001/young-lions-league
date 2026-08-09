import { cn } from "@/lib/utils";

interface PageContainerProps {
  children: React.ReactNode;
  /** Optional additional class names */
  className?: string;
  /** Render as a narrower reading-width container (default: full 7xl) */
  narrow?: boolean;
}

/**
 * PageContainer — the standard responsive page wrapper.
 *
 * Centers content horizontally, applies consistent horizontal padding,
 * and vertically pads sections. Use this inside every public page.
 */
export default function PageContainer({
  children,
  className,
  narrow = false,
}: PageContainerProps) {
  return (
    <div
      className={cn(
        "mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 lg:py-12",
        narrow ? "max-w-3xl" : "max-w-7xl",
        className
      )}
    >
      {children}
    </div>
  );
}
