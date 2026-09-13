import { Link } from "react-router-dom";
import { useFavorites } from "../context/FavoritesContext.jsx";
import AnimeCard from "../components/AnimeCard.jsx";

export default function Favorites() {
  const { favorites } = useFavorites();

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <h1 className="font-display text-3xl tracking-wide text-ink sm:text-4xl">
        Your favorites
      </h1>
      <p className="mt-1 text-muted">
        {favorites.length > 0
          ? `${favorites.length} anime saved on this device.`
          : "Anime you save get kept right here."}
      </p>

      {favorites.length === 0 ? (
        <div className="panel-border mt-10 flex flex-col items-center gap-3 bg-paper p-10 text-center">
          <span className="grid h-12 w-12 place-items-center border-[3px] border-ink bg-volt font-display text-2xl text-ink">
            ♡
          </span>
          <p className="font-semibold text-ink">No favorites yet</p>
          <p className="max-w-sm text-sm text-muted">
            Tap the heart on any anime card to save it here. Your list stays
            on this device.
          </p>
          <Link
            to="/browse"
            className="panel-border-sm mt-2 inline-block bg-zing px-5 py-2.5 font-semibold text-paper transition-colors hover:bg-ink"
          >
            Browse anime
          </Link>
        </div>
      ) : (
        <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
          {favorites.map((item) => (
            <AnimeCard key={item.mal_id} anime={item} />
          ))}
        </div>
      )}
    </div>
  );
}
