#!/usr/bin/env python3
"""Build ShowShelf Lab into one offline HTML file.

Lessons live in lessons/dayNN.lesson, a plain-text format (no escaping needed):

    === day
    n: 1
    title: Your first web page
    slot: article | html | show.html · inside <article>      (name | language | tab label)
    file: style.css = css                                       (the page's style.css is the css code box)
    refs: @page, base.css                                       (read-only tabs)
    --- intro
    Markdown...
    --- template
    <!doctype html>...{{slot:article}}...
    --- file base.css
    fixed file content
    --- default article
    starting content of a code box

    === step heading
    title: Your first HTML tag
    minutes: 10
    slot: article
    bonus: yes            provides: theme       wait: 300      console: open
    --- explain / --- task / --- hint (repeat) / --- learned / --- summary / --- teacher
    --- mistakes          (a Markdown list)
    --- starter           (fixed starting code)   or   --- starter-append  (added after the previous step's code)
    --- solution
    --- check             (JavaScript: the body of async function (t) { ... })

Section headers are lines starting with '=== ' or '--- ' at the very start of the line.
"""
import json, re, sys, subprocess
from pathlib import Path

ROOT = Path(__file__).parent
SRC = ROOT / "src"
LESSONS = ROOT / "lessons"
DIST = ROOT / "dist"


class LessonError(Exception):
    pass


def parse(path):
    text = path.read_text(encoding="utf-8")
    blocks, cur, sec = [], None, None
    for no, line in enumerate(text.split("\n"), 1):
        if line.startswith("=== "):
            kind = line[4:].strip().split()
            cur = {"kind": kind[0], "key": kind[1] if len(kind) > 1 else None, "fields": [], "sections": [], "line": no}
            blocks.append(cur)
            sec = None
        elif line.startswith("--- "):
            if cur is None:
                raise LessonError(f"{path.name}:{no}: section before any === block")
            sec = [line[4:].strip(), []]
            cur["sections"].append(sec)
        elif cur is None:
            continue
        elif sec is None:
            if line.strip():
                if ":" not in line:
                    raise LessonError(f"{path.name}:{no}: expected 'field: value', got {line!r}")
                k, v = line.split(":", 1)
                cur["fields"].append((k.strip(), v.strip()))
        else:
            sec[1].append(line)
    return blocks


def body(lines):
    s = "\n".join(lines)
    return re.sub(r"^\s*\n", "", s, count=1).rstrip()


def md_list(s):
    items, cur = [], None
    for line in s.split("\n"):
        if re.match(r"^\s*-\s+", line):
            if cur is not None:
                items.append(cur)
            cur = re.sub(r"^\s*-\s+", "", line)
        elif line.strip() and cur is not None:
            cur += " " + line.strip()
    if cur is not None:
        items.append(cur)
    return items


