// app/api/change-password/route.js
// Intentionally vulnerable to CSRF
// No CSRF token required for sensitive action
// FIX: Require a CSRF token and validate it server-side.

import db from '../../../db';

export async function POST(req) {
  let id, newPassword;
  const contentType = req.headers.get('content-type') || '';
  if (contentType.includes('application/json')) {
    ({ id, newPassword } = await req.json());
  } else if (contentType.includes('application/x-www-form-urlencoded')) {
    const body = await req.text();
    const params = new URLSearchParams(body);
    id = params.get('id');
    newPassword = params.get('newPassword');
  } else {
    return new Response(JSON.stringify({ error: 'Unsupported content type' }), { status: 400 });
  }
  return new Promise((resolve) => {
    db.run(
      `UPDATE users SET password='${newPassword}' WHERE id='${id}'`,
      function (err) {
        if (err) {
          return resolve(new Response(JSON.stringify({ error: err.message }), { status: 500 }));
        }
        resolve(new Response(JSON.stringify({ success: true }), { status: 200 }));
      }
    );
  });
}
