# Wingdex Admin Portal

The admin portal is a separate, web-only React application for authorized Wingdex operators. It provides overview metrics, searchable read-only user and collection data, and tools to manage badges, ranks, and announcements.

## Requirements

- Node.js compatible with the repository's Expo and backend packages
- A configured Supabase project with the Wingdex migrations applied
- A running Wingdex backend with server-side Supabase credentials
- A Supabase Auth account whose user UUID is on the backend admin allowlist

## Configure Supabase

Review the SQL files in `../supabase/migrations/` and apply them in timestamp order. In particular, apply `20261111000100_admin_content_and_collection_sync.sql` for admin-managed content and collection sync. Back up production data and review migrations before applying them to a live project.

Create or invite operator accounts in Supabase Auth. Copy each operator's user UUID from the Supabase dashboard; authorization uses this UUID, not user metadata or a client-side role.

## Configure the backend

From `backend/`, copy `.env.example` to `.env`. Set:

- `SUPABASE_URL` to the Supabase project URL.
- `SUPABASE_SECRET_KEY` to the server-only Supabase secret/service-role key. Never put this value in `admin/.env.local`, any `VITE_*` variable, or a browser bundle.
- `ADMIN_USER_IDS` to a comma-separated list of approved operator UUIDs.
- `CORS_ORIGIN` to the exact local admin origin, `http://localhost:4174`, and later to the exact deployed portal origin.

The backend also requires `GEMINI_API_KEY` to start the current server. Keep all backend secrets in `backend/.env` locally and in the hosting provider's secret manager in production.

Start the backend from the `backend/` directory:

```sh
npm install
npm run dev
```

By default, the API listens on port `3001`.

## Configure and run the portal

From `admin/`, copy `.env.example` to `.env.local` and set:

- `VITE_SUPABASE_URL` to the Supabase project URL.
- `VITE_SUPABASE_PUBLISHABLE_KEY` to the public Supabase publishable key.
- `VITE_ADMIN_API_URL` to the backend URL, normally `http://localhost:3001` for local development.

These `VITE_*` values are included in the browser bundle. Only use the publishable key here; never place the Supabase secret/service-role key in the portal.

Start the Vite development server from `admin/`:

```sh
npm install
npm run dev
```

Open [http://localhost:4174](http://localhost:4174). If using Google or Facebook sign-in, add this portal origin to Supabase **Authentication → URL Configuration → Redirect URLs**, and configure the provider as described in the root [README](../README.md).

## Build and deploy

Build the static portal from `admin/`:

```sh
npm run build
```

Deploy `admin/dist/` to a static web host over HTTPS. Set `VITE_SUPABASE_URL`, `VITE_SUPABASE_PUBLISHABLE_KEY`, and `VITE_ADMIN_API_URL` at build time for that environment. Configure the backend's `CORS_ORIGIN` to the exact deployed portal origin and serve the backend over HTTPS as well.

## Access controls and available actions

Every `/admin/*` API request sends the signed-in Supabase access token. The backend verifies it with Supabase Auth and checks the verified user UUID against `ADMIN_USER_IDS` before returning data or performing a mutation. Missing or invalid allowlist configuration disables admin access. Never grant admin access by setting client profile metadata.

- **Users and collections:** searchable, paginated, read-only views. Account suspension/deletion and collection moderation are not available.
- **Badges:** create, edit, activate/deactivate, or delete badge definitions. Badge rules support unique identified species, observation count, or saved species.
- **Ranks:** create, edit, publish/unpublish, or delete rank definitions. Thresholds must be unique positive integers.
- **Announcements:** create, edit, publish, unpublish to draft, and archive. Archived announcements are retained and are not shown in the app.

Only active badges and published ranks/announcements are readable by app clients. App clients cannot write admin-managed content directly; mutations go through the allowlisted backend API.

## Collection sync notes

The app keeps local collections available offline and merges them with the signed-in user's Supabase records. Local writes are preserved when sync fails, and sync can be retried from My Collection. Legacy local records are assigned to the first signed-in account on that device. Observation coordinates sync when present; observation photos remain local in this MVP. Row-level security keeps collection records scoped to their owner.

## Checks

From the repository root, run backend tests and typecheck:

```sh
cd backend
npm test
npm run typecheck
```

Build the portal from `admin/` with `npm run build`. The optional Supabase RLS tests in `../supabase/tests/admin_content_rls.sql` require a local Supabase database; do not run them against a production project as a substitute for review.
