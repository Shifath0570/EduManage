
// import React from "react";
// import Image from "next/image";
// import { Users, Building2, HeartHandshake, GraduationCap } from "lucide-react";

// export function AboutSchool() {
//   const features = [
//     { icon: Users, title: "Experienced", subtitle: "Teachers" },
//     { icon: Building2, title: "Modern", subtitle: "Infrastructure" },
//     { icon: HeartHandshake, title: "Holistic", subtitle: "Development" },
//     { icon: GraduationCap, title: "Student", subtitle: "Centered" },
//   ];

//   return (
//     <section className="bg-white py-16 md:py-20">
//       <div className="container mx-auto px-4 sm:px-6 lg:px-8">
//         <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
//           {/* School Image */}
//           <div className="relative overflow-hidden rounded-2xl shadow-lg border border-slate-100">
//             <Image
//               src="https://cdn.pixabay.com/photo/2013/02/10/17/47/girl-80327_1280.jpg"
//               alt="School Campus"
//               width={800}
//               height={500}
//               className="h-[320px] w-full object-cover sm:h-[400px] lg:h-[420px]"
//             />
//           </div>

//           {/* About Content */}
//           <div>
//             <p className="text-xs font-bold tracking-wider uppercase text-blue-600">
//               About School
//             </p>
//             <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-[#03204c] sm:text-4xl">
//               Shaping Future Leaders With Quality Education
//             </h2>
//             <div className="mt-3 h-1.5 w-12 rounded-full bg-blue-600" />

//             <p className="mt-6 text-base leading-relaxed text-slate-600 sm:text-lg">
//               Our institution is dedicated to providing a safe, inclusive, and
//               inspiring environment where students can grow academically,
//               socially, and emotionally. We focus on building a strong
//               foundation for lifelong learning and responsible citizenship.
//             </p>

//             {/* Highlights Grid */}
//             <div className="mt-8 grid grid-cols-2 gap-6 sm:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4">
//               {features.map((feature, index) => {
//                 const Icon = feature.icon;
//                 return (
//                   <div key={index} className="flex items-center gap-3">
//                     <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-50">
//                       <Icon className="h-6 w-6 text-blue-600" strokeWidth={1.8} />
//                     </div>
//                     <div>
//                       <p className="text-sm font-bold text-slate-800">
//                         {feature.title}
//                       </p>
//                       <p className="text-xs font-medium text-slate-500">
//                         {feature.subtitle}
//                       </p>
//                     </div>
//                   </div>
//                 );
//               })}
//             </div>
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// }

import React from "react";
import Image from "next/image";
import { Users, Building2, HeartHandshake, GraduationCap, Sparkles } from "lucide-react";

export function AboutSchool() {
  const features = [
    { icon: Users, title: "Experienced", subtitle: "Teachers" },
    { icon: Building2, title: "Modern", subtitle: "Infrastructure" },
    { icon: HeartHandshake, title: "Holistic", subtitle: "Development" },
    { icon: GraduationCap, title: "Student", subtitle: "Centered" },
  ];

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#FFF9EE] via-[#EBFBFA]/50 to-white py-16 md:py-24">
      {/* Decorative Pastel Background Glows */}
      <div className="absolute top-1/2 left-0 h-80 w-80 -translate-y-1/2 rounded-full bg-emerald-200/30 blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 h-72 w-72 rounded-full bg-sky-200/30 blur-3xl pointer-events-none" />

      {/* Subtle Diamond Decorative Accent */}
      <div className="absolute top-12 right-24 h-2.5 w-2.5 rotate-45 bg-emerald-400 opacity-60" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl relative z-10">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          
          {/* Left Column: Glassmorphic Image Frame */}
          <div className="relative flex justify-center">
            <div className="relative w-full max-w-[550px]">
              
              {/* Outer Border Glow Frame matching Hero Section */}
              <div className="relative rounded-3xl border-2 border-emerald-400/30 bg-white/40 p-3.5 backdrop-blur-md shadow-xl">
                <div className="relative overflow-hidden rounded-2xl">
                  <Image
                    src="https://cdn.pixabay.com/photo/2013/02/10/17/47/girl-80327_1280.jpg"
                    alt="School Campus"
                    width={800}
                    height={500}
                    className="h-[340px] w-full object-cover sm:h-[420px] lg:h-[440px] transition-transform duration-500 hover:scale-105"
                  />
                </div>

                {/* Corner Decorative Badge */}
                <div className="absolute -top-3 -right-3 flex h-10 w-10 items-center justify-center rounded-2xl bg-white text-emerald-500 shadow-md border border-emerald-100">
                  <Sparkles className="h-5 w-5 fill-emerald-400" />
                </div>
              </div>

            </div>
          </div>

          {/* Right Column: About Content */}
          <div className="flex flex-col justify-center">
            
            {/* Section Tag */}
            <div className="inline-flex items-center gap-2 w-max rounded-full border border-emerald-200 bg-emerald-50/80 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-emerald-600">
              <Sparkles className="h-3.5 w-3.5 fill-emerald-500 text-emerald-500" />
              <span>About School</span>
            </div>

            {/* Heading */}
            <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl lg:text-5xl leading-[1.18]">
              Shaping Future Leaders <br className="hidden sm:inline" />
              With <span className="text-emerald-500">Quality Education</span>
            </h2>

            {/* Decorative Underline Accent */}
            <div className="mt-3 h-1.5 w-16 rounded-full bg-emerald-500" />

            {/* Description */}
            <p className="mt-6 text-base leading-relaxed text-slate-600 sm:text-lg">
              Our institution is dedicated to providing a safe, inclusive, and
              inspiring environment where students can grow academically,
              socially, and emotionally. We focus on building a strong
              foundation for lifelong learning and responsible citizenship.
            </p>

            {/* Highlights Grid */}
            <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4">
              {features.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <div
                    key={index}
                    className="flex items-center gap-3 rounded-2xl border border-white/80 bg-white/70 p-3 backdrop-blur-md shadow-xs transition-all hover:bg-white hover:shadow-md hover:border-emerald-200"
                  >
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                      <Icon className="h-5 w-5 stroke-[2.2]" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-900 leading-tight">
                        {feature.title}
                      </p>
                      <p className="text-xs font-semibold text-slate-500">
                        {feature.subtitle}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}




