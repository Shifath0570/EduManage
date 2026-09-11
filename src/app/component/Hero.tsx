// import Image from "next/image";
// import Link from "next/link";

// const Hero = () => {
//     return (
//         <div className="bg-[url('/images/Schools.png')] bg-cover bg-center bg-no-repeat">
//             {/* Overlay */}
//             <div className="bg-[#0B386C]/80">
//                 <div className="container mx-auto flex flex-col justify-center  bg-none lg:bg-[url('/images/Students.png')] bg-[length:800px_auto] bg-no-repeat bg-right-bottom min-h-[600px]  px-4">
//                     {/* Text */}
//                     <div className="max-w-[700px] ">
//                         <h1 className="font-bold text-5xl text-white  leading-snug">Empowering Education Through Smart Management</h1>
//                         <p className="text-white text-xl py-4 max-w-[600px]">EduManage is a complet school management platform that simplifies administration, enhances learing, and connects students, teachers, and parents in one place</p>

//                     </div>
//                     {/* Links */}
//                     <div className="flex gap-4 items-center">
//                         <Link href="#" className="px-5 py-3 text-white font-bold bg-blue-500 hover:bg-blue-600 transition rounded-md">Get Started</Link>
//                         <Link href="#" className="px-5 py-3 text-white font-bold bg-none hover:bg-white hover:text-gray-800 transition border border-2 rounded-md">Explore Features</Link>
//                     </div>
//                     {/* Reviews */}
//                     <div className="flex items-center py-6 gap-4">
//                         <Image src="/images/Comments.png" height={10} width={200} alt="Reviews"/>
//                         <p className="font-bold w-[200px] text-white">Tursted by 500+ Schools and 50,000 Users</p>
//                     </div>
//                 </div>

//             </div>
//         </div>
//     );
// };

// export default Hero;


"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { CheckCircle2, Star, Sparkles } from "lucide-react";

const Hero = () => {
  return (
    <section className="relative min-h-screen overflow-hidden bg-gradient-to-br from-[#E2F7F5] via-[#FFFBF2] to-[#DDF5EC] pt-32 pb-20 lg:pt-40 lg:pb-28">
      {/* Background Patterns */}
      <div className="absolute inset-0 bg-[radial-gradient(#10b981_0.75px,transparent_0.75px)] [background-size:24px_24px] opacity-15 pointer-events-none" />

      <div className="absolute top-12 left-10 h-96 w-96 rounded-full bg-emerald-200/30 blur-3xl pointer-events-none" />
      <div className="absolute top-1/4 right-8 h-[28rem] w-[28rem] rounded-full bg-sky-200/30 blur-3xl pointer-events-none" />

      {/* Animated Floating Sparkles & Diamonds */}
      <motion.div
        animate={{ y: [0, -12, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-36 left-12"
      >
        <Sparkles className="h-5 w-5 text-purple-400 opacity-60" />
      </motion.div>

      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        className="absolute top-1/2 left-8 h-2.5 w-2.5 bg-emerald-400 opacity-50"
      />

      <motion.div
        animate={{ scale: [1, 1.4, 1] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-1/3 right-1/2 h-2 w-2 rotate-45 bg-amber-400 opacity-60"
      />

      <div className="container mx-auto px-6 max-w-7xl relative z-10">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12">
          
          {/* Left Column Text Reveal */}
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="lg:col-span-6 flex flex-col justify-center space-y-7"
          >
            <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl lg:text-[56px] leading-[1.15]">
              Empowering Education <br />
              <span className="text-emerald-500">Smart Management</span>
            </h1>

            <p className="max-w-xl text-base sm:text-lg text-slate-700 leading-relaxed font-normal">
              EduManage is a complete school management platform that simplifies administration, enhances learning, and seamlessly connects students, teachers, and parents in one place.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-1">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link
                  href="/auth/Login"
                  className="inline-flex items-center justify-center rounded-full bg-emerald-500 px-8 py-3.5 text-base font-bold text-white shadow-md shadow-emerald-500/20 hover:bg-emerald-600"
                >
                  Get Started
                </Link>
              </motion.div>

              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link
                  href="/about"
                  className="inline-flex items-center justify-center rounded-full border border-slate-900 px-8 py-3.5 text-base font-bold text-slate-900 bg-white/20 hover:bg-white hover:shadow-sm"
                >
                  Explore Features
                </Link>
              </motion.div>
            </div>

            <div className="pt-4 flex flex-wrap items-center gap-6 text-sm font-semibold text-slate-900">
              {["Instant Setup", "Role-Based Access", "24/7 Support"].map((item, idx) => (
                <motion.div 
                  key={item}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + idx * 0.15, duration: 0.5 }}
                  className="flex items-center gap-2"
                >
                  <CheckCircle2 className="h-5 w-5 text-emerald-500 stroke-[2.2]" />
                  <span>{item}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Right Column Graphic Frame Animation */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="lg:col-span-6 relative flex justify-center lg:justify-end"
          >
            <div className="relative w-full max-w-[540px]">
              <div className="relative rounded-[2rem] border-2 border-emerald-300/40 bg-white/30 p-3.5 backdrop-blur-sm shadow-xl">
                <Image
                  src="/images/Students.png"
                  width={600}
                  height={450}
                  alt="Students learning together"
                  className="w-full h-auto rounded-[1.5rem] object-cover"
                  priority
                />

                {/* Animated Floating Reviews Card */}
                <motion.div 
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.6, duration: 0.6 }}
                  whileHover={{ y: -5 }}
                  className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-[88%] sm:w-[78%] rounded-2xl border border-white/90 bg-white/90 px-6 py-4 backdrop-blur-xl shadow-lg text-center flex flex-col items-center justify-center gap-1"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-base font-bold text-slate-900">Reviews</span>
                    <div className="flex items-center gap-0.5 text-amber-400">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-amber-400" />
                      ))}
                    </div>
                  </div>
                  <p className="text-xs font-semibold text-slate-700">
                    Trusted by <span className="text-slate-900 font-bold">500+ Schools</span> and <span className="text-slate-900 font-bold">50,000+ Users</span>
                  </p>
                </motion.div>
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};

export default Hero;


