import { Link } from "react-router";
import Poster from "./Poster.jsx";
import { ratingLabel, yearsLabel } from "../utils/format.js";

// One show card.
// Props: show (our show shape), isInList (boolean), onToggleList (function)
export default function ShowCard({ show, isInList = false, onToggleList }) {
  // "2008–2013 · AMC" (filter(Boolean) drops empty parts)
  const meta = [yearsLabel(show.premiered, show.ended), show.network].filter(Boolean).join(" · ");

  return (
    <article className="card">
      <Link to={`/show/${show.id}`}>
        <Poster src={show.image} alt="" />
      </Link>
      <button
        className="list-btn"
        aria-pressed={isInList}
        aria-label={`Add ${show.name} to My List`}
        onClick={() => onToggleList(show)}
      >
        {isInList ? "✓" : "＋"}
      </button>
      <div className="card-body">
        {show.genres.length > 0 && <span className="badge">{show.genres[0]}</span>}
        <h3>
          <Link to={`/show/${show.id}`}>{show.name}</Link>
        </h3>
        {show.rating && (
          <p className="rating">
            ★ {show.rating} · {ratingLabel(show.rating)}
          </p>
        )}
        {meta && <p className="meta">{meta}</p>}
      </div>
    </article>
  );
}
