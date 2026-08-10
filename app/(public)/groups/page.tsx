"use client";

import { useState, useEffect } from "react";
import PageContainer from "@/components/layout/PageContainer";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card, CardHeader, CardBody } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { SkeletonGrid } from "@/components/ui/Skeleton";
import { fetchDrawState, type DrawState } from "@/lib/services/draw.service";

export default function PublicGroupsPage() {
  const [drawState, setDrawState] = useState<DrawState | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadPublicGroups() {
      try {
        const state = await fetchDrawState("trn-2025-01");
        setDrawState(state);
      } catch (err) {
        console.error("Error loading public groups:", err);
      } finally {
        setIsLoading(false);
      }
    }
    loadPublicGroups();
  }, []);

  if (isLoading || !drawState) {
    return (
      <PageContainer>
        <div className="space-y-6">
          <div className="animate-pulse h-12 bg-[var(--color-bg-card)] rounded-[var(--radius-md)] w-64" />
          <SkeletonGrid columns={2} />
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <PageHeader
        title="Official Group Stage Draw Allocations"
        subtitle="Group A and Group B rosters determined by server-verified atomic draw engine"
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Groups" },
        ]}
      />

      <div className="grid sm:grid-cols-2 gap-6">
        {/* GROUP A */}
        <Card padding="none" className="border-t-4 border-t-blue-600">
          <CardHeader className="bg-blue-900 text-white flex items-center justify-between">
            <span className="font-display text-lg font-bold">GROUP A</span>
            <Badge variant="primary" size="sm">
              {drawState.group_a_teams.length} / 4 Teams
            </Badge>
          </CardHeader>
          <CardBody className="p-0 divide-y divide-[var(--color-border)]">
            {drawState.group_a_teams.length === 0 ? (
              <div className="p-6 text-center text-xs text-[var(--color-text-muted)]">
                Awaiting official Group A draw allocations…
              </div>
            ) : (
              drawState.group_a_teams.map((team, idx) => (
                <div key={team.id} className="px-4 py-3 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="w-7 h-7 rounded-full bg-blue-100 text-blue-900 font-display text-xs font-bold flex items-center justify-center">
                      A{idx + 1}
                    </span>
                    <span className="font-display font-semibold text-sm text-[var(--color-text)]">
                      {team.name}
                    </span>
                  </div>
                  <Badge variant="neutral" size="sm">
                    {team.short_name}
                  </Badge>
                </div>
              ))
            )}
          </CardBody>
        </Card>

        {/* GROUP B */}
        <Card padding="none" className="border-t-4 border-t-amber-600">
          <CardHeader className="bg-amber-900 text-white flex items-center justify-between">
            <span className="font-display text-lg font-bold">GROUP B</span>
            <Badge variant="accent" size="sm">
              {drawState.group_b_teams.length} / 4 Teams
            </Badge>
          </CardHeader>
          <CardBody className="p-0 divide-y divide-[var(--color-border)]">
            {drawState.group_b_teams.length === 0 ? (
              <div className="p-6 text-center text-xs text-[var(--color-text-muted)]">
                Awaiting official Group B draw allocations…
              </div>
            ) : (
              drawState.group_b_teams.map((team, idx) => (
                <div key={team.id} className="px-4 py-3 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="w-7 h-7 rounded-full bg-amber-100 text-amber-900 font-display text-xs font-bold flex items-center justify-center">
                      B{idx + 1}
                    </span>
                    <span className="font-display font-semibold text-sm text-[var(--color-text)]">
                      {team.name}
                    </span>
                  </div>
                  <Badge variant="neutral" size="sm">
                    {team.short_name}
                  </Badge>
                </div>
              ))
            )}
          </CardBody>
        </Card>
      </div>
    </PageContainer>
  );
}
