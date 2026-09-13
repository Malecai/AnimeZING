const stack = [
  { name: "React", role: "Component-driven UI, state, and routing" },
  { name: "Tailwind CSS", role: "Utility-first, fully responsive styling" },
  { name: "Multiple APIs", role: "Jikan, Kitsu, and AniList are used for live anime data sourced from MyAnimeList" },
];

export default function About() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <h1 className="font-display text-3xl tracking-wide text-ink sm:text-4xl">
        About AnimeZING
      </h1>
      <p className="mt-4 text-ink-soft">
        AnimeZING is a school project built for INTECH 3112. It's a small
        anime discovery tool: browse what's trending, search by title, and
        filter by genre, all pulled live from a public API rather than
        hard-coded data.
      </p>

      <h2 className="mt-10 font-display text-xl tracking-wide text-ink">
        Built with
      </h2>
      <ul className="mt-4 space-y-3">
        {stack.map((item) => (
          <li key={item.name} className="panel-border-sm flex items-center gap-4 bg-paper p-4">
            <span className="h-2.5 w-2.5 shrink-0 bg-zing" />
            <div>
              <p className="font-semibold text-ink">{item.name}</p>
              <p className="text-sm text-muted">{item.role}</p>
            </div>
          </li>
        ))}
      </ul>

      <h2 className="mt-10 font-display text-xl tracking-wide text-ink">
        Data source
      </h2>
      <p className="mt-4 text-ink-soft">
        All anime information — titles, cover art, scores, episode counts,
        and genres — comes from{" "}
        <a
          href="https://docs.api.jikan.moe/"
          target="_blank"
          rel="noreferrer"
          className="font-semibold text-ink underline decoration-zing decoration-2 underline-offset-2"
        >
          Jikan
        </a>
        , a free, unofficial REST API for MyAnimeList. No API key is
        required, so the app works right after cloning it.
      </p>
    </div>
  );
}
