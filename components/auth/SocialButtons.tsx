"use client";

import Image from "next/image";

const API_BASE = "http://127.0.0.1:8000";

type SocialButtonsProps = {
  mode: "login" | "register";
};

export default function SocialButtons({
  mode,
}: SocialButtonsProps) {
  const handleGoogleAuth = () => {
    window.location.href =
      `${API_BASE}/api/auth/google/login`;
  };

  return (
    <div className="mt-6 flex justify-center">
      <button
        type="button"
        onClick={handleGoogleAuth}
        className="group flex w-full max-w-[270px] items-center justify-center gap-3 rounded-full border border-white/15 bg-white px-5 py-3 text-sm font-semibold text-black shadow-lg shadow-black/20 transition-all duration-200 ease-out hover:scale-[1.02] hover:bg-gray-100 hover:shadow-white/10 active:scale-[0.98]"
      >
        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-white">
          <Image
            src="https://www.svgrepo.com/show/475656/google-color.svg"
            alt="Google"
            width={18}
            height={18}
            className="h-[18px] w-[18px]"
          />
        </div>

        <span>
          {mode === "login"
            ? "Continue with Google"
            : "Sign up with Google"}
        </span>
      </button>
    </div>
  );
}