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
  Link2,
  Palette,
  PenLine,
  QrCode,
  ShieldCheck,
  Sparkles,
  Zap,
} from "lucide-react";

import Navbar from "@/components/navbar/Navbar";
import Footer from "@/components/footer/Footer";

gsap.registerPlugin(ScrollTrigger);

const featureDetails = [
  {
    title: "Smart Resume Editor",
    description:
      "Add your profile, education, experience, projects, skills, certificates, and links using a clean step-by-step editor.",
    icon: PenLine,
    points: ["Section-based editing", "Easy content updates", "Clean form layout"],
  },
  {
    title: "Live Resume Preview",
    description:
      "Preview your resume instantly while editing and understand exactly how your final CV will look before exporting.",
    icon: Eye,
    points: ["Real-time preview", "Template-based layout", "Smooth editing flow"],
  },
  {
    title: "Professional Templates",
    description:
      "Choose modern resume layouts designed for students, interns, job seekers, and professionals.",
    icon: Layers,
    points: ["Modern layouts", "Clean typography", "Professional structure"],
  },
  {
    title: "PDF Export",
    description:
      "Download your completed resume as a clean, high-quality PDF suitable for online and offline job applications.",
    icon: Download,
    points: ["High-quality PDF", "Print-ready output", "Fast export"],
  },
  {
    title: "Portfolio & QR Links",
    description:
      "Add project links, portfolio links, certificates, and QR codes to make your resume more complete and interactive.",
    icon: QrCode,
    points: ["Portfolio links", "Certificate links", "QR code support"],
  },
  {
    title: "ATS Friendly Layouts",
    description:
      "Create simple and readable resumes with structured sections that are suitable for modern recruitment workflows.",
    icon: ShieldCheck,
    points: ["Readable format", "Clean sections", "Recruiter friendly"],
  },
];

const workflow = [
  {
    title: "Choose Template",
    text: "Select a professional resume template that matches your career style.",
  },
  {
    title: "Add Details",
    text: "Fill in your profile, education, skills, projects, and experience.",
  },
  {
    title: "Preview Resume",
    text: "Check your resume layout instantly with the live preview system.",
  },
  {
    title: "Export PDF",
    text: "Download your final resume as a polished and professional PDF.",
  },
];

const highlights = [
  {
    title: "Beginner Friendly",
    text: "Simple layout and clear steps make resume building easy.",
    icon: Sparkles,
  },
  {
    title: "Fast Workflow",
    text: "Create and update resumes quickly without complex tools.",
    icon: Zap,
  },
  {
    title: "Custom Styling",
    text: "Use modern layouts, colors, and structured sections.",
    icon: Palette,
  },
  {
    title: "Share Ready",
    text: "Keep your resume ready for applications and portfolio sharing.",
    icon: Link2,
  },
];

