
// import React from "react";
// import Image from "next/image";
// import { FaQuoteLeft, FaStar } from "react-icons/fa";

// const testimonials = [
//   {
//     name: "Sadia Rahman",
//     role: "Parent",
//     image: "/images/sadia.png",
//     review:
//       "EduManage has made school management so much easier for our teachers and parents. Highly recommended!",
//   },
//   {
//     name: "Md. Hasan",
//     role: "Teacher",
//     image: "/images/hasan.png",
//     review:
//       "The platform is very user-friendly and helps us to manage everything in a systematic way.",
//   },
//   {
//     name: "Rafiq Ahmed",
//     role: "School Admin",
//     image: "/images/rafiq.png",
//     review:
//       "Great support team and excellent features. It's the best school management system we have used.",
//   },
// ];

// export function Testimonials() {
//   return (
//     <section className="bg-gradient-to-b from-[#f8fbff] to-white py-16 md:py-20 border-b border-slate-100">
//       <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        
//         {/* Section Heading */}
//         <div className="flex flex-col items-center justify-center text-center mb-12">
//           <h2 className="text-3xl font-extrabold tracking-tight text-[#03204c] sm:text-4xl">
//             Testimonials
//           </h2>
//           <div className="mt-3 h-1.5 w-12 rounded-full bg-blue-600" />
//         </div>

//         {/* Testimonials Grid */}
//         <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
//           {testimonials.map((testimonial, index) => (
//             <div
//               key={index}
//               className="flex flex-col justify-between rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs transition-all duration-300 hover:shadow-md"
//             >
//               <div>
//                 {/* Quote Icon */}
//                 <FaQuoteLeft className="mb-3 text-lg text-blue-600" />

//                 {/* Review Text */}
//                 <p className="text-sm leading-relaxed text-slate-600">
//                   {testimonial.review}
//                 </p>

//                 {/* Rating Stars */}
//                 <div className="mt-4 flex gap-1">
//                   {[...Array(5)].map((_, i) => (
//                     <FaStar key={i} className="text-xs text-[#f6a623]" />
//                   ))}
//                 </div>
//               </div>

//               {/* User Profile Info */}
//               <div className="mt-6 flex items-center gap-3 border-t border-slate-100 pt-4">
//                 <div className="relative h-10 w-10 overflow-hidden rounded-full bg-slate-100 border border-slate-200 shrink-0">
//                   <Image
//                     src={testimonial.image}
//                     alt={testimonial.name}
//                     fill
//                     sizes="40px"
//                     className="object-cover"
//                   />
//                 </div>

//                 <div>
//                   <h3 className="text-sm font-bold text-slate-800">
//                     {testimonial.name}
//                   </h3>
//                   <p className="text-xs font-medium text-slate-500">
//                     {testimonial.role}
//                   </p>
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>

//       </div>
//     </section>
//   );
// }


"use client";

import React, { useRef } from "react";
import Image from "next/image";
import { motion, useInView } from "framer-motion";
import { Quote, Star, Sparkles, HeartHandshake } from "lucide-react";

const testimonials = [
  {
    name: "Sadia Rahman",
    role: "Parent of Grade 8 Student",
    image: "/images/sadia.png",
    review:
      "EduManage has made school management so much easier for our teachers and parents. The real-time attendance tracking gives complete peace of mind!",
    rating: 5,
  },
  {
    name: "Md. Hasan",
    role: "Senior Mathematics Teacher",
    image: "/images/hasan.png",
    review:
      "The platform is exceptionally user-friendly. Managing exam scores, daily schedules, and student communications now takes half the time.",
    rating: 5,
  },
  {
    name: "Rafiq Ahmed",
    role: "School Administrator",
    image: "/images/rafiq.png",
    review:
      "Great support team and excellent features! It's easily the best, most comprehensive school management system our institution has deployed.",
    rating: 5,
  },
];

export function Testimonials() {
  const containerRef = useRef(null);
  const isInView = useInView(containerRef, { once: true, margin: "-80px" });

  return (
    <section
      ref={containerRef}
      className="relative overflow-hidden bg-gradient-to-b from-white via-[#EBFBFA]/40 to-[#FFF9EE]/50 py-16 md:py-24"
    >
      {/* Ambient background blur elements */}
      <div className="pointer-events-none absolute top-1/2 left-1/2 h-96 w-[38rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-emerald-200/20 blur-3xl" />
      <div className="pointer-events-none absolute top-10 right-10 h-72 w-72 rounded-full bg-amber-200/20 blur-3xl" />
      <div className="pointer-events-none absolute bottom-10 left-10 h-72 w-72 rounded-full bg-teal-200/20 blur-3xl" />

      <div className="container relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-14 flex flex-col items-center justify-center text-center"
        >
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50/80 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-emerald-600">
            <Sparkles className="h-3.5 w-3.5 fill-emerald-500 text-emerald-500" />
            <span>Community Feedback</span>
          </div>

          <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl lg:text-5xl">
            Trusted by <span className="text-emerald-500">Parents & Staff</span>
          </h2>

          <div className="mt-3 h-1.5 w-16 rounded-full bg-emerald-500" />

          <p className="mt-4 max-w-xl text-sm font-normal text-slate-600 sm:text-base">
            Discover how EduManage streamlines campus administration and strengthens home-school partnerships.
          </p>
        </motion.div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3 lg:gap-8">
          {testimonials.map((item, index) => (
            <motion.div
              key={item.name}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: index * 0.15 }}
              whileHover={{ y: -6 }}
              className="group relative flex flex-col justify-between rounded-3xl border border-white/80 bg-white/70 p-7 backdrop-blur-md shadow-xs transition-all duration-300 hover:border-emerald-300/60 hover:bg-white hover:shadow-xl hover:shadow-emerald-900/5"
            >
              <div>
                {/* Top Row: Quote Icon & Ratings */}
                <div className="flex items-center justify-between">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-emerald-100 bg-emerald-50 text-emerald-600 transition-all duration-300 group-hover:bg-emerald-500 group-hover:text-white">
                    <Quote className="h-5 w-5 fill-current" />
                  </div>

                  <div className="flex items-center gap-1 rounded-full border border-amber-200/60 bg-amber-50/80 px-2.5 py-1">
                    {[...Array(item.rating)].map((_, i) => (
                      <Star
                        key={i}
                        className="h-3.5 w-3.5 fill-amber-400 text-amber-400"
                      />
                    ))}
                  </div>
                </div>

                {/* Review Text */}
                <p className="mt-5 text-sm font-normal leading-relaxed text-slate-600">
                  {item.review}
                </p>
              </div>

              {/* User Profile Info */}
              <div className="mt-8 flex items-center gap-3.5 border-t border-slate-100 pt-5">
                <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-2xl border-2 border-emerald-200/80 bg-emerald-50 shadow-xs transition-transform duration-300 group-hover:scale-105">
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    sizes="44px"
                    className="object-cover"
                  />
                </div>

                <div className="flex flex-col text-left">
                  <h3 className="text-sm font-bold text-slate-900 transition-colors group-hover:text-emerald-600">
                    {item.name}
                  </h3>
                  <p className="text-xs font-semibold text-slate-500">
                    {item.role}
                  </p>
                </div>

                <div className="ml-auto text-emerald-500/40 transition-colors group-hover:text-emerald-500">
                  <HeartHandshake className="h-5 w-5" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}


