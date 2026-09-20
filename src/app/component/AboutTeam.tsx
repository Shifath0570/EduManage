"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { FaGithub, FaLinkedin } from "react-icons/fa";

export function AboutTeam() {
  const team = [
    {
      name: "Kazi Mohammad Shariful Amin",
      role: "Full Stack Developer",
      skills: "React.js • Next.js • Express.js • MongoDB",
      bio: "Always learning & building innovative solutions for modern web ecosystems.",
      github: "https://github.com/Shifath0570",
      linkedin: "https://www.linkedin.com/in/kazi-mohammad-shariful-amin/",
      initials: "KA",
      avatarGradient: "from-emerald-500 to-teal-600",
      image: "/images/team-1-shariful.png",
    },
    {
      name: "Md Maksumul Haque Emon",
      role: "Full Stack Developer",
      skills: "React & Next.js • Node.js, Express & MongoDB",
      bio: "Passionate about building modern, scalable web applications with high performance.",
      github: "https://github.com/MaksumulEmon",
      linkedin: "https://www.linkedin.com/in/maksumulemon",
      initials: "ME",
      avatarGradient: "from-teal-500 to-emerald-600",
      image: "/images/team-2-emon.png",
    },
    {
      name: "Md. Osman Goni",
      role: "Full Stack Developer",
      skills: "MongoDB • Express.js • React • Node.js",
      bio: "Specializing in full-stack features, database management, and responsive web systems.",
      github: "https://github.com/osman10",
      linkedin: "https://www.linkedin.com/in/osmanmirpur",
      initials: "OG",
      avatarGradient: "from-cyan-500 to-teal-600",
      image: "/images/team-3-osman.png",
    },
    {
      name: "Obaydur Rahman Ayon",
      role: "Full Stack Developer",
      skills: "React • Next.js • Node.js",
      bio: "Crafting modern interactive experiences. Open to internship & remote opportunities.",
      github: "https://github.com/actuallyayon",
      linkedin: "https://www.linkedin.com/in/actuallyayon",
      initials: "OA",
      avatarGradient: "from-emerald-600 to-cyan-600",
      image: "/images/team-4-ayon.png",
    },
  ];

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#FFF9EE]/40 via-[#EBFBFA]/30 to-white py-16 md:py-24">
      <div className="container relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-14 flex flex-col items-center justify-center text-center"
        >
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50/80 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-emerald-600">
            <Sparkles className="h-3.5 w-3.5 fill-emerald-500 text-emerald-500" />
            <span>Development Team</span>
          </div>

          <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl lg:text-5xl">
            Meet the Minds Behind <span className="text-emerald-500">EduManage</span>
          </h2>

          <div className="mt-3 h-1.5 w-16 rounded-full bg-emerald-500" />

          <p className="mt-4 max-w-2xl text-sm font-normal text-slate-600 sm:text-base">
            The passionate engineers and full-stack creators driving the architecture and development of the EduManage platform.
          </p>
        </motion.div>

        {/* 4 Team Members Grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {team.map((member, idx) => (
            <motion.div
              key={member.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              whileHover={{ y: -6 }}
              className="group relative flex flex-col justify-between items-start text-left rounded-3xl border border-white/80 bg-white/70 p-6 sm:p-7 backdrop-blur-md shadow-xs transition-all duration-300 hover:border-emerald-300/60 hover:bg-white hover:shadow-xl hover:shadow-emerald-900/5"
            >
              <div className="flex flex-col items-start w-full">
                {/* Circular Avatar Frame */}
                <div className="relative mb-5 flex h-24 w-24 items-center justify-center overflow-hidden rounded-full border-3 border-emerald-200/90 bg-slate-100 shadow-md transition-transform duration-300 group-hover:scale-105 group-hover:border-emerald-500">
                  {member.image ? (
                    <Image
                      src={member.image}
                      alt={member.name}
                      width={96}
                      height={96}
                      priority
                      className="h-full w-full object-cover object-top rounded-full"
                    />
                  ) : (
                    <div className={`flex h-full w-full items-center justify-center rounded-full bg-gradient-to-br ${member.avatarGradient} text-white`}>
                      <span className="text-2xl font-extrabold tracking-wider">{member.initials}</span>
                    </div>
                  )}
                </div>

                {/* Inline Name */}
                <h3
                  title={member.name}
                  className="w-full text-left text-sm sm:text-[14px] lg:text-[15px] font-bold text-slate-900 transition-colors group-hover:text-emerald-600 whitespace-nowrap truncate"
                >
                  {member.name}
                </h3>

                {/* Role */}
                <p className="text-[11px] font-bold uppercase tracking-wider text-emerald-600 mt-1">
                  {member.role}
                </p>

                {/* Skills */}
                <p className="mt-1 text-[11px] font-medium text-slate-500">
                  {member.skills}
                </p>

                {/* Bio */}
                <p className="mt-3 text-xs text-slate-600 leading-relaxed font-normal">
                  {member.bio}
                </p>
              </div>

              {/* Social Links Left Aligned (GitHub & LinkedIn) */}
              <div className="mt-6 flex items-center justify-start gap-2.5 border-t border-slate-100 pt-4 w-full">
                {member.github && (
                  <a
                    href={member.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${member.name}'s GitHub`}
                    className="flex h-8 w-8 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 transition hover:border-emerald-300 hover:bg-emerald-50 hover:text-emerald-600 hover:shadow-xs"
                  >
                    <FaGithub className="h-3.5 w-3.5" />
                  </a>
                )}

                {member.linkedin && (
                  <a
                    href={member.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${member.name}'s LinkedIn`}
                    className="flex h-8 w-8 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 transition hover:border-emerald-300 hover:bg-emerald-50 hover:text-emerald-600 hover:shadow-xs"
                  >
                    <FaLinkedin className="h-3.5 w-3.5" />
                  </a>
                )}
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
