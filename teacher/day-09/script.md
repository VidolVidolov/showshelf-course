# Day 9 · Script: The show page

**Lecture:** 90 min · **Goal:** students understand views as part of the state, one request that brings a show with its cast and seasons, filling a view safely with `textContent`, and a My List that saves small objects, so that this afternoon they can finish the app they publish on Day 11.

**Before class:**
- Open ShowShelf Lab on the projector at Day 9's overview: `#/day/9` at the end of the address.
- **Help › Teacher view** shows the answer and the common mistakes on every step. Use it when you show an answer. During the demos you can switch it off, so the answers aren't on the projector.
- Zoom the browser (Ctrl/Cmd +) until the code box is readable from the back row. Open the Console panel under the preview: half of today's demos print there.
- Slides: *Web Dev Guided · Day 9*.
- Today's code box is long: it starts with the finished Day 8 app (about 250 lines). Type every demo **at the very bottom**, and press **Start again** after each demo, so your demo code doesn't flow into the next step.
- Open a second browser tab with `https://api.tvmaze.com/shows/169?embed[]=cast&embed[]=seasons` and tick "pretty print" if the browser offers it. No internet in the room? Skip the tab: the Lab answers from saved sample data, and every step works offline.

**Mindset for today:** nothing really new happens on the page; the app gets *bigger*. Every idea is one of three things they already know: change the state, call `render()`, build elements in a loop. Say so often.

---

## 0:00 · Recap (10 min)

- **Opening recap** in `quiz.md`: five questions about Day 8. Ask, wait, then show the answer.
- Open the Day 9 overview and read its first paragraph aloud.
- **Say:** "Yesterday ShowShelf learned to ask TVmaze. Today every show gets its own page, with its cast and seasons, and My List gets a page too. This is the app you'll put online on Day 11, with your name on it."

## 0:10 · Three views, one page (12 min)

Lab step 1, *Three views, one page*. Click the **index.html (whole page)** tab and scroll to `<main>`: three `<section>` elements, `#home-view`, `#show-view` and `#mylist-view`. Point at the `hidden` on the last two.

**Say:** "A **view** is one screen of an app. Big apps rarely load a new page when you click: they hide one part and show another. Which view is showing is one more thing in the state."

Back in **app.js**, type at the very bottom:

```js
homeView.hidden = true;
showView.hidden = false;
```

The home view disappears and the empty show view (with its back button) appears.

