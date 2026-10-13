# Day 7 · Script: Make the page react

**Lecture:** 90 min · **Goal:** students can find and create elements with JavaScript, react to events, and organise a page with **state → render**, including a My List that survives a reload.

**Before class:**
- Open ShowShelf Lab on the projector at Day 7's overview: `#/day/7` at the end of the address. The preview on the right shows today's finished page.
- **Help › Teacher view** shows the answer and the common mistakes on every step. Use it when you show an answer. During the demos you can switch it off, so the answers aren't on the projector.
- Zoom the browser (Ctrl/Cmd +) until the code box is readable from the back row.
- Slides: *Web Dev Guided · Day 7*.
- After each demo, press **Start again** in that step, so your demo code doesn't flow into the next step.

**Mindset for today:** this is the day the page starts to *answer back*. Students love it, and it's also the longest afternoon. The one idea that everything after today builds on is **state → render** (step 9). Go slowly there.

---

## 0:00 · Recap (10 min)

- **Opening recap** in `quiz.md`: five questions about Day 6. Ask, wait, then show the answer.
- Show the overview's preview: twelve cards, genre buttons, a search box, a My List counter. **Say:** "By tonight you've built every part of this yourself."

## 0:10 · The DOM: find an element (8 min)

Lab step 1, *Find an element*. **Say:** "The browser turns your HTML into a tree of objects that JavaScript can read and change. It's called the **DOM**. Every tag becomes an **element**." Type:

```js
const heading = document.querySelector("h1");
heading.textContent = "Movie night!";
console.log(heading);
```

The heading changes straight away. **Say:** "Same selectors as in CSS: `#` for an id, `.` for a class. Keep the element in a `const` and use it as often as you like."

- **Ask:** "How would you find the search box, which has `id="search"`?" (`document.querySelector("#search")`.)
- **Mistake on purpose:** `document.querySelector("hero")` (no dot), then `.textContent`. Read the red error: *Cannot set properties of null*. **Say:** "When you see `null`, your selector found nothing. Check the `#` or the `.` first."

## 0:18 · Build an element (10 min)

Lab step 2, *Build an element*. Three moves: create it, fill it, put it on the page. Type at the bottom of step 2's code box:

```js
const note = document.createElement("p");
note.className = "status";
note.textContent = "12 shows tonight";
document.querySelector(".hero").append(note);
```

**Say:** "`createElement` makes it, but only in JavaScript. Nothing shows until you `append` it inside something on the page. `className` sets the class, so the CSS applies."

- **Mistake on purpose:** comment out the `append` line. The note disappears. "Created, never added."
- **Ask:** "What would `note.class = "status"` do?" (Nothing visible: the property is called `className`.)

## 0:28 · Data in, elements out (12 min)

Lab steps 3 to 5. Open step 3 and **read** its starter together: `createCard(show)` builds one card from one show object and `return`s it. Don't fill the TODOs. **Say:** "A function that returns an element is a small factory. Give it a show, get back a card."

Then show the same idea with chips, back in step 2's code box:

```js
const genresBox = document.querySelector("#genres");

function createChip(text) {
  const chip = document.createElement("button");
  chip.className = "chip";
  chip.textContent = text;
  return chip;
}

function renderChips(list) {
  genresBox.replaceChildren();
  for (const text of list) {
    genresBox.append(createChip(text));
  }
}

renderChips(["Drama", "Comedy", "Crime"]);
```

- **Say:** "One function says what *one* chip looks like. The loop makes as many as the list has. Data in, elements out."
- **Ask:** "How do I get a fourth chip?" (Add a fourth word to the list. No new HTML.)
- **Mistake on purpose:** call `renderChips(...)` twice, then delete the `replaceChildren()` line: six chips. "`append` adds to what's there. Empty it first." Put the line back. "**Render** is developers' word for *draw on the screen*."

## 0:40 · Events (12 min)

Lab steps 6 and 7. **Say:** "An **event** is something that happens on the page: a click, a key, the text in a box changing. You ask an element to run a function *when* it happens." Open step 6 (twelve cards in the preview) and type at the bottom:

```js
const heading = document.querySelector("h1");
heading.addEventListener("click", () => {
  heading.textContent = "You clicked me!";
});

const searchInput = document.querySelector("#search");
searchInput.addEventListener("input", () => {
  console.log(searchInput.value);
});
```

Click the heading, then type in the search box and watch the Console. **Say:** "The arrow function is the **event listener**. The browser calls it later, every time, not now. `"input"` fires on every letter, and `.value` is the text in the box right now."

- **Ask:** "When does the code inside the arrow function run?" (Every time someone types, not when the page loads.)
- **Mistake on purpose:** add `console.log(searchInput.value);` *outside* the listener. It prints one empty line, once. "That line ran when the page loaded, before anyone typed."

The browser's own behaviour (step 7). Click **Home** in the preview: the Lab says links to other pages don't open here. Type:

