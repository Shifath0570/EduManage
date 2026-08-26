import Image from "next/image";
import Link from "next/link";
import { FiArrowRight } from "react-icons/fi";

export default function AboutHero() {
  return (
    <section className="relative overflow-hidden bg-[#eef5ff]">
      {/* Background decorations */}
      <div className="pointer-events-none absolute -left-24 top-20 h-72 w-72 rounded-full bg-blue-100/70 blur-3xl" />

      <div className="pointer-events-none absolute -right-32 bottom-0 h-96 w-96 rounded-full bg-indigo-100/60 blur-3xl" />

      <div className="relative mx-auto max-w-[1280px] px-5 sm:px-6 lg:px-8">
        <div className="grid min-h-[520px] items-center gap-10 py-12 lg:grid-cols-2 lg:py-16">
          
         
          <div className="relative z-10 max-w-[560px]">
            
            {/* Badge */}
            <div className="mb-5 inline-flex rounded-full bg-blue-100 px-4 py-1.5">
              <span className="text-[11px] font-bold uppercase tracking-wide text-blue-600">
                About EduManage
              </span>
            </div>

            {/* Heading */}
            <h1 className="text-[40px] font-extrabold leading-[1.12] tracking-[-1.5px] text-[#10254d] sm:text-[48px] lg:text-[50px]">
              Empowering Schools to
              <br />
              Build a Smarter Future
            </h1>

            {/* Description */}
            <p className="mt-6 max-w-[510px] text-[15px] leading-[1.7] text-slate-600 sm:text-[16px]">
              EduManage is a modern school management platform
              designed to simplify everyday administration and create
              a connected learning environment for students, teachers,
              parents, and school administrators.
            </p>

            {/* Buttons */}
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              
              <Link
                href="/features"
                className="group inline-flex h-[46px] items-center justify-center gap-2 rounded-lg bg-[#075be8] px-6 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:bg-[#004ed0]"
              >
                Explore Our Platform

                <FiArrowRight
                  size={17}
                  className="transition-transform group-hover:translate-x-1"
                />
              </Link>

              <Link
                href="/contact"
                className="inline-flex h-[46px] items-center justify-center rounded-lg border-2 border-[#075be8] bg-white px-7 text-sm font-semibold text-[#075be8] transition hover:bg-blue-50"
              >
                Contact Us
              </Link>

            </div>
          </div>


          {/* =========================================
              RIGHT SIDE — DASHBOARD IMAGE
          ========================================= */}
          <div className="relative flex items-center justify-center lg:justify-end">
            
            {/* Glow */}
            <div className="absolute h-[80%] w-[80%] rounded-full bg-blue-200/40 blur-3xl" />

            {/* Dashboard */}
            <div className="relative w-full max-w-[600px]">
              <Image
                src="/images/edumanage-dashboard.png"
                alt="EduManage school management dashboard"
                width={600}
                height={356}
                priority
                className="h-auto w-full rounded-2xl object-contain shadow-[0_20px_60px_rgba(37,99,235,0.16)]"
              />
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}