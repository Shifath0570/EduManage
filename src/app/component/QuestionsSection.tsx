// "use client";

// import Link from "next/link";

// export default function QuestionsSection() {
//   return (
//     <section className="w-full relative overflow-hidden bg-[#0055d2] py-10 sm:py-12 md:py-14 text-white">
//       {/* Decorative Background Doodles */}
      
//       {/* Top-Left: Graduation Cap & Dotted Trail */}
//       <div className="pointer-events-none absolute -top-3 left-3 sm:left-10 md:left-16 text-white/15 select-none">
//         <svg
//           className="h-28 w-28 sm:h-36 sm:w-36 md:h-44 md:w-44"
//           viewBox="0 0 120 120"
//           fill="none"
//           stroke="currentColor"
//           strokeWidth="1.8"
//           strokeLinecap="round"
//           strokeLinejoin="round"
//         >
//           {/* Graduation Cap */}
//           <path d="M60 20 L105 40 L60 60 L15 40 Z" />
//           <path d="M30 47 V75 C30 85 90 85 90 75 V47" />
//           <path d="M98 43 V70 C98 75 92 78 92 78" />
//           <circle cx="92" cy="79" r="2.5" fill="currentColor" />
//           {/* Dotted path */}
//           <path
//             d="M35 88 C38 98, 48 106, 60 108 C75 110, 85 102, 95 106"
//             strokeDasharray="4 4"
//             strokeWidth="1.5"
//           />
//         </svg>
//       </div>

//       {/* Bottom-Left: Book & Bookmark */}
//       <div className="pointer-events-none absolute -bottom-6 left-6 sm:left-16 md:left-24 text-white/15 select-none">
//         <svg
//           className="h-28 w-28 sm:h-36 sm:w-36 md:h-40 md:w-40"
//           viewBox="0 0 120 120"
//           fill="none"
//           stroke="currentColor"
//           strokeWidth="1.8"
//           strokeLinecap="round"
//           strokeLinejoin="round"
//         >
//           {/* Perspective 3D Book */}
//           <path d="M25 50 L75 25 L95 45 L45 70 Z" />
//           <path d="M25 50 V75 L75 100 L95 75 V45" />
//           <path d="M45 70 V95 L95 75" />
//           <path d="M50 38 L65 31" />
//           {/* Bookmark */}
//           <path d="M65 31 V52 L70 48 L75 52 V26" />
//         </svg>
//       </div>

//       {/* Top-Right: Flying Envelope / Mail with Trail */}
//       <div className="pointer-events-none absolute -top-4 right-4 sm:right-12 md:right-20 text-white/15 select-none">
//         <svg
//           className="h-28 w-28 sm:h-36 sm:w-36 md:h-44 md:w-44"
//           viewBox="0 0 120 120"
//           fill="none"
//           stroke="currentColor"
//           strokeWidth="1.8"
//           strokeLinecap="round"
//           strokeLinejoin="round"
//         >
//           {/* Envelope rotated */}
//           <g transform="rotate(15 65 50)">
//             <rect x="30" y="25" width="60" height="42" rx="4" />
//             <path d="M30 27 L60 50 L90 27" />
//             <path d="M30 65 L48 48" />
//             <path d="M90 65 L72 48" />
//           </g>
//           {/* Dotted motion trail */}
//           <path
//             d="M20 75 C10 65, 8 45, 25 35"
//             strokeDasharray="4 4"
//             strokeWidth="1.5"
//           />
//         </svg>
//       </div>

//       {/* Bottom-Right: School Backpack / Bag */}
//       <div className="pointer-events-none absolute -bottom-6 right-6 sm:right-16 md:right-28 text-white/15 select-none">
//         <svg
//           className="h-28 w-28 sm:h-36 sm:w-36 md:h-40 md:w-40"
//           viewBox="0 0 120 120"
//           fill="none"
//           stroke="currentColor"
//           strokeWidth="1.8"
//           strokeLinecap="round"
//           strokeLinejoin="round"
//         >
//           {/* Backpack */}
//           <path d="M40 38 C40 28, 50 20, 60 20 C70 20, 80 28, 80 38 V95 C80 100, 75 104, 68 104 H52 C45 104, 40 100, 40 95 Z" />
//           {/* Top Handle */}
//           <path d="M52 20 V14 C52 11, 68 11, 68 14 V20" />
//           {/* Front Pocket */}
//           <rect x="48" y="62" width="24" height="28" rx="4" />
//           <path d="M48 70 H72" />
//           {/* Straps / Details */}
//           <path d="M40 45 C48 48, 72 48, 80 45" />
//           {/* Side Dotted Trail */}
//           <path
//             d="M28 85 C24 70, 26 55, 35 45"
//             strokeDasharray="4 4"
//             strokeWidth="1.5"
//           />
//         </svg>
//       </div>

