"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ArrowRight,
  FilePlus2,
  FileText,
  HelpCircle,
  Home,
  LayoutTemplate,
  Settings,
  X,
} from "lucide-react";

const LOGO_IMAGE = "/cvenix-logo.png";

const menuItems = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: Home,
  },
  {
    label: "My Resumes",
    href: "/dashboard/resumes",
    icon: FileText,
  },
  {
    label: "Create Resume",
    href: "/dashboard/create",
    icon: FilePlus2,
  },
  {
    label: "Templates",
    href: "/dashboard/templates",
    icon: LayoutTemplate,
  },
  {
    label: "Settings",
    href: "/dashboard/settings",
    icon: Settings,
  },
];

type DashboardSidebarProps = {
  mobileSidebarOpen?: boolean;
  setMobileSidebarOpen?: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function DashboardSidebar({
  mobileSidebarOpen = false,
  setMobileSidebarOpen,
}: DashboardSidebarProps) {
  const pathname = usePathname();

  const closeMobileSidebar = () => {
    setMobileSidebarOpen?.(false);
  };

  const sidebarContent = (
    <div className="flex h-full flex-col px-5 py-6">
      <div className="flex shrink-0 items-center justify-between gap-3">
        <Link
          href="/dashboard"
          onClick={closeMobileSidebar}
          className="flex min-w-0 items-center gap-3 transition-opacity hover:opacity-90"
        >
          <div className="relative flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-white/10 bg-white shadow-[0_0_26px_rgba(103,232,249,0.25)]">
            <img
              src={LOGO_IMAGE}
              alt="CVenix Logo"
              className="h-12 w-12 object-cover"
            />
          </div>

          <div className="min-w-0">
            <h2 className="truncate text-xl font-extrabold tracking-wide text-white">
              CVenix
            </h2>

            <p className="truncate text-xs text-gray-400">
              Professional Resume Builder
            </p>
          </div>
        </Link>

        <button
          type="button"
          onClick={closeMobileSidebar}
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white transition hover:bg-white/10 lg:hidden"
          aria-label="Close mobile sidebar"
        >
          <X size={18} />
        </button>
      </div>

      <div className="mt-9 flex-1 pr-1">
        <p className="mb-4 px-3 text-[11px] font-semibold uppercase tracking-[0.25em] text-cyan-300">
          Main Menu
        </p>

        <nav className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.label}
                href={item.href}
                onClick={closeMobileSidebar}
                className={`group flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? "bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-white shadow-lg shadow-blue-900/20"
                    : "text-gray-300 hover:bg-white/10 hover:text-white"
                }`}
              >
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-xl transition-all duration-200 ${
                    isActive
                      ? "bg-white text-black"
                      : "bg-white/5 text-gray-300 group-hover:bg-white/10 group-hover:text-white"
                  }`}
                >
                  <Icon size={18} />
                </div>

                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="shrink-0 border-t border-white/10 pt-4">
        <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-cyan-500/10 via-blue-500/10 to-purple-500/10 p-4 shadow-xl shadow-black/20">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white text-black">
            <HelpCircle size={20} />
          </div>

          <h3 className="mt-4 text-base font-bold text-white">Need Help?</h3>

          <p className="mt-2 text-xs leading-5 text-gray-400">
            Get support from the CVenix team whenever you need help.
          </p>

          <Link
            href="/dashboard/help-center"
            onClick={closeMobileSidebar}
            className="mt-4 inline-flex items-center gap-2 rounded-full border border-cyan-300/20 bg-cyan-300/10 px-4 py-2 text-xs font-bold text-cyan-300 transition hover:bg-cyan-300/20"
          >
            Open Help Center
            <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <aside className="fixed left-0 top-0 z-40 hidden h-screen w-72 border-r border-white/10 bg-[#050816]/95 backdrop-blur-2xl lg:block">
        {sidebarContent}
      </aside>

      {mobileSidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            onClick={closeMobileSidebar}
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            aria-label="Close mobile sidebar overlay"
          />

          <aside className="absolute left-0 top-0 h-full w-[82%] max-w-[320px] border-r border-white/10 bg-[#050816]/95 shadow-2xl shadow-black/60 backdrop-blur-2xl">
            {sidebarContent}
          </aside>
        </div>
      )}
    </>
  );
}