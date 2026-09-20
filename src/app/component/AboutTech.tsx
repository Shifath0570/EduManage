"use client";

import React from "react";
import { motion } from "framer-motion";
import { 
  Sparkles, 
  Bot, 
  ShieldCheck, 
  FileSpreadsheet, 
  Zap, 
  Lock, 
  Smartphone,
  Server
} from "lucide-react";

export function AboutTech() {
  const techPillars = [
    {
      icon: Bot,
      title: "AI-Powered Notice Engine",
      description: "Integrated Generative AI to assist school administrators in drafting clear, articulate circulars, event announcements, and emergency notices in seconds.",
    },
    {
      icon: ShieldCheck,
      title: "Strict Role-Based Security",
      description: "Granular authorization matrix dividing student, faculty, and administrator privileges to ensure complete privacy and compliance.",
    },
    {
      icon: FileSpreadsheet,
      title: "Automated Reports & Exports",
      description: "Instant PDF and Excel exports for attendance registers, student report cards, grade sheets, and analytical performance metrics.",
    },
    {
      icon: Zap,
      title: "Instant Live Data Sync",
      description: "Real-time updates across attendance records, notice boards, and chat communications without requiring manual page refreshes.",
    },
    {
      icon: Lock,
      title: "Encrypted Cloud Storage",
      description: "Safe multi-tenant database infrastructure ensuring student records, contact details, and exam scores are protected around the clock.",
    },
    {
      icon: Smartphone,
      title: "Fully Responsive Experience",
      description: "Optimized for high-productivity desktop management as well as on-the-go mobile access for teachers and students.",
    },
  ];

  return (
    <section className="relative overflow-hidden bg-white py-16 md:py-24">
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
            <span>Platform Engineering</span>
          </div>

          <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl lg:text-5xl">
            Built on Modern <span className="text-emerald-500">Cloud Architecture</span>
          </h2>

          <div className="mt-3 h-1.5 w-16 rounded-full bg-emerald-500" />

          <p className="mt-4 max-w-2xl text-sm font-normal text-slate-600 sm:text-base">
            Engineered with high standards for speed, security, and scalability to support educational institutions of any size.
          </p>
        </motion.div>

        {/* 6 Tech Pillars Grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {techPillars.map((item, idx) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.08 }}
                whileHover={{ y: -6 }}
                className="group relative flex flex-col items-start rounded-3xl border border-slate-100 bg-slate-50/50 p-7 backdrop-blur-md transition-all duration-300 hover:border-emerald-300/60 hover:bg-white hover:shadow-xl hover:shadow-emerald-900/5"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-100 shadow-xs transition-all duration-300 group-hover:scale-110 group-hover:bg-emerald-500 group-hover:text-white">
                  <Icon className="h-6 w-6 stroke-[2]" />
                </div>

                <h3 className="mt-5 text-lg font-bold text-slate-900 transition-colors group-hover:text-emerald-600">
                  {item.title}
                </h3>

                <p className="mt-2 text-xs sm:text-sm leading-relaxed text-slate-600 font-normal">
                  {item.description}
                </p>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
