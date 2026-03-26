interface MainLayoutProps {
  header: React.ReactNode;
  sidebar?: React.ReactNode;
  children: React.ReactNode;
}

export function MainLayout({ header, sidebar, children }: MainLayoutProps) {
  return (
    <div className="flex h-full" style={{ background: "var(--surface-0)" }}>
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {header}
        {children}
      </main>
      {sidebar}
    </div>
  );
}
