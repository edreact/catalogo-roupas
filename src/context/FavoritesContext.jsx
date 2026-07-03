import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  useCallback,
} from "react";

const FavoritesContext = createContext();

const STORAGE_KEY = "catalog-favorites";

export function FavoritesProvider({ children }) {
  // Inicia o estado lendo direto do localStorage de forma segura
  const [favorites, setFavorites] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY);

    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return [];
      }
    }
    return [];
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
  }, [favorites]);

  const addFavorite = useCallback((code) => {
    setFavorites((old) => {
      if (old.includes(code)) return old;
      return [...old, code];
    });
  }, []);

  const removeFavorite = useCallback((code) => {
    setFavorites((old) => old.filter((item) => item !== code));
  }, []);

  const toggleFavorite = useCallback((code) => {
    setFavorites((old) =>
      old.includes(code) ? old.filter((item) => item !== code) : [...old, code],
    );
  }, []);

  const isFavorite = useCallback(
    (code) => favorites.includes(code),
    [favorites],
  );

  const value = useMemo(
    () => ({
      favorites,
      totalFavorites: favorites.length,
      addFavorite,
      removeFavorite,
      toggleFavorite,
      isFavorite,
    }),
    [favorites, addFavorite, removeFavorite, toggleFavorite, isFavorite],
  );

  return (
    <FavoritesContext.Provider value={value}>
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  return useContext(FavoritesContext);
}
