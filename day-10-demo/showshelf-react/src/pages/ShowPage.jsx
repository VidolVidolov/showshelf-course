import { useEffect, useState } from "react";
import { Link, useParams } from "react-router";
import ShowDetails from "../components/ShowDetails.jsx";
import { getShowById } from "../api/tvmazeApi.js";

export default function ShowPage({ isInList, onToggleList }) {
  const { id } = useParams(); // from the URL: /show/:id
  const [data, setData] = useState(null); // { show, cast, seasons }
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let ignore = false;
    setLoading(true);
    setError(null);

    getShowById(id)
      .then((result) => {
        if (!ignore) setData(result);
      })
      .catch((err) => {
        if (!ignore) setError(err.message);
      })
      .finally(() => {
        if (!ignore) setLoading(false);
      });

    return () => {
      ignore = true;
    };
  }, [id]);

  if (loading) return <p className="status">Loading show…</p>;
  if (error) return <p className="status error">Something went wrong: {error}</p>;
  if (!data) {
    return (
      <p className="status">
        We couldn't find that show. <Link to="/">Back to all shows</Link>
      </p>
    );
  }

  const { show, cast, seasons } = data;
  const inList = isInList(show.id);

  return (
    <>
      <div className="show-actions">
        <Link to="/">← Back</Link>
        <button className={inList ? "" : "button-secondary"} onClick={() => onToggleList(show)}>
          {inList ? "✓ In My List" : "＋ Add to My List"}
        </button>
        <a href={`https://www.tvmaze.com/shows/${show.id}`} target="_blank" rel="noreferrer">
          View on TVmaze
        </a>
      </div>

      <ShowDetails show={show}>
        <section>
          <h2>Seasons</h2>
          {seasons.length === 0 ? (
            <p className="meta">No seasons listed yet.</p>
          ) : (
            <table className="seasons">
              <thead>
                <tr>
                  <th>Season</th>
                  <th>Episodes</th>
                  <th>Premiered</th>
                </tr>
              </thead>
              <tbody>
                {seasons.map((season) => (
                  <tr key={season.id}>
                    <td>{season.number}</td>
                    <td>{season.episodeOrder ?? "?"}</td>
                    <td>{season.premiereDate ?? "?"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </section>

        <section>
          <h2>Cast</h2>
          {cast.length === 0 ? (
            <p className="meta">No cast listed yet.</p>
          ) : (
            <ul className="cast-grid">
              {/* The first 12 people. One person can play two characters, so the key uses both. */}
              {cast.slice(0, 12).map((entry) => (
                <li key={`${entry.person.id}-${entry.character.name}`} className="cast-card">
                  <img src={entry.person.image?.medium ?? "/poster.svg"} alt="" loading="lazy" />
                  <strong>{entry.person.name}</strong>
                  <span className="meta">as {entry.character.name}</span>
                </li>
              ))}
            </ul>
          )}
        </section>
      </ShowDetails>
    </>
  );
}
