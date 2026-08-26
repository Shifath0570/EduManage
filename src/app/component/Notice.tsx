import Image from "next/image";
import { HiSpeakerphone } from "react-icons/hi";
import { ArrowRight } from "lucide-react";
import { getNotices } from "../lib/data";
import { NoticeItem } from "@/types/types";
import Link from "next/link";



export default async function Notice() {
  const noticesData = await getNotices();
  const notice = Array.isArray(noticesData) ? noticesData.slice(0, 5) : [];

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
            </div>

            <div className="divide-y divide-slate-100 p-2">
              {notice.length > 0 ? (
                notice.map((item: NoticeItem) => (
                  <Link
                    href={`/notice/${item._id}`}
                    key={item._id}
                    className="flex items-start gap-3 rounded-xl p-4 transition-colors hover:bg-slate-50"
                  >
                    <span className="mt-0.5 shrink-0 text-blue-600">
                      <HiSpeakerphone className="h-5 w-5" />
                    </span>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-slate-800 line-clamp-2">
                        {item.title}
                      </p>
                      <span className="mt-1 block text-xs text-slate-400">
                        {item.issuedDate
                          ? new Date(item.issuedDate).toLocaleDateString('en-IN', {
                              day: '2-digit',
                              month: 'short',
                              year: 'numeric'
                            })
                          : 'No Date'}
                      </span>
                    </div>
                  </Link>
                ))
              ) : (
                <div className="text-center py-10 text-gray-500">
                  No notices available
                </div>
              )}
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
              {blogPosts.map((post) => (
                <div
                  key={post.id}
                  className="group flex flex-col overflow-hidden rounded-xl border border-slate-200/80 bg-white shadow-2xs transition-all hover:shadow-md"
                >
                  <div className="relative h-36 w-full overflow-hidden bg-slate-100">
                    <Image
                      src={post.image}
                      alt={post.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 200px"
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                      priority={post.id === 1}
                    />
                  </div>
                  <div className="flex flex-1 flex-col p-4">
                    <h4 className="text-sm font-bold text-slate-800 line-clamp-2 group-hover:text-blue-600">
                      {post.title}
                    </h4>
                    <p className="mt-2 text-xs leading-relaxed text-slate-500 line-clamp-2">
                      {post.description}
                    </p>
                    <div className="mt-auto pt-4 flex items-center justify-between text-[11px] font-medium text-slate-400">
                      <span>{post.date}</span>
                      <Link
                        href={`/blog/${post.slug}`}
                        className="text-blue-600 group-hover:translate-x-0.5 transition-transform flex items-center gap-1 font-semibold"
                      >
                        Read <ArrowRight className="h-3 w-3" />
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


