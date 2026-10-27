# Git Fable AI

A clean chat app UI powered by Meta AI (Muse Spark). Rebranded clone of the
chat.z.ai guest experience, built for the Meta Global AI Developer Hackathon.
Created by Jay-Ar Lee Espiritu.

## Deploy on Vercel

1. Import this repo in Vercel (Framework Preset: **Other** — static site +
   serverless `api/` only).
2. Set the environment variable **`META_API_KEY`** to your Meta Model API key
   (dev.meta.ai). No key is stored in the repo or in the browser.
3. Deploy. The app calls its own `/api/chat` route, which reads the key from
   the environment and streams replies from `api.meta.ai`.

## Files

- `index.html` — the whole app (single file, dark/light synced UI)
- `api/chat.js` — Vercel serverless proxy to the Meta Model API
