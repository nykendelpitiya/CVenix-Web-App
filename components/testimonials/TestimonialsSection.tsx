"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Quote, Star } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const testimonials = [
  {
    name: "Computer Science Student",
    role: "Internship Applicant",
    review:
      "CVenix helped me create a clean resume for internship applications. The live preview made it easy to update my details.",
  },
  {
    name: "Job Seeker",
    role: "Entry Level Applicant",
    review:
      "The templates are simple, modern, and easy to edit. I could prepare a professional resume without any design experience.",
  },
  {
    name: "Junior Developer",
    role: "Portfolio Resume User",
    review:
      "I liked the clean layout and PDF export option. It helped me organize my skills, projects, and education clearly.",
  },
];

export default function TestimonialsSection() {
  const sectionRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".testimonials-heading", {
        scrollTrigger: {
          trigger: ".testimonials-heading",
          start: "top 85%",
          once: true,
        },
        y: 40,
        opacity: 0,
        duration: 0.9,
        ease: "power3.out",
        clearProps: "all",
      });

      gsap.from(".testimonial-card", {
        scrollTrigger: {
          trigger: ".testimonials-grid",
          start: "top 85%",
          once: true,
        },
        y: 45,
        opacity: 0,
        duration: 0.8,
        stagger: 0.14,
        ease: "power3.out",
        clearProps: "all",
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="overflow-hidden bg-black px-4 py-14 sm:px-6 sm:py-16"
    >
      <div className="mx-auto max-w-6xl">
        <div className="testimonials-heading mx-auto max-w-3xl text-center">
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.3em] text-blue-400 sm:text-sm">
            Testimonials
          </p>

          <h2 className="text-3xl font-bold leading-tight text-white sm:text-4xl md:text-5xl">
            Trusted by Students and Job Seekers
          </h2>

          <p className="mt-5 text-sm leading-relaxed text-gray-300 sm:text-base">
            See how CVenix helps users create clean, professional, and
            application-ready resumes.
          </p>
        </div>

        <div className="testimonials-grid -mx-4 mt-10 flex snap-x snap-mandatory gap-5 overflow-x-auto px-4 pb-5 sm:mx-0 sm:mt-12 sm:grid sm:grid-cols-2 sm:overflow-visible sm:px-0 lg:grid-cols-3">
          {testimonials.map((item, index) => (
            <div
              key={index}
              className="testimonial-card min-w-[84%] snap-center rounded-[2rem] border border-white/10 bg-white/[0.05] p-6 shadow-2xl shadow-black/30 backdrop-blur-xl transition duration-300 hover:-translate-y-2 hover:border-blue-400/30 hover:bg-white/10 hover:shadow-blue-500/10 sm:min-w-0 sm:p-7"
            >
              <div className="flex items-center justify-between gap-4">
                <div className="flex gap-1 text-yellow-400">
                  {Array.from({ length: 5 }).map((_, starIndex) => (
                    <Star
                      key={starIndex}
                      size={16}
                      fill="currentColor"
                      strokeWidth={0}
                    />
                  ))}
                </div>

                <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.06] text-cyan-300">
                  <Quote size={18} />
                </div>
              </div>

              <p className="mt-7 text-sm leading-relaxed text-gray-300">
                “{item.review}”
              </p>

              <div className="mt-8 flex items-center gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white text-sm font-bold text-black shadow-lg shadow-white/20">
                  {item.name.charAt(0)}
                </div>

                <div>
                  <h3 className="font-semibold text-white">
                    {item.name}
                  </h3>

                  <p className="mt-1 text-sm text-gray-400">
                    {item.role}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}