def build_day(path):
    blocks = parse(path)
    if not blocks or blocks[0]["kind"] != "day":
        raise LessonError(f"{path.name}: must start with '=== day'")
    d = blocks[0]
    day = {"slots": {}, "files": {}, "refs": [], "steps": []}
    for k, v in d["fields"]:
        if k == "n":
            day["n"] = int(v)
        elif k == "slot":
            parts = [p.strip() for p in v.split("|")]
            day["slots"][parts[0]] = {"lang": parts[1] if len(parts) > 1 else "html", "label": parts[2] if len(parts) > 2 else None, "default": ""}
        elif k == "file":
            name, slot = [p.strip() for p in v.split("=")]
            day["files"][name] = {"slot": slot}
        elif k == "refs":
            day["refs"] = [r.strip() for r in v.split(",") if r.strip()]
        else:
            day[k] = v
    for name, lines in d["sections"]:
        if name == "intro":
            day["intro"] = body(lines)
        elif name == "template":
            day["template"] = body(lines)
        elif name.startswith("template "):
            day.setdefault("templates", {})[name[9:].strip()] = body(lines)
        elif name.startswith("file "):
            day["files"][name[5:].strip()] = {"content": body(lines)}
        elif name.startswith("default "):
            slot = name[8:].strip()
            if slot not in day["slots"]:
                raise LessonError(f"{path.name}: default for unknown slot {slot}")
            day["slots"][slot]["default"] = body(lines)
        else:
            raise LessonError(f"{path.name}: unknown day section '{name}'")
    for f in day["files"].values():
        if "slot" in f and f["slot"] not in day["slots"]:
            raise LessonError(f"{path.name}: file maps to unknown slot {f['slot']}")

    checks = []
    keys = set()
    for b in blocks[1:]:
        if b["kind"] != "step":
            raise LessonError(f"{path.name}:{b['line']}: unknown block '{b['kind']}'")
        key = b["key"]
        if not key or not re.fullmatch(r"[a-z0-9-]+", key):
            raise LessonError(f"{path.name}:{b['line']}: step key must be lowercase letters, digits and dashes")
        if key in keys:
            raise LessonError(f"{path.name}: duplicate step key {key}")
        keys.add(key)
        s = {"key": key}
        for k, v in b["fields"]:
            if k in ("minutes", "wait"):
                s[k] = int(v)
            elif k in ("bonus", "practice"):
                s[k] = v.lower() in ("yes", "true", "1")
            elif k == "refs":
                s[k] = [r.strip() for r in v.split(",") if r.strip()]
            else:
                s[k] = v
        hints, check = [], None
        for name, lines in b["sections"]:
            t = body(lines)
            if name == "hint":
                hints.append(t)
            elif name == "mistakes":
                s["mistakes"] = md_list(t)
            elif name == "check":
                check = t
            elif name in ("explain", "task", "learned", "summary", "teacher", "starter", "solution"):
                s[name] = t
            elif name == "starter-append":
                s["starterAppend"] = t
            elif name == "solution-append":
                s["solutionAppend"] = t
            elif name == "solution-replace":
                if "\n=>\n" not in "\n" + t + "\n":
                    raise LessonError(f"{path.name}: step {key}: solution-replace needs a line with only => between the old and the new text")
                old, new = re.split(r"\n=>\n", "\n" + t + "\n", 1)
                s.setdefault("solutionReplace", []).append((old.strip("\n"), new.strip("\n")))
            else:
                raise LessonError(f"{path.name}: step {key}: unknown section '{name}'")
        s["hints"] = hints
        for need in ("title", "slot"):
            if need not in s:
                raise LessonError(f"{path.name}: step {key} has no {need}")
        if "solutionAppend" in s or "solutionReplace" in s:
            base = None
            steps = day["steps"]
            for prev in reversed(steps):
                if prev["slot"] == s["slot"] and not prev.get("bonus"):
                    base = prev["solution"]
                    break
            if base is None:
                base = day["slots"][s["slot"]]["default"]
            sol = base
            for old, new in s.pop("solutionReplace", []):
                if old not in sol:
                    raise LessonError(f"{path.name}: step {key}: solution-replace text not found:\n{old}")
                sol = sol.replace(old, new, 1)
            if "solutionAppend" in s:
                sol = sol.rstrip() + ("\n\n" if sol.strip() else "") + s.pop("solutionAppend")
            s["solution"] = sol
        for need in ("explain", "task", "solution"):
            if need not in s:
                raise LessonError(f"{path.name}: step {key} has no --- {need}")
        if check is None:
            raise LessonError(f"{path.name}: step {key} has no --- check")
        if s["slot"] not in day["slots"]:
            raise LessonError(f"{path.name}: step {key} uses unknown slot {s['slot']}")
        if "template" in s and s["template"] not in day.get("templates", {}):
            raise LessonError(f"{path.name}: step {key} uses unknown template {s['template']}")
        if s.get("practice") and "starter" not in s:
            raise LessonError(f"{path.name}: practice step {key} needs a fixed --- starter (practice exercises start fresh)")
        checks.append(check)
        day["steps"].append(s)

    # emit JavaScript: JSON for data, real functions for checks and appended starters
    out = [f"/* generated from {path.name}; edit the .lesson file, not this */", "(function () {", f"var day = {json.dumps(day, ensure_ascii=False, indent=1)};"]
    for i, (s, chk) in enumerate(zip(day["steps"], checks)):
        indented = "\n".join("    " + l if l.strip() else l for l in chk.split("\n"))
        out.append(f"day.steps[{i}].check = async function (t) {{\n{indented}\n}};")
        if "starterAppend" in s:
            out.append(f"day.steps[{i}].starter = function (prev) {{ var add = day.steps[{i}].starterAppend; return prev.indexOf(add.trim().split('\\n')[0]) >= 0 ? prev : (prev.replace(/\\s+$/, '') + (prev.trim() ? '\\n\\n' : '') + add + '\\n'); }};")
    out.append("Lab.addDay(day);")
    out.append("})();")
    js = "\n".join(out).replace("</script", "<\\/script")
    return day, js


