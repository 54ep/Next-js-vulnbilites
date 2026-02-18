// app/api/products/route.js
// Product listing API (no auth required)

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
