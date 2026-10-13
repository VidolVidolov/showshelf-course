# Day 8 · Script: Real shows from the internet

**Lecture:** 90 min · **Goal:** students understand what an API is, can fetch data with `async` / `await`, turn TVmaze's shape into ours, and show loading, error and empty messages.

**Before class:**
- Open ShowShelf Lab on the projector at Day 8's overview: `#/day/8` at the end of the address.
- **Help › Teacher view** shows the answer and the common mistakes on every step. Use it when you show an answer. During the demos you can switch it off, so the answers aren't on the projector.
- Zoom the browser (Ctrl/Cmd +) until the code box is readable from the back row.
- Slides: *Web Dev Guided · Day 8*.
- Check the room's internet: open `https://api.tvmaze.com/shows/431` in a tab. No internet? Every demo still works: the Lab answers from saved sample data and says so in the Console. Skip only the browser-tab demos.
- **The preview runs your code every time you stop typing**, so a `fetch` line sends a new request at every pause. Type the call line (`showOne();`) last. TVmaze allows about 20 requests every 10 seconds.
- After each demo, press **Start again** in that step, so your demo code doesn't flow into the next step.

**Mindset for today:** the code box starts with yesterday's finished app, which is long. Reassure students: today's code goes at the bottom, under the Day 8 comment, and they don't need to change the rest.

---

## 0:00 · Recap (10 min)

- **Opening recap** in `quiz.md`: five questions about Day 7. Ask, wait, then show the answer.
- **Say:** "Yesterday's ShowShelf knew 12 shows. Today it asks a real database on the internet."

## 0:10 · What is an API? (10 min)

**Say:** "An **API** is a website made for programs instead of people. You ask with a web address, and it answers with **data** instead of a page." Open in a new browser tab:

`https://api.tvmaze.com/search/shows?q=bad`

Scroll through the raw answer. **Say:** "The part after the `?` is the **query string**: here, *search for bad*. No page, no colours: data for our code."

Lab step 1, *What is an API?* Scroll the code box to the bottom (the Day 8 comment) and type:

```js
const showId = 431;
console.log(`https://api.tvmaze.com/shows/${showId}`);

const typed = "law & order";
console.log(encodeURIComponent(typed));   // law%20%26%20order
```

- **Say:** "A template literal builds an address from pieces. A web address can't hold spaces or a `&`, so `encodeURIComponent` makes any text safe inside one."
- **Ask:** "What would the `&` do in an address without it?" (It starts a new part of the query string, and the search breaks.)
- **Mistake on purpose:** normal quotes instead of backticks around the address. The Console shows `${showId}` as plain text.

## 0:20 · fetch, async and await (12 min)

Lab step 2, *Your first fetch*. **Say:** "The answer has to travel over the internet. That takes time, so `fetch` gives you a **promise** first: a ticket that says *you'll get it later*. `await` means *wait here until it's ready*." Type at the bottom (the call line last):

```js
async function showOne() {
  const response = await fetch("https://api.tvmaze.com/shows/431");
  const show = await response.json();
  console.log(show.name);     // Friends
  console.log(show.genres);   // ["Comedy", "Romance"]
}

showOne();
```

- **Say:** "Two waits. `await fetch` gives a **response**: the answer's status, with the data still on its way. `await response.json()` reads the data and turns the JSON text into arrays and objects."
- **Mistake on purpose:** remove the first `await`. Red error: *response.json is not a function*. "Without `await` you hold the ticket, not the answer."
- **Mistake on purpose:** remove `async`. Red error: *await is only valid in async functions*.
- **Ask:** "Why can't `fetch` give us the show straight away?" (The answer has to travel over the internet first.)

## 0:32 · The shape of the answer, and the adapter (13 min)

Lab steps 3 and 4. **Say:** "Before you use data, look at its **shape**: which arrays and objects sit inside which." At the bottom of step 3's code box:

```js
async function peek() {
  const response = await fetch("https://api.tvmaze.com/search/shows?q=bad");
  const results = await response.json();
  console.log(results[0].score);
  console.log(results[0].show.genres);
}

peek();
```

**Say:** "A search answers with an array. Each item is `{ score, show }`: how well it matches, and the show itself. So it's `results[0].show.name`, not `results[0].name`."

Then open the **helpers.js** tab and read `toShow` together. **Say:** "TVmaze's shows don't look like ours: their rating is `rating.average`, their picture is `image.medium`. Instead of changing `createCard` and everything else, we translate every show into **our** shape as soon as it arrives. That's an **adapter**, like a travel plug."

- Add one line inside `peek` to show `map` with the wrapper: `console.log(results.map((result) => result.show.id));`
- **Ask:** "Why `result.show`, and not `result`?" (The show is inside the wrapper.)
- **Mistake on purpose:** log `results[0].name`: `undefined`. The name lives one level deeper.

## 0:45 · Wait, then draw: the loading message (10 min)

Lab steps 5 and 6. **Say:** "Once the shows are in our shape, the rest of the app doesn't care where they came from: put them in the state, call `render()`. And while we wait, say so." At the bottom of step 6's code box, type a `showOne` with a loading message:

```js
async function showOne() {
  const title = document.querySelector("h1");
  title.textContent = "Loading…";
  const response = await fetch("https://api.tvmaze.com/shows/169");
  const show = await response.json();
  title.textContent = show.name;   // Breaking Bad
}

