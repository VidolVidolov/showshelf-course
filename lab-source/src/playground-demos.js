/* Ready-made demos for the Playground: Lab.playgroundDemos.
   Each one: { id, group, title, setup: blank|showshelf|react|server, tab (optional), code: { html, css, js, jsx, server } }
   Open one directly with showshelf-lab.html#/playground/<id> */
Lab.playgroundDemos = [
  // ---------------- Day 1 ----------------
  {
    id: "html-page", group: "Day 1 · HTML", title: "A page about one show", setup: "blank",
    code: {
      html: `<h1>Breaking Bad</h1>
<p class="meta">AMC · 2008–2013 · 62 episodes</p>

<img src="poster.svg" alt="Poster for Breaking Bad" width="160">

<p>
  A chemistry teacher becomes a <strong>drug kingpin</strong>.
  It is <em>very</em> tense.
</p>

<h2>Main cast</h2>
<ul>
  <li>Bryan Cranston as Walter White</li>
  <li>Aaron Paul as Jesse Pinkman</li>
</ul>

<h2>My top 3 seasons</h2>
<ol>
  <li>Season 5</li>
  <li>Season 4</li>
  <li>Season 2</li>
</ol>

<p><a href="https://www.tvmaze.com/shows/169/breaking-bad">Read more on TVmaze</a></p>

<!-- A comment: the browser doesn't show this -->
`,
    },
  },
  {
    id: "html-table", group: "Day 1 · HTML", title: "Tables, sections and details", setup: "blank",
    code: {
      html: `<section>
  <h2>Seasons</h2>
  <table>
    <tr><th>Season</th><th>Episodes</th><th>Year</th></tr>
    <tr><td>1</td><td>7</td><td>2008</td></tr>
    <tr><td>2</td><td>13</td><td>2009</td></tr>
    <tr><td>3</td><td>13</td><td>2010</td></tr>
  </table>
</section>

<section>
  <h2>Spoiler</h2>
  <details>
    <summary>How does it end? (click)</summary>
    <p>No spoilers here. Watch it!</p>
  </details>
</section>
`,
      css: `table { border-collapse: collapse; }
th, td { border: 1px solid #ccc; padding: 6px 12px; }`,
    },
  },
  // ---------------- Day 2 ----------------
  {
    id: "css-basics", group: "Day 2 · CSS", title: "Rules, colours, classes and variables", setup: "blank",
    code: {
      html: `<article class="show">
  <h1>Dark</h1>
  <p class="meta">Netflix · 2017–2020</p>
  <p>A missing child sets four families on a hunt for answers.</p>
  <a href="https://www.tvmaze.com">More on TVmaze</a>
</article>
`,
      css: `/* Try: change the colours in :root */
:root {
  --color-accent: #0a7d5a;
  --color-bg: #f2f6f4;
}

body {
  background-color: var(--color-bg);
  font-family: system-ui, Arial, sans-serif;
  color: #1c1b29;
  line-height: 1.6;
}

h1 {
  color: var(--color-accent);
}

.meta {
  color: #676580;
  font-size: 14px;
}

.show {
  max-width: 420px;
  margin: 40px auto;
  padding: 24px;
  background: white;
  border: 1px solid #ddd;
  border-radius: 12px;
}

a { color: var(--color-accent); }
a:hover { text-decoration: none; }
`,
    },
  },
  {
    id: "box-model", group: "Day 2 · CSS", title: "The box model", setup: "blank",
    code: {
      html: `<div class="box">content</div>
<div class="box second">content</div>
`,
      css: `/* Change the numbers and watch the boxes */
.box {
  width: 200px;
  padding: 20px;              /* inside, between text and border */
  border: 8px solid #5b3fd6;  /* the edge */
  margin: 24px;               /* outside, space to the neighbours */
  background: #ece8ff;
}

.second {
  margin-left: auto;          /* margin: auto pushes the box */
  margin-right: auto;
}
`,
    },
  },
  // ---------------- Day 3 ----------------
  {
    id: "flexbox", group: "Day 3 · Layout", title: "Flexbox: a header in a row", setup: "blank",
    code: {
      html: `<header class="top">
  <a class="logo" href="#">ShowShelf</a>
  <nav class="nav">
    <a href="#">Home</a>
    <a href="#">Shows</a>
    <a href="#">About</a>
  </nav>
</header>

<div class="row">
  <div>One</div>
  <div class="grow">Two (flex: 1)</div>
  <div>Three</div>
</div>
`,
      css: `.top {
  display: flex;
  justify-content: space-between;  /* try: center, flex-start */
  align-items: center;
  padding: 12px 20px;
  background: #1d1b29;
}
.logo { color: white; font-weight: bold; font-size: 22px; text-decoration: none; }
.nav { display: flex; gap: 16px; }
.nav a { color: #c6b8ff; }

.row { display: flex; gap: 10px; margin: 20px; }
.row div { padding: 16px; background: #ece8ff; border-radius: 8px; }
.row .grow { flex: 1; }
`,
    },
  },
  {
    id: "grid", group: "Day 3 · Layout", title: "Grid and media queries", setup: "blank",
    code: {
      html: `<div class="grid">
  <div class="card">Friends</div>
  <div class="card">Breaking Bad</div>
  <div class="card">The Office</div>
  <div class="card">Dark</div>
  <div class="card">Chernobyl</div>
  <div class="card">Fleabag</div>
</div>
`,
      css: `/* Phones first: 2 columns. Make the preview wider (Preview or Bigger) to see more */
.grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
  padding: 12px;
}
.card {
  aspect-ratio: 2 / 3;
  display: grid;
  place-items: center;
  background: linear-gradient(#7b5cff, #3d2a99);
  color: white;
  border-radius: 10px;
  font-weight: bold;
}

@media (min-width: 600px) {
  .grid { grid-template-columns: repeat(3, 1fr); }
}
@media (min-width: 900px) {
  .grid { grid-template-columns: repeat(6, 1fr); }
}
`,
    },
  },
  // ---------------- Day 4 ----------------
  {
    id: "js-first", group: "Day 4 · JavaScript", title: "Console, variables, text on the page", setup: "blank", tab: "js",
    code: {
      html: `<h1 id="title"></h1>
<p id="info"></p>
<p id="verdict"></p>
`,
      js: `// Open the Console under the preview
console.log("Hello from JavaScript!");

const showName = "The Office";
const episodes = 201;
const runtime = 30;            // minutes per episode
let watched = 10;
watched = watched + 1;

const hours = Math.round((episodes * runtime) / 60);
console.log(showName, episodes, hours);

document.querySelector("#title").textContent = showName;
document.querySelector("#info").textContent =
  \`\${episodes} episodes: about \${hours} hours. You have watched \${watched}.\`;

if (hours > 50) {
  document.querySelector("#verdict").textContent = "A long one. Get snacks.";
} else {
  document.querySelector("#verdict").textContent = "One weekend is enough.";
}
`,
    },
  },
  // ---------------- Day 5 ----------------
  {
    id: "functions", group: "Day 5 · Functions", title: "Functions, return and decisions", setup: "blank", tab: "js",
    code: {
      html: `<p>Open the Console.</p>\n`,
      js: `function watchTime(episodes, runtime) {
  return Math.round((episodes * runtime) / 60);
}

function ratingLabel(rating) {
  if (rating >= 9) {
    return "Must watch";
  } else if (rating >= 8) {
    return "Good";
  } else {
    return "OK";
  }
}

// an arrow function and a default value
const greet = (name = "friend") => \`Hello, \${name}!\`;

console.log(watchTime(236, 30));   // Friends: 236 episodes of 30 minutes
console.log(ratingLabel(9.2));
console.log(ratingLabel(7.5));
console.log(greet("Ana"));
console.log(greet());

// log vs return: this one only prints, it gives back nothing
function shout(text) {
  console.log(text.toUpperCase());
}
const result = shout("hi");
console.log(result);   // undefined
`,
    },
  },
  // ---------------- Day 6 ----------------
  {
    id: "lists", group: "Day 6 · Lists", title: "Arrays, objects, loops, filter and map", setup: "showshelf", tab: "js",
    code: {
      html: `<main class="container">
  <h2>Shows from HBO</h2>
  <ul id="list"></ul>
</main>
`,
      js: `// shows: the 12 shows (the Setup gives them to you)
console.log(shows.length, shows[0].name);

const favourites = ["Dark", "Fleabag"];
favourites.push("Chernobyl");
console.log(favourites);

const myShow = { name: "Dark", year: 2017, rating: 8.7 };
console.log(myShow.name, myShow.rating);

// a loop
for (const show of shows) {
  if (show.rating >= 9) {
    console.log("Top:", show.name);
  }
}

// filter, map, find
const hbo = shows.filter((show) => show.network === "HBO");
const names = hbo.map((show) => show.name);
const friends = shows.find((show) => show.id === 1);
console.log(names, friends.name);

// on the page
for (const name of names) {
  const li = document.createElement("li");
  li.textContent = name;
  document.querySelector("#list").append(li);
}
`,
    },
  },
  // ---------------- Day 7 ----------------
  {
    id: "dom-cards", group: "Day 7 · DOM and events", title: "Cards from data, with a live search", setup: "showshelf", tab: "js",
    code: {
      html: `<main class="container">
  <form class="search" id="search-form">
    <input type="search" id="search" placeholder="Search, e.g. the">
    <button type="submit">Search</button>
  </form>
  <p class="status" id="empty" hidden>No shows match.</p>
  <div class="grid" id="grid"></div>
</main>
`,
      js: `const grid = document.querySelector("#grid");
const search = document.querySelector("#search");

function createCard(show) {
  const card = document.createElement("article");
  card.className = "card";

  const img = document.createElement("img");
  img.className = "poster";
  img.src = "poster.svg";
  img.alt = "";

  const body = document.createElement("div");
  body.className = "card-body";
  const title = document.createElement("h3");
  title.textContent = show.name;
  const rating = document.createElement("p");
  rating.className = "rating";
  rating.textContent = "★ " + show.rating;

  body.append(title, rating);
  card.append(img, body);
  return card;
}

function render(list) {
  grid.replaceChildren(...list.map(createCard));
  document.querySelector("#empty").hidden = list.length > 0;
}

search.addEventListener("input", () => {
  const term = search.value.toLowerCase();
  render(shows.filter((show) => show.name.toLowerCase().includes(term)));
});

document.querySelector("#search-form").addEventListener("submit", (event) => {
  event.preventDefault();   // no page reload
});

render(shows);
`,
    },
  },
  {
    id: "click-storage", group: "Day 7 · DOM and events", title: "A click counter saved in localStorage", setup: "blank", tab: "js",
    code: {
      html: `<button id="btn">Clicked 0 times</button>
<button id="reset">Reset</button>
<p>Reload the preview (Run again): the number stays.</p>
`,
      css: `button { font-size: 20px; padding: 10px 16px; }`,
      js: `const btn = document.querySelector("#btn");

// read the saved number (or 0 the first time)
let count = Number(localStorage.getItem("clicks")) || 0;
btn.textContent = \`Clicked \${count} times\`;

btn.addEventListener("click", () => {
  count = count + 1;
  localStorage.setItem("clicks", count);
  btn.textContent = \`Clicked \${count} times\`;
});

document.querySelector("#reset").addEventListener("click", () => {
  count = 0;
  localStorage.removeItem("clicks");
  btn.textContent = "Clicked 0 times";
});
`,
    },
  },
  // ---------------- Day 8 ----------------
  {
    id: "fetch-search", group: "Day 8 · fetch and APIs", title: "Search TVmaze with fetch", setup: "showshelf", tab: "js",
    code: {
      html: `<main class="container">
  <form class="search" id="form">
    <input type="search" id="term" value="office">
    <button type="submit">Search</button>
  </form>
  <p class="status" id="status"></p>
  <ul id="results"></ul>
</main>
`,
      js: `// Tip: switch Live off (top right) while typing fetch code, then press Run
const statusEl = document.querySelector("#status");
const results = document.querySelector("#results");

async function searchShows(term) {
  const url = \`https://api.tvmaze.com/search/shows?q=\${encodeURIComponent(term)}\`;
  console.log(url);
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error("Status " + response.status);
  }
  const data = await response.json();
  console.log(data[0]);            // look at the shape: { score, show }
  return data.map((item) => item.show);
}

document.querySelector("#form").addEventListener("submit", async (event) => {
  event.preventDefault();
  statusEl.textContent = "Loading...";
  results.replaceChildren();
  try {
    const list = await searchShows(document.querySelector("#term").value);
    statusEl.textContent = list.length ? \`\${list.length} shows\` : "Nothing found.";
    for (const show of list) {
      const li = document.createElement("li");
      li.textContent = \`\${show.name} (\${show.premiered ?? "?"})\`;
      results.append(li);
    }
  } catch (error) {
    statusEl.textContent = "Something went wrong: " + error.message;
  }
});
`,
    },
  },
  // ---------------- Day 9 ----------------
  {
    id: "show-details", group: "Day 9 · The show page", title: "One show with its cast and seasons", setup: "showshelf", tab: "js",
    code: {
      html: `<main class="container show">
  <h1 id="name">Loading...</h1>
  <p class="meta" id="meta"></p>
  <p id="summary"></p>
  <h2>Cast</h2>
  <ul id="cast"></ul>
  <h2>Seasons</h2>
  <ul id="seasons"></ul>
</main>
`,
      js: `async function getShow(id) {
  const url = \`https://api.tvmaze.com/shows/\${id}?embed[]=cast&embed[]=seasons\`;
  const response = await fetch(url);
  if (response.status === 404) return null;
  return response.json();
}

async function openShow(id) {
  const data = await getShow(id);
  if (!data) {
    document.querySelector("#name").textContent = "Show not found";
    return;
  }
  document.querySelector("#name").textContent = data.name;
  document.querySelector("#meta").textContent = \`\${data.network?.name ?? ""} · \${data.premiered}\`;
  // the summary is HTML: remove the tags and show it as text (never innerHTML)
  document.querySelector("#summary").textContent = (data.summary ?? "").replace(/<[^>]+>/g, "");

  for (const member of data._embedded.cast) {
    const li = document.createElement("li");
    li.textContent = \`\${member.person.name} as \${member.character.name}\`;
    document.querySelector("#cast").append(li);
  }
  for (const season of data._embedded.seasons) {
    const li = document.createElement("li");
    li.textContent = \`Season \${season.number}: \${season.episodeOrder ?? "?"} episodes\`;
    document.querySelector("#seasons").append(li);
  }
}

openShow(431);   // Friends. Try 169 (Breaking Bad) or 1 (not found offline)
`,
    },
  },
  // ---------------- Day 10 ----------------
  {
    id: "react", group: "Day 10 · React and servers", title: "React: components, props and state", setup: "react", tab: "jsx",
    code: {
      html: `<div id="root"></div>\n`,
      jsx: `// In a real project: import { useState } from "react";
function ShowCard({ show }) {
  const [inList, setInList] = React.useState(false);
  return (
    <article className="card">
      <div className="card-body">
        <h3>{show.name}</h3>
        <p className="rating">★ {show.rating}</p>
        <button onClick={() => setInList(!inList)}>
          {inList ? "✓ In My List" : "+ My List"}
        </button>
      </div>
    </article>
  );
}

function App() {
  const [search, setSearch] = React.useState("");
  const visible = shows.filter((s) => s.name.toLowerCase().includes(search.toLowerCase()));
  return (
    <main className="container">
      <h1>ShowShelf in React</h1>
      <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search" />
      <p>{visible.length} shows</p>
      <div className="grid">
        {visible.map((show) => <ShowCard key={show.id} show={show} />)}
      </div>
    </main>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
`,
    },
  },
  {
    id: "express", group: "Day 10 · React and servers", title: "Express: a My List API and a page that uses it", setup: "server", tab: "server",
    code: {
      server: `// A pretend Express server that runs in the browser. Real one: Node + npm install express
const app = express();
app.use(express.json());

let myList = [
  { id: 1, name: "Friends" },
  { id: 2, name: "Dark" },
];

app.get("/api/mylist", (req, res) => {
  res.json(myList);
});

app.post("/api/mylist", (req, res) => {
  if (!req.body.name) {
    return res.status(400).json({ error: "name is required" });
  }
  const item = { id: Date.now(), name: req.body.name };
  myList.push(item);
  res.status(201).json(item);
});

app.delete("/api/mylist/:id", (req, res) => {
  myList = myList.filter((item) => item.id !== Number(req.params.id));
  res.status(204).end();
});

app.listen(3000);
`,
      js: `// app.js: the page talks to the server with fetch (watch the Console)
async function load() {
  const response = await fetch("/api/mylist");
  const items = await response.json();
  const ul = document.querySelector("#list");
  ul.replaceChildren(...items.map((item) => {
    const li = document.createElement("li");
    li.textContent = item.name + " ";
    const del = document.createElement("button");
    del.textContent = "Remove";
    del.addEventListener("click", async () => {
      await fetch("/api/mylist/" + item.id, { method: "DELETE" });
      load();
    });
    li.append(del);
    return li;
  }));
}

document.querySelector("#add").addEventListener("submit", async (event) => {
  event.preventDefault();
  const name = document.querySelector("#name").value;
  const response = await fetch("/api/mylist", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name }),
  });
  console.log("Status:", response.status);
  load();
});

load();
`,
      html: `<main class="container">
  <h1>My List</h1>
  <form id="add" class="search">
    <input id="name" placeholder="A show name">
    <button>Add</button>
  </form>
  <ul id="list"></ul>
</main>
`,
    },
  },
  // ---------------- Day 11 ----------------
  {
    id: "dark-mode", group: "Day 11 · Make it yours", title: "A dark mode button that remembers", setup: "showshelf", tab: "js",
    code: {
      html: `<main class="container">
  <section class="hero">
    <h1>My ShowShelf</h1>
    <p>Press the button. Reload: it stays.</p>
    <button id="theme">Dark mode</button>
  </section>
</main>
`,
      css: `body.dark {
  --color-bg: #12111a;
  --color-surface: #1d1b29;
  --color-text: #f1f0f7;
  --color-muted: #a9a6c2;
}
`,
      js: `const button = document.querySelector("#theme");

function apply(dark) {
  document.body.classList.toggle("dark", dark);
  button.textContent = dark ? "Light mode" : "Dark mode";
}

apply(localStorage.getItem("theme") === "dark");

button.addEventListener("click", () => {
  const dark = !document.body.classList.contains("dark");
  localStorage.setItem("theme", dark ? "dark" : "light");
  apply(dark);
});
`,
    },
  },
];
