# Dignified Email MVP (Monorepo)

Cross‑platform MVP that generates dignified AI emails for Gmail & Outlook.
-10/7/25, gmail working.
- `src/prompt` — change to alter the type of email generated

## Packages
- `backend/` — Express + TypeScript API with policy & prompt modules
- `outlook-addin/` — Office.js add-in (compose command → calls backend)
- `gmail-addons/` — Workspace Add-on (Apps Script) calling backend

## Quick start (Local Development)
1. Copy `.env.example` to `backend/.env` and set your keys (e.g., `OPENAI_API_KEY`).
2. `cd backend && npm i && npm run dev` (starts API on http://localhost:8787).
3. Expose your local backend using [ngrok](https://ngrok.com/) if testing Gmail add-on:  
   `ngrok http 8787`
4. Outlook add-in: sideload the `manifest.xml` (see its README section).
5. Gmail add-on: deploy via Apps Script (see `gmail-addons/DEPLOY.md`).  
   - Update the backend URL in `Code.gs` and `appsscript.json` to your ngrok or production endpoint.

> Drafts are *insert-only* by default—no auto-send—keeping a human in the loop.

## Deploying to Production (e.g., Vercel)
1. Push your code to GitHub.
2. Import your backend project into [Vercel](https://vercel.com/).
3. Set build settings:  
   - **Build Command:** `npm run build`  
   - **Output Directory:** `dist`
4. Add environment variables (e.g., `OPENAI_API_KEY`) in Vercel dashboard.
5. Deploy and get your public backend URL.
6. Update Gmail add-on (`Code.gs` and `appsscript.json`) to use your production backend URL.
7. Redeploy your Gmail add-on.

## Security & Best Practices
- Never commit your `.env` file or secrets to git.
- See `.gitignore` for recommended exclusions.
- Monitor usage and quota for your OpenAI API key.

## Features
- Interactive Gmail sidebar for context-aware draft generation.
- Uses OpenAI for dignified, empathetic email suggestions.
- Human-in-the-loop: drafts are created, not auto-sent.

---
