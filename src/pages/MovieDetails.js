import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getMovieDetails, getSimilar, IMG_BASE } from "../services/api";
import { useFavorites } from "../context/FavoritesContext";
import MovieCard from "../components/MovieCard";

export default function MovieDetails() {
  const { id } = useParams();
  const [movie, setMovie]     = useState(null);
  const [similar, setSimilar] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userRating, setUserRating] = useState(0);
  const [hovered, setHovered]       = useState(0);
  const [copied, setCopied]         = useState(false);
  const { isFavorite, addFavorite, removeFavorite, lang } = useFavorites();

  useEffect(() => {
    async function fetch() {
      try {
        setLoading(true);
        const [movieRes, similarRes] = await Promise.all([
          getMovieDetails(id, lang),
          getSimilar(id, lang),
        ]);
        setMovie(movieRes.data);
        setSimilar(similarRes.data.results.slice(0, 12));

        // جيب الـ rating المحفوظ
        const saved = localStorage.getItem(`rating_${id}`);
        if (saved) setUserRating(Number(saved));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetch();
  }, [id, lang]);

  function handleRating(star) {
    setUserRating(star);
    localStorage.setItem(`rating_${id}`, star);
  }

  function handleShare(platform) {
    const url = window.location.href;
    const text = `Check out this movie: ${movie.title} 🎬`;

    if (platform === "whatsapp") {
      window.open(`https://wa.me/?text=${encodeURIComponent(text + " " + url)}`, "_blank");
    } else if (platform === "copy") {
      navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }

  if (loading) return <div className="loading">Loading...</div>;
  if (!movie)  return <div className="loading">Movie not found.</div>;

  const fav = isFavorite(movie.id);
  const trailer = movie.videos?.results?.find(
    (v) => v.type === "Trailer" && v.site === "YouTube"
  );

  return (
    <div className="details">
      <div className="details-hero">
        <img
          src={
            movie.poster_path
              ? IMG_BASE + movie.poster_path
              : "https://via.placeholder.com/300x450?text=No+Image"
          }
          alt={movie.title}
          className="details-poster"
        />
        <div className="details-info">
          <h1>{movie.title}</h1>
          <p className="tagline">{movie.tagline}</p>

          <div className="meta">
            <span>⭐ {movie.vote_average?.toFixed(1)}</span>
            <span>📅 {movie.release_date}</span>
            <span>⏱ {movie.runtime} min</span>
          </div>

          <div className="genres">
            {movie.genres?.map((g) => (
              <span key={g.id} className="genre-tag">{g.name}</span>
            ))}
          </div>

          <p className="overview">{movie.overview}</p>

          {/* User Rating */}
          <div className="user-rating">
            <p className="rating-label">Your Rating:</p>
            <div className="stars">
              {[1,2,3,4,5,6,7,8,9,10].map((star) => (
                <button
                  key={star}
                  className={`star ${star <= (hovered || userRating) ? "active" : ""}`}
                  onMouseEnter={() => setHovered(star)}
                  onMouseLeave={() => setHovered(0)}
                  onClick={() => handleRating(star)}
                >
                  ★
                </button>
              ))}
              {userRating > 0 && (
                <span className="rating-value">{userRating}/10</span>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="action-buttons">
            <button
              className={`fav-btn-large ${fav ? "active" : ""}`}
              onClick={() => fav ? removeFavorite(movie.id) : addFavorite(movie)}
            >
              {fav ? "❤️ Remove Favorite" : "🤍 Add Favorite"}
            </button>

            <button
              className="share-btn whatsapp"
              onClick={() => handleShare("whatsapp")}
            >
              📲 WhatsApp
            </button>

            <button
              className="share-btn copy"
              onClick={() => handleShare("copy")}
            >
              {copied ? "✅ Copied!" : "🔗 Copy Link"}
            </button>
          </div>
        </div>
      </div>

      {trailer && (
        <div className="trailer">
          <h2>🎬 Trailer</h2>
          <iframe
            src={`https://www.youtube.com/embed/${trailer.key}`}
            title="Trailer"
            allowFullScreen
          />
        </div>
      )}

      <div className="cast">
        <h2>👥 Cast</h2>
        <div className="cast-grid">
          {movie.credits?.cast?.slice(0, 10).map((actor) => (
            <div key={actor.id} className="actor-card">
              <img
                src={
                  actor.profile_path
                    ? IMG_BASE + actor.profile_path
                    : "https://via.placeholder.com/150x200?text=N/A"
                }
                alt={actor.name}
              />
              <p className="actor-name">{actor.name}</p>
              <p className="actor-char">{actor.character}</p>
            </div>
          ))}
        </div>
      </div>

      {similar.length > 0 && (
        <div className="similar">
          <h2>🎥 Similar Movies</h2>
          <div className="movies-grid">
            {similar.map((m) => (
              <MovieCard key={m.id} movie={m} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}