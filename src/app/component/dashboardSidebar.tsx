// "use client";

// import React from "react";
// import Link from "next/link";
// import { usePathname } from "next/navigation";
// import { Avatar, AvatarImage, AvatarFallback, Chip, Button, Spinner } from "@heroui/react";
// import {
//   Home,
//   BookOpen,
//   Plus,
//   Bookmark,
//   Compass,
//   Clock,
//   User,
//   Shield,
//   SquarePlus,
//   PencilLine,
//   Eye,
//   LogOut,
//   X,
// } from "lucide-react";
// import { signOut, useSession } from "../lib/auth-client";
// import { LuNotebook } from "react-icons/lu";
// import { RiAddCircleLine } from "react-icons/ri";

// export interface NavItem {
//   id: string;
//   href: string;
//   label: string;
//   icon: React.ReactNode;
// }

// export type UserRole = "teacher" | "admin" | "student";

// const teacherNavItems: NavItem[] = [
//   { id: "overview", href: "/teacher", label: "Overview", icon: <Home className="w-5 h-5" /> },
//   { id: "manageStudents", href: "/teacher/manageStudents", label: "Manage Students", icon: <Clock className="w-5 h-5" /> },
//   { id: "takeAttendance", href: "/teacher/takeAttendance", label: "Take Attendance", icon: <BookOpen className="w-5 h-5" /> },
//   { id: "viewAttendance", href: "/teacher/viewAttendance", label: "View Attendance", icon: <User className="w-5 h-5" /> },
//   { id: "createAssingment", href: "/teacher/createAssingment", label: "Create Assingment", icon: <Bookmark className="w-5 h-5" /> },
//   { id: "createExam", href: "/teacher/createExam", label: "Create Exam", icon: <SquarePlus className="w-5 h-5" /> },  
//   { id: "enterMarks", href: "/teacher/enterMarks", label: "Enter Marks", icon: <PencilLine className="w-5 h-5" /> }, 
//   { id: "viewResuls", href: "/teacher/viewResuls", label: "View Resuls", icon: <Bookmark className="w-5 h-5" /> },
//   { id: "viewNotice", href: "/teacher/viewNotice", label: "View Notice", icon: <LuNotebook className="w-5 h-5" /> },
// ];

// const adminNavItems: NavItem[] = [
//   { id: "overview", href: "/admin", label: "Overview", icon: <Home className="w-5 h-5" /> },
//   { id: "createStudent", href: "/admin/createStudent", label: "Create Student", icon: <BookOpen className="w-5 h-5" /> },
//   { id: "createTeacher", href: "/admin/createTeacher/teacher", label: "Create Teacher", icon: <BookOpen className="w-5 h-5" /> },
//   { id: "manageTeachers", href: "/admin/manageTeachers", label: "Manage Teachers", icon: <Plus className="w-5 h-5" /> },
//   { id: "manageStudents", href: "/admin/manageStudents", label: "Manage Students", icon: <Bookmark className="w-5 h-5" /> },
//   { id: "viewAttendance", href: "/admin/viewAttendance", label: "View Attendance", icon: <Compass className="w-5 h-5" /> },
//   { id: "createExam", href: "/admin/createExam", label: "Create Exam", icon: <SquarePlus className="w-5 h-5" /> },
//   { id: "allExams", href: "/admin/allExams", label: "All Exam List", icon: <BookOpen className="w-5 h-5" /> },
//   { id: "enterMarks", href: "/admin/enterMarks", label: "Enter Marks", icon: <Compass className="w-5 h-5" /> },
//   { id: "viewResult", href: "/admin/viewResult", label: "View Result", icon: <Eye className="w-5 h-5" /> },  
//   { id: "createNotice", href: "/admin/createNotice", label: "Create Notice", icon: <Compass className="w-5 h-5" /> },
//   { id: "viewNotice", href: "/admin/viewNotice", label: "Notice", icon: <LuNotebook className="w-5 h-5" /> },
//   {id: "feeCollection", href: "/admin/feeCollection", label: "Fee Collection", icon: <RiAddCircleLine className="w-5 h-5" />},
// ];

// const studentNavItems: NavItem[] = [
//   { id: "overview", href: "/student", label: "Overview", icon: <Home className="w-5 h-5" /> },
//   { id: "viewAttendance", href: "/student/viewAttendance", label: "View Attendance", icon: <User className="w-5 h-5" /> },
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
import { usePathname } from "next/navigation";
import { Avatar, AvatarImage, AvatarFallback, Chip, Button, Spinner } from "@heroui/react";
import {
  LayoutDashboard,
  Users,
  UserCheck,
  ClipboardList,
  FileCheck,
  FileSpreadsheet,
  GraduationCap,
  Award,
  Megaphone,
  UserPlus,
  UserCheck2,
  ListOrdered,
  CreditCard,
  BookOpen,
  Shield,
  LogOut,
  X,
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
  { id: "overview", href: "/teacher", label: "Overview", icon: <LayoutDashboard className="w-5 h-5" /> },
  { id: "takeAttendance", href: "/teacher/takeAttendance", label: "Take Attendance", icon: <UserCheck className="w-5 h-5" /> },
  { id: "viewAttendance", href: "/teacher/viewAttendance", label: "View Attendance", icon: <ClipboardList className="w-5 h-5" /> },
  { id: "createExam", href: "/teacher/createExam", label: "Create Exam", icon: <GraduationCap className="w-5 h-5" /> },  
  { id: "enterMarks", href: "/teacher/enterMarks", label: "Enter Marks", icon: <FileSpreadsheet className="w-5 h-5" /> }, 
  { id: "viewResuls", href: "/teacher/viewResuls", label: "View Results", icon: <Award className="w-5 h-5" /> },
  { id: "viewNotice", href: "/teacher/viewNotice", label: "View Notice", icon: <Megaphone className="w-5 h-5" /> },
];

