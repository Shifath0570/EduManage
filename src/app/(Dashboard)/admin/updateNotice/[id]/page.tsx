// app/not-found.tsx
'use client';

import { useRouter } from 'next/navigation';
import { ArrowLeft, Home, FileText, AlertCircle } from 'lucide-react';

export default function NotFound() {
  const router = useRouter();

  const handleGoBack = () => {
    router.back();
  };

  const handleGoHome = () => {
    router.push('/');
  };

  return (
    <div className="max-w-4xl mx-auto p-4 min-h-screen flex items-center justify-center">
      <div className="w-full">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Page Not Found</h1>
          <span className="text-sm text-gray-500">Error 404</span>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-lg border border-gray-200 p-8">
          <div className="text-center">
            {/* Icon */}
            <div className="flex justify-center mb-6">
              <div className="bg-blue-50 p-4 rounded-full">
                <FileText className="w-16 h-16 text-blue-600" />
              </div>
            </div>

            {/* Error Number */}
            <div className="text-7xl font-bold text-gray-800 mb-2">
              404
            </div>
            
            <h2 className="text-2xl font-semibold text-gray-700 mb-3">
              Oops! Page Not Found
            </h2>
            
            <p className="text-gray-500 mb-8 max-w-md mx-auto">
              The page you're looking for doesn't exist or has been moved. 
              Let's get you back on track.
            </p>

            {/* Divider */}
            <div className="w-20 h-1 bg-blue-600 mx-auto mb-8 rounded-full"></div>

            {/* Action Buttons - Matching the notice component style */}
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              {/* Go to Previous Page Button */}
              <button
                onClick={handleGoBack}
                className="flex-1 bg-gray-100 text-gray-700 py-2.5 px-4 rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center gap-2 font-medium"
              >
                <ArrowLeft className="w-5 h-5" />
                Previous Page
              </button>

              {/* Go Back Home Button */}
              <button
                onClick={handleGoHome}
                className="flex-1 bg-blue-600 text-white py-2.5 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 font-medium"
              >
                <Home className="w-5 h-5" />
                Back Home
              </button>
            </div>

            {/* Quick Links */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <p className="text-sm text-gray-500 mb-3">Quick Navigation</p>
              <div className="flex flex-wrap justify-center gap-3">
                <button
                  onClick={() => router.push('/')}
                  className="text-sm text-blue-600 hover:text-blue-800 hover:underline"
                >
                  Dashboard
                </button>
                <span className="text-gray-300">|</span>
                <button
                  onClick={() => router.push('/notice')}
                  className="text-sm text-blue-600 hover:text-blue-800 hover:underline"
                >
                  Notices
                </button>
                <span className="text-gray-300">|</span>
                <button
                  onClick={() => router.push('/students')}
                  className="text-sm text-blue-600 hover:text-blue-800 hover:underline"
                >
                  Students
                </button>
                <span className="text-gray-300">|</span>
                <button
                  onClick={() => router.push('/teachers')}
                  className="text-sm text-blue-600 hover:text-blue-800 hover:underline"
                >
                  Teachers
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Status Info - Matching the notice component style */}
        <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-green-400"></span>
              </span>
              <span className="text-sm text-gray-600">System Online</span>
            </div>
            <span className="text-gray-300">|</span>
            <span className="text-sm text-gray-500">v2.0</span>
          </div>
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-gray-400" />
            <span className="text-sm text-gray-500">Need help? Contact support</span>
          </div>
        </div>

        {/* Development info (optional) */}
        {process.env.NODE_ENV === 'development' && (
          <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
            <p className="text-xs text-gray-400">
              <span className="font-medium">Note:</span> This is the 404 error page.
              Customize it to match your brand.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}