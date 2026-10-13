# ShowShelf Lab: authoring guide

How to write or change a **day** of ShowShelf Lab, an offline practice website for an 11-day beginner web development course. Read this whole file before writing anything. Then read `lessons/day01.lesson` and `lessons/day02.lesson` completely: they are the finished reference for tone, step size, hints and checks. Match them.

## Who it's for, and how it's used

- **Students:** adults who have never programmed. After a 90-minute lecture each morning, they spend a **3–4 hour afternoon alone** in the Lab. A second teacher is in the room but doesn't know the course. So every step must teach on its own: short explanation, clear task, two hints, an answer button, and check messages that say exactly what to fix.
- **The app:** ShowShelf, a TV-show browser with a watchlist called **My List**. Its data comes from the free TVmaze API. Never call it Netflix or Spotify or use their branding. "Like the streaming apps you use" is fine.
- **Day size:** 9–12 core steps, about 150–180 minutes in total (`minutes:` per step), plus 2–3 extra challenges (`bonus: yes`) of about 10–20 minutes each for fast students.

## The lesson file format

One file per day: `lessons/dayNN.lesson` (NN = 03, 04, ...). The format is described at the top of `build.py`. It's plain text, so nothing needs escaping. Section headers are lines starting with `=== ` or `--- ` at the very beginning of a line.

```
=== day
n: 7
title: Make the page react
subtitle: The DOM and events
hours: 3 hours
page: index.html                       (file name shown on the "whole page" tab)
slot: js | js | app.js                 (code box: name | language | tab label)   languages: html, css, js, jsx
file: app.js = js                      (<script src="app.js"></script> in the page = the js code box)
refs: @page, data.js, style.css        (read-only tabs: @page = the page itself, or file names)
--- intro
Markdown shown on the day's overview page.
--- template
<!doctype html> ... the page ... <link rel="stylesheet" href="style.css"> ... <script src="data.js"></script> <script src="app.js"></script>
--- template server                     (optional extra page, used by steps with  template: server)
--- file data.js                        (fixed, read-only file content)
const shows = {{data:shows}};
--- file style.css
{{asset:appCss}}
--- default js                          (what a code box contains before the first step)

=== step first-card                     (key: lowercase letters, digits, dashes; unique per day)
title: One card from one show
minutes: 15
slot: js
bonus: yes                              (optional: an extra challenge)
template: server                        (optional: use a named template)
pagename: server.js                     (optional: file name shown on the whole-page tab)
download: index.html                    (optional: shows a "Download my website" button)
provides: theme                         (only Day 2 uses this)
--- explain                             (Markdown: the lesson)
--- task                                (Markdown: exactly what to do)
--- hint                                (first hint: a nudge)
--- hint                                (second hint: nearly the answer, usually a code snippet)
--- starter                             (fixed starting code for this step)   OR
--- starter-append                      (added below the previous step's code)
--- solution                            (the full code box content that passes)   OR
--- solution-append                     (previous step's solution + this)         OR
--- solution-replace                    (old text / a line with only => / new text; may repeat)
--- learned                             (1–2 sentences shown when the check passes)
--- summary                             (one line for the day's "What you learned" list)
--- mistakes                            (Markdown list of 2–3 common mistakes, for the teacher guide)
--- teacher                             (optional note for the afternoon teacher)
--- check                               (JavaScript: body of  async function (t) { ... })
```

### How code carries over

- **Within a day, a code box is cumulative.** A step's editor starts with the student's own code from the previous step on the same slot (or that step's solution if they skipped it). `starter-append` adds scaffolding below it (it isn't added twice). `starter` replaces it completely: use that when a day needs a fresh start.
- **Extra challenges** (`bonus: yes`) start from the last core step's code. Their `solution-append` / `solution-replace` build on the last core solution. Bonus code never flows back into core steps.
- **Between days, nothing carries over except the student's colours.** Each day starts from reference code, like a "starter" folder. The student's `:root { --color-accent; --color-bg }` from Day 2 is put where a template or file says `{{theme}}`. `{{asset:appCss}}` already ends with `{{theme}}`, so with it, their colours appear automatically.
- `solution` must be the **whole** code box content, not just the new part. Use `solution-append` or `solution-replace` to avoid copying long code; `build.py` computes the full text.

### Placeholders in templates and files