showOne();
```

**Say:** "`await` splits the function in two: what runs now, and what runs when the answer arrives. The loading text goes before the `await`; the result after it."

- **Mistake on purpose:** move the "Loading…" line below the `await`. It never shows. "It ran after the answer arrived."
- **Ask:** "On a slow connection, what does the visitor see between the two lines?" (Loading…)
- **Say:** "This afternoon you search when the form is sent, not on every letter. Every letter would be a request, and TVmaze allows about 20 every 10 seconds."

## 0:55 · When things go wrong (10 min)

Lab steps 7 and 8. **Say:** "Requests fail. No internet: `fetch` itself **throws** an error. An error answer, like **404** (not found) or **500** (the server broke): `fetch` works, but `response.ok` is `false`." In step 7's code box, at the bottom:

```js
async function showOne(id) {
  const title = document.querySelector("h1");
  title.textContent = "Loading…";
  try {
    const response = await fetch(`${API}/shows/${id}`);
    if (!response.ok) {
      throw new Error("TVmaze answered " + response.status);
    }
    const show = await response.json();
    title.textContent = show.name;
  } catch (error) {
    title.textContent = "Sorry: " + error.message;
  }
}

showOne(999999999);
```

`API` is the constant from step 1, already in the code box. The heading says *Sorry: TVmaze answered 404*. Change the id to 431: Friends.

- **Say:** "`throw` stops the function with an error. `try` / `catch` catches any error inside `try` and lets you show a friendly message instead of a broken page."
- **Mistake on purpose:** empty the `catch` block. The page stays on "Loading…" forever.
- **Ask:** "Search for a word that finds nothing: is that an error?" (No, see below.)
- **Say:** "A search that finds nothing is **not** an error: TVmaze answers `[]` with status 200. Every page that loads data has **four states**: loading, error, empty, success."

## 1:05 · Real shows from the start, and the rules (5 min)

Lab steps 9 to 11, as three short points on the slide:

- `https://api.tvmaze.com/shows?page=0` lists shows with **no wrapper**: each item *is* a show, so `apiShows.map(toShow)` works directly.
- TVmaze's data is free under a licence called **CC BY-SA**: the page must say where the data comes from, with a visible link.
- My List stores ids. In the sample data Breaking Bad was 2; on TVmaze it's **169**. When saved data changes meaning, save it under a **new key**.

**Ask:** "What would an old saved id 2 point at now?" (A different show altogether.) If online, open `https://api.tvmaze.com/shows?page=0` in a tab to show the list without a wrapper.

## 1:10 · The big idea, and questions (5 min)

Show the statement slide. **Say:** "Their data, our shape: translate it once, as soon as it arrives. That's why `createCard` and `render` don't change today." Take questions.

## 1:15 · This afternoon (15 min)

1. Go to the overview (`#/day/8`). Read the intro and the step list together: 11 steps, about 3 hours, then 3 extra challenges. Show the **Day 8** comments in the code box: the only lines that changed since yesterday.
2. **Do step 1 together** on the projector (press Start again first if you demoed there). The class dictates `const API` and `searchUrl(term)`; log `searchUrl("the office")`, press **Check**.
3. Show where everything is: **Hint** (two per step), **Answer**, the **Console** (it says when the Lab used sample data), **Run again**, and the "Not yet" message after Check.
4. **Say:** "Your progress saves by itself in this browser. Changing computers? **Help › Save progress to a file**, and on the other computer **Help › Open a progress file**."
5. **Say:** "Please don't press Run again over and over: online, every run asks TVmaze again."
6. Show the *Stuck?* slide: read the message → Console → hint → answer → ask.
7. Finished early? The extra challenges: **Search as you type, politely**, **Surprise me** and **How many shows?**

**Milestone:** the page opens with real shows from TVmaze, and a search for **friends** finds Friends.

---

## Handover note for the afternoon teacher

- **No internet is fine.** The Lab answers with saved sample data and says so in the Console; every check works offline. Online, ask students not to hammer Run again (TVmaze allows about 20 requests every 10 seconds).
- **Step 2, *Your first fetch*:** a missing `await` (they log a promise), `await` in a function without `async`, or a function that's never called.
- **Step 4, *From their shape to ours* (20 min):** `results.map(toShow)` instead of `toShow(result.show)` gives cards with no names. Ask: "Where is the show inside each result?"
- **Step 5, *Search TVmaze*:** `state.shows = searchShows(term);` without `await` puts a promise in the state.
- **Step 7, *When things go wrong* (20 min):** the hardest step. Watch for checking `response.ok` after `response.json()`, an empty `catch` (stuck on "Loading…"), and forgetting to remove the `error` class, so the next loading message is red.
- **Step 9, *Real shows from the start* (20 min):** five small changes in different places; send them through the task list one item at a time. `apiShows.map((s) => toShow(s.show))` is wrong here: page items have no wrapper. Calling `loadShows("")` above the other code gives "before initialization".
- **Step 11, *My List with TVmaze ids*:** the key `"myList"` appears twice; both must become `"myListIds"`.
