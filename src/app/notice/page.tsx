// app/page.tsx
import { NoticeItem } from '@/types/types';
import { getNotices } from '../lib/data';
import Link from 'next/link';
import { HiSpeakerphone } from 'react-icons/hi';



export default async function HomePage() {
  const notices: NoticeItem[] = await getNotices();

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 bg-white rounded-2xl shadow-xl border border-gray-100">

      {/* Section Heading */}
      <div className="mb-12">
        <div className="flex flex-col items-center justify-between gap-4 md:flex-row md:gap-0">
          <div>
            <h2 className="text-3xl font-bold text-slate-900 md:text-4xl">
              📢 Notices
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Stay connected with school updates
            </p>
          </div>
          <div className="flex items-center gap-2 rounded-full bg-blue-50 px-4 py-2">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-blue-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-blue-500" />
            </span>
            <span className="text-sm font-medium text-blue-600">New updates</span>
          </div>
        </div>
        <div className="mt-4 h-0.5 w-full bg-gradient-to-r from-transparent via-blue-200 to-transparent" />
      </div>


      {notices.length > 0 ? (
        <ul className="divide-y divide-gray-100">
          {notices.map((notice: NoticeItem, index: number) => (
            <li key={notice._id}>
              <div className="flex items-center justify-between gap-4 sm:gap-5 p-4 sm:p-5 hover:bg-gray-50 transition duration-150 ease-in-out">
                <div className="flex items-center gap-4 sm:gap-5 min-w-0 flex-1">
                  <span className="flex-shrink-0 text-blue-500 text-2xl sm:text-3xl">
                    <HiSpeakerphone />
                  </span>
                  <p className="text-sm sm:text-base lg:text-lg font-semibold text-gray-800 truncate">
                    {notice.title}
                  </p>
                </div>

                <div className="flex-shrink-0 ml-4">
                  <Link href={`/notice/${notice._id}`}>
                    <span className="text-blue-600 hover:text-blue-800 font-medium text-sm sm:text-base lg:text-lg">
                      View Details
                    </span>
                  </Link>
                </div>
              </div>

            </li>
          ))}
        </ul>
      ) : (
        <div className="flex flex-col items-center justify-center py-16 sm:py-24">
          <div className="bg-gray-50 rounded-full p-6 mb-4">
            <HiSpeakerphone className="text-4xl text-gray-300" />
          </div>
          <p className="text-gray-400 text-lg font-medium">No notices available</p>
          <p className="text-gray-300 text-sm mt-1">Check back later for updates</p>
        </div>
      )}
    </div>
  );
}