// Talks to TVmaze (https://www.tvmaze.com/api).
// The same functions as Day 6 (api.js), now as ES modules (export / import).
const API_BASE = "https://api.tvmaze.com";

// Fetch a URL and return the JSON. Throws an error when the status is not 2xx.
export async function getJSON(url) {
  const response = await fetch(url);
  if (!response.ok) {
    const error = new Error(`Request failed with status ${response.status}`);
    error.status = response.status; // so we can check for 404 later
    throw error;
  }
  return response.json();
}

// "<p><b>Friends</b> is ...</p>" -> "Friends is ..."
// The summary is HTML from someone else's server: we remove the tags and show plain text.
export function stripTags(html) {
  return (html ?? "")
    .replace(/<[^>]+>/g, "") // remove tags like <p> and <b>
    .replace(/&amp;/g, "&") // the most common HTML entity: &amp; means &
    .trim();
}

// "2008-01-20" -> 2008, null -> null
export function yearOf(date) {
  return date ? Number(date.slice(0, 4)) : null;
}

// The adapter: one TVmaze show object -> OUR show shape.
// Every component works with our shape, so they never need to know about TVmaze.
export function toShow(apiShow) {
  return {
    id: apiShow.id,
    name: apiShow.name,
    genres: apiShow.genres ?? [],
    rating: apiShow.rating?.average ?? null,
    premiered: yearOf(apiShow.premiered),
    ended: yearOf(apiShow.ended),
    runtime: apiShow.averageRuntime ?? apiShow.runtime ?? null,
    network: apiShow.network?.name ?? apiShow.webChannel?.name ?? "",
    image: apiShow.image?.medium ?? null,
    summary: stripTags(apiShow.summary),
  };
}

// Search by name. TVmaze wraps every result: [{ score, show }, ...]
// Nothing found -> [] (an empty array, not null).
export async function searchShows(term) {
  const results = await getJSON(`${API_BASE}/search/shows?q=${encodeURIComponent(term)}`);
  return results.map((result) => toShow(result.show));
}

// One page of the show index (up to 250 shows, sorted by id). Used for "Browse".
export async function getShowsPage(page = 0) {
  const shows = await getJSON(`${API_BASE}/shows?page=${page}`);
  return shows.map(toShow);
}

// One show with its cast and seasons ("embed" adds them to the same answer).
// Returns { show, cast, seasons }, or null when TVmaze doesn't know this id (404).
export async function getShowById(id) {
  let data;
  try {
    data = await getJSON(`${API_BASE}/shows/${encodeURIComponent(id)}?embed[]=cast&embed[]=seasons`);
  } catch (error) {
    if (error.status === 404) return null; // not found is not a crash
    throw error;
  }

  return {
    show: toShow(data),
    cast: data._embedded?.cast ?? [],
    seasons: data._embedded?.seasons ?? [],
  };
}

// Stretch: every episode of a show (TVmaze's own shape: { id, name, season, number, airdate, ... })
export async function getEpisodes(id) {
  return getJSON(`${API_BASE}/shows/${encodeURIComponent(id)}/episodes`);
}
