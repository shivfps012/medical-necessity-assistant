import { Sidebar } from "./Sidebar";
import { TopBar } from "./TopBar";

interface PageShellProps {
  children: React.ReactNode;
}

export function PageShell({ children }: PageShellProps) {
  return (
    <div className="flex h-screen bg-surface-base text-text-primary overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col ml-60 min-w-0">
        <TopBar />
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}