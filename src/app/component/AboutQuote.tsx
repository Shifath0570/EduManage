"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Quote, Sparkles, CheckCircle2 } from "lucide-react";

export function AboutQuote() {
  return (
    <section className="relative overflow-hidden bg-white py-16 md:py-24">
      <div className="container relative z-10 mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="relative overflow-hidden rounded-[2.5rem] border border-emerald-100 bg-gradient-to-br from-[#E2F7F5]/70 via-[#FFFBF2] to-[#DDF5EC]/70 p-8 sm:p-12 md:p-16 shadow-xl"
        >
          {/* Subtle Background Icon */}
          <Quote className="pointer-events-none absolute right-8 bottom-6 h-40 w-40 text-emerald-500/10 rotate-12" />

          <div className="relative z-10 flex flex-col items-center text-center">
            
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-white/80 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-emerald-600 shadow-xs">
              <Sparkles className="h-3.5 w-3.5 fill-emerald-500 text-emerald-500" />
              <span>Leadership Philosophy</span>
            </div>

            <h3 className="mt-2 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl md:text-4xl leading-snug">
              &ldquo;Technology is only as powerful as the educators and students it inspires. Our duty is to keep it human, intuitive, and accessible to all.&rdquo;
            </h3>

            <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:gap-5">
              <div className="relative h-16 w-16 overflow-hidden rounded-full border-2 border-emerald-500 shadow-md">
                <Image
                  src="/images/hasan.png"
                  alt="Academic Director"
                  width={64}
                  height={64}
                  className="h-full w-full object-cover"
                />
              </div>

              <div className="text-center sm:text-left">
                <div className="flex items-center justify-center sm:justify-start gap-1.5">
                  <p className="text-base font-bold text-slate-900">Dr. M. A. Hasan</p>
                  <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                </div>
                <p className="text-xs font-semibold text-emerald-700">
                  Chief Academic Advisor & Co-Founder, EduManage
                </p>
              </div>
            </div>

          </div>
        </motion.div>
      </div>
    </section>
  );
}
