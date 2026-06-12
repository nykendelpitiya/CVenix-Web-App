"use client";

import { useEffect, useState } from "react";
import { ShieldCheck, Trash2, User, UserCog, Users } from "lucide-react";

import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminTopBar from "@/components/admin/AdminTopBar";

const API_BASE = "http://localhost:8000";

type AdminUser = {
  id: number;
  full_name: string;
  email: string;
  role: string;
};

export default function AdminUsersPage() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoadingId, setActionLoadingId] =
    useState<number | null>(null);
  const [error, setError] = useState("");

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(`${API_BASE}/api/admin/users`, {
        method: "GET",
        credentials: "include",
      });

      if (!response.ok) {
        setError("Failed to load users.");
        return;
      }

      const data: AdminUser[] = await response.json();
      setUsers(data);
    } catch {
      setError("Backend connection failed.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      void fetchUsers();
    }, 0);

    return () => clearTimeout(timer);
  }, []);

  const handleMakeAdmin = async (userId: number) => {
    const confirmAction = confirm(
      "Are you sure you want to make this user an admin?"
    );

    if (!confirmAction) return;

    try {
      setActionLoadingId(userId);

      const response = await fetch(
        `${API_BASE}/api/admin/users/${userId}/make-admin`,
        {
          method: "PUT",
          credentials: "include",
        }
      );

      if (!response.ok) {
        alert("Failed to update user role.");
        return;
      }

      await fetchUsers();
    } catch {
      alert("Backend connection failed.");
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleDeleteUser = async (userId: number) => {
    const confirmDelete = confirm(
      "Are you sure you want to delete this user?"
    );

    if (!confirmDelete) return;

    try {
      setActionLoadingId(userId);

      const response = await fetch(
        `${API_BASE}/api/admin/users/${userId}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );

      if (!response.ok) {
        const data = await response.json();
        alert(data.detail || "Failed to delete user.");
        return;
      }

      setUsers((prev) =>
        prev.filter((user) => user.id !== userId)
      );
    } catch {
      alert("Backend connection failed.");
    } finally {
      setActionLoadingId(null);
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
              User Management
            </p>

            <h1 className="mt-3 text-3xl font-extrabold">Users</h1>

            <p className="mt-2 text-gray-400">
              View all registered users and admin accounts.
            </p>

            {loading && (
              <div className="mt-8 rounded-3xl border border-white/10 bg-white/[0.05] p-8 text-gray-400">
                Loading users...
              </div>
            )}

            {error && !loading && (
              <div className="mt-8 rounded-3xl border border-red-400/20 bg-red-500/10 p-8 text-red-300">
                {error}
              </div>
            )}

            {!loading && !error && users.length === 0 && (
              <div className="mt-8 rounded-3xl border border-dashed border-white/10 bg-white/[0.05] p-10 text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-white text-black">
                  <Users size={30} />
                </div>

                <h2 className="mt-5 text-xl font-bold">No users found</h2>

                <p className="mt-2 text-sm text-gray-400">
                  Registered users will appear here.
                </p>
              </div>
            )}

            {!loading && !error && users.length > 0 && (
              <div className="mt-8 overflow-hidden rounded-3xl border border-white/10 bg-white/[0.05] shadow-2xl shadow-black/30 backdrop-blur-xl">
                <div className="grid grid-cols-12 border-b border-white/10 px-6 py-4 text-xs font-semibold uppercase tracking-[0.18em] text-gray-400">
                  <div className="col-span-4">User</div>
                  <div className="col-span-3">Email</div>
                  <div className="col-span-2">Role</div>
                  <div className="col-span-3 text-right">Actions</div>
                </div>

                {users.map((user) => (
                  <div
                    key={user.id}
                    className="grid grid-cols-12 items-center border-b border-white/5 px-6 py-5 transition hover:bg-white/[0.04]"
                  >
                    <div className="col-span-4 flex items-center gap-3">
                      <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-black">
                        {user.role === "admin" ? (
                          <ShieldCheck size={20} />
                        ) : (
                          <User size={20} />
                        )}
                      </div>

                      <div>
                        <h3 className="font-semibold">{user.full_name}</h3>
                        <p className="mt-1 text-xs text-gray-500">
                          ID: {user.id}
                        </p>
                      </div>
                    </div>

                    <div className="col-span-3 truncate text-sm text-gray-300">
                      {user.email}
                    </div>

                    <div className="col-span-2">
                      <span
                        className={`rounded-full border px-3 py-1 text-xs font-semibold ${
                          user.role === "admin"
                            ? "border-purple-400/20 bg-purple-500/10 text-purple-300"
                            : "border-cyan-400/20 bg-cyan-500/10 text-cyan-300"
                        }`}
                      >
                        {user.role}
                      </span>
                    </div>

                    <div className="col-span-3 flex justify-end gap-2">
                      {user.role !== "admin" && (
                        <button
                          onClick={() => handleMakeAdmin(user.id)}
                          disabled={actionLoadingId === user.id}
                          className="inline-flex items-center gap-2 rounded-xl border border-purple-400/20 bg-purple-500/10 px-3 py-2 text-xs font-bold text-purple-300 transition hover:bg-purple-500/20 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                          <UserCog size={15} />
                          {actionLoadingId === user.id
                            ? "Updating..."
                            : "Make Admin"}
                        </button>
                      )}

                      {user.role !== "admin" && (
                        <button
                          onClick={() => handleDeleteUser(user.id)}
                          disabled={actionLoadingId === user.id}
                          className="inline-flex items-center gap-2 rounded-xl border border-red-400/20 bg-red-500/10 px-3 py-2 text-xs font-bold text-red-300 transition hover:bg-red-500/20 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                          <Trash2 size={15} />
                          Delete
                        </button>
                      )}

                      {user.role === "admin" && (
                        <span className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs text-gray-400">
                          Protected
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}