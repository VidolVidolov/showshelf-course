"""Automated check of every Lab step:
   - the step's starter code must NOT pass (otherwise the step teaches nothing)
   - the step's solution MUST pass
   - no JavaScript errors in the Lab page itself
Usage: python3 test/run.py [step-id-prefix ...]   e.g.  d1-  d2-theme
"""
import sys, json
from pathlib import Path
from playwright.sync_api import sync_playwright

args = sys.argv[1:]
LAB = (Path(__file__).parent.parent / "dist" / "showshelf-lab.html").resolve()
if args and args[0] == "--lab":
    LAB = Path(args[1]).resolve()
    args = args[2:]
THEME = None
if args and args[0] == "--theme":   # pretend the student chose their own Day 2 colours
    THEME = ":root {\n  --color-accent: #c2185b;\n  --color-bg: #eef7f2;\n}"
    args = args[1:]
prefixes = args
SHOTS = Path(__file__).parent / "shots"
SHOTS.mkdir(exist_ok=True)

fails, page_errors, student_logs = [], [], []
with sync_playwright() as p:
    b = p.chromium.launch()
    ctx = b.new_context(viewport={"width": 1440, "height": 900})
    pg = ctx.new_page()
    pg.on("pageerror", lambda e: page_errors.append(str(e)))
    pg.on("dialog", lambda d: d.accept())
    pg.goto(LAB.as_uri())
    pg.evaluate("Lab.forceOffline = true")
    ids = pg.evaluate("Lab.test.ids()")
    if prefixes:
        ids = [i for i in ids if any(i.startswith(x) for x in prefixes)]
    for sid in ids:
        pg.evaluate("Lab.test.reset()")
        # every earlier step on the day is done with its solution (like a student who kept up)
        pg.evaluate("""(id) => { const s = Lab.STEPS[id]; const before = s.day.steps.slice(0, s.index).filter(x => !x.bonus || x === s).map(x => x.id);
                       const earlier = Lab.DAYS.filter(d => d.n < s.day.n).flatMap(d => d.steps.filter(x => !x.bonus).map(x => x.id));
                       Lab.test.setDone(earlier.concat(before), true); }""", sid)
        if THEME:
            pg.evaluate("""(th) => { const s = Lab.STEPS['d2-theme']; if (!s) return; const code = s.solution.replace(/:root\\s*\\{[^}]*\\}/, th); Lab.test.setDone(['d2-theme'], false); const st = JSON.parse(localStorage.getItem('showshelf-lab-v1')); st.code['d2-theme'] = code; localStorage.setItem('showshelf-lab-v1', JSON.stringify(st)); }""", THEME)
            pg.evaluate("location.reload()"); pg.wait_for_function("window.Lab && Lab.test")
            pg.evaluate("Lab.forceOffline = true")
        pg.evaluate("(id) => { location.hash = '#/'; location.hash = '#/step/' + id; }", sid)
        pg.wait_for_selector("#code", state="attached")
        pg.wait_for_timeout(150)
        starter = pg.evaluate("(id) => Lab.test.starter(id)", sid)
        pg.evaluate("(c) => Lab.test.setCode(c)", starter)
        r1 = pg.evaluate("Lab.test.check()")
        sol = pg.evaluate("(id) => Lab.test.solution(id)", sid)
        pg.evaluate("(c) => Lab.test.setCode(c)", sol)
        student_logs.extend(l["text"] for l in pg.evaluate("Lab.test.logs()"))
        r2 = pg.evaluate("Lab.test.check()")
        student_logs.extend(l["text"] for l in pg.evaluate("Lab.test.logs()"))
        ok = (not r1["ok"]) and r2["ok"]
        status = "ok  " if ok else "FAIL"
        print(f"{status} {sid:24} starter: {('passes!' if r1['ok'] else 'fails: ' + r1['msg'][:70])!s:80} solution: {'passes' if r2['ok'] else 'FAILS: ' + r2['msg']}")
        if not ok:
            fails.append(sid)
            pg.screenshot(path=str(SHOTS / f"fail-{sid}.png"))
    b.close()

print()
print(f"{len(ids) - len(fails)}/{len(ids)} steps ok")
page_errors = [e for e in page_errors if not any(e.split(": ")[-1][:40] in l for l in student_logs)]
if page_errors:
    print("PAGE ERRORS:", *page_errors, sep="\n  ")
sys.exit(1 if fails or page_errors else 0)
