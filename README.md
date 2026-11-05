# BookNook

BookNook is a Next.js 16 + React 19 + TypeScript client for the BookNook book-sharing platform. Browse books, add titles to the community shelf, borrow books from neighbors, and manage your personal library — all in one place.

## Live Site

- **Development:** http://localhost:3000
- **Backend API:** http://localhost:5000 (sibling repo `../book-nook-server`)

## Features

- **Browse books** — Explore the community book collection with category filtering (Fiction, Science, History, Kids, Others).
- **Search** — Find a title by book name, author, category, or description, and keep the active category filter while searching.
- **New Arrivals carousel** — See the latest 10 books added, sorted newest first, with animated cards and a "See All Books" link.
- **Add a book** — Contribute a book to the community shelf with cover image upload (ImgBB), title, author, category, description, and total copies.
- **My Books** — View books you've added, edit details, or delete them (owner-only, JWT-protected).
- **Borrow & Return** — Borrow available books (decrements copies via `$inc`), track active borrows, and return books when finished (increments copies). Double-borrow protection prevents borrowing the same book twice.
- **Google Sign-In** — Authenticate with Google OAuth via BetterAuth, plus email/password sign-up and sign-in.
- **Responsive design** — Mobile-first grid layouts (1–5 columns) that adapt to phones, tablets, and desktops.
- **Dark mode** — Theme persisted in localStorage, with a toggle in the Navbar.
- **Framer Motion animations** — Staggered fade-in effects on New Arrivals cards and section headers.
- **Global toasts** — Success and error notifications via the Base UI Toaster mounted in `layout.tsx`.

## Tech Stack

- Next.js 16 (App Router, Turbopack)
- React 19
- TypeScript
- Tailwind CSS v4 (CSS-first)
- shadcn/ui (base-nova on `@base-ui/react`)
- Framer Motion
- BetterAuth (MongoDB adapter, JWT plugin)
- ImgBB (cover image uploads)

## Getting Started

### Prerequisites

- Node.js 18+
- The backend server running (`../book-nook-server` on port 5000) with `MONGODB_URI` configured

### Install

```bash
npm install
```

### Environment

Create a `.env` (already committed and pre-populated):

```
NEXT_PUBLIC_SERVER_BASE_URL=http://localhost:5000
IMGBB_API_KEY=your_imgbb_key
NEXT_PUBLIC_BETTER_AUTH_URL=http://localhost:3000
```

### Run

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start dev server on :3000 (Turbopack) |
| `npm run build` | Production build (`next build --webpack`) |
| `npm start` | Serve the production build |
| `npm run lint` | Run ESLint flat config |
| `npx tsc --noEmit` | TypeScript typecheck |

## Project Structure

```
src/
  app/              # App Router pages (server components)
  components/       # Reusable UI components
  components/ui/    # shadcn base-nova primitives (@base-ui/react)
  lib/              # API client, auth, auth-client, password utils, redirects
  provider/         # ThemeProvider
  types/            # Book, Borrow TypeScript types
```

## Backend

The API server is the sibling repo `../book-nook-server` (Express 5 + MongoDB, port 5000). It exposes 8 routes:

- `GET /books` — list all books (supports `sort`, `limit`, `userEmail`)
- `GET /books/:id` — get one book
- `POST /books` — add a book
- `PATCH /books/:id` — update a book (protected, owner only)
- `DELETE /books/:id` — delete a book (protected, owner only)
- `POST /borrows` — borrow a book (protected)
- `GET /borrows` — get user's borrows (protected)
- `DELETE /borrows/:id` — return a book (protected)

Run `npm run dev` in `../book-nook-server` to start it.

## Notes

- Development is split into small, reviewable commits (features, fixes, refactors, and docs) rather than one bulk commit.
- Build artifacts (`.next/`, `tsconfig.tsbuildinfo`) are not committed.
