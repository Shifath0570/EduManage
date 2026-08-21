// import React from "react";
// import {
//     Users,
//     Building2,
//     HeartHandshake,
//     GraduationCap,
// } from "lucide-react";
// import Image from "next/image";

// const AboutSchool = () => {
//     const features = [
//         {
//             icon: Users,
//             title: "Experienced",
//             subtitle: "Teachers",
//         },
//         {
//             icon: Building2,
//             title: "Modern",
//             subtitle: "Infrastructure",
//         },
//         {
//             icon: HeartHandshake,
//             title: "Holistic",
//             subtitle: "Development",
//         },
//         {
//             icon: GraduationCap,
//             title: "Student",
//             subtitle: "Centered",
//         },
//     ];

//     return (
//         <section className="bg-white py-16 md:py-20">
//             <div className="mx-auto max-w-7xl px-5 md:px-8">
//                 <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">

//                     {/* School Image */}
//                     <div className="overflow-hidden rounded-2xl">
//                         <Image
//                             src="https://cdn.pixabay.com/photo/2013/02/10/17/47/girl-80327_1280.jpg"
//                             alt="School Campus"
//                             width={800}
//                             height={500}
//                             className="h-[280px] w-full object-cover sm:h-[350px] lg:h-[330px]"
//                         />
//                     </div>

//                     {/* About Content */}
//                     <div>
//                         <p className="mb-3 text-sm font-semibold text-blue-600">
//                             About School
//                         </p>

//                         <h2 className="max-w-xl text-3xl font-bold leading-tight text-slate-900 md:text-4xl">
//                             Shaping Future Leaders
//                             <br />
//                             With Quality Education
//                         </h2>

//                         <p className="mt-6 max-w-2xl text-base leading-7 text-slate-500">
//                             Our school is dedicated to providing a safe, inclusive, and
//                             inspiring environment where students can grow academically,
//                             socially, and emotionally. We focus on building a strong
//                             foundation for lifelong learning and responsible citizenship.
//                         </p>

//                         {/* Features */}
//                         <div className="mt-8 grid grid-cols-2 gap-x-6 gap-y-6 sm:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4">
//                             {features.map((feature, index) => {
//                                 const Icon = feature.icon;

//                                 return (
//                                     <div
//                                         key={index}
//                                         className="flex items-center gap-3"
//                                     >
//                                         <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50">
//                                             <Icon className="h-6 w-6 text-blue-600" strokeWidth={1.8} />
//                                         </div>

//                                         <div>
//                                             <p className="text-sm font-semibold text-slate-800">
//                                                 {feature.title}
//                                             </p>
//                                             <p className="text-sm text-slate-500">
//                                                 {feature.subtitle}
//                                             </p>
//                                         </div>
//                                     </div>
//                                 );
//                             })}
//                         </div>
//                     </div>

//                 </div>
//             </div>
//         </section>
//     );
// };

// export default AboutSchool;



import React from "react";
import Image from "next/image";
import { Users, Building2, HeartHandshake, GraduationCap } from "lucide-react";

export function AboutSchool() {
  const features = [
    { icon: Users, title: "Experienced", subtitle: "Teachers" },
    { icon: Building2, title: "Modern", subtitle: "Infrastructure" },
    { icon: HeartHandshake, title: "Holistic", subtitle: "Development" },
    { icon: GraduationCap, title: "Student", subtitle: "Centered" },
  ];

  return (
    <section className="bg-white py-16 md:py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          {/* School Image */}
          <div className="relative overflow-hidden rounded-2xl shadow-lg border border-slate-100">
            <Image
              src="https://cdn.pixabay.com/photo/2013/02/10/17/47/girl-80327_1280.jpg"
              alt="School Campus"
              width={800}
              height={500}
              className="h-[320px] w-full object-cover sm:h-[400px] lg:h-[420px]"
            />
          </div>

          {/* About Content */}
          <div>
            <p className="text-xs font-bold tracking-wider uppercase text-blue-600">
              About School
            </p>
            <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-[#03204c] sm:text-4xl">
              Shaping Future Leaders With Quality Education
            </h2>
            <div className="mt-3 h-1.5 w-12 rounded-full bg-blue-600" />

            <p className="mt-6 text-base leading-relaxed text-slate-600 sm:text-lg">
              Our institution is dedicated to providing a safe, inclusive, and
              inspiring environment where students can grow academically,
              socially, and emotionally. We focus on building a strong
              foundation for lifelong learning and responsible citizenship.
            </p>

            {/* Highlights Grid */}
            <div className="mt-8 grid grid-cols-2 gap-6 sm:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4">
              {features.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <div key={index} className="flex items-center gap-3">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-50">
                      <Icon className="h-6 w-6 text-blue-600" strokeWidth={1.8} />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-800">
                        {feature.title}
                      </p>
                      <p className="text-xs font-medium text-slate-500">
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


