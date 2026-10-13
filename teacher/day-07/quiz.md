# Day 7 · Quiz

## Opening recap (Day 6)

Ask one question at a time. Give the class a moment before you show the answer.

**1. `const favourites = ["Dark", "Fleabag", "The Wire"];` What is `favourites[0]`, and what is `favourites.length`?**
> `"Dark"` (counting starts at 0) and `3`.

**2. Read this aloud as a sentence. What does it give?**
```js
shows[1].rating
```
> "The list `shows`, the second item, its rating." Breaking Bad's rating: `9.2`.

**3. `filter`, `map` or `find`? a) all the show names b) only the shows rated 9 or more c) the show with id 2**
> a) `map` b) `filter` c) `find`

**4. Why does `topRated(list)` use `list` inside, and not `shows`?**
> So the function works with *any* list it's given. page.js and the checks call it with other lists; using `shows` would ignore them.

**5. How do you check whether a show is a comedy?**
> `show.genres.includes("Comedy")`. `genres` is an array, so you ask the array whether it includes the genre. `show.genres === "Comedy"` is never true.

---

## End-of-day check (for the afternoon teacher)

**1. What does `document.querySelector("#grid")` give if there is no element with that id?**
> `null`. Using it then gives a red error like *Cannot set properties of null* (or *Cannot read properties of null*): check the selector's spelling and the `#` or `.`.

**2. Put these in order: `render()` draws the page / someone clicks a genre chip / `state.genre` changes**
> Someone clicks a genre chip → `state.genre` changes → `render()` draws the page.

**3. Why `JSON.stringify` before `localStorage.setItem`?**
> localStorage keeps text only. `JSON.stringify` turns the array of ids into text like `"[2,5]"`; `JSON.parse` turns it back into an array when loading.

**Ask them to show you:** add two shows to My List, press **Run again**, and the ticks and the counter are still there. Then click **Drama** and type **the**: both filters work together.
