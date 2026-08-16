
import React from "react";
import DashboardSidebar from "../component/dashboardSidebar";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="flex h-screen w-full overflow-hidden bg-slate-50">
      <DashboardSidebar />
      <main className="flex-1 overflow-y-auto p-6 text-slate-800">
        {children}
      </main>
    </div>
  );
}


