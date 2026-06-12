"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  CheckCircle2,
  Download,
  Eye,
  FileText,
  Layers,
  Sparkles,
} from "lucide-react";

import Navbar from "@/components/navbar/Navbar";
import Footer from "@/components/footer/Footer";

gsap.registerPlugin(ScrollTrigger);

const steps = [
  {
    title: "Choose a Template",
    description:
      "Select a clean and professional resume template that matches your career style.",
    icon: Layers,
  },
  {
    title: "Add Your Details",
    description:
      "Enter your personal information, education, skills, projects, and work experience.",
    icon: FileText,
  },
  {
    title: "Preview Instantly",
    description:
      "View your resume live while editing and make changes before downloading.",
    icon: Eye,
  },
  {
    title: "Export as PDF",
    description:
      "Download your completed resume as a polished PDF for job applications.",
    icon: Download,
  },
];

export default function HowItWorksPage() {
  const pageRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".how-heading", {
        scrollTrigger: {
          trigger: ".how-heading",
          start: "top 85%",
          once: true,
        },
        y: 40,
        opacity: 0,
        duration: 0.9,
        ease: "power3.out",
        clearProps: "all",
      });

      gsap.from(".how-step-card", {
        scrollTrigger: {
          trigger: ".how-steps-grid",
          start: "top 85%",
          once: true,
        },
        y: 45,
        opacity: 0,
        duration: 0.8,
        stagger: 0.12,
        ease: "power3.out",
        clearProps: "all",
      });

      gsap.from(".how-preview-card", {
        scrollTrigger: {
          trigger: ".how-preview-card",
          start: "top 85%",
          once: true,
        },
        x: 50,
        opacity: 0,
        duration: 0.9,
        ease: "power3.out",
        clearProps: "all",
      });
    }, pageRef);

    return () => ctx.revert();
  }, []);

  return (
    <main ref={pageRef} className="min-h-screen overflow-hidden bg-black">
      <Navbar />

      <section className="relative overflow-hidden bg-black px-4 pb-14 pt-36 sm:px-6 sm:pb-16 sm:pt-44">
        <div className="absolute left-0 top-24 h-72 w-72 rounded-full bg-cyan-500/10 blur-[120px]" />
        <div className="absolute right-0 bottom-20 h-80 w-80 rounded-full bg-purple-500/10 blur-[130px]" />
        <div className="absolute left-1/2 top-0 h-96 w-96 -translate-x-1/2 rounded-full bg-blue-500/10 blur-[140px]" />

        <div className="relative z-10 mx-auto max-w-6xl">
          <div className="how-heading mx-auto max-w-3xl text-center">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-cyan-300/20 bg-cyan-300/10 px-4 py-2 backdrop-blur-xl">
              <Sparkles size={15} className="text-cyan-300" />

              <p className="text-xs font-bold uppercase tracking-[0.25em] text-cyan-300 sm:text-sm">
                How It Works
              </p>
            </div>

            <h1 className="text-4xl font-extrabold leading-tight text-white sm:text-5xl md:text-6xl">
              Build Your Resume in
              <span className="bg-linear-to-r from-blue-400 via-white to-purple-400 bg-clip-text text-transparent">
                {" "}
                Four Simple Steps
              </span>
            </h1>

            <p className="mx-auto mt-5 max-w-2xl text-sm leading-relaxed text-gray-300 sm:text-base">
              CVenix makes resume creation simple from template selection to
              final PDF export.
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-6 lg:grid-cols-[1fr_0.9fr] lg:items-center">
            <div className="how-steps-grid grid grid-cols-2 gap-3 sm:gap-5">
              {steps.map((step, index) => {
                const Icon = step.icon;

                return (
                  <div
                    key={index}
                    className="how-step-card group rounded-[1.5rem] border border-white/10 bg-white/[0.05] p-4 text-center shadow-xl shadow-black/20 backdrop-blur-xl transition duration-300 hover:-translate-y-2 hover:border-cyan-300/30 hover:bg-white/10 sm:rounded-[2rem] sm:p-6 sm:text-left"
                  >
                    <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-black shadow-lg shadow-white/20 sm:mx-0 sm:h-12 sm:w-12">
                      <Icon size={20} />
                    </div>

                    <p className="mt-5 text-[11px] font-bold uppercase tracking-[0.25em] text-cyan-300">
                      Step {String(index + 1).padStart(2, "0")}
                    </p>

                    <h3 className="mt-2 text-sm font-bold leading-snug text-white sm:text-xl">
                      {step.title}
                    </h3>

                    <p className="mt-3 text-[11px] leading-relaxed text-gray-400 sm:text-sm">
                      {step.description}
                    </p>
                  </div>
                );
              })}
            </div>

            <div className="how-preview-card rounded-[2rem] border border-white/10 bg-white/[0.05] p-5 shadow-2xl shadow-black/30 backdrop-blur-xl sm:p-7 lg:sticky lg:top-32">
              <div className="rounded-[1.5rem] border border-white/10 bg-[#050816] p-5">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.25em] text-blue-400">
                      Resume Flow
                    </p>

                    <h3 className="mt-2 text-2xl font-extrabold text-white">
                      From Blank Page to PDF
                    </h3>
                  </div>

                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-300/10 text-cyan-300">
                    <CheckCircle2 size={24} />
                  </div>
                </div>

                <div className="mt-7 space-y-4">
                  {steps.map((step, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/[0.04] p-4"
                    >
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-sm font-extrabold text-black">
                        {index + 1}
                      </div>

                      <div>
                        <h4 className="text-sm font-bold text-white">
                          {step.title}
                        </h4>

                        <p className="mt-1 text-xs text-gray-400">
                          {step.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-6 rounded-2xl border border-cyan-300/20 bg-cyan-300/10 p-4">
                  <p className="text-sm font-semibold text-cyan-300">
                    Simple, fast, and beginner friendly.
                  </p>

                  <p className="mt-2 text-xs leading-relaxed text-gray-400">
                    Users can create, preview, edit, and export resumes without
                    needing design skills.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}