# Simple Absensi (Web)

Template project: Next.js (App Router) + Supabase integration.

Folders:
- /app/employee => employee attendance page
- /app/admin => admin info page (opens Supabase table)
- /app/api/attendance/check => API route to upload photo and insert record to Supabase
- .env.local -> environment variables for Supabase (already included)

How to deploy:
1. Extract ZIP.
2. (Optional) Install dependencies locally: `npm install`
3. Deploy to Vercel: go to https://vercel.com/new -> Deploy from your computer -> upload this ZIP.
4. Ensure environment variables are set in Vercel (or use the included .env.local).

Notes:
- This is a minimal starter template for rapid deploy. For production, secure your keys and review Supabase RLS rules.
