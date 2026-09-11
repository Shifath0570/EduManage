// import Image from "next/image";
// import { HiSpeakerphone } from "react-icons/hi";
// import { ArrowRight } from "lucide-react";
// import { getNotices } from "../lib/data";
// import { NoticeItem } from "@/types/types";
// import Link from "next/link";



// export default async function Notice() {
//   const noticesData = await getNotices();
//   const notice = Array.isArray(noticesData) ? noticesData.slice(0, 5) : [];

//   const blogPosts = [
//     {
//       id: 1,
//       title: "10 Effective Study Tips for Students",
//       description: "Discover practical study tips that help students improve focus and academic performance.",
//       date: "May 10, 2025",
//       image: "/images/Blog1.jpg",
//       slug: "study-tips"
//     },
//     {
//       id: 2,
//       title: "How to Prepare for Exams",
//       description: "Learn effective exam preparation strategies that reduce stress and improve results.",
//       date: "May 8, 2025",
//       image: "/images/Blog2.jpg",
//       slug: "exam-preparation"
//     },
//     {
//       id: 3,
//       title: "The Future of Education Technology",
//       description: "Explore how technology is transforming the way students learn and teachers teach.",
//       date: "May 5, 2025",
//       image: "/images/Blog3.jpg",
//       slug: "education-technology"
//     }
//   ];

//   return (
//     <section className="bg-[#f8fafc] py-16 md:py-20 border-t border-slate-100">
//       <div className="container mx-auto px-4 sm:px-6 lg:px-8">
//         <div className="grid grid-cols-1 gap-10 lg:grid-cols-12">
//           {/* Notice Board */}
//           <div className="flex flex-col rounded-2xl border border-slate-200/80 bg-white shadow-xs lg:col-span-5">
//             <div className="flex items-center justify-between border-b border-slate-100 p-6">
//               <h3 className="text-xl font-bold text-[#03204c]">Notice Board</h3>
//               <Link href="/notice" className="text-xs font-semibold text-blue-600 hover:text-blue-700">
//                 View All →
//               </Link>
//             </div>

//             <div className="divide-y divide-slate-100 p-2">
//               {notice.length > 0 ? (
//                 notice.map((item: NoticeItem) => (
//                   <Link
//                     href={`/notice/${item._id}`}
//                     key={item._id}
//                     className="flex items-start gap-3 rounded-xl p-4 transition-colors hover:bg-slate-50"
//                   >
//                     <span className="mt-0.5 shrink-0 text-blue-600">
//                       <HiSpeakerphone className="h-5 w-5" />
//                     </span>
//                     <div className="flex-1">
//                       <p className="text-sm font-semibold text-slate-800 line-clamp-2">
//                         {item.title}
//                       </p>
//                       <span className="mt-1 block text-xs text-slate-400">
//                         {item.issuedDate
//                           ? new Date(item.issuedDate).toLocaleDateString('en-IN', {
//                               day: '2-digit',
//                               month: 'short',
//                               year: 'numeric'
//                             })
//                           : 'No Date'}
//                       </span>
//                     </div>
//                   </Link>
//                 ))
//               ) : (
//                 <div className="text-center py-10 text-gray-500">
//                   No notices available
//                 </div>
//               )}
//             </div>
//           </div>

//           {/* Latest Blog */}
//           <div className="flex flex-col rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs lg:col-span-7">
//             <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-6">
//               <h3 className="text-xl font-bold text-[#03204c]">Latest Blog</h3>
//               <Link href="/blog" className="text-xs font-semibold text-blue-600 hover:text-blue-700">
//                 View All →
//               </Link>
//             </div>

