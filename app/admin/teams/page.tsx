import { PageHeader } from "@/components/ui/PageHeader";
import { Button } from "@/components/ui/Button";
import { Table, TableHead, TableBody, TableRow, TableHeader, TableCell } from "@/components/ui/Table";
import { Badge } from "@/components/ui/Badge";

export const metadata = {
  title: "Teams Management",
};

export default function AdminTeamsPage() {
  return (
    <div>
      <PageHeader
        title="Teams Management"
        subtitle="Manage participating clubs, rosters, and group allocations"
        actions={<Button size="sm">+ Register New Team</Button>}
      />

      <Table>
        <TableHead>
          <TableRow>
            <TableHeader>#</TableHeader>
            <TableHeader>Team Name</TableHeader>
            <TableHeader>Manager</TableHeader>
            <TableHeader align="center">Group</TableHeader>
            <TableHeader align="center">Status</TableHeader>
            <TableHeader align="right">Actions</TableHeader>
          </TableRow>
        </TableHead>
        <TableBody>
          <TableRow>
            <TableCell muted>1</TableCell>
            <TableCell>
              <span className="font-display font-bold text-sm text-[var(--color-primary)]">
                Oddamavadi FC
              </span>
            </TableCell>
            <TableCell>A. Rahman</TableCell>
            <TableCell align="center">
              <Badge variant="neutral" size="sm">Group A</Badge>
            </TableCell>
            <TableCell align="center">
              <Badge variant="success" size="sm">Registered</Badge>
            </TableCell>
            <TableCell align="right">
              <Button variant="ghost" size="sm">Edit</Button>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  );
}
