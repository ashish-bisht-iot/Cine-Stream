# Prompts.md — Cine-Stream

Documents every AI interaction during this project.

---

## June 20 - v3 vs v4 token thing

i was confused why tmdb gives you two different keys. asked claude what the actual difference was between the old api_key query param and the new v4 read access token. turns out v4 is just meant to go in the Authorization header as a Bearer token instead of being stuck in the url every time. set it once on my axios instance and never had to think about it again:

```js
const tmdb = axios.create({
  baseURL: BASE_URL,
  headers: { Authorization: `Bearer ${token}` },
});
```

---

## June 21 - debounce wasn't actually doing anything

built the debounce hook but my search was still firing on every keystroke. took me a bit to realize my mistake - i had the fetch logic watching the raw search input instead of the debounced version. asked claude why this was happening and it clicked once explained that you need the useEffect dependency to be the delayed value, not the live one. typing felt fine because the input itself wasn't debounced, only the part that actually calls the api needed to wait.

```js
const debouncedSearch = useDebounce(searchQuery, 500);

useEffect(() => {
}, [debouncedSearch]);
```

network tab confirmed it after - one request per pause instead of one per letter.

## June 22 - infinite scroll double firing

scrolling down sometimes loaded the same page twice, ended up with duplicate movies in the grid. spent a while just adding console.logs trying to figure out where the double call was coming from before asking for help. turns out every re-render was creating a fresh IntersectionObserver without killing the old one, so i had like 2-3 observers all watching the same element. fixed by disconnecting the old one before making a new one, plus added a loading check so it can't fire mid-fetch:

```js
if (isLoading) return;
if (observerRef.current) observerRef.current.disconnect();
```

the isLoading check ended up being the actual fix, the disconnect alone wasn't enough.

---

## June 23 - favorites duplicating

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

## June 24 - search reset bug

going from a search back to popular movies kept whatever page number i was on in the search results, so popular movies would start loading from like page 4 instead of page 1. added a separate effect just for resetting the page number whenever the search term changes. could've crammed it into the main fetch effect but kept it separate, easier to read.

```js
useEffect(() => {
  setPage(1);
}, [debouncedSearch]);
```
## July 17 - Connecting to data hub

sprint 11 wants cine-stream talking to my actual express/mongo backend from sprint 10 instead of just tmdb. hadn't dealt with cors before so first thing i did was ask claude to actually explain what a cors error means and why the browser blocks it.

```js
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
}));
```

## July 18 - image upload rabbit hole

Set up multer-storage-cloudinary following what seemed like the standard approach and immediately got CloudinaryStorage is not a constructor. asked what that error actually meant since it wasn't an obvious typo - turned out that package was never updated for cloudinary's v2 sdk, so it's still built against the old v1 api even though npm happily installs it alongside the new one without warning. had to understand the mismatch before deciding to drop the package entirely and write the upload manually using multer's memory storage plus a small wrapper that streams the buffer straight to cloudinary.

```js
function uploadToCloudinary(buffer) {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: "data-hub-uploads" },
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      }
    );
    stream.end(buffer);
  });
}
```

