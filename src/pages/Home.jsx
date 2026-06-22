import { useState, useEffect, useCallback } from "react";
import { fetchPopularMovies, searchMovies } from "../utils/tmdb";
import { useDebounce } from "../hooks/useDebounce";
import { useInfiniteScroll } from "../hooks/useInfiniteScroll";
import MovieCard from "../components/MovieCard";
import SearchBar from "../components/SearchBar";
import MoodMatcher from "../components/MoodMatcher";

function Home() {
  const [movies, setMovies] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [moodResult, setMoodResult] = useState(null);
  const [moodLabel, setMoodLabel] = useState("");

  const debouncedSearch = useDebounce(searchQuery, 500);

  // load movies whenever page changes, or when search term changes (resets to page 1)
  useEffect(() => {
    let active = true;

    async function loadMovies() {
      setLoading(true);
      try {
        let data;
        if (debouncedSearch.trim()) {
          data = await searchMovies(debouncedSearch, page);
        } else {
          data = await fetchPopularMovies(page);
        }

        if (!active) return;

        if (page === 1) {
          setMovies(data.results);
        } else {
          setMovies((prev) => [...prev, ...data.results]);
        }
        setTotalPages(data.total_pages);
      } catch (err) {
        console.log("error fetching movies", err);
      } finally {
        if (active) setLoading(false);
      }
    }

    loadMovies();

    return () => {
      active = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, debouncedSearch]);

  // whenever the search term changes, reset back to page 1
  useEffect(() => {
    setPage(1);
  }, [debouncedSearch]);

  const loadNextPage = useCallback(() => {
    setPage((prev) => prev + 1);
  }, []);

  const hasMore = page < totalPages;
  const lastMovieRef = useInfiniteScroll(loadNextPage, loading, hasMore);

  function handleMoodResult(movie, label) {
    setMoodResult(movie);
    setMoodLabel(label);
  }

  return (
    <div className="home-page">
      <header className="hero">
        <h1>🎬 Cine-Stream</h1>
        <p>Discover your next favorite movie</p>
        <SearchBar
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Search for a movie..."
        />
      </header>

      <MoodMatcher onResult={handleMoodResult} />

      {moodResult && (
        <div className="mood-result">
          <p className="mood-result-label">AI suggested: "{moodLabel}"</p>
          <MovieCard movie={moodResult} />
        </div>
      )}

      <h2 className="section-title">
        {debouncedSearch.trim() ? `Results for "${debouncedSearch}"` : "Popular Movies"}
      </h2>

      <div className="movie-grid">
        {movies.map((movie, index) => {
          const isLast = index === movies.length - 1;
          return (
            <div key={movie.id} ref={isLast ? lastMovieRef : null}>
              <MovieCard movie={movie} />
            </div>
          );
        })}
      </div>

      {loading && <p className="loading-text">Loading more movies...</p>}
      {!loading && movies.length === 0 && <p className="loading-text">No movies found.</p>}
      {!hasMore && movies.length > 0 && (
        <p className="loading-text">You've reached the end!</p>
      )}
    </div>
  );
}

export default Home;
