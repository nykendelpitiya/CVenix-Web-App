"use client";

import { ImagePlus } from "lucide-react";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminTopBar from "@/components/admin/AdminTopBar";

const API_BASE = "http://localhost:8000";

const layoutOptions = [
  "modern_sidebar",
  "minimal_clean",
  "corporate_blue",
  "creative_designer",
  "gold_executive",
  "green_professional",
  "yellow_creative",
  "dark_portfolio",
  "blue_designer_sidebar",
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

export default function EditTemplatePage() {
  const params = useParams();
  const router = useRouter();

  const templateId = params.id as string;

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [layoutKey, setLayoutKey] = useState("modern_sidebar");
  const [primaryColor, setPrimaryColor] = useState("#111827");
  const [secondaryColor, setSecondaryColor] = useState("#2563eb");
  const [description, setDescription] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchTemplate = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          `${API_BASE}/api/templates/${templateId}`,
          {
            method: "GET",
            credentials: "include",
          }
        );

        if (!response.ok) {
          setError("Failed to load template.");
          return;
        }

        const data: Template = await response.json();

        setTitle(data.title);
        setCategory(data.category);
        setImageUrl(data.image_url);
        setLayoutKey(data.layout_key);
        setPrimaryColor(data.primary_color);
        setSecondaryColor(data.secondary_color);
        setDescription(data.description);
      } catch {
        setError("Backend connection failed.");
      } finally {
        setLoading(false);
      }
    };

    fetchTemplate();
  }, [templateId]);

  const handleTemplateImageChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];

    if (!file) return;

    const validTypes = ["image/jpeg", "image/png", "image/webp"];

    if (!validTypes.includes(file.type)) {
      setError("Please select a JPG, PNG, or WEBP image.");
      return;
    }

    const reader = new FileReader();

    reader.onloadend = () => {
      setImageUrl(reader.result as string);
      setError("");
    };

    reader.readAsDataURL(file);
  };

  const handleUpdateTemplate = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    setMessage("");
    setError("");

    if (!title || !category || !imageUrl || !description) {
      setError("Please fill all required fields.");
      return;
    }

    try {
      setSaving(true);

      const response = await fetch(
        `${API_BASE}/api/templates/${templateId}`,
        {
          method: "PUT",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title,
            category,
            description,
            image_url: imageUrl,
            layout_key: layoutKey,
            primary_color: primaryColor,
            secondary_color: secondaryColor,
            is_active: true,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(data.detail || "Template update failed.");
        return;
      }

      setMessage("Template updated successfully.");

      setTimeout(() => {
        router.push("/admin/templates");
        router.refresh();
      }, 800);
    } catch {
      setError("Backend connection failed.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#02030a] text-white">
      <div className="flex">
        <AdminSidebar />

        <section className="flex-1 px-4 py-5 lg:ml-72 lg:px-8">
          <AdminTopBar />

          <div className="mt-8">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-cyan-300">
              Template Management
            </p>

            <h1 className="mt-3 text-3xl font-extrabold">
              Edit Template
            </h1>

            <p className="mt-2 text-sm text-gray-400">
              Update template details. Changes will automatically reflect on
              the user templates page.
            </p>

            <div className="mt-8 rounded-3xl border border-white/10 bg-white/[0.05] p-8 shadow-2xl shadow-black/30 backdrop-blur-xl">
              {loading && (
                <div className="rounded-2xl border border-white/10 bg-black/20 px-4 py-4 text-sm text-gray-300">
                  Loading template...
                </div>
              )}

              {!loading && message && (
                <div className="mb-5 rounded-2xl border border-green-400/20 bg-green-500/10 px-4 py-3 text-sm text-green-300">
                  {message}
                </div>
              )}

              {!loading && error && (
                <div className="mb-5 rounded-2xl border border-red-400/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
                  {error}
                </div>
              )}

              {!loading && !error && (
                <form
                  onSubmit={handleUpdateTemplate}
                  className="space-y-5"
                >
                  <div className="grid gap-5 md:grid-cols-2">
                    <div>
                      <label className="mb-2 block text-sm text-gray-300">
                        Template Title
                      </label>

                      <input
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Modern Sidebar CV"
                        className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm outline-none transition focus:border-cyan-300/40"
                      />
                    </div>

                    <div>
                      <label className="mb-2 block text-sm text-gray-300">
                        Category
                      </label>

                      <input
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        placeholder="Professional"
                        className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm outline-none transition focus:border-cyan-300/40"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="mb-2 block text-sm text-gray-300">
                      Template Preview Image
                    </label>

                    <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                      <div className="flex flex-col gap-4 md:flex-row md:items-center">
                        <div className="flex h-32 w-full items-center justify-center overflow-hidden rounded-2xl bg-white/5 md:w-44">
                          {imageUrl ? (
                            <img
                              src={imageUrl}
                              alt="Template preview"
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <ImagePlus size={34} className="text-gray-500" />
                          )}
                        </div>

                        <div className="flex-1">
                          <input
                            type="file"
                            accept="image/jpeg,image/png,image/webp"
                            onChange={handleTemplateImageChange}
                            className="block w-full text-sm text-gray-300 file:mr-4 file:rounded-full file:border-0 file:bg-white file:px-5 file:py-2.5 file:text-sm file:font-bold file:text-black hover:file:bg-gray-200"
                          />

                          <p className="mt-3 text-xs leading-5 text-gray-500">
                            Select a JPG, PNG, or WEBP template preview image from your computer.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="grid gap-5 md:grid-cols-3">
                    <div>
                      <label className="mb-2 block text-sm text-gray-300">
                        Layout Key
                      </label>

                      <select
                        value={layoutKey}
                        onChange={(e) => setLayoutKey(e.target.value)}
                        className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm outline-none transition focus:border-cyan-300/40"
                      >
                        {layoutOptions.map((layout) => (
                          <option
                            key={layout}
                            value={layout}
                            className="bg-[#02030a]"
                          >
                            {layout}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="mb-2 block text-sm text-gray-300">
                        Primary Color
                      </label>

                      <input
                        type="color"
                        value={primaryColor}
                        onChange={(e) =>
                          setPrimaryColor(e.target.value)
                        }
                        className="h-12 w-full rounded-2xl border border-white/10 bg-black/20 px-3 py-2"
                      />
                    </div>

                    <div>
                      <label className="mb-2 block text-sm text-gray-300">
                        Secondary Color
                      </label>

                      <input
                        type="color"
                        value={secondaryColor}
                        onChange={(e) =>
                          setSecondaryColor(e.target.value)
                        }
                        className="h-12 w-full rounded-2xl border border-white/10 bg-black/20 px-3 py-2"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="mb-2 block text-sm text-gray-300">
                      Description
                    </label>

                    <textarea
                      value={description}
                      onChange={(e) =>
                        setDescription(e.target.value)
                      }
                      placeholder="Describe this template..."
                      className="h-32 w-full resize-none rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm outline-none transition focus:border-cyan-300/40"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={saving}
                    className="rounded-2xl bg-white px-6 py-3 font-bold text-black transition hover:bg-gray-200 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {saving ? "Saving..." : "Update Template"}
                  </button>
                </form>
              )}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}