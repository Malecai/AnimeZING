import { useEffect, useState } from "react";
import { fetchAnime, fetchGenres } from "../lib/jikan.js";
import AnimeCard from "../components/AnimeCard.jsx";
import SearchBar from "../components/SearchBar.jsx";
import GenreFilter from "../components/GenreFilter.jsx";
import Loading from "../components/Loading.jsx";
import ErrorMessage from "../components/ErrorMessage.jsx";
import Pagination from "../components/Pagination.jsx";

export default function Browse() {
  const [query, setQuery] = useState("");
  const [genre, setGenre] = useState("");
  const [page, setPage] = useState(1);

  const [anime, setAnime] = useState([]);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [status, setStatus] = useState("loading"); // loading | success | error

  const [genres, setGenres] = useState([]);

  // Genre list only needs to be fetched once.
  useEffect(() => {
    fetchGenres()
      .then((result) => setGenres(result.data || []))
      .catch(() => setGenres([]));
  }, []);

  async function loadAnime() {
    setStatus("loading");
    try {
      const result = await fetchAnime({ query, genre, page });
      setAnime(result.data || []);
      setHasNextPage(Boolean(result.pagination?.has_next_page));
      setStatus("success");
    } catch (error) {
      setStatus("error");
    }
  }

  useEffect(() => {
    loadAnime();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query, genre, page]);

  function handleSearch(nextQuery) {
    setPage(1);
    setQuery(nextQuery);
  }

  function handleGenreChange(nextGenre) {
    setPage(1);
    setGenre(nextGenre);
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <h1 className="font-display text-3xl tracking-wide text-ink sm:text-4xl">
        Browse anime
      </h1>
      <p className="mt-1 text-muted">
        Search by title or narrow things down by genre.
      </p>

      <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <SearchBar initialValue={query} onSearch={handleSearch} />
        <GenreFilter genres={genres} value={genre} onChange={handleGenreChange} />
      </div>

      <div className="mt-8">
        {status === "loading" && <Loading />}
        {status === "error" && <ErrorMessage onRetry={loadAnime} />}
        {status === "success" && anime.length === 0 && (
          <p className="py-16 text-center text-muted">
            No anime matched that search. Try a different title or genre.
          </p>
        )}
        {status === "success" && anime.length > 0 && (
          <>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
              {anime.map((item) => (
                <AnimeCard key={item.mal_id} anime={item} />
              ))}
            </div>
            <Pagination page={page} hasNextPage={hasNextPage} onPageChange={setPage} />
          </>
        )}
      </div>
    </div>
  );
}
