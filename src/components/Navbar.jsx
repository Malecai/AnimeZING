import { useState } from "react";
import { NavLink } from "react-router-dom";
import { useFavorites } from "../context/FavoritesContext.jsx";

const links = [
  { to: "/", label: "Home" },
  { to: "/browse", label: "Browse" },
  { to: "/favorites", label: "Favorites" },
  { to: "/about", label: "About" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { favorites } = useFavorites();

  const linkClasses = ({ isActive }) =>
    `flex items-center gap-1.5 px-3 py-2 text-sm font-semibold uppercase tracking-wide transition-colors ${
      isActive ? "bg-ink text-paper" : "text-ink hover:bg-ink/10"
    }`;

  return (
    <header className="border-b-[3px] border-ink bg-paper">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
        <NavLink to="/" className="flex items-center gap-2" onClick={() => setOpen(false)}>
          <span className="grid h-9 w-9 place-items-center bg-zing panel-border-sm text-lg font-display text-paper">
            Z
          </span>
          <span className="font-display text-2xl tracking-wide text-ink">
            Anime<span className="text-zing">ZING</span>
          </span>
        </NavLink>

        <nav className="hidden items-center gap-1 md:flex">
          {links.map((link) => (
            <NavLink key={link.to} to={link.to} className={linkClasses} end={link.to === "/"}>
              {link.label}
              {link.to === "/favorites" && favorites.length > 0 && (
                <span className="grid h-5 min-w-5 place-items-center rounded-full bg-zing px-1 text-[11px] text-paper">
                  {favorites.length}
                </span>
              )}
            </NavLink>
          ))}
        </nav>

        <button
          type="button"
          className="panel-border-sm grid h-10 w-10 place-items-center bg-paper md:hidden"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          onClick={() => setOpen((prev) => !prev)}
        >
          <span className="sr-only">Toggle navigation</span>
          <div className="space-y-1.5">
            <span className={`block h-0.5 w-5 bg-ink transition-transform ${open ? "translate-y-2 rotate-45" : ""}`} />
            <span className={`block h-0.5 w-5 bg-ink transition-opacity ${open ? "opacity-0" : ""}`} />
            <span className={`block h-0.5 w-5 bg-ink transition-transform ${open ? "-translate-y-2 -rotate-45" : ""}`} />
          </div>
        </button>
      </div>

      {open && (
        <nav className="flex flex-col border-t-[3px] border-ink md:hidden">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={linkClasses}
              end={link.to === "/"}
              onClick={() => setOpen(false)}
            >
              {link.label}
              {link.to === "/favorites" && favorites.length > 0 && (
                <span className="grid h-5 min-w-5 place-items-center rounded-full bg-zing px-1 text-[11px] text-paper">
                  {favorites.length}
                </span>
              )}
            </NavLink>
          ))}
        </nav>
      )}
    </header>
  );
}
