
// import React from "react";
// import { Card } from "@heroui/react";
// import {
//   FaUsers,
//   FaChalkboardTeacher,
//   FaSchool,
//   FaBookOpen,
//   FaShieldAlt,
//   FaTrophy,
// } from "react-icons/fa";

// const statsData = [
//   {
//     id: "students",
//     value: "500+",
//     label: "Total Students",
//     icon: <FaUsers className="h-6 w-6" />,
//     iconBg: "bg-blue-100",
//     iconColor: "text-blue-600",
//     valueColor: "text-blue-600",
//   },
//   {
//     id: "teachers",
//     value: "50+",
//     label: "Teachers",
//     icon: <FaChalkboardTeacher className="h-6 w-6" />,
//     iconBg: "bg-emerald-100",
//     iconColor: "text-emerald-600",
//     valueColor: "text-emerald-600",
//   },
//   {
//     id: "classes",
//     value: "25+",
//     label: "Classes",
//     icon: <FaSchool className="h-6 w-6" />,
//     iconBg: "bg-amber-100",
//     iconColor: "text-amber-600",
//     valueColor: "text-amber-600",
//   },
//   {
//     id: "subjects",
//     value: "15+",
//     label: "Subjects",
//     icon: <FaBookOpen className="h-6 w-6" />,
//     iconBg: "bg-purple-100",
//     iconColor: "text-purple-600",
//     valueColor: "text-purple-600",
//   },
//   {
//     id: "attendance",
//     value: "98%",
//     label: "Attendance Rate",
//     icon: <FaShieldAlt className="h-6 w-6" />,
//     iconBg: "bg-teal-100",
//     iconColor: "text-teal-600",
//     valueColor: "text-teal-600",
//   },
//   {
//     id: "exams",
//     value: "100+",
//     label: "Exams Conducted",
//     icon: <FaTrophy className="h-6 w-6" />,
//     iconBg: "bg-pink-100",
//     iconColor: "text-pink-600",
//     valueColor: "text-pink-600",
//   },
// ];

// export function StatisticsSection() {
//   return (
//     <section className="bg-white py-16 md:py-20">
//       <div className="container mx-auto px-4 sm:px-6 lg:px-8">
//         <div className="flex flex-col items-center justify-center text-center mb-12">
//           <h2 className="text-3xl font-extrabold tracking-tight text-[#03204c] sm:text-4xl">
//             Statistics
//           </h2>
//           <div className="mt-3 h-1.5 w-12 rounded-full bg-blue-600" />
//         </div>

//         <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
//           {statsData.map((stat) => (
//             <Card
//               key={stat.id}
//               className="border border-slate-200/80 bg-white shadow-xs hover:shadow-md transition-all duration-300 rounded-2xl"
//             >
//               <div className="flex flex-col items-center justify-center p-6 text-center">
//                 <div
//                   className={`flex h-12 w-12 items-center justify-center rounded-2xl mb-4 ${stat.iconBg} ${stat.iconColor}`}
//                 >
//                   {stat.icon}
//                 </div>
//                 <span className={`text-3xl font-extrabold tracking-tight ${stat.valueColor}`}>
//                   {stat.value}
//                 </span>
//                 <span className="mt-1 text-xs font-semibold text-slate-600">
//                   {stat.label}
//                 </span>
//               </div>
//             </Card>
//           ))}
//         </div>
//       </div>
//     </section>
//   );
// }


"use client";

import React, { useEffect, useState, useRef } from "react";
import { motion, useInView } from "framer-motion";
import {
  Users,
  GraduationCap,
  School,
  BookOpen,
  ShieldCheck,
  Trophy,
  Sparkles,
} from "lucide-react";

interface StatItemProps {
  id: string;
  targetValue: number;
  suffix?: string;
  label: string;
  icon: React.ElementType;
  delay: number;
  inView: boolean;
}

