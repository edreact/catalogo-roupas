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

function createFavorite(code, img = 1) {
  const normalizedCode = String(code);
  const normalizedImage = Number(img) > 0 ? Math.trunc(Number(img)) : 1;

  return {
    id: `${normalizedCode}-${normalizedImage}`,
    code: normalizedCode,
    img: normalizedImage,
  };
}

function normalizeFavorite(favorite) {
  if (favorite && typeof favorite === "object") {
    return createFavorite(favorite.code ?? favorite.id, favorite.img);
  }

  return createFavorite(favorite, 1);
}

export function FavoritesProvider({ children }) {
  // Inicia o estado lendo direto do localStorage de forma segura
  const [favorites, setFavorites] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY);

    if (saved) {
      try {
        const parsed = JSON.parse(saved);

        return Array.isArray(parsed)
          ? parsed.map(normalizeFavorite).filter((favorite) => favorite.code)
          : [];
      } catch {
        return [];
      }
    }
    return [];
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
  }, [favorites]);

  const addFavorite = useCallback((code, img = 1) => {
    const favorite = createFavorite(code, img);

    setFavorites((old) => {
      if (old.some((item) => item.id === favorite.id)) return old;
      return [...old, favorite];
    });
  }, []);

  const removeFavorite = useCallback((code, img = 1) => {
    const favorite = createFavorite(code, img);

    setFavorites((old) => old.filter((item) => item.id !== favorite.id));
  }, []);

  const toggleFavorite = useCallback((code, img = 1) => {
    const favorite = createFavorite(code, img);

    setFavorites((old) =>
      old.some((item) => item.id === favorite.id)
        ? old.filter((item) => item.id !== favorite.id)
        : [...old, favorite],
    );
  }, []);

  const isFavorite = useCallback((code, img = 1) => {
    const favorite = createFavorite(code, img);

    return favorites.some((item) => item.id === favorite.id);
  }, [favorites]);

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
