"use client";

import {
  FiUsers,
  FiShare2,
  FiTrendingUp,
} from "react-icons/fi";

const features = [
  {
    title: "Simplify",
    description:
      "Reduce repetitive administrative work with smart digital tools.",
    icon: FiUsers,
    iconBg: "bg-blue-50",
    iconColor: "text-blue-500",
  },
  {
    title: "Connect",
    description:
      "Bring students, teachers, parents, and administrators together.",
    icon: FiShare2,
    iconBg: "bg-emerald-50",
    iconColor: "text-emerald-500",
  },
  {
    title: "Grow",
    description:
      "Use meaningful data and insights to support better outcomes.",
    icon: FiTrendingUp,
    iconBg: "bg-purple-50",
    iconColor: "text-purple-500",
  },
];

export default function MissionSection() {
  return (
    <section className="w-full bg-white px-5 py-8 md:px-10 lg:px-16">
      <div className="mx-auto flex max-w-[1100px] flex-col items-center gap-8 lg:flex-row lg:gap-10">

        {/* Image */}
        <div className="w-full shrink-0 lg:w-[43%]">
          <div className="aspect-[1.3/1] overflow-hidden rounded-xl">
            <img
              src="/images/school-campus-left.jpg"
              alt="School campus"
              className="h-full w-full object-cover"
            />
          </div>
        </div>

        {/* Content */}
        <div className="w-full lg:flex-1">

          <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.08em] text-blue-500">
            Our Mission
          </p>

          <h2 className="text-2xl font-bold leading-[1.15] tracking-tight text-[#102653] md:text-[27px]">
            Making Education Management
            <br />
            Simple, Connected & Effective
          </h2>

          <p className="mt-3 max-w-[530px] text-[13px] leading-[1.55] text-slate-600">
            We believe technology should make education simpler, more
            connected, and more accessible. EduManage brings essential school
            management activities into one intelligent platform, helping
            institutions spend less time managing paperwork and more time
            focusing on students.
          </p>

          {/* Cards */}
          <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
            {features.map((feature) => {
              const Icon = feature.icon;

              return (
                <div
                  key={feature.title}
                  className="rounded-lg border border-slate-200 bg-white p-3"
                >
                  <div className="flex items-start gap-3">

                    {/* React Icon */}
                    <div
                      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${feature.iconBg}`}
                    >
                      <Icon
                        className={`text-[18px] ${feature.iconColor}`}
                      />
                    </div>

                    <div>
                      <h3 className="text-[12px] font-bold text-[#102653]">
                        {feature.title}
                      </h3>

                      <p className="mt-1 text-[10px] leading-[1.45] text-slate-600">
                        {feature.description}
                      </p>
                    </div>

                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </div>
    </section>
  );
}