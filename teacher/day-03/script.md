# Day 3 · Script: Lay out the home page (Flexbox, Grid and phones)

**Lecture:** 90 min · **Goal:** students understand that a parent box arranges its children, can put things in a row with Flexbox and in columns with Grid, and know why the phone layout comes first and media queries add the rest.

**Before class:**

- Open ShowShelf Lab on the projector at this day's overview: add `#/day/3` to the address. Zoom the browser to 125–150%.
- Open **Help › Teacher view** and switch it on, to show answers and the teacher notes. Teacher view puts the step's answer at the bottom of the left panel: scroll the left panel back to the explanation before you type a demo.
- **Where to type the demos:** all of today's demos go in **step 1's code box** (`#/step/d3-container`), which starts with one comment line, so no answers are on screen. (Later steps start with the CSS from the step before.) Click a step's number in the bar at the bottom to show its title, then **1** to come back: your demo is still there.
- Know today's page: the **index.html (whole page)** tab shows the HTML; the **base.css** tab has the colours, fonts and the look of each card, but no layout. Students write **layout.css**.
- Check that **Bigger** (above the preview) opens a new tab on the projector laptop. You need it for the media query demo.
- Have the slide deck (Day 3) open in a second window, and a board or flipchart to draw boxes.

**Mindset:** layout is about boxes inside boxes. Whenever someone is lost, draw the boxes and ask "which box is the parent?"

---

## 0:00 · Recap (10 min)

Run the **Opening recap** from `quiz.md` (5 questions about Day 2). Then open the overview (`#/day/3`) and point at the right-hand panel: "Same colours as yesterday, maybe yours. Today: where things go."

## 0:10 · Boxes inside boxes: the container (7 min)

Slide *Boxes inside boxes*. Prepares step 1. Open step 1.

1. Point at the preview: everything is stacked in one long column, touching the left edge. **Say:** "The HTML is ready and base.css has made everything pretty. But nothing says *where* things go. That's layout.css, your file today."
2. Open the **index.html (whole page)** tab and draw the boxes on the board, outside in: `header` → `div.container.header-inner` → the logo and the `nav`; `main.container` → the hero (heading, sentence, search form) and the shows section → `div.grid` → six cards.
3. **Say:** "`.container` is yesterday's trick: `max-width`, `margin: 0 auto` and some padding at the sides, so text never touches the edge. It's used twice, and one rule styles both. That's step 1."
4. Show the side padding on another box, the hero:

   ```css
   .hero {
     padding: 16px 0;
   }
   ```

   **Mistake on purpose:** the text still touches the sides. **Say:** "With two values, the first is top and bottom, the second is left and right. I swapped them." Change it to `padding: 0 24px;`, then delete the rule.
5. **Say:** "The preview is narrow, like a phone. **Bigger** opens the page in a new tab, as wide as you like." Press it once.

**Ask:** "How many elements use `class="container"`?" (Two: the inner box of the header, and `main`.)

## 0:17 · Flexbox: a row (16 min)

Slides *display: flex makes a row* and *The Flexbox properties you need*. Prepares steps 2–4.

**Say:** "Look at one card: a badge, a title, a rating and a facts line, one under the other. Let's put them in a row."

1. Type:

   ```css
   .card-body {
     display: flex;
   }
   ```

   Scroll the preview down to the first card's text, under its poster. All four parts line up in a row, in every card. **Say:** "`display: flex` makes the box a **flex container**. Its **direct children**, the **flex items**, line up in a row. Only the children, not what's inside them."
2. **Mistake on purpose:** change the selector `.card-body` to `.badge`, one of the children:

   ```css
   .badge {
     display: flex;
   }
   ```

   The row is gone: everything is stacked again. **Say:** "The badge is one of the children. Children don't decide where they go: **the parent decides**." Change it back to `.card-body`.
3. Add to `.card-body`, one at a time, and let the class predict each result:

   ```css
     justify-content: space-between;
     align-items: center;
     gap: 12px;
   ```

   **Say:** "`justify-content` works **along** the row: try `center`, then `space-between`: first item left, last item right, the space shared in between. `align-items` works **across** the row, up and down: `center` lines up the middles of a small badge and a big title. `gap` is the space **between** items, never outside them."
