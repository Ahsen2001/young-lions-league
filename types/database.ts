/**
 * Database type stubs.
 *
 * Replace this file with the output of:
 *   npx supabase gen types typescript --project-id <project-id> > types/database.ts
 *
 * once the Supabase project and schema are created.
 */
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

/** Placeholder Database type — will be replaced by Supabase CLI generated types */
export type Database = {
  public: {
    Tables: Record<string, never>;
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
  };
};
