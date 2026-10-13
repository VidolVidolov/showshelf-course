import { useState } from "react";
import SearchBar from "../components/SearchBar.jsx";
import GenreFilter from "../components/GenreFilter.jsx";
import ShowGrid from "../components/ShowGrid.jsx";
import { useShows } from "../hooks/useShows.js";

// Props: term + onTermChange (the search text lives in App, so it is still there
// when you come back from a show page), isInList, onToggleList
export default function HomePage({ term, onTermChange, isInList, onToggleList }) {
  const [genre, setGenre] = useState(null);
  const { shows, loading, error } = useShows(term);

  // Genre chips come from the shows we loaded: every genre once, A to Z
  const genres = [...new Set(shows.flatMap((show) => show.genres))].sort();

  // Genre filtering happens here, in the browser: no new API call needed
  const visibleShows = genre ? shows.filter((show) => show.genres.includes(genre)) : shows;

  function handleSearch(newTerm) {
    onTermChange(newTerm);
    setGenre(null); // a new search starts with every genre
  }

  return (
    <>
      <section className="hero">
        <h1>What are we watching tonight?</h1>
        <p>Browse the top-rated shows on TVmaze or search for any show.</p>
        <SearchBar value={term} onChange={handleSearch} />
      </section>

      <section className="toolbar">
        <h2 className="section-title">
          {term.trim() === "" ? "Top rated" : `Results for “${term.trim()}”`}
        </h2>
        {!loading && !error && genres.length > 0 && (
          <GenreFilter genres={genres} selected={genre} onSelect={setGenre} />
        )}
      </section>

      {loading && <p className="status">Loading shows…</p>}
      {error && <p className="status error">Something went wrong: {error}</p>}
      {!loading && !error && visibleShows.length === 0 && (
        <p className="status">No shows found. Try another word, like “office” or “crown”.</p>
      )}
      {!loading && !error && visibleShows.length > 0 && (
        <ShowGrid shows={visibleShows} isInList={isInList} onToggleList={onToggleList} />
      )}
    </>
  );
}
