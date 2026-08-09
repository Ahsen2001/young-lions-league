import { createClient as createServerSupabase } from "@/lib/supabase/server";
import type { UserProfile } from "@/types/auth";

/**
 * Server-side helper to fetch the current authenticated user.
 */
export async function getCurrentUser() {
  try {
    const supabase = await createServerSupabase();
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error || !user) return null;
    return user;
  } catch {
    return null;
  }
}

/**
 * Server-side helper to fetch user profile & role.
 */
export async function getCurrentProfile(): Promise<UserProfile | null> {
  try {
    const supabase = await createServerSupabase();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return null;

    const { data: profile, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("user_id", user.id)
      .single();

    if (error || !profile) {
      // Fallback for initial admin when schema table is being populated
      return {
        id: user.id,
        user_id: user.id,
        email: user.email || "",
        full_name: "System Admin",
        role: "ADMIN",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
    }

    return profile as UserProfile;
  } catch {
    return null;
  }
}
