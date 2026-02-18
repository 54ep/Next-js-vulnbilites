// app/api/profile/route.js
// Intentionally vulnerable profile API route
// VULNERABILITY: IDOR (Insecure Direct Object Reference)
// No authorization check, any user can access any profile by changing the id param.
// FIX: Always check that the authenticated user is allowed to access the requested resource.

import db from '../../../db';

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');
  return new Promise((resolve) => {
    db.get(`SELECT * FROM users WHERE id='${id}'`, (err, user) => {
      if (err) {
        return resolve(new Response(JSON.stringify({ error: err.message }), { status: 500 }));
      }
      if (user) {
        // VULNERABILITY: Sensitive data exposure
        return resolve(new Response(JSON.stringify(user), { status: 200 }));
      }
      resolve(new Response(JSON.stringify({ error: 'User not found' }), { status: 404 }));
    });
  });
}
