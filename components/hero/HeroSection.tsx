"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import {
  Award,
  BriefcaseBusiness,
  Download,
  Eye,
  FileText,
  Folder,
  GraduationCap,
  Share2,
  Sparkles,
  User,
} from "lucide-react";

import DarkVeil from "../backgrounds/DarkVeil";

export default function HeroSection() {
  const heroRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".hero-badge", {
        y: 30,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out",
      });

      gsap.from(".hero-title", {
        y: 50,
        opacity: 0,
        duration: 1,
        delay: 0.2,
        ease: "power3.out",
      });

      gsap.from(".hero-description", {
        y: 30,
        opacity: 0,
        duration: 0.8,
        delay: 0.4,
        ease: "power3.out",
      });

      gsap.from(".hero-buttons", {
        y: 30,
        opacity: 0,
        duration: 0.8,
        delay: 0.6,
        ease: "power3.out",
      });

      gsap.from(".hero-preview", {
        x: 70,
        opacity: 0,
        rotate: 4,
        duration: 1,
        delay: 0.45,
        ease: "power3.out",
      });

      gsap.from(".hero-floating", {
        x: 35,
        opacity: 0,
        duration: 0.8,
        delay: 0.9,
        stagger: 0.12,
        ease: "power3.out",
      });
    }, heroRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={heroRef}
      className="relative flex min-h-screen items-center justify-center overflow-hidden bg-black px-4 pb-14 pt-28 sm:px-6 sm:pb-20 lg:pb-20 lg:pt-30"
    >
      <div className="absolute inset-0 z-0">
        <DarkVeil />
      </div>

      <div className="absolute inset-0 z-0 bg-black/55" />

      <div className="absolute left-0 top-28 h-72 w-72 rounded-full bg-blue-600/20 blur-[120px]" />
      <div className="absolute right-0 top-20 h-96 w-96 rounded-full bg-purple-600/20 blur-[140px]" />
      <div className="absolute bottom-20 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-cyan-500/10 blur-[120px]" />

      <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-col gap-10 lg:flex-row lg:items-center lg:justify-between lg:gap-12">
        <div className="flex max-w-2xl flex-col items-center text-center lg:-translate-y-10 lg:items-start lg:text-left">
          <div className="hero-badge mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-4 py-2 backdrop-blur-md sm:px-5">
            <Sparkles size={15} className="text-cyan-300" />

            <p className="text-xs font-medium text-white/80 sm:text-sm">
              Professional Resume Builder
            </p>
          </div>

          <h1 className="hero-title text-4xl font-bold leading-tight text-white sm:text-5xl md:text-6xl lg:text-7xl">
            Build Stunning
            <span className="bg-linear-to-r from-blue-400 via-white to-purple-400 bg-clip-text text-transparent">
              {" "}
              Resumes
            </span>
            <br />
            With CVenix
          </h1>

          <p className="hero-description mt-6 max-w-xl px-2 text-sm leading-relaxed text-gray-300 sm:text-base md:text-lg lg:px-0">
            Create modern resumes with live preview, beautiful templates, PDF
            export, portfolio links, and professional layouts designed to help
            you stand out in the job market.
          </p>

          <div className="hero-buttons mt-10 flex w-full flex-col items-center gap-4 sm:w-auto sm:flex-row lg:items-start">
            <button className="w-full rounded-full bg-white px-8 py-4 text-sm font-semibold text-black shadow-lg shadow-white/20 transition duration-300 hover:scale-105 hover:bg-gray-200 sm:w-auto">
              Create Resume
            </button>

            <button className="w-full rounded-full border border-white/10 bg-white/10 px-8 py-4 text-sm font-semibold text-white shadow-sm backdrop-blur-md transition duration-300 hover:bg-white/20 sm:w-auto">
              Explore Templates
            </button>
          </div>

          <div className="hero-preview mt-8 w-full max-w-sm rounded-[1.75rem] border border-cyan-300/20 bg-[#080d1a]/80 p-4 shadow-2xl shadow-purple-900/30 backdrop-blur-2xl lg:hidden">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-400 via-blue-500 to-purple-600 shadow-lg shadow-purple-500/30">
                <FileText size={24} className="text-white" />
              </div>

              <div className="min-w-0 text-left">
                <h3 className="text-base font-extrabold text-white">
                  Resume Builder Preview
                </h3>

                <p className="mt-1 text-xs text-gray-400">
                  Profile, skills, education, projects and PDF export.
                </p>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-3 gap-2">
              <MobileFeature icon={User} label="Profile" />
              <MobileFeature icon={Sparkles} label="Skills" />
              <MobileFeature icon={Download} label="PDF" />
            </div>
          </div>
        </div>

        <div className="hero-preview relative mx-auto hidden w-full max-w-[360px] sm:max-w-xl lg:mx-0 lg:block">
          <div className="absolute -left-8 top-16 hidden h-[360px] w-40 rotate-[-7deg] rounded-[2rem] border border-white/10 bg-white/[0.06] p-5 shadow-2xl shadow-purple-900/30 backdrop-blur-xl lg:block">
            <div className="space-y-5 text-sm text-gray-400">
              <SideItem icon={User} label="Profile" active />
              <SideItem
                icon={BriefcaseBusiness}
                label="Experience"
                active={false}
              />
              <SideItem icon={GraduationCap} label="Education" active={false} />
              <SideItem icon={Sparkles} label="Skills" active={false} />
            </div>
          </div>

          <div className="relative rounded-[1.75rem] border border-cyan-300/20 bg-[#080d1a]/85 p-4 shadow-2xl shadow-purple-900/40 backdrop-blur-2xl sm:p-5 lg:rotate-[3deg]">
            <div className="rounded-[1.35rem] border border-white/10 bg-white/[0.04] p-4 sm:p-5">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-3 sm:gap-4">
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border border-purple-400/40 bg-gradient-to-br from-cyan-400 via-blue-500 to-purple-600 shadow-lg shadow-purple-500/30 sm:h-20 sm:w-20">
                    <FileText size={26} className="text-white sm:size-[34px]" />
                  </div>

                  <div className="min-w-0">
                    <h3 className="text-xl font-extrabold leading-tight text-white sm:text-2xl">
                      Resume Template Preview
                    </h3>

                    <p className="mt-1 text-xs text-gray-300 sm:text-sm">
                      Modern CV Layout
                    </p>

                    <div className="mt-3 flex flex-wrap gap-2">
                      <PreviewTag label="ATS Friendly" />
                      <PreviewTag label="PDF Ready" />
                      <PreviewTag label="Live Preview" />
                    </div>
                  </div>
                </div>

                <div className="hidden rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-xs text-gray-300 sm:block">
                  Builder Preview
                </div>
              </div>

              <div className="mt-5 grid gap-4 sm:mt-7 sm:grid-cols-[0.9fr_1.1fr]">
                <div className="rounded-2xl border border-white/10 bg-black/25 p-4">
                  <p className="text-sm font-bold text-purple-300">
                    Profile Section
                  </p>

                  <div className="mt-4 space-y-3">
                    <SkeletonLine width="w-4/5" />
                    <SkeletonLine width="w-3/5" />
                    <SkeletonLine width="w-full" />
                  </div>
                </div>

                <div className="rounded-2xl border border-white/10 bg-black/25 p-4">
                  <p className="text-sm font-bold text-purple-300">
                    Skills Tags
                  </p>

                  <div className="mt-4 grid grid-cols-2 gap-3">
                    <SkillBadge label="Skill 01" />
                    <SkillBadge label="Skill 02" />
                    <SkillBadge label="Skill 03" />
                    <SkillBadge label="Skill 04" />
                  </div>
                </div>
              </div>

              <div className="mt-4 rounded-2xl border border-white/10 bg-black/25 p-4 sm:mt-5">
                <p className="text-sm font-bold text-purple-300">
                  Experience Timeline
                </p>

                <div className="mt-4 space-y-4 border-l border-purple-400/30 pl-4">
                  <TimelineItem
                    title="Job Position"
                    subtitle="Company Name"
                    progress="w-4/5"
                  />
                  <TimelineItem
                    title="Project Role"
                    subtitle="Project Experience"
                    progress="w-3/5"
                  />
                </div>
              </div>

              <div className="mt-4 grid gap-3 sm:mt-5 sm:grid-cols-2 sm:gap-4">
                <MiniSection
                  icon={GraduationCap}
                  title="Education"
                  text="Degree and university details"
                />

                <MiniSection
                  icon={Folder}
                  title="Projects"
                  text="Portfolio and project highlights"
                />

                <div className="hidden sm:block">
                  <MiniSection
                    icon={Award}
                    title="Certificates"
                    text="Professional achievements"
                  />
                </div>

                <div className="hidden sm:block">
                  <MiniSection
                    icon={FileText}
                    title="PDF Export"
                    text="Download-ready resume"
                  />
                </div>
              </div>
            </div>
          </div>

          <FloatingCard
            className="-right-5 top-12"
            icon={Eye}
            title="Live Preview"
          />

          <FloatingCard
            className="-right-8 top-32"
            icon={Download}
            title="PDF Export"
          />

          <FloatingCard
            className="-right-4 top-52"
            icon={Share2}
            title="Share"
          />
        </div>
      </div>
    </section>
  );
}

