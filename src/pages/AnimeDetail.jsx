import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { fetchAnimeById } from "../lib/jikan.js";
import { useFavorites } from "../context/FavoritesContext.jsx";
import Loading from "../components/Loading.jsx";
import ErrorMessage from "../components/ErrorMessage.jsx";

export default function AnimeDetail() {
  const { id } = useParams();
  const [anime, setAnime] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { isFavorite, toggleFavorite } = useFavorites();

  const loadDetail = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetchAnimeById(id);
      setAnime(res.data);
    } catch (err) {
      setError("Failed to load anime details. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDetail();
  }, [id]);

  if (loading) return <Loading />;
  if (error) return <ErrorMessage message={error} onRetry={loadDetail} />;
  if (!anime) return null;

  const image =
    anime.images?.jpg?.large_image_url ||
    anime.images?.jpg?.image_url ||
    "https://via.placeholder.com/400x600?text=No+Image";

  return (
    <div className="mx-auto max-w-5xl px-6 py-10">
      {/* Back button */}
      <Link
        to="/browse"
        className="inline-flex items-center gap-2 border-[3px] border-ink bg-paper px-4 py-2 text-sm font-semibold text-ink shadow-[4px_4px_0_0_#14121A] transition-transform hover:-translate-y-0.5 hover:shadow-[6px_6px_0_0_#14121A]"
      >
        ← Back to Browse
      </Link>

      <div className="mt-8 grid grid-cols-1 gap-8 md:grid-cols-3">
        {/* Poster & Badges */}
        <div className="flex flex-col gap-4">
          <div className="panel-border relative overflow-hidden bg-ink-soft">
            <img
              src={image}
              alt={anime.title}
              className="w-full object-cover aspect-[3/4]"
            />
            {anime.score && (
              <span className="absolute bottom-0 right-0 border-l-[3px] border-t-[3px] border-ink bg-zing px-3 py-1.5 font-display text-lg font-bold text-paper">
                ★ {anime.score}
              </span>
            )}
          </div>

          <div className="panel-border-sm bg-paper-dim p-4 flex flex-col gap-2 text-sm">
            <div>
              <span className="font-bold text-ink">Type:</span> {anime.type || "N/A"}
            </div>
            <div>
              <span className="font-bold text-ink">Episodes:</span> {anime.episodes || "Unknown"}
            </div>
            {anime.status && (
              <div>
                <span className="font-bold text-ink">Status:</span> {anime.status}
              </div>
            )}
            {anime.year && (
              <div>
                <span className="font-bold text-ink">Year:</span> {anime.year}
              </div>
            )}
          </div>
        </div>

        {/* Info & Full Synopsis */}
        <div className="flex flex-col gap-6 md:col-span-2">
          <div>
            <div className="flex flex-wrap items-start justify-between gap-3">
              <h1 className="font-display text-4xl text-ink tracking-wide">
                {anime.title}
              </h1>
              <button
                type="button"
                onClick={() => toggleFavorite(anime)}
                aria-pressed={isFavorite(anime.mal_id)}
                className={`panel-border-sm flex shrink-0 items-center gap-2 px-4 py-2 text-sm font-semibold transition-colors ${
                  isFavorite(anime.mal_id)
                    ? "bg-zing text-paper"
                    : "bg-paper text-ink hover:bg-zing hover:text-paper"
                }`}
              >
                <svg
                  viewBox="0 0 24 24"
                  className="h-4 w-4"
                  fill={isFavorite(anime.mal_id) ? "currentColor" : "none"}
                  stroke="currentColor"
                  strokeWidth="2"
                  aria-hidden="true"
                >
                  <path d="M12 21s-6.7-4.35-9.33-8.02C.9 10.2 1.3 6.5 4.3 4.9c2.2-1.2 4.9-.6 6.4 1.3.4.5.9 1.2 1.3 1.8.4-.6.9-1.3 1.3-1.8 1.5-1.9 4.2-2.5 6.4-1.3 3 1.6 3.4 5.3 1.63 8.08C18.7 16.65 12 21 12 21z" />
                </svg>
                {isFavorite(anime.mal_id) ? "Favorited" : "Add to favorites"}
              </button>
            </div>

            {anime.genres && anime.genres.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
                {anime.genres.map((g, idx) => (
                  <span
                    key={g.mal_id || idx}
                    className="border border-ink bg-volt/30 px-2.5 py-1 text-xs font-semibold uppercase tracking-wider text-ink"
                  >
                    {g.name}
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="panel-border bg-paper p-6">
            <h2 className="font-display text-xl text-ink mb-3 border-b-2 border-ink pb-1">
              Synopsis
            </h2>
            <p className="whitespace-pre-line text-sm leading-relaxed text-ink">
              {anime.synopsis || "No detailed synopsis available for this anime."}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
