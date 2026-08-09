import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * proxy.ts — Next.js 16 request proxy (replaces middleware.ts).
 *
 * Current scope: session cookie refresh for Supabase Auth.
 * Auth route protection will be added in the Auth sprint.
 *
 * NOTE: In Next.js 16, this file MUST be named `proxy.ts`
 * and export a function named `proxy` (not `middleware`).
 */
export function proxy(request: NextRequest) {
  // Pass through all requests — Supabase session refresh will be
  // handled here once auth is wired up.
  return NextResponse.next({
    request: {
      headers: request.headers,
    },
  });
}

export const config = {
  matcher: [
    /*
     * Match all request paths EXCEPT:
     * - _next/static  (static files)
     * - _next/image   (image optimisation)
     * - favicon.ico
     * - public folder assets
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
