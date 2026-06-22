# Prompts.md — AI Debugging Log

Documenting where/how I used AI as a pair-programmer for Sprint 08, per the "Learn, Don't Copy" mandate.

## Infinite scroll + IntersectionObserver

Asked Claude to explain how IntersectionObserver works conceptually before writing my own hook — specifically how the disconnect/observe cycle should work when the list re-renders. I wrote `useInfiniteScroll.js` myself but used the explanation to understand why you need to disconnect the old observer before attaching to the new last element, otherwise you get multiple stacked observers firing.

Debug session: my first version kept firing the fetch twice per scroll. Root cause was I wasn't checking `isLoading` inside the callback before re-creating the observer, so it raced. Fixed by guarding the early return.

## Debounce hook

Used the pattern from Sprint 04 (cover letter app autosave) as a reference for the debounce hook here too, since I'd already learned the timer/cleanup pattern there. Mostly just adapted variable names for movies vs text.

## Mood Matcher / Groq integration

Same auth pattern as the cover-letter-generator project from Sprint 04 — reused the fetch structure for the Groq chat completions endpoint. Had to debug why the response sometimes included quotes around the movie title (the model would return `"Inception"` instead of `Inception`), so added a regex strip for leading/trailing quotes.

Asked AI to explain what `temperature` does in the Groq API params — used 0.7 since I wanted some variation in mood suggestions but not totally random titles.

## TMDB pagination + favorites state bug

Hit a bug where switching from a search query back to the popular movies list didn't reset the page number, so it kept fetching from whatever page I was on in search results. Fixed with a separate useEffect that resets `page` to 1 whenever `debouncedSearch` changes.

Asked for clarification on why my favorites weren't deduping properly — turned out my reducer was comparing object references instead of `movie.id`, fixed by checking `.find(m => m.id === action.payload.id)`.

## General

Used AI to sanity check my axios instance setup (Bearer token header syntax) since I'd only used the v3 query-param style key before, not the v4 bearer token. Wrote the actual `tmdb.js` file myself once I understood the difference.
