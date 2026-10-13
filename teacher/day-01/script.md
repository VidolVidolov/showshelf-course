# Day 1 · Script: Your first web page (HTML)

**Lecture:** 90 min · **Goal:** students know what an HTML element is (tags, content, attributes), have seen every element the Lab uses today, and can start the afternoon in ShowShelf Lab on their own.

**Before class:**

- Open ShowShelf Lab (`showshelf-lab.html`) on the projector at this day's overview: add `#/day/1` to the address. Zoom the browser to 125–150% so the code box is readable from the back.
- Open **Help › Teacher view** and switch it on. You need it to show answers and the teacher notes. Teacher view puts the step's answer at the bottom of the left panel: before you type a demo, scroll the left panel back up to the explanation, so the class sees your example, not the answer.
- Check every student has the Lab file and can open it in a browser (Chrome, Edge or Firefox). It works offline.
- **Where to type the demos:** all of this morning's demos go in **step 1's code box** (`#/step/d1-heading`). It starts empty, so no Lab answers are on screen, and your demo grows there all morning. (A later step's code box starts with the Friends code from the step before it, which would show the class the answers.) To show which step a block prepares, click that step's number in the bar at the bottom, read its title, then click **1** to come back: your demo is still there.
- Have the slide deck (Day 1) open in a second window.
- Today's demo show is **Breaking Bad**. Facts you'll use (all from the Lab's data): AMC · 2008–2013 · 62 episodes · about 60 minutes · Drama, Crime, Thriller · "A chemistry teacher with money problems turns to crime and slowly becomes someone else." · cast: Bryan Cranston as Walter White, Aaron Paul as Jesse Pinkman, Anna Gunn as Skyler White · seasons 1 and 2 have 7 and 13 episodes.

**Mindset:** nobody in the room has programmed. Every new word gets a plain definition. Celebrate every visible result ("Look, that's your first web page").

---

## 0:00 · Welcome and warm-up (5 min)

**Say:** "Welcome to Web Dev in 11 Days. You don't need any experience. If you can use a browser and type, you can do this."

Run the **warm-up** from `quiz.md` (3 questions, no wrong answers). Listen for who has seen code before; they can help neighbours later.

## 0:05 · The course and the Lab (10 min)

1. Open **Day 11's overview** in the Lab (`#/day/11`). The right-hand panel shows the finished site.
   **Say:** "This is ShowShelf, a TV-show website with your own watchlist called My List, like the streaming apps you use. In 11 days you'll build it, one small piece at a time. Today's piece is one page about one show."
2. Go back to `#/day/1`. Point at the panel on the right: "What you will have built at the end of today." **Say:** "By this afternoon, this is yours."
3. **The daily rhythm** (slide *How every day works*):
   - Morning, 90 minutes: I explain the ideas and show each one working, live.
   - Afternoon, 3–4 hours: you work alone in ShowShelf Lab, step by step, at your own speed. A second teacher is in the room to help.
4. **The Lab, in one sentence each:** the explanation on the left, the dark code box in the middle, the preview on the right that changes as you type, and the **Check** button.
   **Say:** "You can't break anything. Every step saves itself, and **Start again** puts a step back to how it began."

**Ask:** "What do you think HTML stands for?" (HyperText Markup Language. Only the idea matters: it *marks up* text, saying what each piece is.)

## 0:15 · Elements: tags and content (14 min)

Slide *Anatomy of an element*. Prepares steps 1–3. Open step 1 (`#/step/d1-heading`) and scroll the left panel to the top.

**Say:** "A web page is a plain text file written in **HTML**. HTML doesn't make things pretty. It tells the browser what each piece *is*: this is a heading, this is a paragraph, this is a picture."

1. Type in the code box, slowly, saying each character:

   ```html
   <h1>Breaking Bad</h1>
   ```

   **Say:** "`<h1>` is the **opening tag**. `</h1>` is the **closing tag**: same name, with a slash. The text between them is the **content**. All three together are an **element**. `h1` means heading, level 1: the main title."
2. Point at the preview: "Big and bold. I didn't ask for big and bold. The browser decides how a heading looks, until tomorrow, when you decide."
3. **Mistake on purpose:** delete the slash: `<h1>Breaking Bad<h1>`. Nothing looks broken. **Say:** "HTML doesn't complain. It guesses. That's why the Lab's Check button is useful: it tells you what's missing." Put the slash back.
4. Under it, a paragraph:

   ```html
   <p>A chemistry teacher with money problems turns to crime.</p>
   ```

   Then press Enter a few times in the middle of the sentence. **Ask:** "Did the page change?" (No.) **Say:** "The browser ignores extra spaces and new lines. The tags decide where things go, not the Enter key."
5. **Nesting** (slide *Boxes inside boxes*): wrap two words:

   ```html
   <p>A <strong>chemistry teacher</strong> with money problems <em>turns to crime</em>.</p>
   ```

   **Say:** "Elements can go inside other elements. `strong` means important, shown in bold. `em` is emphasis, shown in italics. Close the inner one first, like boxes inside boxes."

**Ask:** "Which closes first here: the `em` or the `p`?" (The `em`.)

## 0:29 · Attributes: a class and a picture (11 min)

Slide *Attributes: extra information*. Prepares steps 4–5. Keep typing in step 1's box, under your paragraph.

1. Add a facts line under the heading:

   ```html
   <p class="meta">AMC · 2008–2013 · 62 episodes</p>
   ```

   **Say:** "`class="meta"` is an **attribute**: extra information inside the opening tag. A name, an equals sign, a value in quotes. A class is a label you choose, like a sticky note. Nothing changes on screen today. Tomorrow, CSS uses the label: make everything labelled `meta` small and grey."
2. Add a picture:

   ```html
   <img class="poster" src="poster.svg" alt="Poster for Breaking Bad">
   ```

   **Say:** "`img` has **no closing tag**: it has no text inside, everything is in the attributes. `src` is where the picture is. `alt` describes it in words: screen readers read it out, and browsers show it when the picture can't load." Then change `src` to `posterr.svg`: the picture disappears and the alt text shows instead. Change it back.
3. **Mistake on purpose:** delete the closing quote in `class="meta"`, so it reads `<p class="meta>AMC ...`. The facts line, and maybe more, vanishes from the preview. **Say:** "One missing quote, and the browser thinks everything up to the next quote is part of the attribute. Computers are very literal." Put the quote back.

**Ask:** "Where does an attribute go: in the opening tag or the closing tag?" (Opening.)

## 0:40 · Headings and lists (9 min)

Slide *Headings and lists*. Prepares steps 6–8.

1. Type:

   ```html
   <h2>Main characters</h2>
   <ul>
     <li>Walter White</li>
     <li>Jesse Pinkman</li>
   </ul>
   ```

   **Say:** "`h2` is a smaller heading, for a part of the page. A list is two kinds of element working together: `ul`, the whole list, and `li`, one item each. Every `li` lives inside the `ul`."
2. Point at the two spaces before each `<li>`: "That's **indenting**. It doesn't change the page, but it shows what's inside what. The Tab key adds two spaces."
3. Change `ul` to `ol` (both tags). Numbers appear. **Say:** "`ol` is a numbered list, for when the order matters. You never type the numbers yourself."

**Ask:** "Your top three shows: `ul` or `ol`?" (`ol`: the order matters.)

## 0:49 · Links and tables (12 min)

Slides *A link goes somewhere* and *A table: rows of cells*. Prepares steps 9–10.

1. A link inside a paragraph:

   ```html
   <p>More on <a href="https://www.tvmaze.com/shows/169/breaking-bad">TVmaze</a>.</p>
   ```

   **Say:** "`a` is a link. `href` is where it goes. The content is what people click." Click it in the preview: it opens in a new tab.
2. **Mistake on purpose:** remove `https://`. Click: the Lab shows a notice instead of the TVmaze page. **Say:** "Without `https://` the browser looks for a file on *your* website." Put it back.
3. A small table under your link:

   ```html
   <table>
     <tr>
       <th>Season</th>
       <th>Episodes</th>
     </tr>
     <tr>
       <td>1</td>
       <td>7</td>
     </tr>
   </table>
   ```

   **Say:** "`table` is the whole table. `tr` is one row. `th` is a heading cell, `td` a normal cell. Every row has the same number of cells."
4. Add season 2 by copying the whole row from `<tr>` to `</tr>`, pasting it **before** `</table>`, and changing the numbers (2, 13). **Say:** "Copy, paste, change. That's how developers write repeated HTML. You'll do exactly this in step 10."

**Ask:** "Where does the new row go: before or after `</table>`?" (Before.)

## 1:01 · Sections and comments (9 min)

Slide *The parts of a page*. Prepares steps 11–12. Click the **show.html (whole page)** tab above the code box.

1. **Say:** "This is the whole file. Your code goes in the middle. Look at the big parts: `header` at the top, `main` for the content, `article` for one show, `footer` at the bottom. These are **semantic** elements: their names describe their meaning. They don't change how it looks, but they help screen readers, search engines and other developers."
2. Click the code box's own tab (the first one) to go back, and wrap your characters list:

   ```html
   <section>
     <h2>Main characters</h2>
     <ul>
       ...
     </ul>
   </section>
   ```

   **Say:** "A `section` groups a heading with the content that belongs to it. Nothing changes on screen. That's normal."
3. Add a comment above it: `<!-- Characters: one li each -->`. **Say:** "A **comment** is a note for humans. The browser skips it."
4. **Mistake on purpose:** write `<!-- hide this` without `-->`. Everything below disappears. **Say:** "A comment that never closes swallows the rest of the page." Close it.

**Ask:** "I wrapped my list in a `section`. What changed on the screen?" (Nothing. It changes the meaning, not the look.)

## 1:10 · The big idea, and questions (5 min)

Show the statement slide. **Say:** "Today is only about what each piece *is*. Tomorrow you decide how it looks." Take questions.

## 1:15 · This afternoon (15 min)

1. Open the overview (`#/day/1`). Read the step list together, top to bottom: 12 steps, from *Your first HTML tag* to *Notes for humans*. **Say:** "Same order as this morning. About two and a half hours of steps, so you have time. Small steps on purpose."
2. **Do step 1 together.** Open step 1, press **Start again** to clear my demo, and ask the class what to type. Type `<h1>Friends</h1>`, watch the preview, press **Check**. Read the green message aloud.
3. **Show where help is**, on step 1:
   - **Hint**: two hints per step; the second one is almost the answer.
   - **Answer**: shows one possible answer. "Try to understand it before you copy it."
   - The **Console**, under the preview: closed today (click its title bar to open it). It matters from Day 4. Today, the message after **Check** is your helper: when it says "Not yet", it tells you exactly what to fix.
   - The numbered buttons at the bottom jump between steps.
4. **Progress:** "Everything saves automatically in this browser. If you change computers, open **Help › Save progress to a file**, and on the other computer **Help › Open a progress file**."
5. **Finished early?** Under the step list are **Extra challenges (if you finish early)**: a spoiler box you click to open, a poster with a caption, and a second show of your choice (B1 to B3 in the bar at the bottom).
6. Introduce the afternoon teacher and point at the slide *Stuck? In this order*.

---

## Handover note for the afternoon teacher

- **Step 10, A table of seasons (~20 min)** takes longest. Typical errors: the new rows pasted after `</table>`, a missing `</tr>`, or a row with two cells. Say: "Copy the whole season 1 row, from `<tr>` to `</tr>`, and paste it just before `</table>`." If the table has vanished, **Start again** brings it back.
- **Step 11, Group it with sections:** students put one big section around everything, or put `</section>` between the heading and its list. Say: "Each section holds one heading and the list under it."
- **Step 5, Add the poster:** `</img>` (it has no closing tag), `scr` instead of `src`, or alt text like "image". Ask: "What does the picture show?"
- **Step 4, Attributes and a class:** the attribute in the closing tag (`</p class="meta">`) or no quotes. Attributes always go in the opening tag, as `name="value"`.
- **Step 12, Notes for humans:** a comment without `-->` hides the rest of the page. Look for the missing `-->`.
- **Step 1:** some students type in the preview instead of the dark code box. Point them at the dark box.
- First question to ask when someone is stuck: "What does the message under Check say?" Then hint 1, hint 2, then the answer.
- Use the **End-of-day check** in `quiz.md` in the last 10 minutes.
