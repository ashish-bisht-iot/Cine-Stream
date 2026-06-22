import { useFavorites } from "../context/FavoritesContext";
import MovieCard from "../components/MovieCard";

function Favorites() {
  const { favorites } = useFavorites();

  return (
    <div className="favorites-page">
      <h1>My Favorites</h1>
      {favorites.length === 0 ? (
        <p className="loading-text">No favorites yet. Go heart some movies!</p>
      ) : (
        <div className="movie-grid">
          {favorites.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      )}
    </div>
  );
}

export default Favorites;
