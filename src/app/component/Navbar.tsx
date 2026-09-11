
// "use client";

// import React, { useState } from "react";
// import Link from "next/link";
// import { usePathname, useRouter } from "next/navigation";
// import { Spinner, Avatar, AvatarImage, AvatarFallback } from "@heroui/react";
// import { Shield, BookOpen } from "lucide-react";
// import { signOut, useSession } from "../lib/auth-client";

// const baseNavItems = [
//   { label: "Home", href: "/" },
//   { label: "About", href: "/about" },
//   { label: "Notice", href: "/notice" },
//   { label: "Blog", href: "/blog" },
//   { label: "Chat", href: "/chat" },
//   { label: "Contact", href: "/contact" },
// ];

// const dashboardLinks: Record<string, string> = {
//   student: "/student",
//   teacher: "/teacher",
//   admin: "/admin",
// };

// export default function Navbar() {
//   const [isMenuOpen, setIsMenuOpen] = useState(false);
//   const pathname = usePathname();
//   const router = useRouter();

//   const { data: session, isPending } = useSession();
//   const user = session?.user as { 
//     name?: string; 
//     email?: string; 
//     image?: string; 
//     role?: string 
//   } | undefined;
//   const isAuthenticated = !!user;

//   const userRole = user?.role || "student";
//   const dashboardHref = dashboardLinks[userRole] || "/student";

//   const navItems = isAuthenticated
//     ? [...baseNavItems, { label: "Dashboard", href: dashboardHref }]
//     : baseNavItems;

//   const handleLogout = async () => {
//     setIsMenuOpen(false);
//     await signOut({
//       fetchOptions: {
//         onSuccess: () => {
//           router.push("/");
//         },
//       },
//     });
//     router.push("/");
//   };

//   const userInitial = user?.name?.charAt(0).toUpperCase() || 
//                       user?.email?.charAt(0).toUpperCase() || "U";

//   return (
//     <header className="sticky top-0 z-50 w-full bg-[#03204c] text-white border-b border-blue-900/40 shadow-md">
//       <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        
//         {/* Left Section: Brand Logo */}
//         <Link href="/" className="flex items-center gap-2.5 focus:outline-none">
//           <div className="relative flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-b from-blue-400 to-blue-600 text-white shadow-sm">
//             <Shield className="h-8 w-8 text-blue-400 fill-blue-500 absolute" />
//             <BookOpen className="h-4 w-4 text-white relative z-10 stroke-[2.5]" />
//           </div>
//           <div className="flex flex-col">
//             <span className="text-xl font-bold leading-none tracking-tight text-white">
//               EduManage
//             </span>
//             <span className="text-[10px] font-medium leading-tight text-blue-200/80">
//               School Management Platform
//             </span>
//           </div>
//         </Link>

//         {/* Middle Section: Desktop Navigation */}
//         <nav className="hidden items-center gap-8 lg:flex">
//           {navItems.map((item) => {
//             const isActive = pathname === item.href;
//             return (
//               <Link
//                 key={item.href}
//                 href={item.href}
//                 className={`relative py-1 text-sm font-semibold transition-colors duration-200 ${
//                   isActive
//                     ? "text-white"
//                     : "text-blue-100/80 hover:text-white"
//                 }`}
//               >
//                 {item.label}
//                 {isActive && (
//                   <span className="absolute bottom-0 left-0 h-[2px] w-full rounded-full bg-blue-400" />
//                 )}
//               </Link>
//             );
//           })}
//         </nav>

//         {/* Right Section */}
//         <div className="flex items-center gap-3">
//           {/* Desktop Right Actions */}
//           <div className="hidden lg:flex items-center gap-3">
//             {isPending ? (
//               <div className="flex h-9 w-9 items-center justify-center text-white">
//                 <Spinner size="sm" color="current" />
//               </div>
//             ) : isAuthenticated && user ? (
//               <div className="flex items-center gap-3">
//                 <Link href={`/${user?.role}`} className="flex items-center gap-2 rounded-lg p-1 transition-colors hover:bg-blue-900/50">
//                   <Avatar className="h-8 w-8 ring-2 ring-blue-400/50" size="sm">
//                     {user.image && <AvatarImage src={user.image} alt={user.name || "User"} />}
//                     <AvatarFallback className="bg-blue-900 text-xs font-semibold text-white">
//                       {userInitial}
//                     </AvatarFallback>
//                   </Avatar>
//                   <span className="text-sm font-semibold text-white">
//                     {user.name || user.email?.split("@")[0] || "User"}
//                   </span>
//                 </Link>

