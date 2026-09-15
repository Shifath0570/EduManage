import { NoticeItem } from '@/types/types';
import { getNotices } from '../lib/data';
import Link from 'next/link';
import { FaBullhorn, FaCalendarAlt, FaChevronRight } from 'react-icons/fa';

// Forces dynamic server rendering so Next.js build doesn't crash if backend is offline
export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const notices: NoticeItem[] = await getNotices();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-25 ">
      <div className="flex flex-col rounded-3xl border border-slate-200/80 bg-white shadow-xl shadow-slate-200/50">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 p-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600">
              <FaBullhorn className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-xl font-bold tracking-tight text-slate-900">
                Notice Board
              </h3>
              <p className="text-xs text-slate-500">
                Latest announcements & updates
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Notice Counter */}
            <div className="hidden sm:flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
              </span>
              <span>{notices.length} Notices</span>
            </div>

            <Link
              href="/notice"
              className="group inline-flex items-center gap-1 rounded-lg bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700 transition-colors hover:bg-emerald-100"
            >
              <span>View All</span>
              <FaChevronRight className="h-2.5 w-2.5 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>
        </div>

        {/* Content List */}
        <div className="flex-1 divide-y divide-slate-100 p-3">
          {notices.length > 0 ? (
            notices.map((item: NoticeItem) => {
              const dateObj = item.issuedDate ? new Date(item.issuedDate) : null;
              const day = dateObj ? dateObj.getDate() : "--";
              const month = dateObj
                ? dateObj.toLocaleString("en-IN", { month: "short" })
                : "N/A";

              return (
                <Link
                  href={`/notice/${item._id}`}
                  key={item._id}
                  className="group flex items-start gap-4 rounded-2xl p-3.5 transition-all duration-200 hover:bg-slate-50/80 hover:shadow-xs"
                >
                  {/* Date Badge */}
                  <div className="flex h-12 w-12 shrink-0 flex-col items-center justify-center rounded-xl bg-slate-100 text-slate-700 transition-colors group-hover:bg-emerald-600 group-hover:text-white">
                    <span className="text-sm font-extrabold leading-none">
                      {day}
                    </span>
                    <span className="mt-0.5 text-[10px] font-bold uppercase tracking-wider">
                      {month}
                    </span>
                  </div>

                  {/* Item Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <h4 className="text-sm font-semibold text-slate-800 truncate transition-colors group-hover:text-emerald-600">
                        {item.title}
                      </h4>
                      {item.status && (
                        <span
                          className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                            item.status === 'published'
                              ? 'bg-emerald-100 text-emerald-800'
                              : item.status === 'draft'
                              ? 'bg-slate-100 text-slate-700'
                              : item.status === 'archived'
                              ? 'bg-purple-100 text-purple-800'
                              : 'bg-rose-100 text-rose-800'
                          }`}
                        >
                          {item.status}
                        </span>
                      )}
                    </div>

                    <div className="mt-1.5 flex items-center gap-2 text-xs text-slate-400">
                      <FaCalendarAlt className="h-3 w-3 text-slate-400" />
                      <span>
                        {item.issuedDate
                          ? new Date(item.issuedDate).toLocaleDateString("en-IN", {
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                            })
                          : "No Date"}
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-slate-400">
              <FaBullhorn className="h-8 w-8 text-slate-300" />
              <p className="mt-2 text-sm font-medium">No notices published yet</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}