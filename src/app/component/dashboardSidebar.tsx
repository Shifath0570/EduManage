
"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Avatar, AvatarImage, AvatarFallback, Chip, Button, Spinner } from "@heroui/react";
import {
  Home,
  BookOpen,
  Plus,
  Bookmark,
  Compass,
  Clock,
  User,
  LayoutDashboard,
  CreditCard,
  LogOut,
  GraduationCap,
} from "lucide-react";

import { useSession, signOut } from "../lib/auth-client";

export interface NavItem {
  id: string;
  href: string;
  label: string;
  icon: React.ReactNode;
}

type UserRole = "student" | "teacher" | "admin";

const teacherNavItems: NavItem[] = [
  { id: "overview", href: "/teacher", label: "Overview", icon: <Home className="w-5 h-5" /> },
  { id: "assigned-classes", href: "/teacher/assigned_classes", label: "Assigned Classes", icon: <BookOpen className="w-5 h-5" /> },
  { id: "assigned-subjects", href: "/teacher/assigned_subjects", label: "Assigned Subjects", icon: <Plus className="w-5 h-5" /> },
  { id: "students", href: "/teacher/students", label: "Students", icon: <Bookmark className="w-5 h-5" /> },
  { id: "attendance", href: "/teacher/attendance", label: "Attendance History", icon: <Compass className="w-5 h-5" /> },
];

const studentNavItems: NavItem[] = [
  { id: "overview", href: "/student", label: "Overview", icon: <Home className="w-5 h-5" /> },
  { id: "class-info", href: "/student/class_information", label: "Class Info", icon: <Clock className="w-5 h-5" /> },
  { id: "subjects", href: "/student/subjects", label: "Enrolled Subjects", icon: <BookOpen className="w-5 h-5" /> },
  { id: "profile", href: "/student/profile", label: "Profile Management", icon: <User className="w-5 h-5" /> },
  { id: "attendance", href: "/student/attendance", label: "Attendance Record", icon: <Bookmark className="w-5 h-5" /> },
];

const adminNavItems: NavItem[] = [
  { id: "home", href: "/admin", label: "Dashboard Home", icon: <LayoutDashboard className="w-5 h-5" /> },
  { id: "manage-students", href: "/admin/manage_students", label: "Manage Students", icon: <User className="w-5 h-5" /> },
  { id: "manage-teachers", href: "/admin/manage_teachers", label: "Manage Teachers", icon: <BookOpen className="w-5 h-5" /> },
  { id: "manage-subjects", href: "/admin/manage_subjects", label: "Manage Subjects", icon: <CreditCard className="w-5 h-5" /> },
];

const navLinkMap: Record<UserRole, NavItem[]> = {
  student: studentNavItems,
  teacher: teacherNavItems,
  admin: adminNavItems,
};

// Professional palette: semi-transparent backgrounds with matching text and subtle borders
const roleStyleMap: Record<UserRole, string> = {
  admin: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  teacher: "bg-indigo-500/10 text-indigo-400 border-indigo-500/20",
  student: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
};

export default function DashboardSidebar() {
  const pathname = usePathname();
  const { data: session, isPending } = useSession();
  const user = session?.user as { name?: string; email?: string; image?: string; role?: UserRole } | undefined;

  const currentRole: UserRole = (user?.role && user.role in navLinkMap) ? user.role : "student";
  const navItems = navLinkMap[currentRole];

  const handleLogout = async () => {
    await signOut();
  };

  return (
    <aside className="flex h-screen w-64 flex-col border-r border-slate-800 bg-slate-950 text-slate-200">
      {/* Sidebar Header / Brand */}
      <div className="flex h-16 items-center gap-3 px-6 border-b border-slate-800/80">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-cyan-400 text-white shadow-md shadow-indigo-500/20">
          <GraduationCap className="h-5 w-5" />
        </div>
        <div className="flex flex-col">
          <span className="text-base font-bold tracking-tight text-slate-100">
            Edu<span className="text-cyan-400">Manage</span>
          </span>
          <span className="text-[10px] uppercase font-semibold text-slate-400">Portal</span>
        </div>
      </div>

      {/* User Info Card */}
      <div className="p-4">
        {isPending ? (
          <div className="flex h-16 items-center justify-center rounded-xl bg-slate-900/60 border border-slate-800/60">
            <Spinner size="sm" color="accent" />
          </div>
        ) : (
          <div className="flex items-center gap-3 rounded-xl border border-slate-800/60 bg-slate-900/40 p-3 backdrop-blur-md">
            <Avatar className="h-10 w-10 ring-2 ring-cyan-400/40 shrink-0">
              {user?.image && <AvatarImage src={user.image} alt={user?.name || "User"} />}
              <AvatarFallback className="bg-slate-800 text-slate-200 text-xs font-semibold">
                {user?.name?.charAt(0).toUpperCase() || "U"}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col min-w-0 flex-1">
              <span className="truncate text-sm font-semibold text-slate-200">
                {user?.name || "User"}
              </span>
              <div className="mt-1">
                <Chip
                  size="sm"
                  variant="soft"
                  className={`h-5 capitalize text-[10px] font-semibold px-2 border ${roleStyleMap[currentRole]}`}
                >
                  {currentRole}
                </Chip>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Divider replacement using standard border */}
      <hr className="my-1 border-t border-slate-800/80" />

      {/* Navigation Section */}
      <nav className="flex-1 space-y-1.5 overflow-y-auto px-3 py-2">
        <div className="px-3 pb-2 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
          Main Menu
        </div>
        {navItems.map((item) => {
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.id}
              href={item.href}
              className={`flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-all duration-200 ${
                isActive
                  ? "border border-indigo-500/30 bg-indigo-600/15 text-cyan-400 shadow-sm"
                  : "text-slate-400 hover:bg-slate-900/80 hover:text-slate-100"
              }`}
            >
              <span className={isActive ? "text-cyan-400" : "text-slate-400"}>
                {item.icon}
              </span>
              <span className="truncate">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Sidebar Footer */}
      <div className="border-t border-slate-800/80 p-3">
        <Button
          fullWidth
          variant="danger-soft"
          className="flex gap-2 justify-start border border-rose-500/20 text-rose-400 hover:bg-rose-900/50 hover:text-rose-200"
          onPress={handleLogout}
        >
          <LogOut className="h-4 w-4" />
          Sign Out
        </Button>
      </div>
    </aside>
  );
}