//             <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
//               {blogPosts.map((post) => (
//                 <div
//                   key={post.id}
//                   className="group flex flex-col overflow-hidden rounded-xl border border-slate-200/80 bg-white shadow-2xs transition-all hover:shadow-md"
//                 >
//                   <div className="relative h-36 w-full overflow-hidden bg-slate-100">
//                     <Image
//                       src={post.image}
//                       alt={post.title}
//                       fill
//                       sizes="(max-width: 768px) 100vw, 200px"
//                       className="object-cover transition-transform duration-300 group-hover:scale-105"
//                       priority={post.id === 1}
//                     />
//                   </div>
//                   <div className="flex flex-1 flex-col p-4">
//                     <h4 className="text-sm font-bold text-slate-800 line-clamp-2 group-hover:text-blue-600">
//                       {post.title}
//                     </h4>
//                     <p className="mt-2 text-xs leading-relaxed text-slate-500 line-clamp-2">
//                       {post.description}
//                     </p>
//                     <div className="mt-auto pt-4 flex items-center justify-between text-[11px] font-medium text-slate-400">
//                       <span>{post.date}</span>
//                       <Link
//                         href={`/blog/${post.slug}`}
//                         className="text-blue-600 group-hover:translate-x-0.5 transition-transform flex items-center gap-1 font-semibold"
//                       >
//                         Read <ArrowRight className="h-3 w-3" />
//                       </Link>
//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// }

import Image from "next/image";
import Link from "next/link";
import {
  FaBullhorn,
  FaCalendarAlt,
  FaArrowRight,
  FaChevronRight,
  FaRegClock,
} from "react-icons/fa";
import { getNotices } from "../lib/data";
import { NoticeItem } from "@/types/types";

