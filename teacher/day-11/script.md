# Day 11 · Script: Make it yours and publish

**Lecture:** 90 min · **Goal:** students see how much they can do now, understand how their website is put together and how hosting works, and know what a good 2-minute demo looks like, so that this afternoon they make ShowShelf their own, put it online and present it.

**Before class:**
- Open ShowShelf Lab on the projector at Day 11's overview: `#/day/11` at the end of the address. The right side shows the finished site of the day.
- **Help › Teacher view** shows the answer and the common mistakes on every step. Use it when you show an answer; switch it off during the demos.
- Slides: *Web Dev Guided · Day 11*.
- **Publish your own ShowShelf the day before, both ways**, so you can show the result and know the screens: do Day 11 in the Lab, press **Download my website** in step 8, then put it on **Netlify Drop** (`app.netlify.com/drop`) and on **GitHub Pages**. Keep both addresses open in tabs, and one on your phone.
- Check that `app.netlify.com/drop` and `github.com` open on the classroom network. Students need a free account for either one, so an email address they can open in class.
- A visible timer for the demos (2 minutes each), and a plan: when do demos start, and in which order? Tell the afternoon teacher.
- Press **Start again** after every Lab demo, so your demo code doesn't flow into the next step.

**Mindset for today:** celebration and ownership. Nothing new to rebuild: they change settings, add one or two features with tools they already have, and publish. Keep the energy up and the pace calm.

---

## 0:00 · Recap (10 min)

- **Opening recap** in `quiz.md`: five questions about Day 10.
- **Say:** "Yesterday you saw how professionals build apps. Today you go back to *your* app, the one you finished on Day 9, and it becomes your website, on the internet, with your name on it."

## 0:10 · What you can do now (12 min)

Show the review slide. Walk through it in plain words, one line per group of days, and let students say what they remember from each:

- **Days 1 to 3:** write a page in HTML, style it with CSS and colour variables, lay it out with Flexbox and Grid so it works on a phone.
- **Days 4 to 7:** JavaScript: values, functions, decisions, arrays, objects and loops; change the page from code; react to clicks and typing; one `state` and one `render()`.
- **Days 8 and 9:** ask a server for real data with `fetch`, handle loading and errors, and build a whole app with three views.
- **Day 10:** recognise a React component and an Express route.

