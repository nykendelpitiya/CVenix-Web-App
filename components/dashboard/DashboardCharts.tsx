"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

import {
  Area,
  AreaChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
} from "recharts";

const API_BASE = "http://localhost:8000";

type Resume = {
  id: number;
  is_active: boolean;
};

type Template = {
  id: number;
  category: string;
};

type WeeklyActivity = {
  day: string;
  resumes: number;
};

type TemplateUsage = {
  name: string;
  value: number;
  color: string;
};

type DashboardAnalytics = {
  weekly_activity: WeeklyActivity[];
  template_usage: TemplateUsage[];
  completion_percentage: number;
};

type DashboardChartsProps = {
  resumes: Resume[];
  templates: Template[];
  loading?: boolean;
};

export default function DashboardCharts({
  resumes,
  templates,
  loading = false,
}: DashboardChartsProps) {
  const chartsRef = useRef<HTMLDivElement | null>(null);

  const [analytics, setAnalytics] = useState<DashboardAnalytics>({
    weekly_activity: [],
    template_usage: [],
    completion_percentage: 0,
  });

  const [analyticsLoading, setAnalyticsLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setAnalyticsLoading(true);

        const response = await fetch(
          `${API_BASE}/api/resumes/analytics/dashboard`,
          {
            credentials: "include",
          }
        );

        if (!response.ok) {
          setAnalytics({
            weekly_activity: [],
            template_usage: [],
            completion_percentage: 0,
          });

          return;
        }

        const data: DashboardAnalytics = await response.json();

        setAnalytics(data);
      } catch {
        setAnalytics({
          weekly_activity: [],
          template_usage: [],
          completion_percentage: 0,
        });
      } finally {
        setAnalyticsLoading(false);
      }
    };

    fetchAnalytics();
  }, [resumes, templates]);

  useEffect(() => {
    if (!chartsRef.current) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".chart-card",
        {
          opacity: 0,
          y: 30,
          scale: 0.97,
        },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.75,
          stagger: 0.14,
          ease: "power3.out",
          clearProps: "opacity,transform",
        }
      );
    }, chartsRef);

    return () => ctx.revert();
  }, []);

  const activityData =
    analytics.weekly_activity.length > 0
      ? analytics.weekly_activity
      : [
          { day: "Mon", resumes: 0 },
          { day: "Tue", resumes: 0 },
          { day: "Wed", resumes: 0 },
          { day: "Thu", resumes: 0 },
          { day: "Fri", resumes: 0 },
          { day: "Sat", resumes: 0 },
          { day: "Sun", resumes: 0 },
        ];

  const templateUsageData =
    analytics.template_usage.length > 0
      ? analytics.template_usage
      : [
          {
            name: "No Usage",
            value: 1,
            color: "#374151",
          },
        ];

  const completionPercentage = analytics.completion_percentage || 0;

  const isLoading = loading || analyticsLoading;

  return (
    <div
      ref={chartsRef}
      className="grid w-full min-w-0 gap-5 overflow-hidden xl:grid-cols-[1.6fr_1fr] xl:gap-6"
    >
      <div className="chart-card w-full min-w-0 rounded-[28px] border border-white/10 bg-white/[0.05] p-4 shadow-2xl shadow-black/30 backdrop-blur-2xl sm:rounded-[32px] sm:p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <p className="text-[11px] uppercase tracking-[0.25em] text-cyan-300 sm:text-xs">
              Analytics
            </p>

            <h2 className="mt-2 text-xl font-extrabold sm:text-2xl">
              Resume Activity
            </h2>

            <p className="mt-2 text-xs leading-relaxed text-gray-400 sm:text-sm">
              Real weekly resume creation activity from backend.
            </p>
          </div>

          <div className="shrink-0 rounded-2xl border border-cyan-300/20 bg-cyan-300/10 px-3 py-2 sm:px-4">
            <p className="text-[10px] font-semibold text-cyan-300 sm:text-xs">
              Real Data
            </p>
          </div>
        </div>

        <div className="mt-6 h-[260px] w-full min-w-0 sm:mt-8 sm:h-[320px]">
          {isLoading ? (
            <div className="flex h-full items-center justify-center text-sm text-gray-400">
              Loading chart...
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%" minWidth={0}>
              <AreaChart data={activityData}>
                <defs>
                  <linearGradient
                    id="resumeGradient"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="0%" stopColor="#22d3ee" stopOpacity={0.7} />

                    <stop offset="100%" stopColor="#22d3ee" stopOpacity={0} />
                  </linearGradient>
                </defs>

                <CartesianGrid
                  stroke="rgba(255,255,255,0.06)"
                  vertical={false}
                />

                <XAxis
                  dataKey="day"
                  tick={{
                    fill: "#9ca3af",
                    fontSize: 11,
                  }}
                  axisLine={false}
                  tickLine={false}
                />

                <Tooltip
                  contentStyle={{
                    background: "#0f172a",
                    border: "1px solid rgba(255,255,255,0.08)",
                    borderRadius: "16px",
                    color: "#fff",
                  }}
                />

                <Area
                  type="monotone"
                  dataKey="resumes"
                  stroke="#22d3ee"
                  strokeWidth={3}
                  fill="url(#resumeGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      <div className="w-full min-w-0 space-y-5 xl:space-y-6">
        <div className="chart-card w-full min-w-0 rounded-[28px] border border-white/10 bg-white/[0.05] p-4 shadow-2xl shadow-black/30 backdrop-blur-2xl sm:rounded-[32px] sm:p-6">
          <div>
            <p className="text-[11px] uppercase tracking-[0.25em] text-purple-300 sm:text-xs">
              Templates
            </p>

            <h2 className="mt-2 text-lg font-extrabold sm:text-xl">
              Template Usage
            </h2>
          </div>

          <div className="mt-5 h-[190px] w-full min-w-0 sm:mt-6 sm:h-[220px]">
            {isLoading ? (
              <div className="flex h-full items-center justify-center text-sm text-gray-400">
                Loading chart...
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                <PieChart>
                  <Pie
                    data={templateUsageData}
                    innerRadius={55}
                    outerRadius={82}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {templateUsageData.map((entry) => (
                      <Cell key={entry.name} fill={entry.color} />
                    ))}
                  </Pie>

                  <Tooltip
                    contentStyle={{
                      background: "#0f172a",
                      border: "1px solid rgba(255,255,255,0.08)",
                      borderRadius: "16px",
                      color: "#fff",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>

          <div className="mt-4 space-y-3">
            {templateUsageData.map((item) => (
              <div key={item.name} className="flex items-center justify-between">
                <div className="flex min-w-0 items-center gap-2">
                  <div
                    className="h-3 w-3 shrink-0 rounded-full"
                    style={{
                      backgroundColor: item.color,
                    }}
                  />

                  <span className="truncate text-sm text-gray-300">
                    {item.name}
                  </span>
                </div>

                <span className="shrink-0 text-sm font-semibold text-white">
                  {item.name === "No Usage" ? 0 : item.value}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="chart-card w-full min-w-0 rounded-[28px] border border-white/10 bg-gradient-to-br from-cyan-500/10 via-blue-500/10 to-purple-500/10 p-4 shadow-2xl shadow-black/30 backdrop-blur-2xl sm:rounded-[32px] sm:p-6">
          <p className="text-[11px] uppercase tracking-[0.25em] text-cyan-300 sm:text-xs">
            Progress
          </p>

          <h2 className="mt-2 text-lg font-extrabold sm:text-xl">
            Resume Completion
          </h2>

          <div className="mt-5 flex items-center justify-center sm:mt-6">
            <div className="relative flex h-36 w-36 items-center justify-center rounded-full border-[9px] border-cyan-400/20 sm:h-40 sm:w-40 sm:border-[10px]">
              <div
                className="absolute inset-0 rounded-full border-[9px] border-cyan-300 border-t-transparent sm:border-[10px]"
                style={{
                  transform: `rotate(${completionPercentage * 3.6}deg)`,
                }}
              />

              <div className="text-center">
                <h3 className="text-3xl font-extrabold text-white sm:text-4xl">
                  {isLoading ? "--" : `${completionPercentage}%`}
                </h3>

                <p className="mt-1 text-xs text-gray-400">Completed</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}