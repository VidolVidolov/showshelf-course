# Day 9 · Quiz

## Opening recap (Day 8)

Ask one question at a time. Give the class a moment before you show the answer.

**1. What does `await` do, and where are you allowed to use it?**
> It waits until the answer is ready and then gives its value, for example `await fetch(...)`. You can only use it inside a function marked `async`.

**2. `const response = await fetch(url);` Do we have the data now? What's the second step?**
> Not yet: `response` is the status of the answer, with the data still on its way. The second step is `const data = await response.json();`.

**3. A TVmaze search answers `[{ score, show }, ...]`. How do you get the name of the first show found?**
> `results[0].show.name`. The answer is an array, and each item wraps the show inside `show`.

**4. Name the four states every page that loads data should handle.**
> Loading, error, empty and success.

**5. `response.ok` is `false`. What happened, and what did our code do about it?**
> TVmaze answered with an error status, like 404, 429 or 500. `searchShows` throws `new Error("TVmaze answered " + response.status)`, and the `catch` in `loadShows` shows a friendly message in red instead of a broken page.

---

## End-of-day check (for the afternoon teacher)

**1. `homeView.hidden = state.view !== "home";` When is the home view hidden?**
> Whenever `state.view` is anything other than `"home"`: when the show view or the My List view is showing.

**2. Why does the + button's listener call `event.stopPropagation()`?**
> Clicks bubble up from an element to everything around it. The + button is inside the card, so without it a click on + would also open the show.

**3. Why does My List now save small objects like `{ id, name, image, genres, rating }` instead of only ids?**
> So the My List view can draw its cards straight away with `createCard`, without asking TVmaze for every show, and even offline.

**Ask them to show you:** open a show, press **+ Add to My List** in the show view, go back, and open **My List**: the card has a tick, the show is in My List, and the counter agrees.
