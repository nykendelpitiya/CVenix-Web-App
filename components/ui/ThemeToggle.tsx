import React from "react";
import { useTheme } from "next-themes";

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <button
      aria-label="Toggle theme"
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="inline-flex items-center rounded-full bg-white/5 p-2 text-sm text-gray-200"
    >
      {theme === "dark" ? "🌙" : "☀️"}
    </button>
  );
}
