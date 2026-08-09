"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import type { TournamentRef } from "@/types";

export interface TournamentContextType {
  currentTournament: TournamentRef | null;
  tournaments: TournamentRef[];
  setCurrentTournament: (tournament: TournamentRef) => void;
  isLoading: boolean;
}

const DEFAULT_TOURNAMENTS: TournamentRef[] = [
  {
    id: "trn-2025-01",
    name: "Young Lions Super League 2025",
    slug: "young-lions-super-league-2025",
    status: "group_stage",
    season: "2025",
  },
  {
    id: "trn-2025-02",
    name: "Oddamavadi Youth Cup 2025",
    slug: "oddamavadi-youth-cup-2025",
    status: "registration",
    season: "2025",
  },
  {
    id: "trn-2024-01",
    name: "Young Lions Champions Trophy 2024",
    slug: "young-lions-champions-trophy-2024",
    status: "completed",
    season: "2024",
  },
];

const TournamentContext = createContext<TournamentContextType | undefined>(
  undefined
);

export function TournamentProvider({ children }: { children: React.ReactNode }) {
  const [tournaments] = useState<TournamentRef[]>(DEFAULT_TOURNAMENTS);
  const [currentTournament, setCurrentTournamentState] =
    useState<TournamentRef | null>(DEFAULT_TOURNAMENTS[0]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      const savedId = localStorage.getItem("yl_active_tournament_id");
      if (savedId) {
        const found = tournaments.find((t) => t.id === savedId);
        if (found) {
          setCurrentTournamentState(found);
        }
      }
    } catch {
      // Ignore localStorage read errors in SSR/strict modes
    } finally {
      setIsLoading(false);
    }
  }, [tournaments]);

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
