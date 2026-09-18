"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  Users,
  CalendarCheck,
  Award,
  BellRing,
  BrainCircuit,
  MessageSquareCheck,
  Sparkles,
  ShieldCheck,
} from "lucide-react";

export function AboutFeatures() {
  const capabilities = [
    {
      icon: Users,
      title: "Comprehensive Student Profiles",
      description: "Manage complete academic history, contact records, emergency contacts, and status updates in one centralized database.",
    },
    {
      icon: CalendarCheck,
      title: "Automated Daily Attendance",
      description: "Fast daily roll-call for teachers, accurate percentage tracking, and automated reporting for administration.",
    },
    {
      icon: Award,
      title: "Examinations & Digital Marks",
      description: "Record term scores, assign subjects, automatically compute grades, and generate verifiable report summaries.",
    },
    {
      icon: BellRing,
      title: "Instant Notice Broadcasting",
      description: "Publish circulars and school-wide alerts with marquee notifications and detailed attachments.",
    },
    {
      icon: BrainCircuit,
      title: "Smart Educational Insights",
      description: "Leverage AI-assisted reporting and performance trends to identify learning gaps and support individual growth.",
    },
    {
      icon: MessageSquareCheck,
      title: "Collaborative School Chat",
      description: "Facilitate direct, safe, and productive conversations among students, faculty, and academic counselors.",
    },
  ];

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#FFF9EE]/40 via-[#EBFBFA]/30 to-white py-16 md:py-24">
      {/* Background Glow */}
      <div className="pointer-events-none absolute top-1/2 right-10 h-96 w-96 rounded-full bg-emerald-200/20 blur-3xl" />

      <div className="container relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-14 flex flex-col items-center justify-center text-center"
        >
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50/80 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-emerald-600">
            <Sparkles className="h-3.5 w-3.5 fill-emerald-500 text-emerald-500" />
            <span>Platform Capabilities</span>
          </div>

          <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl lg:text-5xl">
            How EduManage Transforms <span className="text-emerald-500">Everyday Schooling</span>
          </h2>

          <div className="mt-3 h-1.5 w-16 rounded-full bg-emerald-500" />

          <p className="mt-4 max-w-2xl text-sm font-normal text-slate-600 sm:text-base">
            Every module is carefully crafted to reduce manual workload, save hours of administrative time, and elevate educational delivery.
          </p>
        </motion.div>

        {/* 6 Capabilities Grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {capabilities.map((item, idx) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.08 }}
                whileHover={{ y: -6 }}
                className="group relative flex flex-col items-start rounded-3xl border border-white/80 bg-white/70 p-7 backdrop-blur-md shadow-xs transition-all duration-300 hover:border-emerald-300/60 hover:bg-white hover:shadow-xl hover:shadow-emerald-900/5"
              >
                <div className="flex h-13 w-13 items-center justify-center rounded-2xl border border-emerald-100 bg-emerald-50 text-emerald-600 shadow-xs transition-all duration-300 group-hover:scale-110 group-hover:bg-emerald-500 group-hover:text-white">
                  <Icon className="h-6 w-6 stroke-[2]" />
                </div>

                <h3 className="mt-5 text-lg font-bold text-slate-900 transition-colors group-hover:text-emerald-600">
                  {item.title}
                </h3>

                <p className="mt-2 text-sm leading-relaxed text-slate-600 font-normal">
                  {item.description}
                </p>

                <div className="mt-5 flex items-center gap-1.5 text-xs font-semibold text-emerald-600 opacity-90">
                  <ShieldCheck className="h-4 w-4 text-emerald-500" />
                  <span>Enterprise Grade</span>
                </div>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