export default async function Notice() {
  const noticesData = await getNotices();
  const notice = Array.isArray(noticesData) ? noticesData.slice(0, 5) : [];

  const blogPosts = [
    {
      id: 1,
      title: "10 Effective Study Tips for Students",
      description:
        "Discover practical study tips that help students improve focus and academic performance.",
      date: "May 10, 2025",
      image: "/images/Blog1.jpg",
      slug: "study-tips",
      category: "Academic Excellence",
    },
    {
      id: 2,
      title: "How to Prepare for Exams",
      description:
        "Learn effective exam preparation strategies that reduce stress and improve results.",
      date: "May 8, 2025",
      image: "/images/Blog2.jpg",
      slug: "exam-preparation",
      category: "Exam Strategies",
    },
    {
      id: 3,
      title: "The Future of Education Technology",
      description:
        "Explore how technology is transforming the way students learn and teachers teach.",
      date: "May 5, 2025",
      image: "/images/Blog3.jpg",
      slug: "education-technology",
      category: "EdTech Insights",
    },
  ];

  return (
    <section className="relative overflow-hidden bg-slate-50 py-16 md:py-24 border-t border-slate-200/60">
      {/* Background Decorative Accent Glows */}
      <div className="pointer-events-none absolute -top-24 -left-24 h-96 w-96 rounded-full bg-emerald-500/5 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 right-0 h-96 w-96 rounded-full bg-teal-500/5 blur-3xl" />

      <div className="container relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12">
          
          {/* Notice Board Column */}
          <div className="flex flex-col rounded-3xl border border-slate-200/80 bg-white shadow-xl shadow-slate-200/50 lg:col-span-5">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-100 p-6">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600">
                  <FaBullhorn className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-xl font-bold tracking-tight text-slate-900">
                    Notice Board
                  </h3>
                  <p className="text-xs text-slate-500">
                    Latest announcements & updates
                  </p>
                </div>
              </div>
              <Link
                href="/notice"
                className="group inline-flex items-center gap-1 rounded-lg bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700 transition-colors hover:bg-emerald-100"
              >
                <span>View All</span>
                <FaChevronRight className="h-2.5 w-2.5 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </div>

            {/* Content List */}
            <div className="flex-1 divide-y divide-slate-100 p-3">
              {notice.length > 0 ? (
                notice.map((item: NoticeItem) => {
                  const dateObj = item.issuedDate ? new Date(item.issuedDate) : null;
                  const day = dateObj ? dateObj.getDate() : "--";
                  const month = dateObj
                    ? dateObj.toLocaleString("en-IN", { month: "short" })
                    : "N/A";

                  return (
                    <Link
                      href={`/notice/${item._id}`}
                      key={item._id}
                      className="group flex items-start gap-4 rounded-2xl p-3.5 transition-all duration-200 hover:bg-slate-50/80 hover:shadow-xs"
                    >
                      {/* Date Badge */}
                      <div className="flex h-12 w-12 shrink-0 flex-col items-center justify-center rounded-xl bg-slate-100 text-slate-700 transition-colors group-hover:bg-emerald-600 group-hover:text-white">
                        <span className="text-sm font-extrabold leading-none">
                          {day}
                        </span>
                        <span className="mt-0.5 text-[10px] font-bold uppercase tracking-wider">
                          {month}
                        </span>
                      </div>

                      {/* Item Details */}
                      <div className="flex-1">
                        <h4 className="text-sm font-semibold text-slate-800 line-clamp-2 transition-colors group-hover:text-emerald-600">
                          {item.title}
                        </h4>
                        <div className="mt-1.5 flex items-center gap-2 text-xs text-slate-400">
                          <FaCalendarAlt className="h-3 w-3 text-slate-400" />
                          <span>
                            {item.issuedDate
                              ? new Date(item.issuedDate).toLocaleDateString("en-IN", {
                                  day: "2-digit",
                                  month: "short",
                                  year: "numeric",
                                })
                              : "No Date"}
                          </span>
                        </div>
                      </div>
                    </Link>
                  );
                })
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-slate-400">
                  <FaBullhorn className="h-8 w-8 text-slate-300" />
                  <p className="mt-2 text-sm font-medium">No notices published yet</p>
                </div>
              )}
            </div>
          </div>

          {/* Latest Blog Column */}
          <div className="flex flex-col rounded-3xl border border-slate-200/80 bg-white p-6 shadow-xl shadow-slate-200/50 lg:col-span-7">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-5 mb-6">
              <div>
                <h3 className="text-xl font-bold tracking-tight text-slate-900">
                  Latest Blog Posts
                </h3>
                <p className="text-xs text-slate-500">
                  Insights, guides, and educational articles
                </p>
              </div>
              <Link
                href="/blog"
                className="group inline-flex items-center gap-1 rounded-lg bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700 transition-colors hover:bg-emerald-100"
              >
                <span>View All</span>
                <FaChevronRight className="h-2.5 w-2.5 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </div>

            {/* Posts Grid */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
              {blogPosts.map((post) => (
                <div
                  key={post.id}
                  className="group flex flex-col overflow-hidden rounded-2xl border border-slate-200/80 bg-white transition-all duration-300 hover:-translate-y-1 hover:border-emerald-500/30 hover:shadow-lg hover:shadow-slate-200/80"
                >
                  {/* Card Thumbnail */}
                  <div className="relative h-40 w-full overflow-hidden bg-slate-100">
                    <Image
                      src={post.image}
                      alt={post.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 300px"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      priority={post.id === 1}
                    />
                    <div className="absolute top-3 left-3 rounded-md bg-slate-900/70 px-2.5 py-1 text-[10px] font-semibold text-white backdrop-blur-md">
                      {post.category}
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="flex flex-1 flex-col p-4">
                    <h4 className="text-sm font-bold text-slate-900 line-clamp-2 transition-colors group-hover:text-emerald-600">
                      {post.title}
                    </h4>
                    <p className="mt-2 text-xs leading-relaxed text-slate-500 line-clamp-2">
                      {post.description}
                    </p>

                    {/* Card Footer */}
                    <div className="mt-auto pt-4 flex items-center justify-between border-t border-slate-100 text-[11px] font-medium text-slate-400">
                      <span className="flex items-center gap-1">
                        <FaRegClock className="h-3 w-3" />
                        {post.date}
                      </span>
                      <Link
                        href={`/blog/${post.slug}`}
                        className="inline-flex items-center gap-1 font-semibold text-emerald-600 transition-colors hover:text-emerald-700"
                      >
                        <span>Read</span>
                        <FaArrowRight className="h-2.5 w-2.5 transition-transform group-hover:translate-x-0.5" />
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}



