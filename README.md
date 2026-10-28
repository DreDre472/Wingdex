# Wingdex

Wingdex is a cross-platform Palawan bird field guide built with Expo and React Native.

## Application overview

### Objectives
- Help users identify birds quickly by uploading a photo.
- Provide an easy-to-use bird reference guide with names, scientific names, and regional information.
- Support bird learning and field observation tracking on mobile devices.
- Let users save and revisit identified or observed birds in a personal collection.
- Make bird recognition more accessible without requiring expert knowledge.

### Features
- Photo-based bird identification using AI.
- Searchable bird directory with bird names, scientific names, and region filters.
- Regional filtering for easier browsing and species discovery.
- Saved bird collection / Pokedex for keeping track of favorites and sightings.
- Observation history stored locally on the device.
- Daily featured bird spotlight for learning and discovery.
- Cross-platform mobile app built with Expo and React Native.
- Confidence threshold checks to keep uncertain matches from being treated as valid identifications.

### Problem that can be solved
- Many people struggle to identify birds from photos or in the field.
- Birding often requires expert knowledge, printed guides, or internet research.
- Users may want a simple way to record and remember birds they see.
- This app bridges that gap by combining AI recognition, a local bird guide, and personal bird tracking.

### Pros and cons

#### Pros
- User-friendly mobile experience.
- Convenient photo-based identification.
- Good for learning and casual bird watching.
- Local saving of sightings and favorites.
- Search and filter functionality makes browsing easier.
- Works as both a guide and a personal collection tracker.
- Cross-platform support through Expo.

#### Cons
- AI identification may be inaccurate if the photo is blurry, poorly lit, or unclear.
- The worldwide bird list is only a starter set, not a complete global checklist.
- Range information is estimated rather than taken from a verified scientific distribution database.
- Accuracy depends on the backend API and image quality.
- Some features require a working backend and API key configuration.
- It is best viewed as a learning and reference app rather than a formal scientific bird database.
	
## Run locally

```sh
npm install
npx expo start
```

Open the QR code with Expo Go, or press `a` in the terminal for an Android emulator. Building/running iOS locally requires macOS; EAS Build can create iOS builds from the cloud.

## Current implementation

- Photo-library selection and preview.
- Searchable directory of 100 worldwide starter species; directory photos remain question marks until identified.
- Gemini bird identification worldwide, with device-local observation records and continent-scale range filters.
- Device-local Pokedex saved with AsyncStorage.
- Confidence threshold and schema validation for worldwide identification responses.

Live identification uses the separate Node backend in `backend/`. The app sends a multipart `photo` field to `POST /identify`; Gemini can return bird species worldwide as `{ "commonName": "Atlantic Puffin", "scientificName": "Fratercula arctica", "confidence": 0.91, "regions": ["Europe", "North America"] }`. An unclear image returns null names and no regions. Confident observations save their names, approximate range, date, and a private local copy of the selected photo. Unidentified attempts appear with a question mark and do not retain the photo. The geographic range labels are model estimates, not GPS location or a verified distribution database. The worldwide 100-species starter directory is separate from the three-species Palawan reference guide. Keep the Gemini key on the backend, never in the app.

### Start the backend

1. Create a Gemini API key in [Google AI Studio](https://aistudio.google.com/apikey).
2. In `backend/`, copy `.env.example` to `.env` and set `GEMINI_API_KEY` to your key. This file is ignored by Git. For Supabase access, set `SUPABASE_URL` and `SUPABASE_PUBLISHABLE_KEY`; set `SUPABASE_SECRET_KEY` for privileged server-side database operations.
3. Install and start the service:

	```sh
	cd backend
	npm install
	npm run dev
	```

4. In the project root, copy `.env.example` to `.env.local`. Set `EXPO_PUBLIC_WINGDEX_API_URL` to `http://localhost:3001` for a simulator, or to `http://<your-computer-LAN-IP>:3001` for a physical phone. Restart Expo after changing it.

The backend accepts JPEG, PNG, WebP, HEIC, and HEIF photos up to 10 MB and limits requests to 10 per IP every 15 minutes. Run its checks with `npm test` and `npm run typecheck` from `backend/`.

### Configure app sign-in

Copy the root `.env.example` to `.env.local` and set `EXPO_PUBLIC_SUPABASE_URL` and `EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY` from your Supabase project's API settings. Keep the Supabase secret key out of all app environment files; the public publishable key is intended for client apps and is protected by Row Level Security. Restart Expo after changing environment variables. Without these two values, the Account tab remains available and explains which settings are missing.

Enable the Email provider in Supabase **Authentication → Providers**. In **Authentication → URL Configuration → Redirect URLs**, allow the app callback generated for your setup: `wingdex://user_profile` for installed builds, and the development URL shown by Expo for Expo Go. The app uses that callback for email confirmation and password recovery; password recovery opens the Account tab so a new password can be set.

The backend exports a lazy Supabase client from `backend/src/supabase.ts`; call `getSupabaseClient()` where server-side database access is needed. It requires `SUPABASE_URL` and `SUPABASE_SECRET_KEY`, and does not connect until requested, so database credentials are not required to run identification alone. Keep the secret key on the backend only; it has elevated access and bypasses Row Level Security. The publishable key is for client-side setup and does not grant privileged access. The client setup alone does not create database tables or persist observations.

### Set up Supabase tables and storage

The app currently stores saved birds and observations on-device. The migrations in [`supabase/migrations/`](./supabase/migrations/) prepare matching `saved_birds` and `observations` tables, a private `observation-photos` bucket limited to 10 MB bird images, and a user `profiles` table.

To create these resources, open your Supabase project's **SQL Editor**, paste and run the migration files in timestamp order. The scripts are safe to run again. Supabase Auth already manages credentials and accounts in its built-in `auth.users` table; the profile migration adds a separate `public.profiles` row for each account, including existing users, and creates a profile automatically on signup. Configure and enable sign-in providers in **Authentication** settings in the Supabase dashboard. Storage paths must start with the owner's Supabase Auth user ID, for example `<user-id>/<observation-id>.jpg`.

The Account tab supports Supabase email sign-in, registration, password recovery, and sign-out. Saved birds and observations remain on-device and are not synced to Supabase. Nearby sightings and notifications in the UI are sample content, so they do not have tables in these migrations. Never put the Supabase secret key in the mobile app.

For deployment, set `GEMINI_API_KEY`, `GEMINI_MODEL`, `PORT`, and (for web clients) `CORS_ORIGIN` in the hosting provider's environment settings. Set `SUPABASE_URL` and `SUPABASE_SECRET_KEY` only when using privileged backend database access. Use HTTPS and add authentication and production-grade abuse controls before making the endpoint public; the in-memory rate limit is only a basic development guard.

The 100-species worldwide directory is a starter list, not a complete global checklist; geographic regions are broad reference labels. The three-species Palawan guide is also a starter, and its rarity values are provisional. Image credits and license links for guide photos are stored alongside each guide record in `src/data/birds.ts`.