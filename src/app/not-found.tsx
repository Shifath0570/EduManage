// app/not-found.tsx
'use client';

import { useRouter } from 'next/navigation';
import { ArrowLeft, Home, GraduationCap, Compass } from 'lucide-react';

export default function NotFound() {
  const router = useRouter();

  const handleGoBack = () => {
    router.back();
  };

  const handleGoHome = () => {
    router.push('/');
  };

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
              {/* Animated 404 */}
              <div className="relative mb-8">
                <div className="text-8xl md:text-9xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-cyan-400 animate-pulse">
                  404
                </div>
                <div className="absolute -top-4 -right-4 md:-top-6 md:-right-6">
                  <Compass className="w-12 h-12 text-blue-200 animate-spin-slow" />
                </div>
              </div>

              {/* Icon */}
              <div className="mb-6 p-4 bg-white/10 rounded-full backdrop-blur-sm border border-white/20">
                <GraduationCap className="w-12 h-12 text-blue-300" />
              </div>

              <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">
                Page Not Found
              </h1>
              
              <p className="text-blue-200 text-lg mb-2">
                Oops! Looks like you've taken a wrong turn.
              </p>
              
              <p className="text-blue-300/70 text-sm mb-8 max-w-md">
                The page you're looking for might have been moved, deleted, or never existed in the first place.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 w-full max-w-sm">
                {/* Go to Previous Page Button */}
                <button
                  onClick={handleGoBack}
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-3.5 bg-white/10 hover:bg-white/20 text-white font-medium rounded-2xl transition-all duration-300 border border-white/20 hover:border-white/40 hover:scale-105 hover:shadow-xl backdrop-blur-sm"
                >
                  <ArrowLeft className="w-5 h-5" />
                  Previous Page
                </button>

                {/* Go Back Home Button */}
                <button
                  onClick={handleGoHome}
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-3.5 bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white font-medium rounded-2xl transition-all duration-300 hover:scale-105 hover:shadow-2xl shadow-lg"
                >
                  <Home className="w-5 h-5" />
                  Back Home
                </button>
              </div>

              {/* Decorative Divider */}
              <div className="mt-8 w-full max-w-xs">
                <div className="h-px bg-gradient-to-r from-transparent via-blue-400/50 to-transparent"></div>
              </div>

              {/* Help Text */}
              <p className="mt-6 text-blue-300/50 text-sm">
                Need assistance? Contact our support team
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
            <span className="text-white/60 text-sm">System Online</span>
            <span className="w-px h-4 bg-white/10"></span>
            <span className="text-white/40 text-sm">v2.0</span>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes spin-slow {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
        .animate-spin-slow {
          animation: spin-slow 8s linear infinite;
        }
      `}</style>
    </div>
  );
}