//                 <button
//                   type="button"
//                   onClick={handleLogout}
//                   className="flex h-9 items-center justify-center rounded-lg border border-rose-400/30 bg-rose-500/20 px-4 text-sm font-semibold text-rose-200 hover:bg-rose-500/30 transition-colors"
//                 >
//                   Logout
//                 </button>
//               </div>
//             ) : (
//               <Link
//                 href="/auth/Login"
//                 className="flex h-9 items-center justify-center rounded-lg bg-white px-5 text-sm font-semibold text-[#03204c] shadow transition-transform hover:bg-blue-50 active:scale-95"
//               >
//                 Login
//               </Link>
//             )}
//           </div>

//           {/* Mobile Right Toggle Menu Button */}
//           <button
//             type="button"
//             aria-label={isMenuOpen ? "Close menu" : "Open menu"}
//             className="flex h-10 w-10 items-center justify-center rounded-lg border border-blue-700/50 bg-blue-900/40 text-blue-200 hover:bg-blue-800/60 lg:hidden"
//             onClick={() => setIsMenuOpen(!isMenuOpen)}
//           >
//             <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               {isMenuOpen ? (
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
//               ) : (
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
//               )}
//             </svg>
//           </button>
//         </div>
//       </div>

//       {/* Mobile Drawer */}
//       {isMenuOpen && (
//         <div className="border-t border-blue-900/60 bg-[#021838] px-4 pb-6 pt-4 lg:hidden">
//           <nav className="flex flex-col gap-2">
//             {navItems.map((item) => {
//               const isActive = pathname === item.href;
//               return (
//                 <Link
//                   key={item.href}
//                   href={item.href}
//                   className={`flex h-10 items-center rounded-lg px-4 text-sm font-semibold transition-colors ${
//                     isActive
//                       ? "bg-blue-900/60 text-blue-400"
//                       : "text-blue-100 hover:bg-blue-900/30"
//                   }`}
//                   onClick={() => setIsMenuOpen(false)}
//                 >
//                   {item.label}
//                 </Link>
//               );
//             })}

//             <div className="my-2 border-t border-blue-900/60" />

//             {/* Mobile Auth Options */}
//             {isAuthenticated ? (
//               <div className="flex flex-col gap-2">
//                 <div className="flex items-center gap-3 px-4 py-2">
//                   <Avatar size="sm" className="h-8 w-8">
//                     {user?.image && <AvatarImage src={user.image} alt={user.name || "User"} />}
//                     <AvatarFallback className="bg-blue-900 text-xs font-semibold text-white">
//                       {userInitial}
//                     </AvatarFallback>
//                   </Avatar>
//                   <div className="flex flex-col truncate">
//                     <span className="text-sm font-semibold text-white">{user?.name || "User"}</span>
//                     <span className="truncate text-xs text-blue-200/70">{user?.email}</span>
//                   </div>
//                 </div>

//                 <button
//                   type="button"
//                   className="mt-1 flex h-10 w-full items-center justify-center rounded-lg border border-rose-500/40 bg-rose-500/20 text-sm font-semibold text-rose-200 hover:bg-rose-500/30"
//                   onClick={handleLogout}
//                 >
//                   Logout
//                 </button>
//               </div>
//             ) : (
//               <div className="pt-1">
//                 <Link
//                   href="/auth/Login"
//                   className="flex h-10 w-full items-center justify-center rounded-lg bg-white text-sm font-semibold text-[#03204c]"
//                   onClick={() => setIsMenuOpen(false)}
//                 >
//                   Login
//                 </Link>
//               </div>
//             )}
//           </nav>
//         </div>
//       )}
//     </header>
//   );
// }



"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Spinner, Avatar, AvatarImage, AvatarFallback } from "@heroui/react";
import { BookOpen, LogOut, Menu, X, ArrowRight, ShieldCheck, Sparkles } from "lucide-react";
import { signOut, useSession } from "../lib/auth-client";

const baseNavItems = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Notice", href: "/notice" },
  { label: "Blog", href: "/blog" },
  { label: "Chat", href: "/chat" },
  { label: "Contact", href: "/contact" },
];

