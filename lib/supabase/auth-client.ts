"use client";

import { createClient as createBrowserSupabase } from "@/lib/supabase/client";

/**
 * Client-side Sign Out helper for Client Components.
 */
export async function signOutClient() {
  const supabase = createBrowserSupabase();
  await supabase.auth.signOut();
}
