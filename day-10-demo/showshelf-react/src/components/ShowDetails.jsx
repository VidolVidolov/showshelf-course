import Poster from "./Poster.jsx";
import { formatRuntime, ratingLabel, yearsLabel } from "../utils/format.js";

// One full show.
// Props: show (our show shape), children (optional: extra sections, e.g. seasons and cast)
export default function ShowDetails({ show, children }) {
  // "2008–2013 · AMC · 1 h"
  const meta = [yearsLabel(show.premiered, show.ended), show.network, formatRuntime(show.runtime)]
    .filter(Boolean)
    .join(" · ");

  return (
    <article className="show">
      <div className="show-header">
        <Poster src={show.image} alt={`Poster of ${show.name}`} />

        <div className="show-info">
          <h1>{show.name}</h1>
          {meta && <p className="meta">{meta}</p>}
          {show.rating && (
            <p className="rating">
              ★ {show.rating} · {ratingLabel(show.rating)}
            </p>
          )}

          {show.genres.length > 0 && (
            <ul className="genres">
              {show.genres.map((genre) => (
                <li key={genre} className="badge">
                  {genre}
                </li>
              ))}
            </ul>
          )}

          <p className="summary">{show.summary || "No summary yet."}</p>
        </div>
      </div>

      {/* Whatever we put between <ShowDetails> and </ShowDetails> appears here */}
      {children}
    </article>
  );
}
