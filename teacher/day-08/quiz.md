# Day 8 · Quiz

## Opening recap (Day 7)

Ask one question at a time. Give the class a moment before you show the answer.

**1. What does `document.querySelector("#grid")` give if no element has that id?**
> `null`. Using it then gives a red error like *Cannot set properties of null*: check the `#` or `.` and the spelling.

**2. Three moves put a new element on the page. Which?**
> Create it (`document.createElement("article")`), fill it (`className`, `textContent`), put it on the page (`grid.append(card)`).

**3. The search box has an `"input"` event, the form a `"submit"` event. When does each one happen?**
> `"input"`: every time the text in the box changes, letter by letter. `"submit"`: when the form is sent, with Enter or its button.

**4. Why do the search box and the genre chips change `state` and call `render()`, instead of drawing the grid themselves?**
> If each drew the grid its own way, they would undo each other's work. With one `state` and one `render()`, the page always matches everything that was chosen.

**5. localStorage keeps text only. How do you save My List's array of ids, and read it back?**
> Save with `localStorage.setItem("myList", JSON.stringify(state.myList))`; read with `JSON.parse(localStorage.getItem("myList"))`, plus `?? []` for the very first time.

---

## End-of-day check (for the afternoon teacher)

**1. What goes wrong without `await` here?**
```js
const response = fetch(searchUrl(term));
```
> `fetch` gives a promise, a ticket for an answer that arrives later. Without `await`, `response` is that promise, not the answer, and `response.json()` fails.

**2. A TVmaze search answers `[{ score, show }, ...]`. Why `toShow(result.show)` and not `toShow(result)`?**
> Each result is a wrapper: the show is inside its `show` property. `toShow(result)` would get `{ score, show }` and find no name or rating.

**3. Name the four states every page that loads data can be in.**
> Loading, error, empty, success.

**Ask them to show you:** a search for **zzz** (the empty message with the word in it), then **friends** (the Friends card), and the *Data from TVmaze* link in the footer.
