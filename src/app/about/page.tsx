import React from "react";
import type { Metadata } from "next";
import AboutHero from "../component/AboutHero";
import { AboutStory } from "../component/AboutStory";
import { AboutStakeholders } from "../component/AboutStakeholders";
import { AboutTech } from "../component/AboutTech";
import { AboutStats } from "../component/AboutStats";
import { AboutTeam } from "../component/AboutTeam";
import { AboutCTA } from "../component/AboutCTA";

export const metadata: Metadata = {
  title: "About Platform | EduManage - Smart School Management System",
  description: "Discover how EduManage transforms school administration through intelligent cloud workspaces, automated attendance, AI-driven notices, and role-based student management.",
};

const AboutPage = () => {
  return (
    <main className="min-h-screen bg-white">
      <AboutHero />
      <AboutStory />
      <AboutStakeholders />
      <AboutTech />
      <AboutStats />
      <AboutTeam />
      <AboutCTA />
    </main>
  );
};

export default AboutPage;
