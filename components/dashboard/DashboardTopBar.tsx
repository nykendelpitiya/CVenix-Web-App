"use client";

import {
  Bell,
  ChevronDown,
  LogOut,
  Menu,
  MessageSquare,
  Search,
  Sparkles,
  User,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import gsap from "gsap";

const API_BASE = "http://localhost:8000";

type UserType = {
  id: number;
  full_name: string;
  email: string;
  profile_image_url: string | null;
};

type Notification = {
  id: number;
  title: string;
  message: string;
  type: string;
  is_read: boolean;
  is_active: boolean;
};

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

type DashboardTopBarProps = {
  onMobileMenuClick?: () => void;
};

export default function DashboardTopBar({
  onMobileMenuClick,
}: DashboardTopBarProps) {
  const topBarRef = useRef<HTMLDivElement | null>(null);
  const router = useRouter();

  const [userName, setUserName] = useState("User");
  const [userEmail, setUserEmail] = useState("");
  const [userInitial, setUserInitial] = useState("U");
  const [profileImageUrl, setProfileImageUrl] = useState("");

  const [profileMenuOpen, setProfileMenuOpen] = useState(false);

  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [notificationLoading, setNotificationLoading] = useState(false);

  const [supportMessages, setSupportMessages] = useState<SupportMessage[]>([]);
  const [messagesOpen, setMessagesOpen] = useState(false);
  const [messagesLoading, setMessagesLoading] = useState(false);

  const unreadCount = notifications.filter(
    (notification) => !notification.is_read
  ).length;

  const unreadReplyCount = supportMessages.reduce((total, message) => {
    const unreadReplies = message.replies.filter(
      (reply) => !reply.is_read_by_user
    ).length;

    return total + unreadReplies;
  }, 0);

  const latestReplies = supportMessages
    .flatMap((message) =>
      message.replies.map((reply) => ({
        ...reply,
        subject: message.subject,
      }))
    )
    .sort(
      (a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );

  const getNotificationTypeLabel = (type: string) => {
    if (type === "support_reply") return "ADMIN REPLY";
    if (type === "support") return "SUPPORT";
    if (type === "template") return "TEMPLATE";
    if (type === "system") return "SYSTEM";
    if (type === "success") return "SUCCESS";

    return type.replaceAll("_", " ").toUpperCase();
  };

  const getNotificationMessage = (notification: Notification) => {
    if (notification.type === "support_reply") {
      return "The CVenix support team replied to your message. Click to view the reply.";
    }

    return notification.message;
  };

  const fetchNotifications = async () => {
    try {
      setNotificationLoading(true);

      const response = await fetch(`${API_BASE}/api/notifications/`, {
        method: "GET",
        credentials: "include",
      });

      if (!response.ok) return;

      const data: Notification[] = await response.json();

      setNotifications(data);
    } catch {
      setNotifications([]);
    } finally {
      setNotificationLoading(false);
    }
  };

  const fetchSupportMessages = async () => {
    try {
      setMessagesLoading(true);

      const response = await fetch(`${API_BASE}/api/support/my-messages`, {
        method: "GET",
        credentials: "include",
      });

      if (!response.ok) return;

      const data: SupportMessage[] = await response.json();

      setSupportMessages(data);
    } catch {
      setSupportMessages([]);
    } finally {
      setMessagesLoading(false);
    }
  };

  const handleToggleNotifications = async () => {
    setNotificationsOpen((prev) => !prev);
    setMessagesOpen(false);
    setProfileMenuOpen(false);

    await fetchNotifications();
  };

  const handleToggleMessages = async () => {
    setMessagesOpen((prev) => !prev);
    setNotificationsOpen(false);
    setProfileMenuOpen(false);

    await fetchSupportMessages();
  };

  const handleMarkAsRead = async (notificationId: number, type: string) => {
    try {
      await fetch(`${API_BASE}/api/notifications/${notificationId}/read`, {
        method: "PUT",
        credentials: "include",
      });

      setNotifications((prev) =>
        prev.map((notification) =>
          notification.id === notificationId
            ? {
                ...notification,
                is_read: true,
              }
            : notification
        )
      );

      if (type === "support_reply") {
        router.push("/dashboard/help-center");
        setNotificationsOpen(false);
      }
    } catch {
      console.log("Notification update failed");
    }
  };

  const handleMarkRepliesRead = async () => {
    try {
      await fetch(`${API_BASE}/api/support/mark-replies-read`, {
        method: "PUT",
        credentials: "include",
      });

      setSupportMessages((prev) =>
        prev.map((message) => ({
          ...message,
          replies: message.replies.map((reply) => ({
            ...reply,
            is_read_by_user: true,
          })),
        }))
      );
    } catch {
      console.log("Reply update failed");
    }
  };

  const handleLogout = async () => {
    try {
      await fetch(`${API_BASE}/api/auth/logout`, {
        method: "POST",
        credentials: "include",
      });
    } catch {
      console.log("Logout request failed");
    } finally {
      router.push("/");
      router.refresh();
    }
  };

  useEffect(() => {
    const fetchLoggedUser = async () => {
      try {
        const response = await fetch(`${API_BASE}/api/auth/me`, {
          method: "GET",
          credentials: "include",
        });

        if (!response.ok) {
          setUserName("User");
          setUserEmail("");
          setUserInitial("U");
          setProfileImageUrl("");
          return;
        }

        const user: UserType = await response.json();

        const firstName = user.full_name?.split(" ")[0] || "User";
        const initial = firstName.charAt(0).toUpperCase() || "U";

        setUserName(firstName);
        setUserEmail(user.email || "");
        setUserInitial(initial);
        setProfileImageUrl(user.profile_image_url || "");
      } catch {
        setUserName("User");
        setUserEmail("");
        setUserInitial("U");
        setProfileImageUrl("");
      }
    };

    (async () => {
      await fetchLoggedUser();
      await fetchNotifications();
      await fetchSupportMessages();
    })();
  }, []);

  useEffect(() => {
    if (!topBarRef.current) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".topbar-item",
        {
          opacity: 0,
          y: -16,
        },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          stagger: 0.08,
          ease: "power3.out",
          clearProps: "opacity,transform",
        }
      );
    }, topBarRef);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={topBarRef}
      className="sticky top-5 z-40 flex items-center justify-between rounded-[28px] border border-white/10 bg-[#10131f]/80 px-4 py-4 shadow-2xl shadow-black/30 backdrop-blur-2xl"
    >
      <div className="topbar-item min-w-0">
        <div className="inline-flex items-center gap-2 rounded-full border border-cyan-300/15 bg-cyan-300/10 px-3 py-1">
          <Sparkles size={13} className="text-cyan-300" />

          <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-cyan-300">
            Dashboard
          </p>
        </div>

        <h1 className="mt-2 truncate text-xl font-extrabold sm:text-2xl">
          Welcome back, {userName}
        </h1>
      </div>

      <div className="topbar-item hidden max-w-md flex-1 items-center gap-3 rounded-full border border-white/10 bg-black/30 px-4 py-3 shadow-inner shadow-black/20 transition focus-within:border-cyan-300/40 md:mx-8 md:flex">
        <Search size={18} className="text-gray-400" />

        <input
          placeholder="Search resumes..."
          className="w-full bg-transparent text-sm text-white outline-none placeholder:text-gray-500"
        />
      </div>

      <div className="topbar-item flex items-center gap-3">
        <div className="relative">
          <button
            onClick={handleToggleNotifications}
            className="relative flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white transition hover:border-cyan-300/30 hover:bg-white/10"
          >
            <Bell size={18} />

            {unreadCount > 0 && (
              <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-cyan-300 px-1 text-[10px] font-extrabold text-black shadow-lg shadow-cyan-300/40">
                {unreadCount}
              </span>
            )}
          </button>

          {notificationsOpen && (
            <div className="absolute right-0 top-14 z-50 w-[340px] overflow-hidden rounded-3xl border border-white/10 bg-[#0b1020] shadow-2xl shadow-black/50 backdrop-blur-2xl max-sm:fixed max-sm:left-4 max-sm:right-4 max-sm:top-28 max-sm:w-auto">
              <div className="border-b border-white/10 px-5 py-4">
                <h3 className="text-sm font-bold text-white">
                  Notifications
                </h3>

                <p className="mt-1 text-xs text-gray-500">
                  Latest CVenix updates
                </p>
              </div>

              <div className="max-h-[360px] overflow-y-auto max-sm:max-h-[420px]">
                {notificationLoading && (
                  <div className="px-5 py-5 text-sm text-gray-400">
                    Loading notifications...
                  </div>
                )}

                {!notificationLoading && notifications.length === 0 && (
                  <div className="px-5 py-8 text-center text-sm text-gray-500">
                    No notifications yet.
                  </div>
                )}

                {!notificationLoading &&
                  notifications.map((notification) => (
                    <button
                      key={notification.id}
                      onClick={() =>
                        handleMarkAsRead(notification.id, notification.type)
                      }
                      className="block w-full border-b border-white/5 px-5 py-4 text-left transition hover:bg-white/[0.04]"
                    >
                      <div className="flex items-start gap-3">
                        <span
                          className={`mt-1 h-2.5 w-2.5 shrink-0 rounded-full ${
                            notification.is_read
                              ? "bg-gray-600"
                              : "bg-cyan-300"
                          }`}
                        />

                        <div className="min-w-0">
                          <h4 className="text-sm font-semibold text-white">
                            {notification.title}
                          </h4>

                          <p className="mt-1 line-clamp-2 text-xs leading-5 text-gray-400">
                            {getNotificationMessage(notification)}
                          </p>

                          <span className="mt-2 inline-flex rounded-full border border-white/10 px-2 py-1 text-[10px] uppercase tracking-widest text-cyan-300">
                            {getNotificationTypeLabel(notification.type)}
                          </span>
                        </div>
                      </div>
                    </button>
                  ))}
              </div>
            </div>
          )}
        </div>

        <div className="relative">
          <button
            onClick={handleToggleMessages}
            className="relative flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white transition hover:border-cyan-300/30 hover:bg-white/10"
          >
            <MessageSquare size={18} />

            {unreadReplyCount > 0 && (
              <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-purple-300 px-1 text-[10px] font-extrabold text-black shadow-lg shadow-purple-300/40">
                {unreadReplyCount}
              </span>
            )}
          </button>

          {messagesOpen && (
            <div className="absolute right-0 top-14 z-50 w-[360px] overflow-hidden rounded-3xl border border-white/10 bg-[#0b1020] shadow-2xl shadow-black/50 backdrop-blur-2xl max-sm:fixed max-sm:left-4 max-sm:right-4 max-sm:top-28 max-sm:w-auto">
              <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
                <div>
                  <h3 className="text-sm font-bold text-white">
                    Help Messages
                  </h3>

                  <p className="mt-1 text-xs text-gray-500">
                    Admin replies and support updates
                  </p>
                </div>

                {unreadReplyCount > 0 && (
                  <button
                    onClick={handleMarkRepliesRead}
                    className="rounded-full border border-cyan-300/20 bg-cyan-300/10 px-3 py-1 text-[10px] font-bold text-cyan-300 transition hover:bg-cyan-300/20"
                  >
                    Mark read
                  </button>
                )}
              </div>

              <div className="max-h-[360px] overflow-y-auto max-sm:max-h-[420px]">
                {messagesLoading && (
                  <div className="px-5 py-5 text-sm text-gray-400">
                    Loading messages...
                  </div>
                )}

                {!messagesLoading && latestReplies.length === 0 && (
                  <div className="px-5 py-8 text-center text-sm text-gray-500">
                    No admin replies yet.
                  </div>
                )}

                {!messagesLoading &&
                  latestReplies.map((reply) => (
                    <button
                      key={reply.id}
                      onClick={() => {
                        router.push("/dashboard/help-center");
                        setMessagesOpen(false);
                      }}
                      className="block w-full border-b border-white/5 px-5 py-4 text-left transition hover:bg-white/[0.04]"
                    >
                      <div className="flex items-start gap-3">
                        <span
                          className={`mt-1 h-2.5 w-2.5 shrink-0 rounded-full ${
                            reply.is_read_by_user
                              ? "bg-gray-600"
                              : "bg-purple-300"
                          }`}
                        />

                        <div className="min-w-0">
                          <h4 className="text-sm font-semibold text-white">
                            {reply.subject}
                          </h4>

                          <p className="mt-1 line-clamp-2 text-xs leading-5 text-gray-400">
                            {reply.reply}
                          </p>

                          <span className="mt-2 inline-flex rounded-full border border-white/10 px-2 py-1 text-[10px] uppercase tracking-widest text-purple-300">
                            admin reply
                          </span>
                        </div>
                      </div>
                    </button>
                  ))}
              </div>

              <Link
                href="/dashboard/help-center"
                onClick={() => setMessagesOpen(false)}
                className="block border-t border-white/10 px-5 py-4 text-center text-xs font-bold text-cyan-300 transition hover:bg-white/[0.04]"
              >
                Open Help Center
              </Link>
            </div>
          )}
        </div>

        <div className="relative hidden sm:block">
          <button
            onClick={() => {
              setProfileMenuOpen((prev) => !prev);
              setNotificationsOpen(false);
              setMessagesOpen(false);
            }}
            className="flex items-center gap-3 rounded-full border border-white/10 bg-white/5 py-1.5 pl-1.5 pr-4 transition hover:border-cyan-300/30 hover:bg-white/10"
          >
            <span className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-full bg-white text-sm font-extrabold text-black">
              {profileImageUrl ? (
                <img
                  src={profileImageUrl}
                  alt={userName}
                  className="h-full w-full object-cover"
                />
              ) : (
                userInitial
              )}
            </span>

            <span className="text-left">
              <span className="block text-sm font-semibold leading-none">
                {userName}
              </span>

              <span className="mt-1 block text-[11px] leading-none text-gray-500">
                Member
              </span>
            </span>

            <ChevronDown
              size={15}
              className={`text-gray-400 transition ${
                profileMenuOpen ? "rotate-180" : ""
              }`}
            />
          </button>

          {profileMenuOpen && (
            <div className="absolute right-0 top-14 z-50 w-[260px] overflow-hidden rounded-3xl border border-white/10 bg-[#0b1020] shadow-2xl shadow-black/50 backdrop-blur-2xl">
              <div className="border-b border-white/10 px-5 py-4">
                <div className="flex items-center gap-3">
                  <span className="flex h-11 w-11 items-center justify-center overflow-hidden rounded-full bg-white text-sm font-extrabold text-black">
                    {profileImageUrl ? (
                      <img
                        src={profileImageUrl}
                        alt={userName}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      userInitial
                    )}
                  </span>

                  <div className="min-w-0">
                    <h3 className="truncate text-sm font-bold text-white">
                      {userName}
                    </h3>

                    <p className="mt-1 truncate text-xs text-gray-500">
                      {userEmail || "Member"}
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-2">
                <Link
                  href="/dashboard/profile"
                  onClick={() => setProfileMenuOpen(false)}
                  className="flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold text-gray-300 transition hover:bg-white/10 hover:text-white"
                >
                  <User size={17} />
                  My Profile
                </Link>

                <button
                  onClick={handleLogout}
                  className="flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold text-red-300 transition hover:bg-red-500/10 hover:text-red-200"
                >
                  <LogOut size={17} />
                  Logout
                </button>
              </div>
            </div>
          )}
        </div>

        <button
          type="button"
          onClick={onMobileMenuClick}
          className="flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white transition hover:bg-white/10 lg:hidden"
          aria-label="Open mobile sidebar"
        >
          <Menu size={18} />
        </button>
      </div>
    </div>
  );
}