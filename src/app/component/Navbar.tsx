
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
//   const user = session?.user as { name?: string; email?: string; image?: string; role?: string } | undefined;
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

//   const userInitial = user?.name?.charAt(0).toUpperCase() || user?.email?.charAt(0).toUpperCase() || "U";

//   return (
//     <header className="sticky top-0 z-50 w-full bg-[#03204c] text-white border-b border-blue-900/40 shadow-md">
//       <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        
//         {/* Left Section: Mobile Toggle & Logo Branding */}
//         <div className="flex items-center gap-3">
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

//           {/* EduManage Brand Shield Logo */}
//           <Link href="/" className="flex items-center gap-2.5 focus:outline-none">
//             <div className="relative flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-b from-blue-400 to-blue-600 text-white shadow-sm">
//               <Shield className="h-8 w-8 text-blue-400 fill-blue-500 absolute" />
//               <BookOpen className="h-4 w-4 text-white relative z-10 stroke-[2.5]" />
//             </div>
//             <div className="flex flex-col">
//               <span className="text-xl font-bold leading-none tracking-tight text-white">
//                 EduManage
//               </span>
//               <span className="text-[10px] font-medium leading-tight text-blue-200/80">
//                 School Management Platform
//               </span>
//             </div>
//           </Link>
//         </div>

//         {/* Middle Section: Clean Desktop Navigation with Active Underline */}
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
//                 {/* Underline Indicator matching the image design */}
//                 {isActive && (
//                   <span className="absolute bottom-0 left-0 h-[2px] w-full rounded-full bg-blue-400" />
//                 )}
//               </Link>
//             );
//           })}
//         </nav>

//         {/* Right Section: Auth State / Actions */}
//         <div className="flex items-center gap-3">
//           {isPending ? (
//             <div className="flex h-9 w-9 items-center justify-center">
//               <Spinner size="sm" color="white" />
//             </div>
//           ) : isAuthenticated && user ? (
//             <div className="flex items-center gap-3">
//               <Link href="/profile" className="flex items-center gap-2 rounded-lg p-1 transition-colors hover:bg-blue-900/50">
//                 <Avatar className="h-8 w-8 ring-2 ring-blue-400/50" size="sm">
//                   {user.image && <AvatarImage src={user.image} alt={user.name || "User"} />}
//                   <AvatarFallback className="bg-blue-900 text-xs font-semibold text-white">
//                     {userInitial}
//                   </AvatarFallback>
//                 </Avatar>
//                 <span className="hidden text-sm font-semibold text-white sm:inline-block">
//                   {user.name || user.email?.split("@")[0]}
//                 </span>
//               </Link>

//               <button
//                 type="button"
//                 onClick={handleLogout}
//                 className="flex h-9 items-center justify-center rounded-lg border border-rose-400/30 bg-rose-500/20 px-4 text-sm font-semibold text-rose-200 hover:bg-rose-500/30 transition-colors"
//               >
//                 Logout
//               </button>
//             </div>
//           ) : (
//             <div className="flex items-center gap-3">
//               {/* Outlined Dark Blue Login Button */}
//               <Link
//                 href="/auth/Login"
//                 className="flex h-9 items-center justify-center rounded-lg border border-blue-400/40 bg-transparent px-5 text-sm font-semibold text-white transition-colors hover:bg-blue-900/50"
//               >
//                 Login
//               </Link>
//               {/* Solid White Sign Up Button */}
//               <Link
//                 href="/auth/Signup"
//                 className="flex h-9 items-center justify-center rounded-lg bg-white px-5 text-sm font-semibold text-[#03204c] shadow transition-transform hover:bg-blue-50 active:scale-95"
//               >
//                 Sign Up
//               </Link>
//             </div>
//           )}
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

//             {isAuthenticated ? (
//               <div className="flex flex-col gap-2">
//                 <div className="flex items-center gap-3 px-4 py-2">
//                   <Avatar size="sm" className="h-8 w-8">
//                     {user.image && <AvatarImage src={user.image} alt={user.name || "User"} />}
//                     <AvatarFallback className="bg-blue-900 text-xs font-semibold text-white">
//                       {userInitial}
//                     </AvatarFallback>
//                   </Avatar>
//                   <div className="flex flex-col truncate">
//                     <span className="text-sm font-semibold text-white">{user.name || "User"}</span>
//                     <span className="truncate text-xs text-blue-200/70">{user.email}</span>
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
//               <div className="flex flex-col gap-2 pt-1">
//                 <Link
//                   href="/auth/Login"
//                   className="flex h-10 w-full items-center justify-center rounded-lg border border-blue-400/40 bg-transparent text-sm font-semibold text-white"
//                   onClick={() => setIsMenuOpen(false)}
//                 >
//                   Login
//                 </Link>
//                 <Link
//                   href="/auth/Signup"
//                   className="flex h-10 w-full items-center justify-center rounded-lg bg-white text-sm font-semibold text-[#03204c]"
//                   onClick={() => setIsMenuOpen(false)}
//                 >
//                   Sign Up
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

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Spinner, Avatar, AvatarImage, AvatarFallback } from "@heroui/react";
import { Shield, BookOpen } from "lucide-react";

import { signOut, useSession } from "../lib/auth-client";

const baseNavItems = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Notice", href: "/notice" },
  { label: "Blog", href: "/blog" },
  { label: "Contact", href: "/contact" },
];

