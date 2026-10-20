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
2. In `backend/`, copy `.env.example` to `.env` and set `GEMINI_API_KEY` to your key. This file is ignored by Git.
3. Install and start the service:

	```sh
	cd backend
	npm install
	npm run dev
	```

4. In the project root, copy `.env.example` to `.env.local`. Set `EXPO_PUBLIC_WINGDEX_API_URL` to `http://localhost:3001` for a simulator, or to `http://<your-computer-LAN-IP>:3001` for a physical phone. Restart Expo after changing it.

The backend accepts JPEG, PNG, WebP, HEIC, and HEIF photos up to 10 MB and limits requests to 10 per IP every 15 minutes. Run its checks with `npm test` and `npm run typecheck` from `backend/`.

For deployment, set `GEMINI_API_KEY`, `GEMINI_MODEL`, `PORT`, and (for web clients) `CORS_ORIGIN` in the hosting provider's environment settings. Use HTTPS and add authentication and production-grade abuse controls before making the endpoint public; the in-memory rate limit is only a basic development guard.

The 100-species worldwide directory is a starter list, not a complete global checklist; geographic regions are broad reference labels. The three-species Palawan guide is also a starter, and its rarity values are provisional. Image credits and license links for guide photos are stored alongside each guide record in `src/data/birds.ts`.