"use client";

import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
    ArrowRight,
    BookOpen,
    CalendarDays,
    GraduationCap,
    Lightbulb,
    Mail,
    Users,
    Search,
    Clock,
    UserRound,
    Sparkles,
    Tag,
    ChevronRight,
    Flame,
    Compass,
    CheckCircle2
} from "lucide-react";
import { blogs as defaultFallbackBlogs } from "./blogData";
import Statistics from "../component/Statistic";

/**
 * Represents a published or draft blog item.
 */
interface BlogItem {
    _id: string;
    id?: number | string;
    title: string;
    slug?: string;
    description: string;
    content: string | string[];
    category: string;
    date?: string;
    createdAt?: string;
    author: string;
    image: string;
    featured?: boolean;
    views?: number;
    tags?: string[];
}

const POPULAR_SEARCHES = ["AI", "Technology", "Quality Education", "Teachers", "Student Life", "Future Skills"];

/**
 * Fallback in-memory filtering function for Blog articles.
 * Strictly checks category match and keyword presence in article title or tags.
 *
 * @param category - Selected topic category ('All', 'Education', etc.)
 * @param query - User search query string
 * @returns Filtered list of BlogItem objects
 */
const filterFallbackBlogs = (category: string, query: string): BlogItem[] => {
    const rawList: BlogItem[] = defaultFallbackBlogs.map(b => ({
        _id: String(b.id),
        id: b.id,
        title: b.title,
        description: b.description,
        content: b.content,
        category: b.category,
        date: b.date,
        author: b.author,
        image: b.image,
        tags: b.tags || [b.category, "Education"],
        featured: b.id === 1
    }));

    return rawList.filter(blog => {
        // Category filter
        if (category && category !== "All") {
            const catLower = category.toLowerCase().trim();
            const blogCatLower = blog.category.toLowerCase().trim();
            const isStudentLifeMatch =
                (catLower === "student life" || catLower === "activities") &&
                (blogCatLower === "student life" || blogCatLower === "activities");
            if (blogCatLower !== catLower && !isStudentLifeMatch) {
                return false;
            }
        }

        // Search query filter: ONLY match title or tags
        if (!query || !query.trim()) return true;

        const q = query.trim().toLowerCase();
        const words = q.split(/\s+/).filter(Boolean);

        const titleStr = (blog.title || "").toLowerCase();
        const tagsList = (blog.tags || []).map(t => t.toLowerCase());

        // Match if search query or any word matches title or any tag
        const matchesTitle = titleStr.includes(q) || words.some(w => titleStr.includes(w));
        const matchesTags = tagsList.some(tag => tag.includes(q) || words.some(w => tag.includes(w)));

        return matchesTitle || matchesTags;
    });
};

