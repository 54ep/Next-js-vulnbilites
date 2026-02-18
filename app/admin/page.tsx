// app/admin/page.tsx
// Admin panel (broken access control: only checks client-side role)

"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type User = {
  id: string | number;
  username: string;
  email: string;
  role: string;
};

export default function Admin() {
  const [user, setUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const router = useRouter();

  useEffect(() => {
    const u = localStorage.getItem("user");
    if (!u) router.push("/login");
    else setUser(JSON.parse(u));
  }, [router]);

  useEffect(() => {
    if (user && user.role === "admin") {
      fetch("/api/admin")
        .then((r) => r.json())
        .then(setUsers);
    }
  }, [user]);

  if (!user) return null;
  // VULNERABILITY: Only checks client-side role
  if (user.role !== "admin")
    return (
      <div className="max-w-md mx-auto mt-16 p-8 bg-white rounded shadow-md text-center text-red-600 font-semibold">
        Access denied (client-side check only)
      </div>
    );

  return (
    <main className="max-w-2xl mx-auto mt-16 p-8 bg-white rounded shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center">Admin Panel</h2>
      <ul className="space-y-2">
        {users.map((u) => (
          <li
            key={u.id}
            className="border rounded px-4 py-2 bg-gray-50 flex flex-col md:flex-row md:justify-between md:items-center"
          >
            <span className="font-semibold">{u.username}</span>
            <span className="text-gray-600">
              ({u.role}) - {u.email}
            </span>
          </li>
        ))}
      </ul>
    </main>
  );
}
