
"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Spinner, Avatar } from "@heroui/react";

import { signOut, useSession } from "../lib/auth-client";

const baseNavItems = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Notice", href: "/notice" },
  { label: "Blog", href: "/blog" },
  { label: "Contact", href: "/contact" },
];

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();

  const { data: session, isPending } = useSession();
  const user = session?.user;
  const isAuthenticated = !!user;

  // Dynamically add Dashboard to the middle navigation when authenticated
  const navItems = isAuthenticated
    ? [...baseNavItems, { label: "Dashboard", href: "/dashboard" }]
    : baseNavItems;

  const handleLogout = async () => {
    await signOut();
    setIsMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-800/80 bg-slate-950/85 backdrop-blur-md transition-all">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* Left Section: Mobile Toggle & Brand Logo */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-800 bg-slate-900/50 text-slate-400 transition-colors hover:bg-slate-800 hover:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 lg:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <svg
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {isMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>

          <Link
            href="/"
            className="group flex items-center gap-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-cyan-400 text-xs font-black tracking-wider text-white shadow-md shadow-indigo-500/20 transition-transform duration-200 group-hover:scale-105">
              SCH
            </div>
            <span className="hidden text-lg font-bold tracking-tight text-slate-100 sm:inline-block">
              Greenwood <span className="text-cyan-400">High</span>
            </span>
          </Link>
        </div>

        {/* Middle Section: Desktop Nav Links (Includes Dashboard when authenticated) */}
        <nav className="hidden items-center gap-1 rounded-full border border-slate-800/60 bg-slate-900/40 p-1.5 backdrop-blur-md lg:flex">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`rounded-lg px-4 py-1.5 text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? "border border-indigo-500/30 bg-indigo-600/15 text-cyan-400 shadow-sm"
                    : "text-slate-400 hover:bg-slate-800/60 hover:text-slate-100"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Right Section: User Info & Logout or Login/Signup */}
        <div className="flex items-center gap-2 sm:gap-3">
          {isPending ? (
            <div className="flex h-9 w-9 items-center justify-center">
              <Spinner size="sm" color="cyan" />
            </div>
          ) : isAuthenticated && user ? (
            <div className="flex items-center gap-3">
              {/* User Avatar & Name */}
              <Link
                href="/profile"
                className="flex items-center gap-2 rounded-xl p-1 transition-colors hover:bg-slate-900/60 focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
              >
                <Avatar
                  isBordered
                  className="h-8 w-8 ring-cyan-400/50"
                  name={user.name || "User"}
                  size="sm"
                  src={user.image || undefined}
                />
                <span className="hidden text-sm font-semibold text-slate-200 sm:inline-block">
                  {user.name || user.email?.split("@")[0]}
                </span>
              </Link>

              {/* Direct Logout Button */}
              <button
                type="button"
                onClick={handleLogout}
                className="flex h-9 items-center justify-center rounded-xl border border-rose-500/30 bg-rose-500/10 px-3 text-sm font-medium text-rose-400 transition-colors hover:bg-rose-500/20 hover:text-rose-300 focus:outline-none focus:ring-2 focus:ring-rose-500/40"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                href="/auth/Login"
                className="flex h-9 items-center justify-center rounded-xl px-4 text-sm font-medium text-slate-300 transition-colors hover:bg-slate-800/80 hover:text-white focus:outline-none focus:ring-2 focus:ring-slate-700"
              >
                Login
              </Link>
              <Link
                href="/auth/Signup"
                className="flex h-9 items-center justify-center rounded-xl border border-indigo-400/30 bg-gradient-to-r from-indigo-600 to-cyan-500 px-4 text-sm font-semibold text-white shadow-md shadow-indigo-500/20 transition-all hover:from-indigo-500 hover:to-cyan-400 hover:shadow-indigo-500/30 focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Nav Drawer */}
      {isMenuOpen && (
        <div className="border-b border-slate-800/80 bg-slate-950/95 px-4 pb-6 pt-3 backdrop-blur-2xl lg:hidden">
          <nav className="flex flex-col gap-1.5">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex h-11 items-center rounded-xl px-4 text-sm font-medium transition-colors ${
                    isActive
                      ? "border border-indigo-500/30 bg-indigo-950/60 text-cyan-400"
                      : "text-slate-300 hover:bg-slate-900/80 hover:text-white"
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.label}
                </Link>
              );
            })}

            <div className="my-2 border-t border-slate-800/80" />

            {isAuthenticated ? (
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center gap-3 px-4 py-2 text-slate-300">
                  <Avatar
                    size="sm"
                    name={user.name || "User"}
                    src={user.image || undefined}
                  />
                  <div className="flex flex-col truncate">
                    <span className="text-sm font-semibold text-slate-100">
                      {user.name || "User"}
                    </span>
                    <span className="truncate text-xs text-slate-400">
                      {user.email}
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  className="mt-2 flex h-11 w-full items-center justify-center rounded-xl border border-rose-900/50 bg-rose-950/40 text-sm font-semibold text-rose-400 transition-colors hover:bg-rose-900/60 hover:text-rose-200"
                  onClick={handleLogout}
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-2 pt-1">
                <Link
                  href="/auth/Login"
                  className="flex h-11 w-full items-center justify-center rounded-xl border border-slate-800 bg-slate-900/80 text-sm font-medium text-slate-200 transition-colors hover:bg-slate-800 hover:text-white"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Login
                </Link>
                <Link
                  href="/auth/Signup"
                  className="flex h-11 w-full items-center justify-center rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-500 text-sm font-semibold text-white shadow-md shadow-indigo-500/20 transition-all hover:from-indigo-500 hover:to-cyan-400"
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




