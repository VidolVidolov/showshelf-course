# Day 2 · Script: Style it (CSS)

**Lecture:** 90 min · **Goal:** students can read and write a CSS rule, choose elements by name and by class, use the box model to make a card, and know why their own colour variables matter for the rest of the course.

**Before class:**

- Open ShowShelf Lab on the projector at this day's overview: add `#/day/2` to the address. Zoom the browser to 125–150%.
- Open **Help › Teacher view** and switch it on, to show answers and the teacher notes. Teacher view puts the step's answer at the bottom of the left panel: scroll the left panel back to the explanation before you type a demo.
- **Where to type the demos:** all of today's demos go in **step 1's code box** (`#/step/d2-first-rule`). It starts with one comment line, so no answers are on screen. (Later steps start with the CSS from the step before, which would show the class the answers.) To show which step a block prepares, click that step's number in the bar at the bottom, then click **1** to come back: your demo is still there.
- The page today is yesterday's Friends page (the Lab's tidy copy). Students only write CSS, in **style.css**. Click the **show.html (whole page)** tab once before class so you know where the classes are: `site-header`, `logo`, `show`, `meta`, `poster`, `site-footer`.
- Have the slide deck (Day 2) open in a second window.

**Mindset:** today is very visual. Every line they type changes the page. Let them enjoy it, and say "look what one line did" often.

---

## 0:00 · Recap (10 min)

Run the **Opening recap** from `quiz.md` (5 questions about Day 1). Then open `#/day/1` and point at the finished Friends page: "It works, but it looks plain. Today we make it look good."

## 0:10 · How CSS works: a rule (12 min)

Slide *Anatomy of a rule*. Prepares steps 1–2. Open step 1.

**Say:** "Yesterday HTML said what each piece *is*. Today **CSS** says how it *looks*: colours, fonts, spacing. It lives in its own file, style.css."

1. Click the **show.html (whole page)** tab. Point at `<link rel="stylesheet" href="style.css">` in the `<head>`. **Say:** "This one line connects the page to the CSS file." Click back to the code tab.
2. Type, under the comment:

   ```css
   p {
     background-color: pink;
   }
   ```

   **Say:** "Test with something ugly first, so you know it's connected." Every paragraph turns pink.
3. Name the parts, pointing at each: "`p` is the **selector**: which elements. Inside the curly brackets is a **declaration**: a **property**, a colon, a **value**, and a semicolon at the end."
4. **Mistake on purpose:** change it to `background-colour: pink;`. The pink disappears, with no error. **Say:** "CSS is written in American English: `color`, no u. When CSS doesn't understand a line, it skips it quietly." Fix it.
5. Change `pink` to a hex code, `#fdf6e3`. **Say:** "Colours can be names or **hex codes**: a hash and six characters. Search the web for 'colour picker' to find any colour."
6. Delete the pink rule. Slide *Text styles are inherited*. Now text properties, on the lists:

   ```css
   ul {
     color: #0a7d5a;
     font-family: Georgia, serif;
     line-height: 2;
   }
   ```

   **Say:** "I styled the `ul`, and every `li` inside it changed. Elements **inherit** text styles from the box they're in. This afternoon you'll style `body`, and the whole page follows."

**Ask:** "Which part of `color: #0a7d5a;` is the property and which is the value?"

## 0:22 · Choosing what to style: selectors (11 min)

Slide *Selectors choose what to style*. Prepares steps 3–4.

1. An element selector, then a group:

   ```css
   strong, em {
     color: crimson;
   }
   ```

   **Say:** "An element name styles every element of that kind. A comma lets one rule serve several selectors."
2. A class, with a dot:

   ```css
   .logo {
     color: crimson;
   }
   ```

   **Say:** "Remember yesterday's `class` labels? A dot and the class name selects every element with that label, and nothing else."
3. **Mistake on purpose:** remove the dot: `logo {`. Nothing happens. **Say:** "Without the dot, CSS looks for an element called `<logo>`. There isn't one." Put the dot back.
4. Sizes need a unit. Add `font-size: 30;` to `.logo`: nothing. Change it to `30px`: it grows. **Say:** "`px` means pixels, the dots on the screen. Always write the unit."

**Ask:** "Which selector picks only the facts line, `<p class="meta">`: `p`, `meta` or `.meta`?" (`.meta`.)

## 0:33 · Every element is a box (15 min)

Slide *Every element is a box*. Prepares steps 5–7. Draw four nested rectangles on the board: content, padding, border, margin.

**Say:** "To the browser, everything is a box. Inside out: the **content**, then **padding** (space inside the border), then the **border**, then **margin** (space outside, between this box and its neighbours)."

1. Make the footer a box you can see:

   ```css
   .site-footer {
     background-color: #ffffff;
     padding: 16px;
     border: 2px dashed #e3e0f0;
     border-radius: 8px;
   }
   ```

   Type one line at a time and let the class watch each one change the footer.
2. **Mistake on purpose:** remove `dashed` from the border. The border disappears. **Say:** "A border needs three things: thickness, style and colour. Without the style there's nothing to draw." Put it back.
3. Change `padding` to `40px`, then back. **Ask:** "Did the space grow inside or outside the dashed line?" (Inside: padding.)
4. Slide *Not too wide, and centred*. Add to the same rule:

   ```css
     max-width: 400px;
     margin: 24px auto;
   ```

   **Say:** "`max-width`: never wider than 400px, but a phone can still be narrower. `margin: 24px auto`: 24px above and below, and `auto` on the left and right shares the free space, so the box sits in the middle." Press **Bigger** above the preview to see the centring on a wide screen.
