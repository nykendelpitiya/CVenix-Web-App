"use client";

import Link from "next/link";
import { ArrowLeft, Download, Edit3, Save } from "lucide-react";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

import ModernResumePDF from "@/components/dashboard/pdf/ModernResumePDF";

const API_BASE = "http://localhost:8000";

type CustomSection = {
  id: number;
  title: string;
  content: string;
};

type TimelineItem = {
  id: number;
  title: string;
  organization: string;
  location: string;
  startPeriod: string;
  endPeriod: string;
  description: string;
};

type FormData = {
  fullName: string;
  title: string;
  email: string;
  phone: string;
  location: string;
  summary: string;
  skills: string;
  education: string;
  experience: string;
  languages: string;
  hobbies: string;
  linkedinUrl: string;
  githubUrl: string;
  portfolioUrl: string;
  websiteUrl: string;
  profileImageUrl: string;
  primaryColor: string;
  secondaryColor: string;
};

type PreviewData = {
  form: FormData;
  customSections: CustomSection[];
  experienceItems?: TimelineItem[];
  educationItems?: TimelineItem[];
  projectItems?: TimelineItem[];
  templateId: string | null;
  resumeId?: string | null;
  layoutKey: string;
};

type User = {
  id: number;
  full_name: string;
  email: string;
  role: string;
};

const cleanText = (value?: string | null) => (value || "").trim();

const hasTimelineContent = (item: TimelineItem) =>
  Boolean(
    cleanText(item.title) ||
      cleanText(item.organization) ||
      cleanText(item.location) ||
      cleanText(item.startPeriod) ||
      cleanText(item.endPeriod) ||
      cleanText(item.description)
  );

const getCleanTimelineItems = (items?: TimelineItem[]) => {
  if (!Array.isArray(items)) return [];

  return items
    .filter(hasTimelineContent)
    .map((item) => ({
      id: item.id,
      title: cleanText(item.title),
      organization: cleanText(item.organization),
      location: cleanText(item.location),
      startPeriod: cleanText(item.startPeriod),
      endPeriod: cleanText(item.endPeriod),
      description: cleanText(item.description),
    }));
};

const serializeTimelineItems = (items?: TimelineItem[]) => {
  const cleanItems = getCleanTimelineItems(items);
  return cleanItems.length > 0 ? JSON.stringify(cleanItems) : "";
};

const hasMeaningfulTimelineJson = (value: string) => {
  const text = cleanText(value);

  if (!text) return false;

  if (!text.startsWith("[") && !text.startsWith("{")) {
    return true;
  }

  try {
    const parsed = JSON.parse(text);
    const items = Array.isArray(parsed) ? parsed : [parsed];

    return items.some((item) =>
      Boolean(
        cleanText(item?.title) ||
          cleanText(item?.organization) ||
          cleanText(item?.location) ||
          cleanText(item?.startPeriod) ||
          cleanText(item?.endPeriod) ||
          cleanText(item?.description)
      )
    );
  } catch {
    return true;
  }
};

