import PublicNav from "@/components/layout/PublicNav";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <PublicNav />
      <main className="flex-1 page-enter">{children}</main>
      <footer className="border-t border-[var(--color-border)] bg-[var(--color-primary)] text-[var(--color-text-inverse)]">
        <div className="mx-auto max-w-7xl px-[var(--spacing-page-x)] py-8 text-center">
          <p className="font-display text-sm tracking-widest uppercase opacity-80">
            Young Lions Sports Club · Oddamavadi
          </p>
        </div>
      </footer>
    </>
  );
}
