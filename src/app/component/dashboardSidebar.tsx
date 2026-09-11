
// "use client";

// import React from "react";
// import Link from "next/link";
// import { usePathname } from "next/navigation";
// import { Avatar, AvatarImage, AvatarFallback, Chip, Button, Spinner } from "@heroui/react";
// import {
//   LayoutDashboard,
//   Users,
//   UserCheck,
//   ClipboardList,
//   FileCheck,
//   FileSpreadsheet,
//   GraduationCap,
//   Award,
//   Megaphone,
//   UserPlus,
//   UserCheck2,
//   ListOrdered,
//   CreditCard,
//   BookOpen,
//   Shield,
//   LogOut,
//   X,
// } from "lucide-react";
// import { signOut, useSession } from "../lib/auth-client";

// export interface NavItem {
//   id: string;
//   href: string;
//   label: string;
//   icon: React.ReactNode;
// }

// export type UserRole = "teacher" | "admin" | "student";

// const teacherNavItems: NavItem[] = [
//   { id: "overview", href: "/teacher", label: "Overview", icon: <LayoutDashboard className="w-5 h-5" /> },
//   { id: "takeAttendance", href: "/teacher/takeAttendance", label: "Take Attendance", icon: <UserCheck className="w-5 h-5" /> },
//   { id: "viewAttendance", href: "/teacher/viewAttendance", label: "View Attendance", icon: <ClipboardList className="w-5 h-5" /> },
//   { id: "createExam", href: "/teacher/createExam", label: "Create Exam", icon: <GraduationCap className="w-5 h-5" /> },
//   { id: "allExams", href: "/teacher/allExams", label: "All Exam List", icon: <ListOrdered className="w-5 h-5" /> },
//   { id: "enterMarks", href: "/teacher/enterMarks", label: "Enter Marks", icon: <FileSpreadsheet className="w-5 h-5" /> },
//   { id: "viewResuls", href: "/teacher/viewResuls", label: "View Results", icon: <Award className="w-5 h-5" /> },
//   { id: "teacherSalary", href: "/teacher/teacherSalary", label: "Teacher Salary", icon: <CreditCard className="w-5 h-5" /> },
// ];

// const adminNavItems: NavItem[] = [
//   { id: "overview", href: "/admin", label: "Overview", icon: <LayoutDashboard className="w-5 h-5" /> },
//   { id: "createStudent", href: "/admin/createStudent/student", label: "Create Student", icon: <UserPlus className="w-5 h-5" /> },
//   { id: "createTeacher", href: "/admin/createTeacher/teacher", label: "Create Teacher", icon: <UserCheck2 className="w-5 h-5" /> },
//   { id: "manageTeachers", href: "/admin/manageTeachers", label: "Manage Teachers", icon: <Users className="w-5 h-5" /> },
//   { id: "manageStudents", href: "/admin/manageStudents", label: "Manage Students", icon: <Users className="w-5 h-5" /> },
//   { id: "viewAttendance", href: "/admin/viewAttendance", label: "View Attendance", icon: <ClipboardList className="w-5 h-5" /> },
//   { id: "createExam", href: "/admin/createExam", label: "Create Exam", icon: <GraduationCap className="w-5 h-5" /> },
//   { id: "allExams", href: "/admin/allExams", label: "All Exam List", icon: <ListOrdered className="w-5 h-5" /> },
//   { id: "viewNotice", href: "/admin/viewNotice", label: "Notice", icon: <Megaphone className="w-5 h-5" /> },
//   { id: "feeCollection", href: "/admin/feeCollection", label: "Fee Collection", icon: <CreditCard className="w-5 h-5" /> },
//   { id: "teacherSalary", href: "/admin/teacherSalary", label: "Teacher Salary", icon: <CreditCard className="w-5 h-5" /> },
// ];

// const studentNavItems: NavItem[] = [
//   { id: "overview", href: "/student", label: "Overview", icon: <LayoutDashboard className="w-5 h-5" /> },
//   { id: "viewAttendance", href: "/student/viewAttendance", label: "View Attendance", icon: <ClipboardList className="w-5 h-5" /> },
//   { id: "viewResuls", href: "/student/viewResuls", label: "View Results", icon: <Award className="w-5 h-5" /> },
//   { id: "feeCollection", href: "/student/feeCollection", label: "Fee Collection", icon: <CreditCard className="w-5 h-5" /> },
// ];

