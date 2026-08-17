import React from "react";
import ContactSection from "../component/ContactSection";
import QuestionsSection from "../component/QuestionsSection";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us - EduManage",
  description: "Get in touch with EduManage support and sales team for school onboarding and queries.",
};

export default function ContactPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <ContactSection />
      <QuestionsSection />
    </div>
  );
}