| Placeholder | Becomes |
|---|---|
| `{{slot:NAME}}` | a code box's current code (only needed in inline `<script>`/`<style>`; for files use `file: x = slot`) |
| `<link rel="stylesheet" href="F">` / `<script src="F"></script>` | inlined content of file F (a `--- file F` section or a slot via `file: F = slot`). Write the tags exactly like this. |
| `{{theme}}` | the student's Day 2 `:root` colours (empty if they have none) |
| `{{data:shows}}` | JSON array of the 12 shows (below) |
| `{{data:tvmaze}}` | JSON array of the 12 shows in TVmaze's own format |
| `{{asset:appCss}}` | the full ShowShelf stylesheet (`src/app.css`), ends with `{{theme}}` |
| `{{asset:react}}` | React 19 (development build): defines `React` and `ReactDOM` (`ReactDOM.createRoot`) as globals |
| `{{asset:expressLite}}` | the pretend Express server: defines `express()` and `cors()` |
| `poster.svg` or `images/poster.svg` | anywhere in the HTML/CSS/JS, replaced by a built-in picture (works offline) |

### What the preview does for you (`src/lab.js`, RUNTIME)

- `console.log/info/warn/error`, uncaught errors and rejected promises show in the Lab's Console panel, with beginner-friendly explanations and line numbers counted from the top of the student's code box.
- **Links:** `https://` links open in a new tab; links to other pages (`about.html`) show a notice instead of blanking the preview; `#hash` links work.
- **Forms:** a form submit that the student's code didn't `preventDefault()` is stopped with a notice ("The form tried to reload the page. The Lab stopped it.").
- `localStorage` works and survives preview reloads (it's the Lab's own storage); `localStorage.clear()` won't delete the Lab's progress.
- A broken **web** image (an `https://` address, e.g. a TVmaze poster offline) falls back to the poster. A wrong local file name shows the alt text, as in a real browser.
- **fetch to `https://api.tvmaze.com/...`:** real network first; if offline (or after 6 s) it answers from saved sample data (`src/tvmaze-mock.js`) and prints a note in the Console. Tests always run offline (`Lab.forceOffline = true`), so **checks must pass with the sample data.** The sample data supports:
  - `/search/shows?q=TERM`: `[{ score, show }]`, matching show names containing any word of TERM (e.g. `office`, `friends`, `bad`, `the`). Unknown words give `[]`. An empty q gives 400.
  - `/shows?page=0`: all 12 shows (page 1 and higher: 404)
  - `/shows/ID` with optional `?embed[]=cast&embed[]=seasons`: `_embedded.cast = [{ person: {id, name, image:null}, character: {id, name, image:null} }]`, `_embedded.seasons = [{ id, number, episodeOrder, premiereDate, image:null }]`. Unknown id: 404.
  - `/shows/ID/cast`, `/shows/ID/seasons`, `/shows/ID/episodes` (episodes are `[]` offline, so don't build core steps on episodes), `/singlesearch/shows?q=`
  - Ids: **Friends = 431, Breaking Bad = 169** (real TVmaze ids); the other ten use sample ids 9001–9010 offline. In lessons, only name ids 431 and 169.
  - Offline, `image` is null (use poster.svg); `summary` is HTML like `<p><b>Friends</b>: Six friends ...</p>`.
- **fetch to `/api/...`** (or `http://localhost:3000/api/...`) is answered by the pretend Express server if the page created one with `express()`; otherwise it fails with "no server running".
- **JSX:** a slot with language `jsx` is translated to `React.createElement(...)` before it runs (`src/jsx.js`). Syntax errors appear in the Console with a line number.

### The pretend server (`src/express-lite.js`)

It supports `express()`, `app.use(express.json())`, `app.use(cors())`, `app.get/post/put/patch/delete(path, handler)` with `:params`, `req.params / req.query / req.body` (the JSON body is parsed already), `res.status(n).json(obj)`, `res.json`, `res.send`, `res.sendStatus`, `res.status(204).end()` and `app.listen(port, callback)`. Each request prints `GET /api/mylist → 200` in the Console. A route that never answers gets a 504 after 2.5 s with an explanation. Unknown routes answer 404 `{ error: "Cannot GET /api/x" }`. A handler that throws answers 500 and logs the error.

## The check API (`t`)

The check runs after the preview has loaded the student's current code. Throw a friendly failure with `t.expect(condition, "message")` or `t.fail("message")`. Messages are Markdown: use backticks for code.

| | |
|---|---|
| `t.$(sel)`, `t.$$(sel)` | query the preview (`$$` returns an array) |
| `t.text(selOrEl)` | trimmed text with spaces collapsed ("" if missing) |
| `t.css(selOrEl, prop)`, `t.px(selOrEl, prop)` | computed style (`px` returns a number) |
| `t.rgb(c)`, `t.same(c1, c2)`, `t.isTransparent(c)`, `t.isWhite(c)`, `t.light(c)` | colour helpers (`light` is 0–1) |
| `t.cssVar("--x")` | value of a CSS variable on `:root` |
| `t.rules((selectorText, rule) => bool)` | matching CSS rules (walks into `@media` too) |
| `t.get("name")` | the value of a top-level `const`/`let`/`function` in the student's code (undefined if missing) |
| `t.code`, `t.clean` | the code box text; `clean` has comments removed |
| `t.logs` (array of `{level, text}`), `t.logged(textOrRegex)` | what the preview printed |
| `t.errors` | uncaught error messages |
| `await t.waitFor(() => cond, ms = 4000)` | wait for async results (fetch, React) |
| `await t.click(sel)`, `await t.type(sel, value)`, `await t.check(sel, on)`, `await t.submit(sel)` | act on the page. **Always `await` them**, so the page can update in between. `type` also works with React inputs. |
| `await t.sleep(ms)` | wait |
| `await t.rerun()` | run the page again (like reload; localStorage stays). `t.win` and `t.doc` then point at the new page. |
| `t.win`, `t.doc` | the preview's window and document |

> Careful: every element `id` in a template becomes a global variable in the browser. `t.get("grid")` returns the `<div id="grid">` if the student hasn't declared `grid` yet, so check the type (`typeof f === "function"`) before trusting a value.

### Check-writing rules

1. **Check behaviour, not spelling of code.** Call their functions with test inputs (`t.get("watchTime")(10, 30) === 5`), look at the DOM, type in the search box and look at the result. Only look at `t.clean` when the lesson is about the code itself (a comment, a keyword) or to give a more helpful message.
2. **Go from basic to detailed**, so the first failing message is the most useful one: "I can't find a function called `ratingLabel`" before "`ratingLabel(9.2)` should give ...".
3. **Every message says what to do next**, in one or two sentences, and names the exact thing (element, function, property). Show what they got when it helps: `` `ratingLabel(9.2)` gave "Good". It should give "Must watch". ``
4. **Be lenient** with things the lesson isn't about: letter case in free text, extra elements, `function` vs arrow functions, quotes, spacing, extra console output, their own wording in text they choose.
5. **The starter must fail and the solution must pass.** `test/run.py` enforces both.
6. Throwing a normal error (a bug in your check) shows the student "The checker got confused". Guard lookups: `const f = t.get("f"); t.expect(typeof f === "function", "...")` before calling `f`, and wrap calls to student functions in try/catch when they might throw (report "Your function crashed: " + e.message).
7. Async code (fetch, React, the pretend server): use `await t.waitFor(...)` with a clear message if it times out.

## Writing rules

- **English, British spelling in prose** (colour, favourite, centre); code uses the normal identifiers (`color`, `background-color`). No emoji anywhere.
- **Voice:** warm, plain, short sentences, second person. Explain *why* in a sentence, not a paragraph. Never "simply" or "just", never "obviously".
- **explain:** one idea per step, about 80–220 words. One small example, ideally **using a different show or context than the task**, so they must apply it rather than copy it. Define every new word the first time (in **bold**). A `>` note for a tip or where to look.
- **task:** concrete and numbered when there's more than one thing. Say where the code goes ("under your `createCard` function").
- **hints:** exactly two. The first points in the right direction; the second is almost the answer (usually a code snippet).
- **learned:** 1–2 sentences on what they can do now; can point forward ("tomorrow this becomes...").
- **summary:** one line, for the day's list of what was learned.
- **mistakes:** 2–3 real beginner mistakes, for the afternoon teacher.
- **Step size:** one new concept, 1–10 lines of code to write. Give scaffolding (`starter-append` with a skeleton and `// TODO` comments) when a step needs more.
- **Facts:** only real TV facts from the data below or the sample TVmaze data. Don't invent statistics or quotes.
- **Don't teach:** classes, `this`, prototypes, `reduce`, regular expressions, promises with `.then` chains (use async/await), modules/imports (outside Day 10's explanation), TypeScript, build tools.

