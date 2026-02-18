// app/dashboard/page.tsx
// User dashboard (no real auth check, uses localStorage)

"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const u = localStorage.getItem("user");
    if (!u) router.push("/login");
    else setUser(JSON.parse(u));
  }, [router]);

  if (!user) return null;

  return (
    <main className="max-w-xl mx-auto mt-16 p-8 bg-white rounded shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center">Dashboard</h2>
      <p className="mb-6 text-center">
        Welcome, <span className="font-semibold">{user.username}</span>!
      </p>
      <ul className="flex flex-col gap-4">
        <li>
          <a
            href={`/profile?id=${user.id}`}
            className="block px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-center transition"
          >
            Profile
          </a>
        </li>
        <li>
          <a
            href="/products"
            className="block px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 text-center transition"
          >
            Products
          </a>
        </li>
        <li>
          <a
            href="/admin"
            className="block px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-800 text-center transition"
          >
            Admin Panel
          </a>
        </li>
      </ul>
    </main>
  );
}
