import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, CalendarDays, UserRound } from "lucide-react";
import { blogs } from "../blogData";

interface BlogDetailsPageProps {
    params: Promise<{
        id: string;
    }>;
}

const BlogDetailsPage = async ({
    params,
}: BlogDetailsPageProps) => {
    const { id } = await params;

    const blog = blogs.find(
        (item) => item.id === Number(id)
    );

    // Blog not found
    if (!blog) {
        return (
            <main className="flex min-h-screen items-center justify-center bg-[#f7f9fc] px-5">
                <div className="text-center">
                    <h1 className="text-3xl font-bold text-slate-900">
                        Blog Not Found
                    </h1>

                    <p className="mt-3 text-slate-500">
                        The blog you are looking for does not exist.
                    </p>

                    <Link
                        href="/blog"
                        className="mt-6 inline-flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
                    >
                        <ArrowLeft size={18} />
                        Back to Blog
                    </Link>
                </div>
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-[#f7f9fc]">

            {/* Hero / Header */}
            <section className="bg-white">
                <div className="mx-auto max-w-7xl px-5 py-12 md:px-8 md:py-16">

                    {/* Back Button */}
                    <Link
                        href="/blog"
                        className="mb-8 inline-flex items-center gap-2 text-sm font-semibold text-blue-600 transition hover:text-blue-700"
                    >
                        <ArrowLeft size={18} />
                        Back to Blog
                    </Link>

                    {/* Category */}
                    <div className="mb-5">
                        <span className="rounded-full bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-600">
                            {blog.category}
                        </span>
                    </div>

                    {/* Title */}
                    <h1 className="max-w-4xl text-3xl font-bold leading-tight text-slate-900 md:text-5xl">
                        {blog.title}
                    </h1>

                    {/* Description */}
                    <p className="mt-6 max-w-3xl text-base leading-7 text-slate-500 md:text-lg">
                        {blog.description}
                    </p>

                    {/* Meta Information */}
                    <div className="mt-7 flex flex-wrap items-center gap-6 text-sm text-slate-500">

                        <div className="flex items-center gap-2">
                            <CalendarDays
                                size={18}
                                className="text-blue-600"
                            />
                            <span>{blog.date}</span>
                        </div>

                        <div className="flex items-center gap-2">
                            <UserRound
                                size={18}
                                className="text-blue-600"
                            />
                            <span>{blog.author}</span>
                        </div>

                    </div>
                </div>
            </section>

            {/* Blog Content */}
            <section className="px-5 py-12 md:px-8 md:py-16">
                <div className="mx-auto max-w-5xl">

                    {/* Featured Image */}
                    <div className="relative h-[280px] overflow-hidden rounded-2xl sm:h-[400px] md:h-[500px]">
                        <Image
                            src={blog.image}
                            alt={blog.title}
                            fill
                            priority
                            className="object-cover"
                        />
                    </div>

                    {/* Article */}
                    <article className="mt-10 rounded-2xl bg-white p-6 shadow-sm md:p-10">

                        <div className="max-w-none">

                            {blog.content.map((paragraph, index) => (
                                <p
                                    key={index}
                                    className="mb-6 text-base leading-8 text-slate-600 last:mb-0 md:text-lg"
                                >
                                    {paragraph}
                                </p>
                            ))}

                        </div>

                    </article>

                    {/* Bottom Back Button */}
                    <div className="mt-8">
                        <Link
                            href="/blog"
                            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
                        >
                            <ArrowLeft size={18} />
                            Back to All Blogs
                        </Link>
                    </div>

                </div>
            </section>

        </main>
    );
};

export default BlogDetailsPage;