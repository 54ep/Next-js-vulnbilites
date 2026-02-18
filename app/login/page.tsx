// app/login/page.tsx
// Login page (client-side only validation, no rate limiting, stores JWT in localStorage)

"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [detectedPatterns, setDetectedPatterns] = useState<string[]>([]);
  const router = useRouter();

  // SQL Injection Warning
  const [sqlWarning, setSqlWarning] = useState("");

  // SQL Injection Pattern Detector
  const detectSQLInjection = (
    input: string,
  ): { detected: boolean; patterns: string[] } => {
    const sqlPatterns = [
      {
        pattern: /(\bOR\b|\bAND\b)\s+['"]\s*['"]\s*=\s*['"]/i,
        name: "OR/AND '=''",
      },
      { pattern: /(\bOR\b|\bAND\b)\s+\d+\s*=\s*\d+/i, name: "OR/AND 1=1" },
      { pattern: /['"]?\s*--/i, name: "SQL Comment (--)" },
      { pattern: /['"]?\s*#/i, name: "SQL Comment (#)" },
      { pattern: /\/\*/i, name: "Block Comment (/*)" },
      {
        pattern: /;\s*(DROP|DELETE|UPDATE|INSERT|CREATE|ALTER)/i,
        name: "Dangerous SQL Command",
      },
      { pattern: /UNION\s+(ALL\s+)?SELECT/i, name: "UNION SELECT" },
      { pattern: /\bEXEC(\s|\()/i, name: "EXEC Statement" },
      { pattern: /\bSLEEP\s*\(/i, name: "SLEEP Function" },
      { pattern: /\bBENCHMARK\s*\(/i, name: "BENCHMARK Function" },
      { pattern: /'.*\bOR\b.*'/i, name: "OR in Quotes" },
      { pattern: /admin'\s*--/i, name: "Admin Bypass Attempt" },
    ];

    const detected: string[] = [];
    for (const { pattern, name } of sqlPatterns) {
      if (pattern.test(input)) {
        detected.push(name);
      }
    }

    return { detected: detected.length > 0, patterns: detected };
  };

  const handleInputChange = (value: string, field: "username" | "password") => {
    if (field === "username") {
      setUsername(value);
    } else {
      setPassword(value);
    }

    // Check for SQL injection patterns
    const result = detectSQLInjection(value);
    if (result.detected) {
      setSqlWarning(`SQL Injection Pattern Detected!`);
      setDetectedPatterns(result.patterns);
    } else {
      setSqlWarning("");
      setDetectedPatterns([]);
    }
  };

  interface LoginResponse {
    token?: string;
    user?: { id: string; username: string };
    error?: string;
  }

  const handleLogin = async (
    e: React.FormEvent<HTMLFormElement>,
  ): Promise<void> => {
    e.preventDefault();
    // VULNERABILITY: Only client-side validation
    if (!username || !password) {
      setError("All fields required");
      return;
    }
    // Block login if SQL injection detected
    if (sqlWarning) {
      setError("Login blocked: SQL injection pattern detected in input.");
      return;
    }
    const res = await fetch("/api/login", {
      method: "POST",
      body: JSON.stringify({ username, password }),
      headers: { "Content-Type": "application/json" },
    });
    const data: LoginResponse = await res.json();
    if (data.token) {
      // VULNERABILITY: Store JWT in localStorage
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      router.push("/dashboard");
    } else {
      setError(data.error || "Login failed");
    }
  };

  return (
    <main className="max-w-md mx-auto mt-16 p-8 bg-white rounded-xl shadow-lg">
      <div className="text-center mb-6">
        <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
          <svg
            className="w-8 h-8 text-blue-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
            />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-gray-800">Welcome Back</h2>
        <p className="text-gray-500 text-sm mt-2">Sign in to your account</p>
      </div>

      {/* SQL Injection Detection Alert */}
      {sqlWarning && (
        <div className="mb-4 p-4 bg-orange-50 border-l-4 border-orange-500 rounded-r-lg">
          <div className="flex items-start space-x-3">
            <svg
              className="w-6 h-6 text-orange-600 shrink-0 mt-0.5"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                fillRule="evenodd"
                d="M9.401 3.003c1.155-2 4.043-2 5.197 0l7.355 12.748c1.154 2-.29 4.5-2.599 4.5H4.645c-2.309 0-3.752-2.5-2.598-4.5L9.4 3.003zM12 8.25a.75.75 0 01.75.75v3.75a.75.75 0 01-1.5 0V9a.75.75 0 01.75-.75zm0 8.25a.75.75 0 100-1.5.75.75 0 000 1.5z"
                clipRule="evenodd"
              />
            </svg>
            <div className="flex-1">
              <p className="font-bold text-orange-800 text-sm">{sqlWarning}</p>
              <div className="mt-2 space-y-1">
                {detectedPatterns.map((pattern, idx) => (
                  <div
                    key={idx}
                    className="flex items-center space-x-2 text-xs text-orange-700"
                  >
                    <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
                    <span className="font-mono bg-orange-100 px-2 py-0.5 rounded">
                      {pattern}
                    </span>
                  </div>
                ))}
              </div>
              <p className="text-xs text-orange-600 mt-2 font-semibold">
                🔍 Educational Note: This pattern may be used in SQL injection
                attacks
              </p>
            </div>
          </div>
        </div>
      )}

      <form onSubmit={handleLogin} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Username
          </label>
          <input
            placeholder="Enter your username"
            value={username}
            onChange={(e) => handleInputChange(e.target.value, "username")}
            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Password
          </label>
          <input
            placeholder="Enter your password"
            type="password"
            value={password}
            onChange={(e) => handleInputChange(e.target.value, "password")}
            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white rounded-lg px-4 py-3 hover:bg-blue-700 transition font-semibold shadow-md hover:shadow-lg flex items-center justify-center space-x-2"
        >
          <span>Login</span>
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 7l5 5m0 0l-5 5m5-5H6"
            />
          </svg>
        </button>
      </form>

      {error && (
        <div className="mt-4 p-3 bg-red-50 border-l-4 border-red-500 rounded-r-lg">
          <div className="flex items-center space-x-2">
            <svg
              className="w-5 h-5 text-red-600"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                fillRule="evenodd"
                d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zm-1.72 6.97a.75.75 0 10-1.06 1.06L10.94 12l-1.72 1.72a.75.75 0 101.06 1.06L12 13.06l1.72 1.72a.75.75 0 101.06-1.06L13.06 12l1.72-1.72a.75.75 0 10-1.06-1.06L12 10.94l-1.72-1.72z"
                clipRule="evenodd"
              />
            </svg>
            <span className="text-red-800 font-medium text-sm">{error}</span>
          </div>
        </div>
      )}

      <div className="mt-6 text-center">
        <p className="text-gray-600 text-sm">
          Don't have an account?{" "}
          <a
            href="/register"
            className="text-blue-600 hover:text-blue-700 font-semibold hover:underline"
          >
            Register here
          </a>
        </p>
      </div>

      {/* Educational Info Box */}
      <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
        <div className="flex items-start space-x-2">
          <svg
            className="w-5 h-5 text-gray-500 shrink-0 mt-0.5"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              fillRule="evenodd"
              d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm8.706-1.442c1.146-.573 2.437.463 2.126 1.706l-.709 2.836.042-.02a.75.75 0 01.67 1.34l-.04.022c-1.147.573-2.438-.463-2.127-1.706l.71-2.836-.042.02a.75.75 0 11-.671-1.34l.041-.022zM12 9a.75.75 0 100-1.5.75.75 0 000 1.5z"
              clipRule="evenodd"
            />
          </svg>
          <div className="text-xs text-gray-600">
            <p className="font-semibold mb-1">Learning Mode Active</p>
            <p>
              This app detects SQL injection patterns for educational purposes.
              The backend remains vulnerable to demonstrate security concepts.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
