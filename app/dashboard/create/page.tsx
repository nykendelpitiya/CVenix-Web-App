"use client";

import Link from "next/link";
import {
  ArrowRight,
  FileText,
  Sparkles,
  LayoutTemplate,
} from "lucide-react";

export default function CreateResumePage() {
  return (
    <div className="space-y-6">
      <div className="rounded-[32px] border border-white/10 bg-white/[0.04] p-5 shadow-2xl shadow-black/30 backdrop-blur-xl sm:p-8">
        <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-cyan-300">
          <Sparkles size={14} />
          Resume Builder
        </div>

        <h1 className="mt-5 text-3xl font-extrabold leading-tight text-white sm:text-4xl">
          Create a Professional Resume
        </h1>

        <p className="mt-4 max-w-3xl text-sm leading-7 text-gray-400">
          Select a modern ATS-friendly template and start building your
          professional CV with live preview, PDF export, and beautiful layouts.
        </p>

        <div className="mt-8 flex flex-wrap gap-4">
          <Link
            href="/dashboard/templates"
            className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-bold text-black transition-all duration-200 hover:scale-[1.02] hover:bg-gray-200"
          >
            Choose Template
            <ArrowRight size={18} />
          </Link>

          <Link
            href="/dashboard/resumes"
            className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-6 py-3 text-sm font-semibold text-white transition-all duration-200 hover:bg-white/10"
          >
            My Resumes
          </Link>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="rounded-[28px] border border-white/10 bg-[#070b16] p-6 shadow-2xl shadow-black/20">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-cyan-400/10 text-cyan-300">
            <LayoutTemplate size={28} />
          </div>

          <h2 className="mt-5 text-xl font-bold">Choose a Template</h2>

          <p className="mt-3 text-sm leading-7 text-gray-400">
            Pick from professional, creative, and minimal resume designs
            optimized for ATS systems.
          </p>
        </div>

        <div className="rounded-[28px] border border-white/10 bg-[#070b16] p-6 shadow-2xl shadow-black/20">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-purple-400/10 text-purple-300">
            <FileText size={28} />
          </div>

          <h2 className="mt-5 text-xl font-bold">Fill Your Information</h2>

          <p className="mt-3 text-sm leading-7 text-gray-400">
            Add your profile, skills, education, and experience with live
            resume preview support.
          </p>
        </div>

        <div className="rounded-[28px] border border-white/10 bg-[#070b16] p-6 shadow-2xl shadow-black/20">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-400/10 text-blue-300">
            <Sparkles size={28} />
          </div>

          <h2 className="mt-5 text-xl font-bold">Export as PDF</h2>

          <p className="mt-3 text-sm leading-7 text-gray-400">
            Download high-quality professional resumes instantly and use them
            for internships, jobs, and portfolio submissions.
          </p>
        </div>
      </div>
    </div>
  );
}