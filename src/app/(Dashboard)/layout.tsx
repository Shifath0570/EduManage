"use client";

import React, { useState, useEffect } from "react";
import DashboardSidebar from "../component/dashboardSidebar";
import { Menu, Shield, BookOpen } from "lucide-react";
import { usePathname } from "next/navigation";
import { useSession } from "../lib/auth-client";
import { Avatar, AvatarImage, AvatarFallback, Chip } from "@heroui/react";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();
  const { data: session } = useSession();
  const user = session?.user as { name?: string; email?: string; image?: string; role?: string } | undefined;
  const role = user?.role || "user";

  // Auto-close sidebar on mobile route change
  useEffect(() => {
    setSidebarOpen(false);
  }, [pathname]);

  return (
    <div className="flex min-h-screen w-full flex-col md:flex-row overflow-x-hidden bg-slate-50">
      {/* Mobile Top Navigation Bar */}
      <header className="flex h-16 w-full items-center justify-between border-b border-slate-200 bg-white px-4 md:hidden sticky top-0 z-30 shadow-xs">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setSidebarOpen(true)}
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100 transition active:scale-95"
            aria-label="Open navigation menu"
          >
            <Menu className="h-5 w-5" />
          </button>

          <div className="flex items-center gap-2">
            <div className="relative flex h-8 w-8 items-center justify-center rounded-lg bg-[#03204c] text-white shadow-xs">
              <Shield className="absolute h-5 w-5 fill-blue-500 text-blue-400" />
              <BookOpen className="relative z-10 h-3 w-3 stroke-[2.5] text-white" />
            </div>
            <span className="text-base font-bold tracking-tight text-[#03204c]">
              EduManage
            </span>
          </div>
        </div>

        {/* User Mini Profile */}
        <div className="flex items-center gap-2">
          <Chip
            size="sm"
            className="h-5 border px-2 text-[10px] font-bold capitalize bg-slate-100 text-slate-700 border-slate-200"
          >
            {role}
          </Chip>
          <Avatar className="h-8 w-8 ring-2 ring-[#03204c]/20">
            {user?.image && <AvatarImage src={user.image} alt={user?.name || "User"} />}
            <AvatarFallback className="bg-[#03204c] text-xs font-semibold text-white">
              {user?.name?.charAt(0).toUpperCase() || "U"}
            </AvatarFallback>
          </Avatar>
        </div>
      </header>

      {/* Backdrop for mobile drawer */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-xs transition-opacity md:hidden"
          aria-hidden="true"
        />
      )}

      {/* Sidebar (Responsive: drawer on mobile, static on md+) */}
      <DashboardSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main Content Area */}
      <main className="flex-1 min-w-0 max-w-full overflow-y-auto overflow-x-hidden p-3 sm:p-5 md:p-6 lg:p-8 text-slate-800">
        {children}
      </main>
    </div>
  );
}
