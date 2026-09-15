import { getNotices } from "@/app/lib/data";
import Link from "next/link";
import { NoticeItem } from "@/types/types";
import NoticeAction from "@/app/component/NoticeAction";
import {
  BellRing,
  PlusCircle,
  Calendar,
  FileText,
} from "lucide-react";

const page = async () => {
  const notices: NoticeItem[] = await getNotices();

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <div className="overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-xl shadow-slate-100">
        {/* Header Section */}
        <div className="flex flex-col gap-4 border-b border-slate-100 p-6 sm:flex-row sm:items-center sm:justify-between bg-emerald-50/30">
          <div className="flex items-center gap-3.5">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-600 ring-1 ring-emerald-500/20">
              <BellRing className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                Notice Board
              </h2>
              <p className="text-xs font-medium text-slate-500 sm:text-sm">
                Stay updated with recent announcements
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Live Count Indicator */}
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200/60 bg-emerald-50 px-3.5 py-1.5 text-xs font-semibold text-emerald-700">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-600" />
              </span>
              <span>
                {notices.length} {notices.length === 1 ? "Notice" : "Notices"}
              </span>
            </div>

            {/* Create Notice Link */}
            <Link
              href="/admin/createNotice"
              className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-semibold text-white shadow-md shadow-emerald-600/20 transition-all duration-200 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
            >
              <PlusCircle className="h-4 w-4" />
              <span>Create Notice</span>
            </Link>
          </div>
        </div>

        {/* Notices List */}
        <div className="p-4 sm:p-6">
          {notices.length > 0 ? (
            <ul className="divide-y divide-slate-100">
              {notices.map((notice: NoticeItem) => {
                const dateObj = notice.issuedDate
                  ? new Date(notice.issuedDate)
                  : null;
                const day = dateObj ? dateObj.getDate() : "--";
                const month = dateObj
                  ? dateObj.toLocaleString("en-IN", { month: "short" })
                  : "N/A";

                return (
                  <li key={notice._id}>
                    <div className="group flex flex-col justify-between gap-4 rounded-2xl p-4 transition-all duration-200 hover:bg-emerald-50/40 sm:flex-row sm:items-center">
                      {/* Left Block: Date Badge & Title */}
                      <div className="flex items-center gap-4 min-w-0 flex-1">
                        {/* Compact Date Box */}
                        <div className="flex h-12 w-12 shrink-0 flex-col items-center justify-center rounded-xl bg-emerald-50 text-emerald-700 transition-colors group-hover:bg-emerald-600 group-hover:text-white">
                          <span className="text-sm font-extrabold leading-none">
                            {day}
                          </span>
                          <span className="mt-0.5 text-[10px] font-bold uppercase tracking-wider">
                            {month}
                          </span>
                        </div>

                        {/* Title & Date Subtext */}
                        <div className="min-w-0 flex-1">
                          <p className="text-base font-semibold text-slate-800 transition-colors group-hover:text-emerald-700 break-words">
                            {notice.title}
                          </p>
                          <div className="mt-1 flex items-center gap-1.5 text-xs font-medium text-slate-400">
                            <Calendar className="h-3.5 w-3.5 text-slate-400" />
                            <span>
                              {notice.issuedDate
                                ? new Date(
                                    notice.issuedDate
                                  ).toLocaleDateString("en-IN", {
                                    day: "2-digit",
                                    month: "short",
                                    year: "numeric",
                                  })
                                : "No Date"}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Right Block: Status Badge & Actions */}
                      <div className="flex shrink-0 items-center justify-between sm:justify-end gap-3 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                        {notice.status && (
                          <span
                            className={`rounded-full px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider ${
                              notice.status === "published"
                                ? "bg-emerald-100 text-emerald-800"
                                : notice.status === "draft"
                                ? "bg-slate-100 text-slate-700"
                                : notice.status === "archived"
                                ? "bg-purple-100 text-purple-800"
                                : "bg-rose-100 text-rose-800"
                            }`}
                          >
                            {notice.status}
                          </span>
                        )}

                        {/* Notice Actions Component */}
                        <NoticeAction notice={notice} />
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          ) : (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-400 mb-3">
                <FileText className="h-8 w-8" />
              </div>
              <h3 className="text-base font-semibold text-slate-700">
                No notices published yet
              </h3>
              <p className="mt-1 text-xs text-slate-400">
                Check back later or click above to create a new notice.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default page;