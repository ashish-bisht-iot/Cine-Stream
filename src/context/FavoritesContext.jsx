import { createContext, useContext, useReducer, useEffect } from "react";

const FavoritesContext = createContext();

function getInitialFavorites() {
  try {
    const stored = localStorage.getItem("cineStreamFavorites");
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (err) {
    console.log("couldnt parse favorites from storage", err);
  }
  return [];
}

function favoritesReducer(state, action) {
  switch (action.type) {
    case "ADD_FAVORITE":
      // dont add duplicates
      if (state.find((m) => m.id === action.payload.id)) {
        return state;
      }
      return [...state, action.payload];

    case "REMOVE_FAVORITE":
      return state.filter((m) => m.id !== action.payload);

    default:
      return state;
  }
}

export function FavoritesProvider({ children }) {
  const [favorites, dispatch] = useReducer(favoritesReducer, getInitialFavorites());

  useEffect(() => {
    localStorage.setItem("cineStreamFavorites", JSON.stringify(favorites));
  }, [favorites]);

  function addFavorite(movie) {
    dispatch({ type: "ADD_FAVORITE", payload: movie });
  }

  function removeFavorite(id) {
    dispatch({ type: "REMOVE_FAVORITE", payload: id });
  }

  function isFavorite(id) {
    return favorites.some((m) => m.id === id);
  }

  return (
    <FavoritesContext.Provider value={{ favorites, addFavorite, removeFavorite, isFavorite }}>
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  return useContext(FavoritesContext);
}
