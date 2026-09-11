"use client";

import React, { useEffect, useState, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { BookOpen, Users, Award, Layers } from "lucide-react";

interface StatItemProps {
    targetValue: number;
    suffix?: string;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    delay: number;
    inView: boolean;
}

function StatCard({
    targetValue,
    suffix = "",
    label,
    icon: Icon,
    delay,
    inView,
}: StatItemProps) {
    const [count, setCount] = useState(0);

    useEffect(() => {
        if (!inView) return;

        const duration = 1800;
        const startTime = performance.now();

        const animate = (currentTime: number) => {
            const progress = Math.min((currentTime - startTime) / duration, 1);
            const easedProgress = 1 - Math.pow(1 - progress, 3);
            setCount(Math.floor(targetValue * easedProgress));

            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };

        requestAnimationFrame(animate);
    }, [inView, targetValue]);

    return (
        <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay }}
            whileHover={{ y: -6 }}
            className="group relative flex flex-col items-center justify-center rounded-3xl border border-white/80 bg-white/80 p-6 text-center backdrop-blur-md shadow-lg shadow-slate-200/50 transition-all duration-300 hover:border-emerald-300/60 hover:bg-white hover:shadow-2xl hover:shadow-emerald-900/10"
        >
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-emerald-100/80 bg-emerald-50 text-emerald-600 shadow-xs transition-all duration-300 group-hover:scale-110 group-hover:bg-emerald-500 group-hover:text-white">
                <Icon className="h-7 w-7" />
            </div>

            <div className="mt-4 flex items-baseline justify-center gap-0.5">
                <span className="text-3xl font-extrabold tracking-tight text-slate-900 transition-colors group-hover:text-emerald-600 sm:text-4xl">
                    {count}
                </span>
                <span className="text-2xl font-extrabold text-emerald-500 sm:text-3xl">
                    {suffix}
                </span>
            </div>

            <p className="mt-1 text-xs font-semibold text-slate-600 sm:text-sm">
                {label}
            </p>
        </motion.div>
    );
}

const Statistics = () => {
    const containerRef = useRef(null);
    const isInView = useInView(containerRef, { once: true, margin: "-60px" });

    const stats = [
        {
            label: "Published Articles",
            targetValue: 50,
            suffix: "+",
            icon: BookOpen,
        },
        {
            label: "Expert Writers",
            targetValue: 12,
            suffix: "+",
            icon: Award,
        },
        {
            label: "Monthly Readers",
            targetValue: 25,
            suffix: "K+",
            icon: Users,
        },
        {
            label: "Topics & Categories",
            targetValue: 8,
            suffix: "+",
            icon: Layers,
        },
    ];

    return (
        <section ref={containerRef} className="relative z-10 -mt-8 px-5 md:px-8">
            <div className="mx-auto max-w-7xl">
                <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
                    {stats.map((item, idx) => (
                        <StatCard
                            key={item.label}
                            label={item.label}
                            targetValue={item.targetValue}
                            suffix={item.suffix}
                            icon={item.icon}
                            delay={idx * 0.1}
                            inView={isInView}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Statistics;
