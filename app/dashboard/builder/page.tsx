"use client";

import Link from "next/link";
import { ArrowLeft, ImagePlus, Loader2, Plus, Trash2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import gsap from "gsap";

const API_BASE = "http://localhost:8000";

const EXTRA_SECTION_OPTIONS = [
  "Certifications",
  "Achievements",
  "References",
  "Portfolio Links",
  "Volunteer Experience",
  "Awards",
  "Interests",
];

type Template = {
  id: number;
  title: string;
  category: string;
  description: string;
  image_url: string;
  layout_key: string;
  primary_color: string;
  secondary_color: string;
  is_active: boolean;
};

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
  linkedin_url?: string | null;
  github_url?: string | null;
  portfolio_url?: string | null;
  website_url?: string | null;
  projects?: string | null;
  certifications?: string | null;
  achievements?: string | null;
  reference_details?: string | null;
  custom_sections?: string | null;
  profile_image_url: string | null;
  primary_color: string;
  secondary_color: string;
  is_active: boolean;
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

type AIResumeResponse = {
  summary: string;
  skills: string;
  experience: string;
  education: string;
  projects: string;
  certifications: string;
  achievements: string;
  languages: string;
  hobbies: string;
  reference_details: string;
};

let timelineIdCounter = 1000;

const createTimelineId = () => {
  timelineIdCounter += 1;
  return timelineIdCounter;
};

const emptyTimelineItem = (id = 1): TimelineItem => ({
  id,
  title: "",
  organization: "",
  location: "",
  startPeriod: "",
  endPeriod: "",
  description: "",
});

const initialForm: FormData = {
  fullName: "",
  title: "",
  email: "",
  phone: "",
  location: "",
  summary: "",
  skills: "",
  education: "",
  experience: "",
  languages: "",
  hobbies: "",
  linkedinUrl: "",
  githubUrl: "",
  portfolioUrl: "",
  websiteUrl: "",
  profileImageUrl: "",
  primaryColor: "#1f2937",
  secondaryColor: "#2563eb",
};

const isProjectSection = (section: CustomSection) =>
  section.title.trim().toLowerCase() === "projects";

const getExtraSectionsOnly = (sections: CustomSection[]) =>
  sections.filter((section) => !isProjectSection(section));

const getProjectSectionContent = (sections: CustomSection[]) =>
  getSectionContentFromList(sections, "Projects");

export default function ResumeBuilderPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const templateId = searchParams.get("templateId");
  const resumeId = searchParams.get("resumeId");
  const editPreview = searchParams.get("editPreview");

  const pageRef = useRef<HTMLDivElement | null>(null);
  const headerRef = useRef<HTMLDivElement | null>(null);
  const formCardRef = useRef<HTMLDivElement | null>(null);

  const [generatingAI, setGeneratingAI] = useState(false);
  const [saveMessage, setSaveMessage] = useState("");
  const [saveError, setSaveError] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [customSections, setCustomSections] = useState<CustomSection[]>([]);
  const [experienceItems, setExperienceItems] = useState<TimelineItem[]>([
    emptyTimelineItem(1),
  ]);
  const [educationItems, setEducationItems] = useState<TimelineItem[]>([
    emptyTimelineItem(1),
  ]);
  const [projectItems, setProjectItems] = useState<TimelineItem[]>([
    emptyTimelineItem(1),
  ]);
  const [form, setForm] = useState<FormData>(initialForm);

  const currentLayoutKey = selectedTemplate?.layout_key || "modern_sidebar";
  const isPreviewEditMode = editPreview === "true";

  useEffect(() => {
    if (editPreview !== "true") return;

    const storedData = sessionStorage.getItem("cvenix_generated_resume");
    if (!storedData) return;

    try {
      const parsedData = JSON.parse(storedData);

      requestAnimationFrame(() => {
        if (parsedData.form) {
          setForm(parsedData.form);
        }

        if (Array.isArray(parsedData.customSections)) {
          setCustomSections(getExtraSectionsOnly(parsedData.customSections));
        }

        if (Array.isArray(parsedData.experienceItems)) {
          setExperienceItems(parsedData.experienceItems);
        } else if (parsedData.form?.experience) {
          setExperienceItems(parseTimelineItems(parsedData.form.experience));
        }

        if (Array.isArray(parsedData.educationItems)) {
          setEducationItems(parsedData.educationItems);
        } else if (parsedData.form?.education) {
          setEducationItems(parseTimelineItems(parsedData.form.education));
        }

        if (Array.isArray(parsedData.projectItems)) {
          setProjectItems(parsedData.projectItems);
        } else {
          const projectContent = getProjectSectionContent(parsedData.customSections || []);

          if (projectContent) {
            setProjectItems(parseTimelineItems(projectContent));
          }
        }

        if (parsedData.selectedTemplate) {
          setSelectedTemplate(parsedData.selectedTemplate);
        }
      });
    } catch {
      console.log("Preview edit data load failed");
    }
  }, [editPreview]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(headerRef.current, {
        opacity: 0,
        y: 24,
        duration: 0.7,
        ease: "power3.out",
      });

      gsap.from(formCardRef.current, {
        opacity: 0,
        x: -40,
        duration: 0.8,
        delay: 0.15,
        ease: "power3.out",
      });

      gsap.from(".resume-field", {
        opacity: 0,
        y: 18,
        duration: 0.45,
        stagger: 0.04,
        delay: 0.35,
        ease: "power2.out",
      });
    }, pageRef);

    return () => ctx.revert();
  }, []);

  useEffect(() => {
    const fetchSelectedTemplate = async () => {
      if (!templateId) return;

      try {
        const response = await fetch(`${API_BASE}/api/templates/${templateId}`, {
          method: "GET",
          credentials: "include",
        });

        if (!response.ok) return;

        const template: Template = await response.json();
        setSelectedTemplate(template);

        if (editPreview !== "true") {
          setForm((prev) => ({
            ...prev,
            primaryColor: template.primary_color,
            secondaryColor: template.secondary_color,
          }));
        }
      } catch {
        console.log("Template load failed");
      }
    };

    fetchSelectedTemplate();
  }, [templateId, editPreview]);

  useEffect(() => {
    const fetchResume = async () => {
      if (!resumeId || editPreview === "true") return;

      try {
        const response = await fetch(`${API_BASE}/api/resumes/${resumeId}`, {
          method: "GET",
          credentials: "include",
        });

        if (!response.ok) return;

        const resume: Resume = await response.json();

        setForm({
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
          linkedinUrl: resume.linkedin_url || "",
          githubUrl: resume.github_url || "",
          portfolioUrl: resume.portfolio_url || "",
          websiteUrl: resume.website_url || "",
          profileImageUrl: resume.profile_image_url || "",
          primaryColor: resume.primary_color || "#1f2937",
          secondaryColor: resume.secondary_color || "#2563eb",
        });

        setExperienceItems(parseTimelineItems(resume.experience || ""));
        setEducationItems(parseTimelineItems(resume.education || ""));
        setProjectItems(parseTimelineItems(resume.projects || ""));

        if (resume.custom_sections) {
          try {
            const parsedSections: CustomSection[] = JSON.parse(resume.custom_sections);

            if (Array.isArray(parsedSections)) {
              setCustomSections(getExtraSectionsOnly(parsedSections));

              const projectContent = resume.projects || getProjectSectionContent(parsedSections);

              if (projectContent) {
                setProjectItems(parseTimelineItems(projectContent));
              }
            }
          } catch {
            setCustomSections([]);
          }
        } else {
          const restoredSections: CustomSection[] = [];

          if (resume.certifications) {
            restoredSections.push({
              id: Date.now() + 2,
              title: "Certifications",
              content: resume.certifications,
            });
          }

          if (resume.achievements) {
            restoredSections.push({
              id: Date.now() + 3,
              title: "Achievements",
              content: resume.achievements,
            });
          }

          if (resume.reference_details) {
            restoredSections.push({
              id: Date.now() + 4,
              title: "References",
              content: resume.reference_details,
            });
          }

          setCustomSections(restoredSections);
        }

        if (resume.template_id) {
          const templateResponse = await fetch(
            `${API_BASE}/api/templates/${resume.template_id}`,
            {
              method: "GET",
              credentials: "include",
            }
          );

          if (templateResponse.ok) {
            const template: Template = await templateResponse.json();
            setSelectedTemplate(template);
          }
        }
      } catch {
        console.log("Resume load failed");
      }
    };

    fetchResume();
  }, [resumeId, editPreview]);

  const getCustomSectionContent = (title: string) => {
    const section = customSections.find(
      (item) => item.title.toLowerCase() === title.toLowerCase()
    );

    return section?.content || "";
  };

  const upsertCustomSection = (
    sections: CustomSection[],
    title: string,
    content: string
  ) => {
    if (!content.trim()) return sections;

    const existingSection = sections.find(
      (section) => section.title.toLowerCase() === title.toLowerCase()
    );

    if (existingSection) {
      return sections.map((section) =>
        section.id === existingSection.id
          ? {
              ...section,
              content,
            }
          : section
      );
    }

    return [
      ...sections,
      {
        id: Date.now() + Math.floor(Math.random() * 10000),
        title,
        content,
      },
    ];
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleProfileImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) return;

    const reader = new FileReader();

    reader.onloadend = () => {
      setForm({
        ...form,
        profileImageUrl: reader.result as string,
      });
    };

    reader.readAsDataURL(file);
  };

  const handleTimelineChange = (
    type: "experience" | "education" | "projects",
    id: number,
    field: keyof TimelineItem,
    value: string
  ) => {
    const updateItems = (items: TimelineItem[]) =>
      items.map((item) => (item.id === id ? { ...item, [field]: value } : item));

    if (type === "experience") {
      setExperienceItems(updateItems);
    }

    if (type === "education") {
      setEducationItems(updateItems);
    }

    if (type === "projects") {
      setProjectItems(updateItems);
    }
  };

  const handleAddTimelineItem = (type: "experience" | "education" | "projects") => {
    if (type === "experience") {
      setExperienceItems((prev) => [...prev, emptyTimelineItem(createTimelineId())]);
    }

    if (type === "education") {
      setEducationItems((prev) => [...prev, emptyTimelineItem(createTimelineId())]);
    }

    if (type === "projects") {
      setProjectItems((prev) => [...prev, emptyTimelineItem(createTimelineId())]);
    }
  };

  const handleRemoveTimelineItem = (
    type: "experience" | "education" | "projects",
    id: number
  ) => {
    const removeItem = (items: TimelineItem[]) =>
      items.length > 1 ? items.filter((item) => item.id !== id) : items;

    if (type === "experience") {
      setExperienceItems(removeItem);
    }

    if (type === "education") {
      setEducationItems(removeItem);
    }

    if (type === "projects") {
      setProjectItems(removeItem);
    }
  };

  const handleAddCustomSection = () => {
    setCustomSections((prev) => [
      ...prev,
      {
        id: Date.now(),
        title: "Certifications",
        content: "",
      },
    ]);
  };

  const handleCustomSectionChange = (
    id: number,
    field: "title" | "content",
    value: string
  ) => {
    setCustomSections((prev) =>
      prev.map((section) =>
        section.id === id ? { ...section, [field]: value } : section
      )
    );
  };

  const handleRemoveCustomSection = (id: number) => {
    setCustomSections((prev) => prev.filter((section) => section.id !== id));
  };

  const handleUpdatePreview = () => {
    setSaveMessage("");
    setSaveError("");

    if (!form.fullName || !form.title) {
      setSaveError("Please fill full name and job title before updating the preview.");
      return;
    }

    const serializedExperience = serializeTimelineItems(experienceItems);
    const serializedEducation = serializeTimelineItems(educationItems);
    const serializedProjects = serializeTimelineItems(projectItems);

    const updatedForm: FormData = {
      ...form,
      experience: serializedExperience,
      education: serializedEducation,
    };

    let updatedSections = getExtraSectionsOnly(customSections);

    updatedSections = upsertCustomSection(
      updatedSections,
      "Projects",
      serializedProjects
    );

    sessionStorage.setItem(
      "cvenix_generated_resume",
      JSON.stringify({
        form: updatedForm,
        customSections: updatedSections,
        experienceItems,
        educationItems,
        projectItems,
        selectedTemplate,
        templateId,
        resumeId,
        layoutKey: currentLayoutKey,
      })
    );

    setForm(updatedForm);
    setCustomSections(getExtraSectionsOnly(updatedSections));
    setSaveMessage("Preview updated successfully. Redirecting to preview...");

    router.push(
      `/dashboard/preview?templateId=${templateId || ""}${
        resumeId ? `&resumeId=${resumeId}` : ""
      }`
    );
  };

  const handleGenerateResumeWithAI = async () => {
    setSaveMessage("");
    setSaveError("");

    if (!form.fullName || !form.title) {
      setSaveError("Please fill full name and job title before generating your resume.");
      return;
    }

    const serializedExperience = serializeTimelineItems(experienceItems);
    const serializedEducation = serializeTimelineItems(educationItems);
    const serializedProjects = serializeTimelineItems(projectItems);
    const promptExperience = timelineItemsToText(experienceItems);
    const promptEducation = timelineItemsToText(educationItems);
    const promptProjects = timelineItemsToText(projectItems);

    try {
      setGeneratingAI(true);

      const response = await fetch(`${API_BASE}/api/ai/generate-resume`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          full_name: form.fullName,
          job_title: form.title,
          email: form.email,
          phone: form.phone,
          location: form.location,
          education: promptEducation,
          skills: form.skills,
          experience: promptExperience,
          projects: promptProjects,
          certifications: getCustomSectionContent("Certifications"),
          achievements: getCustomSectionContent("Achievements"),
          languages: form.languages,
          career_goal: form.summary,
          experience_level: "Entry Level",
        }),
      });

      const data: AIResumeResponse | { detail?: string } = await response.json();

      if (!response.ok) {
        setSaveError(
          "AI resume generation failed. " +
            ("detail" in data && data.detail ? data.detail : "Please try again.")
        );
        return;
      }

      const aiData = data as AIResumeResponse;

      const generatedForm: FormData = {
        ...form,
        summary: aiData.summary || form.summary,
        skills: aiData.skills || form.skills,
        experience: serializedExperience,
        education: serializedEducation,
        languages: aiData.languages || form.languages,
        hobbies: aiData.hobbies || form.hobbies,
      };

      let generatedSections = [...customSections];

      generatedSections = upsertCustomSection(
        generatedSections,
        "Projects",
        serializedProjects
      );

      generatedSections = upsertCustomSection(
        generatedSections,
        "Certifications",
        aiData.certifications
      );

      generatedSections = upsertCustomSection(
        generatedSections,
        "Achievements",
        aiData.achievements
      );

      generatedSections = upsertCustomSection(
        generatedSections,
        "References",
        aiData.reference_details
      );

      setForm(generatedForm);
      setCustomSections(generatedSections);

      sessionStorage.setItem(
        "cvenix_generated_resume",
        JSON.stringify({
          form: generatedForm,
          customSections: generatedSections,
          experienceItems,
          educationItems,
          projectItems,
          selectedTemplate,
          templateId,
          resumeId,
          layoutKey: currentLayoutKey,
        })
      );

      setSaveMessage("Resume generated successfully. Redirecting to preview...");

      router.push(
        `/dashboard/preview?templateId=${templateId || ""}${
          resumeId ? `&resumeId=${resumeId}` : ""
        }`
      );
    } catch {
      setSaveError("AI backend connection failed.");
    } finally {
      setGeneratingAI(false);
    }
  };

  return (
    <main ref={pageRef} className="w-full max-w-none text-white">
      <section className="w-full max-w-none px-0 py-0">
        <div ref={headerRef} className="w-full max-w-none">
          <Link
            href="/dashboard/templates"
            className="inline-flex items-center gap-2 text-sm text-gray-400 transition hover:text-white"
          >
            <ArrowLeft size={18} />
            Back to templates
          </Link>

          <div className="mt-5 rounded-[32px] border border-white/10 bg-white/[0.04] p-5 shadow-2xl shadow-black/30 backdrop-blur-xl sm:p-7">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.25em] text-cyan-300">
                  Resume Builder
                </p>

                <h1 className="mt-2 text-3xl font-extrabold">
                  Fill Your Resume Details
                </h1>

                <p className="mt-3 max-w-2xl text-sm leading-6 text-gray-400">
                  {isPreviewEditMode
                    ? "Update your details and click Update Preview to review the latest CV."
                    : "Add your details first. After clicking Generate Resume, CVenix will generate your selected template and open the preview page."}
                </p>

                {selectedTemplate && (
                  <p className="mt-3 text-sm text-gray-400">
                    Selected Template:{" "}
                    <span className="font-semibold text-cyan-300">
                      {selectedTemplate.title}
                    </span>
                  </p>
                )}

                {resumeId && (
                  <p className="mt-2 text-sm text-gray-400">
                    Mode:{" "}
                    <span className="font-semibold text-cyan-300">
                      Editing Saved Resume
                    </span>
                  </p>
                )}
              </div>

              <div className="rounded-3xl border border-cyan-300/15 bg-cyan-400/10 px-5 py-4 text-sm leading-6 text-cyan-100">
                <p className="font-bold text-white">Step 1</p>
                <p className="mt-1 text-cyan-100/80">Fill details</p>
                <p className="text-cyan-100/80">
                  {isPreviewEditMode ? "Update Preview" : "Generate Resume"}
                </p>
                <p className="text-cyan-100/80">Review preview</p>
              </div>
            </div>
          </div>

          {saveMessage && (
            <div className="mt-5 rounded-2xl border border-green-400/20 bg-green-500/10 px-5 py-3 text-sm text-green-300">
              {saveMessage}
            </div>
          )}

          {saveError && (
            <div className="mt-5 rounded-2xl border border-red-400/20 bg-red-500/10 px-5 py-3 text-sm text-red-300">
              {saveError}
            </div>
          )}

          <div className="mt-8 w-full">
            <section
              ref={formCardRef}
              className="mx-auto max-w-5xl rounded-[30px] border border-white/10 bg-white/[0.05] p-4 shadow-2xl shadow-black/30 backdrop-blur-xl sm:p-6"
            >
              <div className="flex flex-col gap-3 border-b border-white/10 pb-5 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="text-xl font-bold">Resume Details</h2>

                  <p className="mt-1 text-sm text-gray-400">
                    {isPreviewEditMode
                      ? "Edit your details, then update the preview page."
                      : "Fill details, add periods, then generate your selected CV template."}
                  </p>
                </div>
              </div>

              <DynamicTemplateFields
                form={form}
                layoutKey={currentLayoutKey}
                customSections={customSections}
                experienceItems={experienceItems}
                educationItems={educationItems}
                projectItems={projectItems}
                handleChange={handleChange}
                handleProfileImageChange={handleProfileImageChange}
                handleAddCustomSection={handleAddCustomSection}
                handleCustomSectionChange={handleCustomSectionChange}
                handleRemoveCustomSection={handleRemoveCustomSection}
                handleTimelineChange={handleTimelineChange}
                handleAddTimelineItem={handleAddTimelineItem}
                handleRemoveTimelineItem={handleRemoveTimelineItem}
              />

              <div className="mt-8 flex flex-col gap-3 border-t border-white/10 pt-6 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-sm leading-6 text-gray-400">
                  {isPreviewEditMode
                    ? "When you are ready, update the preview and review the latest CV before saving or downloading."
                    : "When you are ready, generate your resume and review it on the preview page before saving or downloading."}
                </p>

                {isPreviewEditMode ? (
                  <button
                    onClick={handleUpdatePreview}
                    className="inline-flex items-center justify-center rounded-full bg-white px-8 py-3 text-sm font-bold text-black shadow-xl shadow-white/10 transition hover:scale-[1.02] hover:bg-gray-200"
                  >
                    Update Preview
                  </button>
                ) : (
                  <button
                    onClick={handleGenerateResumeWithAI}
                    disabled={generatingAI}
                    className="inline-flex items-center justify-center rounded-full bg-white px-8 py-3 text-sm font-bold text-black shadow-xl shadow-white/10 transition hover:scale-[1.02] hover:bg-gray-200 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {generatingAI ? (
                      <span className="inline-flex items-center gap-2">
                        <Loader2 size={18} className="animate-spin" />
                        Generating...
                      </span>
                    ) : (
                      "Generate Resume"
                    )}
                  </button>
                )}
              </div>
            </section>
          </div>
        </div>
      </section>
    </main>
  );
}

