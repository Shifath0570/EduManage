import { getNoticeById } from "@/app/lib/data";
import { NoticeItem } from "@/types/types";
import { UserIcon, MailIcon, PhoneIcon, FileTextIcon, ClockIcon } from "lucide-react";
import Link from "next/link";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function Page({ params }: PageProps) {
  const { id } = await params;
  const notice: NoticeItem | null = await getNoticeById(id);

  console.log("Id:", id);
  console.log("Notice:", notice);

  if (!notice) {
    return (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 bg-white rounded-2xl shadow-xl border border-gray-100 min-h-[60vh] flex items-center justify-center">
        <p className="text-gray-500 text-lg">Notice not found</p>
      </div>
    );
  }

  // Format date helper
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Format short date helper
  const formatDateShort = (dateString?: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        <Link 
          href="/notice" 
          className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 transition-colors mb-6"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
          Back to Notices
        </Link>

        {/* Main Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          {/* Header with Status Badge */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-500 px-6 sm:px-8 py-6 sm:py-8">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                    notice.status === 'published' 
                      ? 'bg-green-500/20 text-green-100' 
                      : 'bg-yellow-500/20 text-yellow-100'
                  }`}>
                    {notice.status === 'published' ? '✓ Published' : 'Draft'}
                  </span>
                  {notice.isActive && (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-500/20 text-blue-100">
                      Active
                    </span>
                  )}
                </div>
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white">
                  {notice.title}
                </h1>
                {notice.content?.subject && (
                  <p className="text-blue-100 mt-2 text-sm sm:text-base">
                    {notice.content.subject}
                  </p>
                )}
              </div>
              <div className="flex-shrink-0">
                <div className="bg-white/10 backdrop-blur-sm rounded-lg px-4 py-2 text-white">
                  <div className="text-xs text-blue-200">Issued Date</div>
                  <div className="font-medium">{formatDateShort(notice.issuedDate)}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Content Body */}
          <div className="p-6 sm:p-8 space-y-8">
            {/* Summary Section */}
            {notice.content?.summary && (
              <div className="bg-blue-50 rounded-xl p-4 sm:p-6 border border-blue-100">
                <h2 className="text-sm font-semibold text-blue-600 uppercase tracking-wider mb-2">
                  Summary
                </h2>
                <p className="text-gray-700 text-base sm:text-lg font-medium">
                  {notice.content.summary}
                </p>
              </div>
            )}

            {/* Full Text Section */}
            {notice.content?.fullText && (
              <div>
                <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3 flex items-center gap-2">
                  <FileTextIcon className="h-4 w-4" />
                  Full Notice
                </h2>
                <div className="prose prose-blue max-w-none">
                  <p className="text-gray-700 whitespace-pre-line text-base leading-relaxed">
                    {notice.content.fullText}
                  </p>
                </div>
              </div>
            )}

            {/* Issued By Section */}
            {notice.issuedBy && (
              <div className="border-t border-gray-200 pt-6">
                <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4 flex items-center gap-2">
                  <UserIcon className="h-4 w-4" />
                  Issued By
                </h2>
                <div className="bg-gray-50 rounded-xl p-4 sm:p-6 border border-gray-100">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex items-start gap-3">
                      <UserIcon className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-sm text-gray-500">Name</p>
                        <p className="font-medium text-gray-900">{notice.issuedBy.name || 'N/A'}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 0h8v12H6V4z" clipRule="evenodd" />
                        <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                      </svg>
                      <div>
                        <p className="text-sm text-gray-500">Designation</p>
                        <p className="font-medium text-gray-900">{notice.issuedBy.designation || 'N/A'}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <MailIcon className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-sm text-gray-500">Email</p>
                        {notice.issuedBy.email ? (
                          <a href={`mailto:${notice.issuedBy.email}`} className="font-medium text-blue-600 hover:text-blue-800 transition-colors">
                            {notice.issuedBy.email}
                          </a>
                        ) : (
                          <p className="font-medium text-gray-900">N/A</p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <PhoneIcon className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-sm text-gray-500">Contact</p>
                        {notice.issuedBy.contactNumber ? (
                          <a href={`tel:${notice.issuedBy.contactNumber}`} className="font-medium text-gray-900 hover:text-blue-600 transition-colors">
                            {notice.issuedBy.contactNumber}
                          </a>
                        ) : (
                          <p className="font-medium text-gray-900">N/A</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Footer with Meta Info */}
            <div className="border-t border-gray-200 pt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-sm text-gray-500">
              <div className="flex items-center gap-4 flex-wrap">
                <div className="flex items-center gap-1.5">
                  <ClockIcon className="h-4 w-4" />
                  <span>Created: {formatDate(notice.createdAt || notice.issuedDate)}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666 5.002 5.002 0 00-8.516-1.833A1 1 0 014.5 5.5V3a1 1 0 011-1z" clipRule="evenodd" />
                    <path d="M10 6a4 4 0 100 8 4 4 0 000-8z" />
                  </svg>
                  <span>Updated: {formatDate(notice.updatedAt || notice.issuedDate)}</span>
                </div>
              </div>
              <div className="text-xs text-gray-400">
                Notice ID: #{notice._id.slice(-8)}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}









