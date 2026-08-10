"use client";

import { useState, useEffect, use, useCallback } from "react";
import {
  fetchDrawState,
  drawSingleTeam,
  lockDraw,
  type DrawState,
  type DrawSingleTeamResult,
} from "@/lib/services/draw.service";
import { fetchTournamentById } from "@/lib/services/tournament.service";
import { toast } from "@/components/ui/Toast";

// Simple Canvas Confetti Effect Helper
function triggerCeremonyConfetti() {
  try {
    const canvas = document.createElement("canvas");
    canvas.style.position = "fixed";
    canvas.style.top = "0";
    canvas.style.left = "0";
    canvas.style.width = "100vw";
    canvas.style.height = "100vh";
    canvas.style.pointerEvents = "none";
    canvas.style.zIndex = "9999";
    document.body.appendChild(canvas);

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles: Array<{
      x: number;
      y: number;
      size: number;
      color: string;
      vx: number;
      vy: number;
      alpha: number;
    }> = [];

    const colors = ["#E1B32C", "#A0AF2A", "#FFFFFF", "#234F2D", "#F8F7F1"];

    for (let i = 0; i < 80; i++) {
      particles.push({
        x: canvas.width / 2,
        y: canvas.height / 3,
        size: Math.random() * 8 + 4,
        color: colors[Math.floor(Math.random() * colors.length)],
        vx: (Math.random() - 0.5) * 16,
        vy: (Math.random() - 0.7) * 16,
        alpha: 1,
      });
    }

    let frame = 0;
    function animate() {
      if (!ctx) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.4; // gravity
        p.alpha -= 0.015;
        ctx.globalAlpha = Math.max(0, p.alpha);
        ctx.fillStyle = p.color;
        ctx.fillRect(p.x, p.y, p.size, p.size);
      });

      frame++;
      if (frame < 70) {
        requestAnimationFrame(animate);
      } else {
        canvas.remove();
      }
    }

    animate();
  } catch {
    // Ignore canvas error
  }
}

