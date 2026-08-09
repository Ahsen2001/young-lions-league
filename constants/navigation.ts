export interface NavItem {
  label: string;
  href: string;
  /** Emoji or SVG icon identifier for admin sidebar */
  icon?: string;
}

/** Public-facing navigation items */
export const PUBLIC_NAV_ITEMS: NavItem[] = [
  { label: "Home",       href: "/" },
  { label: "Tournament", href: "/tournament" },
  { label: "Teams",      href: "/teams" },
  { label: "Groups",     href: "/groups" },
  { label: "Fixtures",   href: "/fixtures" },
  { label: "Results",    href: "/results" },
  { label: "Standings",  href: "/standings" },
  { label: "Knockout",   href: "/knockout" },
];

/** Admin navigation items */
export const ADMIN_NAV_ITEMS: NavItem[] = [
  { label: "Dashboard",   href: "/admin",              icon: "⊞" },
  { label: "Tournaments", href: "/admin/tournaments",  icon: "🏆" },
  { label: "Teams",       href: "/admin/teams",        icon: "👥" },
  { label: "Draw",        href: "/admin/draw",         icon: "🎲" },
  { label: "Groups",      href: "/admin/groups",       icon: "⬡" },
  { label: "Fixtures",    href: "/admin/fixtures",     icon: "📅" },
  { label: "Matches",     href: "/admin/matches",      icon: "⚽" },
  { label: "Standings",   href: "/admin/standings",    icon: "📊" },
  { label: "Knockout",    href: "/admin/knockout",     icon: "🥊" },
  { label: "Venues",      href: "/admin/venues",       icon: "📍" },
  { label: "Settings",    href: "/admin/settings",     icon: "⚙" },
];

/** Path to human readable label lookup */
export const ROUTE_LABELS: Record<string, string> = {
  admin: "Admin Dashboard",
  tournaments: "Tournaments",
  teams: "Teams",
  draw: "Tournament Draw",
  groups: "Group Stage",
  fixtures: "Fixtures",
  matches: "Match Management",
  standings: "Standings & Table",
  knockout: "Knockout Stage",
  venues: "Venues & Grounds",
  settings: "Settings",
  tournament: "Tournament Info",
  results: "Match Results",
};
