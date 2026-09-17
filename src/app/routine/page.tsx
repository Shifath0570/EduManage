"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft, Home } from "lucide-react";
import ClassRoutineSection from "@/app/component/ClassRoutineSection";

export default function ClassRoutinePage() {
  return (
    <main className="min-h-screen bg-slate-50/50 pt-24 sm:pt-28 pb-16 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Simple Breadcrumb & Navigation */}
        <div className="flex items-center justify-between pb-2">
          <nav className="flex items-center gap-2 text-xs font-semibold text-slate-500">
            <Link
              href="/"
              className="flex items-center gap-1 text-slate-600 hover:text-emerald-600 transition"
            >
              <Home size={14} />
              <span>Home</span>
            </Link>
            <span className="text-slate-300">/</span>
            <span className="text-slate-900 font-bold">Class Routine</span>
          </nav>

          <Link
            href="/"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-xs font-semibold text-slate-600 hover:bg-slate-50 transition shadow-2xs"
          >
            <ArrowLeft size={13} />
            <span>Home</span>
          </Link>
        </div>

        {/* Routine Viewer */}
        <ClassRoutineSection />
      </div>
    </main>
  );
}
