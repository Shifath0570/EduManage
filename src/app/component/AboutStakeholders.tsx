"use client";

import React from "react";
import { motion } from "framer-motion";
import { 
  Building2, 
  GraduationCap, 
  Users2, 
  Sparkles, 
  CheckCircle2,
  Shield,
  BookOpen,
  ClipboardList,
  MessageSquare,
  BarChart3,
  CalendarCheck
} from "lucide-react";

export function AboutStakeholders() {
  const pillars = [
    {
      icon: Building2,
      role: "For Administrators",
      badge: "Institutional Oversight",
      color: "from-emerald-50 to-teal-50 border-emerald-200",
      iconBg: "bg-emerald-500 text-white",
      description: "Complete control over campus operations, student records, teacher allocations, and official notices.",
      features: [
        "Manage student admissions and class enrollments",
        "Assign faculty to specific subjects and grades",
        "Generate and broadcast school circulars & notices",
        "Review and approve student/faculty leave requests",
        "Access comprehensive campus-level analytics",
      ],
    },
    {
      icon: GraduationCap,
      role: "For Teachers & Faculty",
      badge: "Pedagogical Efficiency",
      color: "from-teal-50 to-sky-50 border-teal-200",
      iconBg: "bg-teal-600 text-white",
      description: "Eliminate administrative drag so teachers can focus on classroom instruction and mentorship.",
      features: [
        "Perform instant daily digital attendance roll-call",
        "Record examination marks and generate report cards",
        "Track individual student attendance percentages",
        "Review student leave applications with full context",
        "Publish subject notices and academic announcements",
      ],
    },
    {
      icon: Users2,
      role: "For Students & Learners",
      badge: "Academic Transparency",
      color: "from-sky-50 to-emerald-50 border-sky-200",
      iconBg: "bg-sky-600 text-white",
      description: "Continuous real-time visibility into academic growth, attendance rates, and school bulletins.",
      features: [
        "View real-time attendance status and percentage",
        "Check exam marks, grade breakdowns, and transcripts",
        "Submit digital leave requests with document uploads",
        "Receive marquee alerts and institutional circulars",
        "Engage with school staff via the built-in School Chat",
      ],
    },
  ];

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#FFF9EE]/40 via-[#EBFBFA]/30 to-white py-16 md:py-24">
      {/* Ambient Blur */}
      <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 h-96 w-[40rem] rounded-full bg-emerald-200/20 blur-3xl" />

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
            <span>Role-Based Ecosystem</span>
          </div>

          <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl lg:text-5xl">
            Empowering Every <span className="text-emerald-500">School Stakeholder</span>
          </h2>

          <div className="mt-3 h-1.5 w-16 rounded-full bg-emerald-500" />

          <p className="mt-4 max-w-2xl text-sm font-normal text-slate-600 sm:text-base">
            EduManage is architected around the distinct daily requirements of Administrators, Teachers, and Students.
          </p>
        </motion.div>

        {/* 3 Pillars Grid */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {pillars.map((pillar, idx) => {
            const Icon = pillar.icon;
            return (
              <motion.div
                key={pillar.role}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.12 }}
                whileHover={{ y: -8 }}
                className={`group relative flex flex-col justify-between rounded-3xl border bg-gradient-to-b ${pillar.color} p-8 backdrop-blur-md shadow-sm transition-all duration-300 hover:bg-white hover:shadow-xl hover:shadow-emerald-900/5`}
              >
                <div>
                  <div className="flex items-center justify-between">
                    <div className={`flex h-13 w-13 items-center justify-center rounded-2xl shadow-sm ${pillar.iconBg}`}>
                      <Icon className="h-6 w-6" />
                    </div>
                    <span className="rounded-full border border-slate-200/80 bg-white/90 px-3 py-1 text-[11px] font-bold text-slate-700">
                      {pillar.badge}
                    </span>
                  </div>

                  <h3 className="mt-6 text-2xl font-bold text-slate-900">
                    {pillar.role}
                  </h3>

                  <p className="mt-3 text-xs sm:text-sm leading-relaxed text-slate-600">
                    {pillar.description}
                  </p>

                  <div className="mt-6 border-t border-slate-200/60 pt-6">
                    <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                      Key Capabilities:
                    </p>
                    <ul className="space-y-2.5">
                      {pillar.features.map((feat, fIdx) => (
                        <li key={fIdx} className="flex items-start gap-2 text-xs font-semibold text-slate-800">
                          <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600 mt-0.5" />
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="mt-8 pt-4">
                  <div className="h-1 w-full rounded-full bg-slate-200/50 overflow-hidden">
                    <div className="h-full w-2/3 rounded-full bg-emerald-500" />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