## Shared data

`{{data:shows}}`: 12 objects, fields `id` (1–12), `name`, `genres` (array), `rating` (0–10 or null; all 12 have ratings), `premiered` (year), `ended` (year), `episodes`, `runtime` (minutes), `network`, `image` (null), `summary`.

| id | name | genres | rating | years | episodes | runtime | network |
|---|---|---|---|---|---|---|---|
| 1 | Friends | Comedy, Romance | 8.8 | 1994–2004 | 236 | 30 | NBC |
| 2 | Breaking Bad | Drama, Crime, Thriller | 9.2 | 2008–2013 | 62 | 60 | AMC |
| 3 | The Office | Comedy | 8.6 | 2005–2013 | 201 | 30 | NBC |
| 4 | Game of Thrones | Drama, Adventure, Fantasy | 8.9 | 2011–2019 | 73 | 60 | HBO |
| 5 | The Crown | Drama, History | 8.0 | 2016–2023 | 60 | 60 | Netflix |
| 6 | Dark | Drama, Mystery, Science-Fiction | 8.7 | 2017–2020 | 26 | 60 | Netflix |
| 7 | Chernobyl | Drama, History | 9.1 | 2019–2019 | 5 | 60 | HBO |
| 8 | The Wire | Drama, Crime | 9.0 | 2002–2008 | 60 | 60 | HBO |
| 9 | How I Met Your Mother | Comedy, Romance | 8.0 | 2005–2014 | 208 | 30 | CBS |
| 10 | Band of Brothers | Drama, War | 9.1 | 2001–2001 | 10 | 60 | HBO |
| 11 | Fleabag | Comedy, Drama | 8.4 | 2016–2019 | 12 | 30 | BBC Three |
| 12 | Avatar: The Last Airbender | Action, Adventure, Fantasy | 9.0 | 2005–2008 | 61 | 30 | Nickelodeon |

