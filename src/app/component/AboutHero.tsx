"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import adminDashboardImg from "../../../public/images/overview-admin-dashboard.png";
import { 
  Sparkles, 
  ShieldCheck, 
  ArrowRight, 
  CheckCircle2,
  Mail
} from "lucide-react";

export default function AboutHero() {
  const platformTags = [
    { label: "Admin Console", color: "bg-emerald-500/10 text-emerald-700 border-emerald-200" },
    { label: "Teacher Workspace", color: "bg-teal-500/10 text-teal-700 border-teal-200" },
    { label: "Student Portal", color: "bg-sky-500/10 text-sky-700 border-sky-200" },
  ];

  return (
    <section className="relative min-h-[85vh] overflow-hidden bg-gradient-to-br from-[#E2F7F5] via-[#FFFBF2] to-[#DDF5EC] pt-32 pb-20 lg:pt-36 lg:pb-24">
      {/* Background Dots Grid */}
      <div className="absolute inset-0 bg-[radial-gradient(#10b981_0.75px,transparent_0.75px)] [background-size:24px_24px] opacity-15 pointer-events-none" />

      {/* Ambient Glows */}
      <div className="pointer-events-none absolute top-12 left-10 h-96 w-96 rounded-full bg-emerald-200/30 blur-3xl" />
      <div className="pointer-events-none absolute bottom-8 right-10 h-[28rem] w-[28rem] rounded-full bg-teal-200/30 blur-3xl" />

      <div className="container relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-14">
          
          {/* Left Column: Platform Mission & Value Proposition */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="flex flex-col justify-center space-y-6 lg:col-span-6"
          >
            {/* Pill Badge */}
            <div className="inline-flex w-max items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50/90 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-emerald-700 shadow-xs">
              <Sparkles className="h-3.5 w-3.5 fill-emerald-500 text-emerald-500" />
              <span>About EduManage Platform</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl lg:text-[50px] leading-[1.15]">
              Built to Modernize <br className="hidden sm:inline" />
              <span className="text-emerald-500">School Administration</span> & Learning
            </h1>

            {/* Description */}
            <p className="max-w-xl text-base sm:text-lg font-normal leading-relaxed text-slate-600">
              EduManage is a cloud-native school ERP and learning management system created to eliminate tedious manual paperwork, automate academic operations, and connect administrators, teachers, and students into one unified digital campus.
            </p>

            {/* Stakeholder Tag Badges */}
            <div className="flex flex-wrap items-center gap-2.5 pt-1">
              {platformTags.map((tag) => (
                <span
                  key={tag.label}
                  className={`inline-flex items-center gap-1.5 rounded-xl border px-3 py-1 text-xs font-bold ${tag.color}`}
                >
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  {tag.label}
                </span>
              ))}
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-3">
              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                <Link
                  href="#platform-story"
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-emerald-500 px-8 py-3.5 text-base font-bold text-white shadow-md shadow-emerald-500/20 transition hover:bg-emerald-600"
                >
                  <span>Our Platform Story</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </motion.div>

              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-slate-900 bg-white/40 px-8 py-3.5 text-base font-bold text-slate-900 backdrop-blur-sm transition hover:bg-white hover:shadow-md"
                >
                  <Mail className="h-4 w-4" />
                  <span>Contact Our Team</span>
                </Link>
              </motion.div>
            </div>
          </motion.div>

          {/* Right Column: Platform Dashboard Preview Showcase */}
          <motion.div
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="relative flex justify-center lg:col-span-6 lg:justify-end"
          >
            <div className="relative w-full max-w-[580px]">
              {/* Glass Frame Around Dashboard */}
              <div className="relative rounded-3xl border-2 border-emerald-300/40 bg-white/60 p-3 sm:p-4 backdrop-blur-md shadow-2xl">
                
                {/* Simulated Browser Bar */}
                <div className="mb-3 flex items-center justify-between border-b border-slate-100 pb-2.5 px-2">
                  <div className="flex items-center gap-1.5">
                    <div className="h-2.5 w-2.5 rounded-full bg-rose-400" />
                    <div className="h-2.5 w-2.5 rounded-full bg-amber-400" />
                    <div className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
                  </div>
                  <a
                    href="https://edu-manage-umber-two.vercel.app/admin"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 rounded-md bg-slate-100/90 px-3 py-1 text-[11px] font-semibold text-slate-600 transition hover:bg-emerald-50 hover:text-emerald-700"
                  >
                    <ShieldCheck className="h-3 w-3 text-emerald-600 shrink-0" />
                    <span className="truncate max-w-[280px] sm:max-w-none">https://edu-manage-umber-two.vercel.app/admin</span>
                  </a>
                  <div className="h-2 w-4" />
                </div>

                {/* Dashboard Image without Hover Overlay */}
                <div className="relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-xs">
                  <Image
                    src={adminDashboardImg}
                    alt="EduManage Admin Dashboard Overview"
                    priority
                    className="h-auto w-full object-cover"
                  />
                </div>

                {/* Floating Top Pill */}
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5, duration: 0.5 }}
                  className="absolute -top-3.5 right-6 flex items-center gap-2 rounded-2xl border border-white/90 bg-white/95 px-3.5 py-1.5 backdrop-blur-xl shadow-lg"
                >
                  <div className="h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
                  <span className="text-xs font-bold text-slate-800">Admin Dashboard</span>
                </motion.div>

                {/* Floating Bottom Card: Architecture Highlights */}
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.6, duration: 0.6 }}
                  className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-[92%] sm:w-[86%] rounded-2xl border border-white/90 bg-white/95 px-4 py-3 backdrop-blur-xl shadow-xl flex items-center justify-around text-center divide-x divide-slate-100"
                >
                  <div className="px-2">
                    <p className="text-xs font-bold text-slate-900">Next.js & React</p>
                    <p className="text-[10px] text-slate-500 font-medium">Modern Web UI</p>
                  </div>
                  <div className="px-2">
                    <p className="text-xs font-bold text-slate-900">AI Notice Engine</p>
                    <p className="text-[10px] text-slate-500 font-medium">Smart Generator</p>
                  </div>
                  <div className="px-2">
                    <p className="text-xs font-bold text-slate-900">Role Security</p>
                    <p className="text-[10px] text-slate-500 font-medium">Multi-Tenant</p>
                  </div>
                </motion.div>

              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}