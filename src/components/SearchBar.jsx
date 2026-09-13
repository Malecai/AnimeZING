import { useState, useEffect } from "react";

export default function SearchBar({ initialValue = "", onSearch, placeholder }) {
  const [value, setValue] = useState(initialValue);

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  function handleSubmit(event) {
    event.preventDefault();
    onSearch(value);
  }

  return (
    <form onSubmit={handleSubmit} className="flex w-full max-w-xl gap-2">
      <label htmlFor="anime-search" className="sr-only">
        Search anime
      </label>
      <input
        id="anime-search"
        type="text"
        value={value}
        onChange={(event) => setValue(event.target.value)}
        placeholder={placeholder || "Search for an anime title..."}
        className="panel-border-sm w-full bg-paper px-4 py-2.5 text-ink placeholder:text-muted focus:outline-none"
      />
      <button
        type="submit"
        className="panel-border-sm shrink-0 bg-ink px-5 py-2.5 font-semibold text-paper transition-colors hover:bg-zing"
      >
        Search
      </button>
    </form>
  );
}
