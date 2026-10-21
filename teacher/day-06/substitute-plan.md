# Day 6 · Plan for the substitute teacher

**Today:** *Lists of shows* (arrays, objects, loops). The lead teacher is away and there is **no lecture**. Students learn everything from the Lab: every step explains the idea, gives a task, two hints and an Answer button. You don't need to know JavaScript. Your job is to keep the day moving, help people get unstuck in the order below, and take notes for the lead.

**Bring:** this sheet, `quiz.md` (in this folder) and the printed guide `teacher-guide/day-06-guide.pdf`. The guide lists every step and every practice exercise with its task, a correct answer and the usual mistakes.

## Timetable (about 5 hours of work)

| When | What |
|---|---|
| 0:00–0:15 | **Start.** Everyone opens ShowShelf Lab and goes to Day 6 (add `#/day/6` to the end of the address, or click Day 6). Ask the five **Opening recap** questions in `quiz.md` one at a time: wait, let someone answer, then read the answer aloud. Say: "Today there's no lecture. The Lab explains each idea. Read the explanation, do the task, press Check." |
| 0:15–2:45 | **Steps 1–10** (about 2 h 45 on paper; most groups are faster). Take a 10-minute break around the middle. Walk around; help in the order below. |
| Lunch | |
| After lunch, about 2 h | **Practice P1–P32** in the practice gym (about 5 hours on paper, so there is enough for the whole afternoon; nobody is expected to finish all 32). Students who finish step 10 before lunch start the practice straight away. Anyone still on steps 9–10 finishes those first. Pair students up (see below). |
| Only for the very fastest | **Extra challenges B1–B3** (*Best first*, *Count the genres*, *Watch everything*), at the end of the step list, after P32. |
| Last 15 min | **End-of-day check** in `quiz.md`: three questions and one thing to look at on their screens. |

Steps 1–10 build the page; P1–P32 are short, separate exercises (one function each), from very easy to harder. P28–P32 are marked "(harder)". A student can skip a practice exercise and come back later. The page goes green row by row as their function gives the right answers.

## How to help (without knowing JavaScript)

In the Lab, open **Help › Teacher view**. Every step then shows the answer and the common mistakes, also on your own screen.

1. **Read the message.** After Check, the orange "Not yet" box says exactly what to fix. Ask the student to read it aloud.
2. **Console.** A red line under the preview names the problem and the line number. Read it together.
3. **Hint.** Press **Hint** (two per step). The second one is almost the answer.
4. **Answer.** If they are still stuck after both hints, press **Answer**, compare it with their code line by line, and ask them to type the difference themselves.
5. **Ask.** Still stuck? Find the step in the guide PDF, check the "Common mistakes", or ask a fast student to explain. Note it for the lead.

Useful sentences: "What does the message say?", "Which line is red?", "Read your line aloud, word by word.", "Press Start again if the code is a mess."

## Where students usually get stuck, and what to say

| Where | What goes wrong | What to say |
|---|---|---|
| Step 3, *The twelve shows* | `shows[12]` for the last show | "Counting starts at 0. Twelve shows means 0 to 11: `shows.length - 1`." |
| Step 5, *Keep only the best* (20 min) | `push` outside the `if`; empty list inside the loop | "Look at the indentation. Is the push inside the if's curly brackets?" The answer is 5 shows. |
| Step 6, *filter* (20 min) | no `return`; `shows` instead of `list` | "Inside the function, use the parameter `list`, never `shows`." |
| Step 8, *find* | `=` instead of `===` | "One `=` changes, three `===` ask." |
| Step 9, *Search* (20 min) | only one side lower case | "Make both the search word and the show name lower case." |
| Step 10, *Browse by genre* | `show.genre` without the s | "Open data.js: the key is `genres`." |
| P1–P3 | `shows` instead of `list`; `list[list.length]` | Same as steps 3 and 6. |
| P4 | quotes instead of backticks | "Backticks (the key left of 1), so `${...}` is filled in." |
| P8 | `<=` instead of `<` | "Before 2005 means 2005 doesn't count." |
| P10–P12 (counter and total) | `const` instead of `let`; counter created inside the loop; `return` inside the loop | "The number changes, so `let`. Create it before the loop, return it after the last `}`." |
| P12 | no rounding, or `NaN` for the empty list | The message gives the exact fix: `Math.round(x * 10) / 10`, and `if (list.length === 0) return 0`. |
| P14–P16 | "best so far" and counting per network are new ideas | Let them read the explanation twice and use both hints. |
| P20 | crash "Cannot read properties of undefined" for a name that isn't there | "`find` found nothing. Check `if (found === undefined)` before reading `.rating`." |
| P21 | every item is `undefined`, or a red error about `:` | "An object after the arrow needs round brackets: `({ ... })`." |
| P23–P24 | `&&` is new; `from <= x <= to` written like maths keeps every show | "Each side of `&&` is a full comparison: `from <= show.premiered && show.premiered <= to`." |
| P25 | an `else` that sets the flag back to `true` | "Once it's false, it stays false. Remove the `else`." |
| P26–P27 | `<=` instead of `<`, so the wrong show wins a tie | "On a tie, the first one should stay: use `<`." |
| P28–P32 (harder) | a loop through ids with `find` (P28), a loop inside a loop (P29), filter then best so far (P30), an object of counters (P31), an object of lists (P32) | Read the explanation together, then both hints. It's fine if only a few students get here. |

## Pairing after lunch

At the start of the afternoon, look at who is where (the coloured dots at the bottom of the screen show finished steps). Pair each fast student (already in the practice exercises) with a student who is still stuck. The fast student explains, but **the stuck student types**. Swap pairs after an hour if it isn't working.

## Before you leave: notes for the lead teacher

Write a few lines (paper or a message) with:

- Who struggled (names) and where they stopped: the last step or exercise number.
- Which steps or exercises were hard for many students, and what the common problem was.
- Who finished early and how far they got (which P number? extra challenges?).
- Answers to the end-of-day check that showed a misunderstanding.
- Anything broken or confusing in the Lab (a message that didn't help, a crash).
- Remind students: progress saves in this browser. Changing computers? **Help › Save progress to a file**.
