"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Check, X } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

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
  const sectionRef = useRef<HTMLElement | null>(null);

  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(
    null
  );

  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        const response = await fetch(`${API_BASE}/api/templates/`, {
          method: "GET",
          credentials: "include",
        });

        if (!response.ok) {
          setTemplates([]);
          return;
        }

        const data: Template[] = await response.json();

        setTemplates(data.filter((template) => template.is_active));
      } catch {
        setTemplates([]);
      } finally {
        setLoading(false);
      }
    };

    fetchTemplates();
  }, []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const heading = sectionRef.current?.querySelector(".templates-heading");

      if (!heading) return;

      gsap.from(heading, {
        scrollTrigger: {
          trigger: heading,
          start: "top 85%",
          once: true,
        },
        y: 40,
        opacity: 0,
        duration: 0.9,
        ease: "power3.out",
        clearProps: "all",
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  useEffect(() => {
    if (loading || templates.length === 0) return;

    const ctx = gsap.context(() => {
      const grid = sectionRef.current?.querySelector(".templates-grid");
      const cards = sectionRef.current?.querySelectorAll(".template-card");

      if (!grid || !cards || cards.length === 0) return;

      gsap.from(cards, {
        scrollTrigger: {
          trigger: grid,
          start: "top 82%",
          once: true,
        },
        y: 50,
        opacity: 0,
        duration: 0.9,
        stagger: 0.15,
        ease: "power3.out",
        clearProps: "all",
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [loading, templates]);

  return (
    <section
      ref={sectionRef}
      className="overflow-hidden bg-black px-4 py-20 sm:px-6 sm:py-16"
    >
      <div className="mx-auto max-w-6xl">
        <div className="templates-heading mx-auto max-w-3xl text-center">
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.3em] text-blue-400 sm:text-sm">
            Templates
          </p>

          <h2 className="text-3xl font-bold leading-tight text-white sm:text-4xl md:text-5xl">
            Explore Real Resume Templates
          </h2>

          <p className="mt-5 text-sm leading-relaxed text-gray-300 sm:text-base">
            View the same professional templates available inside the CVenix
            dashboard.
          </p>
        </div>

        {loading && (
          <div className="mt-14 rounded-3xl border border-white/10 bg-white/[0.05] p-8 text-center text-sm text-gray-400">
            Loading templates...
          </div>
        )}

        {!loading && templates.length === 0 && (
          <div className="mt-14 rounded-3xl border border-dashed border-white/10 bg-white/[0.05] p-8 text-center">
            <h3 className="text-lg font-bold text-white">
              No templates available yet
            </h3>

            <p className="mt-2 text-sm text-gray-400">
              Templates added by admin will appear here.
            </p>
          </div>
        )}

        {!loading && templates.length > 0 && (
          <div className="templates-grid -mx-4 mt-12 flex snap-x snap-mandatory gap-5 overflow-x-auto px-4 pb-5 sm:mx-0 sm:mt-16 sm:grid sm:grid-cols-2 sm:overflow-visible sm:px-0 md:grid-cols-3">
            {templates.map((template) => (
              <button
                key={template.id}
                type="button"
                onClick={() => setSelectedTemplate(template)}
                className="template-card group min-w-[84%] snap-center overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.05] text-left shadow-2xl shadow-black/30 backdrop-blur-xl transition duration-300 hover:-translate-y-2 hover:border-blue-400/30 hover:bg-white/10 hover:shadow-blue-500/10 sm:min-w-0"
              >
                <div className="relative h-[360px] overflow-hidden bg-[#050816] p-4 sm:h-[420px] sm:p-5">
                  <div className="absolute left-5 top-5 z-20 rounded-full border border-cyan-300/20 bg-cyan-300/10 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-cyan-300">
                    {template.category}
                  </div>

                  <div className="absolute right-5 top-5 z-20 rounded-full border border-white/10 bg-black/40 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-white/80 backdrop-blur-xl">
                    Preview
                  </div>

                  <div className="absolute inset-x-8 top-14 h-24 rounded-full bg-purple-500/20 blur-[70px]" />
                  <div className="absolute bottom-10 right-6 h-28 w-28 rounded-full bg-cyan-400/15 blur-[70px]" />

                  <img
                    src={template.image_url}
                    alt={template.title}
                    className="relative mx-auto h-full w-full rounded-[1.5rem] border border-white/10 object-cover object-top shadow-2xl shadow-black/40 transition duration-500 group-hover:scale-[1.03]"
                  />
                </div>

                <div className="p-5 sm:p-6">
                  <p className="text-xs font-bold uppercase tracking-[0.25em] text-blue-400">
                    {template.category}
                  </p>

                  <h3 className="mt-2 text-lg font-semibold text-white sm:text-xl">
                    {template.title}
                  </h3>

                  <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-gray-400">
                    {template.description}
                  </p>

                  <div className="mt-5 flex flex-wrap gap-2">
                    <TemplatePoint label="ATS Friendly" />
                    <TemplatePoint label="Editable" />
                    <TemplatePoint label="PDF Ready" />
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {selectedTemplate && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 px-4 py-6 backdrop-blur-xl">
          <div className="relative max-h-[92vh] w-full max-w-4xl overflow-hidden rounded-[2rem] border border-white/10 bg-[#050816] shadow-2xl shadow-black/60">
            <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.25em] text-cyan-300">
                  {selectedTemplate.category}
                </p>

                <h3 className="mt-1 text-lg font-bold text-white sm:text-xl">
                  {selectedTemplate.title}
                </h3>
              </div>

              <button
                type="button"
                onClick={() => setSelectedTemplate(null)}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white transition hover:bg-white/10"
                aria-label="Close template preview"
              >
                <X size={20} />
              </button>
            </div>

            <div className="max-h-[78vh] overflow-y-auto bg-black/30 p-4 sm:p-6">
              <img
                src={selectedTemplate.image_url}
                alt={selectedTemplate.title}
                className="mx-auto w-full max-w-3xl rounded-2xl border border-white/10 object-contain shadow-2xl shadow-black/40"
              />
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

type TemplatePointProps = {
  label: string;
};

function TemplatePoint({ label }: TemplatePointProps) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-[11px] font-semibold text-gray-300">
      <Check size={12} className="text-cyan-300" />
      {label}
    </span>
  );
}