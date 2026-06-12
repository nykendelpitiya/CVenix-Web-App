"use client";

import Link from "next/link";
import { Eye, FileText, Loader2, Plus, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";

const API_BASE = "http://127.0.0.1:8000";

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

export default function MyResumesPage() {
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchResumes = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(`${API_BASE}/api/resumes/`);

      if (!response.ok) {
        setError("Failed to load resumes.");
        return;
      }

      const data: Resume[] = await response.json();

      setResumes(data);
    } catch {
      setError("Backend connection failed.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResumes();
  }, []);

  const handleDeleteResume = async (resumeId: number) => {
    const confirmDelete = confirm("Are you sure you want to delete this resume?");

    if (!confirmDelete) return;

    try {
      const response = await fetch(`${API_BASE}/api/resumes/${resumeId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        alert("Resume delete failed.");
        return;
      }

      setResumes((prev) => prev.filter((resume) => resume.id !== resumeId));
    } catch {
      alert("Backend connection failed.");
    }
  };

  return (
    <div className="rounded-[32px] border border-white/10 bg-white/[0.04] p-5 shadow-2xl shadow-black/30 backdrop-blur-xl sm:p-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-cyan-300">
            My Resumes
          </p>

          <h1 className="mt-3 text-3xl font-extrabold sm:text-4xl">
            Your Saved Resumes
          </h1>

          <p className="mt-4 max-w-2xl text-sm leading-7 text-gray-400">
            View, manage, and continue editing your saved resumes.
          </p>
        </div>

        <Link
          href="/dashboard/templates"
          className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-bold text-black transition hover:bg-gray-200"
        >
          <Plus size={18} />
          Create Resume
        </Link>
      </div>

      {loading && (
        <div className="mt-8 flex items-center justify-center rounded-[28px] border border-white/10 bg-black/20 px-6 py-16 text-gray-300">
          <Loader2 className="mr-2 animate-spin" size={22} />
          Loading resumes...
        </div>
      )}

      {error && !loading && (
        <div className="mt-8 rounded-[28px] border border-red-400/20 bg-red-500/10 px-6 py-5 text-sm text-red-300">
          {error}
        </div>
      )}

      {!loading && !error && resumes.length === 0 && (
        <div className="mt-8 flex flex-col items-center justify-center rounded-[28px] border border-dashed border-white/15 bg-black/20 px-6 py-16 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white text-black">
            <FileText size={30} />
          </div>

          <h2 className="mt-5 text-2xl font-bold">No resumes saved yet</h2>

          <p className="mt-2 max-w-md text-sm leading-6 text-gray-400">
            Create your first resume by choosing a template and filling your
            details.
          </p>

          <Link
            href="/dashboard/templates"
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-bold text-black transition hover:bg-gray-200"
          >
            <Plus size={18} />
            Create Resume
          </Link>
        </div>
      )}

      {!loading && !error && resumes.length > 0 && (
        <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {resumes.map((resume) => (
            <div
              key={resume.id}
              className="rounded-[28px] border border-white/10 bg-[#070b16] p-6 shadow-2xl shadow-black/20 transition hover:border-cyan-400/30"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-black">
                  <FileText size={24} />
                </div>

                <span className="rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1 text-xs font-semibold text-cyan-300">
                  Saved
                </span>
              </div>

              <h2 className="mt-5 line-clamp-1 text-xl font-bold">
                {resume.resume_title}
              </h2>

              <p className="mt-2 text-sm font-medium text-cyan-300">
                {resume.job_title}
              </p>

              <p className="mt-3 line-clamp-2 text-sm leading-6 text-gray-400">
                {resume.summary || "No professional summary added."}
              </p>

              <div className="mt-5 border-t border-white/10 pt-4 text-xs text-gray-500">
                <p>{resume.full_name}</p>
                <p className="mt-1">{resume.email}</p>
              </div>

              <div className="mt-5 flex gap-3">
                <Link
                  href={`/dashboard/resumes/${resume.id}`}
                  className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-white px-4 py-3 text-sm font-bold text-black transition hover:bg-gray-200"
                >
                  <Eye size={16} />
                  Open
                </Link>

                <button
                  onClick={() => handleDeleteResume(resume.id)}
                  className="flex h-12 w-12 items-center justify-center rounded-2xl border border-red-400/20 bg-red-500/10 text-red-300 transition hover:bg-red-500/20"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}