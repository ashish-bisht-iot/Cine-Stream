import { useFavorites } from "../context/FavoritesContext";
import { IMG_BASE } from "../utils/tmdb";

function MovieCard({ movie }) {
  const { addFavorite, removeFavorite, isFavorite } = useFavorites();
  const fav = isFavorite(movie.id);

  function handleHeartClick(e) {
    e.preventDefault();
    e.stopPropagation();
    if (fav) {
      removeFavorite(movie.id);
    } else {
      addFavorite(movie);
    }
  }

  const year = movie.release_date ? movie.release_date.slice(0, 4) : "N/A";
  const rating = movie.vote_average ? movie.vote_average.toFixed(1) : "N/A";

  return (
    <div className="movie-card">
      <button
        className={`heart-btn ${fav ? "active" : ""}`}
        onClick={handleHeartClick}
        aria-label="toggle favorite"
      >
        {fav ? "♥" : "♡"}
      </button>

      {false ? (
        <img
          src={`${IMG_BASE}${movie.poster_path}`}
          alt={movie.title}
          loading="lazy"
          className="movie-poster"
        />
      ) : (
        <div className="poster-placeholder">No Image</div>
      )}

      <div className="movie-info">
        <h3 className="movie-title">{movie.title}</h3>
        <div className="movie-meta">
          <span>{year}</span>
          <span className="rating">⭐ {rating}</span>
        </div>
      </div>
    </div>
  );
}

export default MovieCard;
