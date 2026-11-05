<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# BookNook Client

Next.js 16 App Router + React 19 + TypeScript client. API server is the sibling repo `../book-nook-server` (Express 5 + MongoDB, port 5000).

## Commands

- `npm run dev` — dev server on :3000; Next 16 uses Turbopack by default.
- `npm run build` — production build; script is `next build --webpack`. Don't drop `--webpack`.
- `npm start` — serve the production build.
- `npm run lint` — ESLint flat config (`eslint-config-next` core-web-vitals + TypeScript).
- `npx tsc --noEmit` — typecheck. No test script or test runner is configured.

## Verification baseline

Both `npx tsc --noEmit` and `npm run lint` are clean. Keep them clean in new work.

## Architecture

- App Router server components under `src/app/**/page.tsx`. `src/app/layout.tsx` owns fonts (Geist, Geist_Mono, Lora via `next/font`), `Navbar`, `Footer`, `ThemeProvider`, and the Base UI `Toaster`.
- Next 16 route props are async: declare `params` / `searchParams` as `Promise<...>` and `await` them (see `src/app/books/page.tsx` and `src/app/books/[id]/page.tsx`).
- Data access goes through `src/lib/api.ts`, which wraps `fetch` to `NEXT_PUBLIC_SERVER_BASE_URL`. Public reads use `GET /books`; protected calls send the BetterAuth JWT. `getBorrowStatus(bookId, token)` derives the current user's active borrow from `GET /borrows`.
- Import alias `@/*` → `src/*` (tsconfig `paths`).
- Tailwind v4 CSS-first: no `tailwind.config.*`. Tokens and the class-based dark variant live in `src/app/globals.css`. Dark is the default; theme persisted in localStorage key `booknook-theme` (`src/provider/theme-provider.tsx`).
- Animations: `framer-motion` is installed. Use `<motion.div>` from `framer-motion` for entrance animations (see `src/components/new-arrivals.tsx` for staggered fade-up cards). `tw-animate-css` is also available for CSS animation utilities.
- UI primitives in `src/components/ui/` are shadcn `base-nova` on `@base-ui/react`, not Radix. Prefer `npx shadcn@latest add <name>` or existing primitives. `components.json` aliases: components `@/components`, ui `@/components/ui`, lib `@/lib`, hooks `@/hooks`.
- Class merging: `import { cn } from "@/lib/utils"` (re-exports the `cn` package). Not `clsx` + `tailwind-merge`.
- Book shape in `src/types/book.ts`; ids are MongoDB `_id`, not `id`.
- Book categories live in `src/lib/categories.ts` (`BOOK_CATEGORIES`, `CATEGORY_FILTERS`). The filter pills, add/edit forms, and footer all derive from it; do not add per-file category lists.
- Global toasts: `toast.add({ type, title, description })` from `@/components/ui/toast`; `Toaster` mounted in `layout.tsx`.

## API / data

- Base URL env var: `NEXT_PUBLIC_SERVER_BASE_URL` (`.env` sets `http://localhost:5000`). There is no `NEXT_PUBLIC_API_URL`.
- Server routes (Express + MongoDB, `../book-nook-server/index.js`):
  - `GET /books` — list all books; supports `sort=<field>:<asc|desc>&limit=<n>&userEmail=<email>`
  - `GET /books/:id` — get one book
  - `POST /books` — add a book (persists `userName`, `userEmail`, `createdAt`, `totalCopies`, `availableCopies`)
  - `PATCH /books/:id` — update a book (partial); **protected — owner only** via JWT; returns updated book
  - `DELETE /books/:id` — delete a book; **protected — owner only** via JWT
  - `POST /borrows` — borrow a book; **protected via JWT**; decrements `availableCopies` with `$inc`; returns 400 `NOT_AVAILABLE` when none left; returns 400 `ALREADY_BORROWED` if user already has an active borrow for the same book
  - `GET /borrows` — get borrows of logged in user; **protected via JWT**; supports `userEmail` query param
  - `DELETE /borrows/:id` — return a book; **protected via JWT**; accepts borrow record `_id` or falls back to `bookId`; increments `availableCopies` with `$inc`