type IconType = React.ElementType;

type SideItemProps = {
  icon: IconType;
  label: string;
  active: boolean;
};

function SideItem({ icon: Icon, label, active }: SideItemProps) {
  return (
    <div
      className={`flex items-center gap-3 rounded-2xl px-3 py-3 ${
        active ? "bg-purple-500/15 text-white" : "text-gray-500"
      }`}
    >
      <Icon size={16} />
      <span>{label}</span>
    </div>
  );
}

type SkillBadgeProps = {
  label: string;
};

function SkillBadge({ label }: SkillBadgeProps) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2 text-center text-xs font-semibold text-gray-200">
      {label}
    </div>
  );
}

type PreviewTagProps = {
  label: string;
};

function PreviewTag({ label }: PreviewTagProps) {
  return (
    <span className="rounded-full border border-cyan-300/20 bg-cyan-300/10 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-cyan-300">
      {label}
    </span>
  );
}

type SkeletonLineProps = {
  width: string;
};

function SkeletonLine({ width }: SkeletonLineProps) {
  return (
    <div
      className={`h-2 rounded-full bg-gradient-to-r from-white/20 via-cyan-300/30 to-purple-400/30 ${width}`}
    />
  );
}

type TimelineItemProps = {
  title: string;
  subtitle: string;
  progress: string;
};

