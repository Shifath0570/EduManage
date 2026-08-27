"use client";

import Link from "next/link";
import {
  FiArrowRight,
  FiBarChart2,
  FiBookOpen,
  FiLayers,
  FiSmile,
  FiZap,
} from "react-icons/fi";

interface Feature {
  title: string;
  description: string;
  icon: React.ReactNode;
}

const features: Feature[] = [
  {
    title: "One Platform",
    description:
      "Everything from student records to results and communication in one system.",
    icon: <FiLayers />,
  },
  {
    title: "Easy to Use",
    description:
      "Designed for administrators, teachers, students, and parents—not just technical users.",
    icon: <FiSmile />,
  },
  {
    title: "Real-Time Insights",
    description:
      "Get a clearer picture of attendance, academic performance, and school activities.",
    icon: <FiBarChart2 />,
  },
  {
    title: "Built for Modern Education",
    description:
      "A digital-first approach that helps schools adapt to changing educational needs.",
    icon: <FiZap />,
  },
];

export default function WhyChooseEduManage() {
  return (
    <section className="relative overflow-hidden bg-white py-16 sm:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">

        {/* =========================
            SECTION HEADER
        ========================== */}
        <div className="mx-auto mb-9 max-w-3xl text-center">
          <span className="mb-2 inline-block text-[11px] font-bold uppercase tracking-[0.12em] text-blue-600">
            Why Schools Choose EduManage
          </span>

          <h2 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl lg:text-[34px]">
            A Smarter Way to Manage Your School
          </h2>
        </div>

        {/* =========================
            FEATURES
        ========================== */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => (
            <article
              key={feature.title}
              className="
                group
                relative
                overflow-hidden
                rounded-xl
                border border-slate-200
                bg-white
                p-5
                transition-all
                duration-300
                hover:-translate-y-1
                hover:border-blue-200
                hover:shadow-[0_12px_35px_rgba(15,23,42,0.08)]
              "
            >
              {/* Subtle hover glow */}
              <div
                className="
                  pointer-events-none
                  absolute
                  -right-10
                  -top-10
                  h-24
                  w-24
                  rounded-full
                  bg-blue-50
                  opacity-0
                  blur-2xl
                  transition-opacity
                  duration-300
                  group-hover:opacity-100
                "
              />

              <div className="relative flex gap-4">
                {/* Icon */}
                <div
                  className="
                    flex
                    h-11
                    w-11
                    shrink-0
                    items-center
                    justify-center
                    rounded-xl
                    border
                    border-blue-100
                    bg-blue-50
                    text-xl
                    text-blue-600
                    transition-all
                    duration-300
                    group-hover:scale-105
                    group-hover:bg-blue-600
                    group-hover:text-white
                  "
                >
                  {feature.icon}
                </div>

                {/* Content */}
                <div>
                  <h3 className="mb-1.5 text-sm font-bold text-slate-900">
                    {feature.title}
                  </h3>

                  <p className="text-[12px] leading-[1.55] text-slate-600">
                    {feature.description}
                  </p>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* =========================
            CTA
        ========================== */}
        <div
          className="
            relative
            mt-5
            overflow-hidden
            rounded-2xl
            bg-gradient-to-r
            from-blue-800
            via-blue-700
            to-indigo-700
            px-6
            py-6
            shadow-[0_12px_35px_rgba(37,99,235,0.18)]
            sm:px-10
            sm:py-7
          "
        >
          {/* Background decoration */}
          <div
            className="
              pointer-events-none
              absolute
              -right-16
              -top-20
              h-48
              w-48
              rounded-full
              bg-white/10
              blur-2xl
            "
          />

          <div
            className="
              pointer-events-none
              absolute
              -bottom-20
              left-1/3
              h-40
              w-40
              rounded-full
              bg-cyan-400/10
              blur-3xl
            "
          />

          <div
            className="
              relative
              flex
              flex-col
              gap-6
              lg:flex-row
              lg:items-center
              lg:justify-between
            "
          >
            {/* CTA Content */}
            <div className="flex items-center gap-5">
              {/* Education Icon */}
              <div
                className="
                  hidden
                  h-20
                  w-20
                  shrink-0
                  items-center
                  justify-center
                  rounded-2xl
                  bg-white/10
                  text-5xl
                  text-white
                  sm:flex
                "
              >
                <FiBookOpen />
              </div>

              <div>
                <h3 className="text-xl font-bold text-white sm:text-2xl">
                  Ready to Transform Your School?
                </h3>

                <p className="mt-2 max-w-xl text-sm leading-6 text-blue-100">
                  Join schools that are making education management
                  simpler, smarter, and more connected with EduManage.
                </p>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex shrink-0 flex-col gap-3 sm:flex-row">
              <Link
                href="/get-started"
                className="
                  inline-flex
                  h-11
                  items-center
                  justify-center
                  gap-2
                  rounded-lg
                  bg-white
                  px-6
                  text-sm
                  font-semibold
                  text-blue-700
                  shadow-sm
                  transition-all
                  duration-200
                  hover:-translate-y-0.5
                  hover:bg-blue-50
                  hover:shadow-lg
                "
              >
                Get Started
                <FiArrowRight className="text-base" />
              </Link>

              <Link
                href="/contact"
                className="
                  inline-flex
                  h-11
                  items-center
                  justify-center
                  rounded-lg
                  border
                  border-white/70
                  px-6
                  text-sm
                  font-semibold
                  text-white
                  transition-all
                  duration-200
                  hover:bg-white
                  hover:text-blue-700
                "
              >
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}