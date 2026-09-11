
// import {
//   FaGraduationCap,
//   FaShieldAlt,
//   FaUserTie,
//   FaHeart,
//   FaChalkboardTeacher,
// } from "react-icons/fa";

// export function WhyChooseUs() {
//   const features = [
//     {
//       icon: FaGraduationCap,
//       title: "Quality Education",
//       description: "We provide high standard education using modern and effective teaching methods.",
//     },
//     {
//       icon: FaShieldAlt,
//       title: "Safe Environment",
//       description: "We ensure a secure, inclusive, and supportive environment for all students.",
//     },
//     {
//       icon: FaUserTie,
//       title: "Experienced Faculty",
//       description: "Our teachers are highly qualified, dedicated, and experienced in their fields.",
//     },
//     {
//       icon: FaHeart,
//       title: "Holistic Growth",
//       description: "We focus equally on academic excellence, moral values, and physical growth.",
//     },
//     {
//       icon: FaChalkboardTeacher,
//       title: "Parent Partnership",
//       description: "We prioritize open communication and strong partnerships with parents.",
//     },
//   ];

//   return (
//     <section className="bg-white py-16 md:py-20">
//       <div className="container mx-auto px-4 sm:px-6 lg:px-8">
//         <div className="flex flex-col items-center justify-center text-center mb-12">
//           <h2 className="text-3xl font-extrabold tracking-tight text-[#03204c] sm:text-4xl">
//             Why Choose Us
//           </h2>
//           <div className="mt-3 h-1.5 w-12 rounded-full bg-blue-600" />
//         </div>

//         <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-5">
//           {features.map((feature, index) => {
//             const Icon = feature.icon;
//             return (
//               <div
//                 key={index}
//                 className="flex flex-col items-center text-center rounded-2xl border border-slate-100 bg-slate-50/50 p-6 transition-all hover:bg-white hover:shadow-md hover:border-slate-200"
//               >
//                 <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-100 text-blue-600">
//                   <Icon className="h-6 w-6" />
//                 </div>
//                 <h3 className="text-base font-bold text-slate-800">
//                   {feature.title}
//                 </h3>
//                 <p className="mt-2 text-xs leading-relaxed text-slate-500">
//                   {feature.description}
//                 </p>
//               </div>
//             );
//           })}
//         </div>
//       </div>
//     </section>
//   );
// }

"use client";

import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";
import {
  GraduationCap,
  ShieldCheck,
  UserCheck,
  Heart,
  Users,
  Sparkles,
  CheckCircle2,
} from "lucide-react";

export function WhyChooseUs() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  const features = [
    {
      icon: GraduationCap,
      title: "Quality Education",
      description:
        "High-standard curriculum using modern, effective, and interactive teaching methodologies.",
    },
    {
      icon: ShieldCheck,
      title: "Safe Environment",
      description:
        "A secure, inclusive, and highly supportive campus for all students to thrive.",
    },
    {
      icon: UserCheck,
      title: "Experienced Faculty",
      description:
        "Qualified, dedicated educators committed to mentoring and academic excellence.",
    },
    {
      icon: Heart,
      title: "Holistic Growth",
      description:
        "Balanced development focusing on academics, moral values, and extracurriculars.",
    },
    {
      icon: Users,
      title: "Parent Partnership",
      description:
        "Transparent communication and collaborative relationships with families.",
    },
  ];

  return (
    <section
      ref={ref}
      className="relative overflow-hidden bg-gradient-to-b from-[#FFF9EE]/50 via-[#EBFBFA]/40 to-white py-16 md:py-24"
    >
      {/* Background Ambient Blurs & Patterns */}
      <div className="pointer-events-none absolute top-1/2 left-1/2 h-96 w-[36rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-emerald-200/20 blur-3xl" />
      <div className="pointer-events-none absolute top-12 left-10 h-72 w-72 rounded-full bg-teal-200/20 blur-3xl" />
      <div className="pointer-events-none absolute bottom-12 right-10 h-80 w-80 rounded-full bg-amber-200/20 blur-3xl" />

      <div className="container relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-14 flex flex-col items-center justify-center text-center"
        >
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50/80 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-emerald-600">
            <Sparkles className="h-3.5 w-3.5 fill-emerald-500 text-emerald-500" />
            <span>Our Commitment</span>
          </div>

          <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl lg:text-5xl">
            Why Choose <span className="text-emerald-500">EduManage</span>
          </h2>

          <div className="mt-3 h-1.5 w-16 rounded-full bg-emerald-500" />

          <p className="mt-4 max-w-xl text-sm font-normal text-slate-600 sm:text-base">
            Empowering students with standard-setting education, modern safety, and personal growth tools.
          </p>
        </motion.div>

        {/* 5-Column Responsive Cards Grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-5">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -6 }}
                className="group relative flex flex-col items-start rounded-3xl border border-white/80 bg-white/70 p-6 backdrop-blur-md shadow-xs transition-all duration-300 hover:border-emerald-300/60 hover:bg-white hover:shadow-xl hover:shadow-emerald-900/5"
              >
                {/* Icon Container matching FeaturedSection */}
                <div className="flex h-13 w-13 items-center justify-center rounded-2xl border border-emerald-100/80 bg-emerald-50 text-emerald-600 shadow-xs transition-all duration-300 group-hover:scale-110 group-hover:bg-emerald-500 group-hover:text-white">
                  <Icon className="h-6 w-6 stroke-[2]" />
                </div>

                <h3 className="mt-5 text-base font-bold text-slate-900 transition-colors group-hover:text-emerald-600">
                  {feature.title}
                </h3>

                <p className="mt-2 text-xs font-normal leading-relaxed text-slate-600">
                  {feature.description}
                </p>

                <div className="mt-4 flex items-center gap-1 text-[11px] font-semibold text-emerald-600 opacity-0 transition-opacity group-hover:opacity-100">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                  <span>Verified Standard</span>
                </div>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}



