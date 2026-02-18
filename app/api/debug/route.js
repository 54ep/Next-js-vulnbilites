// app/api/debug/route.js
// Intentionally exposes debug info
// VULNERABILITY: Returns stack traces and error details
// FIX: Never expose internal errors to users in production.

export async function GET() {
  try {
    throw new Error('Debug info leak!');
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message, stack: err.stack }), { status: 500 });
  }
}
