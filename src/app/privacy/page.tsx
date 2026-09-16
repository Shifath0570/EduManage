"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { 
  ShieldCheck, 
  Lock, 
  Eye, 
  FileText, 
  Database, 
  UserCheck, 
  Sparkles,
  ArrowRight,
  Mail,
  CheckCircle2,
  HardDrive,
  KeyRound,
  FileSpreadsheet
} from "lucide-react";

export default function PrivacyPolicyPage() {
  const quickHighlights = [
    {
      icon: ShieldCheck,
      title: "Zero Monetization",
      desc: "We never sell or monetize student or teacher data.",
    },
    {
      icon: Lock,
      title: "AES-256 Encrypted",
      desc: "Bank-grade encryption in transit & at rest.",
    },
    {
      icon: KeyRound,
      title: "Role-Based Access",
      desc: "Strict isolation across Admin, Teacher & Student.",
    },
    {
      icon: FileSpreadsheet,
      title: "Data Ownership",
      desc: "Schools retain 100% rights to export or delete.",
    },
  ];

  const sections = [
    {
      icon: Database,
      title: "1. Information We Collect",
      summary: "We only collect data necessary to provide school operations and classroom learning.",
      points: [
        "Profile & Enrollment Data: Student names, roll numbers, class/section assignments, and teacher profiles.",
        "Academic & Daily Operations: Real-time attendance logs, term examination marks, subject grades, and circular announcements.",
        "Authentication & Security Logs: Encrypted session tokens, device types, and audit timestamps strictly used for account security.",
      ],
    },
    {
      icon: Eye,
      title: "2. How We Use Collected Data",
      summary: "Data is utilized strictly to automate and support institutional educational workflows.",
      points: [
        "Automating daily roll-call attendance, grade calculations, and transcript generation.",
        "Delivering segregated dashboard portals for administrators, teachers, and students.",
        "Publishing official school notices, circulars, and instant emergency alerts.",
        "Providing analytical performance insights to help educators mentor students effectively.",
      ],
    },
    {
      icon: HardDrive,
      title: "3. Data Security & Cloud Infrastructure",
      summary: "Industry-grade protection protocols embedded into our database and server architecture.",
      points: [
        "All data transmissions are encrypted via TLS 1.3 / HTTPS; databases are encrypted at rest with AES-256.",
        "Strict multi-tenant cloud segregation prevents cross-institution data contamination.",
        "Daily automated backups stored in geographically distributed secure cloud clusters with disaster recovery.",
      ],
    },
    {
      icon: UserCheck,
      title: "4. Zero Third-Party Advertising",
      summary: "Educational privacy is our highest commitment.",
      points: [
        "We do not display third-party advertisements or sell user browsing habits to external brokers.",
        "Data is only processed by verified cloud partners (e.g. MongoDB Atlas, Vercel) under strict confidentiality agreements.",
        "We comply with standard educational privacy guidelines and only disclose records if legally mandated.",
      ],
    },
    {
      icon: FileText,
      title: "5. Institutional Rights & Retention",
      summary: "Schools maintain absolute ownership of all academic records.",
      points: [
        "Schools can export complete student attendance registers, marks, and profiles to Excel and PDF at any time.",
        "Authorized administrators may update, correct, or request deletion of outdated records.",
        "Upon contract conclusion, a 30-day grace period is provided for complete data retrieval before permanent purge.",
      ],
    },
  ];

  return (
    <main className="min-h-screen bg-white">
      {/* =====================================================
          HERO BANNER
      ====================================================== */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#E2F7F5] via-[#FFFBF2] to-[#DDF5EC] pt-32 pb-24 lg:pt-38 lg:pb-28 border-b border-emerald-100/60">
        {/* Ambient Grid */}
        <div className="absolute inset-0 bg-[radial-gradient(#10b981_0.75px,transparent_0.75px)] [background-size:24px_24px] opacity-15 pointer-events-none" />

        {/* Ambient Blur Bubbles */}
        <div className="pointer-events-none absolute top-12 left-10 h-96 w-96 rounded-full bg-emerald-200/30 blur-3xl" />
        <div className="pointer-events-none absolute top-1/4 right-8 h-[28rem] w-[28rem] rounded-full bg-sky-200/30 blur-3xl" />

        {/* Floating Sparkles */}
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="pointer-events-none absolute top-32 left-16 hidden sm:block"
        >
          <Sparkles className="h-6 w-6 text-emerald-400 opacity-60" />
        </motion.div>

        <div className="container relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-4 inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50/90 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-emerald-700 shadow-xs"
          >
            <Sparkles className="h-3.5 w-3.5 fill-emerald-500 text-emerald-500" />
            <span>Privacy & Data Protection</span>
          </motion.div>

          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl lg:text-6xl leading-[1.15]"
          >
            Privacy <span className="text-emerald-500">Policy</span>
          </motion.h1>

          <div className="mt-4 mx-auto h-1.5 w-16 rounded-full bg-emerald-500" />

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mx-auto mt-5 max-w-2xl text-base sm:text-lg text-slate-600 leading-relaxed font-normal"
          >
            How EduManage protects institutional privacy, safeguards academic records, and maintains zero-monetization standards.
          </motion.p>

          <p className="mt-3 text-xs font-semibold text-slate-500">
            Last Updated: September 2026 • Effective for all EduManage Users
          </p>
        </div>
      </section>

      {/* =====================================================
          HIGHLIGHT TRUST CARDS
      ====================================================== */}
      <section className="relative z-20 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 -mt-12">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {quickHighlights.map((card, idx) => {
            const Icon = card.icon;
            return (
              <motion.div
                key={card.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 * idx }}
                whileHover={{ y: -6 }}
                className="group relative flex flex-col items-start rounded-3xl border border-white/90 bg-white/90 p-6 backdrop-blur-xl shadow-lg transition-all duration-300 hover:border-emerald-300/60 hover:bg-white hover:shadow-xl"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-emerald-100 bg-emerald-50 text-emerald-600 shadow-xs transition-transform duration-300 group-hover:scale-110 group-hover:bg-emerald-500 group-hover:text-white">
                  <Icon className="h-6 w-6 stroke-[2]" />
                </div>
                <h3 className="mt-4 text-base font-bold text-slate-900 transition-colors group-hover:text-emerald-600">
                  {card.title}
                </h3>
                <p className="mt-1.5 text-xs text-slate-600 leading-relaxed font-normal">
                  {card.desc}
                </p>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* =====================================================
          SECTIONS DETAIL
      ====================================================== */}
      <section className="relative overflow-hidden bg-gradient-to-b from-white via-[#EBFBFA]/20 to-[#FFF9EE]/30 py-16 sm:py-24">
        <div className="container relative z-10 mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          
          <div className="space-y-8">
            {sections.map((sec, idx) => {
              const Icon = sec.icon;
              return (
                <motion.div
                  key={sec.title}
                  initial={{ opacity: 0, y: 25 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: idx * 0.08 }}
                  className="rounded-3xl border border-white/80 bg-white/80 p-7 sm:p-9 backdrop-blur-md shadow-xs transition-all duration-300 hover:border-emerald-300/50 hover:bg-white hover:shadow-lg"
                >
                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-emerald-100 bg-emerald-50 text-emerald-600 shadow-xs">
                      <Icon className="h-6 w-6 stroke-[2]" />
                    </div>
                    <div className="w-full">
                      <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
                        {sec.title}
                      </h2>
                      <p className="mt-1 text-xs sm:text-sm font-semibold text-emerald-700">
                        {sec.summary}
                      </p>

                      <ul className="mt-5 space-y-3.5 border-t border-slate-100 pt-5 text-xs sm:text-sm text-slate-600">
                        {sec.points.map((pt, pIdx) => (
                          <li key={pIdx} className="flex items-start gap-3">
                            <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-500 mt-0.5" />
                            <span className="leading-relaxed">{pt}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Bottom CTA Card */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="mt-16 overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-950 p-8 sm:p-12 text-center text-white shadow-2xl"
          >
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-emerald-400">
              <Sparkles className="h-3.5 w-3.5 fill-emerald-400 text-emerald-400" />
              <span>Dedicated Support</span>
            </div>

            <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Have Questions About Our Privacy Standards?
            </h3>

            <p className="mx-auto mt-3 max-w-xl text-sm sm:text-base text-slate-300 font-normal leading-relaxed">
              Our data protection team is ready to address any institutional data processing, compliance, or security inquiries.
            </p>

            <div className="mt-7 flex flex-wrap items-center justify-center gap-4">
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 rounded-full bg-emerald-500 px-7 py-3.5 text-sm font-bold text-slate-950 shadow-md shadow-emerald-500/20 transition hover:bg-emerald-400"
              >
                <Mail className="h-4 w-4" />
                <span>Contact Privacy Officer</span>
                <ArrowRight className="h-4 w-4" />
              </Link>

              <Link
                href="/about"
                className="inline-flex items-center gap-2 rounded-full border border-slate-700 bg-white/10 px-7 py-3.5 text-sm font-bold text-white backdrop-blur-md transition hover:bg-white hover:text-slate-900"
              >
                <span>About Platform</span>
              </Link>
            </div>
          </motion.div>

        </div>
      </section>
    </main>
  );
}
