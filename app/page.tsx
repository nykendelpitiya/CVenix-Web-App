"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import Navbar from "@/components/navbar/Navbar";
import HeroSection from "@/components/hero/HeroSection";
import FeaturesSection from "@/components/features/FeaturesSection";
import TemplatesSection from "@/components/templates/TemplatesSection";
import TestimonialsSection from "@/components/testimonials/TestimonialsSection";
import Footer from "@/components/footer/Footer";

const API_BASE = "http://localhost:8000";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const checkLoggedUser = async () => {
      try {
        const response = await fetch(`${API_BASE}/api/auth/me`, {
          method: "GET",
          credentials: "include",
        });

        if (!response.ok) return;

        const user = await response.json();

        if (user.role === "admin") {
          router.replace("/admin/dashboard");
          return;
        }

        router.replace("/dashboard");
      } catch {
        console.log("Not logged in");
      }
    };

    checkLoggedUser();
  }, [router]);

  return (
    <main className="min-h-screen bg-black">
      <Navbar />

      <section id="home">
        <HeroSection />
      </section>

      <section id="features">
        <FeaturesSection />
      </section>

      <section id="templates">
        <TemplatesSection />
      </section>

      <section id="testimonials">
        <TestimonialsSection />
      </section>

      <section id="about">
        <Footer />
      </section>
    </main>
  );
}