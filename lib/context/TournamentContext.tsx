"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import type { TournamentRef } from "@/types";
import { fetchTournaments } from "@/lib/services/tournament.service";

export interface TournamentContextType {
  currentTournament: TournamentRef | null;
  tournaments: TournamentRef[];
  setCurrentTournament: (tournament: TournamentRef) => void;
  isLoading: boolean;
}

const TournamentContext = createContext<TournamentContextType | undefined>(
  undefined
);

export function TournamentProvider({ children }: { children: React.ReactNode }) {
  const [tournaments, setTournaments] = useState<TournamentRef[]>([]);
  const [currentTournament, setCurrentTournamentState] =
    useState<TournamentRef | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    async function loadTournaments() {
      try {
        const res = await fetchTournaments({ pageSize: 50 });
        if (!isMounted) return;

        const refs: TournamentRef[] = res.data.map((t) => ({
          id: t.id,
          name: t.name,
          slug: t.slug,
          status: t.status,
          season: t.season,
        }));

        setTournaments(refs);

        // Restore saved active tournament or default to first
        const savedId = typeof window !== "undefined" ? localStorage.getItem("yl_active_tournament_id") : null;
        const found = refs.find((t) => t.id === savedId);
        setCurrentTournamentState(found || refs[0] || null);
      } catch (err) {
        console.warn("Could not load tournaments in context:", err);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    loadTournaments();

    return () => {
      isMounted = false;
    };
  }, []);

  const setCurrentTournament = (tournament: TournamentRef) => {
    setCurrentTournamentState(tournament);
    try {
      localStorage.setItem("yl_active_tournament_id", tournament.id);
    } catch {
      // Ignore localStorage write errors
    }
  };

  return (
    <TournamentContext.Provider
      value={{
        currentTournament,
        tournaments,
        setCurrentTournament,
        isLoading,
      }}
    >
      {children}
    </TournamentContext.Provider>
  );
}

export function useTournament() {
  const context = useContext(TournamentContext);
  if (!context) {
    throw new Error("useTournament must be used within a TournamentProvider");
  }
  return context;
}
