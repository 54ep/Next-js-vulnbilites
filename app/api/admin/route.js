// app/api/admin/route.js
// Intentionally vulnerable admin API route
// VULNERABILITY: Broken Access Control
// Only checks for admin role on client, not server
// FIX: Always verify user role on the server using a validated JWT.

import db from '../../../db';

export async function GET() {
  // VULNERABILITY: No authentication or role check
  return new Promise((resolve) => {
    db.all('SELECT * FROM users', (err, users) => {
      if (err) {
        return resolve(new Response(JSON.stringify({ error: err.message }), { status: 500 }));
      }
      resolve(new Response(JSON.stringify(users), { status: 200 }));
    });
  });
}
