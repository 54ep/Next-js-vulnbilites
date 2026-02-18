// Home page with links to features

export default function Home() {
  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-200 flex flex-col justify-center items-center py-10">
      <main className="max-w-xl w-full mx-auto p-8 bg-white rounded-2xl shadow-xl flex flex-col items-center border border-gray-100">
        <div className="mb-6 flex flex-col items-center">
          <div className="bg-red-100 text-red-600 rounded-full p-4 mb-2 shadow">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-10 w-10"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01M21 12c0 4.97-4.03 9-9 9s-9-4.03-9-9 4.03-9 9-9 9 4.03 9 9z"
              />
            </svg>
          </div>
          <h1 className="text-3xl font-extrabold mb-2 text-center tracking-tight">
            Vulnerable Next.js App
          </h1>
          <p className="text-center text-gray-700 text-lg">
            This app is intentionally insecure for security training.
            <br />
            <span className="text-red-600 font-bold">Do not deploy!</span>
          </p>
        </div>
        <ul className="w-full flex flex-col gap-4 mb-6">
          <li className="flex gap-2">
            <a
              href="/login"
              className="flex-1 text-center px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition font-medium shadow"
            >
              Login
            </a>
            <a
              href="/register"
              className="flex-1 text-center px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition font-medium shadow"
            >
              Register
            </a>
          </li>
          <li>
            <a
              href="/dashboard"
              className="block px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-800 text-center transition font-medium shadow"
            >
              User Dashboard
            </a>
          </li>
          <li>
            <a
              href="/products"
              className="block px-4 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700 text-center transition font-medium shadow"
            >
              Product Listing
            </a>
          </li>
          <li>
            <a
              href="/search"
              className="block px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 text-center transition font-medium shadow"
            >
              Search (Reflected XSS)
            </a>
          </li>
          <li>
            <a
              href="/admin"
              className="block px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 text-center transition font-medium shadow"
            >
              Admin Panel
            </a>
          </li>
        </ul>
        <p className="text-red-600 font-bold text-center mt-2">
          For local use only. See README for details.
        </p>
      </main>
    </div>
  );
}
