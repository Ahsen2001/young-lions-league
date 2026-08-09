"use client";

import { useRouter } from "next/navigation";
import { useTournament } from "@/lib/context/TournamentContext";
import { PageHeader } from "@/components/ui/PageHeader";
import { Button } from "@/components/ui/Button";
import { Card, CardHeader, CardBody } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { toast } from "@/components/ui/Toast";

export default function AdminDrawPage() {
  const router = useRouter();
  const { currentTournament } = useTournament();

  const tournamentId = currentTournament?.id || "trn-2025-01";
  const tournamentName = currentTournament?.name || "Young Lions Champions Trophy 2024";

  const handleOpenProjectorMode = () => {
    if (!tournamentId) {
      toast.error("No Active Tournament", "Please select a tournament first.");
      return;
    }
    window.open(`/draw/${tournamentId}`, "_blank");
  };

  const handleStartLiveDraw = () => {
    if (!tournamentId) {
      toast.error("No Active Tournament", "Please select a tournament first.");
      return;
    }
    router.push(`/admin/tournaments/${tournamentId}/draw`);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Official Group Draw Ceremony"
        subtitle={`Perform live randomized group allocation with projector mode support • ${tournamentName}`}
        actions={
          <div className="flex gap-3">
            <Button variant="accent" size="sm" onClick={handleOpenProjectorMode}>
              📺 PROJECTOR MODE
            </Button>
            <Button variant="primary" size="sm" onClick={handleStartLiveDraw}>
              START LIVE DRAW
            </Button>
          </div>
        }
      />

      <Card padding="none">
        <CardHeader className="bg-[var(--color-primary)] text-white flex justify-between items-center">
          <span className="font-display font-bold text-base">Draw Pots Configuration</span>
          <Badge variant="accent" size="sm">
            8 TEAMS READY
          </Badge>
        </CardHeader>
        <CardBody className="space-y-4">
          <p className="text-sm text-[var(--color-text-muted)]">
            Teams will be drawn sequentially into Group A and Group B. Group allocations are enforced atomically server-side.
          </p>

          <div className="flex flex-wrap gap-4 pt-2">
            <Button variant="accent" onClick={handleStartLiveDraw}>
              🎲 Launch Admin Draw Control Center
            </Button>
            <Button variant="outline" onClick={handleOpenProjectorMode}>
              📺 Open Projector Ceremonial Screen
            </Button>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
