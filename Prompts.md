# Prompts.md — Cine-Stream

Documents every AI interaction during this project.

---

## day 1 (june 20) - v3 vs v4 token thing

i was confused why tmdb gives you two different keys. asked claude what the actual difference was between the old api_key query param and the new v4 read access token. turns out v4 is just meant to go in the Authorization header as a Bearer token instead of being stuck in the url every time. set it once on my axios instance and never had to think about it again:

```js
const tmdb = axios.create({
  baseURL: BASE_URL,
  headers: { Authorization: `Bearer ${token}` },
});
```

---

## day 2 (june 21) - debounce wasn't actually doing anything

built the debounce hook but my search was still firing on every keystroke. took me a bit to realize my mistake - i had the fetch logic watching the raw search input instead of the debounced version. asked claude why this was happening and it clicked once explained that you need the useEffect dependency to be the delayed value, not the live one. typing felt fine because the input itself wasn't debounced, only the part that actually calls the api needed to wait.

```js
const debouncedSearch = useDebounce(searchQuery, 500);

useEffect(() => {
}, [debouncedSearch]);
```

network tab confirmed it after - one request per pause instead of one per letter.

## day 3 (june 22) infinite scroll double firing

scrolling down sometimes loaded the same page twice, ended up with duplicate movies in the grid. spent a while just adding console.logs trying to figure out where the double call was coming from before asking for help. turns out every re-render was creating a fresh IntersectionObserver without killing the old one, so i had like 2-3 observers all watching the same element. fixed by disconnecting the old one before making a new one, plus added a loading check so it can't fire mid-fetch:

```js
if (isLoading) return;
if (observerRef.current) observerRef.current.disconnect();
```

the isLoading check ended up being the actual fix, the disconnect alone wasn't enough.

---

## day 4 (june 23) - favorites duplicating

hearting a movie twice (from two different scroll positions where the same movie showed up) added it twice to favorites. realized i was just pushing the object straight into the array without checking if it was already there. fixed with a find check on the id before adding:

```js
if (state.find((m) => m.id === action.payload.id)) return state;
```

obvious in hindsight, took embarrassingly long to spot.

### groq returning quoted titles

mood matcher would sometimes break because groq's response came back like `"Inception"` with the quote marks literally included in the string, so tmdb search couldn't find anything matching that exact text. asked why the ai wasn't following my "return only the title" instruction properly - apparently llms don't always follow formatting instructions exactly so you're supposed to clean up the output yourself instead of trusting it blindly. added a regex strip for leading/trailing quotes as a safety net.

```js
const cleanTitle = rawTitle.trim().replace(/^["']|["']$/g, "");
```

still not bulletproof if it returns something weirder than quotes but covers the common case.

##  day 5 (june 24) - search reset bug

going from a search back to popular movies kept whatever page number i was on in the search results, so popular movies would start loading from like page 4 instead of page 1. added a separate effect just for resetting the page number whenever the search term changes. could've crammed it into the main fetch effect but kept it separate, easier to read.

```js
useEffect(() => {
  setPage(1);
}, [debouncedSearch]);
```