// const navLinkMap: Record<UserRole, NavItem[]> = {
//   teacher: teacherNavItems,
//   admin: adminNavItems,
//   student: studentNavItems,
// };

// const roleStyleMap: Record<UserRole, string> = {
//   admin: "bg-purple-100 text-purple-700 border-purple-200",
//   teacher: "bg-blue-100 text-blue-700 border-blue-200",
//   student: "bg-emerald-100 text-emerald-700 border-emerald-200",
// };

// interface DashboardSidebarProps {
//   isOpen?: boolean;
//   onClose?: () => void;
// }

// export default function DashboardSidebar({ isOpen, onClose }: DashboardSidebarProps) {
//   const pathname = usePathname();
//   const { data: session, isPending } = useSession();
//   const user = session?.user as { name?: string; email?: string; image?: string; role?: UserRole } | undefined;

//   const currentRole: UserRole = user?.role === "admin" ? "admin" : user?.role === "student" ? "student" : "teacher";
//   const navItems = navLinkMap[currentRole] || [];

//   const handleLogout = async () => {
//     await signOut();
//   };

//   const content = (
//     <div className="flex h-full w-full flex-col bg-white text-slate-800">
//       {/* Sidebar Header / Brand */}
//       <div className="flex h-16 items-center justify-between border-b border-slate-100 px-6">
//         <div className="flex items-center gap-3">
//           <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-[#03204c] text-white shadow-md">
//             <Shield className="absolute h-7 w-7 fill-blue-500 text-blue-400" />
//             <BookOpen className="relative z-10 h-4 w-4 stroke-[2.5] text-white" />
//           </div>
//           <div className="flex flex-col">
//             <span className="text-base font-bold tracking-tight text-[#03204c]">
//               EduManage
//             </span>
//             <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
//               Portal
//             </span>
//           </div>
//         </div>

//         {/* Mobile Close Button */}
//         {onClose && (
//           <button
//             onClick={onClose}
//             className="md:hidden p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
//             aria-label="Close Sidebar"
//           >
//             <X className="h-5 w-5" />
//           </button>
//         )}
//       </div>

//       {/* User Info Card */}
//       <div className="p-4">
//         {isPending ? (
//           <div className="flex h-16 items-center justify-center rounded-xl border border-slate-200 bg-slate-50">
//             <Spinner size="sm" color="accent" />
//           </div>
//         ) : (
//           <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50/70 p-3 shadow-xs">
//             <Avatar className="h-10 w-10 shrink-0 ring-2 ring-[#03204c]/20">
//               {user?.image && <AvatarImage src={user.image} alt={user?.name || "User"} />}
//               <AvatarFallback className="bg-[#03204c] text-xs font-semibold text-white">
//                 {user?.name?.charAt(0).toUpperCase() || "U"}
//               </AvatarFallback>
//             </Avatar>
//             <div className="flex min-w-0 flex-1 flex-col">
//               <span className="truncate text-sm font-semibold text-slate-900">
//                 {user?.name || "User"}
//               </span>
//               <div className="mt-1">
//                 <Chip
//                   size="sm"
//                   className={`h-5 border px-2 text-[10px] font-bold capitalize ${roleStyleMap[currentRole] || "border-slate-200 bg-slate-100 text-slate-700"}`}
//                 >
//                   {currentRole}
//                 </Chip>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>

//       {/* Section Divider */}
//       <hr className="my-1 border-t border-slate-100" />

//       {/* Navigation Section */}
//       <nav className="flex-1 space-y-1.5 overflow-y-auto px-3 py-2">
//         <div className="px-3 pb-2 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
//           Main Menu
//         </div>
//         {navItems.map((item) => {
//           const isActive = pathname === item.href;

