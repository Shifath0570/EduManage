"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import {
    ArrowLeft,
    CalendarDays,
    UserRound,
    Clock,
    Tag,
    Share2,
    Eye,
    BookOpen,
    Sparkles,
    CheckCircle2,
    Bookmark
} from "lucide-react";
import { blogs as fallbackBlogs } from "../blogData";

interface BlogDetails {
    _id: string;
    id?: number | string;
    title: string;
    slug?: string;
    description: string;
    content: string | string[];
    category: string;
    author: string;
    authorEmail?: string;
    image: string;
    tags?: string[];
    views?: number;
    createdAt?: string;
    date?: string;
}

export default function BlogDetailsPage() {
    const params = useParams();
    const id = params?.id as string;

    const [blog, setBlog] = useState<BlogDetails | null>(null);
    const [loading, setLoading] = useState(true);
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        async function fetchBlog() {
            if (!id) return;
            setLoading(true);
            try {
                let res = await fetch(`/api/blogs/${id}`);
                if (!res.ok && process.env.NEXT_PUBLIC_API_URL) {
                    try {
                        res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/blogs/${id}`);
                    } catch {
                        // ignore
                    }
                }
                const data = await res.json();
                if (data.success && data.data) {
                    setBlog(data.data);
                } else {
                    const fallback = fallbackBlogs.find(
                        (item) => String(item.id) === String(id) || String(item.id) === "1"
                    );
                    if (fallback) {
                        setBlog({
                            _id: String(fallback.id),
                            id: fallback.id,
                            title: fallback.title,
                            description: fallback.description,
                            content: fallback.content,
                            category: fallback.category,
                            author: fallback.author,
                            image: fallback.image,
                            date: fallback.date,
                            tags: [fallback.category, "Education", "Learning"]
                        });
                    }
                }
            } catch (err) {
                console.error("Error fetching single blog:", err);
                const fallback = fallbackBlogs.find((item) => String(item.id) === String(id)) || fallbackBlogs[0];
                if (fallback) {
                    setBlog({
                        _id: String(fallback.id),
                        title: fallback.title,
                        description: fallback.description,
                        content: fallback.content,
                        category: fallback.category,
                        author: fallback.author,
                        image: fallback.image,
                        date: fallback.date,
                        tags: [fallback.category, "Education"]
                    });
                }
            } finally {
                setLoading(false);
            }
        }

        fetchBlog();
    }, [id]);

    const handleShare = () => {
        if (typeof window !== "undefined") {
            navigator.clipboard.writeText(window.location.href);
            setCopied(true);
            setTimeout(() => setCopied(false), 2500);
        }
    };

    if (loading) {
        return (
            <main className="flex min-h-screen items-center justify-center bg-[#FAFDFA]">
                <div className="text-center space-y-3">
                    <div className="h-10 w-10 animate-spin rounded-full border-3 border-emerald-500 border-t-transparent mx-auto" />
                    <p className="text-sm font-semibold text-slate-500">Loading educational article...</p>
                </div>
            </main>
        );
    }

    if (!blog) {
        return (
            <main className="flex min-h-screen items-center justify-center bg-[#FAFDFA] px-5">
                <div className="text-center bg-white p-10 rounded-3xl border border-slate-200/80 shadow-xl max-w-md">
                    <BookOpen className="h-12 w-12 text-emerald-400 mx-auto mb-4" />
                    <h1 className="text-2xl font-bold text-slate-900">Article Not Found</h1>
                    <p className="mt-2 text-xs sm:text-sm text-slate-500">
                        The educational article you are looking for might have been moved or unpublished.
                    </p>
                    <Link
                        href="/blog"
                        className="mt-6 inline-flex items-center gap-2 rounded-full bg-emerald-500 px-6 py-2.5 text-xs font-bold text-white transition hover:bg-emerald-600 shadow-md shadow-emerald-500/20"
                    >
                        <ArrowLeft size={16} />
                        Back to School Blog
                    </Link>
                </div>
            </main>
        );
    }

    const formattedDate = blog.createdAt
        ? new Date(blog.createdAt).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })
        : blog.date || "Recent";

    const contentParagraphs = Array.isArray(blog.content)
        ? blog.content
        : typeof blog.content === "string"
        ? blog.content.split("\n\n")
        : [];

    return (
        <main className="min-h-screen bg-[#FAFDFA] pb-24 font-sans text-slate-800">

            {/* Header Hero Section */}
            <section className="relative overflow-hidden bg-gradient-to-br from-[#E2F7F5] via-[#FFFBF2] to-[#DDF5EC] pt-32 pb-16 lg:pt-36 lg:pb-20 border-b border-emerald-100/60">
                <div className="absolute inset-0 bg-[radial-gradient(#10b981_0.75px,transparent_0.75px)] [background-size:24px_24px] opacity-15 pointer-events-none" />
                <div className="absolute top-10 left-1/3 h-80 w-80 rounded-full bg-emerald-200/20 blur-3xl pointer-events-none" />

                <div className="mx-auto max-w-4xl px-5 md:px-8 relative z-10">

                    {/* Top Action Bar */}
                    <div className="mb-6 flex items-center justify-between">
                        <Link
                            href="/blog"
                            className="inline-flex items-center gap-2 rounded-full border border-emerald-200/80 bg-white/80 backdrop-blur-xs px-4 py-1.5 text-xs font-bold text-emerald-700 hover:bg-emerald-50 transition shadow-2xs"
                        >
                            <ArrowLeft size={14} />
                            All Articles
                        </Link>

                        <button
                            type="button"
                            onClick={handleShare}
                            className="flex items-center gap-1.5 rounded-full border border-slate-200 bg-white/80 backdrop-blur-xs px-4 py-1.5 text-xs font-semibold text-slate-700 hover:bg-white transition shadow-2xs"
                        >
                            {copied ? (
                                <>
                                    <CheckCircle2 size={14} className="text-emerald-600" />
                                    <span className="text-emerald-700 font-bold">Copied!</span>
                                </>
                            ) : (
                                <>
                                    <Share2 size={14} className="text-slate-500" />
                                    <span>Share Article</span>
                                </>
                            )}
                        </button>
                    </div>

                    {/* Category Badge */}
                    <div className="mb-3">
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500 px-4 py-1 text-xs font-bold text-white shadow-xs">
                            <Bookmark size={12} />
                            {blog.category}
                        </span>
                    </div>

                    {/* Title */}
                    <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold leading-tight text-slate-900 tracking-tight">
                        {blog.title}
                    </h1>

                    {/* Excerpt */}
                    {blog.description && (
                        <p className="mt-4 text-base sm:text-lg leading-relaxed text-slate-600 border-l-4 border-emerald-500 pl-4 bg-emerald-50/40 py-2 rounded-r-xl font-normal">
                            {blog.description}
                        </p>
                    )}

                    {/* Meta Info */}
                    <div className="mt-8 flex flex-wrap items-center gap-6 border-t border-emerald-200/50 pt-5 text-xs font-medium text-slate-500">
                        <div className="flex items-center gap-1.5 text-emerald-700 font-semibold">
                            <CalendarDays size={15} />
                            <span>{formattedDate}</span>
                        </div>

                        <div className="flex items-center gap-1.5 text-slate-700 font-semibold">
                            <UserRound size={15} className="text-emerald-600" />
                            <span>{blog.author || "School Administration"}</span>
                        </div>

                        {blog.views !== undefined && (
                            <div className="flex items-center gap-1.5 text-slate-400 ml-auto">
                                <Eye size={15} />
                                <span>{blog.views} Reads</span>
                            </div>
                        )}
                    </div>
                </div>
            </section>

            {/* Article Content Section */}
            <section className="px-5 pt-10 md:px-8">
                <div className="mx-auto max-w-4xl space-y-10">

                    {/* Cover Image */}
                    {blog.image && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.98 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.5 }}
                            className="relative h-[280px] sm:h-[420px] md:h-[500px] w-full overflow-hidden rounded-3xl bg-slate-100 shadow-xl shadow-slate-200/50 border border-slate-200/80"
                        >
                            <Image
                                src={blog.image}
                                alt={blog.title}
                                fill
                                unoptimized
                                priority
                                className="object-cover"
                            />
                        </motion.div>
                    )}

                    {/* Main Article Body */}
                    <article className="rounded-3xl bg-white p-7 sm:p-12 shadow-xl shadow-slate-200/40 border border-slate-200/80">
                        <div className="space-y-6 text-sm sm:text-base leading-relaxed text-slate-700 font-normal">
                            {contentParagraphs.map((paragraph, index) => {
                                const trimmed = paragraph.trim();
                                if (!trimmed) return null;

                                if (trimmed.startsWith("## ")) {
                                    return (
                                        <h2
                                            key={index}
                                            className="text-xl sm:text-2xl font-bold text-slate-900 pt-6 first:pt-0 border-b border-slate-100 pb-2 flex items-center gap-2"
                                        >
                                            <span className="h-2 w-2 rounded-full bg-emerald-500 shrink-0" />
                                            {trimmed.replace(/^##\s*/, "")}
                                        </h2>
                                    );
                                }

                                if (trimmed.startsWith("### ")) {
                                    return (
                                        <h3
                                            key={index}
                                            className="text-lg sm:text-xl font-bold text-slate-800 pt-3"
                                        >
                                            {trimmed.replace(/^###\s*/, "")}
                                        </h3>
                                    );
                                }

                                if (trimmed.startsWith("> ")) {
                                    return (
                                        <blockquote
                                            key={index}
                                            className="border-l-4 border-emerald-500 bg-emerald-50/60 p-5 rounded-r-2xl italic text-emerald-950 my-6 shadow-2xs"
                                        >
                                            {trimmed.replace(/^>\s*/, "")}
                                        </blockquote>
                                    );
                                }

                                if (trimmed.startsWith("- ") || trimmed.startsWith("* ")) {
                                    const items = trimmed.split("\n").filter(Boolean);
                                    return (
                                        <ul key={index} className="space-y-2.5 pl-2 my-4">
                                            {items.map((item, i) => (
                                                <li key={i} className="flex items-start gap-2.5 text-slate-700">
                                                    <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-emerald-500 shrink-0" />
                                                    <span>{item.replace(/^[-*]\s*/, "")}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    );
                                }

                                return (
                                    <p key={index} className="leading-relaxed">
                                        {trimmed}
                                    </p>
                                );
                            })}
                        </div>

                        {/* Article Tags */}
                        {Array.isArray(blog.tags) && blog.tags.length > 0 && (
                            <div className="mt-12 flex flex-wrap items-center gap-2 border-t border-slate-100 pt-6">
                                <span className="text-xs font-bold text-slate-400 flex items-center gap-1 mr-2">
                                    <Tag size={13} className="text-emerald-500" /> Topic Tags:
                                </span>
                                {blog.tags.map((tag, idx) => (
                                    <span
                                        key={idx}
                                        className="rounded-full bg-emerald-50 px-3.5 py-1 text-xs font-bold text-emerald-700 border border-emerald-200/60"
                                    >
                                        #{tag}
                                    </span>
                                ))}
                            </div>
                        )}
                    </article>

                    {/* Bottom Back Button */}
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 rounded-3xl bg-white p-6 sm:p-8 shadow-lg shadow-slate-200/30 border border-slate-200/80">
                        <div>
                            <h3 className="font-bold text-slate-900 text-base">Enjoyed this story?</h3>
                            <p className="text-xs text-slate-500 mt-0.5">Explore more articles and learning guides in our school blog.</p>
                        </div>

                        <Link
                            href="/blog"
                            className="inline-flex items-center gap-2 rounded-full bg-emerald-500 px-7 py-3 text-xs sm:text-sm font-bold text-white transition hover:bg-emerald-600 shadow-md shadow-emerald-500/20 hover:scale-105"
                        >
                            <ArrowLeft size={16} />
                            Back to All Blogs
                        </Link>
                    </div>

                </div>
            </section>

        </main>
    );
}