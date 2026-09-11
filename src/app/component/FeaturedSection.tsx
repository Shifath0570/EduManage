
// import React from "react";
// import {
//   UserRound,
//   UsersRound,
//   ClipboardCheck,
//   FileText,
//   MessageSquare,
//   ChartNoAxesCombined,
// } from "lucide-react";

// export function FeaturedSection() {
//   const features = [
//     {
//       title: "Student Management",
//       description:
//         "Manage student profiles, admissions, attendance, and academic records efficiently.",
//       icon: UserRound,
//       iconColor: "text-blue-600",
//       bgColor: "bg-blue-50",
//     },
//     {
//       title: "Teacher Management",
//       description:
//         "Assign classes, manage faculty profiles, and track teaching activity seamlessly.",
//       icon: UsersRound,
//       iconColor: "text-emerald-600",
//       bgColor: "bg-emerald-50",
//     },
//     {
//       title: "Attendance System",
//       description:
//         "Record and analyze attendance rates with accurate automated reporting tools.",
//       icon: ClipboardCheck,
//       iconColor: "text-blue-600",
//       bgColor: "bg-blue-50",
//     },
//     {
//       title: "Examination & Results",
//       description:
//         "Create exams, log scores, and generate performance reports instantaneously.",
//       icon: FileText,
//       iconColor: "text-blue-600",
//       bgColor: "bg-blue-50",
//     },
//     {
//       title: "Notice & Communication",
//       description:
//         "Broadcasting notices, updates, and events directly to parents and students.",
//       icon: MessageSquare,
//       iconColor: "text-purple-600",
//       bgColor: "bg-purple-50",
//     },
//     {
//       title: "Reports & Analytics",
//       description:
//         "Access real-time analytical insights for smarter administrative decision-making.",
//       icon: ChartNoAxesCombined,
//       iconColor: "text-teal-600",
//       bgColor: "bg-teal-50",
//     },
//   ];

//   return (
//     <section id="features" className="bg-[#f8fafc] py-16 md:py-20 border-y border-slate-100">
//       <div className="container mx-auto px-4 sm:px-6 lg:px-8">
//         <div className="flex flex-col items-center justify-center text-center mb-12">
//           <h2 className="text-3xl font-extrabold tracking-tight text-[#03204c] sm:text-4xl">
//             Platform Features
//           </h2>
//           <div className="mt-3 h-1.5 w-12 rounded-full bg-blue-600" />
//         </div>

//         <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
//           {features.map((feature) => {
//             const Icon = feature.icon;
//             return (
//               <div
//                 key={feature.title}
//                 className="flex flex-col items-center rounded-2xl border border-slate-200/80 bg-white p-6 text-center shadow-xs transition-all duration-300 hover:-translate-y-1 hover:shadow-md"
//               >
//                 <div
//                   className={`flex h-14 w-14 items-center justify-center rounded-2xl ${feature.bgColor} ${feature.iconColor}`}
//                 >
//                   <Icon className="h-7 w-7" strokeWidth={1.8} />
//                 </div>
//                 <h3 className="mt-5 text-base font-bold text-slate-800">
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

import React from "react";
import { motion } from "framer-motion";
import {
  UserRound,
  UsersRound,
  ClipboardCheck,
  FileText,
  MessageSquare,
  ChartNoAxesCombined,
  Sparkles,
} from "lucide-react";

export function FeaturedSection() {
  const features = [
    {
      title: "Student Management",
      description:
        "Manage student profiles, admissions, attendance, and academic records efficiently.",
      icon: UserRound,
    },
    {
      title: "Teacher Management",
      description:
        "Assign classes, manage faculty profiles, and track teaching activity seamlessly.",
      icon: UsersRound,
    },
    {
      title: "Attendance System",
      description:
        "Record and analyze attendance rates with accurate automated reporting tools.",
      icon: ClipboardCheck,
    },
    {
      title: "Examination & Results",
      description:
        "Create exams, log scores, and generate performance reports instantaneously.",
      icon: FileText,
    },
    {
      title: "Notice & Communication",
      description:
        "Broadcasting notices, updates, and events directly to parents and students.",
      icon: MessageSquare,
    },
    {
      title: "Reports & Analytics",
      description:
        "Access real-time analytical insights for smarter administrative decision-making.",
      icon: ChartNoAxesCombined,
    },
  ];

  return (
    <section id="features" className="relative overflow-hidden bg-gradient-to-b from-white via-[#EBFBFA]/40 to-[#FFF9EE]/50 py-16 md:py-24">
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 h-96 w-[36rem] rounded-full bg-emerald-200/20 blur-3xl pointer-events-none" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl relative z-10">
        
        {/* Header Animation */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex flex-col items-center justify-center text-center mb-14"
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50/80 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-emerald-600 mb-3">
            <Sparkles className="h-3.5 w-3.5 fill-emerald-500 text-emerald-500" />
            <span>Core Capabilities</span>
          </div>

          <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl lg:text-5xl">
            Platform <span className="text-emerald-500">Features</span>
          </h2>

          <div className="mt-3 h-1.5 w-16 rounded-full bg-emerald-500" />
          
          <p className="mt-4 max-w-xl text-sm sm:text-base text-slate-600 font-normal">
            Everything you need to streamline educational workflows and enhance campus productivity.
          </p>
        </motion.div>

        {/* Feature Cards Grid with Staggered Scroll Animations */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -6 }}
                className="group relative flex flex-col items-start rounded-3xl border border-white/80 bg-white/70 p-7 backdrop-blur-md shadow-xs transition-colors duration-300 hover:bg-white hover:border-emerald-300/60 hover:shadow-xl hover:shadow-emerald-900/5"
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-100/80 shadow-xs transition-all duration-300 group-hover:scale-110 group-hover:bg-emerald-500 group-hover:text-white">
                  <Icon className="h-7 w-7 stroke-[2]" />
                </div>

                <h3 className="mt-6 text-lg font-bold text-slate-900 transition-colors group-hover:text-emerald-600">
                  {feature.title}
                </h3>
                
                <p className="mt-2 text-sm leading-relaxed text-slate-600 font-normal">
                  {feature.description}
                </p>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}



