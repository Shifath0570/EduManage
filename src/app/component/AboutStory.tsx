"use client";

import React from "react";
import { motion } from "framer-motion";
import { 
  Sparkles, 
  FileSpreadsheet, 
  Zap, 
  ArrowRight, 
  CheckCircle2, 
  XCircle,
  Database,
  Layers
} from "lucide-react";

export function AboutStory() {
  const problems = [
    "Scattered paper records and manual attendance logbooks",
    "Time-consuming report card calculations and grading errors",
    "Delayed circulars and miscommunicated student notices",
    "Fragmented systems with no unified administrative oversight",
  ];

  const solutions = [
    "One-click digital attendance with real-time percentage reports",
    "Automated grade computing with instant transcript generation",
    "Instant marquee circular broadcasts and AI-assisted drafting",
    "Role-based secure portal for Admins, Teachers, and Students",
  ];

  return (
    <section id="platform-story" className="relative overflow-hidden bg-white py-16 md:py-24">
      <div className="container relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-14 flex flex-col items-center justify-center text-center"
        >
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50/80 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-emerald-600">
            <Sparkles className="h-3.5 w-3.5 fill-emerald-500 text-emerald-500" />
            <span>The Genesis of EduManage</span>
          </div>

          <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl lg:text-5xl">
            Why We Built <span className="text-emerald-500">EduManage</span>
          </h2>

          <div className="mt-3 h-1.5 w-16 rounded-full bg-emerald-500" />

          <p className="mt-4 max-w-2xl text-sm font-normal text-slate-600 sm:text-base">
            School administrators and teachers were spending over 35% of their daily time on repetitive paper forms and disjointed tools instead of teaching. We set out to change that.
          </p>
        </motion.div>

        {/* Before vs After Comparison Cards */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          
          {/* Traditional Schooling Card */}
          <motion.div
            initial={{ opacity: 0, x: -25 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="rounded-3xl border border-rose-100 bg-gradient-to-br from-rose-50/40 via-white to-rose-50/20 p-8 sm:p-10 shadow-sm"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-100 text-rose-600">
                <FileSpreadsheet className="h-6 w-6" />
              </div>
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-rose-500">Legacy Approach</span>
                <h3 className="text-xl font-bold text-slate-900">Traditional Administration</h3>
              </div>
            </div>

            <p className="mt-4 text-sm text-slate-600 leading-relaxed">
              Managing hundreds of students through physical binders, disconnected spreadsheets, and paper slips leads to data loss, inaccurate attendance, and communication breakdowns.
            </p>

            <ul className="mt-6 space-y-3.5 border-t border-rose-100/80 pt-6">
              {problems.map((prob, i) => (
                <li key={i} className="flex items-start gap-2.5 text-xs sm:text-sm font-medium text-slate-700">
                  <XCircle className="h-4 w-4 shrink-0 text-rose-500 mt-0.5" />
                  <span>{prob}</span>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* The EduManage Solution Card */}
          <motion.div
            initial={{ opacity: 0, x: 25 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="rounded-3xl border-2 border-emerald-300/50 bg-gradient-to-br from-emerald-50/40 via-white to-[#EBFBFA]/50 p-8 sm:p-10 shadow-lg"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500 text-white shadow-xs">
                <Zap className="h-6 w-6" />
              </div>
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">The Modern Standard</span>
                <h3 className="text-xl font-bold text-slate-900">EduManage Smart Platform</h3>
              </div>
            </div>

            <p className="mt-4 text-sm text-slate-600 leading-relaxed">
              A synchronized digital backbone that brings every record, roll-call, examination score, and circular notification into one secure, accessible cloud platform.
            </p>

            <ul className="mt-6 space-y-3.5 border-t border-emerald-100 pt-6">
              {solutions.map((sol, i) => (
                <li key={i} className="flex items-start gap-2.5 text-xs sm:text-sm font-semibold text-slate-800">
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600 mt-0.5" />
                  <span>{sol}</span>
                </li>
              ))}
            </ul>
          </motion.div>

        </div>

      </div>
    </section>
  );
}
