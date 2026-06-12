"use client";

import { FileText, LayoutTemplate, Download } from "lucide-react";
import { useEffect, useRef } from "react";
import gsap from "gsap";

type StatsCardsProps = {
  totalResumes?: number;
  totalTemplates?: number;
  completedResumes?: number;
  loading?: boolean;
};

export default function StatsCards({
  totalResumes = 0,
  totalTemplates = 0,
  completedResumes = 0,
  loading = false,
}: StatsCardsProps) {
  const cardsRef = useRef<HTMLDivElement | null>(null);

  const stats = [
    {
      label: "Resumes Created",
      value: loading ? "--" : String(totalResumes).padStart(2, "0"),
      icon: FileText,
    },
    {
      label: "Available Templates",
      value: loading ? "--" : String(totalTemplates).padStart(2, "0"),
      icon: LayoutTemplate,
    },
    {
      label: "Active Resumes",
      value: loading ? "--" : String(completedResumes).padStart(2, "0"),
      icon: Download,
    },
  ];

  useEffect(() => {
    if (!cardsRef.current) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".stats-card",
        {
          opacity: 0,
          y: 26,
          scale: 0.94,
          rotateX: 8,
        },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          rotateX: 0,
          duration: 0.65,
          stagger: 0.12,
          ease: "power3.out",
          clearProps: "opacity,transform,visibility",
        }
      );

      gsap.fromTo(
        ".stats-icon",
        {
          scale: 0.6,
          rotate: -12,
          opacity: 0,
        },
        {
          scale: 1,
          rotate: 0,
          opacity: 1,
          duration: 0.55,
          stagger: 0.12,
          delay: 0.15,
          ease: "back.out(1.8)",
          clearProps: "opacity,transform,visibility",
        }
      );

      gsap.fromTo(
        ".stats-value",
        {
          opacity: 0,
          y: 10,
        },
        {
          opacity: 1,
          y: 0,
          duration: 0.45,
          stagger: 0.1,
          delay: 0.2,
          ease: "power2.out",
          clearProps: "opacity,transform,visibility",
        }
      );
    }, cardsRef);

    return () => ctx.revert();
  }, [loading, totalResumes, totalTemplates, completedResumes]);

  return (
    <section
      ref={cardsRef}
      className="grid grid-cols-2 gap-4 xl:grid-cols-3"
    >
      {stats.map((item, index) => {
        const Icon = item.icon;

        return (
          <div
            key={item.label}
            className={`stats-card flex min-h-[118px] flex-col items-center justify-center rounded-3xl border border-white/10 bg-white/[0.06] p-4 text-center opacity-100 shadow-xl shadow-black/20 backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:border-cyan-300/30 hover:bg-white/[0.08] sm:min-h-[150px] sm:p-6 ${
              index === 2 ? "col-span-2 xl:col-span-1" : ""
            }`}
          >
            <div className="stats-icon flex h-10 w-10 items-center justify-center rounded-2xl bg-white text-black shadow-lg shadow-white/10 sm:h-12 sm:w-12">
              <Icon size={20} />
            </div>

            <h3 className="stats-value mt-3 text-2xl font-extrabold text-white sm:mt-5 sm:text-3xl">
              {item.value}
            </h3>

            <p className="mt-1 text-center text-xs leading-relaxed text-gray-400 sm:text-sm">
              {item.label}
            </p>
          </div>
        );
      })}
    </section>
  );
}