import { useEffect, useState, useRef, useCallback } from "react";
import { getGenres } from "../services/api";
import { useFavorites } from "../context/FavoritesContext";
import MovieCard from "../components/MovieCard";
import axios from "axios";

const YEARS = ["All", "2025", "2024", "2023", "2022", "2021", "2020", "2019", "2018", "2017", "2016", "2015", "2010", "2005", "2000"];
const RATINGS = ["All", "9+", "8+", "7+", "6+"];
const API_KEY = process.env.REACT_APP_TMDB_KEY;

export default function Home() {
  const [movies, setMovies]             = useState([]);
  const [genres, setGenres]             = useState([]);
  const [activeGenre, setActiveGenre]   = useState(null);
  const [yearFilter, setYearFilter]     = useState("All");
  const [ratingFilter, setRatingFilter] = useState("All");
  const [safeMode, setSafeMode]         = useState(true);
  const [page, setPage]                 = useState(1);
  const [hasMore, setHasMore]           = useState(true);
  const [loading, setLoading]           = useState(true);
  const [loadingMore, setLoadingMore]   = useState(false);
  const { lang } = useFavorites();

  const observer = useRef();

  const lastMovieRef = useCallback((node) => {
    if (loadingMore) return;
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && hasMore) {
        setPage((prev) => prev + 1);
      }
    });
    if (node) observer.current.observe(node);
  }, [loadingMore, hasMore]);

  const fetchMovies = useCallback(async (pageNum, reset = false) => {
    try {
      reset ? setLoading(true) : setLoadingMore(true);

      const params = {
        api_key: API_KEY,
        language: lang,
        include_adult: false,
        page: pageNum,
        sort_by: "popularity.desc",
      };

      // Safe Mode ON
      if (safeMode) {
        params.certification_country = "US";
        params["certification.lte"]  = "PG-13";
        params.without_genres        = "10749,27";
      }

      if (activeGenre) params.with_genres = activeGenre.id;
      if (yearFilter !== "All") params.primary_release_year = yearFilter;
      if (ratingFilter !== "All") params["vote_average.gte"] = parseFloat(ratingFilter.replace("+", ""));

      const res = await axios.get("https://api.themoviedb.org/3/discover/movie", { params });
      const results = res.data.results;

      setMovies((prev) => reset ? results : [...prev, ...results]);
      setHasMore(pageNum < res.data.total_pages);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, [lang, activeGenre, yearFilter, ratingFilter, safeMode]);

  useEffect(() => {
    setPage(1);
    setMovies([]);
    fetchMovies(1, true);
  }, [fetchMovies]);

  useEffect(() => {
    if (page === 1) return;
    fetchMovies(page, false);
  }, [page, fetchMovies]);

  useEffect(() => {
    getGenres(lang).then((res) => setGenres(res.data.genres));
  }, [lang]);

  function handleGenre(genre) {
    if (activeGenre?.id === genre.id) {
      setActiveGenre(null);
    } else {
      setActiveGenre(genre);
    }
  }

  return (
    <div className="home">

      {/* Genre Bar */}
      <div className="genre-bar">
        <button
          className={`genre-pill ${!activeGenre ? "active" : ""}`}
          onClick={() => setActiveGenre(null)}
        >
          🎬 All
        </button>
        {genres.map((g) => (
          <button
            key={g.id}
            className={`genre-pill ${activeGenre?.id === g.id ? "active" : ""}`}
            onClick={() => handleGenre(g)}
          >
            {g.name}
          </button>
        ))}
      </div>

      {/* Filters Bar */}
      <div className="filters-bar">
        <div className="filter-group">
          <label>📅 Year</label>
          <select value={yearFilter} onChange={(e) => setYearFilter(e.target.value)}>
            {YEARS.map((y) => <option key={y} value={y}>{y}</option>)}
          </select>
        </div>

        <div className="filter-group">
          <label>⭐ Rating</label>
          <select value={ratingFilter} onChange={(e) => setRatingFilter(e.target.value)}>
            {RATINGS.map((r) => <option key={r} value={r}>{r}</option>)}
          </select>
        </div>

        {/* Safe Mode Toggle */}
        <div className="filter-group">
          <label>🛡️ Safe Mode</label>
          <button
            className={`toggle-btn ${safeMode ? "on" : "off"}`}
            onClick={() => setSafeMode((prev) => !prev)}
          >
            {safeMode ? "ON" : "OFF"}
          </button>
        </div>

        {(yearFilter !== "All" || ratingFilter !== "All" || activeGenre) && (
          <button
            className="clear-filters"
            onClick={() => {
              setYearFilter("All");
              setRatingFilter("All");
              setActiveGenre(null);
            }}
          >
            ✕ Clear
          </button>
        )}
      </div>

      {/* Movies Grid */}
      {loading ? (
        <div className="loading">Loading...</div>
      ) : movies.length === 0 ? (
        <p className="no-results">No movies found.</p>
      ) : (
        <div className="movies-grid">
          {movies.map((m, index) => {
            if (index === movies.length - 1) {
              return (
                <div ref={lastMovieRef} key={m.id}>
                  <MovieCard movie={m} />
                </div>
              );
            }
            return <MovieCard key={m.id} movie={m} />;
          })}
        </div>
      )}

      {loadingMore && (
        <div className="loading-more">Loading more...</div>
      )}

      {!hasMore && movies.length > 0 && (
        <p className="end-results">✅ No more movies to load.</p>
      )}

    </div>
  );
}