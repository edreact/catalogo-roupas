import { FiHeart } from "react-icons/fi";
import { FaHeart } from "react-icons/fa";
import { useFavorites } from "../../context/FavoritesContext.jsx";

export default function FavoriteButton({
  product,
  img = 1,
  confirmRemoval = false,
}) {
  const { toggleFavorite, isFavorite } = useFavorites();

  const selected = isFavorite(product.code, img);

  function handleClick(event) {
    event.preventDefault();
    event.stopPropagation();

    if (
      selected &&
      confirmRemoval &&
      !window.confirm("Deseja mesmo remover este produto dos seus favoritos?")
    ) {
      return;
    }

    toggleFavorite(product.code, img);
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