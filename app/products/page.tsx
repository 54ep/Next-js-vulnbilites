// app/products/page.tsx
// Product listing with comments (stored XSS)

"use client";
import { useEffect, useState } from "react";

type Product = { id: number; name: string; description: string };
type Comment = {
  id: number;
  user_id: number;
  product_id: number;
  comment: string;
};

export default function Products() {
  const [products, setProducts] = useState<Product[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);
  const [selected, setSelected] = useState<number | null>(null);
  const [comment, setComment] = useState("");
  const [userId, setUserId] = useState("");

  useEffect(() => {
    fetch("/api/products")
      .then((r) => r.json())
      .then(setProducts);
    const u = localStorage.getItem("user");
    if (u) setUserId(JSON.parse(u).id);
  }, []);

  const loadComments = (id: number) => {
    setSelected(id);
    fetch(`/api/comments?product_id=${id}`)
      .then((r) => r.json())
      .then(setComments);
  };

  const handleComment = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await fetch("/api/comments", {
      method: "POST",
      body: JSON.stringify({ user_id: userId, product_id: selected, comment }),
      headers: { "Content-Type": "application/json" },
    });
    setComment("");
    if (selected !== null) loadComments(selected);
  };

  return (
    <main className="max-w-3xl mx-auto mt-10 p-6 bg-white rounded shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center">Products</h2>
      <ul className="space-y-4 mb-8">
        {products.map((p) => (
          <li
            key={p.id}
            className="border rounded p-4 flex flex-col md:flex-row md:items-center md:justify-between bg-gray-50 hover:bg-gray-100 transition"
          >
            <div>
              <span className="font-semibold text-lg">{p.name}</span>
              <span className="ml-2 text-gray-600">{p.description}</span>
            </div>
            <button
              className="mt-2 md:mt-0 px-4 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
              onClick={() => loadComments(p.id)}
            >
              Comments
            </button>
          </li>
        ))}
      </ul>
      {selected && (
        <div className="bg-gray-100 rounded p-4 mt-6">
          <h3 className="text-xl font-semibold mb-4">
            Comments for Product #{selected}
          </h3>
          <form onSubmit={handleComment} className="flex gap-2 mb-4">
            <input
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Add comment (XSS)"
              className="flex-1 border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
            >
              Post
            </button>
          </form>
          <ul className="space-y-2">
            {comments.map((c) => (
              <li key={c.id} className="bg-white border rounded px-3 py-2">
                {/* VULNERABILITY: Stored XSS via dangerouslySetInnerHTML */}
                <span dangerouslySetInnerHTML={{ __html: c.comment }} />
              </li>
            ))}
          </ul>
        </div>
      )}
    </main>
  );
}
