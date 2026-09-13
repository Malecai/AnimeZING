export default function Footer() {
  return (
    <footer className="halftone-strip border-t-[3px] border-ink">
      <div className="mx-auto flex max-w-6xl flex-col gap-2 bg-paper/95 px-4 py-6 text-sm text-ink sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <p className="font-display tracking-wide">
            Anime<span className="text-zing">ZING</span>
        </p>
        <p className="text-muted">
          Anime data provided by{" "}
          <a
            href="https://jikan.moe/"
            target="_blank"
            rel="noreferrer"
            className="font-semibold text-ink underline decoration-zing decoration-2 underline-offset-2"
          >
            Jikan
          </a>
          , an unofficial MyAnimeList API. Built for INTECH 3112.
        </p>
      </div>
    </footer>
  );
}
