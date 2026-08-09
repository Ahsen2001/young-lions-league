import PageContainer from "@/components/layout/PageContainer";
import { PageHeader } from "@/components/ui/PageHeader";
import { Table, TableHead, TableBody, TableRow, TableHeader, TableCell } from "@/components/ui/Table";
import { Badge } from "@/components/ui/Badge";

export const metadata = {
  title: "League Standings",
};

const standingsData = [
  { pos: 1, team: "Oddamavadi FC", p: 3, w: 3, d: 0, l: 0, gf: 8, ga: 2, gd: "+6", pts: 9 },
  { pos: 2, team: "Young Lions XI", p: 3, w: 2, d: 1, l: 0, gf: 6, ga: 3, gd: "+3", pts: 7 },
  { pos: 3, team: "Battu Strikers", p: 3, w: 0, d: 1, l: 2, gf: 2, ga: 6, gd: "-4", pts: 1 },
  { pos: 4, team: "Mavadi United", p: 3, w: 0, d: 0, l: 3, gf: 1, ga: 6, gd: "-5", pts: 0 },
];

export default function PublicStandingsPage() {
  return (
    <PageContainer>
      <PageHeader
        title="League Standings & Table"
        subtitle="Group A Official Rankings — Season 2025"
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Standings" },
        ]}
      />

      <Table>
        <TableHead>
          <TableRow>
            <TableHeader>Pos</TableHeader>
            <TableHeader>Team</TableHeader>
            <TableHeader align="center">P</TableHeader>
            <TableHeader align="center">W</TableHeader>
            <TableHeader align="center">D</TableHeader>
            <TableHeader align="center">L</TableHeader>
            <TableHeader align="center">GF</TableHeader>
            <TableHeader align="center">GA</TableHeader>
            <TableHeader align="center">GD</TableHeader>
            <TableHeader align="center">Pts</TableHeader>
          </TableRow>
        </TableHead>
        <TableBody>
          {standingsData.map((row) => (
            <TableRow key={row.team}>
              <TableCell muted>
                <Badge variant={row.pos <= 2 ? "primary" : "neutral"} size="sm">
                  {row.pos}
                </Badge>
              </TableCell>
              <TableCell>
                <span className="font-display font-bold text-sm text-[var(--color-primary)]">
                  {row.team}
                </span>
              </TableCell>
              <TableCell align="center">{row.p}</TableCell>
              <TableCell align="center">{row.w}</TableCell>
              <TableCell align="center">{row.d}</TableCell>
              <TableCell align="center">{row.l}</TableCell>
              <TableCell align="center">{row.gf}</TableCell>
              <TableCell align="center">{row.ga}</TableCell>
              <TableCell align="center">{row.gd}</TableCell>
              <TableCell align="center">
                <span className="font-display font-bold text-base text-[var(--color-primary)]">
                  {row.pts}
                </span>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </PageContainer>
  );
}