//           return (
//             <Link
//               key={item.id}
//               href={item.href}
//               onClick={() => {
//                 if (onClose) onClose();
//               }}
//               className={`flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-all duration-200 ${
//                 isActive
//                   ? "border border-[#03204c]/20 bg-[#03204c]/10 font-semibold text-[#03204c] shadow-xs"
//                   : "text-slate-600 hover:bg-slate-100/80 hover:text-slate-900"
//               }`}
//             >
//               <span className={isActive ? "text-[#03204c]" : "text-slate-400"}>
//                 {item.icon}
//               </span>
//               <span className="truncate">{item.label}</span>
//             </Link>
//           );
//         })}
//       </nav>

//       {/* Sidebar Footer */}
//       <div className="border-t border-slate-100 p-3">
//         <Button
//           fullWidth
//           className="flex justify-start gap-2 border border-rose-200 bg-rose-50 font-medium text-rose-600 hover:bg-rose-100 hover:text-rose-700"
//           onPress={handleLogout}
//         >
//           <LogOut className="h-4 w-4" />
//           Sign Out
//         </Button>
//       </div>
//     </div>
//   );

//   return (
//     <>
//       {/* Desktop Persistent Sidebar */}
//       <aside className="hidden md:flex h-screen w-64 shrink-0 sticky top-0 flex-col border-r border-slate-200 bg-white shadow-sm z-20">
//         {content}
//       </aside>

//       {/* Mobile Drawer (Slide-in) */}
//       <div
//         className={`fixed inset-y-0 left-0 z-50 w-72 max-w-[85vw] transform bg-white shadow-2xl transition-transform duration-300 ease-in-out md:hidden ${
//           isOpen ? "translate-x-0" : "-translate-x-full"
//         }`}
//       >
//         {content}
//       </div>
//     </>
//   );
// }

"use client";

