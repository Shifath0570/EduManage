
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
  Shield,
  LucideScrollText,
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
  { id: "manage-notices", href: "/teacher/notices", label: "Manage Notices", icon: <LucideScrollText className="w-5 h-5" /> },
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

// Refined Light Theme Role Badges
const roleStyleMap: Record<UserRole, string> = {
  admin: "bg-purple-100 text-purple-700 border-purple-200",
  teacher: "bg-blue-100 text-blue-700 border-blue-200",
  student: "bg-[#03204c]/10 text-[#03204c] border-[#03204c]/20",
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
    <aside className="flex h-screen w-64 flex-col border-r border-slate-200 bg-white text-slate-800 shadow-sm">
      {/* Sidebar Header / Brand */}
      <div className="flex h-16 items-center gap-3 px-6 border-b border-slate-100">
        <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-[#03204c] text-white shadow-md">
          <Shield className="h-7 w-7 text-blue-400 fill-blue-500 absolute" />
          <BookOpen className="h-4 w-4 text-white relative z-10 stroke-[2.5]" />
        </div>
        <div className="flex flex-col">
          <span className="text-base font-bold tracking-tight text-[#03204c]">
            EduManage
          </span>
          <span className="text-[10px] uppercase font-semibold text-slate-400 tracking-wider">
            Portal
          </span>
        </div>
      </div>

      {/* User Info Card */}
      <div className="p-4">
        {isPending ? (
          <div className="flex h-16 items-center justify-center rounded-xl bg-slate-50 border border-slate-200">
            <Spinner size="sm" color="accent" />
          </div>
        ) : (
          <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50/70 p-3 shadow-xs">
            <Avatar className="h-10 w-10 ring-2 ring-[#03204c]/20 shrink-0">
              {user?.image && <AvatarImage src={user.image} alt={user?.name || "User"} />}
              <AvatarFallback className="bg-[#03204c] text-white text-xs font-semibold">
                {user?.name?.charAt(0).toUpperCase() || "U"}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col min-w-0 flex-1">
              <span className="truncate text-sm font-semibold text-slate-900">
                {user?.name || "User"}
              </span>
              <div className="mt-1">
                <Chip
                  size="sm"
                  variant="soft"
                  className={`h-5 capitalize text-[10px] font-bold px-2 border ${roleStyleMap[currentRole]}`}
                >
                  {currentRole}
                </Chip>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Section Divider */}
      <hr className="my-1 border-t border-slate-100" />

      {/* Navigation Section */}
      <nav className="flex-1 space-y-1.5 overflow-y-auto px-3 py-2">
        <div className="px-3 pb-2 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
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
                  ? "border border-[#03204c]/20 bg-[#03204c]/10 text-[#03204c] shadow-xs font-semibold"
                  : "text-slate-600 hover:bg-slate-100/80 hover:text-slate-900"
              }`}
            >
              <span className={isActive ? "text-[#03204c]" : "text-slate-400"}>
                {item.icon}
              </span>
              <span className="truncate">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Sidebar Footer */}
      <div className="border-t border-slate-100 p-3">
        <Button
          fullWidth
          variant="danger-soft"
          className="flex gap-2 justify-start border border-rose-200 bg-rose-50 text-rose-600 hover:bg-rose-100 hover:text-rose-700 font-medium"
          onPress={handleLogout}
        >
          <LogOut className="h-4 w-4" />
          Sign Out
        </Button>
      </div>
    </aside>
  );
}


