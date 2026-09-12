import React from "react";
import ContactSection from "../component/ContactSection";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us - EduManage",
  description: "Get in touch with EduManage support and sales team for school onboarding and queries.",
};

export default function ContactPage() {
  return (
    <main className="min-h-screen flex flex-col bg-[#FAFDFA]">
      <ContactSection />
    </main>
  );
}
