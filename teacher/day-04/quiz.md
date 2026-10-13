# Day 4 · Quiz

## Opening recap (Day 3: Lay out the home page)

Ask out loud at the start of the lecture. Let several people answer before you give the answer.

**1. The logo and the menu are inside `<div class="container header-inner">`. Which box gets `display: flex` to put them in a row?**
> `.header-inner`, the parent. The parent decides how its direct children are arranged.

**2. In a flex row, what's the difference between `justify-content` and `align-items`?**
> `justify-content` places the items **along** the row (left, centre, `space-between`); `align-items` lines them up **across** the row, up and down (`center`).

**3. What does `flex: 1` on the search input do?**
> The input grows to take all the free space next to the button. The button keeps its own size.

**4. What does `grid-template-columns: repeat(3, 1fr);` make?**
> Three columns of equal width, sharing the free space. The cards fill them row by row.

**5. Mobile first: who are the normal rules for, and what does `@media (min-width: 600px) { ... }` add?**
> The normal rules are the phone layout. The media query applies only when the page is at least 600px wide (more columns). Breakpoints go from small to big, because the later rule wins.

---

## End-of-day check (for the afternoon teacher)

**1. What does this print, and why?**
```js
console.log("236" + 62);
```
> `23662`. The quotes make `"236"` a string, and `+` with a string joins instead of adding.

**2. What goes wrong here, and how do you fix it?**
```js
const episodesWatched = 10;
episodesWatched = episodesWatched + 1;
```
> An error: "Assignment to constant variable". A `const` can never get a new value. Use `let episodesWatched = 10;`.

**3. What's the difference between `=` and `===`?**
> One `=` puts a value into a variable. Three `===` ask whether two values are the same (and the same type), and give `true` or `false`.

**Ask them to show you:** in their code, change `episodes` to `10` at the top and watch the message in `#verdict` change from the long-show message to the short one. Then change it back to `236`. If they finished step 10, the badge above the title says **NBC**.
