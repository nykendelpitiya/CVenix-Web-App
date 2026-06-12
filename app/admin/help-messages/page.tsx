"use client";

import { useEffect, useState } from "react";
import { MessageSquare, RefreshCw, Send, Trash2 } from "lucide-react";

import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminTopBar from "@/components/admin/AdminTopBar";

const API_BASE = "http://localhost:8000";

type SupportReply = {
  id: number;
  message_id: number;
  admin_id: number;
  reply: string;
  is_read_by_user: boolean;
  created_at: string;
};

type SupportUser = {
  id: number;
  full_name: string;
  email: string;
  profile_image_url: string | null;
  role: string;
};

type SupportMessage = {
  id: number;
  user_id: number;
  subject: string;
  message: string;
  status: string;
  is_read_by_admin: boolean;
  created_at: string;
  user: SupportUser;
  replies: SupportReply[];
};

export default function AdminHelpMessagesPage() {
  const [messages, setMessages] = useState<SupportMessage[]>([]);
  const [replyText, setReplyText] = useState<Record<number, string>>({});

  const [loading, setLoading] = useState(true);
  const [replyingId, setReplyingId] = useState<number | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const fetchMessages = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(`${API_BASE}/api/support/admin/messages`, {
        method: "GET",
        credentials: "include",
      });

      if (!response.ok) {
        setError("Failed to load help messages.");
        return;
      }

      const data: SupportMessage[] = await response.json();

      setMessages(data);
    } catch {
      setError("Backend connection failed.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void (async () => {
      await fetchMessages();
    })();
  }, []);

  const handleReplyChange = (messageId: number, value: string) => {
    setReplyText((prev) => ({
      ...prev,
      [messageId]: value,
    }));
  };

  const handleSendReply = async (messageId: number) => {
    const reply = replyText[messageId]?.trim();

    if (!reply) {
      setError("Please enter a reply message.");
      return;
    }

    try {
      setReplyingId(messageId);
      setError("");
      setSuccess("");

      const response = await fetch(
        `${API_BASE}/api/support/admin/reply/${messageId}`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            reply,
          }),
        }
      );

      if (!response.ok) {
        setError("Failed to send reply.");
        return;
      }

      setReplyText((prev) => ({
        ...prev,
        [messageId]: "",
      }));

      setSuccess("Reply sent successfully.");

      await fetchMessages();

      setTimeout(() => {
        setSuccess("");
      }, 3000);
    } catch {
      setError("Backend connection failed.");
    } finally {
      setReplyingId(null);
    }
  };

  const handleDeleteMessage = async (messageId: number) => {
    const confirmDelete = confirm(
      "Are you sure you want to delete this help message?"
    );

    if (!confirmDelete) return;

    try {
      setDeletingId(messageId);
      setError("");
      setSuccess("");

      const response = await fetch(
        `${API_BASE}/api/support/admin/delete/${messageId}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );

      if (!response.ok) {
        setError("Failed to delete message.");
        return;
      }

      setMessages((prev) =>
        prev.filter((message) => message.id !== messageId)
      );

      setSuccess("Help message deleted successfully.");

      setTimeout(() => {
        setSuccess("");
      }, 3000);
    } catch {
      setError("Backend connection failed.");
    } finally {
      setDeletingId(null);
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
              Help Message Management
            </p>

            <h1 className="mt-3 text-3xl font-extrabold">
              Help Messages
            </h1>

            <p className="mt-2 text-gray-400">
              View user help requests and send admin replies.
            </p>

            {error && (
              <div className="mt-6 rounded-2xl border border-red-400/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
                {error}
              </div>
            )}

            {success && (
              <div className="mt-6 rounded-2xl border border-green-400/20 bg-green-500/10 px-4 py-3 text-sm text-green-300">
                {success}
              </div>
            )}

            <div className="mt-8 grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
              <div className="rounded-3xl border border-white/10 bg-white/[0.05] p-6 shadow-2xl shadow-black/30 backdrop-blur-xl">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-black">
                    <MessageSquare size={22} />
                  </div>

                  <div>
                    <h2 className="text-xl font-bold">
                      Support Overview
                    </h2>

                    <p className="mt-1 text-sm text-gray-400">
                      Manage CVenix user support messages.
                    </p>
                  </div>
                </div>

                <div className="mt-6 grid gap-4">
                  <div className="rounded-2xl border border-white/10 bg-black/20 p-5">
                    <p className="text-sm text-gray-400">Total Messages</p>

                    <h3 className="mt-2 text-3xl font-extrabold">
                      {messages.length.toString().padStart(2, "0")}
                    </h3>
                  </div>

                  <div className="rounded-2xl border border-white/10 bg-black/20 p-5">
                    <p className="text-sm text-gray-400">Open Requests</p>

                    <h3 className="mt-2 text-3xl font-extrabold">
                      {messages
                        .filter((message) => message.status !== "replied")
                        .length.toString()
                        .padStart(2, "0")}
                    </h3>
                  </div>

                  <div className="rounded-2xl border border-white/10 bg-black/20 p-5">
                    <p className="text-sm text-gray-400">Replied Requests</p>

                    <h3 className="mt-2 text-3xl font-extrabold">
                      {messages
                        .filter((message) => message.status === "replied")
                        .length.toString()
                        .padStart(2, "0")}
                    </h3>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={fetchMessages}
                  className="mt-6 inline-flex items-center gap-2 rounded-2xl bg-white px-6 py-3 font-bold text-black transition hover:bg-gray-200"
                >
                  <RefreshCw size={18} />
                  Refresh Messages
                </button>
              </div>

              <div className="rounded-3xl border border-white/10 bg-white/[0.05] p-6 shadow-2xl shadow-black/30 backdrop-blur-xl">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-bold">
                      All Help Messages
                    </h2>

                    <p className="mt-1 text-sm text-gray-400">
                      View, reply, and remove user support requests.
                    </p>
                  </div>

                  <div className="rounded-full border border-cyan-300/20 bg-cyan-300/10 px-4 py-2 text-sm font-bold text-cyan-300">
                    {messages.length}
                  </div>
                </div>

                {loading && (
                  <div className="mt-6 rounded-2xl border border-white/10 bg-black/20 p-5 text-sm text-gray-400">
                    Loading help messages...
                  </div>
                )}

                {!loading && messages.length === 0 && (
                  <div className="mt-6 rounded-2xl border border-dashed border-white/10 bg-black/20 p-8 text-center text-sm text-gray-500">
                    No help messages available.
                  </div>
                )}

                {!loading && messages.length > 0 && (
                  <div className="mt-6 space-y-4">
                    {messages.map((message) => (
                      <div
                        key={message.id}
                        className="rounded-2xl border border-white/10 bg-black/20 p-4 transition hover:bg-black/30"
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <span
                                className={`h-2.5 w-2.5 rounded-full ${
                                  message.status === "replied"
                                    ? "bg-green-300"
                                    : "bg-cyan-300"
                                }`}
                              />

                              <h3 className="font-semibold">
                                {message.subject}
                              </h3>
                            </div>

                            <p className="mt-2 text-sm text-gray-400">
                              From {message.user.full_name} • {message.user.email}
                            </p>

                            <p className="mt-1 text-xs text-gray-500">
                              {new Date(message.created_at).toLocaleString()}
                            </p>

                            <p className="mt-4 whitespace-pre-wrap text-sm leading-6 text-gray-300">
                              {message.message}
                            </p>

                            <span className="mt-4 inline-flex rounded-full border border-white/10 px-3 py-1 text-[10px] uppercase tracking-widest text-cyan-300">
                              {message.status}
                            </span>
                          </div>

                          <button
                            onClick={() => handleDeleteMessage(message.id)}
                            disabled={deletingId === message.id}
                            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-red-400/20 bg-red-500/10 text-red-300 transition hover:bg-red-500/20 disabled:cursor-not-allowed disabled:opacity-60"
                          >
                            <Trash2 size={17} />
                          </button>
                        </div>

                        {message.replies.length > 0 && (
                          <div className="mt-5 space-y-3">
                            {message.replies.map((reply) => (
                              <div
                                key={reply.id}
                                className="rounded-2xl border border-cyan-300/10 bg-cyan-300/5 p-4"
                              >
                                <p className="whitespace-pre-wrap text-sm leading-6 text-gray-300">
                                  {reply.reply}
                                </p>

                                <p className="mt-3 text-xs text-gray-500">
                                  {new Date(reply.created_at).toLocaleString()}
                                </p>
                              </div>
                            ))}
                          </div>
                        )}

                        <div className="mt-5">
                          <textarea
                            value={replyText[message.id] || ""}
                            onChange={(e) =>
                              handleReplyChange(message.id, e.target.value)
                            }
                            placeholder="Write admin reply..."
                            className="h-28 w-full resize-none rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm outline-none transition focus:border-cyan-300/40"
                          />

                          <button
                            type="button"
                            onClick={() => handleSendReply(message.id)}
                            disabled={replyingId === message.id}
                            className="mt-3 inline-flex items-center gap-2 rounded-2xl bg-white px-6 py-3 font-bold text-black transition hover:bg-gray-200 disabled:cursor-not-allowed disabled:opacity-60"
                          >
                            <Send size={18} />
                            {replyingId === message.id ? "Sending..." : "Send Reply"}
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