import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useFavorites, LANGUAGES } from "../context/FavoritesContext";

export default function Navbar() {
  const [query, setQuery] = useState("");
  const [showLangs, setShowLangs] = useState(false);
  const navigate = useNavigate();
  const { lang, changeLang } = useFavorites();

  const currentLang = LANGUAGES.find((l) => l.code === lang);

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/search?q=${query}`);
      setQuery("");
    }
  };

  return (
    <nav className="navbar">
      <Link to="/" className="nav-logo">
        🎬 MovieApp
      </Link>

      <form onSubmit={handleSearch} className="search-form">
        <input
          type="text"
          placeholder="Search for a movie..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button type="submit">🔍</button>
      </form>

      <div className="nav-links">
        <Link to="/">Home</Link>
        <Link to="/favorites">Favorites ❤️</Link>

        {/* Language Selector */}
        <div className="lang-selector">
          <button
            className="lang-btn"
            onClick={() => setShowLangs((prev) => !prev)}
          >
            {currentLang?.flag} {currentLang?.label} ▾
          </button>

          {showLangs && (
            <div className="lang-dropdown">
              {LANGUAGES.map((l) => (
                <button
                  key={l.code}
                  type="button"
                  className={l.code === lang ? "active" : ""}
                  onClick={() => {
                    changeLang(l.code);
                    setShowLangs(false);
                  }}
                >
                  {l.flag} {l.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

