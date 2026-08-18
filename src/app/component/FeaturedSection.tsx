import React from "react";
import {
    UserRound,
    UsersRound,
    ClipboardCheck,
    FileText,
    MessageSquare,
    ChartNoAxesCombined,
} from "lucide-react";

interface Feature {
    title: string;
    description: string;
    icon: React.ElementType;
    iconColor: string;
    bgColor: string;
}

const FeaturedSection = () => {
    const features: Feature[] = [
        {
            title: "Student Management",
            description:
                "Manage student information, admissions, attendance, and academic records efficiently.",
            icon: UserRound,
            iconColor: "text-blue-600",
            bgColor: "bg-blue-50",
        },
        {
            title: "Teacher Management",
            description:
                "Manage teacher profiles, assign classes, subjects, and track performance seamlessly.",
            icon: UsersRound,
            iconColor: "text-green-600",
            bgColor: "bg-green-50",
        },
        {
            title: "Attendance System",
            description:
                "Take, manage, and analyze attendance with advanced reporting and insights.",
            icon: ClipboardCheck,
            iconColor: "text-blue-600",
            bgColor: "bg-blue-50",
        },
        {
            title: "Examination & Results",
            description:
                "Create exams, enter marks, generate results and performance reports instantly.",
            icon: FileText,
            iconColor: "text-blue-600",
            bgColor: "bg-blue-50",
        },
        {
            title: "Notice & Communication",
            description:
                "Publish notices, events, and important updates for students, teachers, and parents.",
            icon: MessageSquare,
            iconColor: "text-purple-600",
            bgColor: "bg-purple-50",
        },
        {
            title: "Reports & Analytics",
            description:
                "Get detailed reports and real-time analytics for better decision making.",
            icon: ChartNoAxesCombined,
            iconColor: "text-teal-600",
            bgColor: "bg-teal-50",
        },
    ];

    return (
        <section className="bg-[#f5f8ff] py-16 md:py-20">
            <div className="mx-auto max-w-7xl px-5 md:px-8">

                {/* Section Heading */}
                <div className="mb-10 text-center">
                    <h2 className="text-2xl font-bold text-slate-900 md:text-3xl">
                        Platform Features
                    </h2>

                    <div className="mx-auto mt-4 h-1 w-12 rounded-full bg-blue-600" />
                </div>

                {/* Feature Cards */}
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
                    {features.map((feature) => {
                        const Icon = feature.icon;

                        return (
                            <div
                                key={feature.title}
                                className="flex min-h-[290px] flex-col items-center rounded-xl border border-slate-100 bg-white px-5 py-6 text-center shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md"
                            >
                                {/* Icon */}
                                <div
                                    className={`flex h-16 w-16 items-center justify-center rounded-full ${feature.bgColor}`}
                                >
                                    <Icon
                                        className={`h-8 w-8 ${feature.iconColor}`}
                                        strokeWidth={1.8}
                                    />
                                </div>

                                {/* Title */}
                                <h3 className="mt-6 text-base font-bold leading-6 text-slate-800">
                                    {feature.title}
                                </h3>

                                {/* Description */}
                                <p className="mt-4 text-sm leading-6 text-slate-500">
                                    {feature.description}
                                </p>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
};

export default FeaturedSection;
