import axios from "axios";

const BASE_URL = "https://api.themoviedb.org/3";
const token = import.meta.env.VITE_TMDB_TOKEN;

const tmdb = axios.create({
  baseURL: BASE_URL,
  headers: {
    Authorization: `Bearer ${token}`,
  },
});

export const IMG_BASE = "https://image.tmdb.org/t/p/w500";

// gets popular movies, page based
export async function fetchPopularMovies(page = 1) {
  const res = await tmdb.get("/movie/popular", {
    params: { page },
  });
  return res.data;
}

// search movies by query
export async function searchMovies(query, page = 1) {
  const res = await tmdb.get("/search/movie", {
    params: { query, page },
  });
  return res.data;
}
