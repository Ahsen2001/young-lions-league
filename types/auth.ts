/**
 * Authentication and User Role Types for Young Lions League Management System.
 */

export type UserRole = "ADMIN" | "MATCH_OFFICIAL";

export interface UserProfile {
  id: string;
  user_id: string;
  email: string;
  full_name: string | null;
  role: UserRole;
  created_at: string;
  updated_at: string;
}

export interface AuthState {
  user: { id: string; email?: string } | null;
  profile: UserProfile | null;
  isLoading: boolean;
}
