# Day 5 · Script: Functions and decisions

**Lecture:** 90 min · **Goal:** students can define and call a function, give it arguments, and hand an answer back with `return`, including a different answer from each `if` block.

**Before class:**
- Open ShowShelf Lab on the projector at Day 5's overview: `#/day/5` at the end of the address.
- **Help › Teacher view** shows the answer and the common mistakes on every step. Use it when you show an answer. During the demos you can switch it off, so the answers aren't on the projector.
- Zoom the browser (Ctrl/Cmd +) until the code box is readable from the back row.
- Slides: *Web Dev Guided · Day 5*.
- After each demo, press **Start again** in that step, so your demo code doesn't flow into the next step.

**Mindset for today:** this is the day the code stops being a list of sentences and becomes reusable pieces. One idea matters more than all the others: `return`. Spend your time there.

---

## 0:00 · Recap (10 min)

- **Opening recap** in `quiz.md`: five questions about Day 4. Ask, wait, then show the answer.
- **Say:** "Yesterday every line ran once, top to bottom. Today we package lines so we can run them again, whenever we like, with different numbers."

## 0:10 · Define and call (8 min)

Lab step 1, *Your first function*. Point at the preview first: six grey notes on every card, like *(write watchTime)*. **Say:** "Each note is a function you'll write this afternoon. A helper file, page.js, is waiting for them."

Type in step 1's code box:

```js
function announce() {
  console.log("Next episode in 5 seconds...");
}

announce();
announce();
```

**Say:** "Two parts. *Define* is writing the recipe: nothing happens yet. *Call* is cooking it: the name and round brackets."

- Delete the two calls: the Console is empty. **Ask:** "Why?" (The recipe was written, nobody cooked it.)
- **Mistake on purpose:** `announce;` without brackets. No error, nothing happens. "Brackets mean *run it now*."

## 0:18 · Parameters and arguments (12 min)

Lab step 2, *Parameters and arguments*, then step 3, *Two parameters*. Type:

```js
function nowPlaying(show) {
  console.log(`Now playing: ${show}`);
}

nowPlaying("Dark");
nowPlaying("Fleabag");
```

**Say:** "`show` is a **parameter**: an empty box in the definition. `"Dark"` is an **argument**: what you put in the box when you call. Same code, different result."

- **Ask:** "What prints if I call `nowPlaying()` with nothing?" (`Now playing: undefined`.) "**undefined** is JavaScript's word for *no value yet*. You'll meet it again in ten minutes."

Two parameters, separated by a comma:

```js
function introduce(show, year) {
  console.log(`${show} started in ${year}`);
}

introduce("Chernobyl", 2019);
introduce(2019, "Chernobyl");
```

- **Mistake on purpose:** the second call prints *2019 started in Chernobyl*. "The order of the arguments decides which box they go in, not their names."
- Open the **page.js** tab and find the line that calls `watchTime`. **Say:** "page.js calls your function once per card, with that card's numbers. Write it once, use it four times."

## 0:30 · return: give the answer back (15 min)

Open Lab step 4, *Give the answer back with return*. The code box starts with the earlier steps' code, and the cards say *Watch it all: undefined hours*. **Ask:** "The Console shows the hours. Why do the cards say undefined?" Let them guess.

Type under the existing code:

```js
function totalSeats(rows, seatsPerRow) {
  console.log(rows * seatsPerRow);
}

const seats = totalSeats(10, 12);
console.log(seats);
```

The Console shows `120`, then `undefined`: that's the **mistake on purpose**, the same one the cards show. **Say:** "The function *said* 120 out loud, in the Console. But the line that called it got nothing back. Nothing is `undefined`."

Now change the body:

```js
function totalSeats(rows, seatsPerRow) {
  return rows * seatsPerRow;
}

const seats = totalSeats(10, 12);
console.log(seats);                       // 120
console.log(`${totalSeats(5, 8)} seats`); // 40 seats
```

**Say:** "`console.log` says the answer out loud, to you. `return` hands it over on paper, to the code that asked. page.js needs the paper."

- Add a `console.log("done")` line after the `return`, inside the function. It never runs. "**return** also ends the function."
- **Ask:** "Who needs the answer for the cards: you, or page.js?" (page.js, so `return`.)
- Don't fix `watchTime` yourself: that's step 4's task.

## 0:45 · Decisions inside a function (12 min)

Lab steps 5 to 7. Yesterday's `if / else if / else` works inside a function, and each block can return its own answer. Type in step 5's code box:

```js
function lengthLabel(minutes) {
  if (minutes >= 60) {
    return "Long episode";
  } else if (minutes >= 30) {
    return "Normal episode";
  } else {
    return "Short episode";
  }
}

console.log(lengthLabel(60));
console.log(lengthLabel(22));
```

- **Mistake on purpose:** swap the first two conditions. `lengthLabel(60)` now says *Normal episode*. "JavaScript stops at the first true condition. Strictest test first."
- **Ask:** "`>` or `>=`: what does `lengthLabel(60)` give with `minutes > 60`?" (Normal episode.)

Comparing two parameters (step 6):

```js
function seasonLabel(current, total) {
  if (current === total) {
    return "Final season";
  } else {
    return `Season ${current} of ${total}`;
  }
}
```

**Say:** "Three equals signs *ask*. One equals sign *changes*."

