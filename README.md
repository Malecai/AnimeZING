# AnimeZING

A responsive anime discovery web app built with **React**, **Tailwind CSS**,
and the **Jikan API** (a free, keyless REST API for MyAnimeList data). Built
for the INTECH 3112 first/second term project.

## Features

- **Home** — hero section + a live "trending now" grid of the most popular
  anime.
- **Browse** — search by title, filter by genre, and page through results.
- **About** — project + tech stack info.
- Async data fetching with `fetch()`, no full-page reloads.
- Loading and error states (with a retry button) on every data-fetching view.
- Fully responsive layout (mobile, tablet, desktop) using Tailwind's
  `sm:` / `md:` / `lg:` breakpoints.
- Reusable components: `Navbar`, `AnimeCard`, `SearchBar`, `GenreFilter`,
  `Loading`, `ErrorMessage`, `Pagination`, `Footer`.

## Tech stack

| Tool                | Purpose                                   |
| ------------------- | ------------------------------------------ |
| React 18 + Vite      | Component UI and dev/build tooling         |
| React Router         | Client-side navigation between views       |
| Tailwind CSS         | Styling and responsive layout              |
| Jikan API v4         | Live anime data (no API key required)      |

## Project structure

```
animezing/
├── src/
│   ├── components/
│   │   ├── Navbar.jsx
│   │   ├── AnimeCard.jsx
│   │   ├── SearchBar.jsx
│   │   ├── GenreFilter.jsx
│   │   ├── Loading.jsx
│   │   ├── ErrorMessage.jsx
│   │   ├── Pagination.jsx
│   │   └── Footer.jsx
│   ├── pages/
│   │   ├── Home.jsx
│   │   ├── Browse.jsx
│   │   └── About.jsx
│   ├── lib/
│   │   └── jikan.js        # all API calls live here
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── index.html
├── tailwind.config.js
├── postcss.config.js
├── vite.config.js
├── vercel.json
└── package.json
```

## Run it locally

You'll need [Node.js](https://nodejs.org/) 18 or newer installed.

```bash
npm install
npm run dev
```

Then open the local URL Vite prints (usually `http://localhost:5173`).

To build a production bundle:

```bash
npm run build
npm run preview   # optional: preview the production build locally
```

## Push to GitHub

From inside the `animezing` folder:

```bash
git init
git add .
git commit -m "Initial commit: AnimeZING"
git branch -M main
git remote add origin https://github.com/<your-username>/<your-repo>.git
git push -u origin main
```

## Deploy to Vercel

1. Go to [vercel.com](https://vercel.com) and sign in (GitHub login is
   easiest).
2. Click **Add New → Project** and import the GitHub repo you just pushed.
3. Vercel auto-detects the **Vite** framework preset. Confirm these settings
   (they're the defaults, but double-check):
   - **Build Command:** `vite build` (or `npm run build`)
   - **Output Directory:** `dist`
   - **Install Command:** `npm install`
4. Click **Deploy**. Vercel will build and give you a live `*.vercel.app`
   URL when it finishes (usually well under a minute).

The included `vercel.json` makes sure client-side routes like `/browse` and
`/about` load correctly on refresh or direct link, instead of 404-ing.

No environment variables or API keys are needed — Jikan is a public,
keyless API.

## Notes on the API

Jikan proxies MyAnimeList and enforces a light rate limit (roughly 3
requests/second, 60/minute) on its free tier. If you hit it while testing —
usually from refreshing very quickly — the app will show the built-in error
state with a **Try again** button rather than crashing.

## Team

_Add your group members' names here before submitting._
