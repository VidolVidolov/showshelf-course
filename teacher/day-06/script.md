# Day 6 · Script: Lists of shows

**Lecture:** 90 min · **Goal:** students can keep many values in an array, describe one show with an object, go through a list with a loop, and pick from it with `filter`, `map` and `find`.

**Before class:**
- Open ShowShelf Lab on the projector at Day 6's overview: `#/day/6` at the end of the address.
- **Help › Teacher view** shows the answer and the common mistakes on every step. Use it when you show an answer. During the demos you can switch it off, so the answers aren't on the projector.
- Zoom the browser (Ctrl/Cmd +) until the code box is readable from the back row.
- Slides: *Web Dev Guided · Day 6*.
- After each demo, press **Start again** in that step, so your demo code doesn't flow into the next step.
- Today's demos use the Console a lot. Make sure the Console panel under the preview is open and tall enough.

**Mindset for today:** yesterday's functions now meet real data. Every idea today answers one question: "how do I get *this* out of a list?" Keep coming back to the twelve shows in data.js.

---

## 0:00 · Recap (10 min)

- **Opening recap** in `quiz.md`: five questions about Day 5. Ask, wait, then show the answer.
- **Say:** "A real app doesn't show one show. It shows lists. Today you learn how JavaScript keeps lists, and how to pick from them."

## 0:10 · Arrays (10 min)

Lab step 1, *A list: arrays*. Type in its code box:

```js
const networks = ["HBO", "NBC", "BBC Three"];

console.log(networks[0]);
console.log(networks.length);

networks.push("AMC");
console.log(networks);
```

**Say:** "An **array** is a list in square brackets, with commas between the items. Each item has a position number, its **index**, and counting starts at **0**."

- **Ask:** "What's `networks[1]`?" (NBC, not HBO.)
- **Mistake on purpose:** log `networks[3]` before the push: `undefined`. "Three items, indexes 0 to 2. You'll forget the 0 at least once this week. Everyone does."
- **Ask:** "`networks` is a `const`, and it changed. How?" "A `const` can't be *replaced*, but the list inside can still grow."

## 0:20 · Objects (10 min)

Lab step 2, *One show: objects*. Type:

```js
const tonight = {
  show: "Dark",
  episode: 3,
  watched: false,
};

console.log(tonight.show);
tonight.watched = true;
console.log(tonight);
```

**Say:** "An array is many things in a row. An **object** is one thing, with named values called **properties**. Each one is a **key**, a colon, and a **value**."

- **Mistake on purpose:** write `show = "Dark",` inside the object. Read the red syntax error together, then fix it with a colon.
- **Say:** "A dot reads a property. A dot and `=` change it."
- **Ask:** "How do I read the episode number?" (`tonight.episode`.)

## 0:30 · The twelve shows (8 min)

Lab step 3, *The twelve shows*. Open the **data.js** tab and scroll through one show object, reading its keys aloud: `id`, `name`, `genres`, `rating`, `premiered`, `ended`, `episodes`, `runtime`, `network`.

**Say:** "`shows` is an **array of objects**. To reach a value, read from the outside in: the list, which item, which property." Type:

```js
console.log(shows[3].name);                        // Game of Thrones
console.log(shows[6].episodes);                    // 5 (Chernobyl)
console.log(shows[shows.length - 1].network);      // Nickelodeon
```

- **Ask:** "Why `length - 1` for the last one?" (12 shows, but the indexes go from 0 to 11.)
- **Mistake on purpose:** `shows[12].name`. Read the red error: *Cannot read properties of undefined*. "There is no item 12, so there's no name to read."

## 0:38 · Loops, and picking with a loop (12 min)

Lab steps 4 and 5. In step 4's code box:

```js
for (const show of shows) {
  console.log(show.network);
}
```

Twelve lines in the Console. **Say:** "Read it aloud: *for each show of the shows list, run the block*. `show` holds the next item on each round. Singular of the list's name: `show` of `shows`."

Then the pattern for picking: an empty array, a loop, an `if`, a `push`.

```js
const hbo = [];
for (const show of shows) {
  if (show.network === "HBO") {
    hbo.push(show);
  }
}
console.log(hbo.length);   // 4
```

- **Ask:** "Which four?" (Game of Thrones, Chernobyl, The Wire, Band of Brothers.)
- **Mistake on purpose:** move `const hbo = [];` inside the loop. The Console now says 0. "It started empty again on every round."
- Point at the indentation: blocks inside blocks, two more spaces per level.