Two new maths tools (step 7), with eggs, not TV:

```js
const eggs = 14;
console.log(Math.floor(eggs / 6));   // 2 full boxes
console.log(eggs % 6);               // 2 eggs left over
```

**Say:** "`Math.floor` rounds down. `%` is the **remainder**: what's left over. This afternoon you'll split minutes into hours and the rest the same way."

## 0:57 · Shorter and smarter (13 min)

Lab steps 8 to 10. Three small ideas, one example each.

**A function that uses a function** (step 8). At the bottom of step 8's code box, type `totalSeats` again (the `return` version), then:

```js
function isSoldOut(rows, seatsPerRow, sold) {
  return sold >= totalSeats(rows, seatsPerRow);
}

console.log(isSoldOut(10, 12, 120));   // true
console.log(isSoldOut(10, 12, 80));    // false
```

**Say:** "The comparison already *is* true or false, so return it directly. And `isSoldOut` asks `totalSeats` instead of doing the maths again."

- **Ask:** "What does `isSoldOut(10, 12, 119)` give?" (`false`: one seat is still free.)

**Arrow functions** (step 9). Still in step 8's code box, type the shorter version just above the old `function totalSeats` block:

```js
const totalSeats = (rows, seatsPerRow) => rows * seatsPerRow;
```

- **Mistake on purpose:** keep the old one too. Red error: *Identifier 'totalSeats' has already been declared*. Read it aloud, then delete the old `function totalSeats` block. "Two functions can't share a name."
- **Say:** "One line after the arrow means: return this. If you add curly brackets, you must write `return` yourself."

**Default values** (step 10):

```js
function nowPlaying(show = "something good") {
  console.log(`Now playing: ${show}`);
}

nowPlaying();         // Now playing: something good
nowPlaying("Dark");   // Now playing: Dark
```

**Say:** "If the call leaves it out, the default is used. An argument always wins."

## 1:10 · The big idea, and questions (5 min)

Show the statement slide. **Say:** "If you remember one thing today: `console.log` shows a value to you, `return` gives it back to the code." Take questions.

## 1:15 · This afternoon (15 min)

1. Go to the overview (`#/day/5`). Read the intro and the step list together: 10 steps (most students need about an hour), then 36 practice exercises, P1 to P36 (about 5 hours, more than anyone finishes in one afternoon), then 2 extra challenges.
2. **Do step 1 together** on the projector (press Start again first if you demoed there). Read the explanation aloud, let the class dictate `sayHello`, call it twice, press **Check**.
3. Show where everything is: **Hint** (two per step, the second nearly the answer), **Answer**, the **Console** under the preview, and the "Not yet" message after Check.
4. **Say:** "Your progress saves by itself in this browser. Changing computers? **Help › Save progress to a file**, and on the other computer **Help › Open a progress file**."
5. Show the *Stuck?* slide: read the message → Console → hint → answer → ask.
6. When the cards are full, press **Practice exercises**: P1 to P36 are small functions on a separate page, the *practice gym*, where each `tryIt` line turns green or red. Do them in order, **before** the extra challenges (**Episode codes like S01E05** and **How many days to binge it?**).

**Milestone:** every grey note on the four cards is filled by your functions, then as many practice exercises as you can do.

---

## Handover note for the afternoon teacher

- **Step 4, *Give the answer back with return*,** is the key step. If a student is unsure, ask: "Who needs the answer, you or page.js?" A `return` with the value on the next line returns `undefined`.
- **Step 3, *Two parameters*:** the extra numbers in the Console come from page.js calling the function per card. That's expected, not a bug.
- **Step 5, *Decisions inside a function* (20 min):** wrong order (`>= 6` first) or `>` instead of `>=`. Ask them to test 9 exactly.
- **Step 7, *Hours and minutes* (20 min):** `%` confuses people. Use a clock: 90 minutes is 1 hour and 30 left over. Watch for `minutes === 0` instead of `hours === 0`.
- **Step 9, *Arrow functions*:** students keep the old `function watchTime` block and get "already declared", or put the arrow line below the line that calls it.
- **Step 10, *A default value*:** `word == "episode"` or `word: "episode"` in the brackets instead of `word = "episode"`.
- When the grey notes are all gone, they're done with the core: point them to the **practice exercises P1–P36** (about 5 hours in total, so nobody is expected to finish them all), and only after those to the extra challenges. Each exercise has its own code box and never changes the cards; students can skip any of them. P19–P30 start easy again, so a student stuck on P16–P18 can move on and come back later.
- **Hardest practice exercises:** P12 *Not started, watching or finished?* (order of four cases: test 0 first), P16 *How many evenings?* (rounding up with `%`), P17 *Time left, from two helpers* (`episodesLeft` wants `(total, watched)`, the opposite order of `timeLeft`'s parameters) and P18 *What's next?* (`${episode + 1}`, not `${episode} + 1`). In the second half, the hardest are P29–P30 (the `- 1 ... + 1` trick for seasons: test the last episode of a season), P34 *When does it end?* (minutes since midnight, `% 24` and a leading zero) and P35 *Premiere, finale or regular?* (five overlapping cases: "Series finale" before "Season finale"). P14 and P15 each introduce one small new tool (`.slice(0, n)` and `&&`), explained in the step.
