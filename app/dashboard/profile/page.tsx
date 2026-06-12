"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import {
  Camera,
  ImageIcon,
  Lock,
  Mail,
  Save,
  Trash2,
  User,
} from "lucide-react";

import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import DashboardTopBar from "@/components/dashboard/DashboardTopBar";

const API_BASE = "http://localhost:8000";

type ProfileUser = {
  id: number;
  full_name: string;
  email: string;
  profile_image_url: string | null;
  role: string;
};

export default function ProfilePage() {
  const [user, setUser] = useState<ProfileUser | null>(null);

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [profileImage, setProfileImage] = useState("");

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [photoMenuOpen, setPhotoMenuOpen] = useState(false);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [passwordSaving, setPasswordSaving] = useState(false);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(`${API_BASE}/api/auth/me`, {
          method: "GET",
          credentials: "include",
        });

        if (!response.ok) {
          setError("Failed to load profile.");
          return;
        }

        const data: ProfileUser = await response.json();

        setUser(data);
        setFullName(data.full_name);
        setEmail(data.email);
        setProfileImage(data.profile_image_url || "");
      } catch {
        setError("Backend connection failed.");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleProfileImageChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];

    if (!file) return;

    const validTypes = ["image/jpeg", "image/png", "image/webp"];

    if (!validTypes.includes(file.type)) {
      setError("Please select a JPG, PNG, or WEBP image.");
      return;
    }

    const reader = new FileReader();

    reader.onloadend = () => {
      setProfileImage(reader.result as string);
      setPhotoMenuOpen(false);
      setError("");
      setMessage("");
    };

    reader.readAsDataURL(file);
  };

  const handleRemovePhoto = () => {
    setProfileImage("");
    setPhotoMenuOpen(false);
    setMessage("");
    setError("");
  };

  const handleSaveProfile = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    setMessage("");
    setError("");

    if (!fullName || !email) {
      setError("Please fill full name and email.");
      return;
    }

    try {
      setSaving(true);

      const response = await fetch(`${API_BASE}/api/auth/profile`, {
        method: "PUT",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          full_name: fullName,
          email,
          profile_image_url: profileImage || null,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.detail || "Profile update failed.");
        return;
      }

      setUser(data);
      setFullName(data.full_name);
      setEmail(data.email);
      setProfileImage(data.profile_image_url || "");
      setMessage("Profile updated successfully.");
    } catch {
      setError("Profile update failed.");
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    setMessage("");
    setError("");

    if (!currentPassword || !newPassword || !confirmPassword) {
      setError("Please fill all password fields.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("New password and confirm password do not match.");
      return;
    }

    try {
      setPasswordSaving(true);

      const response = await fetch(
        `${API_BASE}/api/auth/change-password`,
        {
          method: "PUT",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            current_password: currentPassword,
            new_password: newPassword,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(data.detail || "Password change failed.");
        return;
      }

      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");

      setMessage("Password changed successfully.");

      setTimeout(() => {
        setMessage("");
      }, 3000);
    } catch {
      setError("Failed to change password.");
    } finally {
      setPasswordSaving(false);
    }
  };

  const initial =
    fullName.trim().charAt(0).toUpperCase() ||
    user?.full_name?.charAt(0).toUpperCase() ||
    "U";

  return (
    <main className="min-h-screen bg-[#02030a] text-white">
      <div className="flex">
        <DashboardSidebar />

        <section className="min-h-screen flex-1 px-4 py-5 lg:ml-72 lg:px-8">
          <DashboardTopBar />

          <div className="mt-8">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-cyan-300">
              Profile
            </p>

            <h1 className="mt-3 text-3xl font-extrabold">My Profile</h1>

            <p className="mt-2 text-gray-400">
              View and manage your CVenix account details.
            </p>

            {loading && (
              <div className="mt-8 rounded-3xl border border-white/10 bg-white/5 p-8 text-gray-400">
                Loading profile...
              </div>
            )}

            {!loading && (
              <>
                {error && (
                  <div className="mt-6 rounded-2xl border border-red-400/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
                    {error}
                  </div>
                )}

                {message && (
                  <div className="mt-6 rounded-2xl border border-green-400/20 bg-green-500/10 px-4 py-3 text-sm text-green-300">
                    {message}
                  </div>
                )}
              </>
            )}

            {!loading && (
              <div className="mt-8 grid gap-6 xl:grid-cols-[0.75fr_1.25fr]">
                <div className="h-fit rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl shadow-black/30 backdrop-blur-xl">
                  <div className="flex flex-col items-center text-center">
                    <div className="flex h-32 w-32 items-center justify-center overflow-hidden rounded-full border border-white/10 bg-white text-4xl font-extrabold text-black shadow-xl shadow-black/30 sm:h-36 sm:w-36">
                      {profileImage ? (
                        <Image
                          src={profileImage}
                          alt="Profile"
                          width={144}
                          height={144}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        initial
                      )}
                    </div>

                    <div className="relative mt-4">
                      <button
                        type="button"
                        onClick={() =>
                          setPhotoMenuOpen((prev) => !prev)
                        }
                        className="inline-flex items-center gap-2 rounded-full border border-cyan-300/20 bg-cyan-300/10 px-5 py-2 text-sm font-bold text-cyan-300 transition hover:bg-cyan-300/20"
                      >
                        <Camera size={17} />
                        Edit Photo
                      </button>

                      {photoMenuOpen && (
                        <div className="absolute left-1/2 top-12 z-30 w-64 -translate-x-1/2 overflow-hidden rounded-2xl border border-white/10 bg-[#11131c] p-2 text-left shadow-2xl shadow-black/40 backdrop-blur-xl">
                          <label className="flex cursor-pointer items-center justify-between rounded-xl px-3 py-3 text-sm font-semibold text-gray-200 transition hover:bg-white/10">
                            <span className="flex items-center gap-3">
                              <ImageIcon size={18} />
                              Upload New Photo
                            </span>

                            <Camera size={18} />

                            <input
                              type="file"
                              accept="image/jpeg,image/png,image/webp"
                              onChange={handleProfileImageChange}
                              className="hidden"
                            />
                          </label>

                          <button
                            type="button"
                            onClick={handleRemovePhoto}
                            className="mt-1 flex w-full items-center justify-between rounded-xl px-3 py-3 text-sm font-semibold text-red-300 transition hover:bg-red-500/10"
                          >
                            <span className="flex items-center gap-3">
                              <Trash2 size={18} />
                              Remove Current Photo
                            </span>

                            <Trash2 size={18} />
                          </button>
                        </div>
                      )}
                    </div>

                    <h2 className="mt-5 text-2xl font-extrabold">
                      {fullName || "User"}
                    </h2>

                    <p className="mt-2 max-w-full truncate text-sm text-gray-400">
                      {email}
                    </p>

                    <span className="mt-4 rounded-full border border-cyan-300/20 bg-cyan-300/10 px-4 py-2 text-xs font-bold uppercase tracking-widest text-cyan-300">
                      {user?.role || "user"}
                    </span>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="rounded-3xl border border-white/10 bg-white/5 p-5 shadow-2xl shadow-black/30 backdrop-blur-xl sm:p-6">
                    <h2 className="text-xl font-bold">
                      Account Information
                    </h2>

                    <p className="mt-1 text-sm text-gray-400">
                      Update your basic account information.
                    </p>

                    <form
                      onSubmit={handleSaveProfile}
                      className="mt-6 space-y-5"
                    >
                      <div>
                        <label className="mb-2 block text-sm text-gray-300">
                          Full Name
                        </label>

                        <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-black/20 px-4 py-3">
                          <User size={18} className="shrink-0 text-gray-400" />

                          <input
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            className="w-full bg-transparent text-sm text-white outline-none"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="mb-2 block text-sm text-gray-300">
                          Email
                        </label>

                        <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-black/20 px-4 py-3">
                          <Mail size={18} className="shrink-0 text-gray-400" />

                          <input
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full bg-transparent text-sm text-white outline-none"
                          />
                        </div>
                      </div>

                      <button
                        type="submit"
                        disabled={saving}
                        className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-white px-6 py-3 font-bold text-black transition hover:bg-gray-200 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
                      >
                        <Save size={18} />
                        {saving ? "Saving..." : "Save Changes"}
                      </button>
                    </form>
                  </div>

                  <div className="rounded-3xl border border-white/10 bg-white/5 p-5 shadow-2xl shadow-black/30 backdrop-blur-xl sm:p-6">
                    <h2 className="text-xl font-bold">Security</h2>

                    <p className="mt-1 text-sm text-gray-400">
                      Change your account password.
                    </p>

                    <form
                      onSubmit={handleChangePassword}
                      className="mt-6 space-y-5"
                    >
                      <div>
                        <label className="mb-2 block text-sm text-gray-300">
                          Current Password
                        </label>

                        <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-black/20 px-4 py-3">
                          <Lock size={18} className="shrink-0 text-gray-400" />

                          <input
                            type="password"
                            value={currentPassword}
                            onChange={(e) =>
                              setCurrentPassword(e.target.value)
                            }
                            className="w-full bg-transparent text-sm text-white outline-none"
                          />
                        </div>
                      </div>

                      <div className="grid gap-5 md:grid-cols-2">
                        <div>
                          <label className="mb-2 block text-sm text-gray-300">
                            New Password
                          </label>

                          <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-black/20 px-4 py-3">
                            <Lock
                              size={18}
                              className="shrink-0 text-gray-400"
                            />

                            <input
                              type="password"
                              value={newPassword}
                              onChange={(e) =>
                                setNewPassword(e.target.value)
                              }
                              className="w-full bg-transparent text-sm text-white outline-none"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="mb-2 block text-sm text-gray-300">
                            Confirm Password
                          </label>

                          <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-black/20 px-4 py-3">
                            <Lock
                              size={18}
                              className="shrink-0 text-gray-400"
                            />

                            <input
                              type="password"
                              value={confirmPassword}
                              onChange={(e) =>
                                setConfirmPassword(e.target.value)
                              }
                              className="w-full bg-transparent text-sm text-white outline-none"
                            />
                          </div>
                        </div>
                      </div>

                      <button
                        type="submit"
                        disabled={passwordSaving}
                        className="inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-cyan-300/20 bg-cyan-300/10 px-6 py-3 font-bold text-cyan-300 transition hover:bg-cyan-300/20 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
                      >
                        <Lock size={18} />
                        {passwordSaving ? "Changing..." : "Change Password"}
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}