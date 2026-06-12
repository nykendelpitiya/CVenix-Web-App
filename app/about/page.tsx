"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  Download,
  Eye,
  FileText,
  LayoutTemplate,
  ShieldCheck,
  Sparkles,
  Users,
  Zap,
} from "lucide-react";

import Navbar from "@/components/navbar/Navbar";
import Footer from "@/components/footer/Footer";

gsap.registerPlugin(ScrollTrigger);

const offers = [
  {
    title: "Professional Templates",
    description: "Modern resume templates managed from the admin dashboard.",
    icon: LayoutTemplate,
  },
  {
    title: "Live Preview",
    description: "Users can see resume changes instantly while editing.",
    icon: Eye,
  },
  {
    title: "Easy Editing",
    description: "Simple forms make resume creation beginner friendly.",
    icon: FileText,
  },
  {
    title: "PDF Export",
    description: "Completed resumes can be downloaded as professional PDFs.",
    icon: Download,
  },
];

const reasons = [
  "Clean and modern dashboard experience",
  "Suitable for students and job seekers",
  "Dynamic templates from backend database",
  "Simple workflow from editing to PDF export",
];

export default function AboutPage() {
  const pageRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".about-hero-item", {
        y: 45,
        opacity: 0,
        duration: 0.9,
        stagger: 0.12,
        ease: "power3.out",
      });

      gsap.from(".about-card", {
        scrollTrigger: {
          trigger: ".about-grid",
          start: "top 85%",
          once: true,
        },
        y: 40,
        opacity: 0,
        duration: 0.8,
        stagger: 0.1,
        ease: "power3.out",
        clearProps: "all",
      });

      gsap.from(".mission-card", {
        scrollTrigger: {
          trigger: ".mission-section",
          start: "top 85%",
          once: true,
        },
        y: 45,
        opacity: 0,
        duration: 0.9,
        ease: "power3.out",
        clearProps: "all",
      });

      gsap.from(".reason-item", {
        scrollTrigger: {
          trigger: ".reason-list",
          start: "top 85%",
          once: true,
        },
        x: 35,
        opacity: 0,
        duration: 0.75,
        stagger: 0.1,
        ease: "power3.out",
        clearProps: "all",
      });
    }, pageRef);

    return () => ctx.revert();
  }, []);

  return (
    <main ref={pageRef} className="min-h-screen overflow-hidden bg-black">
      <Navbar />

      <section className="relative overflow-hidden px-4 pb-14 pt-36 sm:px-6 sm:pb-16 sm:pt-44">
        <div className="absolute left-1/2 top-0 h-96 w-96 -translate-x-1/2 rounded-full bg-blue-500/15 blur-[140px]" />
        <div className="absolute right-0 top-36 h-80 w-80 rounded-full bg-purple-500/10 blur-[130px]" />
        <div className="absolute left-0 bottom-10 h-72 w-72 rounded-full bg-cyan-500/10 blur-[120px]" />

        <div className="relative z-10 mx-auto grid max-w-6xl grid-cols-1 gap-10 lg:grid-cols-[1fr_0.9fr] lg:items-center">
          <div className="text-center lg:text-left">
            <div className="about-hero-item mb-6 inline-flex items-center gap-2 rounded-full border border-cyan-300/20 bg-cyan-300/10 px-4 py-2 backdrop-blur-xl">
              <Sparkles size={15} className="text-cyan-300" />

              <p className="text-xs font-bold uppercase tracking-[0.25em] text-cyan-300 sm:text-sm">
                About CVenix
              </p>
            </div>

            <h1 className="about-hero-item text-4xl font-extrabold leading-tight text-white sm:text-5xl md:text-6xl">
              A Modern Resume Builder for
              <span className="bg-linear-to-r from-blue-400 via-white to-purple-400 bg-clip-text text-transparent">
                {" "}
                Better Careers
              </span>
            </h1>

            <p className="about-hero-item mx-auto mt-6 max-w-2xl text-sm leading-relaxed text-gray-300 sm:text-base lg:mx-0">
              CVenix is a professional resume builder platform designed to help
              students, interns, and job seekers create clean resumes with
              modern templates, live preview, and PDF export.
            </p>
          </div>

          <div className="about-hero-item rounded-4xl border border-white/10 bg-white/5 p-5 shadow-2xl shadow-black/30 backdrop-blur-xl sm:p-7">
            <div className="rounded-3xl border border-white/10 bg-[#050816] p-5">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.25em] text-blue-400">
                    CVenix Platform
                  </p>

                  <h2 className="mt-2 text-2xl font-extrabold text-white">
                    Built for Simple Resume Creation
                  </h2>
                </div>

                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-300/10 text-cyan-300">
                  <ShieldCheck size={24} />
                </div>
              </div>

              <div className="mt-7 grid grid-cols-2 gap-3">
                <MiniStat value="Fast" label="Resume Editing" />
                <MiniStat value="Live" label="Preview System" />
                <MiniStat value="PDF" label="Export Ready" />
                <MiniStat value="Admin" label="Template Control" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="px-4 py-12 sm:px-6 sm:py-16">
        <div className="about-grid mx-auto grid max-w-6xl grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">
          {offers.map((item, index) => {
            const Icon = item.icon;

            return (
              <div
                key={index}
                className="about-card rounded-[1.5rem] border border-white/10 bg-white/[0.05] p-4 text-center shadow-xl shadow-black/20 backdrop-blur-xl transition duration-300 hover:-translate-y-2 hover:border-cyan-300/30 hover:bg-white/10 sm:rounded-4xl sm:p-6"
              >
                <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-black shadow-lg shadow-white/20">
                  <Icon size={20} />
                </div>

                <h3 className="mt-5 text-sm font-bold leading-snug text-white sm:text-lg">
                  {item.title}
                </h3>

                <p className="mt-3 text-[11px] leading-relaxed text-gray-400 sm:text-sm">
                  {item.description}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      <section className="mission-section px-4 py-12 sm:px-6 sm:py-16">
        <div className="mission-card mx-auto max-w-6xl overflow-hidden rounded-4xl border border-white/10 bg-white/[0.05] shadow-2xl shadow-black/30 backdrop-blur-xl">
          <div className="grid grid-cols-1 lg:grid-cols-[0.95fr_1.05fr]">
            <div className="relative overflow-hidden border-b border-white/10 p-7 sm:p-10 lg:border-b-0 lg:border-r">
              <div className="absolute right-0 top-0 h-56 w-56 rounded-full bg-blue-500/15 blur-3xl" />
              <div className="absolute bottom-0 left-0 h-56 w-56 rounded-full bg-purple-500/15 blur-3xl" />

              <div className="relative z-10">
                <p className="mb-4 text-xs font-bold uppercase tracking-[0.3em] text-blue-400 sm:text-sm">
                  Our Mission
                </p>

                <h2 className="text-3xl font-extrabold leading-tight text-white sm:text-4xl md:text-5xl">
                  Make Resume Building Simple, Fast, and Professional
                </h2>

                <p className="mt-5 text-sm leading-relaxed text-gray-300 sm:text-base">
                  The goal of CVenix is to remove the difficulty of resume
                  design and give users a guided system to build resumes that
                  look clean, organized, and ready for job applications.
                </p>
              </div>
            </div>

            <div className="reason-list space-y-4 p-5 sm:p-8">
              {reasons.map((reason, index) => (
                <div
                  key={index}
                  className="reason-item flex items-center gap-4 rounded-3xl border border-white/10 bg-black/40 p-5"
                >
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white text-black">
                    <Zap size={19} />
                  </div>

                  <p className="text-sm font-semibold leading-relaxed text-white sm:text-base">
                    {reason}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="px-4 py-12 sm:px-6 sm:py-16">
        <div className="mx-auto max-w-6xl rounded-4xl border border-cyan-300/20 bg-cyan-300/10 p-7 text-center backdrop-blur-xl sm:p-10">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-black">
            <Users size={24} />
          </div>

          <h2 className="mt-6 text-3xl font-extrabold text-white sm:text-4xl">
            Designed for Students and Job Seekers
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-gray-300 sm:text-base">
            CVenix focuses on a smooth user experience, clean dashboard design,
            and practical resume building features that help users prepare for
            internships, interviews, and job applications.
          </p>
        </div>
      </section>

      <Footer />
    </main>
  );
}

type MiniStatProps = {
  value: string;
  label: string;
};

function MiniStat({ value, label }: MiniStatProps) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/4 p-4 text-center">
      <h3 className="text-xl font-extrabold text-white">
        {value}
      </h3>

      <p className="mt-2 text-[11px] font-medium text-gray-400">
        {label}
      </p>
    </div>
  );
}