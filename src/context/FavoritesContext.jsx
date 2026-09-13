import { createContext, useContext, useEffect, useState } from "react";

const FavoritesContext = createContext(null);
const STORAGE_KEY = "animezing:favorites";

function readStoredFavorites() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    // localStorage may be unavailable (private browsing, quota, etc).
    return [];
  }
}

export function FavoritesProvider({ children }) {
  const [favorites, setFavorites] = useState(readStoredFavorites);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
    } catch {
      // Fail silently -- favoriting still works for the current session.
    }
  }, [favorites]);

  function isFavorite(id) {
    return favorites.some((item) => String(item.mal_id) === String(id));
  }

  function toggleFavorite(anime) {
    setFavorites((prev) => {
      const exists = prev.some((item) => String(item.mal_id) === String(anime.mal_id));
      if (exists) {
        return prev.filter((item) => String(item.mal_id) !== String(anime.mal_id));
      }
      return [...prev, anime];
    });
  }

  const value = { favorites, isFavorite, toggleFavorite };

  return (
    <FavoritesContext.Provider value={value}>{children}</FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error("useFavorites must be used within a FavoritesProvider");
  }
  return context;
}
