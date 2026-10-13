# Day 4 · Script: JavaScript: first steps

**Lecture:** 90 min · **Goal:** students know what JavaScript is for, can read the Console, store text and numbers in variables, calculate with them, put text on the page, choose between two messages with `if / else`, and read an error message without panic.

**Before class:**

- Open ShowShelf Lab on the projector at this day's overview: add `#/day/4` to the address. Zoom the browser to 125–150%.
- Open **Help › Teacher view** and switch it on, to show answers and the teacher notes. Teacher view puts the step's answer at the bottom of the left panel: scroll the left panel back to the explanation before you type a demo.
- **Where to type the demos:** all of today's demos go in **step 1's code box** (`#/step/d4-hello`). It starts with two comment lines, so no answers are on screen. (Later steps start with the code from the step before.) Click a step's number in the bar at the bottom to show its title, then **1** to come back: your demo is still there. The **Console** is under the preview; on JavaScript days it's open.
- Today's demo show is **The Office** (from the Lab's data): 201 episodes, about 30 minutes each, 9 seasons, NBC, rating 8.6. The afternoon uses Friends, so students still do every task themselves.
- Have the slide deck (Day 4) open in a second window.

**Mindset:** this is the first real programming day, and some students will feel lost. Say it out loud: "Today is the day most people find hardest at first. That's normal. It clicks with practice." Make mistakes on purpose, and read every red message aloud.

---

## 0:00 · Recap (10 min)

Run the **Opening recap** from `quiz.md` (5 questions about Day 3). Then open the overview (`#/day/4`): "Same Friends page, styled with your colours. The grey notes are empty spaces. By tonight your JavaScript fills them in."

## 0:10 · The Console, text and numbers (13 min)

Slides *Instructions, top to bottom* and *Text and numbers*. Prepares steps 1–2. Open step 1.

**Say:** "HTML says what things are. CSS says how they look. **JavaScript** gives the browser instructions, and it runs them one at a time, from the top of the file to the bottom."

1. Point at the **Console** under the preview. **Say:** "This is where JavaScript talks back to you. Visitors never see it. In a normal browser you open it with F12." Type:

   ```js
   console.log("Good morning!");
   console.log("Then the next line.");
   ```

   **Say:** "`console.log` writes a message in the Console. The message is in quotes, inside the brackets, and the semicolon ends the instruction, like a full stop." Swap the two lines: the Console order follows the code.
2. **Mistake on purpose:** `Console.log("Good morning!");` with a capital C. A red error appears. Read it aloud, then the grey note under it. **Say:** "JavaScript cares about capital letters. Red isn't a disaster, it's a message: it says what and on which line."
3. **Strings and numbers.** **Say:** "Every piece of data is a **value**. Text is a **string** and always goes in quotes. A **number** has no quotes, and decimals use a dot: 8.6." Ask the class to predict each line before you type it:

   ```js
   console.log(26 + 10);
   console.log("26" + 10);
   console.log("The" + " Wire");
   ```

   (36, then 2610, then The Wire.) **Say:** "Numbers add up. With a string, `+` **joins**: the quotes made 26 into text. This surprises everyone once." (26 and 10 are the episodes of Dark and Band of Brothers, from our data.)
4. **Mistake on purpose:** `console.log(Hello);` without quotes: "Hello is not defined". **Say:** "Without quotes, JavaScript thinks a word is the name of something."

**Ask:** "What will `console.log("8" + "6")` print?" (86: two strings, joined.)

## 0:23 · Variables: const and let (10 min)

Slide *A name for a value*. Prepares steps 3–4.

1. Type:

   ```js
   const showName = "The Office";
   const episodes = 201;
   const runtime = 30;
   console.log(showName);
   ```

   **Say:** "A **variable** is a name for a value, like a label on a box. Read the first line as: make a box called `showName` and put "The Office" in it. The `=` means *put into*, not *is equal to*. Names have no spaces; each new word starts with a capital: **camelCase**."
