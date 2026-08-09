/**
 * types/index.ts — barrel export for all domain types.
 */
export type { Database, Json } from "./database";
export type {
  Tournament,
  TournamentRef,
  TournamentStatus,
  TournamentFormat,
} from "./tournament";
export type { Team, TeamRef, TournamentTeam } from "./team";
