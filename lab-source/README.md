# ShowShelf Lab: source

The source of `../showshelf-lab.html`. You only need this folder to **change** the Lab (fix a lesson, add a step). To teach, use the finished file one folder up.

## Rebuild the Lab

Needs Python 3. Node.js is optional (it adds a syntax check).

```bash
cd lab-source
python3 build.py                       # writes dist/showshelf-lab.html
cp dist/showshelf-lab.html ../showshelf-lab.html
```

## What's where

| Path | What |
|---|---|
| `lessons/day01.lesson` … `day11.lesson` | The lessons: every step's explanation, task, hints, answer and check. Plain text; the format is described at the top of `build.py` and in `AUTHORING.md`. |
| `src/lab.js`, `src/lab.css`, `src/shell.html` | The Lab itself: screens, preview, checks, editor |
| `src/app.css` | The ShowShelf stylesheet used by the pages students build (Days 3–11) |
| `src/data.js`, `src/tvmaze-mock.js` | The 12 sample shows and the offline TVmaze answers |
| `src/jsx.js`, `src/express-lite.js`, `src/react.min.js` | JSX, the pretend Express server and React 19, for Day 10 |
| `src/vendor/monaco.js` | The VS Code editor (Monaco 0.52.2, MIT licence in `monaco-LICENSE.txt`), made by `tools/build-monaco.js` |
| `test/run.py` | Checks every step: its starting code must fail the Check, its answer must pass |
| `test/guide_pdf.py` | Makes the afternoon teacher's guide PDFs |
| `AUTHORING.md` | How to write or change a day |

## Test after a change

Needs `pip install playwright` and `playwright install chromium`.

```bash
python3 build.py
python3 test/run.py            # every step; or e.g. python3 test/run.py d3-  for Day 3 only
python3 test/guide_pdf.py      # new guide PDFs in dist/teacher-guide/, copy them to ../teacher-guide/
```
