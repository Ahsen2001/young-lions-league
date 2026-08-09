/**
 * lib/utils — barrel export for all utility functions.
 */
export { cn } from "./cn";

/**
 * formatDate — locale-aware date formatter.
 */
export function formatDate(
  date: Date | string,
  options: Intl.DateTimeFormatOptions = {
    day: "numeric",
    month: "short",
    year: "numeric",
  }
): string {
  return new Intl.DateTimeFormat("en-IN", options).format(
    typeof date === "string" ? new Date(date) : date
  );
}

/**
 * formatTime — locale-aware time formatter.
 */
export function formatTime(date: Date | string): string {
  return new Intl.DateTimeFormat("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(typeof date === "string" ? new Date(date) : date);
}

/**
 * slugify — converts a string to a URL-safe slug.
 */
export function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/**
 * assertNever — TypeScript exhaustiveness checker.
 */
export function assertNever(value: never): never {
  throw new Error(`Unhandled discriminated union member: ${JSON.stringify(value)}`);
}
