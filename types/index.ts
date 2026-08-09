/**
 * types/index.ts — barrel export for all domain types.
 */
export type { Database, Json } from "./database";
export type {
  Tournament,
  TournamentSettings,
  TournamentRef,
  TournamentStatus,
  TournamentFormat,
} from "./tournament";
export type {
  Team,
  TeamRef,
  Group,
  GroupMembership,
  DrawRecord,
  DrawAuditLog,
} from "./team";
export type {
  Match,
  MatchStage,
  MatchStatus,
  Venue,
  ResultAuditLog,
  Champion,
} from "./match";
export type { UserRole, UserProfile, AuthState } from "./auth";