const dashboardLinks: Record<string, string> = {
  student: "/student",
  teacher: "/teacher",
  admin: "/admin",
};

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const { data: session, isPending } = useSession();
  const user = session?.user as { 
    name?: string; 
    email?: string; 
    image?: string; 
    role?: string 
  } | undefined;
  const isAuthenticated = !!user;

  const userRole = user?.role || "student";
  const dashboardHref = dashboardLinks[userRole] || "/student";

  const navItems = isAuthenticated
    ? [...baseNavItems, { label: "Dashboard", href: dashboardHref }]
    : baseNavItems;

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 15);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = async () => {
    setIsMenuOpen(false);
    await signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push("/");
        },
      },
    });
    router.push("/");
  };

  const userInitial = user?.name?.charAt(0).toUpperCase() || 
                      user?.email?.charAt(0).toUpperCase() || "U";

  return (
    <header className="fixed top-0 left-0 right-0 z-50 pt-4 transition-all duration-300">
      <div 
        className={`container mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8 rounded-full transition-all duration-300 border ${
          scrolled 
            ? "bg-white/85 backdrop-blur-xl border-white/80 shadow-lg shadow-teal-900/5" 
            : "bg-white/70 backdrop-blur-md border-white/60 shadow-sm"
        }`}
      >
        {/* Brand Logo */}
        <Link href="/" className="group flex items-center gap-3 focus:outline-none">
          <div className="relative flex h-10 w-10 items-center justify-center rounded-xl text-emerald-600">
            <BookOpen className="h-6 w-6 stroke-[2.2]" />
            <Sparkles className="absolute -top-1 -left-1 h-3.5 w-3.5 text-emerald-500 fill-emerald-500" />
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-extrabold tracking-tight text-slate-900 leading-tight">
              Edu<span className="text-emerald-500">Manage</span>
            </span>
            <span className="text-[10px] font-semibold tracking-wider text-slate-600">
              Enterprise
            </span>
          </div>
        </Link>

        {/* Center Navigation Links */}
        <nav className="hidden items-center gap-6 lg:flex">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`text-sm font-medium transition-colors duration-200 ${
                  isActive
                    ? "text-emerald-600 font-semibold"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Right Action Section */}
        <div className="flex items-center gap-3">
          <div className="hidden lg:flex items-center gap-3">
            {isPending ? (
              <div className="flex h-9 w-9 items-center justify-center text-emerald-500">
                <Spinner size="sm" color="current" />
              </div>
            ) : isAuthenticated && user ? (
              <div className="flex items-center gap-3">
                {/* User Avatar Circle */}
                <Link href={dashboardHref}>
                  <Avatar className="h-9 w-9 cursor-pointer transition-transform hover:scale-105">
                    {user.image && <AvatarImage src={user.image} alt={user.name || "User"} />}
                    <AvatarFallback className="bg-[#8C7A70] text-sm font-bold text-white">
                      {userInitial}
                    </AvatarFallback>
                  </Avatar>
                </Link>

                {/* Logout Button */}
                <button
                  type="button"
                  onClick={handleLogout}
                  className="flex items-center gap-2 rounded-full bg-white/80 border border-slate-200/80 px-4 py-1.5 text-sm font-semibold text-slate-700 shadow-xs transition-all hover:bg-slate-100 hover:text-slate-900"
                >
                  <span>Logout</span>
                  <LogOut className="h-4 w-4 text-slate-600" />
                </button>
              </div>
            ) : (
              <Link
                href="/auth/Login"
                className="group inline-flex items-center gap-2 rounded-full bg-emerald-500 px-6 py-2 text-sm font-bold text-white shadow-md shadow-emerald-500/20 transition-all hover:bg-emerald-600 active:scale-95"
              >
                <span>Login</span>
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            type="button"
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white/70 text-slate-800 hover:bg-white lg:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {isMenuOpen && (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 mt-2">
          <div className="rounded-3xl border border-white/80 bg-white/95 p-5 backdrop-blur-2xl shadow-xl lg:hidden">
            <nav className="flex flex-col gap-2">
              {navItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex h-11 items-center justify-between rounded-full px-5 text-sm font-semibold transition-all ${
                      isActive
                        ? "bg-emerald-500 text-white font-bold shadow-md shadow-emerald-500/20"
                        : "text-slate-700 hover:bg-slate-100"
                    }`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <span>{item.label}</span>
                    {isActive && <ShieldCheck className="h-4 w-4 text-white" />}
                  </Link>
                );
              })}

              <div className="my-2 border-t border-slate-200" />

              {isAuthenticated ? (
                <div className="flex flex-col gap-3 pt-1">
                  <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-3">
                    <Avatar className="h-10 w-10">
                      {user?.image && <AvatarImage src={user.image} alt={user.name || "User"} />}
                      <AvatarFallback className="bg-[#8C7A70] text-sm font-bold text-white">
                        {userInitial}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col truncate">
                      <span className="text-sm font-bold text-slate-900">{user?.name || "User"}</span>
                      <span className="truncate text-xs text-slate-500">{user?.email}</span>
                    </div>
                  </div>

                  <button
                    type="button"
                    className="flex h-11 w-full items-center justify-center gap-2 rounded-full border border-slate-200 bg-white text-sm font-bold text-slate-700 hover:bg-slate-50 transition-all"
                    onClick={handleLogout}
                  >
                    <span>Logout</span>
                    <LogOut className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <Link
                  href="/auth/Login"
                  className="flex h-11 w-full items-center justify-center gap-2 rounded-full bg-emerald-500 text-sm font-bold text-white shadow-md hover:bg-emerald-600 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <span>Login</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
              )}
            </nav>
          </div>
        </div>
      )}
    </header>
  );
}







