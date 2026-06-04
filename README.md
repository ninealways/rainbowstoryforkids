# Rainbow Story For Kids

A mobile-first learning-video library for the Rainbow Story For Kids YouTube
channel. The main catalogue focuses on structured learning videos, while live
sessions remain in a separate section.

## Run locally

```bash
npm install
npm run dev:clean
```

Open `http://localhost:3000`.

The development server intentionally uses webpack because the current Next.js
16 Turbopack development server can intermittently produce a stale React Client
Manifest error after switching between development and production builds.

## Production

```bash
npm run build
npm start
```

The project can be deployed directly to Vercel. It refreshes the channel's
public videos and playlists, automatically categorizes standard uploads into a
maximum of six learning topics, highlights the latest lesson, and displays
playlists as Learning Collections. The saved catalogue in `app/page.js` remains
available as a fallback if YouTube cannot be reached.
