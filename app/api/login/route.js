// app/api/login/route.js
// Intentionally vulnerable login API route
// VULNERABILITY: SQL Injection via raw string concatenation
// This is dangerous because user input is directly inserted into the SQL query.
// An attacker can manipulate the query to bypass authentication or extract data.
// FIX: Use prepared statements or parameterized queries instead.

import db from '../../../db';
import jwt from 'jsonwebtoken';

export async function POST(req) {
  const { username, password } = await req.json();
  return new Promise((resolve) => {
    // VULNERABLE: SQL Injection
    const query = `SELECT * FROM users WHERE username='${username}' AND password='${password}'`;
    db.get(query, (err, user) => {
      if (err) {
        // VULNERABILITY: Exposing debug info
        return resolve(new Response(JSON.stringify({ error: err.message }), { status: 500 }));
      }
      if (user) {
        // VULNERABILITY: Weak JWT secret, no expiration
        const token = jwt.sign({ id: user.id, role: user.role }, '12345');
        // VULNERABILITY: Sensitive data exposure (returns password hash)
        return resolve(new Response(JSON.stringify({ user, token }), { status: 200 }));
      }
      resolve(new Response(JSON.stringify({ error: 'Invalid credentials' }), { status: 401 }));
    });
  });
}
