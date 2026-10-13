from pathlib import Path
from playwright.sync_api import sync_playwright
LAB = Path(__file__).resolve().parent.parent / "dist" / "showshelf-lab.html"
OUT = LAB.parent / "teacher-guide"; OUT.mkdir(exist_ok=True)
M = {"top": "14mm", "bottom": "14mm", "left": "12mm", "right": "12mm"}
with sync_playwright() as p:
    b = p.chromium.launch(); pg = b.new_page(viewport={"width": 1280, "height": 900})
    pg.goto(LAB.as_uri()); pg.emulate_media(media="print")
    days = pg.evaluate("Lab.DAYS.map(d => d.n)")
    for n in days:
        pg.evaluate(f"location.hash = '#/guide/{n}'"); pg.wait_for_timeout(400)
        pg.pdf(path=str(OUT / f"day-{n:02d}-guide.pdf"), format="A4", print_background=True, margin=M)
    pg.evaluate("location.hash = '#/guide'"); pg.wait_for_timeout(800)
    pg.pdf(path=str(LAB.parent / "teacher-guide.pdf"), format="A4", print_background=True, margin=M)
    b.close()
print("ok", len(days))
