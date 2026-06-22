"use client";

import { useState } from "react";
import { Sidebar } from "./Sidebar";
import { TopBar } from "./TopBar";

interface PageShellProps {
  children: React.ReactNode;
}

export function PageShell({ children }: PageShellProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-dvh overflow-x-hidden bg-surface-base text-text-primary lg:h-screen lg:overflow-hidden">
      <Sidebar className="hidden lg:flex" />

      {sidebarOpen && (
        <button
          type="button"
          aria-label="Close navigation"
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <Sidebar
        className={`flex transition-transform duration-200 lg:hidden ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
        onNavigate={() => setSidebarOpen(false)}
      />

      <div className="flex min-h-dvh w-full min-w-0 flex-col lg:ml-60 lg:h-screen lg:min-h-0 lg:w-[calc(100%-15rem)]">
        <TopBar onMenuClick={() => setSidebarOpen(true)} />
        <main className="min-w-0 flex-1 overflow-x-hidden overflow-y-auto lg:overflow-x-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