const statsData = [
  {
    id: "students",
    targetValue: 500,
    suffix: "+",
    label: "Total Students",
    icon: Users,
  },
  {
    id: "teachers",
    targetValue: 50,
    suffix: "+",
    label: "Teachers",
    icon: GraduationCap,
  },
  {
    id: "classes",
    targetValue: 25,
    suffix: "+",
    label: "Classes",
    icon: School,
  },
  {
    id: "subjects",
    targetValue: 15,
    suffix: "+",
    label: "Subjects",
    icon: BookOpen,
  },
  {
    id: "attendance",
    targetValue: 98,
    suffix: "%",
    label: "Attendance Rate",
    icon: ShieldCheck,
  },
  {
    id: "exams",
    targetValue: 100,
    suffix: "+",
    label: "Exams Conducted",
    icon: Trophy,
  },
];

function StatCard({
  targetValue,
  suffix = "",
  label,
  icon: Icon,
  delay,
  inView,
}: StatItemProps) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!inView) return;

    const duration = 1800; // ms
    const startTime = performance.now();

    const animate = (currentTime: number) => {
      const progress = Math.min((currentTime - startTime) / duration, 1);
      // Cubic ease-out curve
      const easedProgress = 1 - Math.pow(1 - progress, 3);

      setCount(Math.floor(targetValue * easedProgress));

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [inView, targetValue]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay }}
      whileHover={{ y: -6 }}
      className="group relative flex flex-col items-center justify-center rounded-3xl border border-white/80 bg-white/70 p-6 text-center backdrop-blur-md shadow-xs transition-colors duration-300 hover:border-emerald-300/60 hover:bg-white hover:shadow-xl hover:shadow-emerald-900/5"
    >
      {/* Icon Wrapper matching FeaturedSection */}
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-emerald-100/80 bg-emerald-50 text-emerald-600 shadow-xs transition-all duration-300 group-hover:scale-110 group-hover:bg-emerald-500 group-hover:text-white">
        <Icon className="h-7 w-7 stroke-[2]" />
      </div>

      {/* Animated Counter */}
      <div className="mt-5 flex items-baseline justify-center gap-0.5">
        <span className="text-3xl font-extrabold tracking-tight text-slate-900 transition-colors group-hover:text-emerald-600 sm:text-4xl">
          {count}
        </span>
        <span className="text-2xl font-extrabold text-emerald-500 sm:text-3xl">
          {suffix}
        </span>
      </div>

      {/* Label */}
      <p className="mt-1.5 text-xs font-semibold leading-snug text-slate-600 sm:text-sm">
        {label}
      </p>
    </motion.div>
  );
}

export function StatisticsSection() {
  const containerRef = useRef(null);
  const isInView = useInView(containerRef, { once: true, margin: "-80px" });

  return (
    <section
      ref={containerRef}
      className="relative overflow-hidden bg-gradient-to-b from-white via-[#EBFBFA]/40 to-[#FFF9EE]/50 py-16 md:py-24"
    >
      {/* Ambient background blur elements matching Hero and FeaturedSection */}
      <div className="pointer-events-none absolute top-1/3 left-1/2 h-96 w-[36rem] -translate-x-1/2 rounded-full bg-emerald-200/20 blur-3xl" />
      <div className="pointer-events-none absolute top-10 right-10 h-64 w-64 rounded-full bg-sky-200/20 blur-3xl" />
      <div className="pointer-events-none absolute bottom-10 left-10 h-72 w-72 rounded-full bg-amber-200/20 blur-3xl" />

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
            <span>Key Metrics</span>
          </div>

          <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl lg:text-5xl">
            Campus <span className="text-emerald-500">Statistics</span>
          </h2>

          <div className="mt-3 h-1.5 w-16 rounded-full bg-emerald-500" />

          <p className="mt-4 max-w-xl text-sm font-normal text-slate-600 sm:text-base">
            Real-time numbers showcasing institutional activity, academic reach, and community growth.
          </p>
        </motion.div>

        {/* 6-Column Responsive Card Grid */}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6 lg:gap-6">
          {statsData.map((stat, index) => (
            <StatCard
              key={stat.id}
              id={stat.id}
              targetValue={stat.targetValue}
              suffix={stat.suffix}
              label={stat.label}
              icon={stat.icon}
              delay={index * 0.1}
              inView={isInView}
            />
          ))}
        </div>

      </div>
    </section>
  );
}


