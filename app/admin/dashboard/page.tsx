"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { FileText, LayoutTemplate, Plus, Users } from "lucide-react";

import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminTopBar from "@/components/admin/AdminTopBar";

const API_BASE = "http://localhost:8000";

type AdminStats = {
  total_users: number;
  total_resumes: number;
  total_templates: number;
};

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<AdminStats>({
    total_users: 0,
    total_resumes: 0,
    total_templates: 0,
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAdminStats = async () => {
      try {
        setLoading(true);

        const response = await fetch(`${API_BASE}/api/admin/stats`, {
          method: "GET",
          credentials: "include",
        });

        if (!response.ok) {
          return;
        }

        const data: AdminStats = await response.json();

        setStats(data);
      } catch {
        setStats({
          total_users: 0,
          total_resumes: 0,
          total_templates: 0,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchAdminStats();
  }, []);

  return (
    <main className="min-h-screen bg-[#02030a] text-white">
      <div className="flex">
        <AdminSidebar />

        <section className="min-h-screen flex-1 px-4 py-5 lg:ml-72 lg:px-8">
          <AdminTopBar />

          <div className="mt-8">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-cyan-300">
              Admin Dashboard
            </p>

            <h1 className="mt-3 text-4xl font-extrabold">
              CVenix Management
            </h1>

            <div className="mt-8 grid gap-5 md:grid-cols-3">
              <AdminCard
                title="Total Users"
                value={loading ? "--" : String(stats.total_users).padStart(2, "0")}
                icon={Users}
              />

              <AdminCard
                title="Total Resumes"
                value={loading ? "--" : String(stats.total_resumes).padStart(2, "0")}
                icon={FileText}
              />

              <AdminCard
                title="Templates"
                value={loading ? "--" : String(stats.total_templates).padStart(2, "0")}
                icon={LayoutTemplate}
              />
            </div>

            <div className="mt-8 rounded-[32px] border border-white/10 bg-white/[0.05] p-6 shadow-2xl shadow-black/30 backdrop-blur-xl">
              <h2 className="text-2xl font-bold">Template Management</h2>

              <p className="mt-2 text-sm text-gray-400">
                Add, update, and manage CV templates for users.
              </p>

              <Link
                href="/admin/templates/create"
                className="mt-6 inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-bold text-black hover:bg-gray-200"
              >
                <Plus size={18} />
                Add New Template
              </Link>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

function AdminCard({
  title,
  value,
  icon: Icon,
}: {
  title: string;
  value: string;
  icon: React.ElementType;
}) {
  return (
    <div className="rounded-[28px] border border-white/10 bg-white/[0.06] p-6 shadow-xl shadow-black/20 backdrop-blur-xl">
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-black">
        <Icon size={22} />
      </div>

      <h3 className="mt-5 text-3xl font-extrabold">{value}</h3>
      <p className="mt-1 text-sm text-gray-400">{title}</p>
    </div>
  );
}