import React from "react";
import Link from "next/link";
import { redirect, usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { Avatar, AvatarImage, AvatarFallback, Chip, Button, Spinner } from "@heroui/react";
import {
  LayoutDashboard,
  Users,
  UserCheck,
  ClipboardList,
  FileSpreadsheet,
  GraduationCap,
  Award,
  Megaphone,
  UserPlus,
  UserCheck2,
  ListOrdered,
  CreditCard,
  BookOpen,
  LogOut,
  X,
  Sparkles,
} from "lucide-react";
import { signOut, useSession } from "../lib/auth-client";

export interface NavItem {
  id: string;
  href: string;
  label: string;
  icon: React.ReactNode;
}

export type UserRole = "teacher" | "admin" | "student";

const teacherNavItems: NavItem[] = [
  { id: "overview", href: "/teacher", label: "Overview", icon: <LayoutDashboard className="w-4 h-4" /> },
  { id: "takeAttendance", href: "/teacher/takeAttendance", label: "Take Attendance", icon: <UserCheck className="w-4 h-4" /> },
  { id: "viewAttendance", href: "/teacher/viewAttendance", label: "View Attendance", icon: <ClipboardList className="w-4 h-4" /> },
  { id: "createExam", href: "/teacher/createExam", label: "Create Exam", icon: <GraduationCap className="w-4 h-4" /> },
  { id: "allExams", href: "/teacher/allExams", label: "All Exam List", icon: <ListOrdered className="w-4 h-4" /> },
  { id: "enterMarks", href: "/teacher/enterMarks", label: "Enter Marks", icon: <FileSpreadsheet className="w-4 h-4" /> },
  { id: "viewResuls", href: "/teacher/viewResuls", label: "View Results", icon: <Award className="w-4 h-4" /> },
  { id: "teacherSalary", href: "/teacher/teacherSalary", label: "Teacher Salary", icon: <CreditCard className="w-4 h-4" /> },
];

const adminNavItems: NavItem[] = [
  { id: "overview", href: "/admin", label: "Overview", icon: <LayoutDashboard className="w-4 h-4" /> },
  { id: "createStudent", href: "/admin/createStudent/student", label: "Create Student", icon: <UserPlus className="w-4 h-4" /> },
  { id: "createTeacher", href: "/admin/createTeacher/teacher", label: "Create Teacher", icon: <UserCheck2 className="w-4 h-4" /> },
  { id: "manageTeachers", href: "/admin/manageTeachers", label: "Manage Teachers", icon: <Users className="w-4 h-4" /> },
  { id: "manageStudents", href: "/admin/manageStudents", label: "Manage Students", icon: <Users className="w-4 h-4" /> },
  { id: "viewAttendance", href: "/admin/viewAttendance", label: "View Attendance", icon: <ClipboardList className="w-4 h-4" /> },
  { id: "createExam", href: "/admin/createExam", label: "Create Exam", icon: <GraduationCap className="w-4 h-4" /> },
  { id: "allExams", href: "/admin/allExams", label: "All Exam List", icon: <ListOrdered className="w-4 h-4" /> },
  { id: "viewNotice", href: "/admin/viewNotice", label: "Notice", icon: <Megaphone className="w-4 h-4" /> },
  { id: "feeCollection", href: "/admin/feeCollection", label: "Fee Collection", icon: <CreditCard className="w-4 h-4" /> },
  { id: "teacherSalary", href: "/admin/teacherSalary", label: "Teacher Salary", icon: <CreditCard className="w-4 h-4" /> },
];

const studentNavItems: NavItem[] = [
  { id: "overview", href: "/student", label: "Overview", icon: <LayoutDashboard className="w-4 h-4" /> },
  { id: "viewAttendance", href: "/student/viewAttendance", label: "View Attendance", icon: <ClipboardList className="w-4 h-4" /> },
  { id: "viewResuls", href: "/student/viewResuls", label: "View Results", icon: <Award className="w-4 h-4" /> },
  { id: "feeCollection", href: "/student/feeCollection", label: "Fee Collection", icon: <CreditCard className="w-4 h-4" /> },
];

const navLinkMap: Record<UserRole, NavItem[]> = {
  teacher: teacherNavItems,
  admin: adminNavItems,
  student: studentNavItems,
};

const roleStyleMap: Record<UserRole, string> = {
  admin: "bg-purple-50 text-purple-700 border-purple-200/80",
  teacher: "bg-teal-50 text-teal-700 border-teal-200/80",
  student: "bg-emerald-50 text-emerald-700 border-emerald-200/80",
};

interface DashboardSidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export default function DashboardSidebar({ isOpen, onClose }: DashboardSidebarProps) {
  const pathname = usePathname();
  const { data: session, isPending } = useSession();
  const user = session?.user as { name?: string; email?: string; image?: string; role?: UserRole } | undefined;

  const currentRole: UserRole = user?.role === "admin" ? "admin" : user?.role === "student" ? "student" : "teacher";
  const navItems = navLinkMap[currentRole] || [];

  const handleLogout = async () => {
    await signOut();
    redirect('/')
  };

  const content = (
    <div className="flex h-full w-full flex-col bg-slate-50/80 p-3 sm:p-4 backdrop-blur-2xl">
      {/* Outer Floating Rounded Wrapper */}
      <div className="relative flex h-full w-full flex-col overflow-hidden rounded-[2.5rem] border border-emerald-100/80 bg-white/90 shadow-xl shadow-emerald-950/5">

        {/* Subtle Ambient Background Gradients */}
        <div className="pointer-events-none absolute -top-16 -left-16 h-48 w-48 rounded-full bg-emerald-200/30 blur-2xl" />
        <div className="pointer-events-none absolute -bottom-16 -right-16 h-48 w-48 rounded-full bg-teal-200/30 blur-2xl" />

        {/* Brand Header */}
        <div className="relative z-10 flex h-20 items-center justify-between border-b border-slate-100 px-6">
          <Link
            href="/"
            onClick={() => onClose && onClose()}
            className="group flex items-center gap-3 transition-transform hover:scale-[1.02] active:scale-[0.98]"
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-tr from-teal-600 via-emerald-500 to-emerald-400 text-white shadow-md shadow-emerald-500/20 ring-4 ring-emerald-50 transition-shadow group-hover:shadow-lg group-hover:shadow-emerald-500/30">
              <BookOpen className="h-5 w-5 stroke-[2.5]" />
            </div>
            <div className="flex flex-col">
              <span className="flex items-center gap-1 text-base font-black tracking-tight text-slate-800 transition-colors group-hover:text-emerald-700">
                EduManage <Sparkles className="h-3.5 w-3.5 fill-emerald-500 text-emerald-500" />
              </span>
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-emerald-600">
                PLATFORM
              </span>
            </div>
          </Link>


          {/* Mobile Close Button */}
          {onClose && (
            <button
              onClick={onClose}
              className="rounded-full p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700 md:hidden"
              aria-label="Close Sidebar"
            >
              <X className="h-5 w-5" />
            </button>
          )}
        </div>

        {/* User Profile Card */}
        <div className="relative z-10 p-4">
          {isPending ? (
            <div className="flex h-16 items-center justify-center rounded-full border border-slate-100 bg-slate-50/80">
              <Spinner size="sm" color="success" />
            </div>
          ) : (
            <div className="flex items-center gap-3 rounded-full border border-slate-200/60 bg-gradient-to-r from-slate-50/90 to-emerald-50/40 p-2.5 pr-4 shadow-xs">
              <Avatar className="h-10 w-10 shrink-0 rounded-full ring-2 ring-emerald-500/30">
                {user?.image && <AvatarImage src={user.image} alt={user?.name || "User"} />}
                <AvatarFallback className="rounded-full bg-emerald-600 text-xs font-bold text-white">
                  {user?.name?.charAt(0).toUpperCase() || "U"}
                </AvatarFallback>
              </Avatar>

              <div className="flex min-w-0 flex-1 flex-col">
                <span className="truncate text-xs font-extrabold text-slate-800">
                  {user?.name || "User Account"}
                </span>
                <div className="mt-0.5">
                  <Chip
                    size="sm"
                    className={`h-4.5 rounded-full border px-2 text-[9px] font-extrabold uppercase tracking-wider ${roleStyleMap[currentRole] || "border-slate-200 bg-slate-100 text-slate-600"
                      }`}
                  >
                    {currentRole}
                  </Chip>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Navigation Menu */}
        <nav className="relative z-10 flex-1 space-y-1.5 overflow-y-auto px-3 py-2 scrollbar-none">
          <div className="px-4 pb-2 text-[10px] font-extrabold uppercase tracking-widest text-slate-400">
            Quick Navigation
          </div>

          {navItems.map((item) => {
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.id}
                href={item.href}
                onClick={() => {
                  if (onClose) onClose();
                }}
                className={`group flex items-center gap-3.5 rounded-full px-4 py-2.5 text-sm font-semibold transition-all duration-200 ${isActive
                  ? "bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-lg shadow-emerald-500/25 ring-2 ring-emerald-500/20 scale-[1.01]"
                  : "text-slate-600 hover:bg-emerald-50/60 hover:text-slate-900"
                  }`}
              >
                <div
                  className={`flex h-8 w-8 items-center justify-center rounded-full transition-colors ${isActive
                    ? "bg-white/20 text-white"
                    : "bg-slate-100 text-slate-500 group-hover:bg-white group-hover:text-emerald-600 group-hover:shadow-xs"
                    }`}
                >
                  {item.icon}
                </div>
                <span className="truncate">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Sign Out Section */}
        <div className="relative z-10 border-t border-slate-100 bg-slate-50/50 p-4">
          <Button
            fullWidth
            className="group flex items-center justify-center gap-2 rounded-full border border-rose-200/80 bg-rose-50/80 text-xs font-bold text-rose-600 shadow-xs transition-all duration-200 hover:bg-rose-600 hover:text-white active:scale-[0.98]"
            onPress={handleLogout}
          >
            <LogOut className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
            <span>Sign Out</span>
          </Button>
        </div>

      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Persistent Sidebar */}
      <aside className="sticky top-0 z-20 hidden h-screen w-72 shrink-0 flex-col md:flex">
        {content}
      </aside>

      {/* Mobile Drawer */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-80 max-w-[85vw] transform transition-transform duration-300 ease-in-out md:hidden ${isOpen ? "translate-x-0" : "-translate-x-full"
          }`}
      >
        {content}
      </div>
    </>
  );
}
