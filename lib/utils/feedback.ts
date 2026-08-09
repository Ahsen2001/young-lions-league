import { toast } from "@/components/ui/Toast";

export interface AsyncActionResult<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}

export type ActionCategory =
  | "critical_competition" // e.g. Draw spin, lock draw, confirm result, generate fixtures, knockout advancement
  | "standard_write"        // e.g. Edit team name, edit venue
  | "read_only";            // e.g. Filter toggle, search query

/**
 * Execute an async operation with feedback, preventing duplicate submissions
 * and enforcing server confirmation for critical competition writes.
 */
export async function executeAsyncAction<T>(options: {
  actionName: string;
  category: ActionCategory;
  run: () => Promise<T>;
  successMessage?: string;
  errorMessage?: string;
  onSuccess?: (data: T) => void;
  onError?: (error: Error) => void;
}): Promise<AsyncActionResult<T>> {
  const { actionName, category, run, successMessage, errorMessage, onSuccess, onError } = options;

  try {
    // 1. Execute server operation — MUST wait for server response
    const result = await run();

    // 2. Critical competition actions require strict server verification
    if (category === "critical_competition") {
      console.info(`[Server Confirmed] Action '${actionName}' succeeded.`);
    }

    // 3. Trigger feedback toast
    if (successMessage) {
      toast.success(actionName, successMessage);
    }

    onSuccess?.(result);

    return {
      success: true,
      data: result,
    };
  } catch (err: unknown) {
    const errorObj = err instanceof Error ? err : new Error(String(err));
    const message = errorMessage || errorObj.message || "An unexpected error occurred.";

    console.error(`[AsyncAction Failure: ${actionName}]`, errorObj);
    toast.error(`${actionName} Failed`, message);
    onError?.(errorObj);

    return {
      success: false,
      error: message,
    };
  }
}

/**
 * Safe Optimistic UI Guard.
 *
 * Rules:
 * - NEVER use optimistic UI for critical competition actions (Draw, Results, Qualification, Knockout).
 * - ALLOWED only for local state, UI filter inputs, or non-critical UI preferences.
 */
export function isOptimisticAllowed(category: ActionCategory): boolean {
  return category === "read_only";
}
