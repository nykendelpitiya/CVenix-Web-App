"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Edit, LayoutTemplate, Plus, Trash2 } from "lucide-react";

import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminTopBar from "@/components/admin/AdminTopBar";

const API_BASE = "http://localhost:8000";

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

export default function AdminTemplatesPage() {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchTemplates = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(`${API_BASE}/api/templates/`, {
        method: "GET",
        credentials: "include",
      });

      if (!response.ok) {
        setError("Failed to load templates.");
        return;
      }

      const data: Template[] = await response.json();

      setTemplates(data);
    } catch {
      setError("Backend connection failed.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTemplates();
  }, []);

  const handleDeleteTemplate = async (templateId: number) => {
    const confirmDelete = confirm(
      "Are you sure you want to delete this template?"
    );

    if (!confirmDelete) return;

    try {
      const response = await fetch(
        `${API_BASE}/api/templates/${templateId}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );

      if (!response.ok) {
        alert("Template delete failed.");
        return;
      }

      setTemplates((prev) =>
        prev.filter((template) => template.id !== templateId)
      );
    } catch {
      alert("Backend connection failed.");
    }
  };

  return (
    <main className="min-h-screen bg-[#02030a] text-white">
      <div className="flex">
        <AdminSidebar />

        <section className="flex-1 px-4 py-5 lg:ml-72 lg:px-8">
          <AdminTopBar />

          <div className="mt-8">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.25em] text-cyan-300">
                  Template Management
                </p>

                <h1 className="mt-3 text-3xl font-extrabold">
                  Templates
                </h1>

                <p className="mt-2 text-gray-400">
                  Manage all resume templates.
                </p>
              </div>

              <Link
                href="/admin/templates/create"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-bold text-black transition hover:bg-gray-200"
              >
                <Plus size={18} />
                Add Template
              </Link>
            </div>

            {loading && (
              <div className="mt-8 rounded-3xl border border-white/10 bg-white/[0.05] p-8 text-gray-400">
                Loading templates...
              </div>
            )}

            {error && !loading && (
              <div className="mt-8 rounded-3xl border border-red-400/20 bg-red-500/10 p-8 text-red-300">
                {error}
              </div>
            )}

            {!loading && !error && templates.length === 0 && (
              <div className="mt-8 rounded-3xl border border-dashed border-white/10 bg-white/[0.05] p-10 text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-white text-black">
                  <LayoutTemplate size={30} />
                </div>

                <h2 className="mt-5 text-xl font-bold">
                  No templates available
                </h2>

                <p className="mt-2 text-sm text-gray-400">
                  Add your first template from the admin panel.
                </p>

                <Link
                  href="/admin/templates/create"
                  className="mt-6 inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-bold text-black transition hover:bg-gray-200"
                >
                  <Plus size={18} />
                  Add Template
                </Link>
              </div>
            )}

            {!loading && !error && templates.length > 0 && (
              <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                {templates.map((template) => (
                  <div
                    key={template.id}
                    className="overflow-hidden rounded-[28px] border border-white/10 bg-white/[0.05] shadow-2xl shadow-black/20 backdrop-blur-xl transition hover:border-cyan-300/30"
                  >
                    <div className="relative h-44 overflow-hidden bg-black/30">
                      {template.image_url ? (
                        <img
                          src={template.image_url}
                          alt={template.title}
                          className="h-full w-full object-cover transition duration-500 hover:scale-105"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center text-gray-500">
                          No Image
                        </div>
                      )}

                      <span className="absolute left-4 top-4 rounded-full border border-cyan-300/20 bg-black/60 px-3 py-1 text-xs font-semibold text-cyan-300 backdrop-blur-xl">
                        {template.category}
                      </span>
                    </div>

                    <div className="p-5">
                      <h2 className="line-clamp-1 text-lg font-bold">
                        {template.title}
                      </h2>

                      <p className="mt-2 line-clamp-2 text-sm leading-6 text-gray-400">
                        {template.description}
                      </p>

                      <div className="mt-4 rounded-2xl border border-white/10 bg-black/20 p-3 text-xs text-gray-400">
                        <p>
                          Layout:{" "}
                          <span className="text-white">
                            {template.layout_key}
                          </span>
                        </p>

                        <div className="mt-3 flex items-center gap-3">
                          <span>Colors:</span>

                          <span
                            className="h-5 w-5 rounded-full border border-white/20"
                            style={{
                              backgroundColor: template.primary_color,
                            }}
                          />

                          <span
                            className="h-5 w-5 rounded-full border border-white/20"
                            style={{
                              backgroundColor: template.secondary_color,
                            }}
                          />
                        </div>
                      </div>

                      <div className="mt-5 flex gap-3">
                        <Link
                          href={`/admin/templates/${template.id}/edit`}
                          className="flex flex-1 items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-bold text-white transition hover:bg-white/10"
                        >
                          <Edit size={16} />
                          Edit
                        </Link>

                        <button
                          onClick={() =>
                            handleDeleteTemplate(template.id)
                          }
                          className="flex h-12 w-12 items-center justify-center rounded-2xl border border-red-400/20 bg-red-500/10 text-red-300 transition hover:bg-red-500/20"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}