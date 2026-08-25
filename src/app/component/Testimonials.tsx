
import React from "react";
import Image from "next/image";
import { FaQuoteLeft, FaStar } from "react-icons/fa";

const testimonials = [
  {
    name: "Sadia Rahman",
    role: "Parent",
    image: "/images/sadia.png",
    review:
      "EduManage has made school management so much easier for our teachers and parents. Highly recommended!",
  },
  {
    name: "Md. Hasan",
    role: "Teacher",
    image: "/images/hasan.png",
    review:
      "The platform is very user-friendly and helps us to manage everything in a systematic way.",
  },
  {
    name: "Rafiq Ahmed",
    role: "School Admin",
    image: "/images/rafiq.png",
    review:
      "Great support team and excellent features. It's the best school management system we have used.",
  },
];

export function Testimonials() {
  return (
    <section className="bg-gradient-to-b from-[#f8fbff] to-white py-16 md:py-20 border-b border-slate-100">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <div className="flex flex-col items-center justify-center text-center mb-12">
          <h2 className="text-3xl font-extrabold tracking-tight text-[#03204c] sm:text-4xl">
            Testimonials
          </h2>
          <div className="mt-3 h-1.5 w-12 rounded-full bg-blue-600" />
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="flex flex-col justify-between rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs transition-all duration-300 hover:shadow-md"
            >
              <div>
                {/* Quote Icon */}
                <FaQuoteLeft className="mb-3 text-lg text-blue-600" />

                {/* Review Text */}
                <p className="text-sm leading-relaxed text-slate-600">
                  {testimonial.review}
                </p>

                {/* Rating Stars */}
                <div className="mt-4 flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <FaStar key={i} className="text-xs text-[#f6a623]" />
                  ))}
                </div>
              </div>

              {/* User Profile Info */}
              <div className="mt-6 flex items-center gap-3 border-t border-slate-100 pt-4">
                <div className="relative h-10 w-10 overflow-hidden rounded-full bg-slate-100 border border-slate-200 shrink-0">
                  <Image
                    src={testimonial.image}
                    alt={testimonial.name}
                    fill
                    sizes="40px"
                    className="object-cover"
                  />
                </div>

                <div>
                  <h3 className="text-sm font-bold text-slate-800">
                    {testimonial.name}
                  </h3>
                  <p className="text-xs font-medium text-slate-500">
                    {testimonial.role}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}