export default function OfficialDrawCeremonyPage({
  params: paramsPromise,
}: {
  params: Promise<{ tournamentId: string }>;
}) {
  const params = use(paramsPromise);
  const tournamentId = params.tournamentId;

  const [tournamentName, setTournamentName] = useState<string>("Young Lions Super League 2025");
  const [drawState, setDrawState] = useState<DrawState | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // SPIN & Reveal State
  const [selectedTeamId, setSelectedTeamId] = useState<string>("");
  const [isSpinning, setIsSpinning] = useState(false);
  const [revealedResult, setRevealedResult] = useState<DrawSingleTeamResult | null>(null);
  const [highlightGroup, setHighlightGroup] = useState<"A" | "B" | null>(null);

  // Load Draw State
  const loadData = useCallback(async () => {
    try {
      const [tData, dState] = await Promise.all([
        fetchTournamentById(tournamentId),
        fetchDrawState(tournamentId),
      ]);

      if (tData) {
        setTournamentName(tData.name);
      }

      setDrawState(dState);

      if (
        dState.undrawn_teams.length > 0 &&
        (!selectedTeamId || !dState.undrawn_teams.some((t) => t.id === selectedTeamId))
      ) {
        setSelectedTeamId(dState.undrawn_teams[0].id);
      }
    } catch (err) {
      console.error("Error loading ceremony state:", err);
    } finally {
      setIsLoading(false);
    }
  }, [tournamentId, selectedTeamId]);

  useEffect(() => {
    loadData();

    // Auto-refresh state every 3 seconds for broadcast sync
    const interval = setInterval(loadData, 3000);
    return () => clearInterval(interval);
  }, [loadData]);

  // Handle SPIN Ceremony Action
  const handleSpinCeremony = async () => {
    if (!selectedTeamId || isSpinning) return;

    setIsSpinning(true);
    setRevealedResult(null);
    setHighlightGroup(null);

    try {
      // 1. Execute Atomic Draw on Database/Server First
      const result = await drawSingleTeam(tournamentId, selectedTeamId);

      // 2. Simulate Shimmer Spin Animation (1.5s for excitement)
      await new Promise((resolve) => setTimeout(resolve, 1200));

      // 3. Confirm Server Result & Set Reveal State
      setRevealedResult(result);
      const isA = result.group_name.includes("A");
      setHighlightGroup(isA ? "A" : "B");

      // 4. Trigger Celebration Confetti Effect
      triggerCeremonyConfetti();

      // 5. Reload DB State
      await loadData();
    } catch (err: any) {
      toast.error("Ceremony Error", err.message || "Could not execute draw.");
    } finally {
      setIsSpinning(false);
    }
  };

  const toggleFullscreen = () => {
    if (typeof window === "undefined") return;
    if (!document.fullscreenElement) {
      if (document.documentElement.requestFullscreen) {
        document.documentElement.requestFullscreen().catch(() => {});
      } else if ((document.documentElement as any).webkitRequestFullscreen) {
        (document.documentElement as any).webkitRequestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
      }
    }
  };

  if (isLoading || !drawState) {
    return (
      <div className="h-screen bg-[#234F2D] text-[#F8F7F1] flex items-center justify-center font-display text-2xl animate-pulse">
        Loading Official Ceremony Screen…
      </div>
    );
  }

  const selectedTeam = drawState.undrawn_teams.find((t) => t.id === selectedTeamId);
  const isCompleted =
    drawState.is_completed ||
    (drawState.all_teams.length > 0 && drawState.undrawn_teams.length === 0);

  return (
    <div className="h-screen bg-[#234F2D] text-[#F8F7F1] flex flex-col justify-between p-4 sm:p-6 lg:p-8 overflow-hidden select-none">
      {/* Top Ceremony Header */}
      <header className="border-b border-white/15 pb-4 flex flex-col sm:flex-row justify-between items-center gap-4 shrink-0">
        <div>
          <p className="text-xs uppercase tracking-widest text-[#A0AF2A] font-extrabold font-display">
            Young Lions Sports Club Oddamavadi
          </p>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold font-display tracking-tight text-white mt-0.5">
            {tournamentName}
          </h1>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={toggleFullscreen}
            className="bg-[#A0AF2A] hover:bg-[#b5c730] text-[#234F2D] font-extrabold px-4 py-1.5 rounded-full text-xs uppercase tracking-wider shadow-lg transition-transform active:scale-95 flex items-center gap-1.5 cursor-pointer"
          >
            🖥️ FULLSCREEN MODE
          </button>

          <div className="bg-[#E1B32C] text-[#234F2D] font-extrabold px-4 py-1.5 rounded-full text-xs uppercase tracking-wider shadow-lg">
            Official Team Draw
          </div>
          <div className="bg-black/30 border border-white/20 text-white font-bold px-4 py-1.5 rounded-full text-xs tracking-wider">
            {drawState.undrawn_teams.length} Undrawn Teams Remaining
          </div>
        </div>
      </header>

      {/* Main Ceremony Grid (3 Columns: Group A | Spin Wheel | Group B) */}
      <main className="grid grid-cols-1 lg:grid-cols-12 gap-6 my-auto items-stretch shrink-0">
        {/* GROUP A PANEL (Left) */}
        <div
          className={`lg:col-span-4 bg-[#F8F7F1] text-[#234F2D] rounded-2xl p-5 shadow-2xl flex flex-col justify-between transition-all duration-500 border-4 ${
            highlightGroup === "A"
              ? "border-[#E1B32C] ring-4 ring-[#E1B32C]/50 scale-[1.02]"
              : "border-transparent"
          }`}
        >
          <div>
            <div className="flex items-center justify-between border-b-2 border-[#234F2D]/15 pb-3 mb-4">
              <div>
                <h2 className="text-2xl lg:text-3xl font-extrabold font-display tracking-tight text-blue-950">
                  GROUP A
                </h2>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Official Roster
                </p>
              </div>
              <span className="bg-blue-900 text-white font-extrabold px-3 py-1 rounded-full text-xs font-display">
                {drawState.group_a_teams.length} / 4
              </span>
            </div>

            <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
              {drawState.group_a_teams.length === 0 ? (
                <div className="py-12 text-center text-xs font-semibold text-gray-400 border-2 border-dashed border-gray-300 rounded-xl">
                  Awaiting Group A Allocations…
                </div>
              ) : (
                drawState.group_a_teams.map((t, idx) => (
                  <div
                    key={t.id}
                    className="p-3 bg-white rounded-xl border border-gray-200 shadow-sm flex items-center justify-between transition-all hover:border-blue-500"
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-7 h-7 rounded-full bg-blue-100 text-blue-900 font-extrabold text-xs flex items-center justify-center font-display">
                        A{idx + 1}
                      </span>
                      <span className="font-extrabold text-sm text-gray-900 font-display">
                        {t.name}
                      </span>
                    </div>
                    <span className="text-xs font-bold text-gray-500 bg-gray-100 px-2 py-0.5 rounded font-display uppercase">
                      {t.short_name}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="pt-3 border-t border-gray-200 text-center">
            <span className="text-[10px] uppercase tracking-widest text-gray-400 font-bold font-display">
              Oddamavadi League Phase 1
            </span>
          </div>
        </div>

        {/* CENTER SPIN CONTROL & BALL REVEAL */}
        <div className="lg:col-span-4 flex flex-col items-center justify-center text-center space-y-6 px-2">
          {isCompleted ? (
            <div className="bg-[#A0AF2A]/20 border-2 border-[#A0AF2A] rounded-2xl p-6 text-center space-y-4 shadow-2xl">
              <div className="text-4xl">🏆</div>
              <div>
                <h3 className="text-2xl font-extrabold font-display text-[#E1B32C]">
                  DRAW CEREMONY COMPLETED!
                </h3>
                <p className="text-xs text-white/90 max-w-xs mx-auto mt-1">
                  All 8 teams have been officially allocated into Group A and Group B!
                </p>
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={async () => {
                    try {
                      await lockDraw(tournamentId, "Ceremony Admin");
                      toast.success(
                        "Groups Saved & Locked!",
                        "Teams successfully grouped and saved to Group A and Group B."
                      );
                      window.location.href = "/admin/groups";
                    } catch (err: any) {
                      toast.error("Lock Failed", err.message);
                    }
                  }}
                  className="bg-[#E1B32C] hover:bg-[#fcd34d] text-[#234F2D] font-extrabold px-6 py-3 rounded-xl text-sm uppercase tracking-wider shadow-xl transition-all transform active:scale-95 cursor-pointer font-display"
                >
                  🔒 LOCK & SAVE GROUPS
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* Undrawn Team Selection Indicator */}
              <div className="w-full max-w-xs space-y-2">
                <label className="block text-xs uppercase tracking-widest text-[#A0AF2A] font-extrabold font-display">
                  Current Selected Team
                </label>
                <select
                  value={selectedTeamId}
                  onChange={(e) => setSelectedTeamId(e.target.value)}
                  disabled={isSpinning}
                  className="w-full h-12 px-4 bg-black/40 border-2 border-[#E1B32C]/60 text-white rounded-xl text-sm font-extrabold font-display focus:outline-none focus:border-[#E1B32C] transition-all cursor-pointer"
                >
                  {drawState.undrawn_teams.map((t) => (
                    <option key={t.id} value={t.id} className="bg-[#234F2D] text-white">
                      {t.name} ({t.short_name})
                    </option>
                  ))}
                </select>
              </div>

              {/* Large Ceremonial Gold SPIN Action Button */}
              <button
                disabled={isSpinning || !selectedTeamId}
                onClick={handleSpinCeremony}
                className={`relative group w-44 h-44 sm:w-52 sm:h-52 rounded-full bg-gradient-to-br from-[#E1B32C] via-[#fcd34d] to-[#b45309] text-[#234F2D] shadow-[0_0_50px_rgba(225,179,44,0.5)] border-8 border-white/20 flex flex-col items-center justify-center transition-all duration-300 transform active:scale-95 focus:outline-none ${
                  isSpinning ? "animate-spin cursor-not-allowed" : "hover:scale-105 cursor-pointer"
                }`}
              >
                <span className="text-3xl sm:text-4xl mb-1">🎲</span>
                <span className="font-extrabold font-display text-lg sm:text-xl tracking-wider text-[#234F2D]">
                  {isSpinning ? "SPINNING…" : "SPIN DRAW"}
                </span>
                <span className="text-[10px] font-bold tracking-widest text-[#234F2D]/80 uppercase mt-0.5">
                  Allocate Group
                </span>
              </button>

              {/* Revealed Group Toast Indicator */}
              {revealedResult && (
                <div className="bg-[#E1B32C] text-[#234F2D] px-6 py-2.5 rounded-full font-extrabold font-display text-sm tracking-wider shadow-2xl animate-bounce">
                  ✨ {revealedResult.team_name} → {revealedResult.group_name}!
                </div>
              )}
            </>
          )}
        </div>

        {/* GROUP B PANEL (Right) */}
        <div
          className={`lg:col-span-4 bg-[#F8F7F1] text-[#234F2D] rounded-2xl p-5 shadow-2xl flex flex-col justify-between transition-all duration-500 border-4 ${
            highlightGroup === "B"
              ? "border-[#E1B32C] ring-4 ring-[#E1B32C]/50 scale-[1.02]"
              : "border-transparent"
          }`}
        >
          <div>
            <div className="flex items-center justify-between border-b-2 border-[#234F2D]/15 pb-3 mb-4">
              <div>
                <h2 className="text-2xl lg:text-3xl font-extrabold font-display tracking-tight text-amber-900">
                  GROUP B
                </h2>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Official Roster
                </p>
              </div>
              <span className="bg-amber-800 text-white font-extrabold px-3 py-1 rounded-full text-xs font-display">
                {drawState.group_b_teams.length} / 4
              </span>
            </div>

            <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
              {drawState.group_b_teams.length === 0 ? (
                <div className="py-12 text-center text-xs font-semibold text-gray-400 border-2 border-dashed border-gray-300 rounded-xl">
                  Awaiting Group B Allocations…
                </div>
              ) : (
                drawState.group_b_teams.map((t, idx) => (
                  <div
                    key={t.id}
                    className="p-3 bg-white rounded-xl border border-gray-200 shadow-sm flex items-center justify-between transition-all hover:border-amber-500"
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-7 h-7 rounded-full bg-amber-100 text-amber-900 font-extrabold text-xs flex items-center justify-center font-display">
                        B{idx + 1}
                      </span>
                      <span className="font-extrabold text-sm text-gray-900 font-display">
                        {t.name}
                      </span>
                    </div>
                    <span className="text-xs font-bold text-gray-500 bg-gray-100 px-2 py-0.5 rounded font-display uppercase">
                      {t.short_name}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="pt-3 border-t border-gray-200 text-center">
            <span className="text-[10px] uppercase tracking-widest text-gray-400 font-bold font-display">
              Oddamavadi League Phase 1
            </span>
          </div>
        </div>
      </main>

      {/* Bottom Live History Bar */}
      <footer className="border-t border-white/15 pt-3 flex items-center justify-between text-xs text-white/70 shrink-0 font-display">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#A0AF2A] animate-ping" />
          <span className="font-bold text-white uppercase tracking-wider">
            LIVE BROADCAST MODE
          </span>
        </div>

        <div className="hidden sm:block text-center text-white/60 text-[11px] tracking-wider uppercase">
          Server-Verified Atomic Allocation • Protected Against Duplicate Draws
        </div>

        <div>
          <span className="text-[#E1B32C] font-extrabold">
            {drawState.draw_records.length} / {drawState.all_teams.length || 8}
          </span>{" "}
          Teams Allocated
        </div>
      </footer>
    </div>
  );
}
