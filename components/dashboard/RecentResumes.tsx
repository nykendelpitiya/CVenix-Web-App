"use client";

import Link from "next/link";
import {
  Download,
  Edit,
  Eye,
  Loader2,
  MoreVertical,
  Trash2,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

type Resume = {
  id: number;
  user_id: number;
  template_id: number | null;
  resume_title: string;
  full_name: string;
  job_title: string;
  email: string;
  phone: string;
  location: string;
  summary: string | null;
  skills: string | null;
  education: string | null;
  experience: string | null;
  languages: string | null;
  hobbies: string | null;
  profile_image_url: string | null;
  primary_color: string;
  secondary_color: string;
  is_active: boolean;
};

type RecentResumesProps = {
  resumes?: Resume[];
  loading?: boolean;
};

export default function RecentResumes({
  resumes = [],
  loading = false,
}: RecentResumesProps) {
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const [openMenuId, setOpenMenuId] = useState<number | null>(null);

  useEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".resume-card",
        {
          opacity: 0,
          y: 24,
        },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          stagger: 0.12,
          ease: "power3.out",
          clearProps: "opacity,transform",
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, [resumes]);

  useEffect(() => {
    const closeMenu = () => {
      setOpenMenuId(null);
    };

    window.addEventListener("click", closeMenu);

    return () => {
      window.removeEventListener("click", closeMenu);
    };
  }, []);

  useEffect(() => {
    if (openMenuId === null) return;

    gsap.fromTo(
      `.resume-menu-${openMenuId}`,
      {
        opacity: 0,
        y: 8,
        scale: 0.96,
      },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.2,
        ease: "power2.out",
      }
    );
  }, [openMenuId]);

  return (
    <section
      ref={sectionRef}
      className="rounded-[32px] border border-white/10 bg-white/[0.06] p-6 shadow-2xl shadow-black/30 backdrop-blur-xl"
    >
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold">Recent Resumes</h2>

          <p className="mt-1 text-sm text-gray-400">
            Continue editing your latest resumes.
          </p>
        </div>

        <Link
          href="/dashboard/resumes"
          className="rounded-full bg-white px-5 py-2 text-sm font-bold text-black transition hover:bg-gray-200"
        >
          View All
        </Link>
      </div>

      {loading && (
        <div className="mt-6 flex items-center justify-center rounded-2xl border border-white/10 bg-black/20 px-6 py-12 text-gray-300">
          <Loader2 className="mr-2 animate-spin" size={20} />
          Loading resumes...
        </div>
      )}

      {!loading && resumes.length === 0 && (
        <div className="mt-6 rounded-2xl border border-dashed border-white/10 bg-black/20 px-6 py-12 text-center">
          <h3 className="text-lg font-semibold">No resumes available</h3>

          <p className="mt-2 text-sm text-gray-400">
            Create your first resume to see it here.
          </p>

          <Link
            href="/dashboard/templates"
            className="mt-5 inline-flex items-center gap-2 rounded-full bg-white px-5 py-2 text-sm font-bold text-black transition hover:bg-gray-200"
          >
            <Eye size={16} />
            Create Resume
          </Link>
        </div>
      )}

      {!loading && resumes.length > 0 && (
        <div className="mt-6 space-y-3">
          {resumes.map((resume) => (
            <div
              key={resume.id}
              className="resume-card relative flex items-center justify-between rounded-2xl border border-white/10 bg-black/20 px-4 py-4 opacity-100 transition duration-300 hover:border-cyan-300/30 hover:bg-black/30"
            >
              <div className="min-w-0">
                <h3 className="truncate font-semibold">
                  {resume.resume_title}
                </h3>

                <p className="mt-1 text-xs text-gray-400">
                  {resume.job_title}
                </p>
              </div>

              <div className="ml-4 flex items-center gap-3">
                <span className="rounded-full border border-white/10 px-3 py-1 text-xs text-cyan-300">
                  {resume.is_active ? "Active" : "Draft"}
                </span>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setOpenMenuId((prev) =>
                      prev === resume.id ? null : resume.id
                    );
                  }}
                  className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-gray-400 transition hover:bg-white/10 hover:text-white"
                >
                  <MoreVertical size={18} />
                </button>

                {openMenuId === resume.id && (
                  <div
                    onClick={(e) => e.stopPropagation()}
                    className={`resume-menu-${resume.id} absolute bottom-[58px] right-4 z-30 w-52 overflow-hidden rounded-2xl border border-white/10 bg-[#080b14] p-2 shadow-2xl shadow-black/40`}
                  >
                    <Link
                      href={`/dashboard/resumes/${resume.id}`}
                      className="flex items-center gap-3 rounded-xl px-3 py-2 text-sm text-gray-300 transition hover:bg-white/10 hover:text-white"
                    >
                      <Eye size={16} />
                      Open Resume
                    </Link>

                    <Link
                      href={`/dashboard/builder?resumeId=${resume.id}`}
                      className="flex items-center gap-3 rounded-xl px-3 py-2 text-sm text-gray-300 transition hover:bg-white/10 hover:text-white"
                    >
                      <Edit size={16} />
                      Edit Resume
                    </Link>

                    <Link
                      href={`/dashboard/resumes/${resume.id}`}
                      className="flex items-center gap-3 rounded-xl px-3 py-2 text-sm text-gray-300 transition hover:bg-white/10 hover:text-white"
                    >
                      <Download size={16} />
                      Download PDF
                    </Link>

                    <button
                      type="button"
                      className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-sm text-red-300 transition hover:bg-red-500/10"
                    >
                      <Trash2 size={16} />
                      Delete Resume
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}