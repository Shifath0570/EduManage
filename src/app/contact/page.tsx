import React from "react";
import ContactSection from "../component/ContactSection";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us & Book a Demo | EduManage",
  description: "Get in touch with the EduManage team. Book an institutional demo, request academic support, or ask about our school management system.",
  keywords: ["EduManage Contact", "School Management Demo", "EdTech Support", "Institutional Onboarding"],
  openGraph: {
    title: "Contact Us & Book a Demo | EduManage",
    description: "Get in touch with the EduManage team. Book an institutional demo, request academic support, or ask about our school management system.",
    type: "website",
  },
};

export default function ContactPage() {
  return (
    <main className="min-h-screen flex flex-col bg-[#FAFDFA]">
      <ContactSection />
    </main>
  );
}
