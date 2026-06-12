"use client";

import { useState } from "react";

import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import DashboardTopBar from "@/components/dashboard/DashboardTopBar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  return (
    <main className="min-h-screen overflow-x-hidden bg-[#02030a] text-white">
      <div className="flex w-full max-w-full overflow-x-hidden">
        <DashboardSidebar
          mobileSidebarOpen={mobileSidebarOpen}
          setMobileSidebarOpen={setMobileSidebarOpen}
        />

        <section className="min-h-screen w-full max-w-full flex-1 overflow-x-hidden px-4 py-5 lg:ml-72 lg:px-8">
          <DashboardTopBar
            onMobileMenuClick={() => setMobileSidebarOpen(true)}
          />

          <div className="mt-8 w-full max-w-full overflow-x-hidden">
            {children}
          </div>
        </section>
      </div>
    </main>
  );
}