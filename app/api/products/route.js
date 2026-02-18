// app/api/products/route.js
// Product listing and add API (no auth required)

import db from '../../../db';

export async function GET() {
  return new Promise((resolve) => {
    db.all('SELECT * FROM products', (err, products) => {
      if (err) {
        return resolve(new Response(JSON.stringify({ error: err.message }), { status: 500 }));
      }
      resolve(new Response(JSON.stringify(products), { status: 200 }));
    });
  });
}

export async function POST(req) {
  const { name, description } = await req.json();
  return new Promise((resolve) => {
    db.run(
      `INSERT INTO products (name, description) VALUES ('${name}', '${description}')`,
      function (err) {
        if (err) {
          return resolve(new Response(JSON.stringify({ error: err.message }), { status: 500 }));
        }
        resolve(new Response(JSON.stringify({ success: true, productId: this.lastID }), { status: 201 }));
      }
    );
  });
}
