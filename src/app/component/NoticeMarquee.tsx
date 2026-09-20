"use client";

import React, { useState } from "react";
import { Megaphone, X } from "lucide-react";

interface NoticeMarqueeProps {
  /** Text or array of text to display */
  notices?: string | string[];
  /** Animation speed in seconds */
  speed?: number;
  /** Badge title */
  title?: string;
  /** Allow user to close the banner */
  dismissible?: boolean;
}

export default function NoticeMarquee({
  notices = [
    "Admission open for academic session 2026-2027. Apply before October 15th!",
    "Mid-term exam schedules have been uploaded to the student portal.",
    "Library will remain closed this upcoming Sunday for annual inventory.",
  ],
  speed = 25,
  title = "NOTICE",
  dismissible = true,
}: NoticeMarqueeProps) {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  const noticeItems = Array.isArray(notices) ? notices : [notices];

  return (
    <div className="relative flex w-full items-center overflow-hidden rounded-xl border border-emerald-200/60 bg-gradient-to-r from-emerald-50/70 via-[#EBFBFA]/60 to-[#FFF9EE]/70 font-sans text-slate-900 shadow-2xs backdrop-blur-md">
      {/* Dynamic Keyframes for Smooth Scroll */}
      <style>{`
        @keyframes marquee-scroll {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-100%); }
        }
        .animate-marquee-smooth {
          animation: marquee-scroll ${speed}s linear infinite;
        }
      `}</style>

      {/* Static Left Badge */}
      <div className="z-10 flex shrink-0 items-center gap-2 border-r border-emerald-200/80 bg-emerald-500 px-4 py-3 text-xs font-bold tracking-wider text-white uppercase shadow-xs">
        <Megaphone className="h-4 w-4 animate-bounce text-emerald-100" />
        <span>{title}</span>
      </div>

      {/* Marquee Track Container */}
      <div className="group relative flex overflow-hidden py-3">
        {/* Track 1 */}
        <div className="animate-marquee-smooth flex shrink-0 whitespace-nowrap group-hover:[animation-play-state:paused]">
          {noticeItems.map((notice, idx) => (
            <span key={idx} className="mx-6 text-sm font-semibold text-slate-800">
              {notice}
              <span className="ml-12 font-bold text-emerald-500">•</span>
            </span>
          ))}
        </div>

        {/* Track 2 (Duplicate for Seamless Infinite Loop) */}
        <div
          aria-hidden="true"
          className="animate-marquee-smooth flex shrink-0 whitespace-nowrap group-hover:[animation-play-state:paused]"
        >
          {noticeItems.map((notice, idx) => (
            <span key={`dup-${idx}`} className="mx-6 text-sm font-semibold text-slate-800">
              {notice}
              <span className="ml-12 font-bold text-emerald-500">•</span>
            </span>
          ))}
        </div>
      </div>

      {/* Dismiss Button with Smooth Gradient Trail */}
      {dismissible && (
        <div className="z-10 shrink-0 bg-gradient-to-l from-[#FFF9EE] via-[#FFF9EE]/80 to-transparent pl-6 pr-3 py-3">
          <button
            type="button"
            onClick={() => setIsVisible(false)}
            aria-label="Dismiss notice"
            className="rounded-lg p-1 text-slate-400 transition-colors hover:bg-emerald-100/70 hover:text-emerald-700 focus:outline-hidden"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}
    </div>
  );
}