const dashboardLinks: Record<string, string> = {
  student: "/student",
  teacher: "/teacher",
  admin: "/admin",
};

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const { data: session, isPending } = useSession();
  const user = session?.user as { name?: string; email?: string; image?: string; role?: string } | undefined;
  const isAuthenticated = !!user;

  const userRole = user?.role || "student";
  const dashboardHref = dashboardLinks[userRole] || "/student";

  const navItems = isAuthenticated
    ? [...baseNavItems, { label: "Dashboard", href: dashboardHref }]
    : baseNavItems;

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

  const userInitial = user?.name?.charAt(0).toUpperCase() || user?.email?.charAt(0).toUpperCase() || "U";

  return (
    <header className="sticky top-0 z-50 w-full bg-[#03204c] text-white border-b border-blue-900/40 shadow-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* Left Section: Mobile Toggle & Logo Branding */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            className="flex h-10 w-10 items-center justify-center rounded-lg border border-blue-700/50 bg-blue-900/40 text-blue-200 hover:bg-blue-800/60 lg:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>

          {/* EduManage Brand Shield Logo */}
          <Link href="/" className="flex items-center gap-2.5 focus:outline-none">
            <div className="relative flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-b from-blue-400 to-blue-600 text-white shadow-sm">
              <Shield className="h-8 w-8 text-blue-400 fill-blue-500 absolute" />
              <BookOpen className="h-4 w-4 text-white relative z-10 stroke-[2.5]" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold leading-none tracking-tight text-white">
                EduManage
              </span>
              <span className="text-[10px] font-medium leading-tight text-blue-200/80">
                School Management Platform
              </span>
            </div>
          </Link>
        </div>

        {/* Middle Section: Clean Desktop Navigation with Active Underline */}
        <nav className="hidden items-center gap-8 lg:flex">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`relative py-1 text-sm font-semibold transition-colors duration-200 ${
                  isActive
                    ? "text-white"
                    : "text-blue-100/80 hover:text-white"
                }`}
              >
                {item.label}
                {/* Underline Indicator matching the image design */}
                {isActive && (
                  <span className="absolute bottom-0 left-0 h-[2px] w-full rounded-full bg-blue-400" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Right Section: Auth State / Actions */}
        <div className="flex items-center gap-3">
          {isPending ? (
            <div className="flex h-9 w-9 items-center justify-center text-white">
              <Spinner size="sm" color="current" />
            </div>
          ) : isAuthenticated && user ? (
            <div className="flex items-center gap-3">
              <Link href="/profile" className="flex items-center gap-2 rounded-lg p-1 transition-colors hover:bg-blue-900/50">
                <Avatar className="h-8 w-8 ring-2 ring-blue-400/50" size="sm">
                  {user.image && <AvatarImage src={user.image} alt={user.name || "User"} />}
                  <AvatarFallback className="bg-blue-900 text-xs font-semibold text-white">
                    {userInitial}
                  </AvatarFallback>
                </Avatar>
                <span className="hidden text-sm font-semibold text-white sm:inline-block">
                  {user.name || user.email?.split("@")[0]}
                </span>
              </Link>

              <button
                type="button"
                onClick={handleLogout}
                className="flex h-9 items-center justify-center rounded-lg border border-rose-400/30 bg-rose-500/20 px-4 text-sm font-semibold text-rose-200 hover:bg-rose-500/30 transition-colors"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              {/* Outlined Dark Blue Login Button */}
              <Link
                href="/auth/Login"
                className="flex h-9 items-center justify-center rounded-lg border border-blue-400/40 bg-transparent px-5 text-sm font-semibold text-white transition-colors hover:bg-blue-900/50"
              >
                Login
              </Link>
              {/* Solid White Sign Up Button */}
              <Link
                href="/auth/Signup"
                className="flex h-9 items-center justify-center rounded-lg bg-white px-5 text-sm font-semibold text-[#03204c] shadow transition-transform hover:bg-blue-50 active:scale-95"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Drawer */}
      {isMenuOpen && (
        <div className="border-t border-blue-900/60 bg-[#021838] px-4 pb-6 pt-4 lg:hidden">
          <nav className="flex flex-col gap-2">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex h-10 items-center rounded-lg px-4 text-sm font-semibold transition-colors ${
                    isActive
                      ? "bg-blue-900/60 text-blue-400"
                      : "text-blue-100 hover:bg-blue-900/30"
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.label}
                </Link>
              );
            })}

            <div className="my-2 border-t border-blue-900/60" />

            {isAuthenticated ? (
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-3 px-4 py-2">
                  <Avatar size="sm" className="h-8 w-8">
                    {user.image && <AvatarImage src={user.image} alt={user.name || "User"} />}
                    <AvatarFallback className="bg-blue-900 text-xs font-semibold text-white">
                      {userInitial}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col truncate">
                    <span className="text-sm font-semibold text-white">{user.name || "User"}</span>
                    <span className="truncate text-xs text-blue-200/70">{user.email}</span>
                  </div>
                </div>

                <button
                  type="button"
                  className="mt-1 flex h-10 w-full items-center justify-center rounded-lg border border-rose-500/40 bg-rose-500/20 text-sm font-semibold text-rose-200 hover:bg-rose-500/30"
                  onClick={handleLogout}
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-2 pt-1">
                <Link
                  href="/auth/Login"
                  className="flex h-10 w-full items-center justify-center rounded-lg border border-blue-400/40 bg-transparent text-sm font-semibold text-white"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Login
                </Link>
                <Link
                  href="/auth/Signup"
                  className="flex h-10 w-full items-center justify-center rounded-lg bg-white text-sm font-semibold text-[#03204c]"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Sign Up
                </Link>
              </div>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}


