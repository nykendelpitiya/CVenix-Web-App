"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import gsap from "gsap";

type AuthLayoutProps = {
  children: React.ReactNode;
  title: string;
  subtitle: string;
  sideTitle: string;
  sideText: string;
  sideButtonText: string;
  sideButtonHref: string;
};

export default function AuthLayout({
  children,
  title,
  subtitle,
  sideTitle,
  sideText,
  sideButtonText,
  sideButtonHref,
}: AuthLayoutProps) {
  const boxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.fromTo(
      boxRef.current,
      { opacity: 0, y: 8 },
      { opacity: 1, y: 0, duration: 0.28, ease: "power2.out" }
    );
  }, []);

  return (
    <main className="relative min-h-screen overflow-y-auto overflow-x-hidden bg-[#02030a] px-5 py-7 text-white sm:px-6 md:px-6 md:py-6 lg:px-8">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,#111827_0%,transparent_35%),radial-gradient(circle_at_30%_35%,#1e3a8a88,transparent_28%),radial-gradient(circle_at_70%_40%,#4c1d9580,transparent_30%),linear-gradient(180deg,#050816_0%,#02030a_70%)]" />
      <div className="absolute left-0 top-24 h-72 w-72 rounded-full bg-blue-600/20 blur-3xl" />
      <div className="absolute right-0 top-20 h-72 w-72 rounded-full bg-purple-700/20 blur-3xl" />
      <div className="absolute bottom-0 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-cyan-500/10 blur-3xl md:hidden" />

      <div className="relative flex min-h-[calc(100vh-56px)] items-center justify-center py-6 md:min-h-[calc(100vh-48px)] md:py-0">
        <div
          ref={boxRef}
          className="w-full max-w-[390px] md:grid md:max-w-[1080px] md:overflow-hidden md:rounded-[30px] md:border md:border-white/10 md:bg-[#070b16]/90 md:shadow-2xl md:shadow-black/60 md:backdrop-blur-xl md:grid-cols-[1.05fr_0.95fr] lg:min-h-[620px]"
        >
          <div className="relative hidden min-h-[620px] overflow-hidden border-r border-white/10 bg-[#050816] md:flex md:flex-col md:items-center md:justify-center md:p-10 lg:p-14">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_35%_20%,#2563eb66,transparent_28%),radial-gradient(circle_at_70%_55%,#7c3aed66,transparent_28%),radial-gradient(circle_at_15%_80%,#0ea5e944,transparent_24%)]" />
            <div className="absolute -left-20 -bottom-20 h-64 w-64 rounded-full bg-blue-500/25 blur-sm" />
            <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-purple-500/20 blur-sm" />
            <div className="absolute bottom-20 right-12 h-44 w-44 rounded-full border border-white/10 bg-white/5 shadow-2xl" />
            <div className="absolute left-10 top-12 h-24 w-24 rounded-full border border-white/15 bg-white/5" />

            <div className="relative z-10 max-w-md text-left">
              <div className="mb-7 inline-flex rounded-full border border-white/10 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-cyan-300">
                CVenix Auth
              </div>

              <h2 className="text-4xl font-extrabold uppercase tracking-[0.16em] text-white lg:text-5xl">
                {sideTitle}
              </h2>

              <p className="mt-4 text-sm font-bold uppercase tracking-[0.13em] text-cyan-300">
                Build your professional resume
              </p>

              <p className="mt-5 max-w-sm text-sm leading-6 text-gray-300">
                {sideText}
              </p>

              <Link
                href={sideButtonHref}
                prefetch={true}
                scroll={false}
                className="mt-8 inline-flex rounded-full bg-white px-8 py-3 text-sm font-bold text-black shadow-lg shadow-white/20 transition duration-200 ease-out hover:scale-[1.02] hover:bg-gray-200 active:scale-[0.98]"
              >
                {sideButtonText}
              </Link>
            </div>
          </div>

          <div className="relative text-white md:flex md:min-h-[620px] md:items-center md:justify-center md:px-10 lg:px-14">
            <div className="absolute -right-16 -bottom-16 h-40 w-40 rounded-full bg-blue-500/15 blur-2xl md:hidden" />
            <div className="absolute -left-14 top-10 h-32 w-32 rounded-full bg-purple-500/15 blur-2xl md:hidden" />

            <div className="relative z-10 mx-auto w-full max-w-[350px] px-0 py-0 md:max-w-[340px]">
              <h1 className="text-center text-3xl font-extrabold text-white sm:text-4xl">
                {title}
              </h1>

              <p className="mt-2 text-center text-xs text-gray-300 sm:text-sm">
                {subtitle}
              </p>

              <div className="mt-6">{children}</div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}