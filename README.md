# Cine-Stream

A Netflix-lite movie discovery SPA built in React + Vite, consuming the TMDB API. Built around two core performance patterns — debounced search and infinite scroll — plus an AI mood-to-movie matcher on top.

---

## Screenshots

### Popular Movies Grid

![Popular Movies](./screenshots/popular-movies.png)

---

### Debounced Search

![Debounced Search](./screenshots/search.png)

---

### Infinite Scroll

![Infinite Scroll](./screenshots/infinite-scroll.png)

---

### Favorites — Heart a Movie

![Favorites Heart](./screenshots/favorite-heart.png)

---

### Favorites Page — Persisted on Reload

![Favorites Persisted](./screenshots/favorites-page.png)

---

### Mood Matcher

![Mood Matcher](./screenshots/mood-matcher.png)

---

### Missing Poster Fallback

![Missing Poster](./screenshots/missing-poster.png)

---

## Project Structure

```
cine-stream/
├── index.html
├── vite.config.js
├── package.json
├── .env.example                     ← template for required env vars
├── Prompts.md                       ← AI debugging log (required)
├── README.md                        ← this file
└── src/
    ├── main.jsx                     ← entry point, wraps app in Router + FavoritesProvider
    ├── App.jsx                      ← route definitions (/ and /favorites)
    ├── App.css                      ← all component styling
    ├── index.css                    ← CSS variables, font imports, global reset
    ├── components/
    │   ├── Navbar.jsx                ← top nav, favorites count
    │   ├── SearchBar.jsx             ← controlled search input
    │   ├── MovieCard.jsx             ← poster, title, year, rating, heart button
    │   └── MoodMatcher.jsx           ← mood input → Groq → TMDB handoff
    ├── pages/
    │   ├── Home.jsx                  ← popular/search grid, infinite scroll, mood matcher
    │   └── Favorites.jsx             ← renders favorites from context
    ├── context/
    │   └── FavoritesContext.jsx      ← useReducer + localStorage sync
    ├── hooks/
    │   ├── useDebounce.js            ← delays value updates by 500ms
    │   └── useInfiniteScroll.js      ← IntersectionObserver ref callback
    └── utils/
        └── tmdb.js                   ← axios instance + fetchPopularMovies, searchMovies
```

<br/>

| | |
|---|---|
| **Live Demo** | [cine-stream/vercel.app](https://cine-stream-steel.vercel.app/) |
| **Repository** | [github/ashish-bisht-iot/Cine-Stream](https://github.com/ashish-bisht-iot/Cine-Stream) |

<br/>