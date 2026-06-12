"use client";

import Link from "next/link";
import dynamic from "next/dynamic";
import { ArrowLeft, Download, Edit, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import DashboardTopBar from "@/components/dashboard/DashboardTopBar";
import ModernResumePDF from "@/components/dashboard/pdf/ModernResumePDF";

const API_BASE = "http://127.0.0.1:8000";

const PDFViewer = dynamic(
  () => import("@react-pdf/renderer").then((mod) => mod.PDFViewer),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-[720px] items-center justify-center rounded-[28px] border border-white/10 bg-black/20 text-gray-300">
        <Loader2 className="mr-2 animate-spin" size={22} />
        Loading PDF preview...
      </div>
    ),
  }
);

const PDFDownloadLink = dynamic(
  () => import("@react-pdf/renderer").then((mod) => mod.PDFDownloadLink),
  {
    ssr: false,
  }
);

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

export default function SavedResumePreviewPage() {
  const params = useParams();
  const resumeId = params.id as string;

  const [resume, setResume] = useState<Resume | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchResume = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(`${API_BASE}/api/resumes/${resumeId}`);

        if (!response.ok) {
          setError("Failed to load resume.");
          return;
        }

        const data: Resume = await response.json();
        setResume(data);
      } catch {
        setError("Backend connection failed.");
      } finally {
        setLoading(false);
      }
    };

    fetchResume();
  }, [resumeId]);

  const pdfData = resume
    ? {
        fullName: resume.full_name || "",
        title: resume.job_title || "",
        email: resume.email || "",
        phone: resume.phone || "",
        location: resume.location || "",
        summary: resume.summary || "",
        skills: resume.skills || "",
        education: resume.education || "",
        experience: resume.experience || "",
        languages: resume.languages || "",
        hobbies: resume.hobbies || "",
        profileImageUrl: resume.profile_image_url || "",
        primaryColor: resume.primary_color || "#1f2937",
        secondaryColor: resume.secondary_color || "#2563eb",
        layoutKey: "modern_sidebar",
      }
    : null;

  const fileName =
    resume?.full_name?.trim().replaceAll(" ", "_") || "CVenix_Resume";

  return (
    <main className="min-h-screen bg-[#02030a] text-white">
      <div className="flex">
        <DashboardSidebar />

        <section className="min-h-screen flex-1 px-4 py-5 lg:ml-72 lg:px-8">
          <DashboardTopBar />

          <div className="mt-8">
            <Link
              href="/dashboard/resumes"
              className="inline-flex items-center gap-2 text-sm text-gray-400 transition hover:text-white"
            >
              <ArrowLeft size={18} />
              Back to My Resumes
            </Link>

            <div className="mt-5 rounded-[32px] border border-white/10 bg-white/[0.04] p-8 shadow-2xl shadow-black/30 backdrop-blur-xl">
              {loading && (
                <div className="flex items-center justify-center rounded-[28px] border border-white/10 bg-black/20 px-6 py-16 text-gray-300">
                  <Loader2 className="mr-2 animate-spin" size={22} />
                  Loading resume...
                </div>
              )}

              {error && !loading && (
                <div className="rounded-[28px] border border-red-400/20 bg-red-500/10 px-6 py-5 text-sm text-red-300">
                  {error}
                </div>
              )}

              {!loading && !error && resume && pdfData && (
                <>
                  <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.25em] text-cyan-300">
                        Resume Preview
                      </p>

                      <h1 className="mt-3 text-4xl font-extrabold">
                        {resume.resume_title}
                      </h1>

                      <p className="mt-3 text-sm text-gray-400">
                        Preview your saved resume and download it as a PDF.
                      </p>
                    </div>

                    <div className="flex flex-col gap-3 sm:flex-row">
                      <Link
                        href={`/dashboard/builder?resumeId=${resume.id}`}
                        className="inline-flex items-center justify-center gap-2 rounded-full border border-white/10 bg-white/5 px-6 py-3 text-sm font-bold text-white transition hover:bg-white/10"
                      >
                        <Edit size={18} />
                        Edit Resume
                      </Link>

                      <PDFDownloadLink
                        document={<ModernResumePDF data={pdfData} />}
                        fileName={`${fileName}_Resume.pdf`}
                        className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-bold text-black transition hover:bg-gray-200"
                      >
                        {({ loading }) => (
                          <>
                            <Download size={18} />
                            {loading ? "Preparing PDF..." : "Download PDF"}
                          </>
                        )}
                      </PDFDownloadLink>
                    </div>
                  </div>

                  <div className="mt-8 overflow-hidden rounded-[28px] border border-white/10 bg-black/20">
                    <PDFViewer className="h-[720px] w-full">
                      <ModernResumePDF data={pdfData} />
                    </PDFViewer>
                  </div>
                </>
              )}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}