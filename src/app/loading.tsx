// app/loading.tsx
'use client';

import { GraduationCap, Loader2 } from 'lucide-react';

export default function Loading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-cyan-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10"></div>
      </div>

      <div className="max-w-2xl w-full relative z-10">
        {/* Main Card */}
        <div className="bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden border border-white/20">
          {/* Content */}
          <div className="px-8 py-12 md:px-12">
            <div className="flex flex-col items-center text-center">
              {/* Loading Animation */}
              <div className="relative mb-8">
                <div className="relative">
                  {/* Outer Ring */}
                  <div className="w-32 h-32 rounded-full border-4 border-blue-400/20 animate-pulse"></div>
                  
                  {/* Spinning Ring */}
                  <div className="absolute inset-0 w-32 h-32 rounded-full border-4 border-t-blue-400 border-r-transparent border-b-transparent border-l-transparent animate-spin"></div>
                  
                  {/* Inner Icon */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="p-4 bg-white/10 rounded-full backdrop-blur-sm border border-white/20">
                      <GraduationCap className="w-12 h-12 text-blue-300 animate-pulse" />
                    </div>
                  </div>
                </div>
              </div>

              <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">
                Loading...
              </h1>
              
              <p className="text-blue-200 text-lg mb-2">
                Please wait while we prepare your content
              </p>
              
              <p className="text-blue-300/70 text-sm mb-8 max-w-md">
                We're fetching the latest information for you
              </p>

              {/* Loading Progress Bar */}
              <div className="w-full max-w-sm">
                <div className="relative h-2 bg-white/10 rounded-full overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-400 via-indigo-400 to-cyan-400 rounded-full animate-loading-bar"></div>
                </div>
                <div className="flex justify-between mt-2">
                  <span className="text-blue-300/50 text-xs">Loading...</span>
                  <span className="text-blue-300/50 text-xs">Please wait</span>
                </div>
              </div>

              {/* Decorative Divider */}
              <div className="mt-8 w-full max-w-xs">
                <div className="h-px bg-gradient-to-r from-transparent via-blue-400/50 to-transparent"></div>
              </div>

              {/* Help Text */}
              <p className="mt-6 text-blue-300/50 text-sm">
                This shouldn't take long
              </p>
            </div>
          </div>
        </div>

        {/* Status Indicator */}
        <div className="mt-6 flex justify-center">
          <div className="flex items-center gap-3 px-4 py-2 bg-white/5 backdrop-blur-sm rounded-full border border-white/10">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-green-400"></span>
            </span>
            <span className="text-white/60 text-sm">Loading</span>
            <span className="w-px h-4 bg-white/10"></span>
            <span className="text-white/40 text-sm">v2.0</span>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes loading-bar {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }
        .animate-loading-bar {
          animation: loading-bar 1.5s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}