4. **Mistake on purpose:** type `align-items: centre;`. Nothing. **Say:** "American spelling again: `center`."
5. **Say:** "A box can be a flex item and a flex container at the same time. This afternoon the menu, `.nav`, is an item in the top bar and a container for its own links."

**Ask:** "The logo and the menu should be in one row. Which box is their parent?" Send them to the whole-page tab; don't answer it now, it's step 2.

## 0:33 · Grow and centre (7 min)

Slide *flex: 1 takes the free space*. Prepares steps 5–6.

1. Make the title take all the space the others don't need:

   ```css
   .card-body h3 {
     flex: 1;
   }
   ```

   **Say:** "A space in a selector means *inside*: an `h3` inside `.card-body`. `flex: 1` on a flex item means grow and take the free space. The others keep their size. Parent gets `display: flex`, the child that grows gets `flex: 1`. In step 6 that's the search bar."
2. Centring text, for the hero in step 5:

   ```css
   .shows-section {
     text-align: center;
   }
   ```

   The heading and the text inside every card centre. **Say:** "One rule on the parent, and everything inside **inherits** it." Delete this rule again.
3. **Mistake on purpose:** put `flex: 1` on `.card-body` itself. Nothing grows inside the row. **Say:** "`flex: 1` goes on the child that should grow, not on the parent." Put it back on the `h3`.

**Ask:** "In the search bar, which part should grow: the input or the button?" (The input.)

## 0:40 · Grid: rows and columns (12 min)

Slides *Grid: rows and columns* and *Same shape, every picture*. Prepares steps 7–8.

**Say:** "Flexbox is for one row. For rows **and** columns at once, CSS has **Grid**."

1. In `.card-body`, change `display: flex;` to `display: grid;` and delete the other three lines. Add:

   ```css
     grid-template-columns: 1fr 1fr;
     gap: 12px;
   ```

   Each card body becomes two columns and two rows. **Say:** "`grid-template-columns` says how many columns and how wide. `fr` is a **fraction** of the free space. The items fill the grid left to right, and a new row starts by itself."
2. Change it to `1fr 2fr`: the second column is twice as wide. Then `repeat(2, 1fr)`: **Say:** "Same as `1fr 1fr`, shorter."
3. **Mistake on purpose:** `repeat(2 1fr)` without the comma. The grid is gone. **Say:** "When CSS can't read a line, it skips it. Check commas and spaces." Fix it.
4. Posters, for step 8:

   ```css
   .poster {
     width: 100%;
     aspect-ratio: 1 / 1;
     object-fit: fill;
   }
   ```

   The poster no longer fits the square: grey bands appear at its sides. Change `fill` to `cover`: it fills the whole square, and the top and bottom are cut off (the word ShowShelf at the bottom disappears). **Say:** "`aspect-ratio` fixes the **shape**, width first, then height. `object-fit: cover` fills the shape without squashing: real photos with `fill` would be stretched. Real posters arrive in all sizes later in the course, and this keeps every card the same." Delete the `.card-body`, `.card-body h3` and `.poster` rules, so the media query demo starts clean.

**Ask:** "The top bar: Flexbox or Grid? The cards?" (Top bar: one row, Flexbox. Cards: rows and columns, Grid.)

## 0:52 · Mobile first: media queries (13 min)

Slide *Mobile first: phones, then bigger*. Prepares steps 9–10.

**Say:** "Everything we write first is the **phone** layout. That's on purpose, and it's called **mobile first**. Then we add changes for bigger screens with a **media query**: CSS that only applies when a condition is true."

1. Type:

   ```css
   @media (min-width: 700px) {
     .hero h1 {
       color: crimson;
     }
   }
   ```

   **Say:** "`min-width: 700px` means *when the page is at least 700px wide*. The width where the layout changes is a **breakpoint**. Two pairs of curly brackets: one for `@media`, one for the rule inside."
