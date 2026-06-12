"use client";

import { useEffect, useState } from "react";
import { Bell, Plus, Trash2 } from "lucide-react";

import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminTopBar from "@/components/admin/AdminTopBar";

const API_BASE = "http://localhost:8000";

type Notification = {
  id: number;
  title: string;
  message: string;
  type: string;
  is_read: boolean;
  is_active: boolean;
};

export default function AdminNotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const [title, setTitle] = useState("");
  const [messageText, setMessageText] = useState("");
  const [type, setType] = useState("info");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(`${API_BASE}/api/notifications/`, {
        method: "GET",
        credentials: "include",
      });

      if (!response.ok) {
        setError("Failed to load notifications.");
        return;
      }

      const data: Notification[] = await response.json();

      setNotifications(data);
    } catch {
      setError("Backend connection failed.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void (async () => {
      await fetchNotifications();
    })();
  }, []);

  const handleCreateNotification = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (!title || !messageText) {
      setError("Please fill title and message.");
      return;
    }

    try {
      setSaving(true);

      const response = await fetch(`${API_BASE}/api/notifications/`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          message: messageText,
          type,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.detail || "Notification creation failed.");
        return;
      }

      setTitle("");
      setMessageText("");
      setType("info");
      setSuccess("Notification created successfully.");

      await fetchNotifications();
    } catch {
      setError("Backend connection failed.");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteNotification = async (notificationId: number) => {
    const confirmDelete = confirm(
      "Are you sure you want to delete this notification?"
    );

    if (!confirmDelete) return;

    try {
      const response = await fetch(
        `${API_BASE}/api/notifications/${notificationId}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );

      if (!response.ok) {
        alert("Notification delete failed.");
        return;
      }

      setNotifications((prev) =>
        prev.filter((notification) => notification.id !== notificationId)
      );
    } catch {
      alert("Backend connection failed.");
    }
  };

  return (
    <main className="min-h-screen bg-[#02030a] text-white">
      <div className="flex">
        <AdminSidebar />

        <section className="flex-1 px-4 py-5 lg:ml-72 lg:px-8">
          <AdminTopBar />

          <div className="mt-8">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-cyan-300">
              Notification Management
            </p>

            <h1 className="mt-3 text-3xl font-extrabold">
              Notifications
            </h1>

            <p className="mt-2 text-gray-400">
              Create and manage platform notifications for users.
            </p>

            <div className="mt-8 grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
              <div className="rounded-3xl border border-white/10 bg-white/[0.05] p-6 shadow-2xl shadow-black/30 backdrop-blur-xl">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-black">
                    <Plus size={22} />
                  </div>

                  <div>
                    <h2 className="text-xl font-bold">
                      Create Notification
                    </h2>

                    <p className="mt-1 text-sm text-gray-400">
                      Send an update to user dashboards.
                    </p>
                  </div>
                </div>

                {error && (
                  <div className="mt-5 rounded-2xl border border-red-400/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
                    {error}
                  </div>
                )}

                {success && (
                  <div className="mt-5 rounded-2xl border border-green-400/20 bg-green-500/10 px-4 py-3 text-sm text-green-300">
                    {success}
                  </div>
                )}

                <form
                  onSubmit={handleCreateNotification}
                  className="mt-6 space-y-5"
                >
                  <div>
                    <label className="mb-2 block text-sm text-gray-300">
                      Title
                    </label>

                    <input
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="New template available"
                      className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm outline-none transition focus:border-cyan-300/40"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm text-gray-300">
                      Type
                    </label>

                    <select
                      value={type}
                      onChange={(e) => setType(e.target.value)}
                      className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm outline-none transition focus:border-cyan-300/40"
                    >
                      <option className="bg-[#02030a]" value="info">
                        info
                      </option>

                      <option className="bg-[#02030a]" value="template">
                        template
                      </option>

                      <option className="bg-[#02030a]" value="system">
                        system
                      </option>

                      <option className="bg-[#02030a]" value="success">
                        success
                      </option>
                    </select>
                  </div>

                  <div>
                    <label className="mb-2 block text-sm text-gray-300">
                      Message
                    </label>

                    <textarea
                      value={messageText}
                      onChange={(e) => setMessageText(e.target.value)}
                      placeholder="Write notification message..."
                      className="h-32 w-full resize-none rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm outline-none transition focus:border-cyan-300/40"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={saving}
                    className="inline-flex items-center gap-2 rounded-2xl bg-white px-6 py-3 font-bold text-black transition hover:bg-gray-200 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    <Bell size={18} />
                    {saving ? "Sending..." : "Create Notification"}
                  </button>
                </form>
              </div>

              <div className="rounded-3xl border border-white/10 bg-white/[0.05] p-6 shadow-2xl shadow-black/30 backdrop-blur-xl">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-bold">
                      All Notifications
                    </h2>

                    <p className="mt-1 text-sm text-gray-400">
                      View and remove user notifications.
                    </p>
                  </div>

                  <div className="rounded-full border border-cyan-300/20 bg-cyan-300/10 px-4 py-2 text-sm font-bold text-cyan-300">
                    {notifications.length}
                  </div>
                </div>

                {loading && (
                  <div className="mt-6 rounded-2xl border border-white/10 bg-black/20 p-5 text-sm text-gray-400">
                    Loading notifications...
                  </div>
                )}

                {!loading && notifications.length === 0 && (
                  <div className="mt-6 rounded-2xl border border-dashed border-white/10 bg-black/20 p-8 text-center text-sm text-gray-500">
                    No notifications available.
                  </div>
                )}

                {!loading && notifications.length > 0 && (
                  <div className="mt-6 space-y-3">
                    {notifications.map((notification) => (
                      <div
                        key={notification.id}
                        className="rounded-2xl border border-white/10 bg-black/20 p-4 transition hover:bg-black/30"
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <span
                                className={`h-2.5 w-2.5 rounded-full ${
                                  notification.is_read
                                    ? "bg-gray-600"
                                    : "bg-cyan-300"
                                }`}
                              />

                              <h3 className="font-semibold">
                                {notification.title}
                              </h3>
                            </div>

                            <p className="mt-2 text-sm leading-6 text-gray-400">
                              {notification.message}
                            </p>

                            <span className="mt-3 inline-flex rounded-full border border-white/10 px-3 py-1 text-[10px] uppercase tracking-widest text-cyan-300">
                              {notification.type}
                            </span>
                          </div>

                          <button
                            onClick={() =>
                              handleDeleteNotification(notification.id)
                            }
                            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-red-400/20 bg-red-500/10 text-red-300 transition hover:bg-red-500/20"
                          >
                            <Trash2 size={17} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}