```js
const homeLink = document.querySelector(".nav a");

homeLink.addEventListener("click", (event) => {
  event.preventDefault();
  console.log("Staying on this page");
});
```

Click Home again: no notice. **Say:** "Every listener gets an **event object**. `preventDefault()` cancels what the browser would normally do. Press Enter in the search box: the form tries to reload the page. This afternoon you stop that the same way, with the form's `"submit"` event."

## 0:52 · State → render (10 min)

Lab steps 8 and 9. First, showing and hiding (step 8). In step 1's code box:

```js
document.querySelector("#empty-message").hidden = false;
```

The hidden message appears. **Say:** "`hidden = true` hides an element, `false` shows it."

Now the most important idea of the day. Draw on the board: **event → change the state → render()**. **Say:** "When two things change the same part of the page, like the search box and the genre buttons, they undo each other's work. So we keep everything that can change in one object, the **state**, and one function, `render()`, draws the page from it. Events only change the state, then call `render()`." Type:

```js
const state = { clicks: 0 };
const heading = document.querySelector("h1");

function render() {
  heading.textContent = `Clicked ${state.clicks} times`;
}

heading.addEventListener("click", () => {
  state.clicks = state.clicks + 1;
  render();
});

render();
```

- **Mistake on purpose:** remove `render();` from the listener. Click: nothing changes, although `state.clicks` goes up (log it). "The state changed, but nobody drew the page."
- **Ask:** "In which order? The person clicks, the state changes, render draws." Have the class say it.

## 1:02 · My List and localStorage (8 min)

Lab steps 10 and 11. My List is part of the state: an array of show **ids**. Yesterday's tools do the work. In step 1's code box:

```js
let picks = [2, 5];
picks.push(7);                             // [2, 5, 7]
picks = picks.filter((id) => id !== 5);    // [2, 7]
console.log(picks.includes(7));            // true

localStorage.setItem("picks", JSON.stringify(picks));
console.log(JSON.parse(localStorage.getItem("picks")));
```

**Say:** "Variables vanish on every reload. **localStorage** is the browser's small store that survives reloads. It keeps text only, so `JSON.stringify` turns the array into text, and `JSON.parse` turns it back."

- Delete the `setItem` line and press **Run again**: the `getItem` line still finds `[2, 7]`.
- **Ask:** "Why ids and not names?" (Ids are unique and never change.)
- **Mistake on purpose:** `localStorage.setItem("picks", picks)` without `JSON.stringify`. It's saved as `"2,7"`, and `JSON.parse` fails with a red error. Read it together.

## 1:10 · The big idea, and questions (5 min)

Show the statement slide. **Say:** "Events change the state. `render()` draws the page from the state. Tomorrow and on Day 10 you'll see why that's worth it." Take questions.

## 1:15 · This afternoon (15 min)

1. Go to the overview (`#/day/7`). Read the intro and the step list together: 11 steps, about 3 hours, then 3 extra challenges. Point out the read-only tabs: **data.js** and **helpers.js**.
2. **Do step 1 together** on the projector (press Start again first if you demoed there). The class dictates `const grid = document.querySelector("#grid");`, a test text and the log. Press **Check**.
3. Show where everything is: **Hint** (two per step), **Answer**, the **Console**, **Run again** above the preview (needed in step 11), and the "Not yet" message after Check.
4. **Say:** "Your progress saves by itself in this browser. Changing computers? **Help › Save progress to a file**, and on the other computer **Help › Open a progress file**."
5. Show the *Stuck?* slide: read the message → Console → hint → answer → ask.
6. Finished early? The extra challenges: **Only My List**, **Best rated first** and **A details box**.

**Milestone:** add two shows to My List, press Run again, and they're still there.

---

## Handover note for the afternoon teacher

- **Step 3, *A function that builds a card* (20 min):** the code box starts fresh: their step 2 lines moved into `createCard`. Watch for `show.genres` without `[0]` and a missing `+` in the rating text.
- **Step 5, *Draw any list of shows*:** forgetting `grid.replaceChildren()` (cards pile up), or looping over `shows` instead of the parameter `list`.
- **Step 6, *React to typing*:** reading `searchInput.value` outside the listener, or `addEventListener("input", renderGrid(...))`, which calls the function instead of giving it.
- **Step 9, *Genre buttons and one render()* (30 min)** is the hardest step. The key is item 4: the search listener stops drawing and only changes `state`. If someone is lost, draw three boxes on paper: event, state, render, with arrows in that order.
- **Step 10, *My List* (25 min):** `state.myList.filter(...)` without `state.myList =` in front, or the button added after `return card;`. Remind them items 1, 2, 4 and 5 of the task are outside the new code.
- **Step 11, *Remember My List*:** saving without `JSON.stringify`, or loading without `JSON.parse`. Old ticks from experiments can stay: the Lab keeps localStorage between reloads on purpose, like a real browser.
- The bubbling trap in the extra challenge **A details box**: the + button needs `event.stopPropagation()`.
