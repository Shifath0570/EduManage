"use client";

import React, { useState } from "react";
import { 
  FaMapMarkerAlt, 
  FaPhoneAlt, 
  FaEnvelope, 
  FaClock, 
  FaPaperPlane, 
  FaCheckCircle, 
  FaHeadset,
  FaSchool
} from "react-icons/fa";

export default function ContactSection() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    role: "school_admin",
    subject: "",
    message: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate submission
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
      setFormData({
        name: "",
        email: "",
        phone: "",
        role: "school_admin",
        subject: "",
        message: "",
      });
    }, 1000);
  };

  const contactCards = [
    {
      icon: <FaMapMarkerAlt className="h-6 w-6" />,
      title: "Our Campus",
      primary: "123 Education Street",
      secondary: "Knowledge City, 1000",
      badge: "Main Office",
      bg: "bg-blue-50 text-blue-600",
    },
    {
      icon: <FaPhoneAlt className="h-5 w-5" />,
      title: "Phone Number",
      primary: "+880 1234-567890",
      secondary: "+880 1987-654321",
      badge: "Toll Free",
      bg: "bg-emerald-50 text-emerald-600",
    },
    {
      icon: <FaEnvelope className="h-5 w-5" />,
      title: "Email Inquiries",
      primary: "info@edumanage.com",
      secondary: "support@edumanage.com",
      badge: "24/7 Response",
      bg: "bg-purple-50 text-purple-600",
    },
    {
      icon: <FaClock className="h-5 w-5" />,
      title: "Office Hours",
      primary: "Mon - Fri: 8:00 AM - 6:00 PM",
      secondary: "Saturday: 9:00 AM - 1:00 PM",
      badge: "Open Now",
      bg: "bg-amber-50 text-amber-600",
    },
  ];

  return (
    <section id="contact" className="w-full bg-slate-50/70 py-16 sm:py-20 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="mx-auto max-w-2xl text-center mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-100/80 text-blue-700 text-xs font-bold uppercase tracking-wider mb-4">
            <FaHeadset className="h-3.5 w-3.5" />
            <span>Get in Touch</span>
          </div>
          <h2 className="text-3xl font-extrabold tracking-tight text-[#03204c] sm:text-4xl lg:text-5xl">
            We’re Here to Help Your School Grow
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-600 leading-relaxed">
            Have questions about our platform or want to see a live demonstration? Reach out to our dedicated team today.
          </p>
          <div className="mx-auto mt-4 h-1.5 w-16 rounded-full bg-blue-600" />
        </div>

        {/* 4 Info Cards */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-14">
          {contactCards.map((card, idx) => (
            <div
              key={idx}
              className="group relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:border-blue-300"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${card.bg}`}>
                  {card.icon}
                </div>
                <span className="text-[11px] font-semibold text-slate-400 bg-slate-100 px-2.5 py-1 rounded-full">
                  {card.badge}
                </span>
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-1">
                {card.title}
              </h3>
              <p className="text-sm font-semibold text-blue-900/80">
                {card.primary}
              </p>
              <p className="text-xs text-slate-500 mt-0.5">
                {card.secondary}
              </p>
            </div>
          ))}
        </div>

        {/* Main Grid: Form (Left) & Info / Benefits (Right) */}
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12">
          
          {/* Contact Form: 7 Columns */}
          <div className="lg:col-span-7 rounded-3xl border border-slate-200/90 bg-white p-7 sm:p-10 shadow-lg shadow-slate-200/50">
            <div className="mb-8">
              <h3 className="text-2xl font-bold text-[#03204c]">
                Send Us a Message
              </h3>
              <p className="text-sm text-slate-500 mt-1">
                Fill out the form below and we will get back to you within 24 hours.
              </p>
            </div>

            {submitted && (
              <div className="mb-6 flex items-center gap-3 rounded-2xl bg-emerald-50 border border-emerald-200 p-4 text-emerald-800 animate-fadeIn">
                <FaCheckCircle className="h-6 w-6 text-emerald-600 shrink-0" />
                <div className="text-sm">
                  <p className="font-bold">Thank you for reaching out!</p>
                  <p className="text-emerald-700">Your message has been received. Our team will contact you shortly.</p>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Row 1: Name & Email */}
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. John Doe"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full rounded-xl border border-slate-300 bg-slate-50/50 px-4 py-3 text-sm text-slate-800 placeholder-slate-400 focus:border-blue-600 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-100 transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="john@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full rounded-xl border border-slate-300 bg-slate-50/50 px-4 py-3 text-sm text-slate-800 placeholder-slate-400 focus:border-blue-600 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-100 transition"
                  />
                </div>
              </div>

              {/* Row 2: Phone & Role */}
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    placeholder="+880 1234-567890"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full rounded-xl border border-slate-300 bg-slate-50/50 px-4 py-3 text-sm text-slate-800 placeholder-slate-400 focus:border-blue-600 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-100 transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    I am a...
                  </label>
                  <select
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    className="w-full rounded-xl border border-slate-300 bg-slate-50/50 px-4 py-3 text-sm text-slate-800 focus:border-blue-600 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-100 transition cursor-pointer"
                  >
                    <option value="school_admin">School Administrator / Principal</option>
                    <option value="teacher">Teacher / Faculty</option>
                    <option value="student">Student</option>
                    <option value="parent">Parent</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>

              {/* Row 3: Subject */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Subject <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Schedule a Platform Demo for our School"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  className="w-full rounded-xl border border-slate-300 bg-slate-50/50 px-4 py-3 text-sm text-slate-800 placeholder-slate-400 focus:border-blue-600 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-100 transition"
                />
              </div>

              {/* Row 4: Message */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Message <span className="text-red-500">*</span>
                </label>
                <textarea
                  required
                  rows={4}
                  placeholder="Tell us about your institution, requirements, or any questions you have..."
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full rounded-xl border border-slate-300 bg-slate-50/50 px-4 py-3 text-sm text-slate-800 placeholder-slate-400 focus:border-blue-600 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-100 transition resize-y"
                />
              </div>

              {/* Submit Button */}
              <div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-3 rounded-xl bg-blue-600 hover:bg-blue-700 px-8 py-3.5 text-base font-bold text-white shadow-md shadow-blue-500/20 transition-all duration-200 hover:shadow-lg hover:shadow-blue-500/30 active:scale-95 disabled:opacity-70 cursor-pointer"
                >
                  <FaPaperPlane className={`h-4 w-4 ${isSubmitting ? "animate-pulse" : ""}`} />
                  <span>{isSubmitting ? "Sending..." : "Send Message"}</span>
                </button>
              </div>
            </form>
          </div>

          {/* Right Column: 5 Columns (Why Choose Us & Quick Support) */}
          <div className="lg:col-span-5 flex flex-col justify-between gap-6">
            
            {/* Quick Demo CTA Card */}
            <div className="rounded-3xl bg-[#03204c] p-8 text-white shadow-xl relative overflow-hidden">
              <div className="absolute -right-8 -bottom-8 text-blue-800/30 pointer-events-none">
                <FaSchool className="h-44 w-44" />
              </div>
              <div className="relative z-10">
                <span className="inline-block px-3 py-1 rounded-full bg-blue-500/30 text-blue-300 text-xs font-semibold mb-4">
                  Fast Onboarding
                </span>
                <h4 className="text-2xl font-bold leading-snug">
                  Want an interactive walkthrough for your institution?
                </h4>
                <p className="mt-3 text-sm text-blue-100/80 leading-relaxed">
                  Our product specialists can demonstrate live attendance tracking, fee management, student records, and exam portals tailored to your school.
                </p>
                <div className="mt-6 flex items-center gap-4">
                  <div className="flex -space-x-2">
                    <div className="h-9 w-9 rounded-full bg-blue-400 border-2 border-[#03204c] flex items-center justify-center text-xs font-bold text-slate-900">
                      SR
                    </div>
                    <div className="h-9 w-9 rounded-full bg-emerald-400 border-2 border-[#03204c] flex items-center justify-center text-xs font-bold text-slate-900">
                      MH
                    </div>
                    <div className="h-9 w-9 rounded-full bg-purple-400 border-2 border-[#03204c] flex items-center justify-center text-xs font-bold text-slate-900">
                      RA
                    </div>
                  </div>
                  <span className="text-xs text-blue-200">
                    Dedicated support engineers ready to assist.
                  </span>
                </div>
              </div>
            </div>

            {/* Direct Support Promise Card */}
            <div className="rounded-3xl border border-slate-200/80 bg-white p-7 shadow-sm">
              <h4 className="text-base font-bold text-slate-900 mb-4 flex items-center gap-2">
                <FaCheckCircle className="h-5 w-5 text-emerald-500" />
                Our Commitment to You
              </h4>
              <ul className="space-y-3 text-sm text-slate-600">
                <li className="flex items-start gap-2.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-blue-600 mt-2 shrink-0" />
                  <span><strong>100% Free Consultation</strong> — No strings attached demo session.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-blue-600 mt-2 shrink-0" />
                  <span><strong>Data Privacy First</strong> — Encrypted database and enterprise security.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-blue-600 mt-2 shrink-0" />
                  <span><strong>Full Staff Training</strong> — Complimentary onboarding support for teachers and staff.</span>
                </li>
              </ul>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