export default function ResumePreviewPage() {
  const searchParams = useSearchParams();

  const templateIdFromUrl = searchParams.get("templateId");
  const resumeIdFromUrl = searchParams.get("resumeId");

  const [mounted, setMounted] = useState(false);
  const [previewData, setPreviewData] = useState<PreviewData | null>(null);
  const [loggedUser, setLoggedUser] = useState<User | null>(null);

  const [saving, setSaving] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [previewLoading, setPreviewLoading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState("");

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const id = window.setTimeout(() => setMounted(true), 0);

    const storedData = sessionStorage.getItem("cvenix_generated_resume");

    if (!storedData) {
      window.setTimeout(() => setError("No generated CV found. Please build your CV again."), 0);
      return () => window.clearTimeout(id);
    }

    try {
      const parsedData = JSON.parse(storedData) as PreviewData;
      window.setTimeout(() => {
        setPreviewData(parsedData);
        setError("");
      }, 0);
    } catch {
      window.setTimeout(() => setError("Generated CV data is invalid. Please build your CV again."), 0);
    }

    return () => window.clearTimeout(id);
  }, []);

  useEffect(() => {
    const fetchLoggedUser = async () => {
      try {
        const response = await fetch(`${API_BASE}/api/auth/me`, {
          method: "GET",
          credentials: "include",
        });

        if (!response.ok) return;

        const user: User = await response.json();
        setLoggedUser(user);
      } catch {
        console.log("User load failed");
      }
    };

    fetchLoggedUser();
  }, []);

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const getCustomSectionContent = (title: string) => {
    if (!previewData) return "";

    const section = previewData.customSections.find(
      (item) => item.title.toLowerCase() === title.toLowerCase()
    );

    return section?.content || "";
  };

  const getTemplateId = () => {
    if (previewData?.templateId) return previewData.templateId;
    if (templateIdFromUrl) return templateIdFromUrl;
    return "";
  };

  const getResumeId = () => {
    if (previewData?.resumeId) return previewData.resumeId;
    if (resumeIdFromUrl) return resumeIdFromUrl;
    return "";
  };

  const cleanCustomSectionsForSave = () => {
    if (!previewData) return [];

    return previewData.customSections.filter(
      (section) => section.title.toLowerCase() !== "projects"
    );
  };

  const getProjectsContent = () => {
    const serializedProjectItems = serializeTimelineItems(previewData?.projectItems);

    if (serializedProjectItems) return serializedProjectItems;

    const sectionProjects = cleanText(getCustomSectionContent("Projects"));

    if (sectionProjects && hasMeaningfulTimelineJson(sectionProjects)) {
      return sectionProjects;
    }

    return "";
  };

  const getExperienceContent = () => {
    const experience = cleanText(previewData?.form.experience);

    if (experience && hasMeaningfulTimelineJson(experience)) {
      return experience;
    }

    return serializeTimelineItems(previewData?.experienceItems);
  };

  const getEducationContent = () => {
    const education = cleanText(previewData?.form.education);

    if (education && hasMeaningfulTimelineJson(education)) {
      return education;
    }

    return serializeTimelineItems(previewData?.educationItems);
  };

  const editHref = `/dashboard/builder?templateId=${getTemplateId()}${
    getResumeId() ? `&resumeId=${getResumeId()}` : ""
  }&editPreview=true`;

  const fileName =
    previewData?.form.fullName.trim().replaceAll(" ", "_") || "CVenix_Resume";

  const pdfDocument = previewData ? (
    <ModernResumePDF
      data={{
        ...previewData.form,
        layoutKey: previewData.layoutKey,
        customSections: previewData.customSections,
        experience: getExperienceContent(),
        education: getEducationContent(),
        projects: getProjectsContent(),
        certifications: getCustomSectionContent("Certifications"),
        achievements: getCustomSectionContent("Achievements"),
        referenceDetails: getCustomSectionContent("References"),
        reference_details: getCustomSectionContent("References"),
      }}
    />
  ) : null;

  const generatePreview = async () => {
    setMessage("");
    setError("");

    if (!previewData || !pdfDocument) {
      setError("No CV data found.");
      return;
    }

    try {
      setPreviewLoading(true);

      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
        setPreviewUrl("");
      }

      const { pdf } = await import("@react-pdf/renderer");
      const blob = await pdf(pdfDocument).toBlob();
      const blobUrl = URL.createObjectURL(blob);

      setPreviewUrl(blobUrl);
    } catch {
      setError("PDF preview failed. Please try again.");
    } finally {
      setPreviewLoading(false);
    }
  };

  useEffect(() => {
    if (!mounted || !previewData || !pdfDocument) return;

    const timer = window.setTimeout(() => {
      generatePreview();
    }, 400);

    return () => window.clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mounted, previewData, pdfDocument]);

  const handleDownloadPdf = async () => {
    setMessage("");
    setError("");

    if (!previewData || !pdfDocument) {
      setError("No CV data found.");
      return;
    }

    try {
      setDownloading(true);

      const { pdf } = await import("@react-pdf/renderer");
      const blob = await pdf(pdfDocument).toBlob();
      const blobUrl = URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = `${fileName}_Resume.pdf`;

      document.body.appendChild(link);
      link.click();
      link.remove();

      URL.revokeObjectURL(blobUrl);
    } catch {
      setError("PDF download failed. Please try again.");
    } finally {
      setDownloading(false);
    }
  };

  const handleSaveResume = async () => {
    setMessage("");
    setError("");

    if (!previewData) {
      setError("No CV data found.");
      return;
    }

    if (!loggedUser) {
      setError("Please login again before saving your resume.");
      return;
    }

    const { form } = previewData;

    if (!form.fullName || !form.title || !form.email || !form.phone) {
      setError("Please fill full name, job title, email, and phone.");
      return;
    }

    try {
      setSaving(true);

      const payload = {
        user_id: loggedUser.id,
        template_id: getTemplateId() ? Number(getTemplateId()) : 1,
        resume_title: form.title || "Untitled Resume",
        full_name: form.fullName,
        job_title: form.title,
        email: form.email,
        phone: form.phone,
        location: form.location,
        summary: form.summary,
        skills: form.skills,
        education: getEducationContent(),
        experience: getExperienceContent(),
        languages: form.languages,
        hobbies: form.hobbies,
        linkedin_url: form.linkedinUrl,
        github_url: form.githubUrl,
        portfolio_url: form.portfolioUrl,
        website_url: form.websiteUrl,
        projects: getProjectsContent(),
        certifications: getCustomSectionContent("Certifications"),
        achievements: getCustomSectionContent("Achievements"),
        reference_details: getCustomSectionContent("References"),
        custom_sections: JSON.stringify(cleanCustomSectionsForSave()),
        profile_image_url: form.profileImageUrl,
        primary_color: form.primaryColor,
        secondary_color: form.secondaryColor,
      };

      const resumeId = getResumeId();

      const response = await fetch(
        resumeId
          ? `${API_BASE}/api/resumes/${resumeId}`
          : `${API_BASE}/api/resumes/`,
        {
          method: resumeId ? "PUT" : "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(data.detail || "Resume save failed.");
        return;
      }

      setMessage(resumeId ? "Resume updated successfully." : "Resume saved successfully.");
    } catch {
      setError("Backend connection failed.");
    } finally {
      setSaving(false);
    }
  };

  if (!mounted) {
    return (
      <main className="w-full text-white">
        <div className="rounded-[30px] border border-white/10 bg-white/[0.05] p-8">
          Loading preview...
        </div>
      </main>
    );
  }

  if (error && !previewData) {
    return (
      <main className="w-full text-white">
        <div className="rounded-[30px] border border-red-400/20 bg-red-500/10 p-8 text-red-300">
          {error}

          <Link
            href="/dashboard/templates"
            className="mt-6 inline-flex rounded-full bg-white px-6 py-3 text-sm font-bold text-black"
          >
            Back to Templates
          </Link>
        </div>
      </main>
    );
  }

  if (!previewData) {
    return (
      <main className="w-full text-white">
        <div className="rounded-[30px] border border-white/10 bg-white/[0.05] p-8">
          Loading preview...
        </div>
      </main>
    );
  }

  return (
    <main className="w-full max-w-none overflow-x-hidden px-3 pb-8 text-white sm:px-4 lg:px-0">
      <Link
        href={editHref}
        className="inline-flex items-center gap-2 text-xs text-gray-400 transition hover:text-white sm:text-sm"
      >
        <ArrowLeft size={18} />
        Back to builder
      </Link>

      <div className="mt-4 rounded-[22px] border border-white/10 bg-white/[0.05] p-3 shadow-2xl shadow-black/30 backdrop-blur-xl sm:mt-6 sm:rounded-[30px] sm:p-6">
        <div className="mb-4 flex flex-col gap-4 border-b border-white/10 pb-4 sm:mb-5 sm:pb-5 xl:flex-row xl:items-center xl:justify-between">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-cyan-300 sm:text-xs sm:tracking-[0.25em]">
              CV Preview
            </p>

            <h1 className="mt-2 text-2xl font-extrabold leading-tight sm:text-3xl">
              Review Your Generated CV
            </h1>

            <p className="mt-2 max-w-2xl text-xs leading-6 text-gray-400 sm:text-sm">
              Your CV preview will load automatically after generation.
            </p>
          </div>

          <div className="grid w-full grid-cols-1 gap-3 sm:grid-cols-3 xl:w-auto">
            <Link
              href={editHref}
              className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold text-white transition hover:bg-white/10 sm:px-5"
            >
              <Edit3 size={16} />
              Edit Details
            </Link>

            <button
              onClick={handleSaveResume}
              disabled={saving}
              className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold text-white transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-60 sm:px-5"
            >
              <Save size={16} />
              {saving ? "Saving..." : "Save"}
            </button>

            <button
              type="button"
              onClick={handleDownloadPdf}
              disabled={downloading || previewLoading}
              className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-white px-4 py-3 text-sm font-bold text-black transition hover:bg-zinc-200 disabled:cursor-not-allowed disabled:opacity-60 sm:px-5"
            >
              <Download size={16} />
              {downloading ? "Preparing..." : "Download PDF"}
            </button>
          </div>
        </div>

        {message && (
          <div className="mb-4 rounded-2xl border border-green-400/20 bg-green-500/10 px-4 py-3 text-xs text-green-300 sm:mb-5 sm:px-5 sm:text-sm">
            {message}
          </div>
        )}

        {error && (
          <div className="mb-4 rounded-2xl border border-red-400/20 bg-red-500/10 px-4 py-3 text-xs text-red-300 sm:mb-5 sm:px-5 sm:text-sm">
            {error}
          </div>
        )}

        <div className="h-[620px] overflow-hidden rounded-[18px] border border-white/10 bg-white sm:h-[760px] sm:rounded-[24px] lg:h-[850px]">
          {previewLoading && !previewUrl && (
            <div className="flex h-full items-center justify-center bg-white px-4 text-center text-xs font-semibold text-black sm:text-sm">
              Loading CV preview...
            </div>
          )}

          {!previewLoading && !previewUrl && (
            <div className="flex h-full items-center justify-center bg-white px-4 text-center text-xs font-semibold text-black sm:text-sm">
              Preparing CV preview...
            </div>
          )}

          {previewUrl && (
            <iframe
              src={previewUrl}
              title="CV PDF Preview"
              className="h-full w-full border-0"
            />
          )}
        </div>
      </div>
    </main>
  );
}