function TimelineItem({ title, subtitle, progress }: TimelineItemProps) {
  return (
    <div>
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm font-bold text-white">
          {title}
        </p>

        <span className="text-xs text-gray-500">
          Active
        </span>
      </div>

      <p className="mt-1 text-xs text-gray-400">
        {subtitle}
      </p>

      <div className="mt-3 h-2 w-full rounded-full bg-white/10">
        <div
          className={`h-2 rounded-full bg-gradient-to-r from-cyan-400 to-purple-500 ${progress}`}
        />
      </div>
    </div>
  );
}

type MiniSectionProps = {
  icon: IconType;
  title: string;
  text: string;
};

function MiniSection({ icon: Icon, title, text }: MiniSectionProps) {
  return (
    <div className="rounded-2xl border border-white/10 bg-black/25 p-4">
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-purple-500/15 text-purple-300">
          <Icon size={18} />
        </div>

        <div>
          <p className="text-sm font-bold text-white">
            {title}
          </p>

          <p className="mt-1 text-xs text-gray-500">
            {text}
          </p>
        </div>
      </div>
    </div>
  );
}

type FloatingCardProps = {
  className: string;
  icon: IconType;
  title: string;
};

function FloatingCard({ className, icon: Icon, title }: FloatingCardProps) {
  return (
    <div
      className={`hero-floating absolute hidden w-28 rounded-2xl border border-purple-400/20 bg-[#120826]/80 p-4 text-center shadow-xl shadow-purple-900/30 backdrop-blur-xl lg:block ${className}`}
    >
      <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl bg-purple-500/15 text-purple-300">
        <Icon size={20} />
      </div>

      <p className="mt-3 text-xs font-bold text-white">
        {title}
      </p>
    </div>
  );
}

type MobileFeatureProps = {
  icon: IconType;
  label: string;
};

function MobileFeature({ icon: Icon, label }: MobileFeatureProps) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.04] px-3 py-3 text-center">
      <div className="mx-auto flex h-9 w-9 items-center justify-center rounded-xl bg-purple-500/15 text-purple-300">
        <Icon size={17} />
      </div>

      <p className="mt-2 text-[11px] font-bold text-white">
        {label}
      </p>
    </div>
  );
}