2. **Mistake on purpose:** `console.log("showName");` prints the word *showName*. **Say:** "Use a variable's name **without** quotes. With quotes it's just text."
3. A value that changes:

   ```js
   let seasonsWatched = 2;
   console.log(seasonsWatched);
   seasonsWatched = seasonsWatched + 1;
   console.log(seasonsWatched);
   ```

   The Console shows 2, then 3. **Say:** "Read the third line from right to left: take what's in the box, add 1, put the result back in. Don't write `let` again: that would make a second box with the same name."
4. **Mistake on purpose:** change `let` to `const`. Read the red error together: "Assignment to constant variable." **Say:** "`const` never changes, `let` can. Use `const` unless you know the value will change." Change it back.

**Ask:** "The name of the app: `const` or `let`? The number of episodes you've watched?" (`const`, `let`.)

## 0:33 · Maths and sentences (13 min)

Slides *Maths with variables* and *Sentences with backticks*. Prepares steps 5–6.

1. **Say:** "The operators: `+` and `-`, `*` for times, `/` for divided by. Brackets first, like at school. The best part: you can calculate with variables." Type:

   ```js
   const seasons = 9;
   const perSeason = episodes / seasons;
   console.log(perSeason);
   console.log(Math.round(perSeason));
   ```

   (22.333333333333332, then 22.) **Say:** "Division often gives long decimals. `Math` is a toolbox that comes with JavaScript; `Math.round` rounds to the nearest whole number."
2. Times: `console.log(Math.round(perSeason) * runtime);` (660 minutes, about one season). **Say:** "If I change `runtime` at the top one day, every result that uses it updates by itself. That's why we use names, not typed numbers."
3. **Mistake on purpose:** `math.round` with a small m: "math is not defined". Fix it.
4. **Sentences.** **Say:** "Joining text with `+` gets messy fast. A **template literal** is easier: **backticks** around the text, and `${ }` around each value." Show where the backtick key is (top left, under Esc). Type:

   ```js
   const line = `${showName} has ${seasons} seasons.`;
   console.log(line);
   ```

   (The Office has 9 seasons.)
5. **Mistake on purpose:** change the backticks to normal double quotes. The Console prints `${showName}` as it is. **Say:** "Only backticks fill in the `${ }`."

**Ask:** "How many hours is 660 minutes? How would you ask JavaScript?" (`660 / 60`, which is 11.)

## 0:46 · Put text on the page (8 min)

Slide *Put text on the page*. Prepares step 7.

1. Click the **show.html (whole page)** tab. Point at the empty elements and their ids: `network`, `title`, `meta`, `rating`, `watch-time`, `verdict`, `random`. **Say:** "The grey notes in the preview are these empty elements. JavaScript can fill them." Back to the code tab.
2. Type:

   ```js
   document.querySelector("#rating").textContent = "Rating: 8.6";
   document.querySelector("#random").textContent = line;
   ```

   **Say:** "Read it left to right: in the **document**, the web page, **find** the element with id `rating` (the `#` works like in CSS), and set its **text** to this. The Console is for you; this is for your visitors."
3. **Mistake on purpose:** remove the `#`: `querySelector("rating")`. A red error: it found nothing, so it can't set its text. Read the grey note. Put the `#` back.
4. **Say:** "One more trap for step 7: `textcontent` with a small c gives **no** error and **no** result. Capital C."

**Ask:** "Which element would show the show's name? Look at the ids." (`#title`.)

## 0:54 · True, false, if and else (11 min)

Slide *True, false, if and else*. Prepares steps 8–9.

1. **Booleans:** **Say:** "A third kind of value has only two possible values, `true` and `false`. It's called a **boolean**. You get one by comparing." Type and let the class predict:

   ```js
   const isShort = runtime < 45;
   console.log(isShort);
   console.log(seasons === 9);
   console.log(seasons === "9");
   ```

   (true, true, false.) **Say:** "One `=` puts a value in. Three `===` ask a question: are these the same? And `===` checks the type too: the number 9 and the text "9" are different."
