import { Link } from "react-router-dom";
import { useFavorites } from "../context/FavoritesContext";
import { IMG_BASE } from "../services/api";

export default function MovieCard({ movie }) {
  const { isFavorite, addFavorite, removeFavorite,
          isInWatchlist, addWatchlist, removeWatchlist } = useFavorites();

  const fav   = isFavorite(movie.id);
  const watch = isInWatchlist(movie.id);

  return (
    <div className="movie-card">
      <Link to={`/movie/${movie.id}`}>
        <img
          src={
            movie.poster_path
              ? IMG_BASE + movie.poster_path
              : "https://via.placeholder.com/300x450?text=No+Image"
          }
          alt={movie.title}
        />
        <div className="movie-info">
          <h3>{movie.title}</h3>
          <span className="rating">⭐ {movie.vote_average?.toFixed(1)}</span>
        </div>
      </Link>

      <div className="card-actions">
        <button
          className={`fav-btn ${fav ? "active" : ""}`}
          title={fav ? "Remove from Favorites" : "Add to Favorites"}
          onClick={() => fav ? removeFavorite(movie.id) : addFavorite(movie)}
        >
          {fav ? "❤️" : "🤍"}
        </button>
        <button
          className={`watch-btn ${watch ? "active" : ""}`}
          title={watch ? "Remove from Watchlist" : "Add to Watchlist"}
          onClick={() => watch ? removeWatchlist(movie.id) : addWatchlist(movie)}
        >
          {watch ? "🔖" : "📌"}
        </button>
      </div>
    </div>
  );
}