//       {/* Content Container */}
//       <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-between gap-8 md:flex-row md:items-center">
//         {/* Left Content */}
//         <div className="text-center md:text-left">
//           <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-white leading-tight">
//             Have Questions?
//             <br />
//             <span className="inline-block mt-0.5 sm:mt-1">We Are Here to Help!</span>
//           </h2>
//           <p className="mt-3 text-sm sm:text-base md:text-lg font-normal text-blue-100/90 max-w-xl leading-relaxed">
//             Feel free to contact us for any queries or
//             <br className="hidden sm:inline" /> demonstration of our platform.
//           </p>
//         </div>

//         {/* Right Button */}
//         <div className="shrink-0">
//           <Link
//             href="/contact"
//             className="group inline-flex items-center justify-center gap-2.5 rounded-xl sm:rounded-2xl bg-white px-7 py-3.5 sm:px-8 sm:py-4 text-base sm:text-lg font-bold text-[#0055d2] shadow-md transition-all duration-300 hover:bg-slate-50 hover:shadow-xl hover:scale-105 active:scale-95 cursor-pointer"
//           >
//             {/* Paper Plane Icon */}
//             <svg
//               className="h-5 w-5 sm:h-6 sm:w-6 text-[#0055d2] transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
//               viewBox="0 0 24 24"
//               fill="none"
//               stroke="currentColor"
//               strokeWidth="2.5"
//               strokeLinecap="round"
//               strokeLinejoin="round"
//             >
//               <path d="m22 2-7 20-4-9-9-4Z" />
//               <path d="M22 2 11 13" />
//             </svg>
//             <span>Contact Us Now</span>
//           </Link>
//         </div>
//       </div>
//     </section>
//   );
// }

"use client";

import React, { useRef } from "react";
import Link from "next/link";
import { motion, useInView } from "framer-motion";
import { Send, HelpCircle, MessageSquare, ArrowRight, Sparkles } from "lucide-react";

export default function QuestionsSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section
      ref={ref}
      className="relative overflow-hidden bg-gradient-to-b from-[#FFF9EE]/50 via-[#EBFBFA]/40 to-white py-16 md:py-24"
    >
      {/* Background Ambient Blurs matching Hero, Statistics, & WhyChooseUs */}
      <div className="pointer-events-none absolute top-1/2 left-1/2 h-96 w-[36rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-emerald-200/20 blur-3xl" />
      <div className="pointer-events-none absolute top-10 right-10 h-72 w-72 rounded-full bg-amber-200/20 blur-3xl" />
      <div className="pointer-events-none absolute bottom-10 left-10 h-80 w-80 rounded-full bg-teal-200/20 blur-3xl" />

      {/* Floating Decorative Glass Badges */}
      <motion.div
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        className="pointer-events-none absolute top-12 left-12 hidden lg:flex h-12 w-12 items-center justify-center rounded-2xl border border-emerald-100 bg-white/80 backdrop-blur-md text-emerald-600 shadow-sm"
      >
        <HelpCircle className="h-6 w-6" />
      </motion.div>

      <motion.div
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        className="pointer-events-none absolute bottom-12 right-12 hidden lg:flex h-14 w-14 items-center justify-center rounded-2xl border border-emerald-100 bg-white/80 backdrop-blur-md text-emerald-600 shadow-sm"
      >
        <MessageSquare className="h-7 w-7" />
      </motion.div>

      <div className="container relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Glassmorphic Callout Card Container */}
        <div className="relative overflow-hidden rounded-3xl border border-white/80 bg-white/70 p-8 sm:p-12 md:p-16 backdrop-blur-md shadow-xs hover:shadow-xl hover:shadow-emerald-900/5 transition-all duration-300">
          
          {/* Subtle Ambient Card Glow */}
          <div className="pointer-events-none absolute -top-24 -right-24 h-64 w-64 rounded-full bg-emerald-200/30 blur-2xl" />

          <div className="relative z-10 flex flex-col items-center justify-between gap-8 text-center lg:flex-row lg:text-left">
            
            {/* Left Column Text */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6 }}
              className="max-w-2xl"
            >
              {/* Badge matching Section Headers */}
              <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50/80 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-emerald-600">
                <Sparkles className="h-3.5 w-3.5 fill-emerald-500 text-emerald-500" />
                <span>24/7 Support Available</span>
              </div>

              <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl lg:text-5xl">
                Have Questions? <br className="hidden sm:inline" />
                <span className="text-emerald-500">We Are Here to Help!</span>
              </h2>

              <p className="mt-4 text-sm font-normal text-slate-600 sm:text-base leading-relaxed">
                Feel free to contact us for any inquiries, technical assistance, or to request a live guided demonstration of our campus platform.
              </p>
            </motion.div>

            {/* Right Column Action Button */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="shrink-0"
            >
              <Link
                href="/contact"
                className="group relative inline-flex items-center justify-center gap-3 overflow-hidden rounded-2xl bg-emerald-500 px-8 py-4 text-base font-bold text-white shadow-lg shadow-emerald-500/20 transition-all duration-300 hover:bg-emerald-600 hover:shadow-emerald-600/30 hover:scale-105 active:scale-95"
              >
                <Send className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />
                <span>Contact Us Now</span>
                <ArrowRight className="h-4 w-4 opacity-80 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </motion.div>

          </div>
        </div>

      </div>
    </section>
  );
}




