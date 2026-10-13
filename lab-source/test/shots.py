import sys
from pathlib import Path
from playwright.sync_api import sync_playwright
LAB = (Path(__file__).parent.parent / "dist" / "showshelf-lab.html").resolve()
OUT = Path(__file__).parent / "shots"; OUT.mkdir(exist_ok=True)
W = int(sys.argv[1]) if len(sys.argv) > 1 else 1440
with sync_playwright() as p:
    b = p.chromium.launch(); pg = b.new_page(viewport={"width": W, "height": 860})
    errs=[]; pg.on("pageerror", lambda e: errs.append(str(e))); pg.on("dialog", lambda d: d.accept())
    pg.goto(LAB.as_uri()); pg.evaluate("Lab.test.reset()"); pg.evaluate("location.hash='#/'"); pg.wait_for_timeout(300)
    pg.screenshot(path=str(OUT/f"home-{W}.png"))
    pg.evaluate("location.hash='#/day/1'"); pg.wait_for_timeout(600); pg.screenshot(path=str(OUT/f"day1-{W}.png"))
    pg.evaluate("Lab.test.setDone(['d1-heading','d1-paragraph','d1-emphasis','d1-meta'], true)")
    pg.evaluate("location.hash='#/step/d1-poster'"); pg.wait_for_timeout(500)
    pg.evaluate("Lab.test.setCode(Lab.test.starter('d1-poster') + '\\n<img src=\"posterr.svg\">')"); pg.wait_for_timeout(700)
    pg.click("#check"); pg.wait_for_timeout(700); pg.click("#hintBtn"); pg.wait_for_timeout(300)
    pg.screenshot(path=str(OUT/f"step-fail-{W}.png"))
    pg.evaluate("Lab.test.setCode(Lab.test.solution('d1-poster'))"); pg.wait_for_timeout(600)
    pg.click("#check"); pg.wait_for_timeout(700); pg.screenshot(path=str(OUT/f"step-pass-{W}.png"))
    pg.click(".tab:nth-child(2)"); pg.wait_for_timeout(300); pg.screenshot(path=str(OUT/f"step-ref-{W}.png"))
    print("errors:", errs)
    b.close()