## 0:50 · filter and map (12 min)

Lab steps 6 and 7. **Say:** "Picking from a list is so common that arrays have a method for it." In step 6's code box:

```js
function onHBO(list) {
  return list.filter((show) => show.network === "HBO");
}

console.log(onHBO(shows).length);   // 4
```

**Say:** "`filter` calls your arrow function for every item. True: keep it. False: leave it out. You get a **new** array; the old one doesn't change."

- **Say:** "Inside the function, use the parameter `list`, never `shows`. page.js and the checks call your functions with other lists."
- **Mistake on purpose:** `(show) => { show.network === "HBO" }` with curly brackets. The result is empty. "Curly brackets need a `return`. One line without brackets returns by itself."

Then `map`:

```js
console.log(shows.map((show) => show.network));
```

**Say:** "`filter` keeps *some* items as they are. `map` keeps *all* items, but turns each one into something else. Twelve shows in, twelve networks out."

- **Ask:** "How many items does `map` give back for our list?" (Always the same number as it got: 12.)

## 1:02 · find, and searching text (8 min)

Lab steps 8 to 10. `find` gives **one** item, not a list:

```js
const pick = shows.find((show) => show.id === 10);
console.log(pick.name);   // Band of Brothers
```

- **Mistake on purpose:** `show.id = 10` with one equals sign. It always gives the first show. "Three equals signs ask."
- **Ask:** "What does `find` give for id 99?" (`undefined`: nothing matched.)

For searching, three string methods. Type:

```js
const typed = "  THRONES ";
const needle = typed.trim().toLowerCase();               // "thrones"
console.log("Game of Thrones".toLowerCase().includes(needle));   // true
console.log(shows[1].genres.includes("Crime"));                  // true
```

**Say:** "`trim` removes the spaces at both ends, `toLowerCase` makes small letters, `includes` asks *is it inside?* Make **both** sides lower case, and capital letters stop mattering. Arrays have `includes` too: is this genre in the list?"

## 1:10 · The big idea, and questions (5 min)

Show the statement slide. **Say:** "`filter` keeps some, `map` changes each, `find` gives one. With those three you can ask almost anything of a list." Take questions.

## 1:15 · This afternoon (15 min)

1. Go to the overview (`#/day/6`). Read the intro and the step list together: 10 steps, about 3 hours, then 3 extra challenges.
2. **Do step 1 together** on the projector (press Start again first if you demoed there). Let the class choose three favourite shows, log the first one and the length, push a fourth, press **Check**.
3. Show where everything is: the **data.js** tab, **Hint** (two per step), **Answer**, the **Console** under the preview, and the "Not yet" message after Check.
4. **Say:** "Your progress saves by itself in this browser. Changing computers? **Help › Save progress to a file**, and on the other computer **Help › Open a progress file**."
5. Show the *Stuck?* slide: read the message → Console → hint → answer → ask.
6. Finished early? The extra challenges at the bottom of the step list: **Best first**, **Count the genres** and **Watch everything**.

**Milestone:** all five sections on the page are filled by your functions: Top rated, All show names, Pick of the day, Search and Browse by genre.

---

## Handover note for the afternoon teacher

- **Step 3, *The twelve shows*:** `shows[12]` for the last show (it's `shows[11]`), or `shows.name` (the array has no name; each show has one). Ask them to read one show in the data.js tab first.
- **Step 5, *Keep only the best* (20 min):** the `push` outside the `if` (every show is added), or `const best = [];` inside the loop. Point at the indentation to see which block a line is in. The answer is five shows.
- **Step 6, *filter: the short way* (20 min):** forgetting `return` before `list.filter`, using `shows` instead of the parameter `list`, or curly brackets after the arrow without `return`.
- **Step 8, *find: one show by its id*:** `show.id = id` (one equals sign) always gives the first show; `filter` instead of `find` gives a list with one show.
- **Step 9, *Search by name* (20 min):** only the search word is made lower case, not the show's name; or `===` instead of `includes`. Ask them to type `THE` in the search box and explain why How I Met Your Mother appears.
- **Step 10, *Browse by genre*:** `show.genre` instead of `show.genres`, or `show.genres === genre` (an array is never equal to one string).
- Fast finishers: the extra challenges. **Best first** needs the copy `[...list]` before `sort`.
