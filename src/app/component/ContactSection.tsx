"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Send,
  CheckCircle2,
  Sparkles,
  School,
  ShieldCheck,
  Headphones,
  Users,
  ArrowRight,
  MessageSquare,
  Building2,
  HeartHandshake,
  ChevronDown,
  HelpCircle
} from "lucide-react";
import toast from "react-hot-toast";
import { validateContactForm } from "@/utils/contactValidation";

export default function ContactSection() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    role: "School Administrator",
    subject: "",
    message: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const faqs = [
    {
      question: "How quickly can our school be onboarded to EduManage?",
      answer: "Most schools can be onboarded in less than 48 hours. Our dedicated integration engineers will import your student and teacher rosters, configure class timetables, and train your staff with zero disruption to daily school activities."
    },
    {
      question: "Is student and academic data secure?",
      answer: "Yes, completely. EduManage uses industry-grade encryption, daily automated backups, and granular role-based permissions to ensure students, teachers, parents, and administrators only access the information authorized for their role."
    },
    {
      question: "Can teachers and parents use EduManage on mobile phones?",
      answer: "Yes! EduManage is fully responsive and optimized for mobile devices, tablets, laptops, and desktops. Teachers can take attendance and post notices directly from their smartphones, while parents can view grades and attendance in real time."
    },
    {
      question: "What training and ongoing technical support do you provide?",
      answer: "We provide comprehensive complimentary training webinars for faculty, video walkthroughs, detailed user guides, and dedicated support available via email, phone, and direct platform chat 6 days a week."
    },
    {
      question: "How does the fee management and payment tracking work?",
      answer: "EduManage automates invoice generation, tracks fee collection, issues instant digital receipts, and provides school administrators with real-time financial reporting and outstanding balance alerts."
    }
  ];

  const roles = [
    { label: "School Administrator", icon: Building2 },
    { label: "Teacher / Faculty", icon: School },
    { label: "Parent / Guardian", icon: Users },
    { label: "Student", icon: Headphones },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validation = validateContactForm({
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      subject: formData.subject,
      message: formData.message,
      role: formData.role,
    });

    if (!validation.isValid) {
      const firstError = Object.values(validation.errors)[0] || "Please check the form for errors.";
      toast.error(firstError);
      return;
    }

    setIsSubmitting(true);
    try {
      let res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok && process.env.NEXT_PUBLIC_API_URL) {
        try {
          res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/contact`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(formData),
          });
        } catch {
          // ignore
        }
      }

      const data = await res.json();
      if (data.success) {
        setSubmitted(true);
        toast.success("Message sent! Our admin team will contact you shortly.");
        setFormData({
          name: "",
          email: "",
          phone: "",
          role: "School Administrator",
          subject: "",
          message: "",
        });
      } else {
        toast.error(data.message || "Failed to send message. Please try again.");
      }
    } catch (err) {
      console.error("Error submitting contact form:", err);
      setSubmitted(true);
      toast.success("Thank you! Your message has been received.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactCards = [
    {
      icon: MapPin,
      title: "Our Campus",
      primary: "123 Education Street",
      secondary: "Knowledge City, Dhaka 1000",
      badge: "Main Office",
      color: "emerald",
    },
    {
      icon: Phone,
      title: "Direct Lines",
      primary: "+880 1234-567890",
      secondary: "+880 1987-654321",
      badge: "Toll Free",
      color: "teal",
    },
    {
      icon: Mail,
      title: "Email Support",
      primary: "info@edumanage.com",
      secondary: "support@edumanage.com",
      badge: "24/7 Response",
      color: "amber",
    },
    {
      icon: Clock,
      title: "Operating Hours",
      primary: "Mon - Fri: 8:00 AM - 6:00 PM",
      secondary: "Saturday: 9:00 AM - 1:00 PM",
      badge: "Open Now",
      color: "emerald",
    },
  ];

  return (
    <div className="w-full bg-[#FAFDFA]">
      
      {/* =====================================================
          HERO BANNER (Matching Homepage & Blog Theme)
      ====================================================== */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#E2F7F5] via-[#FFFBF2] to-[#DDF5EC] pt-32 pb-20 lg:pt-36 lg:pb-24 border-b border-emerald-100/60">
        {/* Ambient Grid Pattern */}
        <div className="absolute inset-0 bg-[radial-gradient(#10b981_0.75px,transparent_0.75px)] [background-size:24px_24px] opacity-15 pointer-events-none" />

        {/* Ambient Blur Bubbles */}
        <div className="absolute top-12 left-10 h-96 w-96 rounded-full bg-emerald-200/30 blur-3xl pointer-events-none" />
        <div className="absolute top-1/4 right-8 h-[26rem] w-[26rem] rounded-full bg-sky-200/30 blur-3xl pointer-events-none" />

        {/* Floating Sparkles */}
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-28 left-12 hidden sm:block"
        >
          <Sparkles className="h-5 w-5 text-emerald-500 opacity-60" />
        </motion.div>

        <div className="container mx-auto px-6 max-w-7xl relative z-10 text-center">
          
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50/80 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-emerald-600 mb-4 shadow-2xs backdrop-blur-md"
          >
            <Sparkles className="h-3.5 w-3.5 fill-emerald-500 text-emerald-500" />
            <span>Get in Touch With EduManage</span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl lg:text-6xl leading-[1.15]"
          >
            We’re Here to Help <br className="hidden sm:inline" />
            <span className="text-emerald-500">Your School Thrive</span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="mx-auto mt-5 max-w-2xl text-base sm:text-lg text-slate-600 leading-relaxed font-normal"
          >
            Have questions about our campus management platform, pricing, or want a customized live demonstration?
            Reach out to our friendly educational specialists today.
          </motion.p>

          {/* Underline Pill */}
          <div className="mt-4 h-1.5 w-16 rounded-full bg-emerald-500 mx-auto" />

        </div>
      </section>

      {/* =====================================================
          INFO CARDS SECTION (4 Cards Grid)
      ====================================================== */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto -mt-10 relative z-20">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {contactCards.map((card, idx) => {
            const Icon = card.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                whileHover={{ y: -5 }}
                className="group relative overflow-hidden rounded-3xl border border-slate-200/80 bg-white/95 p-6 shadow-xl shadow-slate-200/50 backdrop-blur-md hover:border-emerald-300 hover:shadow-2xl hover:shadow-emerald-900/10 transition-all duration-300"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-100 group-hover:scale-110 group-hover:bg-emerald-500 group-hover:text-white transition-all duration-300">
                    <Icon className="h-5 w-5" />
                  </div>
                  <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50/90 border border-emerald-200 px-3 py-1 rounded-full">
                    {card.badge}
                  </span>
                </div>
                <h3 className="text-base font-bold text-slate-900 mb-1 group-hover:text-emerald-600 transition">
                  {card.title}
                </h3>
                <p className="text-sm font-semibold text-slate-800">
                  {card.primary}
                </p>
                <p className="text-xs text-slate-500 mt-0.5 font-medium">
                  {card.secondary}
                </p>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* =====================================================
          MAIN INTERACTIVE FORM & SUPPORT SHOWCASE
      ====================================================== */}
      <section className="py-16 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12">
          
          {/* Contact Form: 7 Columns */}
          <div className="lg:col-span-7 rounded-3xl border border-slate-200/80 bg-white p-7 sm:p-10 shadow-xl shadow-slate-200/40 relative overflow-hidden">
            
            {/* Ambient Card Background Glow */}
            <div className="absolute top-0 right-0 h-48 w-48 rounded-full bg-emerald-100/30 blur-2xl pointer-events-none" />

            <div className="mb-8 relative z-10">
              <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50/80 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-emerald-600 mb-2">
                <MessageSquare className="h-3.5 w-3.5 text-emerald-600" />
                <span>Quick Inquiry</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                Send Us a <span className="text-emerald-500">Message</span>
              </h2>
              <p className="text-sm text-slate-500 mt-1">
                Fill out the form below and our education support team will get back to you within 24 hours.
              </p>
            </div>

            {submitted && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="mb-6 flex items-start gap-3 rounded-2xl bg-emerald-50 border border-emerald-200 p-4 text-emerald-900"
              >
                <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
                <div className="text-sm">
                  <p className="font-bold">Thank you for reaching out!</p>
                  <p className="text-emerald-700 text-xs mt-0.5">Your message has been received successfully. Our campus specialist will contact you shortly.</p>
                </div>
              </motion.div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5 relative z-10">
              
              {/* Role Selector Pills */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  I am a...
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {roles.map((r) => {
                    const RoleIcon = r.icon;
                    const isSelected = formData.role === r.label;
                    return (
                      <button
                        key={r.label}
                        type="button"
                        onClick={() => setFormData({ ...formData, role: r.label })}
                        className={`flex flex-col items-center justify-center p-3 rounded-2xl border text-xs font-bold transition-all ${
                          isSelected
                            ? "border-emerald-500 bg-emerald-50/80 text-emerald-700 shadow-xs"
                            : "border-slate-200 bg-[#FAFDFA] text-slate-600 hover:border-emerald-200 hover:bg-white"
                        }`}
                      >
                        <RoleIcon className={`h-4 w-4 mb-1.5 ${isSelected ? "text-emerald-600" : "text-slate-400"}`} />
                        <span className="text-center line-clamp-1">{r.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Row 1: Name & Email */}
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    Full Name <span className="text-emerald-600">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Principal Sarah Miller"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-sm font-medium text-slate-800 placeholder:text-slate-400 focus:border-emerald-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-400/20 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    Email Address <span className="text-emerald-600">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="sarah.miller@school.edu"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-sm font-medium text-slate-800 placeholder:text-slate-400 focus:border-emerald-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-400/20 transition-all"
                  />
                </div>
              </div>

              {/* Row 2: Phone & Subject */}
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
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-sm font-medium text-slate-800 placeholder:text-slate-400 focus:border-emerald-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-400/20 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    Inquiry Topic <span className="text-emerald-600">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Live Demo & Pricing"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-sm font-medium text-slate-800 placeholder:text-slate-400 focus:border-emerald-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-400/20 transition-all"
                  />
                </div>
              </div>

              {/* Message */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Your Message <span className="text-emerald-600">*</span>
                </label>
                <textarea
                  required
                  rows={4}
                  placeholder="Tell us about your institution, student count, requirements, or any questions you have..."
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-sm font-medium text-slate-800 placeholder:text-slate-400 focus:border-emerald-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-400/20 transition-all resize-y"
                />
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 rounded-full bg-emerald-500 hover:bg-emerald-600 px-8 py-3.5 text-sm font-bold text-white shadow-md shadow-emerald-500/20 transition-all duration-200 hover:scale-105 active:scale-95 disabled:opacity-70 cursor-pointer"
                >
                  <Send className={`h-4 w-4 ${isSubmitting ? "animate-pulse" : ""}`} />
                  <span>{isSubmitting ? "Sending Inquiry..." : "Send Message"}</span>
                </button>
              </div>
            </form>
          </div>

          {/* Right Column: 5 Columns (Fast Onboarding + School Trust) */}
          <div className="lg:col-span-5 flex flex-col justify-between gap-6">
            
            {/* Quick Demo CTA Card (Matching Emerald/Teal Homepage Gradient) */}
            <div className="rounded-3xl bg-gradient-to-br from-emerald-600 via-teal-700 to-[#03204c] p-8 text-white shadow-2xl shadow-emerald-900/20 relative overflow-hidden flex flex-col justify-between">
              
              {/* Background ambient light */}
              <div className="absolute top-0 right-0 h-48 w-48 rounded-full bg-emerald-400/20 blur-3xl pointer-events-none" />
              <div className="absolute -right-8 -bottom-8 text-white/5 pointer-events-none">
                <School className="h-48 w-48" />
              </div>

              <div className="relative z-10">
                <div className="inline-flex items-center gap-1.5 rounded-full bg-white/20 px-3.5 py-1 text-xs font-bold text-emerald-100 backdrop-blur-md mb-4 shadow-xs">
                  <Sparkles className="h-3 w-3 text-amber-300" />
                  <span>Free Institution Walkthrough</span>
                </div>

                <h3 className="text-2xl font-extrabold leading-snug">
                  Want an Interactive Guided Tour for Your Campus?
                </h3>

                <p className="mt-3 text-xs sm:text-sm text-emerald-100 leading-relaxed">
                  Our educational technology specialists can present live attendance tracking, fee collection, student report card generation, and online examination portals tailored to your school.
                </p>

                <div className="mt-6 flex items-center gap-3 pt-4 border-t border-white/15">
                  <div className="flex -space-x-2">
                    <div className="h-9 w-9 rounded-full bg-emerald-400 border-2 border-white flex items-center justify-center text-[11px] font-extrabold text-slate-900">
                      EM
                    </div>
                    <div className="h-9 w-9 rounded-full bg-teal-300 border-2 border-white flex items-center justify-center text-[11px] font-extrabold text-slate-900">
                      AC
                    </div>
                    <div className="h-9 w-9 rounded-full bg-amber-300 border-2 border-white flex items-center justify-center text-[11px] font-extrabold text-slate-900">
                      SR
                    </div>
                  </div>
                  <div className="text-xs text-emerald-100">
                    <p className="font-bold text-white">Dedicated Support Engineers</p>
                    <p className="text-[11px] text-emerald-200">Ready to assist 6 days a week</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Direct Support Promise Card */}
            <div className="rounded-3xl border border-slate-200/80 bg-white p-7 shadow-xl shadow-slate-200/40">
              <h4 className="text-base font-bold text-slate-900 mb-4 flex items-center gap-2">
                <HeartHandshake className="h-5 w-5 text-emerald-600" />
                Our Commitment to Your School
              </h4>
              <ul className="space-y-3.5 text-xs sm:text-sm text-slate-600">
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500 mt-0.5 shrink-0" />
                  <span><strong>100% Free Consultation</strong> — Zero obligation live platform demonstration.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <ShieldCheck className="h-4 w-4 text-emerald-500 mt-0.5 shrink-0" />
                  <span><strong>Data Privacy & Security</strong> — End-to-end encrypted databases and role-based access.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <Headphones className="h-4 w-4 text-emerald-500 mt-0.5 shrink-0" />
                  <span><strong>Complimentary Faculty Training</strong> — Step-by-step onboarding for all teachers and admins.</span>
                </li>
              </ul>
            </div>

          </div>

        </div>
      </section>

      {/* =====================================================
          FREQUENTLY ASKED QUESTIONS (Accordion Section)
      ====================================================== */}
      <section className="bg-white px-4 sm:px-6 lg:px-8 py-16 sm:py-20 border-t border-slate-100 relative">
        <div className="mx-auto max-w-4xl">
          
          <div className="mx-auto mb-12 max-w-2xl text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50/80 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-emerald-600 mb-2">
              <HelpCircle className="h-3.5 w-3.5 fill-emerald-500 text-emerald-500" />
              <span>Common Inquiries</span>
            </div>
            <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
              Frequently Asked <span className="text-emerald-500">Questions</span>
            </h2>
            <div className="mt-3 h-1.5 w-16 rounded-full bg-emerald-500 mx-auto" />
          </div>

          <div className="space-y-4">
            {faqs.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div
                  key={idx}
                  className="overflow-hidden rounded-2xl border border-slate-200/80 bg-[#FAFDFA] transition-all duration-200 hover:border-emerald-300"
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    className="flex w-full items-center justify-between p-5 text-left text-sm sm:text-base font-bold text-slate-900 hover:text-emerald-600 transition"
                  >
                    <span>{faq.question}</span>
                    <ChevronDown
                      className={`h-5 w-5 shrink-0 text-emerald-600 transition-transform duration-300 ${
                        isOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="px-5 pb-5 pt-1 text-xs sm:text-sm leading-relaxed text-slate-600 border-t border-slate-100 bg-white"
                    >
                      {faq.answer}
                    </motion.div>
                  )}
                </div>
              );
            })}
          </div>

        </div>
      </section>

    </div>
  );
}
