import AdminSidebar from "@/components/layout/AdminSidebar";
import AdminHeader from "@/components/layout/AdminHeader";
import AdminMobileNav from "@/components/layout/AdminMobileNav";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-[var(--color-bg)]">
      {/* Mobile Top Bar & Drawer */}
      <AdminMobileNav />

      {/* Desktop Collapsible Sidebar */}
      <AdminSidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Desktop Header with Breadcrumbs & Profile */}
        <AdminHeader />

        {/* Page Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 page-enter">{children}</main>
      </div>
    </div>
  );
}
