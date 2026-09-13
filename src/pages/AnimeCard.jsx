import { Link } from "react-router-dom";
import { useFavorites } from "../context/FavoritesContext.jsx";

export default function AnimeCard({ anime, rank }) {
  const { isFavorite, toggleFavorite } = useFavorites();
  const favorited = isFavorite(anime.mal_id);

  const image =
    anime.images?.jpg?.large_image_url ||
    anime.images?.jpg?.image_url ||
    "https://via.placeholder.com/300x400?text=No+Image";

  const genres = (anime.genres || []).slice(0, 3);
  const formattedScore =
    anime.score && !isNaN(Number(anime.score))
      ? Number(anime.score).toFixed(1)
      : null;

  function handleFavoriteClick(event) {
    // The whole card is a Link to the detail page -- stop the click from
    // bubbling into a navigation so the button can toggle in place.
    event.preventDefault();
    event.stopPropagation();
    toggleFavorite(anime);
  }

  return (
    <Link
      to={`/anime/${anime.mal_id}`}
      className="panel-border flex flex-col bg-paper transition-transform hover:-translate-y-1 h-full cursor-pointer group"
    >
      {/* Image & Badges */}
      <div className="relative aspect-[3/4] w-full overflow-hidden border-b-[3px] border-ink bg-ink-soft">
        <img
          src={image}
          alt={anime.title}
          loading="lazy"
          className="h-full w-full object-cover transition-transform group-hover:scale-105"
        />

        {/* Rank Badge */}
        {rank && (
          <span className="absolute left-0 top-0 grid h-9 w-9 place-items-center border-b-[3px] border-r-[3px] border-ink bg-volt font-display text-lg text-ink">
            {rank}
          </span>
        )}

        {/* Favorite Toggle */}
        <button
          type="button"
          onClick={handleFavoriteClick}
          aria-pressed={favorited}
          aria-label={favorited ? `Remove ${anime.title} from favorites` : `Add ${anime.title} to favorites`}
          className={`absolute right-1.5 top-1.5 grid h-8 w-8 place-items-center border-2 border-ink transition-colors ${
            favorited ? "bg-zing text-paper" : "bg-paper/90 text-ink hover:bg-zing hover:text-paper"
          }`}
        >
          <svg
            viewBox="0 0 24 24"
            className="h-4 w-4"
            fill={favorited ? "currentColor" : "none"}
            stroke="currentColor"
            strokeWidth="2"
            aria-hidden="true"
          >
            <path d="M12 21s-6.7-4.35-9.33-8.02C.9 10.2 1.3 6.5 4.3 4.9c2.2-1.2 4.9-.6 6.4 1.3.4.5.9 1.2 1.3 1.8.4-.6.9-1.3 1.3-1.8 1.5-1.9 4.2-2.5 6.4-1.3 3 1.6 3.4 5.3 1.63 8.08C18.7 16.65 12 21 12 21z" />
          </svg>
        </button>

        {/* Score Badge */}
        {formattedScore && (
          <span className="absolute bottom-0 right-0 border-l-[3px] border-t-[3px] border-ink bg-zing px-2 py-1 text-xs font-bold text-paper">
            ★ {formattedScore}
          </span>
        )}
      </div>

      {/* Content & Metadata */}
      <div className="flex flex-1 flex-col justify-between p-3 gap-2">
        <div>
          <div className="flex items-center justify-between gap-2 mb-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-zing border border-zing/40 px-1.5 py-0.5 rounded">
              {anime.type || "TV"}
            </span>
            {anime.episodes && (
              <span className="text-xs text-muted font-medium">
                {anime.episodes} {anime.episodes === 1 ? "ep" : "eps"}
              </span>
            )}
          </div>

          <h3 className="line-clamp-2 font-semibold leading-snug text-ink text-base group-hover:text-zing transition-colors">
            {anime.title}
          </h3>

          {/* Synopsis Excerpt */}
          {anime.synopsis && (
            <p className="mt-2 line-clamp-3 text-xs leading-relaxed text-muted">
              {anime.synopsis}
            </p>
          )}
        </div>

        {/* Genre Tags */}
        {genres.length > 0 && (
          <div className="mt-2 flex flex-wrap items-center gap-1">
            {genres.map((g, idx) => (
              <span
                key={g.mal_id || idx}
                className="border border-ink/30 bg-paper-dim/50 px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wide text-ink"
              >
                {g.name}
              </span>
            ))}
          </div>
        )}
      </div>
    </Link>
  );
}