- JWT validation: `authenticateJWT` middleware verifies the `better-auth-session` cookie (or `Authorization: Bearer` header) using `jose.jwtVerify` with `BETTER_AUTH_SECRET`. Protected routes: `PATCH /books/:id`, `DELETE /books/:id`, `POST /borrows`, `GET /borrows`, `DELETE /borrows/:id`. Ownership enforced on book update/delete via `userEmail` match.
- Client-side protected API calls send `Authorization: Bearer <token>` where `<token>` comes from `session.session.token` via `authClient.useSession()` (BetterAuth JWT plugin). All functions in `src/lib/api.ts` that call protected endpoints accept an optional `token` parameter: `borrowBook`, `returnBook`, `getMyBooks`, `getMyBorrows`, `deleteBook`, `updateBook`. Call sites pass `session.session?.token`.
- `addBook` and public read endpoints (`GET /books`, `GET /books/:id`, `GET /books?...`) do not require auth.
- `src/lib/api.ts` implements `getAllBooks`, `getBookById`, `getLatestBooks`, `getMyBooks(userEmail)`, `updateBook(bookId, data)`, `deleteBook(bookId)`, `borrowBook(bookId, userEmail, userName?)`, `returnBook(borrowId)`, `getMyBorrows(userEmail)`, and `getBorrowStatus(bookId, token)` against the backend.
- `new-arrivals.tsx` calls `getLatestBooks(10)` via `src/lib/api.ts` (`GET /books?sort=createdAt:desc&limit=10`); it never hardcodes the API URL. Backend must be running for live data; the section shows an empty state when offline or empty.
- `/add-book` uploads covers to ImgBB via `NEXT_PUBLIC_IMGBB_API_KEY`; submission fails with a toast if the key is missing. `POST /books` persists `userName`, `userEmail`, and `createdAt`.
- To run the backend: `npm run dev` in `../book-nook-server`; needs `MONGODB_URI` in its `.env` and seeds sample books on connect.
- `.env` is committed and pre-populated (auth secrets, Google keys, ImgBB key, base URLs). Do not add new secret values to it.

## Authentication

- BetterAuth (MongoDB adapter): `src/lib/auth.ts`; browser client `src/lib/auth-client.ts`; handler `src/app/api/auth/[...all]/route.ts`. Auth shares the `book-nook` database with books.
- Required server env: `MONGODB_URI`, `BETTER_AUTH_SECRET`, `BETTER_AUTH_URL` (default `http://localhost:3000`). Client env: `NEXT_PUBLIC_SERVER_BASE_URL`, `NEXT_PUBLIC_IMGBB_API_KEY`, `NEXT_PUBLIC_BETTER_AUTH_URL` (default `http://localhost:3000`).
- Google only when both `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` are set; callback `http://localhost:3000/api/auth/callback/google`.
- Plugins: `jwt()`, then `nextCookies()` last. `autoSignIn: false` for email/password. Sign-up hook rejects passwords missing an uppercase letter, lowercase letter, or 6 chars; rules mirrored in `src/lib/password.ts` (`PASSWORD_RULES`, `validatePassword`).
- Sessions: client `authClient.useSession()` (Navbar, Borrow button); server `auth.api.getSession({ headers: await headers() })` (`/add-book`, `/sign-in`, `/sign-up`). Pages that read sessions are `force-dynamic`.
- `src/proxy.ts` defines a `proxy` handler redirecting unauthenticated requests on `/add-book`, `/add-book/:path*`, `/books/:id`, `/my-books*`, `/my-borrows*`, but it is NOT wired as Next.js middleware (no `middleware.ts`, nothing imports it). Protection is enforced server-side in pages instead. Do not treat `proxy.ts` as active middleware.
- Post-login redirects via `getSafeNextPath()` / `buildLoginPath()` from `src/lib/redirect.ts`; never pass a raw `next` query value to `redirect()`/`router.push()`.
- `/login` and `/register` are server pages with client forms (`login-form.tsx`, `register-form.tsx`). `/forgot-password`/`/reset-password` use BetterAuth's reset flow; with no email provider, the reset URL is printed to the server console.
- `/add-book` is a server page that passes the authenticated BetterAuth user to `add-book-form.tsx`. Do not reintroduce the removed `booknook-user` localStorage hook.

## Gotchas

- Generated/build artifacts: `.next/`, `tsconfig.tsbuildinfo`. Don't commit them.
- Pages that read sessions must be `force-dynamic`.
