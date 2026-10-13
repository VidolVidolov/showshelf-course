# ShowShelf course · the one to teach from

**Web Dev in 11 Days**, guided version, for people who have never programmed. Everything you need to teach it is in this folder.

Students build **ShowShelf**, a TV-show website with a watchlist ("My List"), in small steps in a practice site called **ShowShelf Lab**.

## What's in this folder

```
showshelf-course-final/
├── README.md                 this file: start here
├── showshelf-lab.html        the practice site for students (double-click it; works offline)
├── index.html                a tiny page that opens showshelf-lab.html (for GitHub Pages)
├── teacher/
│   └── day-01/ … day-11/
│       ├── script.md         your 90-minute morning lecture: timings, what to say, what to type
│       ├── quiz.md           morning recap questions + an end-of-day check for the afternoon teacher
│       ├── slides.pptx       the slides, with speaker notes (present from this)
│       └── slides.pdf        the same slides as a PDF
├── teacher-guide.pdf         for the afternoon teacher: every step's task, an answer, common mistakes
├── teacher-guide/
│   └── day-01-guide.pdf … day-11-guide.pdf   the same, one file per day (print only today's)
├── day-10-demo/
│   ├── showshelf-react/      the real React project you run in the Day 10 morning
│   └── showshelf-api/        the real Express server you run in the Day 10 morning
└── lab-source/               the Lab's source: only needed to change the Lab (see its README)
```

The older, harder version of the course (vanilla JavaScript, then React and Express with installs from Day 7) is in `_archive-full-course` next to this folder. You don't need it to teach this one.

## A day

| When | Who | What |
|---|---|---|
| Morning, 90 min | You | `teacher/day-NN/script.md` + `slides.pptx`. Live demos happen in the Lab on the projector. The last 15 minutes hand over to the afternoon: open the day in the Lab and do step 1 together. |
| Afternoon, 3–4 h | Students, with the other teacher | The day's steps in the Lab. Each step has an explanation, a code box, a live preview, a Check button, two hints and an Answer button. Extra challenges for fast students. |
| End of the afternoon | The other teacher | The end-of-day check in `quiz.md` (3 questions and one thing to look at). |

Give the afternoon teacher that day's `teacher-guide/day-NN-guide.pdf` and the handover note at the bottom of your `script.md`. In the Lab, **Help › Teacher view** shows the answer and the common mistakes on every step.

## The 11 days

| Day | Topic | Students build |
|---|---|---|
| 1 | HTML | A page about one show (Friends) |
| 2 | CSS | The page styled as a card, in their own colours |
| 3 | Layout: Flexbox, Grid, phones | The home page with a grid of shows |
| 4 | First JavaScript | JavaScript fills in a show's facts and watch time |
| 5 | Functions and decisions | Functions that fill in four show cards |
| 6 | Arrays, objects, loops | Functions that pick shows from a list of twelve |
| 7 | The DOM and events | Cards built by JavaScript, live search, My List that survives a reload |
| 8 | fetch and APIs | Real shows from TVmaze, with loading and error messages |
| 9 | The show page | A page per show (cast, seasons) and a My List page |
| 10 | How real apps are built | A taste of React and of an Express server, inside the Lab |
| 11 | Make it yours and publish | Their own site online, and a 2-minute demo |

## How students get the Lab

Either one works:

- **As a file:** give them `showshelf-lab.html` (shared drive, USB stick or the class chat). They double-click it. It works without internet.
- **As a website, with GitHub Pages:** push this folder to a GitHub repository (see below), then **Settings › Pages**, Source **Deploy from a branch**, **main**, **/ (root)**, **Save**. After a minute or two the Lab is at `https://YOUR-USERNAME.github.io/REPO-NAME/`.

## This folder on GitHub

This folder is a ready git repository. From a terminal in this folder:

```bash
git add .
git commit -m "ShowShelf course"
git remote add origin https://github.com/YOUR-USERNAME/REPO-NAME.git
git push -u origin main
```

Free GitHub Pages needs a **public** repository, and then everything in it is public, including the scripts and the answer guides. (The Lab's Answer button already shows students the answers.) To keep the teacher material private, use a private repository for this folder and a separate public one with only `showshelf-lab.html` for Pages.

## How the Lab works (what you need to know)

- **The code box is VS Code's editor** (Monaco): suggestions while typing, red wavy lines for mistakes, the usual VS Code shortcuts. Phones and tablets get a simpler editor; anyone can switch to it in Help.
- **Progress saves automatically** in the student's browser (`localStorage`). It does not follow them to another computer or browser: **Help › Save progress to a file**, then **Open a progress file** on the other computer. Students sharing one computer and browser profile see each other's code.
- **Their Day 2 colours follow them** into every later day.
- **Offline is fine.** Days 8–11 use the real TVmaze website when there's internet, and saved sample data when there isn't.
- **Day 10 needs no installs for students:** React and the server run inside the Lab. Your morning demo uses the real projects in `day-10-demo/` (see the Day 10 script).
- **Day 11:** students download their site as one `index.html` and put it online with Netlify Drop or GitHub Pages (a free account is needed). A student without an account can demo the downloaded file.

## Before Day 1

- [ ] Open `showshelf-lab.html` on a classroom computer in the browser students will use, and click through a few steps.
- [ ] With internet on, open Day 8, step 2, and check that real TVmaze shows appear (the Console says so if it falls back to sample data).
- [ ] Decide how students get the Lab: the file, or your GitHub Pages address.
- [ ] Brief the afternoon teacher: show them the Lab, Teacher view, and the day guides. Ten minutes is enough.
- [ ] For Day 10's morning demo: install Node.js 20.19 or newer and run `npm install` in both `day-10-demo` projects the day before (commands in the Day 10 script).
- [ ] For Day 11: make a free Netlify account and try Netlify Drop once with any `index.html`.
