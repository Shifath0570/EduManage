"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles, MessageCircleQuestion, Mail } from "lucide-react";

export function AboutCTA() {
  return (
    <section className="relative overflow-hidden bg-white pb-20 pt-8 sm:pb-28">
      <div className="container relative z-10 mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-950 p-8 sm:p-12 md:p-16 text-center text-white shadow-2xl"
        >
          {/* Background Ambient Circles */}
          <div className="pointer-events-none absolute -top-24 -left-24 h-72 w-72 rounded-full bg-emerald-500/20 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-24 -right-24 h-72 w-72 rounded-full bg-teal-500/20 blur-3xl" />

          <div className="relative z-10 mx-auto max-w-3xl">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-emerald-400">
              <Sparkles className="h-3.5 w-3.5 fill-emerald-400 text-emerald-400" />
              <span>Get Started Today</span>
            </div>

            <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl leading-tight">
              Ready to Upgrade Your <br className="hidden sm:inline" />
              <span className="text-emerald-400">School Management?</span>
            </h2>

            <p className="mt-4 text-base sm:text-lg text-slate-300 font-normal leading-relaxed max-w-2xl mx-auto">
              Join hundreds of forward-thinking institutions using EduManage to build connected, smart, and efficient learning campuses.
            </p>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}>
                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-emerald-500 px-8 py-4 text-base font-bold text-slate-950 shadow-lg shadow-emerald-500/25 transition-all hover:bg-emerald-400"
                >
                  <Mail className="h-5 w-5" />
                  <span>Contact Our Team</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </motion.div>

              <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}>
                <Link
                  href="/chat"
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-slate-700 bg-white/10 px-8 py-4 text-base font-bold text-white backdrop-blur-md transition-all hover:bg-white hover:text-slate-900"
                >
                  <MessageCircleQuestion className="h-5 w-5" />
                  <span>Ask EduChat</span>
                </Link>
              </motion.div>
            </div>
          </div>
        </motion.div>

      </div>
    </section>
  );
}
