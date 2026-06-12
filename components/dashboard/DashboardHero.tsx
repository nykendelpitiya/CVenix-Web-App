"use client";

import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { useEffect, useRef } from "react";
import gsap from "gsap";

export default function DashboardHero() {
  const heroRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!heroRef.current) return;

    const ctx = gsap.context(() => {
      gsap.set(
        [".hero-badge", ".hero-title", ".hero-text", ".hero-button"],
        {
          opacity: 1,
          visibility: "visible",
        }
      );

      gsap.fromTo(
        ".hero-badge",
        { opacity: 0, y: 18 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          ease: "power3.out",
          clearProps: "opacity,transform,visibility",
        }
      );

      gsap.fromTo(
        ".hero-title",
        { opacity: 0, y: 26 },
        {
          opacity: 1,
          y: 0,
          duration: 0.75,
          delay: 0.12,
          ease: "power3.out",
          clearProps: "opacity,transform,visibility",
        }
      );

      gsap.fromTo(
        ".hero-text",
        { opacity: 0, y: 22 },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          delay: 0.22,
          ease: "power3.out",
          clearProps: "opacity,transform,visibility",
        }
      );

      gsap.fromTo(
        ".hero-button",
        { opacity: 0, y: 18, scale: 0.95 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.65,
          delay: 0.32,
          ease: "back.out(1.7)",
          clearProps: "opacity,transform,visibility",
        }
      );

      gsap.to(".hero-glow-purple", {
        x: -20,
        y: 18,
        duration: 4,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });

      gsap.to(".hero-glow-blue", {
        x: 22,
        y: -16,
        duration: 4.5,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });
    }, heroRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={heroRef}
      className="relative overflow-hidden rounded-[32px] border border-white/10 bg-gradient-to-br from-blue-600/30 via-purple-600/20 to-black px-6 py-8 shadow-2xl shadow-black/40 sm:px-8"
    >
      <div className="hero-glow-purple absolute -right-16 -top-16 h-56 w-56 rounded-full bg-purple-500/30 blur-3xl" />
      <div className="hero-glow-blue absolute -left-16 bottom-0 h-56 w-56 rounded-full bg-blue-500/25 blur-3xl" />

      <div className="relative z-10 max-w-2xl">
        <div className="hero-badge inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-4 py-2 text-xs font-semibold text-cyan-300">
          <Sparkles size={14} />
          AI Powered Resume Builder
        </div>

        <h2 className="hero-title mt-5 text-3xl font-extrabold leading-tight sm:text-4xl">
          Create a professional resume in minutes.
        </h2>

        <p className="hero-text mt-4 max-w-xl text-sm leading-6 text-gray-300">
          Choose a modern template, add your information, preview your resume,
          and export it as a polished PDF.
        </p>

        <Link
          href="/dashboard/templates"
          className="hero-button mt-7 inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-bold text-black transition hover:bg-gray-200"
        >
          Create Resume
          <ArrowRight size={18} />
        </Link>
      </div>
    </section>
  );
}