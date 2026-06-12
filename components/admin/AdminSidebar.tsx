"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Bell,
  Home,
  LayoutTemplate,
  LogOut,
  MessageSquare,
  Users,
} from "lucide-react";

const API_BASE = "http://localhost:8000";

const menuItems = [
  { label: "Dashboard", href: "/admin/dashboard", icon: Home },
  { label: "Templates", href: "/admin/templates", icon: LayoutTemplate },
  { label: "Users", href: "/admin/users", icon: Users },
  { label: "Notifications", href: "/admin/notifications", icon: Bell },
  { label: "Help Messages", href: "/admin/help-messages", icon: MessageSquare },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await fetch(`${API_BASE}/api/auth/logout`, {
        method: "POST",
        credentials: "include",
      });
    } finally {
      router.push("/");
      router.refresh();
    }
  };

  return (
    <aside className="fixed left-0 top-0 z-40 hidden h-screen w-72 border-r border-white/10 bg-[#050816]/95 backdrop-blur-2xl lg:block">
      <div className="flex h-full flex-col px-5 py-6">
        <Link href="/admin/dashboard" className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-lg font-extrabold text-black">
            A
          </div>

          <div>
            <h2 className="text-xl font-extrabold text-white">CVenix Admin</h2>
            <p className="text-xs text-gray-400">Management Panel</p>
          </div>
        </Link>

        <div className="mt-10 flex-1">
          <p className="mb-4 px-3 text-[11px] font-semibold uppercase tracking-[0.25em] text-cyan-300">
            Admin Menu
          </p>

          <nav className="space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;

              return (
                <Link
                  key={item.label}
                  href={item.href}
                  className={`group flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition ${
                    isActive
                      ? "bg-gradient-to-r from-cyan-500/20 to-purple-500/20 text-white"
                      : "text-gray-300 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-xl ${
                      isActive ? "bg-white text-black" : "bg-white/5"
                    }`}
                  >
                    <Icon size={18} />
                  </div>

                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>

        <button
          onClick={handleLogout}
          className="flex w-full items-center justify-center gap-2 rounded-2xl border border-red-400/20 bg-red-500/10 px-4 py-3 text-sm font-bold text-red-300 hover:bg-red-500/20"
        >
          <LogOut size={18} />
          Logout
        </button>
      </div>
    </aside>
  );
}