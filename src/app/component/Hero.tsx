import Image from "next/image";
import Link from "next/link";

const Hero = () => {
    return (
        <div className="bg-[url('/images/Schools.png')] bg-cover bg-center bg-no-repeat">
            {/* Overlay */}
            <div className="bg-[#0B386C]/80">
                <div className="container mx-auto flex flex-col justify-center bg-none lg:bg-[url('/images/Students.png')] bg-[length:800px_auto] bg-no-repeat bg-right-bottom min-h-[600px]">
                    {/* Text */}
                    <div className="max-w-[700px]">
                        <h1 className="font-bold text-5xl text-white py-4">Empowering Education Through Smart Management</h1>
                        <p className="text-white text-xl py-4 max-w-[600px]">EduManage is a complet school management platform that simplifies administration, enhances learing, and connects students, teachers, and parents in one place</p>

                    </div>
                    {/* Links */}
                    <div className="flex gap-4 items-center">
                        <Link href="#" className="px-5 py-3 text-white font-bold bg-blue-500 hover:bg-blue-600 transition rounded-md">Get Started</Link>
                        <Link href="#" className="px-5 py-3 text-white font-bold bg-none hover:bg-white hover:text-gray-800 transition border border-2 rounded-md">Explore Features</Link>
                    </div>
                    {/* Reviews */}
                    <div className="flex items-center py-6 gap-4">
                        <Image src="/images/Comments.png" height={10} width={200} alt="Reviews"/>
                        <p className="font-bold w-[200px] text-white">Tursted by 500+ Schools and 50,000 Users</p>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default Hero;