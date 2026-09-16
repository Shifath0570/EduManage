"use client";

import React from "react";
import { motion } from "framer-motion";
import { 
  Target, 
  Compass, 
  Sparkles, 
  GraduationCap, 
  ShieldCheck, 
  Lightbulb, 
  Users2,
  CheckCircle2
} from "lucide-react";

export function AboutMission() {
  const values = [
    {
      icon: GraduationCap,
      title: "Academic Excellence",
      description: "Delivering modern tools that elevate pedagogy, streamline grading, and maximize student achievement.",
    },
    {
      icon: ShieldCheck,
      title: "Safety & Integrity",
      description: "Upholding student data privacy with role-based access and secure cloud infrastructure.",
    },
    {
      icon: Lightbulb,
      title: "Continuous Innovation",
      description: "Constantly integrating intelligent automation, AI-driven insights, and seamless modern design.",
    },
    {
      icon: Users2,
      title: "Connected Community",
      description: "Uniting educators and learners into a unified, transparent, and supportive ecosystem.",
    },
  ];

  return (
    <section id="about-mission" className="relative overflow-hidden bg-gradient-to-b from-white via-[#EBFBFA]/30 to-[#FFF9EE]/50 py-16 md:py-24">
      {/* Background Ambience */}
      <div className="pointer-events-none absolute top-1/3 left-1/2 -translate-x-1/2 h-96 w-[36rem] rounded-full bg-emerald-200/20 blur-3xl" />

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
            <span>Our Foundation</span>
          </div>

          <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl lg:text-5xl">
            Our Mission & <span className="text-emerald-500">Vision</span>
          </h2>

          <div className="mt-3 h-1.5 w-16 rounded-full bg-emerald-500" />

          <p className="mt-4 max-w-2xl text-sm font-normal text-slate-600 sm:text-base">
            Driven by a deep passion for education, we build digital solutions that remove operational boundaries and nurture academic brilliance.
          </p>
        </motion.div>

        {/* Mission & Vision Dual Cards */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 mb-16">
          
          {/* Mission Card */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            whileHover={{ y: -6 }}
            className="group relative flex flex-col justify-between rounded-3xl border border-white/80 bg-white/70 p-8 sm:p-10 backdrop-blur-md shadow-xs transition-all duration-300 hover:border-emerald-300/60 hover:bg-white hover:shadow-xl hover:shadow-emerald-900/5"
          >
            <div>
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-emerald-100 bg-emerald-50 text-emerald-600 shadow-xs transition-transform duration-300 group-hover:scale-110 group-hover:bg-emerald-500 group-hover:text-white">
                <Target className="h-7 w-7 stroke-[2]" />
              </div>

              <h3 className="mt-6 text-2xl font-bold text-slate-900 transition-colors group-hover:text-emerald-600">
                Our Mission
              </h3>

              <p className="mt-4 text-base leading-relaxed text-slate-600">
                To simplify educational administration through intuitive, accessible technology — enabling teachers to dedicate their passion to teaching and empowering students with clear learning paths.
              </p>
            </div>

            <div className="mt-8 border-t border-slate-100 pt-6 flex flex-wrap gap-4 text-xs font-semibold text-slate-700">
              <span className="flex items-center gap-1.5 text-emerald-600">
                <CheckCircle2 className="h-4 w-4" /> Streamlined Workflows
              </span>
              <span className="flex items-center gap-1.5 text-emerald-600">
                <CheckCircle2 className="h-4 w-4" /> Student-Centric Growth
              </span>
            </div>
          </motion.div>

          {/* Vision Card */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            whileHover={{ y: -6 }}
            className="group relative flex flex-col justify-between rounded-3xl border border-white/80 bg-white/70 p-8 sm:p-10 backdrop-blur-md shadow-xs transition-all duration-300 hover:border-emerald-300/60 hover:bg-white hover:shadow-xl hover:shadow-emerald-900/5"
          >
            <div>
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-emerald-100 bg-emerald-50 text-emerald-600 shadow-xs transition-transform duration-300 group-hover:scale-110 group-hover:bg-emerald-500 group-hover:text-white">
                <Compass className="h-7 w-7 stroke-[2]" />
              </div>

              <h3 className="mt-6 text-2xl font-bold text-slate-900 transition-colors group-hover:text-emerald-600">
                Our Vision
              </h3>

              <p className="mt-4 text-base leading-relaxed text-slate-600">
                To establish the benchmark for modern school management software globally — transforming traditional educational institutions into interconnected, data-driven, and high-performing smart campuses.
              </p>
            </div>

            <div className="mt-8 border-t border-slate-100 pt-6 flex flex-wrap gap-4 text-xs font-semibold text-slate-700">
              <span className="flex items-center gap-1.5 text-emerald-600">
                <CheckCircle2 className="h-4 w-4" /> Global Benchmark
              </span>
              <span className="flex items-center gap-1.5 text-emerald-600">
                <CheckCircle2 className="h-4 w-4" /> Smart Campus Ready
              </span>
            </div>
          </motion.div>

        </div>

        {/* Core Values Sub-section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10"
        >
          <h3 className="text-2xl font-bold text-slate-900 sm:text-3xl">
            Core Values That Guide Us
          </h3>
          <p className="mt-2 text-sm text-slate-600 max-w-xl mx-auto">
            The fundamental principles embedded into every module and line of code we build.
          </p>
        </motion.div>

        {/* 4 Values Cards Grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {values.map((val, idx) => {
            const Icon = val.icon;
            return (
              <motion.div
                key={val.title}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                whileHover={{ y: -6 }}
                className="group relative flex flex-col items-start rounded-3xl border border-white/80 bg-white/70 p-6 backdrop-blur-md shadow-xs transition-all duration-300 hover:border-emerald-300/60 hover:bg-white hover:shadow-xl hover:shadow-emerald-900/5"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-emerald-100 bg-emerald-50 text-emerald-600 shadow-xs transition-all duration-300 group-hover:scale-110 group-hover:bg-emerald-500 group-hover:text-white">
                  <Icon className="h-6 w-6 stroke-[2]" />
                </div>

                <h4 className="mt-5 text-lg font-bold text-slate-900 transition-colors group-hover:text-emerald-600">
                  {val.title}
                </h4>

                <p className="mt-2 text-xs leading-relaxed text-slate-600 font-normal">
                  {val.description}
                </p>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