**Ask the room:**
- "Where does the data on a show card come from, step by step?" (TVmaze, `fetch`, `toShow` turns it into our shape, `state.shows`, `render()`, `createCard`.)
- "What runs on the visitor's computer, and what runs on a server?" (Our HTML, CSS and JavaScript run in the visitor's browser; TVmaze's data comes from TVmaze's server.)

Open the Day 11 overview: the right side shows the finished site of the day, "Ana's Shelf", with its own name, colours, a Surprise me button and a count line. **Say:** "By the end of today, yours looks like this, with your choices. And it has an address you can send to anyone."

**Say:** "That shape, a page in the browser and data from a server, is almost every web app you use. Bigger, but the same parts. Eleven days ago, most of you had never written a line of code."

## 0:22 · Your website is seven files (12 min)

Lab step 1, *Tour your app* (Teacher view off). Click the **index.html (whole page)** tab and scroll to the bottom: four `<script>` lines, `helpers.js`, `site.js`, `app.js`, `extra.js`.

**Say:** "The browser loads them **in order**, top to bottom. A file can use what the files above it made. That's why `extra.js`, which loads last, can use everything in your app."

Back in **site.js**: one object, `SITE`. **Say:** "Your site's settings live in one small object, apart from the code: the name, a sentence about the site, your name. `app.js` reads them and puts them in the logo, the browser tab and the footer." Change `name` to `"Sofa Cinema"`: the logo changes.

- **Mistake on purpose:** `name: 'Vidol's Sofa',` with single quotes. The Console says it couldn't read line 2. **Ask:** "Where does the text end?" (At the apostrophe.) Fix it with double quotes: `"Vidol's Sofa"`. Press **Start again**.

**Your look: my-theme.css.** Lab step 3, *Your colours*. **Say:** "Your Day 2 colours are already in. **my-theme.css** loads after **style.css**, and when two rules say different things, the later one wins: that's the **cascade**." Type inside `:root { }`:

```css
--color-bg: #222222;
```

The page turns dark, but the heading is dark too: you can hardly read it. **Say:** "That's **contrast**: how different two colours are in lightness. Text needs plenty of it, especially on a phone in the sun. This afternoon the check measures it for you." Press **Start again**.

- **Ask:** "If you want a dark page, what else must change?" (`--color-text` must become light, and `--color-surface` dark, for the cards.)
- **Say:** "Step 4 adds two small things with a big effect: `--radius` for the corners of the cards, and a `font-family` on `body`, which every other element inherits."

## 0:34 · Features from your own file (14 min)

Lab step 5, *A "Surprise me" button*. **Say:** "Your own features go in **extra.js**. It runs last, so it can use the app's `state`, `render()` and `openShow(id)`. Every feature follows the app's pattern: an element, a listener, change the state, `render()`." Type below the comments:

```js
const comedyButton = document.createElement("button");
comedyButton.className = "chip";
comedyButton.textContent = "Comedy tonight";
document.querySelector(".toolbar").append(comedyButton);

comedyButton.addEventListener("click", () => {
  state.genre = "Comedy";
  render();
});
```

Click **Comedy tonight**: only comedies, and the Comedy chip lights up. **Say:** "Three lines make the button, two lines in the listener. The genre chips work with it straight away, because everything is drawn from the state."

- **Mistake on purpose:** rename `comedyButton` to `grid` in the first line. The Console: "Identifier 'grid' has already been declared". "`app.js` already uses that name. Pick a new one." Change it back.

**A hook.** **Say:** "Some features must be redrawn every time the page is drawn. `app.js` has a **hook** for that: at the end of `render()`, it calls a function called `afterRender`, if you wrote one." Add:

```js
function afterRender() {
  console.log("render() just ran");
}
```

Click a genre chip, then another: a new line each time. **Say:** "Spell it exactly `afterRender`, or the app never calls it." Mention the two other tools of steps 5 and 6 in one sentence each: a random pick with `Math.floor(Math.random() * list.length)` (the dice trick from Day 4), and `sort` to put the best-rated shows first. Press **Start again**.

## 0:48 · How hosting works (13 min)

Show the hosting slide. **Say:**
- "Right now your site lives on your computer. To let anyone open it, it must be on a **web server**: a computer that's always on, always connected, and sends your files to whoever asks."
- "Renting space on one is called **hosting**. Putting your files there is called **deploying**. For a site made of HTML, CSS and JavaScript, hosting is free."
- "In step 8 the Lab packs your seven files into **one file**, `index.html`. A web server shows `index.html` when someone visits a folder's address: that's why most home pages have that name."
- "Before you download, you add one more setting, `description`: the sentence search engines show under your site's name."

Draw on the board:

```
your computer                  web server (Netlify or GitHub)          a visitor's phone
index.html   ── deploy ──►     keeps index.html, always on     ◄── asks for your address
                                                               ── sends index.html ──►
```

**Two ways, pick one** (show your own result for each):
- **Netlify Drop**, the quickest: put `index.html` in a new folder, open `app.netlify.com/drop`, log in, and drag the **folder** onto the page. A few seconds later you get an address ending in `.netlify.app`.
- **GitHub Pages**, the one many developers use: a **repository** is a project folder on GitHub. Make a public one, upload `index.html`, then **Settings › Pages**, *Deploy from a branch*, `main` and `/ (root)`. After a minute or two the site is at `USERNAME.github.io/REPO/`.

Open your published site on your phone and pass it round. **Say:**
- "The address is public: anyone who has it can open the site. Your My List stays in each visitor's own browser, so nobody sees yours."
- "Online, your site uses real TVmaze data and real posters, so it needs internet, like any website."

**Ask:** "You change your colours next week. How does the site online change?" (Download again and upload again: drag the folder onto the site's Deploys page on Netlify, or upload the new `index.html` to the same repository.)

## 1:01 · Demos and what's next (14 min)

**Demo rules** (slide): 2 minutes each, with a visible timer. Have your site open, online, before your turn.
1. One sentence: what does your site do?
2. Show it working: a search, a show page, adding to My List.
3. The part you're proudest of, and why.
4. What you'd add next.

**Model it:** give a 2-minute demo of your own published site now, with the timer running. Then **Say:** "Write your three sentences down first: that's step 10. Everyone in the room built the same app in the same 11 days; they want to see what *you* did with it." Backup if the network is slow: demo from the downloaded file, or from the Lab.

**What next** (slide). **Say:**
- "Keep practising a little every week. Little and often beats one long weekend."
- "**freeCodeCamp** has free, step-by-step courses. **MDN Web Docs** explains every HTML element, CSS property and JavaScript method: it's where developers look things up."
- "A great next project: build ShowShelf again from scratch, with a different free API, for music or for books. Starting from an empty file is where you find out what you really know."
- "When that feels easy, the tools from yesterday are the next step: React for the page, and a server with Express and a database."

**Ask:** "What would you build for yourself?" Take two or three answers.

Show the statement slide. **Say:** "Build something you want to use yourself. You know every piece you need to start."

## 1:15 · This afternoon (15 min)

1. Open the Day 11 overview (`#/day/11`). Read the step list together, in the phases on the slide: *your settings* (1 to 4), *your features* (5 to 7), *online* (8 and 9), *your demo* (10). Point at the overview's line: **finish step 9 with at least 30 minutes to spare.**
2. **Do step 1 together** on the projector, with Teacher view off: read the four script lines, find `state` and `openShow` in app.js, and give the site a name the class chooses. Press **Check**.
3. Show where help is: **Hint** under the code box, **Answer** next to it, and the **Console** bar under the preview.
4. **Progress saves automatically** in this browser. Changing computers: **Help › Save progress to a file**, then **Help › Open a progress file**.
5. **Finished early?** The extra challenges after step 10: *A dark theme button*, *Clear My List*, *An About section*. Each has its own **Download** button. Every challenge starts from the step 7 code: to keep two, paste the first one's code into the second one's box before downloading, then upload the new file.
6. **Milestone:** your site at its own address, open on a phone, and three demo sentences written.
7. Say when the demos start, and who goes first.

---

## Handover note for the afternoon teacher

- **Timing is the risk today.** Students must finish step 9 (*Put it online*) with at least 30 minutes left for step 10 and the demos. Anyone still polishing colours after an hour: move them on to step 5.
- **Steps 1 and 2:** `'Ana's Shelf'` with single quotes ends the text at the apostrophe; use double quotes. Deleted commas or quotes give a syntax error with a line number. Typing in a read-only tab changes nothing.
- **Step 3, *Your colours* (20 min):** lines written inside the comment, before `*/`, are ignored; `-color-bg` with one dash; a dark `--color-bg` with the default dark text, or a pale accent, fails the contrast check. Say: "Make the text darker or the background lighter until the check is happy."
- **Step 5:** "has already been declared" means they reused a name from app.js (`grid`, `button`): any new name fixes it. `openShow(state.shows[index])` needs `.id` at the end.
- **Step 7, *A personal touch*:** the hook must be spelled exactly `afterRender`; a count set once at the top says 0, because the shows haven't loaded yet; two `afterRender` functions means only the last one counts. The badge choice is the hardest: point stronger students at it.
- **Step 8, *Download your website*:** the file may be called `index (1).html`: rename it. If it opens as code, it opened in a text editor: right-click, Open with, a browser. It needs internet; the Lab's sample data isn't in the file.
- **Step 9, *Put it online* (25 min):** drop the **folder**, not the file, on Netlify Drop; paste the site address (`....github.io/...`), not the repository address (`github.com/...`); a GitHub repository must be public. GitHub Pages can take a few minutes: start step 10 while waiting. No account? Demo from the downloaded file.
- **Demos:** 2 minutes each, visible timer, a clap for everyone. Backup: the downloaded file or the Lab preview.
