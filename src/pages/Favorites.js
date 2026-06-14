import { useState } from "react";
import { useFavorites } from "../context/FavoritesContext";
import MovieCard from "../components/MovieCard";

export default function Favorites() {
  const { favorites, watchlist } = useFavorites();
  const [activeTab, setActiveTab] = useState("favorites");

  return (
    <div className="home">
      {/* Tabs */}
      <div className="tabs">
        <button
          className={`tab-btn ${activeTab === "favorites" ? "active" : ""}`}
          onClick={() => setActiveTab("favorites")}
        >
          ❤️ Favorites ({favorites.length})
        </button>
        <button
          className={`tab-btn ${activeTab === "watchlist" ? "active" : ""}`}
          onClick={() => setActiveTab("watchlist")}
        >
          🔖 Watchlist ({watchlist.length})
        </button>
      </div>

      {/* Favorites */}
      {activeTab === "favorites" && (
        <>
          {favorites.length === 0 ? (
            <p className="no-results">No favorites yet. Start adding some!</p>
          ) : (
            <div className="movies-grid">
              {favorites.map((m) => <MovieCard key={m.id} movie={m} />)}
            </div>
          )}
        </>
      )}

      {/* Watchlist */}
      {activeTab === "watchlist" && (
        <>
          {watchlist.length === 0 ? (
            <p className="no-results">No movies in your watchlist yet!</p>
          ) : (
            <div className="movies-grid">
              {watchlist.map((m) => <MovieCard key={m.id} movie={m} />)}
            </div>
          )}
        </>
      )}
    </div>
  );
}