export default function BlogPage() {
    const [blogs, setBlogs] = useState<BlogItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState<string>("All");
    const [searchQuery, setSearchQuery] = useState<string>("");
    const categories = [
        {
            title: "All",
            description: "All school updates, guides & stories",
            icon: Compass,
        },
        {
            title: "Education",
            description: "Educational insights and academic tips",
            icon: BookOpen,
        },
        {
            title: "Technology",
            description: "EdTech, digital learning & modern tools",
            icon: Lightbulb,
        },
        {
            title: "Teachers",
            description: "Teaching methods & professional growth",
            icon: GraduationCap,
        },
        {
            title: "Student Life",
            description: "Student clubs, sports & achievements",
            icon: Users,
        },
    ];

    const fetchBlogs = useCallback(async (targetQuery?: string, targetCat?: string) => {
        const cat = targetCat !== undefined ? targetCat : selectedCategory;
        const query = targetQuery !== undefined ? targetQuery : searchQuery;

        setLoading(true);
        try {
            const params = new URLSearchParams();
            if (cat !== "All") params.append("category", cat);
            if (query.trim()) params.append("search", query.trim());

            let res = await fetch(`/api/blogs?${params.toString()}`);
            if (!res.ok && process.env.NEXT_PUBLIC_API_URL) {
                try {
                    res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/blogs?${params.toString()}`);
                } catch {
                    // ignore
                }
            }

            if (res.ok) {
                const data = await res.json();
                if (data.success && Array.isArray(data.data)) {
                    if (query.trim()) {
                        const q = query.trim().toLowerCase();
                        const words = q.split(/\s+/).filter(Boolean);
                        const matchedData = data.data.filter((blog: BlogItem) => {
                            const titleStr = (blog.title || "").toLowerCase();
                            const tagsList = (blog.tags || []).map(t => t.toLowerCase());
                            const matchesTitle = titleStr.includes(q) || words.some(w => titleStr.includes(w));
                            const matchesTags = tagsList.some(tag => tag.includes(q) || words.some(w => tag.includes(w)));
                            return matchesTitle || matchesTags;
                        });

                        if (matchedData.length > 0) {
                            setBlogs(matchedData);
                            return;
                        } else {
                            const localMatches = filterFallbackBlogs(cat, query);
                            setBlogs(localMatches);
                            return;
                        }
                    } else {
                        if (data.data.length > 0) {
                            setBlogs(data.data);
                            return;
                        } else {
                            const localMatches = filterFallbackBlogs(cat, query);
                            setBlogs(localMatches);
                            return;
                        }
                    }
                }
            }

            // Fallback to local filter strictly matching title or tags
            const localMatches = filterFallbackBlogs(cat, query);
            setBlogs(localMatches);
        } catch (err) {
            console.error("Error fetching blogs:", err);
            const localMatches = filterFallbackBlogs(cat, query);
            setBlogs(localMatches);
        } finally {
            setLoading(false);
        }
    }, [selectedCategory, searchQuery]);

    // Debounced search on input change
    useEffect(() => {
        const timer = setTimeout(() => {
            fetchBlogs(searchQuery, selectedCategory);
        }, 250);
        return () => clearTimeout(timer);
    }, [searchQuery, selectedCategory, fetchBlogs]);

    const handleSearchSubmit = (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        fetchBlogs(searchQuery, selectedCategory);
        const section = document.getElementById("articles-section");
        if (section) {
            section.scrollIntoView({ behavior: "smooth" });
        }
    };

    const handleClearSearch = () => {
        setSearchQuery("");
        fetchBlogs("", selectedCategory);
    };

    const handlePopularClick = (term: string) => {
        setSearchQuery(term);
        setSelectedCategory("All");
        fetchBlogs(term, "All");
        const section = document.getElementById("articles-section");
        if (section) {
            section.scrollIntoView({ behavior: "smooth" });
        }
    };

    const featuredBlog = blogs.find(b => b.featured) || blogs[0];

    return (
        <main className="min-h-screen bg-[#FAFDFA] font-sans text-slate-800">

            {/* =====================================================
                HERO SECTION (Matching Homepage Hero Style)
            ====================================================== */}
            <section className="relative overflow-hidden bg-gradient-to-br from-[#E2F7F5] via-[#FFFBF2] to-[#DDF5EC] pt-32 pb-24 lg:pt-36 lg:pb-28 border-b border-emerald-100/60">
                {/* Background Grid Pattern */}
                <div className="absolute inset-0 bg-[radial-gradient(#10b981_0.75px,transparent_0.75px)] [background-size:24px_24px] opacity-15 pointer-events-none" />

                {/* Ambient Blur Bubbles */}
                <div className="absolute top-12 left-10 h-96 w-96 rounded-full bg-emerald-200/30 blur-3xl pointer-events-none" />
                <div className="absolute top-1/4 right-8 h-[26rem] w-[26rem] rounded-full bg-sky-200/30 blur-3xl pointer-events-none" />

                {/* Floating Micro-sparkles */}
                <motion.div
                    animate={{ y: [0, -10, 0] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute top-28 left-12"
                >
                    <Sparkles className="h-5 w-5 text-emerald-500 opacity-60" />
                </motion.div>

                <div className="container mx-auto px-6 max-w-7xl relative z-10 text-center">
                    
                    {/* Badge */}
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50/80 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-emerald-600 mb-4 shadow-2xs backdrop-blur-md"
                    >
                        <Sparkles className="h-3.5 w-3.5 fill-emerald-500 text-emerald-500" />
                        <span>EduManage Knowledge Hub</span>
                    </motion.div>

                    {/* Headline */}
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7, delay: 0.1 }}
                        className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl lg:text-6xl leading-[1.15]"
                    >
                        Insights, Ideas & <br className="hidden sm:inline" />
                        <span className="text-emerald-500">Inspiring Stories</span>
                    </motion.h1>

                    {/* Subtitle */}
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7, delay: 0.2 }}
                        className="mx-auto mt-5 max-w-2xl text-base sm:text-lg text-slate-600 leading-relaxed font-normal"
                    >
                        Discover educational insights, modern teaching methods, student achievements,
                        and thought leadership from the EduManage school community.
                    </motion.p>

                    {/* Underline Pill */}
                    <div className="mt-4 h-1.5 w-16 rounded-full bg-emerald-500 mx-auto" />

                    {/* Floating Pill Search Bar */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.6, delay: 0.3 }}
                        className="mx-auto mt-8 max-w-2xl"
                    >
                        <form
                            onSubmit={handleSearchSubmit}
                            role="search"
                            className="relative flex items-center shadow-xl shadow-emerald-900/5 rounded-full overflow-hidden border border-emerald-200/80 bg-white/95 p-1.5 pl-5 backdrop-blur-md transition-all focus-within:border-emerald-500 focus-within:ring-2 focus-within:ring-emerald-400/20 focus-within:shadow-2xl"
                        >
                            <Search className="h-5 w-5 text-emerald-600 shrink-0 mr-2.5" />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search articles by topic, title, keyword (e.g. AI, Education)..."
                                aria-label="Search articles by title or tags"
                                className="w-full text-sm font-medium text-slate-800 outline-none bg-transparent placeholder:text-slate-400 py-1.5"
                            />
                            {searchQuery && (
                                <button
                                    type="button"
                                    onClick={handleClearSearch}
                                    aria-label="Clear search query"
                                    className="px-3 py-1 text-xs font-bold text-slate-400 hover:text-slate-600 transition shrink-0"
                                    title="Clear search"
                                >
                                    Clear
                                </button>
                            )}
                            <button
                                type="submit"
                                className="inline-flex items-center justify-center rounded-full bg-emerald-500 px-6 py-3 text-xs font-bold text-white shadow-md shadow-emerald-500/20 hover:bg-emerald-600 transition hover:scale-105 active:scale-95 shrink-0"
                            >
                                Explore
                            </button>
                        </form>

                        {/* Popular Quick Searches */}
                        <div className="mt-4 flex flex-wrap items-center justify-center gap-2 text-xs text-slate-500">
                            <span className="font-semibold text-slate-600 flex items-center gap-1 text-[11px]">
                                <Sparkles className="h-3 w-3 text-emerald-600" /> Popular:
                            </span>
                            {POPULAR_SEARCHES.map((chip) => {
                                const isCurrent = searchQuery.trim().toLowerCase() === chip.toLowerCase();
                                return (
                                    <button
                                        key={chip}
                                        type="button"
                                        onClick={() => handlePopularClick(chip)}
                                        className={`rounded-full px-3 py-1 text-[11px] font-semibold transition ${
                                            isCurrent
                                                ? "bg-emerald-500 text-white shadow-xs"
                                                : "bg-white/80 border border-emerald-100 text-slate-700 hover:bg-emerald-50 hover:border-emerald-300 shadow-2xs"
                                        }`}
                                    >
                                        #{chip}
                                    </button>
                                );
                            })}
                        </div>
                    </motion.div>

                </div>
            </section>

            {/* =====================================================
                STATISTICS COUNTERS (Matching Homepage Style)
            ====================================================== */}
            <Statistics />

            {/* =====================================================
                FEATURED ARTICLE (Editor's Pick - Only when not searching)
            ====================================================== */}
            {featuredBlog && !searchQuery.trim() && (
                <section className="px-5 py-14 md:px-8 md:py-20 relative overflow-hidden bg-gradient-to-b from-white via-[#EBFBFA]/30 to-[#FFF9EE]/40">
                    <div className="mx-auto max-w-7xl">
                        
                        <div className="mb-8 flex flex-col items-center justify-center text-center">
                            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50/80 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-emerald-600 mb-2">
                                <Flame className="h-3.5 w-3.5 text-amber-500" />
                                <span>Editor's Spotlight</span>
                            </div>
                            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900">
                                Featured <span className="text-emerald-500">Article</span>
                            </h2>
                            <div className="mt-2 h-1.5 w-12 rounded-full bg-emerald-500" />
                        </div>

                        <motion.div
                            whileHover={{ y: -4 }}
                            transition={{ duration: 0.3 }}
                            className="grid overflow-hidden rounded-3xl bg-white/90 backdrop-blur-md shadow-xl shadow-slate-200/50 border border-slate-200/80 hover:border-emerald-300 transition-all duration-300 lg:grid-cols-12 group"
                        >
                            {/* Image (7 cols) */}
                            <div className="relative min-h-[320px] lg:min-h-[460px] overflow-hidden bg-slate-100 lg:col-span-7">
                                <Image
                                    src={featuredBlog.image}
                                    alt={featuredBlog.title}
                                    fill
                                    unoptimized
                                    priority
                                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                                />
                                <div className="absolute top-4 left-4 rounded-full bg-emerald-600 px-3.5 py-1 text-xs font-bold text-white shadow-md">
                                    {featuredBlog.category}
                                </div>
                            </div>

                            {/* Content (5 cols) */}
                            <div className="flex flex-col justify-center p-8 sm:p-12 lg:col-span-5 space-y-4">
                                <div className="flex items-center gap-3 text-xs font-semibold text-slate-400">
                                    <span className="flex items-center gap-1 text-emerald-600">
                                        <CalendarDays size={14} />
                                        {featuredBlog.createdAt
                                            ? new Date(featuredBlog.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
                                            : featuredBlog.date || "Recent"}
                                    </span>
                                    <span>•</span>
                                    <span>{featuredBlog.author || "School Administration"}</span>
                                </div>

                                <h3 className="text-2xl sm:text-3xl font-extrabold leading-snug text-slate-900 group-hover:text-emerald-600 transition">
                                    {featuredBlog.title}
                                </h3>

                                <p className="text-sm sm:text-base leading-relaxed text-slate-600 line-clamp-3">
                                    {featuredBlog.description}
                                </p>

                                <div className="pt-4">
                                    <Link
                                        href={`/blog/${featuredBlog.slug || featuredBlog._id}`}
                                        className="inline-flex items-center justify-center gap-2 rounded-full bg-emerald-500 px-7 py-3.5 text-sm font-bold text-white shadow-md shadow-emerald-500/20 hover:bg-emerald-600 transition hover:scale-105"
                                    >
                                        Read Full Article
                                        <ArrowRight size={17} />
                                    </Link>
                                </div>
                            </div>
                        </motion.div>

                    </div>
                </section>
            )}

            {/* =====================================================
                CATEGORIES / TOPICS (Matching FeaturedSection)
            ====================================================== */}
            <section className="bg-white px-5 py-16 md:px-8 md:py-20 border-y border-slate-100 relative">
                <div className="mx-auto max-w-7xl">
                    
                    <div className="mx-auto mb-12 max-w-2xl text-center">
                        <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50/80 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-emerald-600 mb-2">
                            <Sparkles className="h-3.5 w-3.5 fill-emerald-500 text-emerald-500" />
                            <span>Topics & Streams</span>
                        </div>
                        <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
                            Explore By <span className="text-emerald-500">Category</span>
                        </h2>
                        <div className="mt-3 h-1.5 w-16 rounded-full bg-emerald-500 mx-auto" />
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
                        {categories.map((cat) => {
                            const Icon = cat.icon;
                            const isSelected = selectedCategory === cat.title;

                            return (
                                <motion.button
                                    key={cat.title}
                                    type="button"
                                    whileHover={{ y: -5 }}
                                    onClick={() => setSelectedCategory(cat.title)}
                                    className={`group text-left rounded-3xl border p-6 transition-all duration-300 ${
                                        isSelected
                                            ? "border-emerald-500 bg-emerald-50/60 shadow-lg shadow-emerald-900/5"
                                            : "border-slate-200/80 bg-[#FAFDFA] hover:border-emerald-300 hover:bg-white hover:shadow-xl hover:shadow-slate-200/50"
                                    }`}
                                >
                                    <div className={`flex h-12 w-12 items-center justify-center rounded-2xl border transition-all duration-300 ${
                                        isSelected
                                            ? "border-emerald-500 bg-emerald-500 text-white shadow-xs"
                                            : "border-emerald-100 bg-emerald-50 text-emerald-600 group-hover:scale-110 group-hover:bg-emerald-500 group-hover:text-white"
                                    }`}>
                                        <Icon size={22} strokeWidth={2} />
                                    </div>

                                    <h3 className="mt-4 font-bold text-slate-900 text-base group-hover:text-emerald-600 transition">
                                        {cat.title}
                                    </h3>

                                    <p className="mt-1 text-xs leading-relaxed text-slate-500 line-clamp-2">
                                        {cat.description}
                                    </p>
                                </motion.button>
                            );
                        })}
                    </div>

                </div>
            </section>

            {/* =====================================================
                LATEST ARTICLES GRID (Matching Notice/Blog Card Style)
            ====================================================== */}
            <section id="articles-section" className="px-5 py-16 md:px-8 md:py-24 bg-gradient-to-b from-white via-[#EBFBFA]/20 to-[#FAFDFA]">
                <div className="mx-auto max-w-7xl">
                    
                    <div className="mb-12 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
                        <div>
                            <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3.5 py-1 text-xs font-bold text-emerald-700 mb-2">
                                <BookOpen className="h-3.5 w-3.5" />
                                <span>{searchQuery.trim() ? "Search Results" : "Recent Stories"}</span>
                            </div>
                            <h2 className="text-3xl font-extrabold text-slate-900 sm:text-4xl">
                                {searchQuery.trim() ? (
                                    <>
                                        Results for <span className="text-emerald-600">"{searchQuery.trim()}"</span>
                                    </>
                                ) : selectedCategory === "All" ? (
                                    "Latest Articles"
                                ) : (
                                    `${selectedCategory} Articles`
                                )}
                                <span className="ml-3 text-lg font-semibold text-slate-400">({blogs.length})</span>
                            </h2>
                        </div>

                        {(searchQuery.trim() || selectedCategory !== "All") && (
                            <button
                                type="button"
                                onClick={() => {
                                    setSelectedCategory("All");
                                    setSearchQuery("");
                                }}
                                className="self-start sm:self-auto inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-50 hover:text-rose-600 transition shadow-2xs"
                            >
                                Reset Filters
                            </button>
                        )}
                    </div>

                    {loading ? (
                        <div className="py-24 text-center text-slate-400 text-sm">
                            <div className="h-10 w-10 animate-spin rounded-full border-3 border-emerald-500 border-t-transparent mx-auto mb-3" />
                            Searching published articles...
                        </div>
                    ) : blogs.length === 0 ? (
                        <div className="rounded-3xl border border-slate-200/80 bg-white p-16 text-center space-y-4 shadow-sm">
                            <BookOpen className="h-12 w-12 text-emerald-300 mx-auto" />
                            <h3 className="text-lg font-bold text-slate-800">
                                {searchQuery.trim()
                                    ? `No articles found matching "${searchQuery}"`
                                    : "No articles found in this category"}
                            </h3>
                            <p className="text-xs text-slate-500 max-w-md mx-auto">
                                {searchQuery.trim()
                                    ? "We couldn't find any articles with titles or tags matching your search. Try searching for topics like \"AI\", \"Technology\", \"Teachers\", or click a popular tag above."
                                    : "Try searching for another keyword or reset your filters to view all articles."}
                            </p>
                            <button
                                type="button"
                                onClick={() => {
                                    setSelectedCategory("All");
                                    setSearchQuery("");
                                }}
                                className="inline-flex items-center gap-2 rounded-full bg-emerald-500 px-6 py-2.5 text-xs font-bold text-white hover:bg-emerald-600 transition"
                            >
                                View All Articles
                            </button>
                        </div>
                    ) : (
                        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                            {blogs.map((blog) => (
                                <motion.article
                                    key={blog._id}
                                    whileHover={{ y: -6 }}
                                    transition={{ duration: 0.3 }}
                                    className="group flex flex-col overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-xl shadow-slate-200/50 hover:border-emerald-400/50 hover:shadow-2xl hover:shadow-emerald-900/10 transition-all duration-300"
                                >
                                    {/* Thumbnail */}
                                    <div className="relative h-52 w-full overflow-hidden bg-slate-100">
                                        <Image
                                            src={blog.image}
                                            alt={blog.title}
                                            fill
                                            unoptimized
                                            sizes="(max-width: 768px) 100vw, 400px"
                                            className="object-cover transition-transform duration-700 group-hover:scale-105"
                                        />
                                        <div className="absolute top-3.5 left-3.5 rounded-full bg-slate-900/75 px-3 py-1 text-[11px] font-bold text-white backdrop-blur-md">
                                            {blog.category}
                                        </div>
                                    </div>

                                    {/* Body */}
                                    <div className="flex flex-1 flex-col p-6">
                                        <div className="flex items-center gap-2 text-xs font-semibold text-slate-400">
                                            <CalendarDays size={13} className="text-emerald-500" />
                                            <span>
                                                {blog.createdAt
                                                    ? new Date(blog.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
                                                    : blog.date || "Recent"}
                                            </span>
                                            <span>•</span>
                                            <span className="truncate">{blog.author || "School Admin"}</span>
                                        </div>

                                        <h3 className="mt-3 text-lg font-bold text-slate-900 line-clamp-2 leading-snug transition-colors group-hover:text-emerald-600">
                                            {blog.title}
                                        </h3>

                                        <p className="mt-2.5 text-xs sm:text-sm leading-relaxed text-slate-500 line-clamp-3">
                                            {blog.description}
                                        </p>

                                        {/* Card Footer */}
                                        <div className="mt-auto pt-5 flex items-center justify-between border-t border-slate-100 text-xs">
                                            <Link
                                                href={`/blog/${blog.slug || blog._id}`}
                                                className="inline-flex items-center gap-1.5 font-bold text-emerald-600 transition hover:text-emerald-700"
                                            >
                                                <span>Read Story</span>
                                                <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
                                            </Link>

                                            <span className="text-[11px] font-medium text-slate-400">
                                                {blog.views || 0} reads
                                            </span>
                                        </div>
                                    </div>
                                </motion.article>
                            ))}
                        </div>
                    )}

                </div>
            </section>

            {/* =====================================================
                NEWSLETTER (Matching Emerald/Teal Homepage Gradient)
            ====================================================== */}
            <section className="px-5 py-16 md:px-8 md:py-24">
                <div className="mx-auto max-w-5xl overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-600 via-teal-700 to-[#03204c] px-6 py-14 text-center md:px-16 text-white shadow-2xl shadow-emerald-900/20 relative">
                    <div className="absolute top-0 right-0 h-64 w-64 rounded-full bg-emerald-400/20 blur-3xl pointer-events-none" />
                    
                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-white/15 backdrop-blur-md shadow-xs">
                        <Mail size={26} className="text-white" />
                    </div>

                    <h2 className="mt-5 text-3xl md:text-4xl font-extrabold tracking-tight">
                        Never Miss an Educational Update
                    </h2>

                    <p className="mx-auto mt-4 max-w-xl text-xs sm:text-sm leading-relaxed text-emerald-100">
                        Subscribe to our newsletter to receive weekly educational articles, academic advice, and school updates straight to your inbox.
                    </p>

                    <div className="mx-auto mt-8 flex max-w-md flex-col gap-3 sm:flex-row">
                        <input
                            type="email"
                            placeholder="Enter your email address..."
                            className="h-12 flex-1 rounded-full border border-white/20 bg-white/10 px-5 text-xs sm:text-sm text-white placeholder:text-emerald-200 outline-none backdrop-blur-md focus:bg-white focus:text-slate-900 focus:placeholder:text-slate-400 transition"
                        />
                        <button
                            type="button"
                            className="h-12 rounded-full bg-white px-7 text-xs sm:text-sm font-bold text-slate-900 transition hover:bg-emerald-100 shadow-md"
                        >
                            Subscribe
                        </button>
                    </div>
                </div>
            </section>

        </main>
    );
}