2. Point at the preview: nothing changed. **Ask:** "Is it broken?" Press **Bigger**, then drag the edge of the new window narrower and wider: the heading turns crimson at 700px. **Say:** "The preview is narrower than a phone. This afternoon, when the preview doesn't change, press Bigger. After a code change, press Bigger again."
3. A second breakpoint under the first:

   ```css
   @media (min-width: 1000px) {
     .hero h1 {
       color: teal;
     }
   }
   ```

   On a wide window it's teal. Then cut it and paste it **above** the 700px one, press Bigger again: it stays crimson. **Say:** "On a wide screen both are true, and the later rule wins. So: small to big, the biggest last." Put it back at the bottom.
4. **Mistake on purpose:** remove the round brackets: `@media min-width: 700px {`. Nothing works. Put them back.

**Ask:** "On a phone, which rule decides the colour: the normal one or the media query?" (The normal one.)

## 1:05 · Cards that lift (5 min)

Slide *Smooth little moves*. Prepares step 11.

```css
button {
  transition: transform 0.2s;
}

button:hover {
  transform: scale(1.1);
}
```

Hover the Search button: it grows smoothly. **Say:** "`transform` moves or resizes something without pushing its neighbours. `translateY(-4px)` moves it up: minus is up. `transition` makes it smooth."

**Mistake on purpose:** move the `transition` line into `button:hover`. It grows smoothly, but jumps back when the mouse leaves. **Say:** "Put the transition on the normal rule, and it's smooth both ways." Move it back.

**Ask:** "`translateY(4px)` or `translateY(-4px)` to lift a card?" (Minus: up.)

## 1:10 · The big idea, and questions (5 min)

Statement slide. **Say:** "The parent decides where its children go. When a layout doesn't work, ask: which box is the parent, and did I style that one?" Take questions.

## 1:15 · This afternoon (15 min)

1. Open the overview (`#/day/3`). Read the step list together: 11 steps, from *A centred container* to *Cards that lift*. Point at the finished home page on the right.
2. **Do step 1 together.** Open step 1, press **Start again** to clear my demo, and ask the class for the three lines of `.container` (they know them from yesterday). Press **Check**, then **Bigger** to see the centring.
3. **Show where help is**, on step 1:
   - **Hint** (two per step) and **Answer** ("compare, find the difference").
   - The **Console** under the preview (click its title bar): quiet for CSS; the "Not yet" message after **Check** is your helper.
   - **Bigger**: the only way to see steps 9 and 10 work. "If the preview doesn't change, press Bigger."
   - The **index.html (whole page)** and **base.css** tabs, to look up class names.
4. **Progress:** saved automatically in this browser; **Help › Save progress to a file** to take it to another computer.
5. **Finished early?** Extra challenges B1 to B3: a top bar that stays when you scroll, six columns on big screens, a grid without media queries.
6. Point at the slide *Stuck? In this order*, and hand over to the afternoon teacher.

---

## Handover note for the afternoon teacher

- **Step 2, Flexbox: a row:** `display: flex` on the children (`.logo`, `.nav`) or on `.site-header` (its only child is the container, so nothing moves), or `display: flexbox`. Open the whole-page tab together, draw header → container → logo and nav, and ask: "Which box holds the two things we want in a row?"
- **Step 9, Phones first, then bigger screens (~20 min):** students think it's broken because the preview doesn't change. It's working: the preview is narrower than 600px. Press **Bigger** and resize that window. Also: `max-width` instead of `min-width`, a missing second `}`, or `@media min-width: 600px` without brackets.
- **Step 10, A second breakpoint:** the 900px query above the 600px one (then laptops get 3 columns), or the `.hero h1` rule after the query's last `}`.
- **Step 7, Grid: cards in columns (~20 min):** `repeat(2 1fr)` without the comma, `grid-template-column` without the s, or `grid-template-columns: 2;`.
- **Step 6, A search bar that stretches:** `flex: 1` on `.search` instead of on the input, or `.searchinput` / `.search.input` instead of `.search input` (with a space).
- **Step 8, Posters that fill the card:** `object-fit` shows no visible change today (the placeholder poster is already 2:3). That's expected; the check still tests it.
- **Steps 3 and 5:** `centre` instead of `center`.
- Use the **End-of-day check** in `quiz.md` in the last 10 minutes.