function DynamicTemplateFields({
  form,
  layoutKey,
  customSections,
  experienceItems,
  educationItems,
  projectItems,
  handleChange,
  handleProfileImageChange,
  handleAddCustomSection,
  handleCustomSectionChange,
  handleRemoveCustomSection,
  handleTimelineChange,
  handleAddTimelineItem,
  handleRemoveTimelineItem,
}: {
  form: FormData;
  layoutKey: string;
  customSections: CustomSection[];
  experienceItems: TimelineItem[];
  educationItems: TimelineItem[];
  projectItems: TimelineItem[];
  handleChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  handleProfileImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleAddCustomSection: () => void;
  handleCustomSectionChange: (
    id: number,
    field: "title" | "content",
    value: string
  ) => void;
  handleRemoveCustomSection: (id: number) => void;
  handleTimelineChange: (
    type: "experience" | "education" | "projects",
    id: number,
    field: keyof TimelineItem,
    value: string
  ) => void;
  handleAddTimelineItem: (type: "experience" | "education" | "projects") => void;
  handleRemoveTimelineItem: (
    type: "experience" | "education" | "projects",
    id: number
  ) => void;
}) {
  const config = getTemplateFieldConfig(layoutKey);

  return (
    <div className="mt-6 space-y-6">
      <div className="rounded-3xl border border-white/10 bg-black/10 p-5">
        <p className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-cyan-300">
          {config.personalTitle}
        </p>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="resume-field">
            <Input
              label={config.fullNameLabel}
              name="fullName"
              value={form.fullName}
              onChange={handleChange}
            />
          </div>

          <div className="resume-field">
            <Input
              label={config.jobTitleLabel}
              name="title"
              value={form.title}
              onChange={handleChange}
            />
          </div>

          <div className="resume-field">
            <Input
              label="Email"
              name="email"
              value={form.email}
              onChange={handleChange}
            />
          </div>

          <div className="resume-field">
            <Input
              label="Phone"
              name="phone"
              value={form.phone}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="resume-field mt-4">
          <Input
            label="Location"
            name="location"
            value={form.location}
            onChange={handleChange}
          />
        </div>

        <div className="resume-field mt-4">
          <ImageUpload image={form.profileImageUrl} onChange={handleProfileImageChange} />
        </div>
      </div>

      <div className="rounded-3xl border border-white/10 bg-black/10 p-5">
        <p className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-cyan-300">
          Links & Portfolio
        </p>

        <p className="mb-4 text-xs leading-5 text-gray-500">
          Add professional links that should appear in your resume header or contact area.
        </p>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="resume-field">
            <Input label="LinkedIn URL" name="linkedinUrl" value={form.linkedinUrl} onChange={handleChange} />
          </div>

          <div className="resume-field">
            <Input label="GitHub URL" name="githubUrl" value={form.githubUrl} onChange={handleChange} />
          </div>

          <div className="resume-field">
            <Input label="Portfolio URL" name="portfolioUrl" value={form.portfolioUrl} onChange={handleChange} />
          </div>

          <div className="resume-field">
            <Input label="Personal Website URL" name="websiteUrl" value={form.websiteUrl} onChange={handleChange} />
          </div>
        </div>
      </div>

      <div className="rounded-3xl border border-white/10 bg-black/10 p-5">
        <p className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-cyan-300">
          Template Colors
        </p>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="resume-field">
            <Input label="Primary Color" name="primaryColor" value={form.primaryColor} onChange={handleChange} type="color" />
          </div>

          <div className="resume-field">
            <Input label="Secondary Color" name="secondaryColor" value={form.secondaryColor} onChange={handleChange} type="color" />
          </div>
        </div>
      </div>

      <div className="rounded-3xl border border-white/10 bg-black/10 p-5">
        <p className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-cyan-300">
          {config.contentTitle}
        </p>

        {config.showSummary && (
          <div className="resume-field mt-4">
            <Textarea label={config.summaryLabel} name="summary" value={form.summary} onChange={handleChange} />
          </div>
        )}

        {config.showExperience && (
          <TimelineSection
            type="experience"
            title={config.experienceLabel}
            description="Add your work experience. Period can be year-only or month-year format. Example: 2019 - 2025, 2025 October - 2025 December, 2025 March - 2026 June."
            items={experienceItems}
            itemTitleLabel="Role / Position"
            organizationLabel="Company / Organization"
            onAdd={handleAddTimelineItem}
            onRemove={handleRemoveTimelineItem}
            onChange={handleTimelineChange}
          />
        )}

        {config.showEducation && (
          <TimelineSection
            type="education"
            title={config.educationLabel}
            description="Add your education with study period. Example: 2022 - 2026 or 2025 January - Present."
            items={educationItems}
            itemTitleLabel="Degree / Course"
            organizationLabel="Institute / University"
            onAdd={handleAddTimelineItem}
            onRemove={handleRemoveTimelineItem}
            onChange={handleTimelineChange}
          />
        )}

        <TimelineSection
          type="projects"
          title="Projects"
          description="Add your projects with time period. Example: 2025 October - 2025 December."
          items={projectItems}
          itemTitleLabel="Project Name"
          organizationLabel="Technology Stack / Client"
          onAdd={handleAddTimelineItem}
          onRemove={handleRemoveTimelineItem}
          onChange={handleTimelineChange}
        />

        {config.showSkills && (
          <div className="resume-field mt-4">
            <Textarea label={config.skillsLabel} name="skills" value={form.skills} onChange={handleChange} />
          </div>
        )}

        {config.showLanguages && (
          <div className="resume-field mt-4">
            <Textarea label={config.languagesLabel} name="languages" value={form.languages} onChange={handleChange} />
          </div>
        )}

        {config.showHobbies && (
          <div className="resume-field mt-4">
            <Textarea label={config.hobbiesLabel} name="hobbies" value={form.hobbies} onChange={handleChange} />
          </div>
        )}
      </div>

      <div className="rounded-3xl border border-white/10 bg-black/10 p-5">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-300">
              Extra Sections
            </p>

            <p className="mt-2 text-xs text-gray-500">
              Add certifications, achievements, awards, references, or portfolio links.
            </p>
          </div>

          <button
            type="button"
            onClick={handleAddCustomSection}
            className="inline-flex shrink-0 items-center gap-2 rounded-full bg-white px-4 py-2 text-xs font-bold text-black transition hover:bg-gray-200"
          >
            <Plus size={15} />
            Add
          </button>
        </div>

        <div className="mt-5 space-y-5">
          {customSections.length === 0 && (
            <div className="rounded-2xl border border-dashed border-white/10 bg-white/[0.03] p-5 text-center text-sm text-gray-500">
              No extra sections added yet.
            </div>
          )}

          {customSections.map((section) => (
            <div key={section.id} className="resume-field rounded-2xl border border-white/10 bg-black/20 p-4">
              <div className="flex items-center gap-3">
                <select
                  value={section.title}
                  onChange={(e) => handleCustomSectionChange(section.id, "title", e.target.value)}
                  className="h-11 flex-1 rounded-xl border border-white/10 bg-[#080b14] px-3 text-sm text-white outline-none focus:border-cyan-300/50"
                >
                  {EXTRA_SECTION_OPTIONS.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>

                <button
                  type="button"
                  onClick={() => handleRemoveCustomSection(section.id)}
                  className="flex h-11 w-11 items-center justify-center rounded-xl border border-red-400/20 bg-red-500/10 text-red-300 transition hover:bg-red-500/20"
                >
                  <Trash2 size={17} />
                </button>
              </div>

              <textarea
                value={section.content}
                onChange={(e) => handleCustomSectionChange(section.id, "content", e.target.value)}
                rows={4}
                placeholder={`Add ${section.title.toLowerCase()} details here...`}
                className="mt-4 w-full resize-none rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white outline-none transition placeholder:text-gray-600 focus:border-cyan-300/50"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function TimelineSection({
  type,
  title,
  description,
  items,
  itemTitleLabel,
  organizationLabel,
  onAdd,
  onRemove,
  onChange,
}: {
  type: "experience" | "education" | "projects";
  title: string;
  description: string;
  items: TimelineItem[];
  itemTitleLabel: string;
  organizationLabel: string;
  onAdd: (type: "experience" | "education" | "projects") => void;
  onRemove: (type: "experience" | "education" | "projects", id: number) => void;
  onChange: (
    type: "experience" | "education" | "projects",
    id: number,
    field: keyof TimelineItem,
    value: string
  ) => void;
}) {
  return (
    <div className="resume-field mt-5 rounded-3xl border border-white/10 bg-white/[0.03] p-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h3 className="text-sm font-bold text-white">{title}</h3>
          <p className="mt-1 text-xs leading-5 text-gray-500">{description}</p>
        </div>

        <button
          type="button"
          onClick={() => onAdd(type)}
          className="inline-flex shrink-0 items-center justify-center gap-2 rounded-full bg-white px-4 py-2 text-xs font-bold text-black transition hover:bg-gray-200"
        >
          <Plus size={14} />
          Add
        </button>
      </div>

      <div className="mt-5 space-y-5">
        {items.map((item, index) => (
          <div key={item.id} className="rounded-2xl border border-white/10 bg-black/20 p-4">
            <div className="mb-4 flex items-center justify-between gap-3">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-300">
                Item {index + 1}
              </p>

              <button
                type="button"
                onClick={() => onRemove(type, item.id)}
                disabled={items.length === 1}
                className="flex h-9 w-9 items-center justify-center rounded-xl border border-red-400/20 bg-red-500/10 text-red-300 transition hover:bg-red-500/20 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <Trash2 size={15} />
              </button>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <Input
                label={itemTitleLabel}
                name={`title-${item.id}`}
                value={item.title}
                onChange={(e) => onChange(type, item.id, "title", e.target.value)}
              />

              <Input
                label={organizationLabel}
                name={`organization-${item.id}`}
                value={item.organization}
                onChange={(e) => onChange(type, item.id, "organization", e.target.value)}
              />

              <Input
                label="Location"
                name={`location-${item.id}`}
                value={item.location}
                onChange={(e) => onChange(type, item.id, "location", e.target.value)}
              />

              <div className="grid gap-3 sm:grid-cols-2">
                <Input
                  label="Start Period"
                  name={`start-${item.id}`}
                  value={item.startPeriod}
                  onChange={(e) => onChange(type, item.id, "startPeriod", e.target.value)}
                />

                <Input
                  label="End Period"
                  name={`end-${item.id}`}
                  value={item.endPeriod}
                  onChange={(e) => onChange(type, item.id, "endPeriod", e.target.value)}
                />
              </div>
            </div>

            <div className="mt-4">
              <Textarea
                label="Description"
                name={`description-${item.id}`}
                value={item.description}
                onChange={(e) => onChange(type, item.id, "description", e.target.value)}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function getTemplateFieldConfig(layoutKey: string) {
  if (layoutKey === "blue_designer_sidebar") {
    return {
      personalTitle: "Designer Sidebar Details",
      contentTitle: "Designer CV Sections",
      fullNameLabel: "Full Name",
      jobTitleLabel: "Professional Title",
      summaryLabel: "Profile",
      experienceLabel: "Work Experience",
      educationLabel: "Education",
      skillsLabel: "Expertise / Skills",
      languagesLabel: "Languages",
      hobbiesLabel: "Hobbies",
      showSummary: true,
      showExperience: true,
      showEducation: true,
      showSkills: true,
      showLanguages: true,
      showHobbies: false,
    };
  }

  if (layoutKey === "gold_executive") {
    return {
      personalTitle: "Executive Header Details",
      contentTitle: "Executive CV Sections",
      fullNameLabel: "Executive Name",
      jobTitleLabel: "Executive Job Title",
      summaryLabel: "Profile",
      experienceLabel: "Experience",
      educationLabel: "Education",
      skillsLabel: "Skills",
      languagesLabel: "Languages",
      hobbiesLabel: "Hobbies",
      showSummary: true,
      showExperience: true,
      showEducation: true,
      showSkills: true,
      showLanguages: true,
      showHobbies: true,
    };
  }

  if (layoutKey === "green_professional") {
    return {
      personalTitle: "Professional Details",
      contentTitle: "Professional CV Sections",
      fullNameLabel: "Full Name",
      jobTitleLabel: "Professional Role",
      summaryLabel: "Professional Summary",
      experienceLabel: "Employment",
      educationLabel: "Education",
      skillsLabel: "Technical Skills",
      languagesLabel: "Languages",
      hobbiesLabel: "Hobbies",
      showSummary: true,
      showExperience: true,
      showEducation: true,
      showSkills: true,
      showLanguages: true,
      showHobbies: false,
    };
  }

  if (layoutKey === "yellow_creative") {
    return {
      personalTitle: "Creative Header Details",
      contentTitle: "Creative CV Sections",
      fullNameLabel: "Creative Name",
      jobTitleLabel: "Creative Job Title",
      summaryLabel: "About Me",
      experienceLabel: "Job Experience",
      educationLabel: "Education",
      skillsLabel: "Skills",
      languagesLabel: "Languages",
      hobbiesLabel: "References / Extra Details",
      showSummary: true,
      showExperience: true,
      showEducation: true,
      showSkills: true,
      showLanguages: false,
      showHobbies: true,
    };
  }

  if (layoutKey === "dark_portfolio") {
    return {
      personalTitle: "Portfolio Header Details",
      contentTitle: "Portfolio CV Sections",
      fullNameLabel: "Portfolio Name",
      jobTitleLabel: "Portfolio Job Title",
      summaryLabel: "Profile",
      experienceLabel: "Experience",
      educationLabel: "Education",
      skillsLabel: "Skills",
      languagesLabel: "Languages",
      hobbiesLabel: "Interests",
      showSummary: true,
      showExperience: true,
      showEducation: true,
      showSkills: true,
      showLanguages: false,
      showHobbies: true,
    };
  }

  if (layoutKey === "creative_designer") {
    return {
      personalTitle: "Designer Details",
      contentTitle: "Designer CV Sections",
      fullNameLabel: "Designer Name",
      jobTitleLabel: "Design Role",
      summaryLabel: "Profile",
      experienceLabel: "Projects / Experience",
      educationLabel: "Education",
      skillsLabel: "Design Skills",
      languagesLabel: "Languages",
      hobbiesLabel: "Creative Interests",
      showSummary: true,
      showExperience: true,
      showEducation: false,
      showSkills: true,
      showLanguages: false,
      showHobbies: false,
    };
  }

  if (layoutKey === "corporate_blue") {
    return {
      personalTitle: "Corporate Header Details",
      contentTitle: "Corporate CV Sections",
      fullNameLabel: "Full Name",
      jobTitleLabel: "Corporate Role",
      summaryLabel: "Profile",
      experienceLabel: "Work Experience",
      educationLabel: "Education",
      skillsLabel: "Skills",
      languagesLabel: "Languages",
      hobbiesLabel: "Hobbies",
      showSummary: true,
      showExperience: true,
      showEducation: true,
      showSkills: true,
      showLanguages: false,
      showHobbies: false,
    };
  }

  if (layoutKey === "minimal_clean") {
    return {
      personalTitle: "Basic Details",
      contentTitle: "Minimal CV Sections",
      fullNameLabel: "Full Name",
      jobTitleLabel: "Professional Title",
      summaryLabel: "Profile",
      experienceLabel: "Experience",
      educationLabel: "Education",
      skillsLabel: "Skills",
      languagesLabel: "Languages",
      hobbiesLabel: "Hobbies",
      showSummary: true,
      showExperience: true,
      showEducation: true,
      showSkills: true,
      showLanguages: false,
      showHobbies: false,
    };
  }

  return {
    personalTitle: "Personal Details",
    contentTitle: "Sidebar CV Sections",
    fullNameLabel: "Full Name",
    jobTitleLabel: "Job Title",
    summaryLabel: "Profile",
    experienceLabel: "Work Experience",
    educationLabel: "Education",
    skillsLabel: "Skills",
    languagesLabel: "Languages",
    hobbiesLabel: "Hobbies",
    showSummary: true,
    showExperience: true,
    showEducation: true,
    showSkills: true,
    showLanguages: true,
    showHobbies: true,
  };
}

function ImageUpload({
  image,
  onChange,
}: {
  image: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  return (
    <label className="block">
      <span className="text-sm font-medium text-gray-300">Profile Photo</span>

      <div className="mt-2 flex items-center gap-4 rounded-2xl border border-white/10 bg-black/20 p-4">
        <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-full bg-white/10">
          {image ? (
            <Image src={image} alt="Selected profile" width={64} height={64} className="h-full w-full object-cover" unoptimized />
          ) : (
            <ImagePlus size={24} className="text-gray-400" />
          )}
        </div>

        <div className="min-w-0 flex-1">
          <input
            type="file"
            accept="image/*"
            onChange={onChange}
            className="block w-full text-sm text-gray-300 file:mr-4 file:rounded-full file:border-0 file:bg-white file:px-4 file:py-2 file:text-sm file:font-bold file:text-black hover:file:bg-gray-200"
          />

          <p className="mt-2 text-xs leading-5 text-gray-500">
            Select a JPG, PNG, or WEBP image from your computer.
          </p>
        </div>
      </div>
    </label>
  );
}

function Input({
  label,
  name,
  value,
  onChange,
  type = "text",
}: {
  label: string;
  name: string;
  value: string;
  type?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  return (
    <label className="block">
      <span className="text-sm font-medium text-gray-300">{label}</span>

      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={
          label.includes("Period")
            ? "Ex: 2025 March - 2026 June"
            : undefined
        }
        className="mt-2 h-12 w-full rounded-2xl border border-white/10 bg-black/20 px-4 text-sm text-white outline-none transition focus:border-cyan-300/50"
      />
    </label>
  );
}

function Textarea({
  label,
  name,
  value,
  onChange,
}: {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}) {
  return (
    <label className="block">
      <span className="text-sm font-medium text-gray-300">{label}</span>

      <textarea
        name={name}
        value={value}
        onChange={onChange}
        rows={4}
        className="mt-2 w-full resize-none rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white outline-none transition focus:border-cyan-300/50"
      />
    </label>
  );
}

function getSectionContentFromList(sections: CustomSection[], title: string) {
  const section = sections.find(
    (item) => item.title.toLowerCase() === title.toLowerCase()
  );

  return section?.content || "";
}

function serializeTimelineItems(items: TimelineItem[]) {
  const cleanItems = items.filter(
    (item) =>
      item.title.trim() ||
      item.organization.trim() ||
      item.location.trim() ||
      item.startPeriod.trim() ||
      item.endPeriod.trim() ||
      item.description.trim()
  );

  return JSON.stringify(cleanItems.length ? cleanItems : items);
}

function parseTimelineItems(value: string): TimelineItem[] {
  if (!value.trim()) return [emptyTimelineItem(1)];

  try {
    const parsed = JSON.parse(value);

    if (Array.isArray(parsed)) {
      const items = parsed.map((item) => ({
        id: Number(item.id) || createTimelineId(),
        title: String(item.title || ""),
        organization: String(item.organization || ""),
        location: String(item.location || ""),
        startPeriod: String(item.startPeriod || ""),
        endPeriod: String(item.endPeriod || ""),
        description: String(item.description || ""),
      }));

      return items.length ? items : [emptyTimelineItem(1)];
    }
  } catch {
    return [
      {
        ...emptyTimelineItem(1),
        description: value,
      },
    ];
  }

  return [emptyTimelineItem(1)];
}

function timelineItemsToText(items: TimelineItem[]) {
  return items
    .filter(
      (item) =>
        item.title.trim() ||
        item.organization.trim() ||
        item.location.trim() ||
        item.startPeriod.trim() ||
        item.endPeriod.trim() ||
        item.description.trim()
    )
    .map((item, index) => {
      const period = [item.startPeriod, item.endPeriod].filter(Boolean).join(" - ");
      const organizationLine = [item.organization, item.location]
        .filter(Boolean)
        .join(" | ");

      return [
        `${index + 1}. ${item.title || "Untitled"}${period ? ` (${period})` : ""}`,
        organizationLine,
        item.description,
      ]
        .filter(Boolean)
        .join("\n");
    })
    .join("\n\n");
}
