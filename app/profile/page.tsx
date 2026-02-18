// app/profile/page.tsx
// Profile page (IDOR: user can change id param to view others)

"use client";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

interface ProfileData {
  id: string;
  username: string;
  email: string;
  password: string;
}

export default function Profile() {
  const params = useSearchParams();
  const id = params.get("id");
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch(`/api/profile?id=${id}`)
      .then((r) => r.json())
      .then(setProfile)
      .catch((e) => setError("Error loading profile"));
  }, [id]);

  if (error) return <div>{error}</div>;
  if (!profile) return <div>Loading...</div>;

  function ChangePasswordForm({ userId }: { userId: string }) {
    const [newPassword, setNewPassword] = useState("");
    const [status, setStatus] = useState("");

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setStatus("");
      const res = await fetch("/api/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: userId, newPassword }),
      });
      const data: ChangePasswordResponse = await res.json();
      interface ChangePasswordResponse {
        success: boolean;
        error?: string;
      }
      if (data.success) {
        setStatus("Password changed successfully.");
        setNewPassword("");
      } else {
        setStatus(data.error || "Failed to change password.");
      }
    };

    return (
      <form onSubmit={handleSubmit} className="flex gap-2 items-center mt-2">
        <input type="hidden" name="id" value={userId} />
        <input
          name="newPassword"
          placeholder="New Password"
          className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />
        <button
          type="submit"
          className="bg-blue-600 text-white rounded px-4 py-2 hover:bg-blue-700 transition"
        >
          Change Password
        </button>
        {status && (
          <span
            className={
              status.includes("success")
                ? "text-green-600 ml-2"
                : "text-red-600 ml-2"
            }
          >
            {status}
          </span>
        )}
      </form>
    );
  }

  return (
    <main className="max-w-md mx-auto mt-16 p-8 bg-white rounded shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center">Profile</h2>
      <div className="mb-4">
        <b>ID:</b> <span className="text-gray-700">{profile.id}</span>
      </div>
      <div className="mb-2">
        <b>Username:</b>{" "}
        <span className="text-gray-700">{profile.username}</span>
      </div>
      <div className="mb-2">
        <b>Email:</b> <span className="text-gray-700">{profile.email}</span>
      </div>
      <div className="mb-6">
        <b>Password Hash:</b>{" "}
        <span className="text-gray-700">{profile.password}</span>
      </div>
      <ChangePasswordForm userId={profile.id} />
    </main>
  );
}
