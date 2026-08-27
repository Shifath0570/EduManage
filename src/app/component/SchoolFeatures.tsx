import {
  FiUsers,
  FiMonitor,
  FiBarChart2,
} from "react-icons/fi";
import { HiOutlineUserGroup } from "react-icons/hi";

interface Feature {
  number: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  iconColor: string;
  iconBg: string;
}

const features: Feature[] = [
  {
    number: "01",
    title: "Student First",
    description:
      "Manage student information, admissions, attendance, and academic records with ease.",
    icon: <HiOutlineUserGroup />,
    iconColor: "text-blue-500",
    iconBg: "bg-blue-50 border-blue-100",
  },
  {
    number: "02",
    title: "Empower Teachers",
    description:
      "Give teachers the tools they need to manage classes, lessons, and academic activities.",
    icon: <FiMonitor />,
    iconColor: "text-emerald-500",
    iconBg: "bg-emerald-50 border-emerald-100",
  },
  {
    number: "03",
    title: "Connect Parents",
    description:
      "Keep parents informed through notices, updates, results, and smooth communication.",
    icon: <FiUsers />,
    iconColor: "text-violet-500",
    iconBg: "bg-violet-50 border-violet-100",
  },
  {
    number: "04",
    title: "Data Driven",
    description:
      "Turn school data into useful reports and actionable insights for better decisions.",
    icon: <FiBarChart2 />,
    iconColor: "text-orange-500",
    iconBg: "bg-orange-50 border-orange-100",
  },
];

export default function SchoolFeatures() {
  return (
    <section className="w-full bg-white px-4 py-14 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Section Heading */}
        <div className="mb-8 text-center">
          <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.08em] text-blue-600">
            What is EduManage?
          </p>

          <h2 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            Everything Your School Needs, In One Place
          </h2>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => (
            <div
              key={feature.number}
              className="group relative min-h-[155px] overflow-hidden rounded-xl border border-slate-200 bg-white p-4 shadow-[0_2px_8px_rgba(15,23,42,0.03)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_8px_25px_rgba(15,23,42,0.08)]"
            >
              {/* Icon */}
              <div
                className={`mb-3 flex h-9 w-9 items-center justify-center rounded-lg border ${feature.iconBg} ${feature.iconColor} text-lg`}
              >
                {feature.icon}
              </div>

              {/* Title */}
              <h3 className="mb-2 text-sm font-bold text-slate-800">
                {feature.title}
              </h3>

              {/* Description */}
              <p className="max-w-[205px] text-[12px] leading-[1.55] text-slate-600">
                {feature.description}
              </p>

              {/* Large Number */}
              <span
                className="absolute -bottom-1 right-2 select-none text-3xl font-bold leading-none text-slate-100"
                aria-hidden="true"
              >
                {feature.number}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}