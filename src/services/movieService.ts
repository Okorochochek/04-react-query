import axios from "axios";
import type { Movie } from "../types/movie";

interface MoviesHttpResponse {
  page: number;
  total_pages: number;
  total_results: number;
  results: Movie[];
}

export const fetchMovies = async (query: string, page:number): Promise<MoviesHttpResponse> => {
  const myKey = import.meta.env.VITE_TMDB_TOKEN;

  const response = await axios.get<MoviesHttpResponse>(
    "https://api.themoviedb.org/3/search/movie",
    {
      params: {
        query,
        include_adult: false,
        language: "en-US",
        page,
      },
      headers: {
        Authorization: `Bearer ${myKey}`,
      },
    }
  );

  return response.data;
};
