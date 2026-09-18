"use client";

import React from "react";
import { motion } from "framer-motion";
import { Building2, Users, CheckCircle, Clock, Sparkles } from "lucide-react";

export function AboutStats() {
  const stats = [
    {
      icon: Building2,
      value: "500+",
      label: "Partner Institutions",
      description: "Schools and colleges trusting EduManage daily",
    },
    {
      icon: Users,
      value: "50,000+",
      label: "Active Students & Faculty",
      description: "Connected learners, teachers, and admins",
    },
    {
      icon: CheckCircle,
      value: "99.8%",
      label: "Attendance Precision",
      description: "Automated real-time record verification",
    },
    {
      icon: Clock,
      value: "24/7",
      label: "Platform Reliability",
      description: "High availability cloud infrastructure",
    },
  ];

  return (
    <section className="relative overflow-hidden bg-[#0F172A] py-16 md:py-20 text-white">
      {/* Background Glows */}
      <div className="pointer-events-none absolute top-0 left-1/4 h-80 w-80 rounded-full bg-emerald-500/15 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 right-1/4 h-80 w-80 rounded-full bg-teal-500/15 blur-3xl" />

      <div className="container relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-14 flex flex-col items-center justify-center text-center"
        >
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-emerald-400">
            <Sparkles className="h-3.5 w-3.5 fill-emerald-400 text-emerald-400" />
            <span>Proven Track Record</span>
          </div>

          <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl lg:text-5xl">
            Numbers That Speak For <span className="text-emerald-400">Our Impact</span>
          </h2>

          <div className="mt-3 h-1.5 w-16 rounded-full bg-emerald-400" />
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                whileHover={{ y: -6 }}
                className="group relative flex flex-col items-center text-center rounded-3xl border border-slate-800 bg-slate-900/60 p-8 backdrop-blur-md shadow-lg transition-all duration-300 hover:border-emerald-500/40 hover:bg-slate-800/80"
              >
                <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shadow-xs transition-all duration-300 group-hover:scale-110 group-hover:bg-emerald-500 group-hover:text-slate-900">
                  <Icon className="h-7 w-7 stroke-[2]" />
                </div>

                <p className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
                  {stat.value}
                </p>

                <h3 className="mt-2 text-base font-bold text-slate-200">
                  {stat.label}
                </h3>

                <p className="mt-1 text-xs font-normal text-slate-400">
                  {stat.description}
                </p>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
