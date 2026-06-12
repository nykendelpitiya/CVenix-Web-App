"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const features = [
  {
    title: "Live Resume Preview",
    description: "See resume changes instantly while editing your details.",
  },
  {
    title: "Modern Templates",
    description: "Choose professional templates suitable for job applications.",
  },
  {
    title: "PDF Export",
    description: "Download your completed resume as a high quality PDF.",
  },
  {
    title: "Portfolio Links",
    description: "Add projects, certificates, QR codes, and public share links.",
  },
  {
    title: "Drag & Drop Sections",
    description: "Reorder resume sections easily with a smooth editing flow.",
  },
  {
    title: "ATS Friendly Layouts",
    description: "Build resumes optimized for applicant tracking systems.",
  },
];

export default function FeaturesSection() {
  const sectionRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".features-heading", {
        scrollTrigger: {
          trigger: ".features-heading",
          start: "top 85%",
          once: true,
        },
        y: 40,
        opacity: 0,
        duration: 0.9,
        ease: "power3.out",
        clearProps: "all",
      });

      gsap.from(".feature-card", {
        scrollTrigger: {
          trigger: ".features-grid",
          start: "top 85%",
          once: true,
        },
        y: 40,
        opacity: 0,
        duration: 0.8,
        stagger: 0.12,
        ease: "power3.out",
        clearProps: "all",
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="bg-black px-4 py-20 sm:px-6 sm:py-24"
    >
      <div className="mx-auto max-w-6xl">
        <div className="features-heading mx-auto max-w-3xl text-center">
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.3em] text-blue-400 sm:text-sm">
            Features
          </p>

          <h2 className="text-3xl font-bold leading-tight text-white sm:text-4xl md:text-5xl">
            Everything You Need to Build a Professional Resume
          </h2>

          <p className="mt-5 text-sm leading-relaxed text-gray-300 sm:text-base">
            CVenix provides modern tools to create, customize, preview, and
            download professional resumes easily.
          </p>
        </div>

        <div className="features-grid mt-12 grid grid-cols-2 gap-3 sm:mt-14 sm:gap-5 lg:grid-cols-3">
          {features.map((feature, index) => (
            <div
              key={index}
              className="feature-card group flex flex-col items-center rounded-3xl border border-white/10 bg-white/5 p-4 text-center opacity-100 shadow-sm backdrop-blur-xl transition duration-300 hover:-translate-y-2 hover:border-blue-400/30 hover:bg-white/10 hover:shadow-2xl hover:shadow-blue-500/10 sm:items-start sm:p-7 sm:text-left"
            >
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-2xl bg-white text-sm font-bold text-black shadow-lg shadow-white/20 sm:mb-6 sm:h-12 sm:w-12 sm:text-lg">
                {index + 1}
              </div>

              <h3 className="text-sm font-semibold leading-snug text-white sm:text-xl">
                {feature.title}
              </h3>

              <p className="mt-2 text-[11px] leading-relaxed text-gray-300 sm:mt-3 sm:text-sm">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}