const adminNavItems: NavItem[] = [
  { id: "overview", href: "/admin", label: "Overview", icon: <LayoutDashboard className="w-5 h-5" /> },
  { id: "createStudent", href: "/admin/createStudent", label: "Create Student", icon: <UserPlus className="w-5 h-5" /> },
  { id: "createTeacher", href: "/admin/createTeacher/teacher", label: "Create Teacher", icon: <UserCheck2 className="w-5 h-5" /> },
  { id: "manageTeachers", href: "/admin/manageTeachers", label: "Manage Teachers", icon: <Users className="w-5 h-5" /> },
  { id: "manageStudents", href: "/admin/manageStudents", label: "Manage Students", icon: <Users className="w-5 h-5" /> },
  { id: "viewAttendance", href: "/admin/viewAttendance", label: "View Attendance", icon: <ClipboardList className="w-5 h-5" /> },
  { id: "createExam", href: "/admin/createExam", label: "Create Exam", icon: <GraduationCap className="w-5 h-5" /> },
  { id: "allExams", href: "/admin/allExams", label: "All Exam List", icon: <ListOrdered className="w-5 h-5" /> },
  { id: "enterMarks", href: "/admin/enterMarks", label: "Enter Marks", icon: <FileSpreadsheet className="w-5 h-5" /> },
  { id: "viewResult", href: "/admin/viewResult", label: "View Result", icon: <Award className="w-5 h-5" /> },  
  { id: "viewNotice", href: "/admin/viewNotice", label: "Notice", icon: <Megaphone className="w-5 h-5" /> },
  { id: "feeCollection", href: "/admin/feeCollection", label: "Fee Collection", icon: <CreditCard className="w-5 h-5" /> },
];

const studentNavItems: NavItem[] = [
  { id: "overview", href: "/student", label: "Overview", icon: <LayoutDashboard className="w-5 h-5" /> },
  { id: "viewAttendance", href: "/student/viewAttendance", label: "View Attendance", icon: <ClipboardList className="w-5 h-5" /> },
];

const navLinkMap: Record<UserRole, NavItem[]> = {
  teacher: teacherNavItems,
  admin: adminNavItems,
  student: studentNavItems,
};

const roleStyleMap: Record<UserRole, string> = {
  admin: "bg-purple-100 text-purple-700 border-purple-200",
  teacher: "bg-blue-100 text-blue-700 border-blue-200",
  student: "bg-emerald-100 text-emerald-700 border-emerald-200",
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
  };

  const content = (
    <div className="flex h-full w-full flex-col bg-white text-slate-800">
      {/* Sidebar Header / Brand */}
      <div className="flex h-16 items-center justify-between border-b border-slate-100 px-6">
        <div className="flex items-center gap-3">
          <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-[#03204c] text-white shadow-md">
            <Shield className="absolute h-7 w-7 fill-blue-500 text-blue-400" />
            <BookOpen className="relative z-10 h-4 w-4 stroke-[2.5] text-white" />
          </div>
          <div className="flex flex-col">
            <span className="text-base font-bold tracking-tight text-[#03204c]">
              EduManage
            </span>
            <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
              Portal
            </span>
          </div>
        </div>

        {/* Mobile Close Button */}
        {onClose && (
          <button
            onClick={onClose}
            className="md:hidden p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
            aria-label="Close Sidebar"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      {/* User Info Card */}
      <div className="p-4">
        {isPending ? (
          <div className="flex h-16 items-center justify-center rounded-xl border border-slate-200 bg-slate-50">
            <Spinner size="sm" color="accent" />
          </div>
        ) : (
          <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50/70 p-3 shadow-xs">
            <Avatar className="h-10 w-10 shrink-0 ring-2 ring-[#03204c]/20">
              {user?.image && <AvatarImage src={user.image} alt={user?.name || "User"} />}
              <AvatarFallback className="bg-[#03204c] text-xs font-semibold text-white">
                {user?.name?.charAt(0).toUpperCase() || "U"}
              </AvatarFallback>
            </Avatar>
            <div className="flex min-w-0 flex-1 flex-col">
              <span className="truncate text-sm font-semibold text-slate-900">
                {user?.name || "User"}
              </span>
              <div className="mt-1">
                <Chip
                  size="sm"
                  className={`h-5 border px-2 text-[10px] font-bold capitalize ${roleStyleMap[currentRole] || "border-slate-200 bg-slate-100 text-slate-700"}`}
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
              onClick={() => {
                if (onClose) onClose();
              }}
              className={`flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-all duration-200 ${
                isActive
                  ? "border border-[#03204c]/20 bg-[#03204c]/10 font-semibold text-[#03204c] shadow-xs"
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
          className="flex justify-start gap-2 border border-rose-200 bg-rose-50 font-medium text-rose-600 hover:bg-rose-100 hover:text-rose-700"
          onPress={handleLogout}
        >
          <LogOut className="h-4 w-4" />
          Sign Out
        </Button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Persistent Sidebar */}
      <aside className="hidden md:flex h-screen w-64 shrink-0 sticky top-0 flex-col border-r border-slate-200 bg-white shadow-sm z-20">
        {content}
      </aside>

      {/* Mobile Drawer (Slide-in) */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-72 max-w-[85vw] transform bg-white shadow-2xl transition-transform duration-300 ease-in-out md:hidden ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {content}
      </div>
    </>
  );
}