(Ratings are sample values for practice. The network column names the channel only as data; that's fine.)

## Shared stylesheet

`src/app.css` (use it with `--- file style.css` / `{{asset:appCss}}`) is the full course's ShowShelf stylesheet. Read it before designing a template. Useful classes:
`.container` (max-width + centred), `.site-header > .container.header-inner` (flex), `.logo`, `.nav`, `.list-count`, `.hero` (h1, p), `.search` (form: input + button), `.toolbar`, `.genres` + `.chip` / `.chip.active`, `.only-list`, `.grid` (responsive 2/3/4/6 columns) with `.card` > `img.poster` + `button.list-btn[aria-pressed]` + `.card-body` > `.badge`, `h3`, `.rating`, `.meta`, `.status` / `.status.error`, `.show` (details page card), `.show-header`, `.intro`, `.seasons` (table), `.cast-grid` + `.cast-card`, `.back-link`, `.button-secondary`, `.show-links`, `.site-footer`. Colours are CSS variables: `--color-bg`, `--color-surface`, `--color-text`, `--color-muted`, `--color-border`, `--color-accent`, `--color-accent-dark`, `--color-star`, `--radius`.

The Lab's apps are simplified versions of the full course's ShowShelf (in `_archive-full-course`). Keep new steps **simple**: fewer features, smaller steps, the student writes only the key lines.

## Building and testing (required)

Build only your days (plus Day 2 for the colours), into your own file, so you don't disturb anyone working in parallel:

```
python3 build.py --days 2,7 --out /tmp/lab-day07.html
python3 test/run.py --lab /tmp/lab-day07.html d7-
```

`test/run.py` opens every step, marks earlier steps done with their solutions, and requires: **starter fails, solution passes, no page errors**. All steps must be `ok`.

Then **look at it**. Write a short Playwright script (see `test/shots.py` for an example) that opens a few of your steps at 1280×800 (`#/step/d7-<key>`), sets the solution with `Lab.test.setCode(Lab.test.solution(id))`, clicks `#check`, and saves screenshots; also screenshot the day overview (`#/day/7`). Read the images. Check that the preview looks right, that the text is readable, and that nothing looks broken. Also try a couple of **wrong answers a beginner would really type** (`Lab.test.setCode(...)` then `Lab.test.check()`) and read the messages: are they helpful?

Don't edit `src/` (the engine), `lessons/day01.lesson` or `lessons/day02.lesson`. If you really need an engine change, don't make it: describe it in your final report. 
