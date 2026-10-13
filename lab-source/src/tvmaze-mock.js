/* Saved sample answers in TVmaze's format, used by the Lab when there is no internet.
   Real TVmaze ids for Friends (431) and Breaking Bad (169); the others are sample ids.
   Pictures are left out (image: null) so the pages use poster.svg offline. */
(function () {
  "use strict";
  const extra = {
    "Friends": { id: 431, cast: [["Jennifer Aniston", "Rachel Green"], ["Courteney Cox", "Monica Geller"], ["Lisa Kudrow", "Phoebe Buffay"], ["Matt LeBlanc", "Joey Tribbiani"], ["Matthew Perry", "Chandler Bing"], ["David Schwimmer", "Ross Geller"]], seasons: [24, 24, 25, 24, 24, 25, 24, 24, 24, 18] },
    "Breaking Bad": { id: 169, cast: [["Bryan Cranston", "Walter White"], ["Aaron Paul", "Jesse Pinkman"], ["Anna Gunn", "Skyler White"], ["Dean Norris", "Hank Schrader"]], seasons: [7, 13, 13, 13, 16] },
    "The Office": { cast: [["Steve Carell", "Michael Scott"], ["Rainn Wilson", "Dwight Schrute"], ["John Krasinski", "Jim Halpert"], ["Jenna Fischer", "Pam Beesly"]], seasons: [6, 22, 25, 19, 28, 26, 26, 24, 25] },
    "Game of Thrones": { cast: [["Emilia Clarke", "Daenerys Targaryen"], ["Kit Harington", "Jon Snow"], ["Peter Dinklage", "Tyrion Lannister"], ["Lena Headey", "Cersei Lannister"]], seasons: [10, 10, 10, 10, 10, 10, 7, 6], years: [2011, 2012, 2013, 2014, 2015, 2016, 2017, 2019] },
    "The Crown": { cast: [["Claire Foy", "Queen Elizabeth II"], ["Olivia Colman", "Queen Elizabeth II"], ["Matt Smith", "Prince Philip"]], seasons: [10, 10, 10, 10, 10, 10], years: [2016, 2017, 2019, 2020, 2022, 2023] },
    "Dark": { cast: [["Louis Hofmann", "Jonas Kahnwald"], ["Lisa Vicari", "Martha Nielsen"], ["Oliver Masucci", "Ulrich Nielsen"]], seasons: [10, 8, 8], years: [2017, 2019, 2020] },
    "Chernobyl": { cast: [["Jared Harris", "Valery Legasov"], ["Stellan Skarsgård", "Boris Shcherbina"], ["Emily Watson", "Ulana Khomyuk"]], seasons: [5] },
    "The Wire": { cast: [["Dominic West", "Jimmy McNulty"], ["Idris Elba", "Stringer Bell"], ["Michael K. Williams", "Omar Little"]], seasons: [13, 12, 12, 13, 10], years: [2002, 2003, 2004, 2006, 2008] },
    "How I Met Your Mother": { cast: [["Josh Radnor", "Ted Mosby"], ["Neil Patrick Harris", "Barney Stinson"], ["Alyson Hannigan", "Lily Aldrin"], ["Jason Segel", "Marshall Eriksen"], ["Cobie Smulders", "Robin Scherbatsky"]], seasons: [22, 22, 20, 24, 24, 24, 24, 24, 24] },
    "Band of Brothers": { cast: [["Damian Lewis", "Richard Winters"], ["Ron Livingston", "Lewis Nixon"]], seasons: [10] },
    "Fleabag": { cast: [["Phoebe Waller-Bridge", "Fleabag"], ["Sian Clifford", "Claire"], ["Andrew Scott", "The Priest"]], seasons: [6, 6], years: [2016, 2019] },
    "Avatar: The Last Airbender": { cast: [["Zach Tyler Eisen", "Aang"], ["Mae Whitman", "Katara"], ["Dante Basco", "Zuko"]], seasons: [20, 20, 21] },
  };
  let nextId = 9001;
  const person = (name, i) => ({ id: i, name, image: null });
  const shows = Lab.data.shows.map((s) => {
    const x = extra[s.name] || { cast: [], seasons: [] };
    const id = x.id || nextId++;
    const years = x.years || x.seasons.map((_, i) => Math.min(s.premiered + i, s.ended || s.premiered + i));
    return {
      id,
      url: "https://www.tvmaze.com/shows/" + id,
      name: s.name,
      type: "Scripted",
      language: "English",
      genres: s.genres.slice(),
      status: "Ended",
      runtime: s.runtime,
      averageRuntime: s.runtime,
      premiered: s.premiered + "-01-01",
      ended: s.ended ? s.ended + "-12-31" : null,
      rating: { average: s.rating },
      network: { id: 1, name: s.network },
      webChannel: null,
      image: null,
      summary: "<p><b>" + s.name.replace(/&/g, "&amp;") + "</b>: " + s.summary.replace(/&/g, "&amp;") + "</p>",
      _cast: x.cast.map((c, i) => ({ person: person(c[0], id * 100 + i), character: { id: id * 100 + 50 + i, name: c[1], image: null } })),
      _seasons: x.seasons.map((eps, i) => ({ id: id * 100 + i, number: i + 1, episodeOrder: eps, premiereDate: years[i] + "-01-01", endDate: null, image: null })),
    };
  });
  const pub = (s) => { const o = Object.assign({}, s); delete o._cast; delete o._seasons; return o; };
  Lab.data.tvmaze = shows.map(pub);

  Lab.mock = function (url) {
    const u = new URL(url);
    const path = u.pathname.replace(/\/+$/, "");
    if (path === "/search/shows") {
      const q = (u.searchParams.get("q") || "").trim().toLowerCase();
      if (!q) return { __status: 400, body: { name: "Bad Request", message: "Missing required parameters: \"q\".", status: 400 } };
      const words = q.split(/\s+/);
      return shows
        .filter((s) => words.some((w) => s.name.toLowerCase().includes(w)))
        .map((s) => ({ score: s.name.toLowerCase().includes(q) ? 0.9 : 0.5, show: pub(s) }))
        .sort((a, b) => b.score - a.score);
    }
    if (path === "/shows") {
      const page = Number(u.searchParams.get("page") || 0);
      return page === 0 ? shows.map(pub) : { __status: 404, body: { name: "Not Found", message: "", status: 404 } };
    }
    let m = path.match(/^\/shows\/(\d+)(\/(cast|seasons|episodes))?$/);
    if (m) {
      const s = shows.find((x) => x.id === Number(m[1]));
      if (!s) return { __status: 404, body: { name: "Not Found", message: "", status: 404 } };
      if (m[3] === "cast") return s._cast;
      if (m[3] === "seasons") return s._seasons;
      if (m[3] === "episodes") return [];
      const out = pub(s);
      const embeds = u.searchParams.getAll("embed[]").concat(u.searchParams.getAll("embed"));
      if (embeds.length) {
        out._embedded = {};
        if (embeds.includes("cast")) out._embedded.cast = s._cast;
        if (embeds.includes("seasons")) out._embedded.seasons = s._seasons;
      }
      return out;
    }
    if (path === "/singlesearch/shows") {
      const q = (u.searchParams.get("q") || "").toLowerCase();
      const s = shows.find((x) => x.name.toLowerCase().includes(q));
      return s ? pub(s) : { __status: 404, body: { name: "Not Found", message: "", status: 404 } };
    }
    return undefined; // unknown address: behave like a network failure
  };
})();
