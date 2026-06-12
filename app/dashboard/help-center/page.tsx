"use client";

import { useEffect, useState } from "react";
import {
  Clock,
  HelpCircle,
  Loader2,
  MessageSquare,
  RefreshCw,
  Send,
} from "lucide-react";

import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import DashboardTopBar from "@/components/dashboard/DashboardTopBar";

const API_BASE = "http://localhost:8000";

type SupportReply = {
  id: number;
  message_id: number;
  admin_id: number;
  reply: string;
  is_read_by_user: boolean;
  created_at: string;
};

type SupportMessage = {
  id: number;
  user_id: number;
  subject: string;
  message: string;
  status: string;
  is_read_by_admin: boolean;
  created_at: string;
  replies: SupportReply[];
};

export default function HelpCenterPage() {
  const [messages, setMessages] = useState<SupportMessage[]>([]);

  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");

  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const fetchMessages = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(`${API_BASE}/api/support/my-messages`, {
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

  const handleSendMessage = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (!subject || !message) {
      setError("Please fill subject and message.");
      return;
    }

    try {
      setSending(true);

      const response = await fetch(`${API_BASE}/api/support/send`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          subject,
          message,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.detail || "Message sending failed.");
        return;
      }

      setSubject("");
      setMessage("");
      setSuccess("Your message was sent successfully.");

      await fetchMessages();

      setTimeout(() => {
        setSuccess("");
      }, 3000);
    } catch {
      setError("Backend connection failed.");
    } finally {
      setSending(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#02030a] text-white">
      <div className="flex">
        <DashboardSidebar />

        <section className="min-h-screen flex-1 px-4 py-5 lg:ml-72 lg:px-8">
          <DashboardTopBar />

          <div className="mt-8">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-cyan-300">
              Help Center
            </p>

            <h1 className="mt-3 text-3xl font-extrabold">
              Get Support
            </h1>

            <p className="mt-2 text-gray-400">
              Send a message to the CVenix admin team and view your replies.
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
              <div className="h-fit rounded-3xl border border-white/10 bg-white/[0.05] p-6 shadow-2xl shadow-black/30 backdrop-blur-xl">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-black">
                    <HelpCircle size={22} />
                  </div>

                  <div>
                    <h2 className="text-xl font-bold">
                      Contact Support
                    </h2>

                    <p className="mt-1 text-sm text-gray-400">
                      Tell us about your issue or question.
                    </p>
                  </div>
                </div>

                <form onSubmit={handleSendMessage} className="mt-6 space-y-5">
                  <div>
                    <label className="mb-2 block text-sm text-gray-300">
                      Subject
                    </label>

                    <input
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      placeholder="Example: Resume download issue"
                      className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm outline-none transition placeholder:text-gray-500 focus:border-cyan-300/40"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm text-gray-300">
                      Message
                    </label>

                    <textarea
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Write your message..."
                      className="h-36 w-full resize-none rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm outline-none transition placeholder:text-gray-500 focus:border-cyan-300/40"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={sending}
                    className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-white px-6 py-3 font-bold text-black transition hover:bg-gray-200 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
                  >
                    {sending ? (
                      <Loader2 size={18} className="animate-spin" />
                    ) : (
                      <Send size={18} />
                    )}

                    {sending ? "Sending..." : "Send Message"}
                  </button>
                </form>
              </div>

              <div className="rounded-3xl border border-white/10 bg-white/[0.05] p-6 shadow-2xl shadow-black/30 backdrop-blur-xl">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <h2 className="text-xl font-bold">
                      My Messages
                    </h2>

                    <p className="mt-1 text-sm text-gray-400">
                      View your support history and admin replies.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={fetchMessages}
                    className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-gray-200 transition hover:bg-white/10"
                  >
                    <RefreshCw size={18} />
                  </button>
                </div>

                {loading && (
                  <div className="mt-6 flex items-center gap-3 rounded-2xl border border-white/10 bg-black/20 p-5 text-sm text-gray-400">
                    <Loader2 size={18} className="animate-spin" />
                    Loading messages...
                  </div>
                )}

                {!loading && messages.length === 0 && (
                  <div className="mt-6 rounded-2xl border border-dashed border-white/10 bg-black/20 p-8 text-center">
                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-black">
                      <MessageSquare size={24} />
                    </div>

                    <h3 className="mt-5 text-lg font-bold">
                      No messages yet
                    </h3>

                    <p className="mt-2 text-sm text-gray-500">
                      Your sent help messages and admin replies will appear here.
                    </p>
                  </div>
                )}

                {!loading && messages.length > 0 && (
                  <div className="mt-6 space-y-4">
                    {messages.map((item) => (
                      <div
                        key={item.id}
                        className="rounded-2xl border border-white/10 bg-black/20 p-4 transition hover:bg-black/30"
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <span
                                className={`h-2.5 w-2.5 rounded-full ${
                                  item.status === "replied"
                                    ? "bg-green-300"
                                    : "bg-cyan-300"
                                }`}
                              />

                              <h3 className="font-semibold">
                                {item.subject}
                              </h3>
                            </div>

                            <div className="mt-2 flex items-center gap-2 text-xs text-gray-500">
                              <Clock size={14} />
                              {new Date(item.created_at).toLocaleString()}
                            </div>
                          </div>

                          <span
                            className={`shrink-0 rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-widest ${
                              item.status === "replied"
                                ? "border border-green-400/20 bg-green-500/10 text-green-300"
                                : "border border-cyan-400/20 bg-cyan-500/10 text-cyan-300"
                            }`}
                          >
                            {item.status}
                          </span>
                        </div>

                        <p className="mt-4 whitespace-pre-wrap text-sm leading-6 text-gray-300">
                          {item.message}
                        </p>

                        {item.replies.length > 0 && (
                          <div className="mt-5 space-y-3">
                            {item.replies.map((reply) => (
                              <div
                                key={reply.id}
                                className="rounded-2xl border border-cyan-300/10 bg-cyan-300/5 p-4"
                              >
                                <p className="text-xs font-bold uppercase tracking-[0.25em] text-cyan-300">
                                  Admin Reply
                                </p>

                                <p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-gray-200">
                                  {reply.reply}
                                </p>

                                <p className="mt-3 text-xs text-gray-500">
                                  {new Date(reply.created_at).toLocaleString()}
                                </p>
                              </div>
                            ))}
                          </div>
                        )}
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