5. **Say:** "Pictures can be sized too. Set only the width, and the browser keeps the shape. That's step 7."

## 0:48 · Small properties, big effect (12 min)

Slide *Small properties, big effect*. Prepares steps 8–10.

1. A line under the headings, and centred text:

   ```css
   h2 {
     border-bottom: 2px solid #e3e0f0;
     text-align: center;
   }
   ```

   **Say:** "`border-bottom` is a border on one side only. `text-align: center` centres text inside its box. Note: American spelling again, `center`."
2. Point at the table on the slide: `font-weight: bold;` and `text-decoration: none;` (removes a link's underline) are for step 8.
3. A **hover** effect:

   ```css
   li:hover {
     background-color: lavender;
   }
   ```

   Move the mouse over the cast list. **Say:** "`:hover` is a **pseudo-class**: a state the element can be in, here 'the mouse is over it'. Interaction, and no programming."
4. **Mistake on purpose:** add a space, `li :hover`. It stops working. **Say:** "No space before the colon." Fix it.
5. **Say:** "Tables look cramped by default. In step 10 two properties fix that: `border-collapse` and padding on the cells. The Lab explains it."

**Ask:** "How would you remove the underline from a link?" (`text-decoration: none;`)

## 1:00 · Your colours: variables (10 min)

Slide *Variables: one colour, many places*. Prepares step 11.

**Say:** "This afternoon your accent colour will end up in several rules. To change it, you'd have to find every copy. **Variables** fix that: give a colour a name, once, and use the name everywhere."

1. At the top of the code box:

   ```css
   :root {
     --color-accent: #0a7d5a;
   }
   ```

   Then use it in two places:

   ```css
   strong, em {
     color: var(--color-accent);
   }

   .logo {
     color: var(--color-accent);
   }
   ```

2. Change `#0a7d5a` to `crimson`. Both change at once. **Say:** "`:root` means the whole document. The name starts with two dashes. `var( )` uses it."
3. **Mistake on purpose:** use `var(-color-accent)` with one dash. The colour is gone. Fix it.
4. **Ask:** "I want to change the accent colour everywhere. How many lines do I change?" (One.)
5. **Say, clearly:** "In step 11 you choose **your** two colours: `--color-accent` and `--color-bg`, exactly those names. The Lab carries them into every page you build from tomorrow on. Pick colours you like, and keep the background light so text stays readable."

## 1:10 · The big idea, and questions (5 min)

Statement slide. **Say:** "Give it a class in HTML. Style the class in CSS. That's how almost every website is styled." Take questions.

## 1:15 · This afternoon (15 min)

1. Open the overview (`#/day/2`). Read the step list together: 11 steps, from *Your first CSS rule* to *Your own colours with variables*. **Say:** "Same order as this morning. The last step is the one that follows you: take your time on it."
2. **Do step 1 together.** Open step 1, press **Start again** to clear my demo, and ask the class for a light background colour. Type a `body` rule with `background-color`, press **Check**, read the green message aloud.
3. **Show where help is**, on step 1:
   - **Hint**: two per step, the second one almost the answer.
   - **Answer**: one possible answer. "Compare it with yours and find the difference."
   - The **Console** under the preview (click its title bar). CSS rarely writes there; the "Not yet" message after **Check** is your main helper today.
   - **Bigger**, above the preview: opens the page in a new tab, to see it on a wide screen (steps 6 and later).
   - The **whole page** tab: where to look up class names.
4. **Progress:** "It saves automatically in this browser. Changing computers? **Help › Save progress to a file**, then **Help › Open a progress file** on the other one."
5. **Finished early?** Extra challenges B1 to B3: dark mode, a poster that moves, small spaced headings.
6. Point at the slide *Stuck? In this order*, and hand over to the afternoon teacher.

---

## Handover note for the afternoon teacher

- **Step 11, Your own colours with variables (~25 min)** is the longest and the one that matters most: these colours appear on every later day. Typical errors: one dash (`-color-accent`), `var(color-accent)` without the dashes, `root { }` without the colon. Check `--color-bg` is a **light** colour, or later pages will be hard to read.
- **Step 5, The box model: make a card (~20 min):** `border: 1px #e3e0f0;` without `solid` shows no border. Padding and margin get mixed up: padding is inside the border.
- **Step 8, Header and footer (~20 min):** three separate rules. Students guess class names: send them to the **show.html (whole page)** tab to read `site-header`, `logo`, `site-footer`.
- **Step 1:** `background-colour` (British spelling), or a missing `;` or `}`. CSS skips what it can't read, with no error.
- **Step 6, Width and centring:** the preview is narrow, so centring only shows after pressing **Bigger**. `margin: auto 32px` (values swapped) doesn't centre.
- **Step 4, Style by class:** `meta { }` without the dot, or `font-size: 14;` without `px`.
- **Step 9, Links and hover:** `a :hover` with a space doesn't work.
- Use the **End-of-day check** in `quiz.md` in the last 10 minutes.
