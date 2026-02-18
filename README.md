# Vulnerable Next.js App

## ⚠️ WARNING: INTENTIONALLY VULNERABLE ⚠️

**This app is for local cybersecurity training only. DO NOT deploy, expose to the internet, or use with real data.**

---

## Setup Instructions

1. Install dependencies:
   ```
   npm install
   ```
2. Run the development server:
   ```
   npm run dev
   ```
3. The app runs at http://localhost:3000

---

## Vulnerabilities Included

1. **SQL Injection**: Login API uses raw string concatenation for SQL queries.
2. **Reflected XSS**: Search page reflects unsanitized user input.
3. **Stored XSS**: Comments on products are rendered as HTML without sanitization.
4. **IDOR**: Profile page accessible via `/profile?id=...` with no auth check.
5. **Weak JWT Auth**: JWT signed with weak secret, no expiration, stored in localStorage.
6. **Missing Server-Side Validation**: Only client-side validation is performed.
7. **CSRF**: Sensitive actions (change password) lack CSRF protection.
8. **Broken Access Control**: Admin panel protected only by client-side role check.
9. **Weak Rate Limiting**: Login endpoint has no brute force or rate limiting.
10. **Sensitive Data Exposure**: API returns password hashes and debug info.

---

## How to Use Each Vulnerability

### 1. SQL Injection (Login)

- Go to the Login page.
- Enter a username like `admin' --` and any password.
- The SQL injection in the API will bypass authentication if the query is crafted correctly.
- Try payloads like:
  - Username: `admin' --`
  - Password: anything

### 2. Reflected XSS (Search)

- Go to the Search page.
- Enter `<script>alert(1)</script>` as the search term.
- The alert will pop up because user input is reflected unsanitized.

### 3. Stored XSS (Product Comments)

- Go to the Product Listing page.
- Click Comments for any product.
- Add a comment like `<img src=x onerror=alert(1)>`.
- The script will execute for anyone viewing the comments.

### 4. IDOR (Profile)

- Log in as any user.
- Visit `/profile?id=1` (or change the id in the URL to another user's id).
- You will see another user's profile data (including password hash).

### 5. Weak JWT Auth

- Log in and open browser dev tools.
- In Application/Storage, view the JWT in localStorage.
- The JWT is signed with a weak secret (`12345`) and has no expiration.
- You can modify or forge tokens using online tools.

### 6. Missing Server-Side Validation

- Register or log in, then intercept requests with Burp Suite or browser dev tools.
- Manipulate values (e.g., send empty or invalid data) directly to the API.
- The server will accept them because it only validates on the client.

### 7. CSRF (Change Password)

- Create a simple HTML form on another site that POSTs to `/api/change-password` with a victim's id and new password.
- No CSRF token is required, so the request will succeed if the user is logged in.

### 8. Broken Access Control (Admin)

- Log in as a normal user.
- In dev tools, change your user object in localStorage to `{..., role: 'admin'}`.
- Visit `/admin` and you will see the admin panel, even though you are not an admin.

### 9. Weak Rate Limiting (Login)

- Use a tool like Burp Intruder or Hydra to brute-force the login endpoint.
- There is no rate limiting or lockout, so brute-force attacks are possible.

### 10. Sensitive Data Exposure

- Observe API responses (e.g., login, profile, admin) in dev tools or Burp Suite.
- Password hashes and debug info are included in responses.

---

## Ethical Usage

- **For local, educational use only**
- Do not deploy or share publicly
- Do not use real credentials or sensitive data
- No Dockerfile or deployment scripts included

---

## Questions?

This app is for demonstration and training only. Use responsibly!

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
