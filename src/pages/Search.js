import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { searchMovies } from "../services/api";
import { useFavorites } from "../context/FavoritesContext";
import MovieCard from "../components/MovieCard";

export default function Search() {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const query = new URLSearchParams(location.search).get("q");
  const { lang } = useFavorites();

  useEffect(() => {
    async function fetch() {
      try {
        setLoading(true);
        const res = await searchMovies(query, lang);
        setResults(res.data.results);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    if (query) fetch();
  }, [query, lang]);

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div className="home">
      <h2>Search results for: "{query}"</h2>
      {results.length === 0 ? (
        <p className="no-results">No results found.</p>
      ) : (
        <div className="movies-grid">
          {results.map((m) => <MovieCard key={m.id} movie={m} />)}
        </div>
      )}
    </div>
  );
}