"use client";
import { NoticeData } from '@/types/types';
import Link from 'next/link';
import { 
  HiSpeakerphone, 
  HiOutlineEye,
  HiOutlineCalendar,
  HiOutlineUser,
  HiOutlineClock,
  HiOutlineCheckCircle,
  HiOutlineXCircle 
} from 'react-icons/hi';
import { FaRegEdit } from 'react-icons/fa';
import { MdOutlinePublishedWithChanges } from 'react-icons/md';
import { useState } from 'react';
import NoticeDeleteButton from './NoticeDeleteButton';

interface NoticeActionProps {
  notice: NoticeData;
  showEdit?: boolean;
}

const NoticeAction = ({ notice ,  showEdit = true }: NoticeActionProps) => {

  // Format date function
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Get time ago
  const getTimeAgo = (dateString: string) => {
    const diff = Date.now() - new Date(dateString).getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    
    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    if (minutes > 0) return `${minutes}m ago`;
    return 'Just now';
  };

 


  return (
    <>
      <div className="group relative overflow-hidden transition-all duration-300 hover:bg-gradient-to-r hover:from-blue-50/50 hover:to-transparent rounded-xl">
        {/* Status indicator bar */}
        <div className={`absolute left-0 top-0 h-full w-1 transition-all duration-300 ${
          notice.isActive 
            ? 'bg-gradient-to-b from-green-400 to-green-600' 
            : 'bg-gradient-to-b from-gray-300 to-gray-400'
        } ${notice.isActive ? 'group-hover:w-1.5' : 'group-hover:w-1.5'}`} 
        />
        
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 sm:p-5 pl-6 sm:pl-7">
          
          {/* Left Section - Icon & Content */}
          <div className="flex items-start gap-4 sm:gap-5 min-w-0 flex-1 w-full">
            <div className="flex-shrink-0 mt-0.5">
              <div className={`p-2.5 rounded-xl transition-all duration-300 group-hover:scale-105 ${
                notice.isActive 
                  ? 'bg-blue-50 group-hover:bg-blue-100' 
                  : 'bg-gray-50 group-hover:bg-gray-100'
              }`}>
                <HiSpeakerphone className={`text-xl sm:text-2xl transition-colors duration-300 ${
                  notice.isActive ? 'text-blue-600' : 'text-gray-400'
                }`} />
              </div>
            </div>
            
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <p className="text-sm sm:text-base lg:text-lg font-semibold text-gray-800 truncate max-w-[200px] sm:max-w-[300px] lg:max-w-[400px]">
                  {notice.notice.title}
                </p>
                
                {/* Status Badge */}
                <span className={`inline-flex items-center gap-1 text-xs px-2.5 py-0.5 rounded-full font-medium border transition-all duration-300 ${
                  notice.isActive 
                    ? 'bg-green-50 text-green-700 border-green-200 group-hover:bg-green-100' 
                    : 'bg-gray-50 text-gray-500 border-gray-200 group-hover:bg-gray-100'
                }`}>
                  {notice.isActive ? (
                    <HiOutlineCheckCircle className="text-[10px]" />
                  ) : (
                    <HiOutlineXCircle className="text-[10px]" />
                  )}
                  {notice.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>
              
              {/* Metadata */}
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 mt-1.5">
                <span className="flex items-center gap-1.5 text-xs text-gray-500">
                  <HiOutlineCalendar className="text-gray-400 text-[11px]" />
                  {formatDate(notice.notice.issuedDate)}
                </span>
                <span className="flex items-center gap-1.5 text-xs text-gray-500">
                  <HiOutlineUser className="text-gray-400 text-[11px]" />
                  {notice.notice.issuedBy.name}
                </span>
                <span className="flex items-center gap-1.5 text-xs text-gray-400">
                  <HiOutlineClock className="text-gray-400 text-[11px]" />
                  {getTimeAgo(notice.createdAt)}
                </span>
                {notice.notice.content?.subject && (
                  <span className="flex items-center gap-1.5 text-xs text-gray-400">
                    <MdOutlinePublishedWithChanges className="text-gray-400 text-[11px]" />
                    {notice.notice.content.subject}
                  </span>
                )}
              </div>
            </div>
          </div>
          
          {/* Right Section - Action Buttons */}
          <div className="flex items-center gap-2 flex-shrink-0 w-full sm:w-auto justify-end sm:justify-start mt-2 sm:mt-0">
            {/* View Button */}
            <Link href={`/notice/${notice._id}`}>
              <button 
                className="group/btn inline-flex items-center gap-1.5 px-3.5 py-2 text-sm bg-blue-50 hover:bg-blue-100 text-blue-700 font-medium rounded-lg transition-all duration-200 hover:shadow-md hover:scale-105 active:scale-95"
                aria-label={`View ${notice.notice.title}`}
              >
                <HiOutlineEye className="text-base group-hover/btn:scale-110 transition-transform" />
                <span className="hidden xs:inline">View</span>
              </button>
            </Link>

            {/* Delete Button */}
            <NoticeDeleteButton notice={notice} />

          </div>
        </div>
      </div>




    </>
  );
};

export default NoticeAction;