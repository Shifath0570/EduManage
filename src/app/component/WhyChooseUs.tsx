// import {
//   FaGraduationCap,
//   FaShieldAlt,
//   FaUserTie,
//   FaHeart,
//   FaChalkboardTeacher,
// } from "react-icons/fa";

// const features = [
//   {
//     icon: FaGraduationCap,
//     title: "Quality Education",
//     description:
//       "We provide quality education with modern teaching methods.",
//   },
//   {
//     icon: FaShieldAlt,
//     title: "Safe Environment",
//     description:
//       "We ensure a safe and supportive environment for all students.",
//   },
//   {
//     icon: FaUserTie,
//     title: "Experienced Teachers",
//     description:
//       "Our teachers are highly qualified and experienced in their fields.",
//   },
//   {
//     icon: FaHeart,
//     title: "Holistic Development",
//     description:
//       "We focus on academic, physical, and moral development.",
//   },
//   {
//     icon: FaChalkboardTeacher,
//     title: "Parental Involvement",
//     description:
//       "We believe in strong communication and partnership with parents.",
//   },
// ];

// export default function WhyChooseUs() {
//   return (
//     <section className="bg-[#f7faff] py-10 sm:py-12">
//       <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

//         {/* Heading */}
//         <div className="mb-8 text-center">
//           <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#03204c]">
//             Why Choose Us
//           </h2>

//          <div className="mx-auto mt-2 h-[8px] w-12 rounded-full bg-blue-500" />
//         </div>

//         {/* Features */}
//         <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-5 lg:gap-5">
//           {features.map((feature, index) => {
//             const Icon = feature.icon;

//             return (
//               <div
//                 key={index}
//                 className="flex flex-col items-center text-center"
//               >
//                 {/* Icon */}
//                 <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-50">
//                   <Icon className="text-[25px] text-blue-500" />
//                 </div>

//                 {/* Title */}
//                 <h3 className="text-[15px] font-bold text-gray-900">
//                   {feature.title}
//                 </h3>

//                 {/* Description */}
//                 <p className="mt-2 max-w-[190px] text-[12px] leading-5 text-gray-600">
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



import {
  FaGraduationCap,
  FaShieldAlt,
  FaUserTie,
  FaHeart,
  FaChalkboardTeacher,
} from "react-icons/fa";

export function WhyChooseUs() {
  const features = [
    {
      icon: FaGraduationCap,
      title: "Quality Education",
      description: "We provide high standard education using modern and effective teaching methods.",
    },
    {
      icon: FaShieldAlt,
      title: "Safe Environment",
      description: "We ensure a secure, inclusive, and supportive environment for all students.",
    },
    {
      icon: FaUserTie,
      title: "Experienced Faculty",
      description: "Our teachers are highly qualified, dedicated, and experienced in their fields.",
    },
    {
      icon: FaHeart,
      title: "Holistic Growth",
      description: "We focus equally on academic excellence, moral values, and physical growth.",
    },
    {
      icon: FaChalkboardTeacher,
      title: "Parent Partnership",
      description: "We prioritize open communication and strong partnerships with parents.",
    },
  ];

  return (
    <section className="bg-white py-16 md:py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-center text-center mb-12">
          <h2 className="text-3xl font-extrabold tracking-tight text-[#03204c] sm:text-4xl">
            Why Choose Us
          </h2>
          <div className="mt-3 h-1.5 w-12 rounded-full bg-blue-600" />
        </div>

        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-5">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className="flex flex-col items-center text-center rounded-2xl border border-slate-100 bg-slate-50/50 p-6 transition-all hover:bg-white hover:shadow-md hover:border-slate-200"
              >
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-100 text-blue-600">
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="text-base font-bold text-slate-800">
                  {feature.title}
                </h3>
                <p className="mt-2 text-xs leading-relaxed text-slate-500">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

