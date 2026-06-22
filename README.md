# Cine-Stream 🎬

Sprint 08 project — a Netflix-lite movie discovery SPA built with React, consuming the TMDB API. Built as part of my Software Engineer Trainee residency at Prodesk IT.

## What it does

- Browse popular movies in a grid (poster, title, year, rating)
- Search movies by title (debounced so it's not spamming the API on every keystroke)
- Infinite scroll — keeps loading more movies as you scroll down instead of pagination buttons
- Heart a movie to save it to Favorites, persisted in localStorage, with its own `/favorites` route
- Mood Matcher — type how you're feeling, an LLM (Groq/LLaMA 3.3) suggests a movie title, and that gets searched on TMDB automatically
- Images lazy load so the page doesn't choke loading 20 posters at once

## Stack

- React + Vite
- React Router
- Context API + useReducer for favorites state
- Axios for TMDB calls
- Groq API (LLaMA 3.3 70B) for the mood matcher
- Plain CSS, no framework

## Running it locally

```bash
npm install
```

Create a `.env` file in the root (see `.env.example`):

```
VITE_TMDB_TOKEN=your_tmdb_v4_read_access_token
VITE_GROQ_API_KEY=your_groq_api_key
```

Then:

```bash
npm run dev
```

## Folder structure

```
src/
  components/   - MovieCard, SearchBar, MoodMatcher, Navbar
  pages/        - Home, Favorites
  context/      - FavoritesContext (useReducer + localStorage sync)
  hooks/        - useDebounce, useInfiniteScroll
  utils/        - tmdb.js (axios instance + API calls)
```

## Notes / things I'd improve with more time

- If the debounced search returns 0 results, infinite scroll observer still checks hasMore against total_pages, should double check edge cases where the query changes mid-fetch
- Mood matcher only grabs the first TMDB search result, sometimes that's not the best match if the LLM gives a vague title
- Could clean up some of the conditional rendering in Home.jsx, got a bit nested
