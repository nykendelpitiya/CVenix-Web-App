"use client";

import Link from "next/link";
import { ArrowRight, Loader2, Search } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

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

export default function TemplatesSection() {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        setLoading(true);
        setError("");

        const res = await fetch(`${API_BASE}/api/templates/`, {
          method: "GET",
          credentials: "include",
        });

        if (!res.ok) {
          setError("Failed to load templates.");
          return;
        }

        const data: Template[] = await res.json();
        setTemplates(data);
      } catch {
        setError("Backend connection failed.");
      } finally {
        setLoading(false);
      }
    };

    fetchTemplates();
  }, []);

  const filteredTemplates = useMemo(() => {
    return templates.filter((template) => {
      const keyword = search.toLowerCase();

      return (
        template.title.toLowerCase().includes(keyword) ||
        template.category.toLowerCase().includes(keyword)
      );
    });
  }, [search, templates]);

  return (
    <section className="space-y-6">
      <div className="flex flex-col gap-4 rounded-[30px] border border-white/10 bg-white/[0.05] p-6 shadow-2xl shadow-black/30 backdrop-blur-xl md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-cyan-300">
            CV Templates
          </p>

          <h2 className="mt-2 text-3xl font-extrabold text-white">
            Choose Your CV Template
          </h2>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-400">
            Select a professional CV layout, then customize your details,
            colors, sections, and download it as a PDF.
          </p>
        </div>

        <div className="flex items-center gap-3 rounded-full border border-white/10 bg-black/20 px-4 py-3 md:w-[320px]">
          <Search size={18} className="text-gray-400" />

          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search templates..."
            className="w-full bg-transparent text-sm text-white outline-none placeholder:text-gray-500"
          />
        </div>
      </div>

      {loading && (
        <div className="flex items-center justify-center rounded-[30px] border border-white/10 bg-white/[0.05] p-10 text-gray-300">
          <Loader2 className="mr-2 animate-spin" size={20} />
          Loading templates...
        </div>
      )}

      {error && !loading && (
        <div className="rounded-[30px] border border-red-400/20 bg-red-500/10 p-6 text-sm text-red-300">
          {error}
        </div>
      )}

      {!loading && !error && filteredTemplates.length === 0 && (
        <div className="rounded-[30px] border border-white/10 bg-white/[0.05] p-8 text-center text-gray-400">
          No templates found.
        </div>
      )}

      {!loading && !error && filteredTemplates.length > 0 && (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {filteredTemplates.map((template) => (
            <div
              key={template.id}
              className="group overflow-hidden rounded-[30px] border border-white/10 bg-[#070b16] shadow-2xl shadow-black/30 transition-all duration-300 hover:-translate-y-1 hover:border-blue-500/30"
            >
              <div className="relative h-[350px] overflow-hidden bg-[#111827] p-5">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,#2563eb33,transparent_35%),radial-gradient(circle_at_bottom,#7c3aed33,transparent_35%)]" />

                <div className="relative mx-auto h-full max-w-[250px] overflow-hidden rounded-xl bg-white shadow-2xl transition-transform duration-500 group-hover:scale-[1.03]">
                  <TemplatePreview template={template} />
                </div>

                <div className="absolute left-4 top-4 rounded-full border border-white/10 bg-black/50 px-4 py-2 text-xs font-semibold text-cyan-300 backdrop-blur-xl">
                  {template.category}
                </div>
              </div>

              <div className="p-5">
                <h3 className="text-xl font-bold text-white">
                  {template.title}
                </h3>

                <p className="mt-2 line-clamp-3 text-sm leading-6 text-gray-400">
                  {template.description}
                </p>

                <div className="mt-5 flex items-center gap-3">
                  <Link
                    href={`/dashboard/builder?templateId=${template.id}`}
                    className="flex flex-1 items-center justify-center rounded-2xl bg-white px-5 py-3 text-sm font-bold text-black transition-all duration-200 hover:bg-gray-200"
                  >
                    Use Template
                  </Link>

                  <Link
                    href={`/dashboard/builder?templateId=${template.id}`}
                    className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-white transition-all duration-200 hover:bg-white/10"
                  >
                    <ArrowRight size={18} />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

function TemplatePreview({ template }: { template: Template }) {
  if (template.layout_key === "minimal_clean") return <MinimalPreview template={template} />;
  if (template.layout_key === "corporate_blue") return <CorporatePreview template={template} />;
  if (template.layout_key === "creative_designer") return <CreativePreview template={template} />;
  if (template.layout_key === "gold_executive") return <GoldExecutivePreview template={template} />;
  if (template.layout_key === "green_professional") return <GreenProfessionalPreview template={template} />;
  if (template.layout_key === "yellow_creative") return <YellowCreativePreview template={template} />;
  if (template.layout_key === "dark_portfolio") return <DarkPortfolioPreview template={template} />;

  return <ModernSidebarPreview template={template} />;
}

function ModernSidebarPreview({ template }: { template: Template }) {
  return (
    <div className="flex h-full text-[6px]">
      <div className="w-[34%] p-3 text-white" style={{ backgroundColor: template.primary_color }}>
        <div className="mx-auto h-12 w-12 rounded-full bg-white/90" />
        <div className="mt-4 space-y-1">
          <div className="h-1.5 w-12 rounded-full bg-white/80" />
          <div className="h-1 w-10 rounded-full bg-white/50" />
        </div>
        <PreviewSideTitle title="Contact" />
        <PreviewLine light />
        <PreviewLine light short />
        <PreviewSideTitle title="Skills" />
        <PreviewLine light />
        <PreviewLine light />
        <PreviewSideTitle title="Languages" />
        <PreviewLine light short />
      </div>

      <div className="flex-1 p-4 text-slate-900">
        <PreviewName />
        <PreviewMainBlock title="Profile" color={template.secondary_color} />
        <PreviewMainBlock title="Experience" color={template.secondary_color} />
        <PreviewMainBlock title="Education" color={template.secondary_color} />
      </div>
    </div>
  );
}

function MinimalPreview({ template }: { template: Template }) {
  return (
    <div className="h-full p-5 text-slate-900">
      <PreviewName />
      <div className="mt-4 h-px w-full bg-slate-200" />
      <PreviewMainBlock title="Profile" color={template.primary_color} />
      <PreviewMainBlock title="Experience" color={template.primary_color} />
      <PreviewMainBlock title="Education" color={template.primary_color} />
      <PreviewMainBlock title="Skills" color={template.primary_color} />
    </div>
  );
}

function CorporatePreview({ template }: { template: Template }) {
  return (
    <div className="h-full bg-white text-slate-900">
      <div className="px-5 py-5 text-white" style={{ backgroundColor: template.primary_color }}>
        <h4 className="text-[14px] font-black uppercase leading-none">Alex Morgan</h4>
        <p className="mt-1 text-[7px] font-semibold text-blue-100">Frontend Developer</p>
      </div>

      <div className="p-5">
        <PreviewMainBlock title="Profile" color={template.secondary_color} />
        <PreviewMainBlock title="Work Experience" color={template.secondary_color} />
        <PreviewMainBlock title="Education" color={template.secondary_color} />
        <PreviewMainBlock title="Skills" color={template.secondary_color} />
      </div>
    </div>
  );
}

function CreativePreview({ template }: { template: Template }) {
  return (
    <div className="relative h-full overflow-hidden p-5 text-slate-900">
      <div className="absolute -right-8 -top-8 h-20 w-20 rounded-full opacity-25" style={{ backgroundColor: template.secondary_color }} />
      <div className="absolute -left-8 bottom-6 h-20 w-20 rounded-full opacity-20" style={{ backgroundColor: template.primary_color }} />

      <div className="relative">
        <div className="h-12 w-12 rounded-2xl" style={{ backgroundColor: template.primary_color }} />
        <h4 className="mt-4 text-[14px] font-black uppercase leading-none">Alex Morgan</h4>
        <p className="mt-1 text-[7px] font-bold" style={{ color: template.secondary_color }}>UI / UX Designer</p>
        <PreviewMainBlock title="Profile" color={template.secondary_color} />
        <PreviewMainBlock title="Projects" color={template.secondary_color} />
        <PreviewMainBlock title="Skills" color={template.secondary_color} />
      </div>
    </div>
  );
}

function GoldExecutivePreview({ template }: { template: Template }) {
  return (
    <div className="relative h-full overflow-hidden bg-white text-slate-900">
      <div className="h-[32%] p-4 text-white" style={{ backgroundColor: template.primary_color }}>
        <div className="flex gap-3">
          <div className="h-14 w-14 rounded-full border-2 bg-white/90" style={{ borderColor: template.secondary_color }} />
          <div>
            <h4 className="text-[13px] font-black uppercase tracking-[0.2em]" style={{ color: template.secondary_color }}>
              Larry
            </h4>
            <h4 className="text-[13px] font-black uppercase tracking-[0.2em] text-white">
              Tibbetts
            </h4>
            <p className="mt-1 text-[6px] tracking-[0.25em] text-white">Job title</p>
          </div>
        </div>
        <div className="mt-3 space-y-1">
          <PreviewLine light />
          <PreviewLine light />
          <PreviewLine light short />
        </div>
      </div>

      <div className="absolute left-0 top-[29%] h-5 w-full -skew-y-3" style={{ backgroundColor: template.secondary_color }} />

      <div className="flex h-[68%] pt-6 text-[6px]">
        <div className="w-[36%] p-3 text-white" style={{ backgroundColor: template.primary_color }}>
          <PreviewSideTitle title="Contact" />
          <PreviewLine light />
          <PreviewSideTitle title="Skills" />
          <PreviewLine light />
          <PreviewLine light short />
          <PreviewSideTitle title="Languages" />
          <PreviewLine light />
        </div>
        <div className="flex-1 p-4">
          <GoldTitle title="Experience" color={template.secondary_color} />
          <PreviewLine />
          <PreviewLine short />
          <GoldTitle title="Education" color={template.secondary_color} />
          <PreviewLine />
          <PreviewLine short />
        </div>
      </div>
    </div>
  );
}

function GreenProfessionalPreview({ template }: { template: Template }) {
  return (
    <div className="flex h-full bg-white text-slate-900">
      <div className="w-[35%] p-4">
        <div className="mx-auto h-14 w-14 rounded-full border-4 border-green-100 bg-slate-200" />
        <h4 className="mt-4 text-[15px] font-black leading-tight">Markus<br />Johnson</h4>
        <p className="mt-2 text-[7px] uppercase tracking-widest" style={{ color: template.secondary_color }}>Web Designer</p>

        <GreenSideTitle title="Contact" color={template.secondary_color} />
        <PreviewLine short />
        <PreviewLine short />

        <GreenSideTitle title="Technical Skills" color={template.secondary_color} />
        <SkillDots color={template.secondary_color} />
        <SkillDots color={template.secondary_color} />
        <SkillDots color={template.secondary_color} />
      </div>

      <div className="flex-1 p-4">
        <GreenSection title="Professional Summary" color={template.secondary_color} />
        <GreenSection title="Employment" color={template.secondary_color} />
        <GreenSection title="Education" color={template.secondary_color} />
      </div>
    </div>
  );
}

function YellowCreativePreview({ template }: { template: Template }) {
  return (
    <div className="relative flex h-full bg-white text-slate-900">
      <div className="w-[34%] bg-[#2f2f2f] p-3 text-white">
        <div className="relative -mt-1 mx-auto h-14 w-14 overflow-hidden rounded-full border-4" style={{ borderColor: template.secondary_color }}>
          <div className="h-full w-full bg-slate-200" />
        </div>

        <PreviewSideTitle title="Contact Me" />
        <PreviewLine light />
        <PreviewLine light short />

        <PreviewSideTitle title="References" />
        <PreviewLine light />
        <PreviewLine light short />

        <PreviewSideTitle title="Education" />
        <PreviewLine light />
        <PreviewLine light short />
      </div>

      <div className="absolute left-[30%] top-0 h-full w-px bg-[#2f2f2f]" />
      <div className="flex-1 p-5">
        <h4 className="text-[13px] font-black uppercase">
          Brian R. <span style={{ color: template.secondary_color }}>Baxter</span>
        </h4>
        <p className="text-[6px] uppercase tracking-widest text-slate-400">Graphic & Web Designer</p>

        <YellowSection title="About Me" color={template.secondary_color} />
        <YellowSection title="Job Experience" color={template.secondary_color} />
        <YellowSection title="Skills" color={template.secondary_color} />
      </div>

      <div className="absolute right-0 bottom-0 h-10 w-10" style={{ backgroundColor: template.secondary_color, clipPath: "polygon(100% 0, 0 100%, 100% 100%)" }} />
    </div>
  );
}

function DarkPortfolioPreview({ template }: { template: Template }) {
  return (
    <div className="flex h-full bg-white text-slate-900">
      <div className="w-[38%] p-4 text-white" style={{ backgroundColor: template.primary_color }}>
        <div className="mx-auto h-16 w-16 rounded-full border-4 bg-slate-200" style={{ borderColor: template.secondary_color }} />

        <h4 className="mt-5 text-[16px] font-black" style={{ color: template.secondary_color }}>
          Nina Lane
        </h4>
        <p className="text-[8px] text-white">Graphic Designer</p>

        <DarkSideSection title="Contact" color={template.secondary_color} />
        <DarkSideSection title="Skills" color={template.secondary_color} />
        <DarkSideSection title="Interests" color={template.secondary_color} />
      </div>

      <div className="flex-1 p-5">
        <IconSection title="Profile" color={template.secondary_color} />
        <IconSection title="Experience" color={template.secondary_color} />
        <IconSection title="Education" color={template.secondary_color} />
        <IconSection title="Portfolio" color={template.secondary_color} />
      </div>
    </div>
  );
}

function PreviewName() {
  return (
    <>
      <h4 className="text-[13px] font-black uppercase leading-none">Alex Morgan</h4>
      <p className="mt-1 text-[7px] font-bold text-blue-600">Frontend Developer</p>
    </>
  );
}

function PreviewSideTitle({ title }: { title: string }) {
  return <p className="mt-5 text-[6px] font-black uppercase tracking-widest text-white">{title}</p>;
}

function PreviewMainBlock({ title, color }: { title: string; color: string }) {
  return (
    <div className="mt-4">
      <p className="text-[6px] font-black uppercase tracking-widest" style={{ color }}>{title}</p>
      <div className="mt-2 space-y-1.5">
        <PreviewLine />
        <PreviewLine />
        <PreviewLine short />
      </div>
    </div>
  );
}

function PreviewLine({ short, light }: { short?: boolean; light?: boolean }) {
  return (
    <div
      className={`h-1 rounded-full ${short ? "w-2/3" : "w-full"} ${
        light ? "bg-white/45" : "bg-slate-200"
      }`}
    />
  );
}

function GoldTitle({ title, color }: { title: string; color: string }) {
  return (
    <div className="mb-3 mt-4 rounded-full px-4 py-1 text-center text-[7px] font-black uppercase tracking-[0.25em] text-white" style={{ backgroundColor: color }}>
      {title}
    </div>
  );
}

function GreenSideTitle({ title, color }: { title: string; color: string }) {
  return (
    <p className="mt-7 border-b pb-1 text-[7px] font-black" style={{ borderColor: color }}>
      {title}
    </p>
  );
}

function GreenSection({ title, color }: { title: string; color: string }) {
  return (
    <div className="mt-7">
      <p className="border-b pb-1 text-[8px] font-black" style={{ borderColor: color }}>
        {title}
      </p>
      <div className="mt-3 space-y-1.5">
        <PreviewLine />
        <PreviewLine />
        <PreviewLine short />
      </div>
    </div>
  );
}

function SkillDots({ color }: { color: string }) {
  return (
    <div className="mt-3 flex items-center justify-between">
      <div className="h-1 w-8 rounded bg-slate-200" />
      <div className="flex gap-1">
        {[1, 2, 3, 4].map((dot) => (
          <div key={dot} className="h-1 w-1 rounded-full" style={{ backgroundColor: color }} />
        ))}
      </div>
    </div>
  );
}

function YellowSection({ title, color }: { title: string; color: string }) {
  return (
    <div className="relative mt-7 pl-3">
      <div className="absolute left-0 top-0 h-3 w-1 rounded-full" style={{ backgroundColor: color }} />
      <p className="text-[7px] font-black uppercase tracking-widest">{title}</p>
      <div className="mt-2 space-y-1.5">
        <PreviewLine />
        <PreviewLine />
        <PreviewLine short />
      </div>
    </div>
  );
}

function DarkSideSection({ title, color }: { title: string; color: string }) {
  return (
    <div className="mt-8">
      <p className="text-[8px] font-black" style={{ color }}>{title}</p>
      <div className="mt-1 h-px w-full bg-white/20">
        <div className="h-px w-1/3" style={{ backgroundColor: color }} />
      </div>
      <div className="mt-3 space-y-1.5">
        <PreviewLine light />
        <PreviewLine light short />
      </div>
    </div>
  );
}

function IconSection({ title, color }: { title: string; color: string }) {
  return (
    <div className="mt-5">
      <div className="flex items-center gap-2">
        <div className="h-5 w-5 rounded-full" style={{ backgroundColor: color }} />
        <p className="text-[9px] font-black">{title}</p>
      </div>
      <div className="mt-1 h-px w-full bg-slate-200" />
      <div className="mt-3 space-y-1.5">
        <PreviewLine />
        <PreviewLine />
        <PreviewLine short />
      </div>
    </div>
  );
}