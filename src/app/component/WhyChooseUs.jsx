import {
  FaGraduationCap,
  FaShieldAlt,
  FaUserTie,
  FaHeart,
  FaChalkboardTeacher,
} from "react-icons/fa";

const features = [
  {
    icon: FaGraduationCap,
    title: "Quality Education",
    description:
      "We provide quality education with modern teaching methods.",
  },
  {
    icon: FaShieldAlt,
    title: "Safe Environment",
    description:
      "We ensure a safe and supportive environment for all students.",
  },
  {
    icon: FaUserTie,
    title: "Experienced Teachers",
    description:
      "Our teachers are highly qualified and experienced in their fields.",
  },
  {
    icon: FaHeart,
    title: "Holistic Development",
    description:
      "We focus on academic, physical, and moral development.",
  },
  {
    icon: FaChalkboardTeacher,
    title: "Parental Involvement",
    description:
      "We believe in strong communication and partnership with parents.",
  },
];

export default function WhyChooseUs() {
  return (
    <section className="bg-[#f7faff] py-10 sm:py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* Heading */}
        <div className="mb-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#03204c]">
            Why Choose Us
          </h2>

         <div className="mx-auto mt-2 h-[8px] w-12 rounded-full bg-blue-500" />
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-5 lg:gap-5">
          {features.map((feature, index) => {
            const Icon = feature.icon;

            return (
              <div
                key={index}
                className="flex flex-col items-center text-center"
              >
                {/* Icon */}
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-50">
                  <Icon className="text-[25px] text-blue-500" />
                </div>

                {/* Title */}
                <h3 className="text-[15px] font-bold text-gray-900">
                  {feature.title}
                </h3>

                {/* Description */}
                <p className="mt-2 max-w-[190px] text-[12px] leading-5 text-gray-600">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}