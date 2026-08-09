"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ROUTE_LABELS } from "@/constants/navigation";

export default function AdminBreadcrumbs() {
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);

  // Don't render breadcrumbs on root /admin dashboard
  if (segments.length <= 1) {
    return (
      <nav aria-label="Breadcrumb" className="text-xs text-[var(--color-text-subtle)]">
        <span className="font-display uppercase tracking-widest font-medium text-[var(--color-primary)]">
          Admin Dashboard
        </span>
      </nav>
    );
  }

  const breadcrumbItems = segments.map((segment, index) => {
    const url = `/${segments.slice(0, index + 1).join("/")}`;
    const isLast = index === segments.length - 1;
    const label = ROUTE_LABELS[segment] || segment.replace(/-/g, " ");

    return {
      label,
      url,
      isLast,
    };
  });

  return (
    <nav aria-label="Breadcrumb">
      <ol className="flex flex-wrap items-center gap-1 text-xs text-[var(--color-text-muted)]">
        <li>
          <Link
            href="/admin"
            className="hover:text-[var(--color-primary)] transition-colors font-display uppercase tracking-wider"
          >
            Admin
          </Link>
        </li>
        {breadcrumbItems.slice(1).map((item, i) => (
          <li key={item.url} className="flex items-center gap-1">
            <span className="opacity-40 select-none" aria-hidden="true">
              /
            </span>
            {item.isLast ? (
              <span
                className="font-semibold text-[var(--color-primary)] font-display uppercase tracking-wider"
                aria-current="page"
              >
                {item.label}
              </span>
            ) : (
              <Link
                href={item.url}
                className="hover:text-[var(--color-primary)] transition-colors font-display uppercase tracking-wider"
              >
                {item.label}
              </Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
