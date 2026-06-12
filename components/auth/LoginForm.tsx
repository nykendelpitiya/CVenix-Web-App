"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Eye, EyeOff, Lock, Mail } from "lucide-react";
import { useState } from "react";
import AuthLayout from "./AuthLayout";
import SocialButtons from "./SocialButtons";

const API_BASE = "http://localhost:8000";
const LOGO_IMAGE = "/cvenix-logo.png";

export default function LoginForm() {
  const router = useRouter();

  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setError("");

    if (!loginEmail || !loginPassword) {
      setError("Please enter email and password.");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch(`${API_BASE}/api/auth/login`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: loginEmail,
          password: loginPassword,
          remember_me: rememberMe,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.detail || "Login failed. Please try again.");

        return;
      }

      if (data.user?.role === "admin") {
        router.push("/admin/dashboard");
      } else {
        router.push("/dashboard");
      }

      router.refresh();
    } catch {
      setError("Server connection failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Login"
      subtitle="Continue to your dashboard."
      sideTitle="New Here?"
      sideText="Create your account and start building your professional CV."
      sideButtonText="Register"
      sideButtonHref="/register"
    >
      <div className="mx-auto w-full max-w-[350px]">
        <div className="mb-6 flex items-center justify-between gap-4">
          <Link
            href="/"
            prefetch={true}
            scroll={false}
            className="flex min-w-0 items-center gap-3 transition-opacity hover:opacity-90"
          >
            <div className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-full bg-white shadow-lg shadow-white/20">
              <img
                src={LOGO_IMAGE}
                alt="CVenix Logo"
                className="h-10 w-10 object-cover"
              />
            </div>

            <span className="truncate text-base font-bold tracking-wide text-white">
              CVenix
            </span>
          </Link>

          <Link
            href="/"
            prefetch={true}
            scroll={false}
            className="inline-flex shrink-0 items-center gap-2 rounded-full border border-white/10 bg-white/[0.05] px-3 py-2 text-xs font-semibold text-gray-300 transition hover:bg-white/10 hover:text-white"
          >
            <ArrowLeft size={14} />
            Home
          </Link>
        </div>

        <SocialButtons mode="login" />

        <div className="my-5 flex items-center gap-3 text-xs text-gray-400">
          <div className="h-px flex-1 bg-white/15" />

          <span>OR</span>

          <div className="h-px flex-1 bg-white/15" />
        </div>

        {error && (
          <p className="mb-4 rounded-2xl border border-red-400/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
            {error}
          </p>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="group flex h-[56px] items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.07] px-4 transition-colors duration-200 focus-within:border-white/40 focus-within:bg-white/[0.1]">
            <Mail
              size={18}
              className="shrink-0 text-gray-400 group-focus-within:text-white"
            />

            <input
              type="email"
              value={loginEmail}
              onChange={(e) => setLoginEmail(e.target.value)}
              placeholder="Email"
              className="w-full min-w-0 bg-transparent text-sm text-white outline-none placeholder:text-gray-500"
            />
          </div>

          <div className="group flex h-[56px] items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.07] px-4 transition-colors duration-200 focus-within:border-white/40 focus-within:bg-white/[0.1]">
            <Lock
              size={18}
              className="shrink-0 text-gray-400 group-focus-within:text-white"
            />

            <input
              type={showLoginPassword ? "text" : "password"}
              value={loginPassword}
              onChange={(e) => setLoginPassword(e.target.value)}
              placeholder="Password"
              className="w-full min-w-0 bg-transparent text-sm text-white outline-none placeholder:text-gray-500"
            />

            <button
              type="button"
              onClick={() => setShowLoginPassword(!showLoginPassword)}
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-gray-300 transition-colors duration-200 hover:bg-white/10 hover:text-white"
              aria-label={showLoginPassword ? "Hide password" : "Show password"}
            >
              {showLoginPassword ? <EyeOff size={17} /> : <Eye size={17} />}
            </button>
          </div>

          <div className="flex items-center justify-between gap-4 text-xs sm:text-sm">
            <label className="flex min-w-0 items-center gap-2 text-gray-300">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="accent-white"
              />

              <span className="truncate">Remember me</span>
            </label>

            <Link
              href="#"
              scroll={false}
              className="shrink-0 font-medium text-gray-300 transition-colors duration-200 hover:text-white"
            >
              Forgot password?
            </Link>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-full bg-white py-3 text-sm font-bold text-black shadow-lg shadow-white/20 transition duration-200 ease-out hover:scale-[1.02] hover:bg-gray-200 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-300 md:hidden">
          Don&apos;t have an account?{" "}
          <Link
            href="/register"
            prefetch={true}
            scroll={false}
            className="font-semibold text-white transition-colors duration-200 hover:text-gray-200"
          >
            Register
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
}