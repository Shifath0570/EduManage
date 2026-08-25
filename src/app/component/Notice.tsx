// import Link from "next/link";
// import { HiSpeakerphone } from "react-icons/hi";
// import { ReactNode } from "react";
// import Image from "next/image";

// // Define the type for a notice item
// interface NoticeItem {
//     id: number;
//     icons: ReactNode;
//     text: string;
//     date: string;
// }

// const notice: NoticeItem[] = [
//     {
//         id: 1,
//         icons: <HiSpeakerphone />,
//         text: "Annual Sports Day will be held on 20th May, 2025",
//         date: "May 12, 2025"
//     },
//     {
//         id: 2,
//         icons: <HiSpeakerphone />,
//         text: "Mid Term Examination from 1st June 2025",
//         date: "May 10, 2025"
//     },
//     {
//         id: 3,
//         icons: <HiSpeakerphone />,
//         text: "School will remain closed on 16 the may, 2025",
//         date: "May 08, 2025"
//     },
//     {
//         id: 4,
//         icons: <HiSpeakerphone />,
//         text: "Parents-Teacher meeting on 25th May, 2025.",
//         date: "May 01, 2025"
//     },
//     {
//         id: 5,
//         icons: <HiSpeakerphone />,
//         text: "New admission process for 2025 has started.",
//         date: "May 12, 2025"
//     },

// ];



// const Notice: React.FC = () => {
//     return (
//         <div className="container mx-auto p-6">
//             <div className="flex flex-col xl:flex-row  justify-between gap-10">
//                 {/* Notice */}
//                 <div className="flex-1 w-full rounded-md shadow-md">
//                     <div className="flex justify-between items-center p-5 bg-[#F5F8FC]">
//                         <h1 className="font-bold text-2xl">Notice Board</h1>
//                         <Link href="#" className="text-blue-500 font-bold">View All</Link>
//                     </div>

//                     {/* notice map */}
//                     {notice.map((item: NoticeItem) => (
//                         <Link href="#" key={item.id}>
//                             <div className="flex items-center justify-between  text-[#858FA1]  text-xl font-bold  last:border-b-0 border-t border-gray-100 py-6 px-2 ">
//                                 <div className="flex items-center gap-3 ">
//                                     <span className="text-blue-500 text-3xl">{item.icons}</span>
//                                     <p>{item.text}</p>
//                                 </div>
//                                 <div>{item.date}</div>
//                             </div>
//                         </Link>
//                     ))}
//                 </div>


//                 {/* Last bolog */}
//                 <div className="flex-1 w-full bg-[#F5F8FC] rounded-md shadow-md px-4">
//                     <div className="flex justify-between items-center py-5 bg-[#F5F8FC]">
//                         <h1 className="font-bold text-2xl">Latest Blog</h1>
//                         <Link href="#" className="text-blue-500 font-bold">View All</Link>
//                     </div>

//                     <div className="flex items-center flex-col lg:flex-row justify-between gap-5">


//                         <div className="rounded-2xl flex-1 w-full bg-white overflow-hidden text-gray-500">
//                             <Image src="/images/Blog1.jpg" height={2000} width={300} alt="Students" className="h-auto w-full" />
//                             <div className="p-4">
//                                 <h1 className="text-xl font-bold text-black">10 Effective Study Tips for Students</h1>
//                                 <p className="line-clamp-3 py-2">Discover practical study tips that help students improve focus and academic</p>
//                                 <p className="py-2">May 10, 2025</p>
//                                 <Link href="#" className="text-blue-500 hover:text-blue-600 transition">Read More →</Link>
//                             </div>
//                         </div>
//                         <div className="rounded-2xl flex-1 w-full bg-white overflow-hidden text-gray-500">
//                             <Image src="/images/Blog2.jpg" height={2000} width={300} alt="Students" className="h-auto w-full" />
//                             <div className="p-4">
//                                 <h1 className="text-xl font-bold text-black">10 Effective Study Tips for Students</h1>
//                                 <p className="line-clamp-3 py-2">Discover practical study tips that help students improve focus and academic</p>
//                                 <p className="py-2">May 10, 2025</p>
//                                 <Link href="#" className="text-blue-500 hover:text-blue-600 transition">Read More →</Link>
//                             </div>
//                         </div>
//                         <div className="rounded-2xl flex-1 w-full bg-white overflow-hidden text-gray-500">
//                             <Image src="/images/Blog3.jpg" height={2000} width={300} alt="Students" className="h-auto w-full" />
//                             <div className="p-4">
//                                 <h1 className="text-xl font-bold text-black">10 Effective Study Tips for Students</h1>
//                                 <p className="line-clamp-3 py-2">Discover practical study tips that help students improve focus and academic</p>
//                                 <p className="py-2">May 10, 2025</p>
//                                 <Link href="#" className="text-blue-500 hover:text-blue-600 transition">Read More →</Link>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default Notice;


