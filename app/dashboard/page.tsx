// app/dashboard/page.tsx
// User dashboard (no real auth check, uses localStorage)

"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface User {
  id: string;
  username: string;
  role: string;
}

export default function Dashboard() {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  useEffect(() => {
    const u = localStorage.getItem("user");
    if (!u) router.push("/login");
    else setUser(JSON.parse(u));
  }, [router]);

  if (!user) return null;

  return (
    <main className="max-w-2xl mx-auto mt-20 p-8 bg-white rounded-2xl shadow-2xl border border-gray-100">
      <div className="flex flex-col items-center mb-8">
        <div className="w-20 h-20 bg-linear-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-4xl font-bold shadow-lg mb-4">
          {user.username.charAt(0).toUpperCase()}
        </div>
        <h2 className="text-3xl font-extrabold text-gray-900 mb-1">
          Welcome, {user.username}!
        </h2>
        <p className="text-gray-500 text-sm">Your personal dashboard</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <a
          href={`/profile?id=${user.id}`}
          className="group bg-blue-50 border border-blue-200 rounded-xl p-6 flex flex-col items-center hover:bg-blue-100 hover:shadow-lg transition"
        >
          <svg
            className="w-8 h-8 text-blue-600 mb-2 group-hover:scale-110 transition"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span className="font-semibold text-blue-800">Profile</span>
        </a>
        <a
          href="/products"
          className="group bg-green-50 border border-green-200 rounded-xl p-6 flex flex-col items-center hover:bg-green-100 hover:shadow-lg transition"
        >
          <svg
            className="w-8 h-8 text-green-600 mb-2 group-hover:scale-110 transition"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
            />
          </svg>
          <span className="font-semibold text-green-800">Products</span>
        </a>
        {user.role === "admin" && (
          <a
            href="/admin"
            className="group bg-gray-50 border border-gray-200 rounded-xl p-6 flex flex-col items-center hover:bg-gray-100 hover:shadow-lg transition"
          >
            <svg
              className="w-8 h-8 text-gray-700 mb-2 group-hover:scale-110 transition"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
              />
            </svg>
            <span className="font-semibold text-gray-800">Admin Panel</span>
          </a>
        )}
      </div>

      <div className="mt-8 text-center text-gray-400 text-xs">
        <p>Dashboard &copy; 2026 ProductHub. All rights reserved.</p>
      </div>
    </main>
  );
}
