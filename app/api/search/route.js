// app/api/search/route.js
// Intentionally vulnerable to reflected XSS
// VULNERABILITY: User input is reflected unsanitized in the response
// FIX: Always escape and sanitize user input before rendering.

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get('q') || '';
  // VULNERABILITY: Reflected XSS
  const html = `<div>Results for: <b>${q}</b></div>`;
  return new Response(html, { status: 200, headers: { 'Content-Type': 'text/html' } });
}
