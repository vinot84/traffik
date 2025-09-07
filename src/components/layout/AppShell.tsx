import { Outlet } from 'react-router-dom';

export function AppShell() {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded bg-primary" />
            <span className="font-semibold">Traafik</span>
          </div>
          <div className="text-sm text-muted-foreground">
            Welcome to Traafik
          </div>
        </div>
      </header>
      <main className="container py-8">
        <Outlet />
      </main>
    </div>
  );
}