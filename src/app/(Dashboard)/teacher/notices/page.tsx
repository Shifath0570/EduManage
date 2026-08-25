// app/page.tsx
// import NoticeAction from '@/app/component/NoticeAction';
// import { getNotices } from '@/app/lib/data';
// import { NoticeData } from '@/types/types';
// import Link from 'next/link';
// import { HiSpeakerphone } from 'react-icons/hi';


// export default async function HomePage() {
//   const notices: NoticeData[] = await getNotices();

//   return (
//     <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 bg-white rounded-2xl shadow-xl border border-gray-100">

//       {/* Section Heading */}
//       <div className="mb-10 text-center">
//         <h2 className="text-2xl font-bold text-slate-900 md:text-3xl">
//           Notices
//         </h2>

//         <div className="mx-auto mt-4 h-1 w-12 rounded-full bg-blue-600" />
//       </div>


//       {notices.length > 0 ? (
//         <ul className="divide-y divide-gray-100">
//           {notices && notices.map((notice: NoticeData, index: number) => (
//             <li key={notice._id}>
//                 <NoticeAction notice={notice} />
//             </li>
//           ))}
//         </ul>
//       ) : (
//         <div className="flex flex-col items-center justify-center py-16 sm:py-24">
//           <div className="bg-gray-50 rounded-full p-6 mb-4">
//             <HiSpeakerphone className="text-4xl text-gray-300" />
//           </div>
//           <p className="text-gray-400 text-lg font-medium">No notices available</p>
//           <p className="text-gray-300 text-sm mt-1">Check back later for updates</p>
//         </div>
//       )}
//     </div>
//   );
// }

import NoticeAction from '@/app/component/NoticeAction';
import { getNotices } from '@/app/lib/data';
import { NoticeItem } from '@/types/types';
import { HiSpeakerphone } from 'react-icons/hi';

// Force dynamic server rendering to prevent static build failures when backend is offline
export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const notices: NoticeItem[] = await getNotices();

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 bg-white rounded-2xl shadow-xl border border-gray-100">
      {/* Section Heading */}
      <div className="mb-10 text-center">
        <h2 className="text-2xl font-bold text-slate-900 md:text-3xl">
          Notices
        </h2>
        <div className="mx-auto mt-4 h-1 w-12 rounded-full bg-blue-600" />
      </div>

      {notices.length > 0 ? (
        <ul className="divide-y divide-gray-100">
          {notices.map((notice: NoticeItem) => (
            <li key={notice._id}>
              <NoticeAction notice={notice} />
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




