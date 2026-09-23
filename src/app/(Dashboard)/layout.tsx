
"use client";

import React, { useState, useEffect } from "react";
import DashboardSidebar from "../component/dashboardSidebar";
import { Menu, BookOpen, Sparkles } from "lucide-react";
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
  const user = session?.user as
    | { name?: string; email?: string; image?: string; role?: string }
    | undefined;
  const role = user?.role || "user";

  useEffect(() => {
    setSidebarOpen(false);
  }, [pathname]);

  return (
    <div className="flex h-screen w-full flex-col overflow-hidden bg-slate-50/60 md:flex-row">
      {/* Mobile Top Navigation Bar */}
      <header className="sticky top-0 z-30 flex h-16 w-full shrink-0 items-center justify-between border-b border-emerald-100/80 bg-white/90 px-4 backdrop-blur-xl shadow-xs md:hidden">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setSidebarOpen(true)}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200/80 bg-slate-50 text-slate-700 hover:bg-emerald-50 hover:text-emerald-700 transition active:scale-95"
            aria-label="Open navigation menu"
          >
            <Menu className="h-5 w-5" />
          </button>

          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-tr from-teal-600 via-emerald-500 to-emerald-400 text-white shadow-md shadow-emerald-500/20 ring-2 ring-emerald-50">
              <BookOpen className="h-4 w-4 stroke-[2.5]" />
            </div>
            <span className="flex items-center gap-1 text-base font-black tracking-tight text-slate-800">
              EduManage <Sparkles className="h-3 w-3 fill-emerald-500 text-emerald-500" />
            </span>
          </div>
        </div>

        {/* User Mini Profile */}
        <div className="flex items-center gap-2">
          <Chip
            size="sm"
            className="h-5 rounded-full border border-emerald-200/80 bg-emerald-50 px-2 text-[9px] font-extrabold uppercase tracking-wider text-emerald-700"
          >
            {role}
          </Chip>
          <Avatar className="h-8 w-8 rounded-full ring-2 ring-emerald-500/30">
            {user?.image && <AvatarImage src={user.image} alt={user?.name || "User"} />}
            <AvatarFallback className="rounded-full bg-emerald-600 text-xs font-bold text-white">
              {user?.name?.charAt(0).toUpperCase() || "U"}
            </AvatarFallback>
          </Avatar>
        </div>
      </header>

      {/* Backdrop for mobile drawer */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-xs transition-opacity md:hidden"
          aria-hidden="true"
        />
      )}

      {/* Sidebar Container - Sticky / Fixed height on desktop */}
      <div className="shrink-0 md:h-screen md:sticky md:top-0">
        <DashboardSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      </div>

      {/* Main Content Area - Only this scrolls vertically */}
      <main className="flex-1 min-w-0 max-w-full h-[calc(100vh-4rem)] md:h-screen overflow-y-auto overflow-x-hidden p-3 sm:p-5 md:p-6 lg:p-8 text-slate-800">
        {children}
      </main>
    </div>
  );
}





