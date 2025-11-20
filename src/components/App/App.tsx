import { useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import type { Movie } from "../../types/movie";
import { useQuery } from "@tanstack/react-query";
import { fetchMovies } from "../../services/movieService";
import ReactPaginate from "react-paginate";
import styles from "./App.module.css";

import SearchBar from "../SearchBar/SearchBar";
import MovieGrid from "../MovieGrid/MovieGrid";
import Loader from "../Loader/Loader";
import ErrorMessage from "../ErrorMessage/ErrorMessage";
import MovieModal from "../MovieModal/MovieModal";

export default function App() {
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
 
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

  const closeMovieModal = () => {
    setSelectedMovie(null);
  };

  const {data, isError, isLoading} = useQuery({
    queryKey: ["movies", query, page],
    queryFn: () => fetchMovies(query, page),
    enabled: query.length > 0,
  });

  const movies = data?.results ?? [];
  const totalPages = data?.total_pages ?? 0;

  const handleSearch = (newQuery: string) => {
    if (newQuery.trim() === "") {
      toast.error("Enter a search query");
      return;
    }

    setQuery(newQuery);
    setPage(1);
  };

  return (
    <>
      <div className={styles.app}>
        <Toaster />
        <SearchBar onSubmit={handleSearch} />
        {isError && <ErrorMessage />}
        {isLoading && <Loader />}

      {!isError && !isLoading && movies.length > 0 && (
        <>
        

        {totalPages > 1 && (
            <ReactPaginate
              pageCount={totalPages}
              pageRangeDisplayed={5}
              marginPagesDisplayed={1}
              onPageChange={({ selected }) => setPage(selected + 1)}
              forcePage={page - 1}
              containerClassName={styles.pagination}
              activeClassName={styles.active}
              nextLabel="→"
              previousLabel="←"
            />
          )}
          <MovieGrid movies={movies} onSelect={(movie) => setSelectedMovie(movie)}
        />
        </>
      )}
        {selectedMovie && (
          <MovieModal onClose={closeMovieModal} movie={selectedMovie} />
        )}
      </div>
    </>
  );
}
