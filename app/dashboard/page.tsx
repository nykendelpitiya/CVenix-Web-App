"use client";

import { useEffect, useState } from "react";

import DashboardHero from "@/components/dashboard/DashboardHero";
import StatsCards from "@/components/dashboard/StatsCards";
import RecentResumes from "@/components/dashboard/RecentResumes";
import DashboardCharts from "@/components/dashboard/DashboardCharts";

const API_BASE = "http://localhost:8000";

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

export default function DashboardPage() {
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);

        const [resumesResponse, templatesResponse] = await Promise.all([
          fetch(`${API_BASE}/api/resumes/`, {
            credentials: "include",
          }),
          fetch(`${API_BASE}/api/templates/`, {
            credentials: "include",
          }),
        ]);

        if (resumesResponse.ok) {
          const resumesData: Resume[] = await resumesResponse.json();
          setResumes(resumesData);
        }

        if (templatesResponse.ok) {
          const templatesData: Template[] = await templatesResponse.json();
          setTemplates(templatesData);
        }
      } catch {
        setResumes([]);
        setTemplates([]);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <div className="space-y-8">
      <DashboardHero />

      <StatsCards
        totalResumes={resumes.length}
        totalTemplates={templates.length}
        completedResumes={resumes.filter((resume) => resume.is_active).length}
        loading={loading}
      />

      <DashboardCharts
        resumes={resumes}
        templates={templates}
        loading={loading}
      />

      <RecentResumes resumes={resumes.slice(0, 3)} loading={loading} />
    </div>
  );
}