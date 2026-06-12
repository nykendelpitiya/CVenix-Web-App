"use client";

import { useState } from "react";
import {
  Bell,
  Brush,
  FileText,
  LayoutDashboard,
  Save,
  Trash2,
} from "lucide-react";

import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import DashboardTopBar from "@/components/dashboard/DashboardTopBar";

export default function SettingsPage() {
  const [defaultResumeTitle, setDefaultResumeTitle] = useState("My Resume");
  const [fileNameFormat, setFileNameFormat] = useState("name-role-resume");
  const [defaultColor, setDefaultColor] = useState("#2563eb");

  const [templateUpdates, setTemplateUpdates] = useState(true);
  const [adminReplies, setAdminReplies] = useState(true);
  const [systemUpdates, setSystemUpdates] = useState(true);

  const [compactLayout, setCompactLayout] = useState(false);
  const [accentColor, setAccentColor] = useState("cyan");

  const [message, setMessage] = useState("");

  const handleSaveSettings = () => {
    setMessage("Settings saved successfully.");

    setTimeout(() => {
      setMessage("");
    }, 3000);
  };

  return (
    <main className="min-h-screen bg-[#02030a] text-white">
      <div className="flex">
        <DashboardSidebar />

        <section className="min-h-screen flex-1 px-4 py-5 lg:ml-72 lg:px-8">
          <DashboardTopBar />

          <div className="mt-8">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.25em] text-cyan-300">
                  Settings
                </p>

                <h1 className="mt-3 text-3xl font-extrabold">
                  Settings
                </h1>

                <p className="mt-2 text-gray-400">
                  Manage resume defaults, notifications, and dashboard
                  preferences.
                </p>
              </div>

              <button
                onClick={handleSaveSettings}
                className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-white px-6 py-3 font-bold text-black transition hover:bg-gray-200 sm:w-auto"
              >
                <Save size={18} />
                Save Settings
              </button>
            </div>

            {message && (
              <div className="mt-6 rounded-2xl border border-green-400/20 bg-green-500/10 px-4 py-3 text-sm text-green-300">
                {message}
              </div>
            )}

            <div className="mt-8 grid gap-6 xl:grid-cols-2">
              <div className="rounded-3xl border border-white/10 bg-white/[0.05] p-6 shadow-2xl shadow-black/30 backdrop-blur-xl">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-black">
                    <FileText size={22} />
                  </div>

                  <div>
                    <h2 className="text-xl font-bold">
                      Resume Defaults
                    </h2>

                    <p className="mt-1 text-sm text-gray-400">
                      Set default options for new resumes.
                    </p>
                  </div>
                </div>

                <div className="mt-6 space-y-5">
                  <div>
                    <label className="mb-2 block text-sm text-gray-300">
                      Default Resume Title
                    </label>

                    <input
                      value={defaultResumeTitle}
                      onChange={(e) => setDefaultResumeTitle(e.target.value)}
                      className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm outline-none transition focus:border-cyan-300/40"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm text-gray-300">
                      PDF File Name Format
                    </label>

                    <select
                      value={fileNameFormat}
                      onChange={(e) => setFileNameFormat(e.target.value)}
                      className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm outline-none transition focus:border-cyan-300/40"
                    >
                      <option className="bg-[#02030a]" value="name-role-resume">
                        name-role-resume
                      </option>

                      <option className="bg-[#02030a]" value="resume-name">
                        resume-name
                      </option>

                      <option className="bg-[#02030a]" value="cvenix-resume">
                        cvenix-resume
                      </option>
                    </select>
                  </div>

                  <div>
                    <label className="mb-2 block text-sm text-gray-300">
                      Default Resume Color
                    </label>

                    <input
                      type="color"
                      value={defaultColor}
                      onChange={(e) => setDefaultColor(e.target.value)}
                      className="h-12 w-full cursor-pointer rounded-2xl border border-white/10 bg-black/20 p-1"
                    />
                  </div>
                </div>
              </div>

              <div className="rounded-3xl border border-white/10 bg-white/[0.05] p-6 shadow-2xl shadow-black/30 backdrop-blur-xl">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-black">
                    <Bell size={22} />
                  </div>

                  <div>
                    <h2 className="text-xl font-bold">
                      Notifications
                    </h2>

                    <p className="mt-1 text-sm text-gray-400">
                      Control the updates you receive.
                    </p>
                  </div>
                </div>

                <div className="mt-6 space-y-4">
                  <SettingSwitch
                    title="Template Updates"
                    description="Get notified when new resume templates are added."
                    enabled={templateUpdates}
                    onChange={setTemplateUpdates}
                  />

                  <SettingSwitch
                    title="Admin Reply Notifications"
                    description="Get notified when admin replies to your help messages."
                    enabled={adminReplies}
                    onChange={setAdminReplies}
                  />

                  <SettingSwitch
                    title="System Updates"
                    description="Receive important CVenix platform updates."
                    enabled={systemUpdates}
                    onChange={setSystemUpdates}
                  />
                </div>
              </div>

              <div className="rounded-3xl border border-white/10 bg-white/[0.05] p-6 shadow-2xl shadow-black/30 backdrop-blur-xl">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-black">
                    <Brush size={22} />
                  </div>

                  <div>
                    <h2 className="text-xl font-bold">
                      Appearance
                    </h2>

                    <p className="mt-1 text-sm text-gray-400">
                      Adjust dashboard display preferences.
                    </p>
                  </div>
                </div>

                <div className="mt-6 space-y-5">
                  <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                    <div className="flex items-center gap-3">
                      <LayoutDashboard size={18} className="text-cyan-300" />

                      <div>
                        <p className="text-sm font-bold">
                          Dark Mode
                        </p>

                        <p className="mt-1 text-xs text-gray-500">
                          CVenix currently uses a premium dark dashboard theme.
                        </p>
                      </div>
                    </div>
                  </div>

                  <SettingSwitch
                    title="Compact Layout"
                    description="Reduce spacing for a cleaner compact view."
                    enabled={compactLayout}
                    onChange={setCompactLayout}
                  />

                  <div>
                    <label className="mb-2 block text-sm text-gray-300">
                      Accent Color
                    </label>

                    <select
                      value={accentColor}
                      onChange={(e) => setAccentColor(e.target.value)}
                      className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm outline-none transition focus:border-cyan-300/40"
                    >
                      <option className="bg-[#02030a]" value="cyan">
                        Cyan
                      </option>

                      <option className="bg-[#02030a]" value="blue">
                        Blue
                      </option>

                      <option className="bg-[#02030a]" value="purple">
                        Purple
                      </option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="rounded-3xl border border-red-400/20 bg-red-500/[0.05] p-6 shadow-2xl shadow-black/30 backdrop-blur-xl">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-500/10 text-red-300">
                    <Trash2 size={22} />
                  </div>

                  <div>
                    <h2 className="text-xl font-bold text-red-200">
                      Danger Zone
                    </h2>

                    <p className="mt-1 text-sm text-red-200/60">
                      Use these options carefully.
                    </p>
                  </div>
                </div>

                <div className="mt-6 space-y-3">
                  <button className="w-full rounded-2xl border border-red-400/20 bg-red-500/10 px-4 py-3 text-left text-sm font-bold text-red-300 transition hover:bg-red-500/20">
                    Clear Saved Resumes
                  </button>

                  <button className="w-full rounded-2xl border border-red-400/20 bg-red-500/10 px-4 py-3 text-left text-sm font-bold text-red-300 transition hover:bg-red-500/20">
                    Delete Account
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

type SettingSwitchProps = {
  title: string;
  description: string;
  enabled: boolean;
  onChange: (value: boolean) => void;
};

function SettingSwitch({
  title,
  description,
  enabled,
  onChange,
}: SettingSwitchProps) {
  return (
    <button
      type="button"
      onClick={() => onChange(!enabled)}
      className="flex w-full items-center justify-between gap-4 rounded-2xl border border-white/10 bg-black/20 p-4 text-left transition hover:bg-black/30"
    >
      <div className="min-w-0">
        <p className="text-sm font-bold text-white">
          {title}
        </p>

        <p className="mt-1 text-xs leading-5 text-gray-500">
          {description}
        </p>
      </div>

      <span
        className={`flex h-7 w-12 shrink-0 items-center rounded-full p-1 transition ${
          enabled ? "bg-cyan-300" : "bg-white/10"
        }`}
      >
        <span
          className={`h-5 w-5 rounded-full bg-black transition ${
            enabled ? "translate-x-5" : "translate-x-0 bg-gray-400"
          }`}
        />
      </span>
    </button>
  );
}