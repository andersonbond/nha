"use client";

import { useState } from "react";
import { Header } from "./Header";
import { Sidebar } from "./Sidebar";
import { Footer } from "./Footer";

export function AppShell({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const handleToggleCollapse = () => setSidebarCollapsed((c) => !c);

  return (
    <div className="flex min-h-screen flex-col">
      <Sidebar
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        collapsed={sidebarCollapsed}
        onToggleCollapse={handleToggleCollapse}
      />
      <div
        className={`flex flex-1 flex-col transition-[padding] duration-200 ${
          sidebarCollapsed ? "md:pl-0" : "md:pl-64"
        }`}
      >
        <Header
          onMenuClick={() => setSidebarOpen(true)}
          sidebarCollapsed={sidebarCollapsed}
          onExpandSidebar={() => setSidebarCollapsed(false)}
        />
        <main className="flex-1 px-4 py-6 md:px-6">
          {children}
        </main>
        <Footer />
      </div>
    </div>
  );
}
