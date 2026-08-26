
import React from "react";
import { Card } from "@heroui/react";
import {
  FaUsers,
  FaChalkboardTeacher,
  FaSchool,
  FaBookOpen,
  FaShieldAlt,
  FaTrophy,
} from "react-icons/fa";

const statsData = [
  {
    id: "students",
    value: "500+",
    label: "Total Students",
    icon: <FaUsers className="h-6 w-6" />,
    iconBg: "bg-blue-100",
    iconColor: "text-blue-600",
    valueColor: "text-blue-600",
  },
  {
    id: "teachers",
    value: "50+",
    label: "Teachers",
    icon: <FaChalkboardTeacher className="h-6 w-6" />,
    iconBg: "bg-emerald-100",
    iconColor: "text-emerald-600",
    valueColor: "text-emerald-600",
  },
  {
    id: "classes",
    value: "25+",
    label: "Classes",
    icon: <FaSchool className="h-6 w-6" />,
    iconBg: "bg-amber-100",
    iconColor: "text-amber-600",
    valueColor: "text-amber-600",
  },
  {
    id: "subjects",
    value: "15+",
    label: "Subjects",
    icon: <FaBookOpen className="h-6 w-6" />,
    iconBg: "bg-purple-100",
    iconColor: "text-purple-600",
    valueColor: "text-purple-600",
  },
  {
    id: "attendance",
    value: "98%",
    label: "Attendance Rate",
    icon: <FaShieldAlt className="h-6 w-6" />,
    iconBg: "bg-teal-100",
    iconColor: "text-teal-600",
    valueColor: "text-teal-600",
  },
  {
    id: "exams",
    value: "100+",
    label: "Exams Conducted",
    icon: <FaTrophy className="h-6 w-6" />,
    iconBg: "bg-pink-100",
    iconColor: "text-pink-600",
    valueColor: "text-pink-600",
  },
];

export function StatisticsSection() {
  return (
    <section className="bg-white py-16 md:py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-center text-center mb-12">
          <h2 className="text-3xl font-extrabold tracking-tight text-[#03204c] sm:text-4xl">
            Statistics
          </h2>
          <div className="mt-3 h-1.5 w-12 rounded-full bg-blue-600" />
        </div>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {statsData.map((stat) => (
            <Card
              key={stat.id}
              className="border border-slate-200/80 bg-white shadow-xs hover:shadow-md transition-all duration-300 rounded-2xl"
            >
              <div className="flex flex-col items-center justify-center p-6 text-center">
                <div
                  className={`flex h-12 w-12 items-center justify-center rounded-2xl mb-4 ${stat.iconBg} ${stat.iconColor}`}
                >
                  {stat.icon}
                </div>
                <span className={`text-3xl font-extrabold tracking-tight ${stat.valueColor}`}>
                  {stat.value}
                </span>
                <span className="mt-1 text-xs font-semibold text-slate-600">
                  {stat.label}
                </span>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

