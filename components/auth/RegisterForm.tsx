"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Eye, EyeOff, Lock, Mail, User } from "lucide-react";
import { useState } from "react";
import AuthLayout from "./AuthLayout";
import SocialButtons from "./SocialButtons";

const API_BASE = "http://127.0.0.1:8000";
const LOGO_IMAGE = "/cvenix-logo.png";

export default function RegisterForm() {
  const router = useRouter();

  const [fullName, setFullName] = useState("");
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showRegisterPassword, setShowRegisterPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agree, setAgree] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    if (!fullName || !registerEmail || !registerPassword || !confirmPassword) {
      setError("Please fill all fields.");
      return;
    }

    if (registerPassword.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    if (registerPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (!agree) {
      setError("Please agree to the terms and privacy policy.");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch(`${API_BASE}/api/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          full_name: fullName,
          email: registerEmail,
          password: registerPassword,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.detail || "Registration failed. Please try again.");
        return;
      }

      router.push("/login");
    } catch {
      setError("Server connection failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Register"
      subtitle="Create your CVenix account."
      sideTitle="Welcome Back!"
      sideText="Already have an account? Login and continue building professional resumes."
      sideButtonText="Login"
      sideButtonHref="/login"
    >
      <div className="mx-auto w-full max-w-[330px]">
        <div className="mb-4 flex items-center justify-between gap-4">
          <Link
            href="/"
            prefetch={true}
            scroll={false}
            className="flex min-w-0 items-center gap-3 transition-opacity hover:opacity-90"
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-white shadow-lg shadow-white/20">
              <img
                src={LOGO_IMAGE}
                alt="CVenix Logo"
                className="h-9 w-9 object-cover"
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

        <SocialButtons mode="register" />

        <div className="my-4 flex items-center gap-3 text-xs text-gray-400">
          <div className="h-px flex-1 bg-white/15" />

          <span>OR</span>

          <div className="h-px flex-1 bg-white/15" />
        </div>

        {error && (
          <p className="mb-3 rounded-2xl border border-red-400/30 bg-red-500/10 px-4 py-2.5 text-sm text-red-300">
            {error}
          </p>
        )}

        <form onSubmit={handleRegister} className="space-y-3">
          <div className="group flex h-[50px] items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.07] px-4 transition-colors duration-200 focus-within:border-white/40 focus-within:bg-white/[0.1]">
            <User
              size={17}
              className="shrink-0 text-gray-400 group-focus-within:text-white"
            />

            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Full Name"
              className="w-full min-w-0 bg-transparent text-sm text-white outline-none placeholder:text-gray-500"
            />
          </div>

          <div className="group flex h-[50px] items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.07] px-4 transition-colors duration-200 focus-within:border-white/40 focus-within:bg-white/[0.1]">
            <Mail
              size={17}
              className="shrink-0 text-gray-400 group-focus-within:text-white"
            />

            <input
              type="email"
              value={registerEmail}
              onChange={(e) => setRegisterEmail(e.target.value)}
              placeholder="Email"
              className="w-full min-w-0 bg-transparent text-sm text-white outline-none placeholder:text-gray-500"
            />
          </div>

          <div className="group flex h-[50px] items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.07] px-4 transition-colors duration-200 focus-within:border-white/40 focus-within:bg-white/[0.1]">
            <Lock
              size={17}
              className="shrink-0 text-gray-400 group-focus-within:text-white"
            />

            <input
              type={showRegisterPassword ? "text" : "password"}
              value={registerPassword}
              onChange={(e) => setRegisterPassword(e.target.value)}
              placeholder="Password"
              className="w-full min-w-0 bg-transparent text-sm text-white outline-none placeholder:text-gray-500"
            />

            <button
              type="button"
              onClick={() => setShowRegisterPassword(!showRegisterPassword)}
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-gray-300 transition-colors duration-200 hover:bg-white/10 hover:text-white"
              aria-label={
                showRegisterPassword ? "Hide password" : "Show password"
              }
            >
              {showRegisterPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>

          <div className="group flex h-[50px] items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.07] px-4 transition-colors duration-200 focus-within:border-white/40 focus-within:bg-white/[0.1]">
            <Lock
              size={17}
              className="shrink-0 text-gray-400 group-focus-within:text-white"
            />

            <input
              type={showConfirmPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm Password"
              className="w-full min-w-0 bg-transparent text-sm text-white outline-none placeholder:text-gray-500"
            />

            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-gray-300 transition-colors duration-200 hover:bg-white/10 hover:text-white"
              aria-label={
                showConfirmPassword
                  ? "Hide confirm password"
                  : "Show confirm password"
              }
            >
              {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>

          <label className="flex items-start gap-2 text-xs text-gray-300">
            <input
              type="checkbox"
              checked={agree}
              onChange={(e) => setAgree(e.target.checked)}
              className="mt-1 shrink-0 accent-white"
            />

            <span>I agree to the Terms and Privacy Policy.</span>
          </label>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-full bg-white py-3 text-sm font-bold text-black shadow-lg shadow-white/20 transition duration-200 ease-out hover:scale-[1.02] hover:bg-gray-200 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Creating account..." : "Create Account"}
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-gray-300 md:hidden">
          Already have an account?{" "}
          <Link
            href="/login"
            prefetch={true}
            scroll={false}
            className="font-semibold text-white transition-colors duration-200 hover:text-gray-200"
          >
            Login
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
}