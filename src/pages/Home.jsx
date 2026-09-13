import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchTopAnime } from "../lib/jikan.js";
import AnimeCard from "../components/AnimeCard.jsx";
import Loading from "../components/Loading.jsx";
import ErrorMessage from "../components/ErrorMessage.jsx";

export default function Home() {
  const [anime, setAnime] = useState([]);
  const [status, setStatus] = useState("loading"); // loading | success | error

  async function loadTrending() {
    setStatus("loading");
    try {
      const result = await fetchTopAnime(8);
      setAnime(result.data || []);
      setStatus("success");
    } catch (error) {
      setStatus("error");
    }
  }

  useEffect(() => {
    loadTrending();
  }, []);

  return (
    <div>
      <section className="halftone-strip border-b-[3px] border-ink">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24">
          <div className="panel-border max-w-2xl bg-paper p-6 sm:p-10">
            <p className="font-semibold text-zing">Anime, without the noise</p>
            <h1 className="mt-2 font-display text-4xl leading-none tracking-wide text-ink sm:text-6xl">
              Discover your next obsession
            </h1>
            <p className="mt-4 max-w-lg text-ink-soft">
              AnimeZING pulls live series data straight from the MyAnimeList
              community so you can browse what's popular, filter by genre, and
              find something worth your next binge.
            </p>
            <Link
              to="/browse"
              className="panel-border-sm mt-6 inline-block bg-zing px-6 py-3 font-semibold text-paper transition-colors hover:bg-ink"
            >
              Start browsing
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="flex items-end justify-between">
          <h2 className="font-display text-2xl tracking-wide text-ink sm:text-3xl">
            Trending right now
          </h2>
          <Link to="/browse" className="text-sm font-semibold text-zing hover:underline">
            See all
          </Link>
        </div>

        {status === "loading" && <Loading label="Loading trending anime..." />}
        {status === "error" && <ErrorMessage onRetry={loadTrending} />}
        {status === "success" && (
          <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
            {anime.map((item, index) => (
              <AnimeCard key={item.mal_id} anime={item} rank={index + 1} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
