export default function GenreFilter({ genres = [], value, onChange }) {
  return (
    <div className="flex items-center gap-2">
      <label htmlFor="genre-filter" className="text-sm font-semibold text-ink">
        Genre
      </label>
      <select
        id="genre-filter"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="panel-border-sm bg-paper px-3 py-2.5 text-sm text-ink focus:outline-none cursor-pointer"
      >
        <option value="">All genres</option>
        {genres.map((genre) => (
          <option key={genre.mal_id} value={genre.mal_id}>
            {genre.name}
          </option>
        ))}
      </select>
    </div>
  );
}
