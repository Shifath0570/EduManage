"use client";

import React, { useEffect, useState } from "react";

const Statistics = () => {
    const [articles, setArticles] = useState(0);
    const [writers, setWriters] = useState(0);
    const [readers, setReaders] = useState(0);
    const [categories, setCategories] = useState(0);

    useEffect(() => {
        const duration = 1800;
        const startTime = performance.now();

        const animate = (currentTime: number) => {
            const progress = Math.min(
                (currentTime - startTime) / duration,
                1
            );

            // Smooth ease-out
            const easedProgress =
                1 - Math.pow(1 - progress, 3);

            setArticles(Math.floor(50 * easedProgress));
            setWriters(Math.floor(10 * easedProgress));
            setReaders(Math.floor(15 * easedProgress));
            setCategories(Math.floor(8 * easedProgress));

            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };

        requestAnimationFrame(animate);

        return () => {
            // Animation cleanup handled by browser
        };
    }, []);

    return (
        <section className="px-5 py-10 md:px-8">
            <div className="mx-auto grid max-w-6xl grid-cols-2 overflow-hidden rounded-2xl bg-white shadow-sm md:grid-cols-4">

                {/* Published Articles */}
                <div className="border-b border-slate-100 p-6 text-center md:border-b-0 md:border-r">
                    <h3 className="text-3xl font-bold text-blue-600">
                        {articles}+
                    </h3>

                    <p className="mt-2 text-sm text-slate-500">
                        Published Articles
                    </p>
                </div>

                {/* Expert Writers */}
                <div className="border-b border-slate-100 p-6 text-center md:border-b-0 md:border-r">
                    <h3 className="text-3xl font-bold text-blue-600">
                        {writers}+
                    </h3>

                    <p className="mt-2 text-sm text-slate-500">
                        Expert Writers
                    </p>
                </div>

                {/* Monthly Readers */}
                <div className="border-r-0 border-slate-100 p-6 text-center md:border-r">
                    <h3 className="text-3xl font-bold text-blue-600">
                        {readers}K+
                    </h3>

                    <p className="mt-2 text-sm text-slate-500">
                        Monthly Readers
                    </p>
                </div>

                {/* Categories */}
                <div className="p-6 text-center">
                    <h3 className="text-3xl font-bold text-blue-600">
                        {categories}+
                    </h3>

                    <p className="mt-2 text-sm text-slate-500">
                        Categories
                    </p>
                </div>

            </div>
        </section>
    );
};

export default Statistics;