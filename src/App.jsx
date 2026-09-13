import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import Footer from "./components/Footer.jsx";
import Home from "./pages/Home.jsx";
import Browse from "./pages/Browse.jsx";
import About from "./pages/About.jsx";
import AnimeDetail from "./pages/AnimeDetail.jsx";
import Favorites from "./pages/Favorites.jsx";

export default function App() {
  return (
    <div className="flex min-h-screen flex-col bg-paper">
      <Navbar />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/browse" element={<Browse />} />
          <Route path="/anime/:id" element={<AnimeDetail />} />
          <Route path="/favorites" element={<Favorites />} />
          <Route path="/about" element={<About />} />
          <Route
            path="*"
            element={
              <div className="mx-auto max-w-3xl px-6 py-24 text-center">
                <h1 className="font-display text-5xl tracking-wide text-ink">
                  404
                </h1>
                <p className="mt-3 text-muted">
                  This page doesn't exist. Try Home or Browse instead.
                </p>
              </div>
            }
          />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}
