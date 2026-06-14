import axios from "axios";

const BASE_URL = "https://api.themoviedb.org/3";
const API_KEY = process.env.REACT_APP_TMDB_KEY;

const SAFE_PARAMS = {
  include_adult: false,
};

export const createApi = (lang = "ar") =>
  axios.create({
    baseURL: BASE_URL,
    params: {
      api_key: API_KEY,
      language: lang,
      ...SAFE_PARAMS,
    },
  });

export const getTrending = (lang) =>
  createApi(lang).get("/trending/movie/week");

export const getTopRated = (lang) =>
  createApi(lang).get("/movie/top_rated");

export const getUpcoming = (lang) =>
  createApi(lang).get("/movie/upcoming");

export const searchMovies = (query, lang) =>
  createApi(lang).get("/search/movie", {
    params: { query, ...SAFE_PARAMS },
  });

export const getMovieDetails = (id, lang) =>
  createApi(lang).get(`/movie/${id}`, {
    params: { append_to_response: "credits,videos" },
  });

export const getSimilar = (id, lang) =>
  createApi(lang).get(`/movie/${id}/similar`, {
    params: { ...SAFE_PARAMS },
  });

export const getGenres = (lang) =>
  createApi(lang).get("/genre/movie/list");

export const getByGenre = (genreId, lang) =>
  createApi(lang).get("/discover/movie", {
    params: { with_genres: genreId, ...SAFE_PARAMS },
  });

export const IMG_BASE = "https://image.tmdb.org/t/p/w500";