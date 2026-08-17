import Link from "next/link";
import { HiSpeakerphone } from "react-icons/hi";
import { ReactNode } from "react";
import Image from "next/image";

// Define the type for a notice item
interface NoticeItem {
    id: number;
    icons: ReactNode;
    text: string;
    date: string;
}

const notice: NoticeItem[] = [
    {
        id: 1,
        icons: <HiSpeakerphone />,
        text: "Annual Sports Day will be held on 20th May, 2025",
        date: "May 12, 2025"
    },
    {
        id: 2,
        icons: <HiSpeakerphone />,
        text: "Mid Term Examination from 1st June 2025",
        date: "May 10, 2025"
    },
    {
        id: 3,
        icons: <HiSpeakerphone />,
        text: "School will remain closed on 16 the may, 2025",
        date: "May 08, 2025"
    },
    {
        id: 4,
        icons: <HiSpeakerphone />,
        text: "Parents-Teacher meeting on 25th May, 2025.",
        date: "May 01, 2025"
    },
    {
        id: 5,
        icons: <HiSpeakerphone />,
        text: "New admission process for 2025 has started.",
        date: "May 12, 2025"
    },

];

const Notice: React.FC = () => {
    return (
        <div className="container mx-auto p-6">
            <div className="flex flex-col xl:flex-row  justify-between gap-10">
                {/* Notice */}
                <div className="flex-1 w-full rounded-md shadow-md">
                    <div className="flex justify-between items-center p-5 bg-[#F5F8FC]">
                        <h1 className="font-bold text-2xl">Notice Board</h1>
                        <Link href="#" className="text-blue-500 font-bold">View All</Link>
                    </div>

                    {/* notice map */}
                    {notice.map((item: NoticeItem) => (
                        <Link href="#" key={item.id}>
                            <div className="flex items-center justify-between  text-[#858FA1]  text-xl font-bold  last:border-b-0 border-t border-gray-100 py-6 px-2 ">
                                <div className="flex items-center gap-3 ">
                                    <span className="text-blue-500 text-3xl">{item.icons}</span>
                                    <p>{item.text}</p>
                                </div>
                                <div>{item.date}</div>
                            </div>
                        </Link>
                    ))}
                </div>


                {/* Last bolog */}
                <div className="flex-1 w-full bg-[#F5F8FC] rounded-md shadow-md px-4">
                    <div className="flex justify-between items-center py-5 bg-[#F5F8FC]">
                        <h1 className="font-bold text-2xl">Latest Blog</h1>
                        <Link href="#" className="text-blue-500 font-bold">View All</Link>
                    </div>

                    <div className="flex items-center flex-col lg:flex-row justify-between gap-5">


                        <div className="rounded-2xl flex-1 w-full bg-white overflow-hidden text-gray-500">
                            <Image src="/images/Blog1.jpg" height={2000} width={300} alt="Students" className="h-auto w-full" />
                            <div className="p-4">
                                <h1 className="text-xl font-bold text-black">10 Effective Study Tips for Students</h1>
                                <p className="line-clamp-3 py-2">Discover practical study tips that help students improve focus and academic</p>
                                <p className="py-2">May 10, 2025</p>
                                <Link href="#" className="text-blue-500 hover:text-blue-600 transition">Read More →</Link>
                            </div>
                        </div>
                        <div className="rounded-2xl flex-1 w-full bg-white overflow-hidden text-gray-500">
                            <Image src="/images/Blog2.jpg" height={2000} width={300} alt="Students" className="h-auto w-full" />
                            <div className="p-4">
                                <h1 className="text-xl font-bold text-black">10 Effective Study Tips for Students</h1>
                                <p className="line-clamp-3 py-2">Discover practical study tips that help students improve focus and academic</p>
                                <p className="py-2">May 10, 2025</p>
                                <Link href="#" className="text-blue-500 hover:text-blue-600 transition">Read More →</Link>
                            </div>
                        </div>
                        <div className="rounded-2xl flex-1 w-full bg-white overflow-hidden text-gray-500">
                            <Image src="/images/Blog3.jpg" height={2000} width={300} alt="Students" className="h-auto w-full" />
                            <div className="p-4">
                                <h1 className="text-xl font-bold text-black">10 Effective Study Tips for Students</h1>
                                <p className="line-clamp-3 py-2">Discover practical study tips that help students improve focus and academic</p>
                                <p className="py-2">May 10, 2025</p>
                                <Link href="#" className="text-blue-500 hover:text-blue-600 transition">Read More →</Link>
                            </div>
                        </div>



















                    </div>

                </div>



            </div>
        </div>
    );
};

export default Notice;