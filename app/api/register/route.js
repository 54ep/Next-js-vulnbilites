// app/api/register/route.js
// Intentionally vulnerable registration API route
// VULNERABILITY: No server-side validation, weak password storage
// Only client-side validation is performed. API accepts any values.
// FIX: Always validate and sanitize input on the server.

import db from '../../../db';

export async function POST(req) {
  const { username, password, email } = await req.json();
  return new Promise((resolve) => {
    // VULNERABILITY: No password hashing, stores plaintext
    db.run(
      `INSERT INTO users (username, password, email) VALUES ('${username}', '${password}', '${email}')`,
      function (err) {
        if (err) {
          // VULNERABILITY: Exposing debug info
          return resolve(new Response(JSON.stringify({ error: err.message }), { status: 500 }));
        }
        resolve(new Response(JSON.stringify({ success: true, userId: this.lastID }), { status: 201 }));
      }
    );
  });
}
