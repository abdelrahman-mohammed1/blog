# Modern Blog CMS

A professional, modern blog content management dashboard built with **Next.js**, **TypeScript**, **Tailwind CSS**, and **shadcn/ui**.

## Features

- Dashboard layout with sidebar, navbar, mobile menu, and theme toggle
- **Categories** — list, create, delete (with optimistic updates)
- **Tags** — list, create, delete
- **Posts** — list, search, pagination, create with auto slug generation
- React Hook Form + Zod validation
- TanStack Query for server state
- Axios API layer
- Framer Motion animations
- Dark / light mode (next-themes)
- Sonner toasts

## Tech Stack

- Next.js 15+ (App Router)
- TypeScript
- Tailwind CSS v4
- shadcn/ui
- React Hook Form + Zod
- Axios
- TanStack Query
- Sonner
- Framer Motion
- Lucide React

## Getting Started

```bash
cd modern-blog-cms
npm install
cp .env.local.example .env.local
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## API

Default backend URL:

```
https://blog-moemen-adam.vercel.app
```

Override in `.env.local`:

```
NEXT_PUBLIC_API_BASE_URL=https://blog-moemen-adam.vercel.app
```

### Endpoints

| Method | Path | Body |
|--------|------|------|
| GET/POST | `/categories` | `{ "name": "..." }` |
| GET/POST | `/tags` | `{ "name": "..." }` |
| GET/POST | `/posts` | `{ "title", "slug", "content", "categories", "tags" }` |

## Project Structure

```
app/              # Routes (App Router)
components/       # UI + layout + shared
features/         # Feature modules (categories, tags, posts)
hooks/            # React Query hooks
services/         # Axios API services
types/            # TypeScript types
lib/              # Utils, validations, constants
```

## Scripts

- `npm run dev` — development server
- `npm run build` — production build
- `npm run start` — production server
- `npm run lint` — ESLint
