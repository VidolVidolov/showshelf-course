# Day 10 · Quiz

## Opening recap (Day 9)

Ask one question at a time. Give the class a moment before you show the answer.

**1. What is a view, and how does ShowShelf decide which one is showing?**
> One screen of the app: home, show or My List. `state.view` holds its name, and `render()` hides every view except that one, with one line per view like `homeView.hidden = state.view !== "home";`.

**2. What does `?embed[]=cast&embed[]=seasons` add to `https://api.tvmaze.com/shows/169`?**
> The cast and the seasons, in the same answer, inside a property called `_embedded`. One request instead of three.

**3. Why do we put a show's summary on the page with `textContent` and never `innerHTML`?**
> The summary comes from someone else's server. `innerHTML` treats text as HTML, so code hidden in it could run on our page. `textContent` always shows it as harmless text.

**4. TVmaze answers 404 for a show id. Is the internet broken? What does `getShowById` do?**
> No: 404 is a normal answer that means "no such show". `getShowById` returns `null`, and `openShow` shows "Show not found." and stops with `return`.

**5. `[{ id: 431 }, { id: 169 }].includes(169)` gives `false`. Why, and what do we use instead?**
> `includes` compares whole items with 169, and an object is never the number 169. Use `some`: `list.some((item) => item.id === 169)` gives `true`.

---

## End-of-day check (for the afternoon teacher)

**1. What is a React component, and how do you give it its input?**
> A function whose name starts with a capital letter and that returns JSX. Its inputs are props, passed like attributes: `<ShowCard show={show} />`, and received as `function ShowCard({ show })`.

**2. What happens when a component calls its state setter, like `setInList(true)`?**
> React remembers the new value and draws the component again, so the page shows the new state. You don't change the elements yourself.

**3. What do these status codes mean: 201, 400, 404? Which digit says the request was wrong?**
> 201 Created, 400 Bad Request (the data is wrong), 404 Not Found. A 4 at the start means the request was wrong; a 5 means the server has a problem.

**Ask them to show you:** step 11's My List manager page: add a show, press **Add** with an empty box, remove a show, and then read the lines in the Console, like `POST /api/mylist → 201`.
