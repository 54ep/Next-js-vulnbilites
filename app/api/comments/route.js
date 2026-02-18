// app/api/comments/route.js
// Intentionally vulnerable comment API route
// VULNERABILITY: Stored XSS (no sanitization, renders user input as HTML)
// FIX: Always sanitize and escape user input before rendering.

import db from '../../../db';

export async function POST(req) {
  const { user_id, product_id, comment } = await req.json();
  return new Promise((resolve) => {
    db.run(
      `INSERT INTO comments (user_id, product_id, comment) VALUES ('${user_id}', '${product_id}', '${comment}')`,
      function (err) {
        if (err) {
          return resolve(new Response(JSON.stringify({ error: err.message }), { status: 500 }));
        }
        resolve(new Response(JSON.stringify({ success: true, commentId: this.lastID }), { status: 201 }));
      }
    );
  });
}

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const product_id = searchParams.get('product_id');
  return new Promise((resolve) => {
    db.all(`SELECT * FROM comments WHERE product_id='${product_id}'`, (err, comments) => {
      if (err) {
        return resolve(new Response(JSON.stringify({ error: err.message }), { status: 500 }));
      }
      resolve(new Response(JSON.stringify(comments), { status: 200 }));
    });
  });
}
