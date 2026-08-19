
import React from "react";
import Image from "next/image";
import Link from "next/link";
import {
    ArrowRight,
    BookOpen,
    CalendarDays,
    GraduationCap,
    Lightbulb,
    Mail,
    Users,
} from "lucide-react";

import { blogs } from "./blogData";

import Statistics from "../component/Statictic";


const BlogPage = () => {
    const categories = [
        {
            title: "Education",
            description: "Educational insights and learning resources",
            icon: BookOpen,
        },
        {
            title: "Technology",
            description: "Modern technology in education",
            icon: Lightbulb,
        },
        {
            title: "Teachers",
            description: "Teaching tips and professional development",
            icon: GraduationCap,
        },
        {
            title: "Student Life",
            description: "Student activities and experiences",
            icon: Users,
        },
    ];

    const featuredBlog = blogs[0];

    return (
        <main className="min-h-screen bg-[#f7f9fc]">

            {/* =====================================================
                HERO SECTION
            ====================================================== */}
            <section className="relative overflow-hidden bg-white">
                <div className="mx-auto max-w-7xl px-5 pt-5 md:px-8 ">
                    <div className="mx-auto max-w-3xl text-center">

                        <span className="inline-flex rounded-full bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-600">
                            School Blog
                        </span>

                        <h1 className="mt-5 text-4xl font-bold leading-tight text-slate-900 md:text-6xl">
                            Insights, Ideas &{" "}
                            <span className="text-blue-600">
                                Inspiration
                            </span>
                        </h1>

                        <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-slate-500 md:text-lg">
                            Explore educational insights, school news,
                            learning resources, technology updates, and
                            inspiring stories from our school community.
                        </p>

                        <div className="mx-auto mt-7 h-1 w-14 rounded-full bg-blue-600" />

                    </div>
                </div>
            </section>


            {/* =====================================================
                BLOG STATISTICS
            ====================================================== */}
         <Statistics/>




            {/* =====================================================
                FEATURED BLOG
            ====================================================== */}
            <section className="px-5 py-14 md:px-8 md:py-20">
                <div className="mx-auto max-w-7xl">

                    <div className="mb-8">
                        <p className="text-sm font-semibold uppercase tracking-wider text-blue-600">
                            Featured Article
                        </p>

                        <h2 className="mt-2 text-3xl font-bold text-slate-900">
                            Editor's Pick
                        </h2>
                    </div>

                    <div className="grid overflow-hidden rounded-2xl bg-white shadow-sm lg:grid-cols-2">

                        {/* Image */}
                        <div className="relative min-h-[300px] lg:min-h-[430px]">
                            <Image
                                src={featuredBlog.image}
                                alt={featuredBlog.title}
                                fill
                                priority
                                className="object-cover"
                            />
                        </div>

                        {/* Content */}
                        <div className="flex flex-col justify-center p-7 md:p-10">

                            <span className="w-fit rounded-full bg-blue-50 px-4 py-2 text-xs font-semibold text-blue-600">
                                {featuredBlog.category}
                            </span>

                            <h2 className="mt-5 text-2xl font-bold leading-tight text-slate-900 md:text-4xl">
                                {featuredBlog.title}
                            </h2>

                            <p className="mt-5 leading-7 text-slate-500">
                                {featuredBlog.description}
                            </p>

                            <div className="mt-5 flex items-center gap-2 text-sm text-slate-400">
                                <CalendarDays size={17} />
                                {featuredBlog.date}
                            </div>

                            <Link
                                href={`/blog/${featuredBlog.id}`}
                                className="mt-7 inline-flex w-fit items-center gap-2 rounded-lg bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
                            >
                                Read Full Article
                                <ArrowRight size={17} />
                            </Link>

                        </div>

                    </div>
                </div>
            </section>


            {/* =====================================================
                CATEGORIES
            ====================================================== */}
            <section className="bg-white px-5 py-14 md:px-8 md:py-20">
                <div className="mx-auto max-w-7xl">

                    <div className="mx-auto mb-10 max-w-2xl text-center">
                        <p className="text-sm font-semibold uppercase tracking-wider text-blue-600">
                            Explore Topics
                        </p>

                        <h2 className="mt-2 text-3xl font-bold text-slate-900">
                            Browse By Category
                        </h2>

                        <p className="mt-4 text-slate-500">
                            Find articles and resources based on your
                            interests.
                        </p>
                    </div>

                    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">

                        {categories.map((category) => {
                            const Icon = category.icon;

                            return (
                                <div
                                    key={category.title}
                                    className="group rounded-2xl border border-slate-100 bg-[#f8faff] p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-md"
                                >
                                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50">
                                        <Icon
                                            size={24}
                                            className="text-blue-600"
                                        />
                                    </div>

                                    <h3 className="mt-5 font-bold text-slate-800">
                                        {category.title}
                                    </h3>

                                    <p className="mt-2 text-sm leading-6 text-slate-500">
                                        {category.description}
                                    </p>

                                    <div className="mt-4 flex items-center gap-1 text-sm font-semibold text-blue-600">
                                        Explore
                                        <ArrowRight
                                            size={15}
                                            className="transition-transform group-hover:translate-x-1"
                                        />
                                    </div>
                                </div>
                            );
                        })}

                    </div>
                </div>
            </section>


            {/* =====================================================
                LATEST ARTICLES
            ====================================================== */}
            <section className="px-5 py-14 md:px-8 md:py-20">
                <div className="mx-auto max-w-7xl">

                    <div className="mb-10 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">

                        <div>
                            <p className="text-sm font-semibold uppercase tracking-wider text-blue-600">
                                Our Blog
                            </p>

                            <h2 className="mt-2 text-3xl font-bold text-slate-900">
                                Latest Articles
                            </h2>
                        </div>

                        <Link
                            href="/blog"
                            className="inline-flex items-center gap-2 text-sm font-semibold text-blue-600"
                        >
                            View All Articles
                            <ArrowRight size={17} />
                        </Link>

                    </div>

                    <div className="grid gap-7 md:grid-cols-2 lg:grid-cols-3">

                        {blogs.slice(0, 6).map((blog) => (
                            <article
                                key={blog.id}
                                className="group overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
                            >

                                {/* Image */}
                                <div className="relative h-56 overflow-hidden">

                                    <Image
                                        src={blog.image}
                                        alt={blog.title}
                                        fill
                                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                                    />

                                    <span className="absolute left-4 top-4 rounded-full bg-blue-600 px-3 py-1 text-xs font-semibold text-white">
                                        {blog.category}
                                    </span>

                                </div>

                                {/* Content */}
                                <div className="p-6">

                                    <div className="flex items-center gap-2 text-xs text-slate-400">
                                        <CalendarDays size={14} />
                                        {blog.date}
                                    </div>

                                    <h3 className="mt-3 text-xl font-bold leading-7 text-slate-800 transition-colors group-hover:text-blue-600">
                                        {blog.title}
                                    </h3>

                                    <p className="mt-3 line-clamp-3 text-sm leading-6 text-slate-500">
                                        {blog.description}
                                    </p>

                                    <Link
                                        href={`/blog/${blog.id}`}
                                        className="mt-5 inline-flex items-center gap-1 text-sm font-semibold text-blue-600"
                                    >
                                        Read More
                                        <ArrowRight size={16} />
                                    </Link>

                                </div>

                            </article>
                        ))}

                    </div>
                </div>
            </section>


            {/* =====================================================
                WHY READ OUR BLOG
            ====================================================== */}
            <section className="bg-white px-5 py-14 md:px-8 md:py-20">
                <div className="mx-auto max-w-7xl">

                    <div className="grid items-center gap-12 lg:grid-cols-2">

                        {/* Left */}
                        <div>

                            <p className="text-sm font-semibold uppercase tracking-wider text-blue-600">
                                Why Our Blog
                            </p>

                            <h2 className="mt-3 text-3xl font-bold leading-tight text-slate-900 md:text-4xl">
                                Learn Something New
                                <br />
                                Every Day
                            </h2>

                            <p className="mt-5 max-w-xl leading-7 text-slate-500">
                                Our blog is designed to provide students,
                                teachers, and parents with useful educational
                                information, practical resources, and the
                                latest updates from our school community.
                            </p>

                            <div className="mt-7 space-y-4">

                                <div className="flex gap-4">
                                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-50">
                                        <BookOpen
                                            size={20}
                                            className="text-blue-600"
                                        />
                                    </div>

                                    <div>
                                        <h3 className="font-semibold text-slate-800">
                                            Educational Resources
                                        </h3>

                                        <p className="mt-1 text-sm text-slate-500">
                                            Helpful content for better
                                            learning and teaching.
                                        </p>
                                    </div>
                                </div>

                                <div className="flex gap-4">
                                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-50">
                                        <Lightbulb
                                            size={20}
                                            className="text-blue-600"
                                        />
                                    </div>

                                    <div>
                                        <h3 className="font-semibold text-slate-800">
                                            Fresh Ideas
                                        </h3>

                                        <p className="mt-1 text-sm text-slate-500">
                                            Discover new ideas and modern
                                            approaches to education.
                                        </p>
                                    </div>
                                </div>

                                <div className="flex gap-4">
                                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-50">
                                        <Users
                                            size={20}
                                            className="text-blue-600"
                                        />
                                    </div>

                                    <div>
                                        <h3 className="font-semibold text-slate-800">
                                            School Community
                                        </h3>

                                        <p className="mt-1 text-sm text-slate-500">
                                            Stay connected with our school
                                            community and activities.
                                        </p>
                                    </div>
                                </div>

                            </div>

                        </div>


                        {/* Right */}
                        <div className="relative h-[350px] overflow-hidden rounded-2xl md:h-[430px]">

                            <Image
                                src="https://images.unsplash.com/photo-1503676260728-1c00da094a0b?q=80&w=1200&auto=format&fit=crop"
                                alt="Students learning"
                                fill
                                className="object-cover"
                            />

                        </div>

                    </div>
                </div>
            </section>


            {/* =====================================================
                NEWSLETTER
            ====================================================== */}
            <section className="px-5 py-14 md:px-8 md:py-20">
                <div className="mx-auto max-w-5xl overflow-hidden rounded-3xl bg-blue-600 px-6 py-12 text-center md:px-12">

                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-white/15">
                        <Mail
                            size={26}
                            className="text-white"
                        />
                    </div>

                    <h2 className="mt-5 text-3xl font-bold text-white md:text-4xl">
                        Never Miss an Update
                    </h2>

                    <p className="mx-auto mt-4 max-w-xl leading-7 text-blue-100">
                        Subscribe to our newsletter and receive the latest
                        educational articles, school news, and important
                        updates directly in your inbox.
                    </p>

                    <div className="mx-auto mt-7 flex max-w-lg flex-col gap-3 sm:flex-row">

                        <input
                            type="email"
                            placeholder="Enter your email address"
                            className="h-12 flex-1 rounded-lg border-0 bg-white px-4 text-sm text-slate-800 outline-none placeholder:text-slate-400"
                        />

                        <button
                            type="button"
                            className="h-12 rounded-lg bg-slate-900 px-6 text-sm font-semibold text-white transition hover:bg-slate-800"
                        >
                            Subscribe
                        </button>

                    </div>

                </div>
            </section>


            {/* =====================================================
                FINAL CTA
            ====================================================== */}
            <section className="bg-white px-5 py-16 text-center md:px-8 md:py-20">

                <div className="mx-auto max-w-3xl">

                    <h2 className="text-3xl font-bold text-slate-900 md:text-4xl">
                        Have a Question or a Story to Share?
                    </h2>

                    <p className="mt-5 leading-7 text-slate-500">
                        We would love to hear from our students, teachers,
                        parents, and community members. Get in touch with us
                        and become a part of our growing community.
                    </p>

                    <Link
                        href="/contact"
                        className="mt-7 inline-flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
                    >
                        Contact Us
                        <ArrowRight size={17} />
                    </Link>

                </div>

            </section>

        </main>
    );
};

export default BlogPage;