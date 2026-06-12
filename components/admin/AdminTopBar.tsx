"use client";

import { ShieldCheck, Search } from "lucide-react";

export default function AdminTopBar() {
  return (
    <div className="sticky top-5 z-40 flex items-center justify-between rounded-[28px] border border-white/10 bg-[#10131f]/80 px-4 py-4 shadow-2xl shadow-black/30 backdrop-blur-2xl">
      <div>
        <div className="inline-flex items-center gap-2 rounded-full border border-cyan-300/15 bg-cyan-300/10 px-3 py-1">
          <ShieldCheck size={13} className="text-cyan-300" />
          <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-cyan-300">
            Admin Panel
          </p>
        </div>

        <h1 className="mt-2 text-xl font-extrabold sm:text-2xl">
          Welcome, Admin
        </h1>
      </div>

      <div className="hidden max-w-md flex-1 items-center gap-3 rounded-full border border-white/10 bg-black/30 px-4 py-3 md:mx-8 md:flex">
        <Search size={18} className="text-gray-400" />
        <input
          placeholder="Search admin data..."
          className="w-full bg-transparent text-sm text-white outline-none placeholder:text-gray-500"
        />
      </div>

      <div className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-sm font-extrabold text-black">
        A
      </div>
    </div>
  );
}