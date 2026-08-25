import React from "react";
import Link from "next/link";
import Image from "next/image";
import { getNotices } from "../lib/data";

import { NoticeItem } from "@/types/types"; // Import the NoticeItem type
import { HiSpeakerphone } from "react-icons/hi";

// Remove React.FC if using async - better to type it differently
const Notice = async () => {
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
            </div>
        </div>
    );
};

export default Notice;