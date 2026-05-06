# Recipeat

Recipeat is a recipe app built with Next.js, Prisma, PostgreSQL on Supabase, and NextAuth.

## Requirements

- Node.js 18+
- npm
- A Supabase project with a PostgreSQL database

## Setup

1. Install dependencies.

```bash
npm install
```

2. Create your local env file.

```bash
cp .env.example .env
```

3. Fill `.env` with values from your Supabase project.

- `DATABASE_URL`: use the Supabase pooler connection string
- `DIRECT_URL`: use the direct database connection string
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `AUTH_SECRET`

4. Run the app.

```bash
npm run dev
```

## Database

- Prisma client is generated automatically when you run `npm run dev`, `npm run build`, or `npm run start`.
- If you change the Prisma schema, run `npm run db:generate`.
- If your database needs schema syncing, run `npm run db:push`.
- If you want to load seed data, run `npm run db:seed`.

## Scripts

- `npm run dev` - start development server
- `npm run build` - build production app
- `npm run start` - run production app
- `npm run lint` - run ESLint
- `npm run db:generate` - generate Prisma client
- `npm run db:push` - push Prisma schema to database
- `npm run db:seed` - seed database
- `npm run db:studio` - open Prisma Studio

## Environment Notes

- Keep `.env` local and do not commit it.
- `DATABASE_URL` is the one Prisma uses at runtime.
- `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` are for browser/client Supabase access.
- If you see connection issues, confirm that `DATABASE_URL` points to the same Supabase project as your dashboard.

## Project Structure

- `app/` - routes and pages
- `components/` - reusable UI components
- `lib/` - Prisma, Supabase, and auth helpers
- `prisma/` - schema, seed script, and migrations
