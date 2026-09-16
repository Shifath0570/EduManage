"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { 
  FileCheck, 
  UserCheck, 
  ShieldAlert, 
  Clock, 
  Scale, 
  AlertCircle, 
  Sparkles,
  ArrowRight,
  Mail,
  CheckCircle2,
  ShieldCheck,
  Cpu,
  Layers,
  FileCode2
} from "lucide-react";

export default function TermsAndConditionsPage() {
  const quickHighlights = [
    {
      icon: ShieldCheck,
      title: "100% Institutional Data Rights",
      desc: "Schools fully own their student, faculty, and circular records.",
    },
    {
      icon: Clock,
      title: "99.8% Cloud SLA",
      desc: "High availability infrastructure with scheduled maintenance notices.",
    },
    {
      icon: Scale,
      title: "Educational Licensing",
      desc: "Authorized academic use across Students, Teachers & Administrators.",
    },
    {
      icon: FileCode2,
      title: "Secure Exporting",
      desc: "30-day grace period for complete PDF/Excel data retrieval on exit.",
    },
  ];

  const sections = [
    {
      icon: FileCheck,
      title: "1. Acceptance of Terms",
      summary: "Agreement governing your use and institutional deployment of the EduManage system.",
      points: [
        "By accessing, registering an institutional workspace, or utilizing EduManage (the \"Platform\"), you agree to these Terms and Conditions.",
        "Administrators representing educational institutions affirm they hold the required authorization to deploy the platform across their campus.",
        "Periodic policy updates will be highlighted via the platform notice board with continued use constituting acceptance.",
      ],
    },
    {
      icon: UserCheck,
      title: "2. Account Responsibilities & Role Security",
      summary: "Maintaining strict security across student, teacher, and administrator portals.",
      points: [
        "Users are responsible for safeguarding login credentials and preventing unauthorized access to examination or attendance workspaces.",
        "Role-based privileges must only be assigned to verified campus personnel according to administrative hierarchy.",
        "Institutions must immediately report suspected security breaches or compromised credentials to EduManage support.",
      ],
    },
    {
      icon: Scale,
      title: "3. Permitted Platform Usage & Conduct",
      summary: "Guidelines for lawful educational and administrative collaboration.",
      points: [
        "EduManage is licensed exclusively for lawful school administration, classroom grading, roll-call attendance, and academic messaging.",
        "Users may not reverse-engineer, decompile, scrape, or inject unauthorized automated bots into platform endpoints.",
        "Tampering with student grade records, audit logs, or multi-tenant database boundaries will result in immediate termination.",
      ],
    },
    {
      icon: Clock,
      title: "4. Cloud Availability & Maintenance Windows",
      summary: "Uptime commitments and continuous operational reliability.",
      points: [
        "EduManage aims for 99.8% platform uptime for all core dashboards, attendance logging, and examination processing.",
        "Routine software enhancements are conducted during off-peak hours with advance notification broadcasted via the marquee bulletin.",
        "We maintain redundant cloud clusters to safeguard against hardware failovers and unpredicted service disruptions.",
      ],
    },
    {
      icon: ShieldAlert,
      title: "5. Intellectual Property & Academic Content Ownership",
      summary: "Clear distinction between platform software and institutional data.",
      points: [
        "All proprietary platform software, UI styling, workflows, and AI notice engines remain the intellectual property of EduManage.",
        "Partner institutions retain 100% intellectual and legal ownership over all student data, exam questions, and circular materials uploaded to the system.",
      ],
    },
    {
      icon: AlertCircle,
      title: "6. Service Suspension & Data Retrieval Grace Period",
      summary: "Transparent exit and account management terms.",
      points: [
        "EduManage reserves the right to suspend workspaces that repeatedly violate security guidelines or fail to resolve billing terms.",
        "In the event of account termination, institutions receive a 30-day window to export all academic history in standard PDF/Excel formats.",
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
            <span>Service Agreement</span>
          </motion.div>

          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl lg:text-6xl leading-[1.15]"
          >
            Terms & <span className="text-emerald-500">Conditions</span>
          </motion.h1>

          <div className="mt-4 mx-auto h-1.5 w-16 rounded-full bg-emerald-500" />

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mx-auto mt-5 max-w-2xl text-base sm:text-lg text-slate-600 leading-relaxed font-normal"
          >
            Clear terms and guidelines governing your access, institutional data ownership, and use of the EduManage platform.
          </motion.p>

          <p className="mt-3 text-xs font-semibold text-slate-500">
            Last Updated: September 2026 • Effective for all EduManage Users
          </p>
        </div>
      </section>

      {/* =====================================================
          HIGHLIGHT CARDS
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
              <span>Legal Assistance</span>
            </div>

            <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Questions About Institutional Agreements?
            </h3>

            <p className="mx-auto mt-3 max-w-xl text-sm sm:text-base text-slate-300 font-normal leading-relaxed">
              Our team can provide custom service level agreements (SLAs), enterprise institutional licenses, and compliance documentation.
            </p>

            <div className="mt-7 flex flex-wrap items-center justify-center gap-4">
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 rounded-full bg-emerald-500 px-7 py-3.5 text-sm font-bold text-slate-950 shadow-md shadow-emerald-500/20 transition hover:bg-emerald-400"
              >
                <Mail className="h-4 w-4" />
                <span>Contact Legal Support</span>
                <ArrowRight className="h-4 w-4" />
              </Link>

              <Link
                href="/privacy"
                className="inline-flex items-center gap-2 rounded-full border border-slate-700 bg-white/10 px-7 py-3.5 text-sm font-bold text-white backdrop-blur-md transition hover:bg-white hover:text-slate-900"
              >
                <span>Privacy Policy</span>
              </Link>
            </div>
          </motion.div>

        </div>
      </section>
    </main>
  );
}
