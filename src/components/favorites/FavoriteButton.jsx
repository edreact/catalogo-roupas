import { FiHeart } from "react-icons/fi";
import { FaHeart } from "react-icons/fa";
import { useFavorites } from "../../context/FavoritesContext.jsx";

export default function FavoriteButton({ product }) {
  const { toggleFavorite, isFavorite } = useFavorites();

  const selected = isFavorite(product.code);

  function handleClick(event) {
    event.preventDefault();
    event.stopPropagation();
    toggleFavorite(product.code);
  }

  return (
    <button
      type="button"
      className={`favorite-button ${selected ? "selected" : ""}`}
      onClick={handleClick}
      title={
        selected
          ? "Remover da Minha Seleção"
          : "Adicionar à Minha Seleção"
      }
      aria-label={
        selected
          ? "Remover da Minha Seleção"
          : "Adicionar à Minha Seleção"
      }
    >
      {selected ? <FaHeart /> : <FiHeart />}
    </button>
  );
}