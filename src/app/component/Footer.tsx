"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Shield, BookOpen } from "lucide-react";
import { 
  FaFacebookF, 
  FaTwitter, 
  FaLinkedinIn, 
  FaYoutube, 
  FaMapMarkerAlt, 
  FaPhoneAlt, 
  FaEnvelope, 
  FaGlobe,
  FaChevronRight
} from "react-icons/fa";

export default function Footer() {
  const pathname = usePathname();
  const isDashboard = 
    pathname?.startsWith("/student") || 
    pathname?.startsWith("/teacher") || 
    pathname?.startsWith("/admin");

  if (isDashboard) return null;
  const quickLinks = [
    { label: "Home", href: "/" },
    { label: "About", href: "/about" },
    { label: "Notice", href: "/notice" },
    { label: "Blog", href: "/blog" },
    { label: "Contact", href: "/contact" },
  ];

  const features = [
    { label: "Student Management", href: "/#features" },
    { label: "Teacher Management", href: "/#features" },
    { label: "Attendance System", href: "/#features" },
    { label: "Examination & Results", href: "/#features" },
    { label: "Reports & Analytics", href: "/#features" },
  ];

  const supportLinks = [
    { label: "Help Center", href: "/help" },
    { label: "Documentation", href: "/docs" },
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms & Conditions", href: "/terms" },
    { label: "Contact Us", href: "/contact" },
  ];

  return (
    <footer className="w-full bg-[#021533] text-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-8">
        {/* Main Grid Section */}
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-12 lg:gap-8">
          
          {/* Column 1: Brand & About (Span 4 cols on lg) */}
          <div className="lg:col-span-4 lg:pr-8 lg:border-r lg:border-blue-900/40 flex flex-col justify-between">
            <div>
              {/* Brand Logo */}
              <Link href="/" className="inline-flex items-center gap-2.5 focus:outline-none">
                <div className="relative flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-b from-blue-400 to-blue-600 text-white shadow-sm">
                  <Shield className="h-9 w-9 text-blue-400 fill-blue-500 absolute" />
                  <BookOpen className="h-5 w-5 text-white relative z-10 stroke-[2.5]" />
                </div>
                <div className="flex flex-col">
                  <span className="text-2xl font-bold leading-none tracking-tight text-white">
                    EduManage
                  </span>
                  <span className="text-[11px] font-medium leading-tight text-blue-200/80 mt-1">
                    School Management Platform
                  </span>
                </div>
              </Link>

              {/* Description */}
              <p className="mt-5 text-sm text-slate-300/90 leading-relaxed max-w-sm">
                A complete solution for modern schools to manage students, teachers, attendance, exams, results, and more efficiently.
              </p>
            </div>

            {/* Social Icons */}
            <div className="mt-8 flex items-center gap-3">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
                aria-label="Facebook"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-[#062758] border border-blue-800/40 text-white transition-all duration-200 hover:bg-blue-600 hover:border-blue-500 hover:scale-110"
              >
                <FaFacebookF className="h-4 w-4" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noreferrer"
                aria-label="Twitter"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-[#062758] border border-blue-800/40 text-white transition-all duration-200 hover:bg-blue-600 hover:border-blue-500 hover:scale-110"
              >
                <FaTwitter className="h-4 w-4" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noreferrer"
                aria-label="LinkedIn"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-[#062758] border border-blue-800/40 text-white transition-all duration-200 hover:bg-blue-600 hover:border-blue-500 hover:scale-110"
              >
                <FaLinkedinIn className="h-4 w-4" />
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noreferrer"
                aria-label="YouTube"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-[#062758] border border-blue-800/40 text-white transition-all duration-200 hover:bg-blue-600 hover:border-blue-500 hover:scale-110"
              >
                <FaYoutube className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Column 2: Quick Links (Span 2 cols on lg) */}
          <div className="lg:col-span-2">
            <h3 className="text-lg font-bold text-white tracking-wide">Quick Links</h3>
            <ul className="mt-5 space-y-3.5">
              {quickLinks.map((item, idx) => (
                <li key={idx}>
                  <Link
                    href={item.href}
                    className="group inline-flex items-center gap-2 text-sm text-slate-300 transition-colors duration-200 hover:text-white"
                  >
                    <FaChevronRight className="h-2.5 w-2.5 text-blue-400 transition-transform duration-200 group-hover:translate-x-1" />
                    <span>{item.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Features (Span 2 cols on lg) */}
          <div className="lg:col-span-2">
            <h3 className="text-lg font-bold text-white tracking-wide">Features</h3>
            <ul className="mt-5 space-y-3.5">
              {features.map((item, idx) => (
                <li key={idx}>
                  <Link
                    href={item.href}
                    className="group inline-flex items-center gap-2 text-sm text-slate-300 transition-colors duration-200 hover:text-white"
                  >
                    <FaChevronRight className="h-2.5 w-2.5 text-blue-400 transition-transform duration-200 group-hover:translate-x-1" />
                    <span>{item.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Support (Span 2 cols on lg) */}
          <div className="lg:col-span-2">
            <h3 className="text-lg font-bold text-white tracking-wide">Support</h3>
            <ul className="mt-5 space-y-3.5">
              {supportLinks.map((item, idx) => (
                <li key={idx}>
                  <Link
                    href={item.href}
                    className="group inline-flex items-center gap-2 text-sm text-slate-300 transition-colors duration-200 hover:text-white"
                  >
                    <FaChevronRight className="h-2.5 w-2.5 text-blue-400 transition-transform duration-200 group-hover:translate-x-1" />
                    <span>{item.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 5: Contact Info (Span 2 cols on lg) */}
          <div className="lg:col-span-2">
            <h3 className="text-lg font-bold text-white tracking-wide">Contact Info</h3>
            <ul className="mt-5 space-y-4 text-sm text-slate-300">
              <li className="flex items-start gap-3">
                <FaMapMarkerAlt className="h-4 w-4 text-blue-400 shrink-0 mt-1" />
                <span className="leading-snug">
                  123 Education Street,<br />Knowledge City, 1000
                </span>
              </li>
              <li className="flex items-center gap-3">
                <FaPhoneAlt className="h-4 w-4 text-blue-400 shrink-0" />
                <a href="tel:+8801234567890" className="hover:text-white transition-colors duration-200">
                  +880 1234-567890
                </a>
              </li>
              <li className="flex items-center gap-3">
                <FaEnvelope className="h-4 w-4 text-blue-400 shrink-0" />
                <a href="mailto:info@edumanage.com" className="hover:text-white transition-colors duration-200">
                  info@edumanage.com
                </a>
              </li>
              <li className="flex items-center gap-3">
                <FaGlobe className="h-4 w-4 text-blue-400 shrink-0" />
                <a href="https://www.edumanage.com" target="_blank" rel="noreferrer" className="hover:text-white transition-colors duration-200">
                  www.edumanage.com
                </a>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Horizontal Divider */}
        <div className="mt-14 pt-8 border-t border-blue-900/40 text-center">
          <p className="text-sm font-normal text-slate-400">
            © 2025 EduManage. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}