2. **Decisions:**

   ```js
   if (isShort) {
     console.log("Fits in a lunch break.");
   } else {
     console.log("One for the evening.");
   }
   ```

   **Say:** "The condition goes in round brackets; each block in curly brackets. Exactly one of the two blocks runs, never both. The two spaces inside each block show which lines belong where."

   **Ask:** "With `runtime` at 60, which message do we get?" (One for the evening.)
3. Change `runtime` to `60` at the top: the other message appears. Change it back. **Say:** "Same code, different result when the numbers change. In step 9 you'll do this with `episodes`, and the message goes on the page."
4. **Mistake on purpose:** delete the `}` just before `else`. A red error, and the rating and sentence on the page disappear. **Say:** "Look: *everything* stopped, not just this part. That's the next block."

## 1:05 · Read the error (5 min)

Slide *Read the error. It says what and where.* Prepares step 10.

1. With the `}` still missing, point at the error and its line number. **Say:** "JavaScript **can't read** the file at all: a **syntax error**. None of it runs, which is why the page went back to grey notes." Put the `}` back.
2. Add `console.log(episods);` at the bottom (one letter missing). **Say:** "Now JavaScript can read it, but something fails **while running**: it doesn't know the name `episods`. The lines above it already ran: the page is fine."
3. **Say:** "The line number is where JavaScript *noticed* the problem. Sometimes the real mistake is on the line just above. Read the red message aloud, then the grey note under it. In step 10 we hid two mistakes for you to find."

**Ask:** "A missing quote: does the rest of the file still run?" (No: JavaScript can't read the file, so nothing runs.)

## 1:10 · The big idea, and questions (5 min)

Statement slide. **Say:** "One `=` puts a value into a box. Three `===` ask a question. If you remember one thing from today, remember that." Take questions.

## 1:15 · This afternoon (15 min)

1. Open the overview (`#/day/4`). Read the step list together: 10 steps, from *Hello, Console* to *Read the error, fix the code*. **Say:** "Every step is small on purpose. Go slowly."
2. **Do step 1 together.** Open step 1, press **Start again** to clear my demo, and ask the class what to type: `console.log("Hello, ShowShelf!");` and a sentence about a show they like. Point at the Console, press **Check**, read the green message aloud.
3. **Show where help is**, on step 1:
   - The **Console**, under the preview: from today, your most important helper. Red line, line number, grey explanation.
   - **Hint** (two per step) and **Answer** ("compare it with yours, find the difference").
   - **Run again** above the preview runs your code once more (handy for the random number challenge).
   - The **show.html (whole page)** tab: where the ids are.
4. **Progress:** saved automatically in this browser; **Help › Save progress to a file**, then **Help › Open a progress file** on another computer.
5. **Finished early?** Extra challenges B1 to B3: text that knows tricks, a random episode, three choices with `else if`.
6. Point at the slide *Stuck? In this order*, and hand over to the afternoon teacher.

---

## Handover note for the afternoon teacher

- **Step 7, Put text on the page (~20 min):** no `#` in `querySelector("title")` (that changes the browser tab's title instead), `textcontent` with a small c (no error, no result), or quotes around a variable (the page shows the word *showName*).
- **Step 9, Choose with if and else (~20 min):** a missing `}` before `else`, or a semicolon after the condition: `if (isLong); {`. The check also runs their code with a short show, so `if (true)` won't pass. They must change `episodes` back to 236 before **Check**.
- **Step 5, Maths with variables (~20 min):** `math.round` with a small m, `x` instead of `*`, or typing `236 * 30` instead of the variable names.
- **Step 6, Sentences with backticks:** normal quotes instead of backticks (the `${ }` is printed as it is), or `$(hours)`. Show them the backtick key, top left under Esc.
- **Step 4, Values that change: let:** writing `let` again on the second line ("has already been declared").
- **Step 10, Read the error, fix the code:** students delete the broken lines instead of fixing them. Ask them to read the error aloud and look at the line it names and the line above.
- If the Console seems missing, click its title bar under the preview. First question when someone is stuck: "What does the red line in the Console say?"
- Use the **End-of-day check** in `quiz.md` in the last 10 minutes.
