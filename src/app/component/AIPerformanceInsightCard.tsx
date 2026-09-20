"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Sparkles, Award } from "lucide-react";
<<<<<<< HEAD
import { fetchWithAuth } from "@/app/lib/api";
=======
>>>>>>> b88572d96ea733a1804a78636619141f053b7d0e

export interface StudentInsightData {
  studentId: string;
  studentName?: string;
  className?: string;
  section?: string;
  roll?: string;
  insights?: {
    headline?: string;
    subline?: string;
    compliment?: string;
    performanceLevel?: string;
  };
}

interface AIPerformanceInsightCardProps {
  userEmail?: string;
  userId?: string;
}

export default function AIPerformanceInsightCard({ userEmail, userId }: AIPerformanceInsightCardProps) {
  const [insight, setInsight] = useState<StudentInsightData | null>(null);
  const [hasData, setHasData] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(true);

  const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

  const fetchInsight = useCallback(async () => {
    if (!userEmail && !userId) {
      setLoading(false);
      return;
    }

    setLoading(true);

    try {
      const queryParams = new URLSearchParams();
      if (userEmail) queryParams.set("email", userEmail);
      if (userId) queryParams.set("userId", userId);

<<<<<<< HEAD
      const res = await fetchWithAuth(`${API_BASE}/api/marks/performance-insight?${queryParams.toString()}`);
=======
      const res = await fetch(`${API_BASE}/api/marks/performance-insight?${queryParams.toString()}`);
>>>>>>> b88572d96ea733a1804a78636619141f053b7d0e
      const json = await res.json();

      if (!res.ok || !json.success) {
        setHasData(false);
        setInsight(null);
        return;
      }

      if (json.hasData === false || !json.data) {
        setHasData(false);
        setInsight(null);
      } else {
        setHasData(true);
        setInsight(json.data);
      }
    } catch (err: unknown) {
      console.error("Error loading performance insight:", err);
      setHasData(false);
    } finally {
      setLoading(false);
    }
  }, [userEmail, userId, API_BASE]);

  useEffect(() => {
    fetchInsight();
  }, [fetchInsight]);

  // 1. Loading Skeleton State (Executive Dark Navy & Emerald)
  if (loading) {
    return (
      <div className="w-full rounded-[2rem] bg-gradient-to-br from-[#021838] via-[#052852] to-[#08386c] p-7 sm:p-8 md:p-9 shadow-xl shadow-slate-950/10 border border-emerald-500/20 ring-1 ring-white/10 animate-pulse space-y-4">
        <div className="flex items-center gap-2">
          <div className="h-6 w-36 rounded-full bg-emerald-500/20" />
        </div>
        <div className="h-7 w-4/5 rounded-xl bg-white/15" />
        <div className="h-4 w-3/5 rounded-lg bg-white/10" />
      </div>
    );
  }

  // 2. Empty / Awaiting Results State (Professional Encouraging Notice)
  if (!hasData || !insight || !insight.insights) {
    return (
      <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-[#021838] via-[#052852] to-[#08386c] p-7 sm:p-8 md:p-9 text-white shadow-xl shadow-slate-950/10 border border-emerald-500/20 ring-1 ring-white/10 font-sans transition-all duration-300">
        {/* Ambient Glows */}
        <div className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-emerald-500/15 blur-3xl" />
        <div className="pointer-events-none absolute -left-20 -bottom-20 h-72 w-72 rounded-full bg-teal-400/10 blur-3xl" />

        {/* Decorative Watermark Icon */}
        <Award className="pointer-events-none absolute -right-6 -bottom-6 h-48 w-48 text-white/[0.04] stroke-[1]" />

        <div className="relative z-10 space-y-3.5 max-w-4xl">
          {/* Status Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-500/15 border border-emerald-400/30 text-emerald-300 text-xs font-semibold backdrop-blur-md">
            <Sparkles className="h-3.5 w-3.5 text-emerald-400" />
            <span>AI Academic Insight</span>
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse ml-0.5" />
          </div>

          {/* Headline */}
          <h2 className="text-xl sm:text-2xl md:text-[26px] font-extrabold tracking-tight text-white leading-snug sm:leading-tight">
            Get ready to excel in your upcoming examinations! <br className="hidden sm:inline" />
            Stay focused, maintain your routine, and success is yours!
          </h2>

          {/* Subtitle */}
          <p className="text-xs sm:text-sm md:text-base text-emerald-100/80 font-normal leading-relaxed">
            Your personalized AI academic compliments and performance analysis will automatically appear right here as soon as examination marks are published.
          </p>
        </div>
      </div>
    );
  }

  const { insights } = insight;
  const headline =
    insights.headline ||
    insights.compliment ||
    "You are doing fantastic in your exams so far! Keep this up and the top rank is yours!";
  const subline =
    insights.subline ||
    "Keep up this wonderful performance. Staying consistent at the top of the leaderboard will take you far!";

  return (
    <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-[#021838] via-[#052852] to-[#08386c] p-7 sm:p-8 md:p-9 text-white shadow-xl shadow-slate-950/10 border border-emerald-500/25 ring-1 ring-white/10 font-sans transition-all duration-300 hover:shadow-2xl hover:border-emerald-500/40">
      {/* Refined Ambient Glows */}
      <div className="pointer-events-none absolute -right-20 -top-20 h-80 w-80 rounded-full bg-emerald-500/20 blur-3xl" />
      <div className="pointer-events-none absolute -left-20 -bottom-20 h-80 w-80 rounded-full bg-teal-400/15 blur-3xl" />

      {/* Decorative Subtle Background Watermark */}
      <Award className="pointer-events-none absolute -right-6 -bottom-6 h-52 w-52 text-white/[0.04] stroke-[1]" />

      <div className="relative z-10 space-y-3.5 max-w-4xl">
        {/* Status Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-500/15 border border-emerald-400/30 text-emerald-300 text-xs font-semibold backdrop-blur-md">
          <Sparkles className="h-3.5 w-3.5 text-emerald-400" />
          <span>AI Academic Insight</span>
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse ml-0.5" />
        </div>

        {/* Large Vibrant Main Compliment Headline (Line 1 & Line 2) */}
        <h2 className="text-xl sm:text-2xl md:text-[26px] lg:text-[28px] font-extrabold tracking-tight text-white leading-snug sm:leading-tight drop-shadow-sm">
          {headline}
        </h2>

        {/* Supporting Motivation Subline (Line 3) */}
        <p className="text-xs sm:text-sm md:text-base text-emerald-100/90 font-normal leading-relaxed">
          {subline}
        </p>
      </div>
    </div>
  );
}