export default function FeaturesPage() {
  const pageRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".features-hero-item", {
        y: 45,
        opacity: 0,
        duration: 0.9,
        stagger: 0.12,
        ease: "power3.out",
      });

      gsap.from(".feature-detail-card", {
        scrollTrigger: {
          trigger: ".feature-detail-grid",
          start: "top 85%",
          once: true,
        },
        y: 45,
        opacity: 0,
        duration: 0.8,
        stagger: 0.1,
        ease: "power3.out",
        clearProps: "all",
      });

      gsap.from(".workflow-panel", {
        scrollTrigger: {
          trigger: ".workflow-section",
          start: "top 85%",
          once: true,
        },
        y: 45,
        opacity: 0,
        duration: 0.9,
        ease: "power3.out",
        clearProps: "all",
      });

      gsap.from(".workflow-step", {
        scrollTrigger: {
          trigger: ".workflow-steps",
          start: "top 85%",
          once: true,
        },
        x: 40,
        opacity: 0,
        duration: 0.8,
        stagger: 0.12,
        ease: "power3.out",
        clearProps: "all",
      });

      gsap.from(".highlight-card", {
        scrollTrigger: {
          trigger: ".highlights-grid",
          start: "top 85%",
          once: true,
        },
        y: 35,
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

      <section className="relative overflow-hidden px-4 pb-14 pt-36 sm:px-6 sm:pb-20 sm:pt-44">
        <div className="absolute left-1/2 top-0 h-96 w-96 -translate-x-1/2 rounded-full bg-blue-500/15 blur-3xl" />
        <div className="absolute right-0 top-40 h-80 w-80 rounded-full bg-purple-500/10 blur-3xl" />
        <div className="absolute left-0 bottom-0 h-72 w-72 rounded-full bg-cyan-500/10 blur-3xl" />

        <div className="relative z-10 mx-auto max-w-6xl">
          <div className="mx-auto max-w-5xl text-center">
            <div className="features-hero-item mx-auto mb-6 inline-flex items-center gap-2 rounded-full border border-cyan-300/20 bg-cyan-300/10 px-4 py-2 backdrop-blur-xl">
              <Sparkles size={15} className="text-cyan-300" />

              <p className="text-xs font-bold uppercase tracking-[0.25em] text-cyan-300 sm:text-sm">
                CVenix Features
              </p>
            </div>

            <h1 className="features-hero-item text-4xl font-extrabold leading-tight text-white sm:text-5xl md:text-6xl lg:text-7xl">
              Designed to Make Resume
              <span className="bg-linear-to-r from-blue-400 via-white to-purple-400 bg-clip-text text-transparent">
                {" "}
                Building Simple
              </span>
            </h1>

            <p className="features-hero-item mx-auto mt-6 max-w-3xl text-sm leading-relaxed text-gray-300 sm:text-base md:text-lg">
              CVenix gives users a complete resume creation experience with a
              smart editor, live preview, professional templates, export tools,
              and portfolio sharing features.
            </p>
          </div>

          <div className="features-hero-item mx-auto mt-12 grid max-w-4xl grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
            <HeroStat label="Smart Editor" value="01" />
            <HeroStat label="Live Preview" value="02" />
            <HeroStat label="PDF Export" value="03" />
            <HeroStat label="ATS Ready" value="04" />
          </div>
        </div>
      </section>

      <section className="px-4 py-12 sm:px-6 sm:py-16">
        <div className="feature-detail-grid mx-auto grid max-w-6xl grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-3">
          {featureDetails.map((feature, index) => {
            const Icon = feature.icon;

            return (
              <div
                key={index}
                className="feature-detail-card group rounded-[1.5rem] border border-white/10 bg-white/[0.05] p-4 text-center shadow-xl shadow-black/20 backdrop-blur-xl transition duration-300 hover:-translate-y-2 hover:border-cyan-300/30 hover:bg-white/10 hover:shadow-cyan-500/10 sm:rounded-[2rem] sm:p-7 sm:text-left"
              >
                <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-black shadow-lg shadow-white/20 transition duration-300 group-hover:scale-105 sm:mx-0 sm:h-13 sm:w-13">
                  <Icon size={20} />
                </div>

                <h2 className="mt-5 text-sm font-bold leading-snug text-white sm:text-xl">
                  {feature.title}
                </h2>

                <p className="mt-3 text-[11px] leading-relaxed text-gray-400 sm:text-sm">
                  {feature.description}
                </p>

                <div className="mt-5 hidden space-y-3 sm:block">
                  {feature.points.map((point) => (
                    <div
                      key={point}
                      className="flex items-center gap-3 rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-gray-300"
                    >
                      <CheckCircle2 size={16} className="text-cyan-300" />
                      {point}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <section className="workflow-section px-4 py-12 sm:px-6 sm:py-16">
        <div className="workflow-panel mx-auto max-w-6xl overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.05] shadow-2xl shadow-black/30 backdrop-blur-xl">
          <div className="grid grid-cols-1 lg:grid-cols-[0.9fr_1.1fr]">
            <div className="relative overflow-hidden border-b border-white/10 p-7 sm:p-10 lg:border-b-0 lg:border-r">
              <div className="absolute right-0 top-0 h-56 w-56 rounded-full bg-blue-500/15 blur-3xl" />
              <div className="absolute bottom-0 left-0 h-56 w-56 rounded-full bg-purple-500/15 blur-3xl" />

              <div className="relative z-10">
                <p className="mb-4 text-xs font-bold uppercase tracking-[0.3em] text-blue-400 sm:text-sm">
                  Workflow
                </p>

                <h2 className="text-3xl font-extrabold leading-tight text-white sm:text-4xl md:text-5xl">
                  From Template Selection to Final PDF
                </h2>

                <p className="mt-5 text-sm leading-relaxed text-gray-300 sm:text-base">
                  The CVenix feature flow is designed to make resume creation
                  fast, clear, and beginner friendly.
                </p>

                <div className="mt-8 rounded-3xl border border-cyan-300/20 bg-cyan-300/10 p-5">
                  <div className="flex items-start gap-4">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white text-black">
                      <FileText size={20} />
                    </div>

                    <div>
                      <h3 className="font-bold text-white">
                        Build once, update anytime
                      </h3>

                      <p className="mt-2 text-sm leading-relaxed text-gray-300">
                        Users can update their resume details, change templates,
                        and export again whenever needed.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="workflow-steps space-y-4 p-5 sm:p-8">
              {workflow.map((step, index) => (
                <div
                  key={index}
                  className="workflow-step group flex items-start gap-4 rounded-3xl border border-white/10 bg-black/40 p-5 transition duration-300 hover:border-blue-400/30 hover:bg-white/[0.06]"
                >
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white text-sm font-extrabold text-black shadow-lg shadow-white/20">
                    {String(index + 1).padStart(2, "0")}
                  </div>

                  <div>
                    <h3 className="font-bold text-white">
                      {step.title}
                    </h3>

                    <p className="mt-2 text-sm leading-relaxed text-gray-400">
                      {step.text}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="px-4 py-12 sm:px-6 sm:py-16">
        <div className="mx-auto max-w-6xl">
          <div className="mx-auto max-w-3xl text-center">
            <p className="mb-4 text-xs font-bold uppercase tracking-[0.3em] text-blue-400 sm:text-sm">
              Why CVenix
            </p>

            <h2 className="text-3xl font-extrabold leading-tight text-white sm:text-4xl md:text-5xl">
              Built for Fast and Professional Resume Creation
            </h2>
          </div>

          <div className="highlights-grid mt-10 grid grid-cols-2 gap-3 sm:mt-12 sm:gap-5 lg:grid-cols-4">
            {highlights.map((item, index) => {
              const Icon = item.icon;

              return (
                <div
                  key={index}
                  className="highlight-card rounded-[1.5rem] border border-white/10 bg-white/[0.05] p-4 text-center backdrop-blur-xl transition duration-300 hover:-translate-y-2 hover:border-purple-400/30 hover:bg-white/10 sm:rounded-[2rem] sm:p-6"
                >
                  <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-2xl bg-purple-500/15 text-purple-300">
                    <Icon size={20} />
                  </div>

                  <h3 className="mt-5 text-sm font-bold text-white sm:text-lg">
                    {item.title}
                  </h3>

                  <p className="mt-2 text-[11px] leading-relaxed text-gray-400 sm:text-sm">
                    {item.text}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}

type HeroStatProps = {
  value: string;
  label: string;
};

function HeroStat({ value, label }: HeroStatProps) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/[0.05] p-4 text-center backdrop-blur-xl">
      <h3 className="text-2xl font-extrabold text-white sm:text-3xl">
        {value}
      </h3>

      <p className="mt-2 text-[11px] font-medium text-gray-400 sm:text-sm">
        {label}
      </p>
    </div>
  );
}