- **Mistake on purpose:** change the first line to `homeView.hidden = "false";`. The home view stays hidden. **Ask:** "Why?" ("false" in quotes is text, and any text that isn't empty counts as true.) Press **Start again**.
- On the slide, read the pattern aloud: `cartPanel.hidden = state.panel !== "cart";` "Hide the cart panel *unless* the panel is cart." `!==` means "is not". **Ask:** "If `state.panel` is `"menu"`, is the cart panel hidden?" (Yes.)
- **Say:** "This afternoon you write one line like this per view, at the top of `render()`. Then switching views is: change `state.view`, call `render()`."

### Clicks bubble (4 min)

**Say:** "One trap. Today the whole card becomes clickable: a click opens the show. But the round + button sits *inside* the card." Type at the bottom:

```js
document.body.addEventListener("click", () => {
  console.log("The body heard a click too");
});
```

Click a + button in the preview: the My List counter changes **and** the Console says "The body heard a click too". Click the heading: the same line again.

**Say:** "A click **bubbles** up: it counts for the button, then for everything around it, up to the body. So a click on + would also open the show. `event.stopPropagation()` stops it going further up." **Ask:** "So where do we put `stopPropagation`: on the card or on the button?" (On the button.) Press **Start again**.

## 0:22 · One show, with its cast and seasons (12 min)

Switch to the TVmaze tab (`/shows/169?embed[]=cast&embed[]=seasons`). Read the address in two parts:

- `/shows/169`: one show, by its id. **Ask:** "Which show is 169?" (Breaking Bad.)
- `?embed[]=cast&embed[]=seasons`: "and put the cast and the seasons in the same answer, please".

Scroll to the end: `_embedded` with `cast` (each item has a `person` and a `character`) and `seasons` (`number`, `episodeOrder`, `premiereDate`).

**Say:** "One request instead of three. Fewer requests is faster for us and kinder to TVmaze." Then change the id to `999999999`: "Not Found", status **404**. "Remember this one for step 8."

**A function can give back several things in one object.** Lab step 2, *One show, with cast and seasons*. Type at the bottom:

```js
function tonight() {
  return { show: "Chernobyl", episodes: 5, snacks: ["popcorn", "tea"] };
}

const plan = tonight();
console.log(plan.show, plan.episodes, plan.snacks[0]);
```

The Console shows `Chernobyl 5 popcorn`.

- **Mistake on purpose:** `console.log(plan.Show);` gives `undefined`. "Capital letters matter, and a missing property isn't an error, it's `undefined`."
- **Say:** "This afternoon `getShowById` does the same: it returns `{ show, cast, seasons }`, and `openShow` reads `data.show`, `data.cast` and `data.seasons`." Press **Start again**.

## 0:34 · Filling the show view (15 min)

### textContent, never innerHTML (5 min)

**Say:** "The summary of a show is written on someone else's server. There are two ways to put text in an element, and one of them is dangerous." Lab step 3, *Fill in the show*. Type at the bottom:

```js
const heading = document.querySelector("h1");
heading.innerHTML = '<img src="x" onerror="document.body.style.background = \'red\'">';
```

The page turns red: the text was treated as HTML, and the code hidden inside it ran. Now change `innerHTML` to `textContent`: the strange text appears on the page, harmless, and the background stays normal.

**Say:** "Replace 'turn the page red' with 'send me your passwords'. The rule: text that comes from anywhere else goes in with `textContent`, never `innerHTML`." Press **Start again**.

### Nested data, one level at a time (6 min)

Lab step 4, *The cast*. Type at the bottom (a football team, not a show, so the task stays theirs):

```js
const team = [
  { person: { name: "Ana" }, role: { name: "goalkeeper" } },
  { person: { name: "Boris" }, role: { name: "captain" } },
];

for (const member of team) {
  console.log(member.person.name + " plays " + member.role.name);
}
```

- **Mistake on purpose:** `console.log(member.name);` gives `undefined`. "The name is one level deeper, inside `person`. Go one dot at a time."
- **Say:** "The cast this afternoon has the same shape: `member.person.name` is the actor, `member.character.name` the role. And you'll build the list like the grid: empty it, then one new element per item." Press **Start again**.

### A small function for repeated lines (4 min)

Show the slide with `createCell`. **Say:** "Each season is a table row with three cells. Three lines per cell, three cells: nine nearly identical lines. When the same lines keep coming back, make a small function." Read `createCell(text)` aloud, then `row.append(createCell("Friday"), createCell("Fleabag"), createCell("2 episodes"))`. "`append` can take several things at once." `createCell` is ready in step 5: they write one line.

## 0:49 · Back, loading and "not found" (12 min)

**The back button.** **Ask:** "To go back to the home view, do we need to ask TVmaze again?" (No: the shows are still in `state.shows`.) **Say:** "Going back is only a change of state: `state.view = "home"`, then `render()`. Nothing loads."

**Loading and errors.** Open step 7, *Loading and errors*, and scroll up in the code box to `loadShows`. Read its shape aloud: message before the `await`, `try` around the `await`, `catch` for the friendly red message. **Say:** "You wrote this yesterday. In step 7 you give the show view the same shape, with its own elements, `showStatus` and `showDetails`. Copy the shape, not the words."

**404 is an answer, not a broken connection.** Back to the `999999999` tab. **Say:** "Right now a missing show would say 'check your internet connection'. That's a lie: the internet is fine, the show doesn't exist. So `getShowById` will give back `null` for a 404, and `openShow` says 'Show not found'." Then the new tool, an **early return**. Lab step 8, *Show not found*, at the bottom:

```js
function greet(name) {
  if (name === "") {
    console.log("Nobody to greet.");
    return;
  }
  console.log("Hello, " + name + "!");
}

greet("");
greet("Ana");
```

- **Mistake on purpose:** delete the `return;` line. `greet("")` now prints both lines. "`return` ends the function right there. Without it, the code below still runs." Press **Start again**.

## 1:01 · My List remembers more (14 min)

Lab step 9, *My List remembers more*. Add a show with + in the preview, then type at the bottom:

```js
console.log(localStorage.getItem("myListIds"));
```

The Console shows only ids, like `[431]`. **Say:** "A My List page needs cards, and a card needs a name, a poster, a rating. We could ask TVmaze for every saved show: many requests, and nothing offline. Instead, My List will save a small **object** for each show, with exactly what a card needs." Show the object on the slide.

**`includes` doesn't work on objects.** Replace the line with:

```js
const saved = [{ id: 7, name: "Chernobyl" }, { id: 10, name: "Band of Brothers" }];
console.log(saved.includes(7));
console.log(saved.some((item) => item.id === 7));
```

`false`, then `true`. **Say:** "`includes` compares whole items with 7, and an object is never the number 7. `some` asks: does at least **one** item pass this test?" Press **Start again**.

**One render, every view agrees.** Show the statement slide. **Say:**
- "The My List view uses the same `createCard` as the home page. One good function, two views."
- "The header links are real links to index.html. On your website they'd reload the page, so we stop them with `event.preventDefault()`, like the form on Day 7."
- "The + Add to My List button in the show view needs to know which show is open. That's state too: `state.currentShow`."

**Ask:** "You add a show from the show view. Which places on the page must now show it?" (The button in the show view, the tick on its card, the My List view and the counter.) "And how many of them do you update by hand?" (None: change the state, `render()` draws them all.)

## 1:15 · This afternoon (15 min)

1. Open the Day 9 overview (`#/day/9`). Read the step list together, in the four phases on the slide: *the show view* (1 to 3), *cast, seasons, back* (4 to 6), *when it goes wrong* (7 and 8), *My List* (9 to 11).
2. **Do step 1 together** on the projector, with Teacher view off. Let the class dictate the five small edits: `view: "home"` in the state, the three lines in `render()`, the TODO in `openShow`, the card's click listener, `stopPropagation` on the + button. Press **Check**. Click a card: the home view disappears.
3. Show where help is: **Hint** under the code box (the hints appear under the task, the second one is almost the answer), **Answer** next to it, and the **Console** bar under the preview (click it to open). Point at the slide: read the message, then the Console, then a hint, then the answer, then ask.
4. **Progress saves automatically** in this browser. Changing computers: **Help › Save progress to a file**, and on the other computer **Help › Open a progress file**.
5. **Finished early?** The extra challenges after step 11 (B1 to B3): *A link for every show*, *Cast photos*, *The average rating of My List*.
6. **Milestone:** open a show, add it with the button in the show view, go back: the card has a tick. Open My List: the show is there.
7. **Say:** "Take your time today. Read the code you add. Tomorrow is a taste of other tools; this is the app you take home."

---

## Handover note for the afternoon teacher

- **Step 1, *Three views, one page* (20 min)** has five small edits in five places. Typical: `homeView.hidden = state.view === "home"` (the wrong way round, so home hides when it should show), `card.addEventListener("click", openShow(show.id))` without `() =>` (it runs at once), and `event.stopPropagation()` without the `event` parameter. Say: "Read your line aloud: hide the home view *unless* the view is home."
- **Step 3, *Fill in the show*:** TODO 2 written below the network lines wipes the network out again (`=` replaces, `+=` adds). Anyone using `innerHTML` for the summary: point at the rule in the explanation.
- **Step 7, *Loading and errors* (15 min)** is the hardest restructuring today: the `await` and the three `render...` lines must move inside `try`. Say: "Scroll up to `loadShows`: copy its shape, not its words."
- **Step 8, *Show not found*:** the 404 check must come **before** `if (!response.ok)`, because a 404 is also "not ok". Without `return;` after the message, the page crashes on `null`.
- **Step 9, *My List remembers more* (20 min):** four edits. If only `push` changes, taking a show out stops working; `includes(id)` on objects is always `false`; a missing comma in the object gives a syntax error with a line number.
- **Steps 10 and 11:** forgetting `renderMyList()` (or `renderShowListButton()`) in `render()` means the view only updates after Run again. A listener added *inside* `openShow` multiplies: one click toggles several times. Listeners go at the bottom, once.
- **No internet is fine:** the Lab uses saved sample data and says so in the Console. Online, real posters appear and some real shows say "No rating yet": that's expected.
