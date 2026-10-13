import sys, random
from pathlib import Path
from playwright.sync_api import sync_playwright
from PIL import Image
LAB = Path("dist/showshelf-lab.html").resolve(); OUT = Path("test/shots/review"); OUT.mkdir(parents=True, exist_ok=True)
with sync_playwright() as p:
    b = p.chromium.launch(); pg = b.new_page(viewport={"width": 1280, "height": 800})
    errs=[]; pg.on("pageerror", lambda e: errs.append(str(e))); pg.on("dialog", lambda d: d.accept())
    pg.goto(LAB.as_uri()); pg.evaluate("Lab.test.reset()"); pg.evaluate("Lab.forceOffline=true")
    days = pg.evaluate("Lab.DAYS.map(d=>({n:d.n, ids:d.core.map(s=>s.id)}))")
    for d in days:
        pg.evaluate(f"location.hash='#/day/{d['n']}'"); pg.wait_for_timeout(900)
        pg.screenshot(path=str(OUT/f"day{d['n']:02d}-overview.png"))
        sid = d["ids"][len(d["ids"])*2//3]
        pg.evaluate("(id)=>{const s=Lab.STEPS[id]; const ids=Lab.DAYS.filter(x=>x.n<s.day.n).flatMap(x=>x.core.map(y=>y.id)).concat(s.day.steps.slice(0,s.index).filter(x=>!x.bonus).map(x=>x.id)); Lab.test.setDone(ids,true)}", sid)
        pg.evaluate("(id)=>{location.hash='#/step/'+id}", sid); pg.wait_for_timeout(700)
        pg.evaluate("(id)=>Lab.test.setCode(Lab.test.solution(id))", sid); pg.wait_for_timeout(300)
        pg.click("#check"); pg.wait_for_timeout(2500)
        pg.screenshot(path=str(OUT/f"day{d['n']:02d}-step.png"))
    print("errors:", errs)
    b.close()
for kind in ["overview","step"]:
    ims=[Image.open(OUT/f"day{n:02d}-{kind}.png").resize((640,400)) for n in range(1,12)]
    sheet=Image.new("RGB",(640*3+20,400*4+30),"#666")
    for i,im in enumerate(ims): sheet.paste(im,((i%3)*650,(i//3)*410))
    sheet.save(OUT/f"sheet-{kind}.png")
