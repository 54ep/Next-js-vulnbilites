// app/search/page.tsx
// Reflected XSS search page

"use client";
import { useState } from "react";

export default function Search() {
  const [q, setQ] = useState("");
  const [result, setResult] = useState("");

  const handleSearch = async (e) => {
    e.preventDefault();
    const res = await fetch(`/api/search?q=${encodeURIComponent(q)}`);
    setResult(await res.text());
  };

  return (
    <main className="max-w-md mx-auto mt-16 p-8 bg-white rounded shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center">
        Search (Reflected XSS)
      </h2>
      <form onSubmit={handleSearch} className="flex gap-2 mb-4">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search..."
          className="flex-1 border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        >
          Search
        </button>
      </form>
      {/* VULNERABILITY: Reflected XSS via dangerouslySetInnerHTML */}
      <div
        dangerouslySetInnerHTML={{ __html: result }}
        className="mt-4 text-gray-800"
      />
    </main>
  );
}
