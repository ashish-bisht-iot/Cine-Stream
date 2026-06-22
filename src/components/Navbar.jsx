import { Link } from "react-router-dom";
import { useFavorites } from "../context/FavoritesContext";

function Navbar() {
  const { favorites } = useFavorites();

  return (
    <nav className="navbar">
      <Link to="/" className="nav-logo">
        Cine-Stream
      </Link>
      <Link to="/favorites" className="nav-link">
        Favorites ({favorites.length})
      </Link>
    </nav>
  );
}

export default Navbar;
