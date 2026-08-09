/**
 * components/ui — Design system barrel export.
 * Import all UI primitives from this single entry point.
 */

// Primitives
export { Spinner } from "./Spinner";
export type { SpinnerProps } from "./Spinner";

export {
  Skeleton,
  SkeletonCard,
  SkeletonMatchCard,
  SkeletonTournamentCard,
  SkeletonStandings,
  SkeletonTable,
  SkeletonGrid,
  SkeletonRow,
  SkeletonText,
  SkeletonAvatar,
} from "./Skeleton";
export type { SkeletonProps } from "./Skeleton";

export { Button } from "./Button";
export type { ButtonProps, ButtonVariant, ButtonSize } from "./Button";

export { IconButton } from "./IconButton";
export type { IconButtonProps } from "./IconButton";

// Layout
export { Card, CardHeader, CardBody, CardFooter } from "./Card";
export type { CardProps } from "./Card";

export { PageHeader } from "./PageHeader";
export type { PageHeaderProps, BreadcrumbItem } from "./PageHeader";

export { SectionHeader } from "./SectionHeader";
export type { SectionHeaderProps } from "./SectionHeader";

// Badges
export { Badge } from "./Badge";
export type { BadgeProps, BadgeVariant, BadgeSize } from "./Badge";

export { TournamentStatusBadge, MatchStatusBadge } from "./StatusBadge";
export type { MatchStatus } from "./StatusBadge";

// Forms
export { Input } from "./Input";
export type { InputProps } from "./Input";

export { Textarea } from "./Textarea";
export type { TextareaProps } from "./Textarea";

export { Select } from "./Select";
export type { SelectProps, SelectOption, SelectGroup } from "./Select";

export { Checkbox } from "./Checkbox";
export type { CheckboxProps } from "./Checkbox";

export { RadioGroup } from "./RadioGroup";
export type { RadioGroupProps, RadioOption } from "./RadioGroup";

// Overlay
export { Dialog } from "./Dialog";
export { AlertDialog } from "./AlertDialog";
export { DropdownMenu } from "./DropdownMenu";

// Navigation
export { Tabs } from "./Tabs";

// Data display
export {
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableHeader,
  TableCell,
} from "./Table";
export type { TableProps, TableHeaderProps, TableCellProps } from "./Table";

export { Pagination } from "./Pagination";
export type { PaginationProps } from "./Pagination";

// Feedback
export { EmptyState } from "./EmptyState";
export type { EmptyStateProps } from "./EmptyState";

export { ErrorState } from "./ErrorState";
export type { ErrorStateProps } from "./ErrorState";

// Toast
export { Toaster, toast } from "./Toast";
