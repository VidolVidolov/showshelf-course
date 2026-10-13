import { useEffect, useState } from "react";
import { getShowsPage, searchShows } from "../api/tvmazeApi.js";

// "Browse" mode: the top-rated shows from the first page of the TVmaze index
async function getTopRated() {
  const shows = await getShowsPage(0);
  return shows
    .filter((show) => show.rating !== null) // keep shows that have a rating
    .sort((a, b) => b.rating - a.rating) // highest first (filter made a new array, so sort is safe)
    .slice(0, 60); // the first 60
}

// Custom hook (stretch): loads shows for a search term.
// Empty term -> browse the top-rated shows. Returns { shows, loading, error }.
export function useShows(term) {
  const [shows, setShows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let ignore = false; // becomes true if the term changes before we finish

    // Wait 400 ms after the last keystroke before calling the API (debounce)
    const timer = setTimeout(async () => {
      setLoading(true);
      setError(null);
      try {
        const cleanTerm = term.trim();
        const result = cleanTerm === "" ? await getTopRated() : await searchShows(cleanTerm);
        if (!ignore) setShows(result);
      } catch (err) {
        if (!ignore) setError(err.message);
      } finally {
        if (!ignore) setLoading(false);
      }
    }, 400);

    // Cleanup: runs before the next effect and when the component disappears
    return () => {
      ignore = true;
      clearTimeout(timer);
    };
  }, [term]); // run again when the term changes

  return { shows, loading, error };
}