import React from "react";
import Link from "next/link";
import Image from "next/image";
<<<<<<< HEAD
import { getNotices } from "../lib/data";


import { NoticeItem } from "@/types/types"; // Import the NoticeItem type


// Make sure this is an async component if using server components
const Notice: React.FC = async () => {
    const noticesData = await getNotices();
    const notice = noticesData.slice(0, 5);
 
    // Blog data (moved to an array for maintainability)
    const blogPosts = [
        {
            id: 1,
            title: "10 Effective Study Tips for Students",
            description: "Discover practical study tips that help students improve focus and academic performance.",
            date: "May 10, 2025",
            image: "/images/Blog1.jpg",
            slug: "study-tips"
        },
        {
            id: 2,
            title: "How to Prepare for Exams",
            description: "Learn effective exam preparation strategies that reduce stress and improve results.",
            date: "May 8, 2025",
            image: "/images/Blog2.jpg",
            slug: "exam-preparation"
        },
        {
            id: 3,
            title: "The Future of Education Technology",
            description: "Explore how technology is transforming the way students learn and teachers teach.",
            date: "May 5, 2025",
            image: "/images/Blog3.jpg",
            slug: "education-technology"
        }
    ];

    return (
        <div className="container mx-auto p-6">
            <div className="flex flex-col xl:flex-row justify-between gap-10">
                {/* Notice Section */}
                <div className="flex-1 w-full rounded-md shadow-md">
                    <div className="flex justify-between items-center p-5 bg-[#F5F8FC] rounded-t-md">
                        <h1 className="font-bold text-2xl">Notice Board</h1>
                        <Link href="/notice" className="text-blue-500 font-bold hover:text-blue-700 transition">
                            View All
                        </Link>
                    </div>

                    {/* Notice map - fixed key placement */}
                    {notice.length > 0 ? (

                        <div>
                            {notice.map((item: NoticeItem) => (
                                <Link href={`/notice/${item._id}`} key={item._id}>
                                    <div className="flex items-center justify-between text-[#858FA1] text-base md:text-xl font-bold last:border-b-0 border-t border-gray-100 py-6 px-2 hover:bg-gray-50 transition-colors">
                                        <div className="flex items-center gap-3 flex-1 min-w-0">
                                            {/* You can add an icon based on item type or use a default one */}
                                            <span className="text-blue-500 text-2xl md:text-3xl flex-shrink-0">
                                                <HiSpeakerphone />
                                            </span>
                                            <p className="line-clamp-2 md:line-clamp-1">{item.title}</p>
                                        </div>
                                        <div className="text-sm whitespace-nowrap ml-4 flex-shrink-0">
                                            {new Date(item.issuedDate).toLocaleDateString('en-IN', {
                                                day: '2-digit',
                                                month: 'short',
                                                year: 'numeric'
                                            })}
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-10 text-gray-500">
                            No notices available
                        </div>
                    )}
                </div>

                {/* Latest Blog Section */}
                <div className="flex-1 w-full bg-[#F5F8FC] rounded-md shadow-md px-4 pb-4">
                    <div className="flex justify-between items-center py-5">
                        <h1 className="font-bold text-2xl">Latest Blog</h1>
                        <Link href="/blog" className="text-blue-500 font-bold hover:text-blue-700 transition">
                            View All
                        </Link>
                    </div>

                    <div className="flex flex-col lg:flex-row items-stretch justify-between gap-5">
                        {blogPosts.map((post) => (
                            <div
                                key={post.id}
                                className="rounded-2xl flex-1 w-full bg-white overflow-hidden text-gray-500 shadow-sm hover:shadow-md transition-shadow"
                            >
                                <Image
                                    src={post.image}
                                    height={200}
                                    width={300}
                                    alt={post.title}
                                    className="h-48 w-full object-cover"
                                    priority={post.id === 1}
                                />
                                <div className="p-4">
                                    <h1 className="text-lg font-bold text-black line-clamp-2">{post.title}</h1>
                                    <p className="line-clamp-3 py-2 text-sm">{post.description}</p>
                                    <p className="py-2 text-sm text-gray-400">{post.date}</p>
                                    <Link
                                        href={`/blog/${post.slug}`}
                                        className="text-blue-500 hover:text-blue-600 transition font-medium inline-flex items-center"
                                    >
                                        Read More →
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
=======
import { HiSpeakerphone } from "react-icons/hi";
import { ArrowRight } from "lucide-react";

const noticeData = [
  { id: 1, text: "Annual Sports Day will be held on 20th May, 2025", date: "May 12, 2025" },
  { id: 2, text: "Mid Term Examination schedules start from 1st June 2025", date: "May 10, 2025" },
  { id: 3, text: "School will remain closed on 16th May, 2025", date: "May 08, 2025" },
  { id: 4, text: "Parent-Teacher Association meeting on 25th May, 2025", date: "May 01, 2025" },
  { id: 5, text: "New admission process for the academic year 2025 has started", date: "May 12, 2025" },
];

export function NoticeAndBlog() {
  return (
    <section className="bg-[#f8fafc] py-16 md:py-20 border-t border-slate-100">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12">
          
          {/* Notice Board */}
          <div className="flex flex-col rounded-2xl border border-slate-200/80 bg-white shadow-xs lg:col-span-5">
            <div className="flex items-center justify-between border-b border-slate-100 p-6">
              <h3 className="text-xl font-bold text-[#03204c]">Notice Board</h3>
              <Link href="/notice" className="text-xs font-semibold text-blue-600 hover:text-blue-700">
                View All →
              </Link>
>>>>>>> 0ec5bca6fcd1f7ede15b0af549861870bff79553
            </div>

            <div className="divide-y divide-slate-100 p-2">
              {noticeData.map((item) => (
                <Link
                  href={`/notice/${item.id}`}
                  key={item.id}
                  className="flex items-start gap-3 rounded-xl p-4 transition-colors hover:bg-slate-50"
                >
                  <span className="mt-0.5 shrink-0 text-blue-600">
                    <HiSpeakerphone className="h-5 w-5" />
                  </span>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-slate-800 line-clamp-2">
                      {item.text}
                    </p>
                    <span className="mt-1 block text-xs text-slate-400">
                      {item.date}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Latest Blog */}
          <div className="flex flex-col rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs lg:col-span-7">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-6">
              <h3 className="text-xl font-bold text-[#03204c]">Latest Blog</h3>
              <Link href="/blog" className="text-xs font-semibold text-blue-600 hover:text-blue-700">
                View All →
              </Link>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
              {[1, 2, 3].map((num) => (
                <div
                  key={num}
                  className="group flex flex-col overflow-hidden rounded-xl border border-slate-200/80 bg-white shadow-2xs transition-all hover:shadow-md"
                >
                  <div className="relative h-36 w-full overflow-hidden bg-slate-100">
                    <Image
                      src={`/images/Blog${num}.jpg`}
                      alt="Blog Cover"
                      fill
                      sizes="(max-width: 768px) 100vw, 200px"
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>
                  <div className="flex flex-1 flex-col p-4">
                    <h4 className="text-sm font-bold text-slate-800 line-clamp-2 group-hover:text-blue-600">
                      10 Effective Study Tips for Students
                    </h4>
                    <p className="mt-2 text-xs leading-relaxed text-slate-500 line-clamp-2">
                      Discover practical study tips that help students improve focus and performance.
                    </p>
                    <div className="mt-auto pt-4 flex items-center justify-between text-[11px] font-medium text-slate-400">
                      <span>May 10, 2025</span>
                      <span className="text-blue-600 group-hover:translate-x-0.5 transition-transform flex items-center gap-1 font-semibold">
                        Read <ArrowRight className="h-3 w-3" />
                      </span>
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