def main():
    import argparse
    ap = argparse.ArgumentParser()
    ap.add_argument("--days", help="only these days, e.g. 2,7,8 (default: all)")
    ap.add_argument("--out", help="output file (default: dist/showshelf-lab.html)")
    ap.add_argument("--extra", nargs="*", default=[], help="extra .lesson files (tests)")
    ap.add_argument("--artifact", help="also write a version for publishing as a claude.ai artifact (no html/head/body tags)")
    args = ap.parse_args()
    only = {int(x) for x in args.days.split(",")} if args.days else None
    DIST.mkdir(exist_ok=True)
    day_js = []
    files = sorted(LESSONS.glob("day*.lesson")) + [Path(x) for x in args.extra]
    if only:
        files = [p for p in files if p in [Path(x) for x in args.extra] or int(re.sub(r"\D", "", p.stem) or 0) in only]
    for p in files:
        day, js = build_day(p)
        day_js.append(js)
        print(f"{p.name}: day {day['n']}, {len(day['steps'])} steps")
    shell = (SRC / "shell.html").read_text(encoding="utf-8")
    assets = "/* generated: files the preview pages can include with {{asset:name}} */\n"
    for name, fname in (("react", "react.min.js"), ("expressLite", "express-lite.js"), ("appCss", "app.css"), ("gymJs", "gym.js")):
        js_str = json.dumps((SRC / fname).read_text(encoding="utf-8")).replace("</", "<\\/")
        assets += f"Lab.assets.{name} = {js_str};\n"
    scripts = [(SRC / f).read_text(encoding="utf-8") for f in ("lab.js", "data.js", "tvmaze-mock.js", "jsx.js")] + [assets] + day_js
    monaco = SRC / "vendor" / "monaco.js"   # the VS Code editor; made by tools/build-monaco.js (optional)
    if monaco.exists():
        scripts.insert(0, monaco.read_text(encoding="utf-8"))
    else:
        print("note: src/vendor/monaco.js not found, building with the simple editor only")
    for i, s in enumerate(scripts):
        if "</script" in s.replace("<\\/script", ""):
            raise LessonError(f"script {i} contains a raw </script")
    html = shell.replace("/*CSS*/", (SRC / "lab.css").read_text(encoding="utf-8"))
    html = html.replace("<!--SCRIPTS-->", "\n".join(f"<script>\n{s}\n</script>" for s in scripts))
    out = Path(args.out) if args.out else DIST / "showshelf-lab.html"
    out.write_text(html, encoding="utf-8")
    if args.artifact:
        body = html[html.index("<body>") + 6: html.rindex("</body>")]
        style = html[html.index("<style>"): html.index("</style>") + 8]
        Path(args.artifact).write_text("<title>ShowShelf Lab</title>\n" + style + "\n" + body, encoding="utf-8")
        print(f"artifact version: {args.artifact}")
    # syntax check every script (needs Node.js; skipped when it isn't installed)
    import shutil
    if shutil.which("node"):
        for i, s in enumerate(scripts):
            tmp = out.parent / f".check-{out.stem}-{i}.js"
            tmp.write_text(s, encoding="utf-8")
            r = subprocess.run(["node", "--check", str(tmp)], capture_output=True, text=True)
            tmp.unlink()
            if r.returncode:
                raise LessonError(f"syntax error in script {i}:\n{r.stderr}")
    else:
        print("note: Node.js not found, skipping the JavaScript syntax check")
    print(f"built {out} ({out.stat().st_size // 1024} KB)")


if __name__ == "__main__":
    try:
        main()
    except LessonError as e:
        print("ERROR:", e)
        sys.exit(1)
