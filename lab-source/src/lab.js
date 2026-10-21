/* =========================================================
   ShowShelf Lab: engine
   Lessons register themselves with Lab.addDay({...}) in the
   days/*.js files. This file draws the screens, runs the
   preview, and checks the student's code.
   ========================================================= */
(function () {
  "use strict";

  const STORE_KEY = "showshelf-lab-v1";
  const DAYS = [];
  const STEPS = {}; // id -> step
  const Lab = (window.Lab = { addDay, data: {}, assets: {}, mock: null, server: null, DAYS, STEPS });

  // ---------- storage (never trusted to exist) ----------
  function fresh() { return { v: 1, code: {}, done: {}, at: null, teacher: false, hints: {} }; }
  function load() {
    try {
      const s = JSON.parse(localStorage.getItem(STORE_KEY));
      if (s && s.v === 1) return Object.assign(fresh(), s);
    } catch (e) { /* private window, blocked storage */ }
    return fresh();
  }
  let state = load();
  let saveTimer = null;
  function save(now) {
    clearTimeout(saveTimer);
    const write = () => { try { localStorage.setItem(STORE_KEY, JSON.stringify(state)); } catch (e) { /* ignore */ } };
    if (now) write(); else saveTimer = setTimeout(write, 300);
  }

  // ---------- helpers ----------
  const $ = (sel, root = document) => root.querySelector(sel);
  const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  const ICON = {
    check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>',
    info: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><circle cx="12" cy="12" r="10"/><path d="M12 8h.01M11 12h1v5h1"/></svg>',
    ext: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5"/></svg>',
    reload: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 11a8 8 0 1 0-2.3 5.7M20 4v7h-7"/></svg>',
    left: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6"/></svg>',
    right: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"/></svg>',
    help: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="10"/><path d="M9.1 9a3 3 0 0 1 5.8 1c0 2-3 2.5-3 4.5M12 17.5h.01"/></svg>',
  };
  // an in-page "Are you sure?" box (browser confirm() pop-ups are blocked on some hosts)
  function ask(message, okLabel) {
    return new Promise((resolve) => {
      const d = $("#ask");
      d.innerHTML = `<div class="dlg-body"><p style="margin:0 0 16px;font-size:15px">${esc(message)}</p>
        <div class="row" style="justify-content:flex-end"><button class="btn" id="askNo">Cancel</button><button class="btn primary" id="askYes">${esc(okLabel || "OK")}</button></div></div>`;
      const done = (v) => { d.close(); resolve(v); };
      $("#askNo").onclick = () => done(false);
      $("#askYes").onclick = () => done(true);
      d.oncancel = () => resolve(false);
      d.showModal();
      $("#askYes").focus();
    });
  }
  Lab.ask = ask;
  function toast(msg) {
    const t = $("#toast");
    t.textContent = msg;
    t.classList.add("show");
    clearTimeout(toast.timer);
    toast.timer = setTimeout(() => t.classList.remove("show"), 3200);
  }

  // ---------- registering days ----------
  function addDay(day) {
    day.steps = day.steps || [];
    let core = 0, bonus = 0, practice = 0;
    day.steps.forEach((s, i) => {
      s.day = day;
      s.index = i;
      s.id = `d${day.n}-${s.key}`;
      s.label = s.bonus ? `B${++bonus}` : s.practice ? `P${++practice}` : String(++core);
      STEPS[s.id] = s;
    });
    day.core = day.steps.filter((s) => !s.bonus && !s.practice);
    day.practiceSteps = day.steps.filter((s) => s.practice);
    day.bonusSteps = day.steps.filter((s) => s.bonus);
    DAYS.push(day);
    DAYS.sort((a, b) => a.n - b.n);
  }
  const dayByN = (n) => DAYS.find((d) => d.n === n);
  const stepName = (s) => (s.bonus ? "Extra " + s.label.slice(1) : s.practice ? "Practice " + s.label.slice(1) : "Step " + s.label);
  const doneCount = (day) => day.core.filter((s) => state.done[s.id]).length;

  // =========================================================
  // Syntax highlighting (small and forgiving on purpose)
  // =========================================================
  const RULES = {
    html: [
      ["com", /<!--[\s\S]*?(?:-->|$)/y],
      ["tag", /<\/?[a-zA-Z][\w-]*|\/?>/y],
      ["str", /"[^"\n]*"?|'[^'\n]*'?/y],
      ["attr", /[a-zA-Z_:][\w:.-]*(?=\s*=)/y],
    ],
    css: [
      ["com", /\/\*[\s\S]*?(?:\*\/|$)/y],
      ["str", /"[^"\n]*"?|'[^'\n]*'?/y],
      ["prop", /--[\w-]+(?=\s*:)|[a-z-]+(?=\s*:(?![a-z-]+\s*[,{(]))(?![^{}]*\{)/y],
      ["num", /#[0-9a-fA-F]{3,8}\b|-?\d*\.?\d+(?:px|rem|em|%|vh|vw|fr|s|ms|deg)?/y],
      ["sel", /[.#]?[a-zA-Z_][\w-]*(?=[^{}:;]*\{)|:[a-z-]+(?=[^{};]*\{)|@[a-z-]+/y],
      ["kw", /!important|\bvar\b|\brepeat\b|\bminmax\b/y],
    ],
    js: [
      ["com", /\/\/[^\n]*|\/\*[\s\S]*?(?:\*\/|$)/y],
      ["str", /`(?:\\[\s\S]|\$\{[^}]*\}|[^`\\])*`?|"(?:\\.|[^"\\\n])*"?|'(?:\\.|[^'\\\n])*'?/y],
      ["kw", /\b(?:const|let|var|function|return|if|else|for|of|in|while|new|async|await|try|catch|throw|true|false|null|undefined|import|export|from|default|typeof|this)\b/y],
      ["num", /\b\d+(?:\.\d+)?\b/y],
      ["fn", /[A-Za-z_$][\w$]*(?=\s*\()/y],
      ["tag", /<\/?[A-Z][\w.]*|<\/?[a-z][\w-]*(?=[\s>\/])|\/>/y],
    ],
  };
  RULES.jsx = RULES.js;
  function highlight(src, lang) {
    const rules = RULES[lang];
    if (!rules) return esc(src);
    let out = "", i = 0, plain = "";
    const flush = () => { if (plain) { out += esc(plain); plain = ""; } };
    while (i < src.length) {
      let hit = null;
      for (const [cls, re] of rules) {
        re.lastIndex = i;
        const m = re.exec(src);
        if (m && m[0].length) { hit = [cls, m[0]]; break; }
      }
      if (hit) {
        flush();
        out += `<span class="tk-${hit[0]}">${esc(hit[1])}</span>`;
        i += hit[1].length;
      } else {
        // move over one "word" of plain text at a time (faster, and keeps identifiers whole)
        const w = /[A-Za-z0-9_$]+|[\s\S]/y;
        w.lastIndex = i;
        const m = w.exec(src);
        plain += m[0];
        i += m[0].length;
      }
    }
    flush();
    return out;
  }

  // =========================================================
  // A tiny Markdown renderer for lesson text
  //   paragraphs, ### headings, - lists, 1. lists, > notes,
  //   ```lang code```, `code`, **bold**, *italic*, [link](url), <kbd>
  // =========================================================
  function inline(s) {
    return s.split(/(`[^`]+`)/).map((part) => {
      if (/^`[^`]+`$/.test(part)) return `<code>${esc(part.slice(1, -1))}</code>`;
      return esc(part)
        .replace(/\*\*([^*]+)\*\*/g, "<b>$1</b>")
        .replace(/(^|[^*\w])\*([^*\s][^*]*?)\*(?!\w)/g, "$1<i>$2</i>")
        .replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>')
        .replace(/&lt;kbd&gt;(.+?)&lt;\/kbd&gt;/g, "<kbd>$1</kbd>");
    }).join("");
  }
  function md(text) {
    if (!text) return "";
    const lines = String(text).replace(/^\n+|\s+$/g, "").split("\n");
    // remove common indentation (lessons are written inside indented template strings)
    const ind = Math.min(...lines.filter((l) => l.trim()).map((l) => l.match(/^ */)[0].length));
    const L = lines.map((l) => l.slice(ind));
    let html = "", i = 0;
    while (i < L.length) {
      const line = L[i];
      if (!line.trim()) { i++; continue; }
      const fence = line.match(/^```(\w*)/);
      if (fence) {
        const buf = [];
        i++;
        while (i < L.length && !/^```/.test(L[i])) buf.push(L[i++]);
        i++;
        html += `<pre><code>${highlight(buf.join("\n"), fence[1] || "")}</code></pre>`;
        continue;
      }
      const h = line.match(/^#{1,3}\s+(.*)/);
      if (h) { html += `<h3>${inline(h[1])}</h3>`; i++; continue; }
      if (/^>\s?/.test(line)) {
        const buf = [];
        while (i < L.length && /^>\s?/.test(L[i])) buf.push(L[i++].replace(/^>\s?/, ""));
        html += `<div class="note">${md(buf.join("\n"))}</div>`;
        continue;
      }
      if (/^(-|\d+\.)\s+/.test(line)) {
        const ordered = /^\d+\./.test(line);
        const items = [];
        while (i < L.length && (/^(-|\d+\.)\s+/.test(L[i]) || (/^\s{2,}\S/.test(L[i]) && items.length))) {
          if (/^(-|\d+\.)\s+/.test(L[i])) items.push(L[i].replace(/^(-|\d+\.)\s+/, ""));
          else items[items.length - 1] += " " + L[i].trim();
          i++;
        }
        const tag = ordered ? "ol" : "ul";
        html += `<${tag}>${items.map((it) => `<li>${inline(it)}</li>`).join("")}</${tag}>`;
        continue;
      }
      const buf = [];
      while (i < L.length && L[i].trim() && !/^(```|#{1,3}\s|>|-\s|\d+\.\s)/.test(L[i])) buf.push(L[i++]);
      html += `<p>${inline(buf.join(" "))}</p>`;
    }
    return html;
  }
  Lab.md = md;
  Lab.highlight = highlight;

  // =========================================================
  // Friendly error messages for beginners
  // =========================================================
  function friendly(msg) {
    const m = String(msg || "");
    let r;
    if ((r = m.match(/(\S+) is not defined/)))
      return `JavaScript doesn't know the name "${r[1]}". Check the spelling (capital letters matter), or whether you created it with const, let or function before using it.`;
    if ((r = m.match(/Cannot read propert(?:y|ies) of (null|undefined)(?: \(reading '([^']+)'\))?/)))
      return r[1] === "null"
        ? `You used ".${r[2] || "something"}" on something that doesn't exist. Usually querySelector found nothing: check the selector, including the # or the dot.`
        : `You used ".${r[2] || "something"}" on something that is undefined. Check that the variable has a value and that the property name is spelled right.`;
    if ((r = m.match(/Cannot set propert(?:y|ies) of (null|undefined)/)))
      return "You tried to change something that doesn't exist. Usually querySelector found nothing: check the selector.";
    if ((r = m.match(/(\S+) is not a function/)))
      return `"${r[1]}" is not a function, so you can't call it with ( ). Check the spelling, or whether it is really a function.`;
    if (/Unexpected end of input/.test(m)) return "Something was opened but never closed: look for a missing } or ) or a quote.";
    if (/missing \) after argument list/.test(m)) return "A ( is missing its closing ). Look at the line mentioned.";
    if (/Unexpected token|Unexpected identifier|Invalid or unexpected token|Unexpected string|Unexpected number/.test(m))
      return "JavaScript couldn't read this line. Often it's a missing or extra comma, bracket or quote. Look at the line mentioned and the line above it.";
    if (/Assignment to constant variable/.test(m)) return "You tried to change a const. Use let if the value needs to change.";
    if (/has already been declared/.test(m)) return "The same name is created twice. Remove one of the const/let lines, or pick another name.";
    if (/await is only valid/.test(m)) return "await only works inside an async function. Add async before function.";
    if (/Failed to fetch|NetworkError/.test(m)) return "The request didn't reach the server. Check the web address, and whether you are online.";
    if (/JSON/.test(m) && /Unexpected/.test(m)) return "The answer wasn't JSON. Check the web address: you might have received an error page instead of data.";
    return "";
  }
  Lab.friendly = friendly;

  // =========================================================
  // Building the preview document
  // =========================================================
  const bridge = (window.__labBridge = {
    run: 0,
    log(run, level, args) {
      if (run !== bridge.run) return;
      const text = args.map(fmt).join(" ");
      current.logs.push({ level, text });
      addConsole(level, text);
    },
    error(run, msg, line) {
      if (run !== bridge.run) return;
      const shown = line ? `${msg}  (line ${line})` : msg;
      current.errors.push(msg);
      current.logs.push({ level: "error", text: shown });
      addConsole("error", shown, friendly(msg));
    },
    toast,
    poster: null,
    fetch(realFetch, url, opts, win) { return labFetch(realFetch, url, opts, win); },
    lineOffset: 0,
  });
  function fmt(v) {
    if (typeof v === "string") return v;
    try {
      if (v && v.nodeType === 1) return "<" + v.tagName.toLowerCase() + (v.id ? "#" + v.id : "") + (v.className ? "." + String(v.className).trim().replace(/\s+/g, ".") : "") + ">";
      if (typeof v === "function") return "function " + (v.name || "(anonymous)");
      if (v === undefined) return "undefined";
      const s = JSON.stringify(v, null, v && typeof v === "object" && JSON.stringify(v).length > 70 ? 2 : 0);
      return s === undefined ? String(v) : s;
    } catch (e) { return String(v); }
  }

  const RUNTIME = `<script>(function(){
var B;try{B=window.parent.__labBridge}catch(e){}if(!B)return;var R=B.run;
["log","info","warn","error"].forEach(function(k){var o=console[k];console[k]=function(){try{B.log(R,k,[].slice.call(arguments))}catch(e){}if(o)o.apply(console,arguments)}});
window.addEventListener("error",function(e){var t=e.target;if(t&&t!==window){if(t.tagName==="IMG"&&B.poster&&/^https?:/i.test(t.getAttribute("src")||"")&&t.src!==B.poster){t.src=B.poster}return}var n=e.lineno?e.lineno-B.lineOffset:0;B.error(R,e.message,n>0?n:0)},true);
window.addEventListener("unhandledrejection",function(e){var r=e.reason;B.error(R,"Uncaught (in promise) "+(r&&r.message?r.message:r),0)});
document.addEventListener("click",function(e){var a=e.target&&e.target.closest&&e.target.closest("a[href]");if(!a||e.defaultPrevented)return;var h=a.getAttribute("href")||"";if(/^https?:/i.test(h)){e.preventDefault();window.parent.open(h,"_blank","noopener")}else if(h.charAt(0)==="#"){e.preventDefault();if(h.length>1){location.hash=h.slice(1)}else{window.scrollTo(0,0)}}else if(h.indexOf("javascript:")!==0){e.preventDefault();B.toast("Links to your other pages don't open inside the Lab. On your real website they will.")}});
window.addEventListener("submit",function(e){if(!e.defaultPrevented){e.preventDefault();B.toast("The form tried to reload the page. The Lab stopped it.")}});
try{var S=window.localStorage;Object.defineProperty(S,"clear",{enumerable:false,configurable:true,value:function(){var ks=[];for(var i=0;i<S.length;i++)ks.push(S.key(i));ks.forEach(function(k){if(k.indexOf("showshelf-lab")!==0)S.removeItem(k)})}})}catch(e){}
var RF=window.fetch&&window.fetch.bind(window);window.fetch=function(u,o){return B.fetch(RF,u,o,window)};
})();<\/script>`;

  function themeCss() {
    // the :root block(s) the student wrote on the day that "provides" the theme
    for (const d of DAYS) {
      const s = d.steps.find((x) => x.provides === "theme");
      if (!s) continue;
      const code = lastCodeFor(d, s.slot, lastCoreIndex(d, s.slot), false);
      const blocks = (code || "").match(/:root\s*\{[^}]*\}/g);
      if (blocks) return blocks.join("\n");
    }
    return "";
  }

  // code of the last step at or before index `upto` on this day that edits `slot`
  function lastCodeFor(day, slot, upto, solutionsOnly) {
    for (let j = upto; j >= 0; j--) {
      const s = day.steps[j];
      if (s.slot !== slot || (s.bonus || s.practice) && j !== upto) continue;
      if (!solutionsOnly && state.code[s.id] != null) return state.code[s.id];
      return s.solution;
    }
    const def = day.slots && day.slots[slot];
    return def ? def.default || "" : "";
  }

  function starterFor(step) {
    if (state.code[step.id] != null) return state.code[step.id];
    return freshStarter(step);
  }
  function freshStarter(step) {
    if (typeof step.starter === "string") return step.starter;
    const prev = lastCodeFor(step.day, step.slot, step.index - 1, false);
    // bonus steps continue from the last core step on the same slot
    const base = step.bonus ? lastCodeFor(step.day, step.slot, lastCoreIndex(step.day, step.slot), false) : prev;
    return typeof step.starter === "function" ? step.starter(base) : base;
  }
  function lastCoreIndex(day, slot) {
    for (let j = day.steps.length - 1; j >= 0; j--) if (!day.steps[j].bonus && !day.steps[j].practice && day.steps[j].slot === slot) return j;
    return -1;
  }

  function templateOf(day, step) {
    const t = step && step.template && day.templates && day.templates[step.template] != null ? day.templates[step.template] : day.template;
    return typeof t === "function" ? t() : t;
  }
  // JSX code boxes are translated to plain JavaScript before they run
  function prepare(day, slot, code) {
    const def = day.slots && day.slots[slot];
    if (!def || def.lang !== "jsx" || !window.LabJSX) return code;
    try {
      return window.LabJSX.transform(code);
    } catch (e) {
      return `(function(){var B=window.parent&&window.parent.__labBridge;if(B)B.error(B.run,${JSON.stringify("SyntaxError: " + e.message.replace(/ \(line \d+\)$/, ""))},${e.line || 0});})();`;
    }
  }
  function buildDoc(step, editorCode, opts = {}) {
    const day = step.day;
    let html = templateOf(day, step);
    html = inlineFiles(day, html);
    html = html.replace(/\{\{asset:(\w+)\}\}/g, (m, n) => Lab.assets[n] || "");
    html = html.replace(/\{\{theme\}\}/g, () => (opts.solutionsOnly ? "" : themeCss()));
    html = html.replace(/\{\{data:(\w+)\}\}/g, (m, n) => JSON.stringify(Lab.data[n] ?? null));
    // other slots of this day
    html = html.replace(/\{\{slot:(\w+)\}\}/g, (m, name) => {
      if (name === step.slot) return m;
      return prepare(day, name, lastCodeFor(day, name, step.index, !!opts.solutionsOnly));
    });
    // the runtime goes first in <head> so it sees every console.log and error
    html = html.replace(/<head>/i, "<head>" + RUNTIME);
    // work out on which line the student's code starts (for error line numbers)
    const marker = `{{slot:${step.slot}}}`;
    const at = html.indexOf(marker);
    bridge.lineOffset = at >= 0 ? html.slice(0, at).split("\n").length - 1 : 0;
    const code = prepare(day, step.slot, editorCode);
    html = html.split(marker).join(code);
    // poster.svg (and images/poster.svg) always works, even offline
    if (Lab.assets.poster) html = html.replace(/(["'(=]\s*)(?:\.\/)?(?:images\/)?poster\.svg/g, "$1" + Lab.assets.poster);
    return html;
  }
  Lab.buildDoc = buildDoc;

  // <link rel="stylesheet" href="style.css"> and <script src="app.js"> tags in a day's page
  // point at the day's files: either a code box (slot) or fixed read-only content.
  function inlineFiles(day, html) {
    const files = day.files || {};
    const body = (f) => (f.slot ? `{{slot:${f.slot}}}` : f.content || "");
    html = html.replace(/<link\s+rel="stylesheet"\s+href="([^"]+)"\s*\/?>/g, (m, name) =>
      files[name] ? `<style>\n${body(files[name])}\n</style>` : m);
    html = html.replace(/<script\s+src="([^"]+)"><\/script>/g, (m, name) =>
      files[name] ? `<script>\n${body(files[name])}\n<\/script>` : m);
    return html;
  }
  const SHOWABLE = ["appCss"];
  function refContent(day, name, step) {
    const pretty = (s) => s
      .replace(/\{\{theme\}\}/g, "/* your theme colours from Day 2 go here */")
      .replace(/\{\{data:(\w+)\}\}/g, (m, n) => JSON.stringify(Lab.data[n] ?? null, null, 2))
      .replace(/\{\{asset:(\w+)\}\}/g, (m, n) => (SHOWABLE.includes(n) ? pretty(Lab.assets[n] || "") : "..."));
    if (name === "@page") {
      const t = templateOf(day, step);
      return pretty(t.replace(/^([ \t]*)\{\{slot:(\w+)\}\}/gm, "$1<!-- your code from the box goes here -->"));
    }
    const f = (day.files || {})[name];
    return f && f.content != null ? pretty(f.content) : "";
  }
  function refLang(name) {
    if (name === "@page" || /\.html$/.test(name)) return "html";
    if (/\.css$/.test(name)) return "css";
    return "js";
  }

  // ---------- fetch inside the preview: real network first, saved sample data if offline ----------
  function labFetch(realFetch, url, opts, win) {
    const u = String(url && url.url ? url.url : url);
    const method = ((opts && opts.method) || "GET").toUpperCase();
    // our pretend server (Day 10): relative /api/... addresses
    if (win.__labServer && /^(https?:\/\/localhost(:\d+)?)?\/api(\/|$)/.test(u)) return win.__labServer.handle(method, u, opts);
    if (/^\/api(\/|$)/.test(u)) return Promise.reject(new win.TypeError("Failed to fetch: there is no server running in this step"));
    if (!/api\.tvmaze\.com/i.test(u) || !Lab.mock) return realFetch(url, opts);
    const offline = () => {
      const res = Lab.mock(u);
      if (!labFetch.warned) { labFetch.warned = true; addConsole("info", "No internet connection: the Lab is using saved sample data from TVmaze instead."); }
      if (res === undefined) return Promise.reject(new win.TypeError("Failed to fetch"));
      const status = res && res.__status ? res.__status : 200;
      const body = res && res.__status ? res.body : res;
      return Promise.resolve(new win.Response(JSON.stringify(body), { status, headers: { "Content-Type": "application/json" } }));
    };
    if (Lab.forceOffline) return new Promise((r) => setTimeout(r, 250)).then(offline);
    let timer;
    const timeout = new Promise((_, rej) => { timer = setTimeout(() => rej(new Error("timeout")), 6000); });
    return Promise.race([realFetch(url, opts), timeout]).then((r) => { clearTimeout(timer); return r; }, () => { clearTimeout(timer); return offline(); });
  }

  // =========================================================
  // Screens
  // =========================================================
  const app = () => $("#app");
  let current = { step: null, logs: [], errors: [] };

  function route() {
    const h = location.hash.replace(/^#\/?/, "");
    const parts = h.split("/");
    teardownStep();
    if (parts[0] === "step" && STEPS[parts[1]]) return showStep(STEPS[parts[1]]);
    if (parts[0] === "guide") return showGuide(parts[1] ? +parts[1] : null);
    if (parts[0] === "day" && dayByN(+parts[1])) {
      const d = dayByN(+parts[1]);
      return parts[2] === "done" ? showDayDone(d) : showDay(d);
    }
    showHome();
  }

  function setCrumbs(items) {
    $("#crumbs").innerHTML = items
      .map((it, i) => (i === items.length - 1 ? `<b>${esc(it[0])}</b>` : `<a href="${it[1]}">${esc(it[0])}</a>`))
      .join('<span class="sep">/</span>');
  }

  function resumeTarget() {
    if (state.at && STEPS[state.at]) return "#/step/" + state.at;
    return "#/day/" + (DAYS[0] ? DAYS[0].n : 1);
  }

  function showHome() {
    document.title = "ShowShelf Lab";
    setCrumbs([["All days", "#/"]]);
    $("#stepper").hidden = true;
    const total = DAYS.reduce((a, d) => a + d.core.length, 0);
    const done = DAYS.reduce((a, d) => a + doneCount(d), 0);
    const planned = (Lab.plan || []).filter((p) => !dayByN(p.n));
    app().innerHTML = `
      <div class="page">
        <section class="hero">
          <div>
            <div class="kicker">Web Dev in 11 Days · practice</div>
            <h1>Build a TV show app, one small step at a time.</h1>
            <p>Every step explains one idea, asks you to write a few lines, and shows the result straight away. By Day 11 you will have your own ShowShelf website online.</p>
            <a class="btn primary" href="${resumeTarget()}">${done ? "Continue where you stopped" : "Start Day 1"} ${ICON.right}</a>
            ${done ? `<span class="progress-label" style="margin-left:12px">${done} of ${total} steps done</span>` : ""}
          </div>
          <div class="how">
            <h2>How it works</h2>
            <ol>
              <li>Read the short explanation on the left.</li>
              <li>Write your code in the dark box in the middle.</li>
              <li>Watch the preview on the right change as you type.</li>
              <li>Press <b>Check</b>. Stuck? Open a hint, or look at the answer.</li>
            </ol>
          </div>
        </section>
        <div class="days">
          ${DAYS.map(dayCard).join("")}
          ${planned.map((p) => `<div class="daycard soon"><div class="num">Day ${p.n}</div><h3>${esc(p.title)}</h3><p>${esc(p.sub || "")}</p><div class="progress-label">Coming soon</div></div>`).join("")}
        </div>
      </div>`;
  }
  function dayCard(d) {
    const done = doneCount(d), total = d.core.length;
    const pct = total ? Math.round((done / total) * 100) : 0;
    return `<a class="daycard ${done === total && total ? "complete" : ""}" href="#/day/${d.n}">
      <div class="num">Day ${d.n}</div>
      <h3>${esc(d.title)}</h3>
      <p>${esc(d.subtitle || "")}</p>
      <div class="bar"><i style="width:${pct}%"></i></div>
      <div class="progress-label">${done === total && total ? "Done" : done ? `${done} of ${total} steps` : `${total} steps · about ${esc(d.hours || "3 hours")}`}</div>
    </a>`;
  }

  function stepRows(d) {
    const row = (s) => `<li class="${state.done[s.id] ? "done" : ""}"><a href="#/step/${s.id}"><span class="n">${state.done[s.id] ? "&#10003;" : s.label}</span><span class="t">${esc(s.title)}</span><span class="m">${s.minutes ? "~" + s.minutes + " min" : ""}</span></a></li>`;
    return d.core.map(row).join("") +
      (d.practiceSteps.length ? `<li class="group">Practice: more exercises (after the steps above)</li>` + d.practiceSteps.map(row).join("") : "") +
      (d.bonusSteps.length ? `<li class="group">Extra challenges (if you finish early)</li>` + d.bonusSteps.map(row).join("") : "");
  }

  function finalPreviewDoc(d) {
    const last = d.core[d.core.length - 1];
    if (!last) return "";
    bridge.run++;
    return buildDoc(last, last.solution, { solutionsOnly: true });
  }

  function showDay(d) {
    document.title = `Day ${d.n} · ShowShelf Lab`;
    setCrumbs([["All days", "#/"], [`Day ${d.n}: ${d.title}`, `#/day/${d.n}`]]);
    $("#stepper").hidden = true;
    const next = d.core.find((s) => !state.done[s.id]) || d.core[0];
    app().innerHTML = `
      <div class="page">
        <div class="overview">
          <div>
            <div class="kicker">Day ${d.n}${d.subtitle ? " · " + esc(d.subtitle) : ""}</div>
            <h1>${esc(d.title)}</h1>
            <div class="md">${md(d.intro)}</div>
            <a class="btn primary" href="#/step/${next.id}">${doneCount(d) ? "Continue" : "Start"}: ${esc(next.title)} ${ICON.right}</a>
            <ul class="steplist">${stepRows(d)}</ul>
          </div>
          <div class="frame-card">
            <div class="cap">What you will have built at the end of today</div>
            <iframe title="Today's result" id="goal"></iframe>
          </div>
        </div>
      </div>`;
    $("#goal").srcdoc = finalPreviewDoc(d);
  }

  function showDayDone(d) {
    document.title = `Day ${d.n} done · ShowShelf Lab`;
    setCrumbs([["All days", "#/"], [`Day ${d.n}: ${d.title}`, `#/day/${d.n}`], ["Done", ""]]);
    $("#stepper").hidden = true;
    const nextDay = DAYS.find((x) => x.n > d.n);
    const left = d.core.filter((s) => !state.done[s.id]);
    const last = d.core[d.core.length - 1];
    bridge.run++;
    const doc = last ? buildDoc(last, starterFor(last)) : "";
    app().innerHTML = `
      <div class="page">
        <div class="overview">
          <div>
            <div class="kicker">Day ${d.n} · ${left.length ? "almost there" : "complete"}</div>
            <h1>${left.length ? `${left.length} step${left.length > 1 ? "s" : ""} still to check` : "Well done. Day " + d.n + " is complete."}</h1>
            ${left.length ? `<p>These steps are not checked yet: ${left.map((s) => `<a href="#/step/${s.id}">${esc(s.label + ". " + s.title)}</a>`).join(", ")}.</p>` : ""}
            <h3>What you learned today</h3>
            <div class="learned"><ul>${d.core.map((s) => `<li>${inline(s.summary || s.title)}</li>`).join("")}</ul></div>
            ${d.practiceSteps.length ? `<h3>Keep practising: ${d.practiceSteps.filter((s) => state.done[s.id]).length} of ${d.practiceSteps.length} exercises done</h3><ul class="steplist">${d.practiceSteps.map((s) => `<li class="${state.done[s.id] ? "done" : ""}"><a href="#/step/${s.id}"><span class="n">${state.done[s.id] ? "&#10003;" : s.label}</span><span class="t">${esc(s.title)}</span><span class="m">${s.minutes ? "~" + s.minutes + " min" : ""}</span></a></li>`).join("")}</ul>` : ""}
            ${d.bonusSteps.length ? `<h3>Time left? Try the extra challenges</h3><ul class="steplist">${d.bonusSteps.map((s) => `<li class="${state.done[s.id] ? "done" : ""}"><a href="#/step/${s.id}"><span class="n">${state.done[s.id] ? "&#10003;" : s.label}</span><span class="t">${esc(s.title)}</span><span class="m">${s.minutes ? "~" + s.minutes + " min" : ""}</span></a></li>`).join("")}</ul>` : ""}
            <p style="margin-top:20px">${nextDay ? `<a class="btn" href="#/day/${nextDay.n}">Look at Day ${nextDay.n}: ${esc(nextDay.title)} ${ICON.right}</a>` : `<a class="btn" href="#/">Back to all days</a>`}</p>
          </div>
          <div class="frame-card">
            <div class="cap">Your page, as you built it</div>
            <iframe title="Your result" id="goal"></iframe>
          </div>
        </div>
      </div>`;
    $("#goal").srcdoc = doc;
  }

  // ---------- teacher guide (printable) ----------
  function showGuide(only) {
    document.title = "Teacher guide · ShowShelf Lab";
    setCrumbs([["All days", "#/"], ["Teacher guide", ""]]);
    $("#stepper").hidden = true;
    const days = DAYS.filter((d) => !only || d.n === only);
    const langOf = (s) => s.lang || (s.day.slots[s.slot] || {}).lang || "html";
    app().innerHTML = `<div class="page guide">
      <div class="noprint row" style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:16px">
        <button class="btn primary" onclick="print()">Print or save as PDF</button>
        ${DAYS.map((d) => `<a class="btn small" href="#/guide/${d.n}">Day ${d.n}</a>`).join("")}
        <a class="btn small" href="#/guide">All days</a>
      </div>
      <div class="kicker">ShowShelf Lab · for the afternoon teacher</div>
      <h1>Teacher guide${only ? ": Day " + only : ""}</h1>
      <div class="md guide-intro">
        <p>Students work through the steps in the Lab on their own. Each step has an explanation, a task, two hints and an answer button, so most of the time they can get unstuck alone. This guide gives you every task, a correct answer and the mistakes students usually make, so you can help quickly.</p>
        <p><b>How to help:</b> first ask them to read the "Not yet" message and the red Console line (if any), then open a hint. Only point at the answer after that. In the Lab, <b>Help › Teacher view</b> shows the answer and these notes on every step.</p>
      </div>
      ${days.map((d) => `
        <section class="guide-day">
          <h2>Day ${d.n}: ${esc(d.title)} <span class="sub">${esc(d.subtitle || "")}</span></h2>
          <div class="md">${md(d.intro)}</div>
          ${d.steps.map((s) => `
            <article class="guide-step">
              <h3>${stepName(s)}. ${esc(s.title)} <span class="sub">${s.minutes ? "~" + s.minutes + " min" : ""}</span></h3>
              ${s.summary ? `<p class="teaches"><b>Teaches:</b> ${inline(s.summary)}</p>` : ""}
              <div class="cols">
                <div><h4>Task</h4><div class="md">${md(s.task)}</div>
                  ${s.mistakes ? `<h4>Common mistakes</h4><ul>${s.mistakes.map((m) => `<li>${inline(m)}</li>`).join("")}</ul>` : ""}
                  ${s.teacher ? `<h4>Note</h4><div class="md">${md(s.teacher)}</div>` : ""}
                </div>
                <div><h4>A correct answer</h4><div class="md"><pre><code>${highlight(answerPart(s), langOf(s))}</code></pre></div></div>
              </div>
            </article>`).join("")}
        </section>`).join("")}
    </div>`;
  }
  // show only what changed in this step when the answer builds on the previous one
  function answerPart(s) {
    if (s.practice) return s.solution;
    const prev = lastCodeFor(s.day, s.slot, s.bonus ? lastCoreIndex(s.day, s.slot) : s.index - 1, true);
    if (!prev || !prev.trim()) return s.solution;
    const A = prev.split("\n"), B = s.solution.split("\n");
    // longest common subsequence of lines, to find which lines of B are new or changed
    const n = A.length, m = B.length;
    if (n * m > 400000) return s.solution;
    const L = Array.from({ length: n + 1 }, () => new Uint16Array(m + 1));
    for (let i = n - 1; i >= 0; i--) for (let j = m - 1; j >= 0; j--) L[i][j] = A[i] === B[j] ? L[i + 1][j + 1] + 1 : Math.max(L[i + 1][j], L[i][j + 1]);
    const changed = new Array(m).fill(false);
    let i = 0, j = 0;
    while (j < m) {
      if (i < n && A[i] === B[j]) { i++; j++; }
      else if (i < n && L[i + 1][j] >= L[i][j + 1]) i++;
      else { changed[j] = true; j++; }
    }
    const count = changed.filter(Boolean).length;
    if (!count || count > m * 0.6) return s.solution;
    const CONTEXT = 2, show = new Array(m).fill(false);
    changed.forEach((c, k) => { if (c) for (let x = Math.max(0, k - CONTEXT); x <= Math.min(m - 1, k + CONTEXT); x++) show[x] = true; });
    const lang = s.lang || (s.day.slots[s.slot] || {}).lang || "html";
    const gap = lang === "html" ? "<!-- ... unchanged ... -->" : lang === "css" ? "/* ... unchanged ... */" : "// ... unchanged ...";
    const out = [];
    for (let k = 0; k < m; k++) {
      if (show[k]) out.push(B[k]);
      else if (out[out.length - 1] !== gap) out.push(gap);
    }
    return out.join("\n");
  }


  // ---------- the step screen ----------
  let refresh = null;
  function teardownStep() {
    clearTimeout(refresh);
    disposeMonaco();
    current = { step: null, logs: [], errors: [] };
  }

  function showStep(step) {
    const d = step.day;
    state.at = step.id;
    save();
    current = { step, logs: [], errors: [], tab: "code", hintsShown: state.hints[step.id] || 0 };
    document.title = `${step.title} · Day ${d.n} · ShowShelf Lab`;
    setCrumbs([["All days", "#/"], [`Day ${d.n}: ${d.title}`, `#/day/${d.n}`], [stepName(step), ""]]);
    const slot = (d.slots && d.slots[step.slot]) || {};
    const lang = step.lang || slot.lang || "html";
    const fileName = Object.keys(d.files || {}).find((f) => d.files[f].slot === step.slot);
    const refs = (step.refs || d.refs || []).map((name) => ({
      name: name === "@page" ? `${step.pagename || d.page || "index.html"} (whole page)` : name,
      lang: refLang(name),
      content: () => refContent(d, name, step),
    }));
    const pos = step.bonus ? `Extra challenge ${step.label.slice(1)} of ${d.bonusSteps.length}` : step.practice ? `Practice ${step.label.slice(1)} of ${d.practiceSteps.length}` : `Step ${step.label} of ${d.core.length}`;
    app().innerHTML = `
      <div class="workspace">
        <section class="pane lesson" aria-label="Lesson">
          <div class="meta"><span>Day ${d.n} · ${pos}</span>${step.minutes ? `<span>~${step.minutes} min</span>` : ""}${step.bonus ? '<span class="pill bonus">Extra</span>' : ""}${step.practice ? '<span class="pill practice">Practice</span>' : ""}${state.done[step.id] ? '<span class="pill done">Done</span>' : ""}</div>
          <h1>${esc(step.title)}</h1>
          <div class="md">${md(step.explain)}</div>
          <div class="task"><h2>Your task</h2><div class="md">${md(step.task)}</div></div>
          ${step.download ? `<p><button class="btn primary" id="download">Download my website (${esc(step.download)})</button></p>` : ""}
          <div class="hints" id="hints"></div>
          <div id="answer"></div>
          <div id="teacher"></div>
        </section>
        <section class="pane editor-pane" aria-label="Code">
          <div class="tabs" role="tablist">
            <button class="tab active" data-tab="code">${esc(slot.label || fileName || step.slot)}</button>
            ${refs.map((r, i) => `<button class="tab" data-tab="ref${i}">${esc(r.name)}<span class="ro">read only</span></button>`).join("")}
          </div>
          <div class="editor">
            <div class="gutter" id="gutter" aria-hidden="true"></div>
            <div class="code-wrap">
              <pre id="hl" aria-hidden="true"></pre>
              <textarea id="code" spellcheck="false" autocapitalize="off" autocomplete="off" autocorrect="off" aria-label="Your code"></textarea>
            </div>
          </div>
          <div class="actions">
            <button class="btn small" id="reset" title="Start this step again">Start again</button>
            <button class="btn small" id="hintBtn">Hint</button>
            <button class="btn small" id="answerBtn">Answer</button>
            <span class="spacer"></span>
            <button class="btn primary" id="check" title="Check my code (Ctrl + Enter)">${ICON.check} Check</button>
          </div>
          <div class="feedback" id="feedback" aria-live="polite"></div>
        </section>
        <section class="pane preview-pane" aria-label="Preview">
          <div class="bar-top"><b>Preview</b><span>updates as you type</span><span class="spacer"></span>
            <button class="btn ghost small" id="reload" title="Run again">${ICON.reload} Run again</button>
            <button class="btn ghost small" id="newtab" title="Open the preview in a new tab">${ICON.ext} Bigger</button>
          </div>
          <iframe id="preview" title="Preview of your page"></iframe>
          <div class="console ${step.console === "open" || lang === "js" ? "" : "closed"}" id="console">
            <div class="console-head" id="consoleHead"><b>Console</b><span class="count" id="ccount">0</span><span class="spacer" style="flex:1"></span><span>${lang === "js" || step.console === "open" ? "hide" : "show"}</span></div>
            <div class="console-body" id="cbody"></div>
          </div>
        </section>
      </div>`;
    renderStepper(step);
    const ta = $("#code");
    ta.value = starterFor(step);
    current.lang = lang;
    current.refs = refs;
    setupEditor(ta, lang);
    renderHints();
    renderTeacher();
    if (state.teacher) renderAnswer();
    runPreview();

    ta.addEventListener("input", () => {
      if (current.tab !== "code") return;
      state.code[step.id] = ta.value;
      save();
      clearTimeout(refresh);
      refresh = setTimeout(runPreview, 450);
    });
    document.querySelectorAll(".tab").forEach((b) => b.addEventListener("click", () => switchTab(b.dataset.tab)));
    $("#check").addEventListener("click", runCheck);
    $("#hintBtn").addEventListener("click", () => { nextHint(); });
    $("#answerBtn").addEventListener("click", renderAnswer);
    $("#reset").addEventListener("click", async () => {
      if (!(await ask("Start this step again? Your code in this box goes back to how the step began.", "Start again"))) return;
      delete state.code[step.id];
      save();
      switchTab("code");
      ta.value = freshStarter(step);
      syncEditor();
      runPreview();
      $("#feedback").innerHTML = "";
    });
    $("#reload").addEventListener("click", runPreview);
    if (step.download) $("#download").addEventListener("click", () => downloadSite(step));
    $("#newtab").addEventListener("click", openBig);
    $("#consoleHead").addEventListener("click", () => {
      const c = $("#console");
      c.classList.toggle("closed");
      $("#consoleHead span:last-child").textContent = c.classList.contains("closed") ? "show" : "hide";
    });
    setTimeout(focusEditor, 50);
  }

  function renderStepper(step) {
    const d = step.day;
    const i = d.steps.indexOf(step);
    const prev = d.steps[i - 1];
    const next = d.steps[i + 1];
    const dot = (s) => `<a class="dot ${s.bonus ? "bonus" : ""} ${s.practice ? "practice" : ""} ${state.done[s.id] ? "done" : ""} ${s === step ? "current" : ""}" href="#/step/${s.id}" title="${esc(s.label + ". " + s.title)}">${state.done[s.id] && s !== step ? "&#10003;" : s.label}</a>`;
    const sp = $("#stepper");
    sp.hidden = false;
    sp.innerHTML = `
      ${prev ? `<a class="btn" href="#/step/${prev.id}">${ICON.left} Previous</a>` : `<a class="btn" href="#/day/${d.n}">${ICON.left} Day ${d.n}</a>`}
      <div class="dots">${d.core.map(dot).join("")}${d.practiceSteps.length ? '<span class="gap"></span>' + d.practiceSteps.map(dot).join("") : ""}${d.bonusSteps.length ? '<span class="gap"></span>' + d.bonusSteps.map(dot).join("") : ""}</div>
      ${nextLink(step)}`;
  }
  function nextLink(step, primary) {
    const d = step.day;
    const i = d.steps.indexOf(step);
    const next = d.steps[i + 1];
    const cls = primary ? "btn primary" : "btn";
    if (!step.bonus && !step.practice && next && next.practice) return `<a class="${cls}" href="#/step/${next.id}">Practice exercises ${ICON.right}</a>`;
    if (!step.bonus && (!next || next.bonus)) return `<a class="${cls}" href="#/day/${d.n}/done">Finish Day ${d.n} ${ICON.right}</a>`;
    if (next) return `<a class="${cls}" href="#/step/${next.id}">Next ${ICON.right}</a>`;
    return `<a class="${cls}" href="#/day/${d.n}/done">Back to the day summary ${ICON.right}</a>`;
  }

  // ---------- editor ----------
  function setupEditor(ta, lang) {
    disposeMonaco();
    if (setupMonaco(ta, lang)) return;
    const hl = $("#hl"), gutter = $("#gutter");
    const sync = () => {
      const lng = current.tab === "code" ? lang : current.refs[+current.tab.slice(3)].lang || lang;
      hl.innerHTML = highlight(ta.value, lng) + "\n ";
      const n = ta.value.split("\n").length;
      let g = "";
      for (let k = 1; k <= n; k++) g += k + "\n";
      gutter.textContent = g;
      hl.scrollTop = ta.scrollTop;
      hl.scrollLeft = ta.scrollLeft;
      gutter.scrollTop = ta.scrollTop;
    };
    current.sync = sync;
    ta.addEventListener("input", sync);
    ta.addEventListener("scroll", () => { hl.scrollTop = ta.scrollTop; hl.scrollLeft = ta.scrollLeft; gutter.scrollTop = ta.scrollTop; });
    ta.addEventListener("keydown", (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "Enter") { e.preventDefault(); runCheck(); return; }
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "s") { e.preventDefault(); toast("Your code is saved automatically."); return; }
      if (ta.readOnly) return;
      const { selectionStart: a, selectionEnd: b, value: v } = ta;
      if (e.key === "Tab") {
        e.preventDefault();
        if (e.shiftKey) {
          const ls = v.lastIndexOf("\n", a - 1) + 1;
          if (v.slice(ls, ls + 2) === "  ") { ta.setRangeText("", ls, ls + 2, "end"); ta.setSelectionRange(Math.max(ls, a - 2), Math.max(ls, b - 2)); }
        } else ta.setRangeText("  ", a, b, "end");
        ta.dispatchEvent(new Event("input"));
      } else if (e.key === "Enter" && !e.shiftKey && a === b) {
        // keep the indentation of the current line; indent one more after { ( [ or an opening tag
        const ls = v.lastIndexOf("\n", a - 1) + 1;
        const line = v.slice(ls, a);
        let ind = line.match(/^\s*/)[0];
        const before = v.slice(ls, a).trimEnd();
        const after = v.slice(a, v.indexOf("\n", a) === -1 ? v.length : v.indexOf("\n", a)).trim();
        const opens = /[{([]$/.test(before) || (/<([a-zA-Z][\w-]*)(?:\s[^<>]*)?>$/.test(before) && !/<\/|\/>$|<(img|br|hr|input|meta|link)\b/i.test(before.slice(before.lastIndexOf("<"))));
        e.preventDefault();
        if (opens && /^[})\]]|^<\//.test(after)) {
          ta.setRangeText("\n" + ind + "  " + "\n" + ind, a, b, "end");
          const p = a + 1 + ind.length + 2;
          ta.setSelectionRange(p, p);
        } else {
          if (opens) ind += "  ";
          ta.setRangeText("\n" + ind, a, b, "end");
        }
        ta.dispatchEvent(new Event("input"));
      }
    });
    sync();
  }
  function syncEditor() { if (current.sync) current.sync(); }
  function focusEditor() {
    if (mon && mon.editor) mon.editor.focus();
    else { const ta = $("#code"); if (ta) ta.focus({ preventScroll: true }); }
  }

  // ---------- the VS Code editor (Monaco), used when this browser can run it ----------
  const MLANG = { html: "html", css: "css", js: "javascript", jsx: "javascript" };
  const MEXT = { html: "html", css: "css", js: "js", jsx: "jsx" };
  const VOID_TAGS = /^(area|base|br|col|embed|hr|img|input|link|meta|source|track|wbr)$/i;
  let monacoNs = null; // the monaco namespace once loaded, false when it can't run here
  let mon = null; // { editor, models }
  function simpleEditorWanted() {
    if (state.simpleEditor) return true;
    // phones and tablets: the simple editor works better with on-screen keyboards
    return !!(window.matchMedia && matchMedia("(pointer: coarse)").matches && !matchMedia("(pointer: fine)").matches);
  }
  function getMonaco() {
    if (monacoNs !== null) return monacoNs;
    if (!window.LabMonaco) return (monacoNs = false);
    try {
      const m = window.LabMonaco.load();
      const ts = m.languages.typescript;
      ts.javascriptDefaults.setCompilerOptions({ target: ts.ScriptTarget.ES2020, allowJs: true, allowNonTsExtensions: true, jsx: ts.JsxEmit.React, noEmit: true });
      // like VS Code: syntax errors are underlined, type errors are not
      ts.javascriptDefaults.setDiagnosticsOptions({ noSemanticValidation: true, noSyntaxValidation: false });
      monacoNs = m;
    } catch (e) {
      console.warn("The VS Code editor could not start here; using the simple editor.", e);
      monacoNs = false;
    }
    return monacoNs;
  }
  function disposeMonaco() {
    if (!mon) return;
    try { mon.editor.dispose(); mon.models.forEach((x) => x.dispose()); } catch (e) { /* already gone */ }
    mon = null;
  }
  // the day's fixed JavaScript files (data.js, helpers.js, ...) and the libraries the page loads,
  // so autocompletion knows shows, ratingLabel, React, express, ...
  function extraLibsFor(step) {
    const d = step.day, libs = [];
    for (const [name, f] of Object.entries(d.files || {})) {
      if (f.content != null && /\.js$/.test(name)) libs.push({ filePath: "file:///lab/" + name, content: refContent(d, name, step) });
    }
    const page = String(templateOf(d, step) || "");
    if (page.includes("{{asset:react}}")) libs.push({ filePath: "file:///lab/react-globals.d.ts", content: REACT_DTS });
    if (page.includes("{{asset:expressLite}}")) libs.push({ filePath: "file:///lab/express-globals.d.ts", content: EXPRESS_DTS });
    if (/\{\{data:shows\}\}/.test(page) && !libs.some((l) => /shows\s*=/.test(l.content))) libs.push({ filePath: "file:///lab/shows.js", content: "const shows = " + JSON.stringify(Lab.data.shows, null, 2) + ";" });
    return libs;
  }
  const REACT_DTS = `declare namespace React {
  type Node = any;
  /** A component's memory: gives back [value, setValue]. */
  function useState<T>(initial: T | (() => T)): [T, (next: T | ((old: T) => T)) => void];
  /** Run code after React has drawn the component. */
  function useEffect(effect: () => void | (() => void), deps?: any[]): void;
  function createElement(type: any, props?: any, ...children: any[]): Node;
  const Fragment: any;
}
declare namespace ReactDOM {
  function createRoot(container: Element | null): { render(node: React.Node): void; unmount(): void };
}
declare namespace JSX { interface IntrinsicElements { [name: string]: any } type Element = any; }`;
  const EXPRESS_DTS = `interface LabRequest { params: { [name: string]: string }; query: { [name: string]: string }; body: any; method: string; path: string; }
interface LabResponse {
  /** Set the status code, e.g. res.status(201).json(item) */
  status(code: number): LabResponse;
  /** Answer with JSON */
  json(body: any): LabResponse;
  send(body?: any): LabResponse;
  sendStatus(code: number): LabResponse;
  end(): LabResponse;
}
type LabHandler = (req: LabRequest, res: LabResponse, next?: () => void) => any;
interface LabApp {
  use(handler: any): LabApp;
  get(path: string, ...handlers: LabHandler[]): LabApp;
  post(path: string, ...handlers: LabHandler[]): LabApp;
  put(path: string, ...handlers: LabHandler[]): LabApp;
  patch(path: string, ...handlers: LabHandler[]): LabApp;
  delete(path: string, ...handlers: LabHandler[]): LabApp;
  listen(port: number, callback?: () => void): LabApp;
}
declare function express(): LabApp;
declare namespace express { function json(): any; }
declare function cors(): any;`;
  function setupMonaco(ta, lang) {
    if (simpleEditorWanted()) return false;
    const m = getMonaco();
    if (!m) return false;
    const step = current.step, d = step.day;
    const box = $(".editor");
    box.classList.add("monaco");
    $(".editor-pane").classList.add("vscode");
    const host = document.createElement("div");
    host.className = "monaco-host";
    box.appendChild(host);
    const fileName = Object.keys(d.files || {}).find((f) => d.files[f].slot === step.slot) || step.slot + "." + (MEXT[lang] || "txt");
    const uid = Date.now().toString(36);
    const models = [];
    const codeModel = m.editor.createModel(ta.value, MLANG[lang] || "plaintext", m.Uri.parse(`file:///${uid}/${fileName.replace(/[^\w.-]/g, "_")}`));
    models.push(codeModel);
    try { m.languages.typescript.javascriptDefaults.setExtraLibs(extraLibsFor(step)); } catch (e) { /* completions still work without them */ }
    const editor = m.editor.create(host, {
      model: codeModel,
      theme: "vs-dark",
      automaticLayout: true,
      fontFamily: getComputedStyle(document.documentElement).getPropertyValue("--mono").trim() || "monospace",
      fontSize: 14,
      lineHeight: 22,
      tabSize: 2,
      insertSpaces: true,
      detectIndentation: false,
      minimap: { enabled: false },
      wordWrap: "on",
      wrappingIndent: "indent",
      scrollBeyondLastLine: false,
      fixedOverflowWidgets: true,
      padding: { top: 10, bottom: 10 },
      bracketPairColorization: { enabled: true },
      renderWhitespace: "none",
      ariaLabel: "Your code",
    });
    mon = { editor, models };
    current.editor = editor;
    let applying = false;
    // editor -> hidden textarea: the rest of the Lab (saving, preview, checks) reads the textarea
    codeModel.onDidChangeContent(() => {
      if (applying) return;
      ta.value = codeModel.getValue();
      ta.dispatchEvent(new Event("input"));
    });
    // VS Code closes an HTML tag for you when you type the > of the opening tag
    if (lang === "html") codeModel.onDidChangeContent((e) => {
      if (applying || e.changes.length !== 1 || e.changes[0].text !== ">" || e.isUndoing || e.isRedoing) return;
      const c = e.changes[0];
      const line = c.range.startLineNumber, col = c.range.startColumn + 1;
      const before = codeModel.getLineContent(line).slice(0, col - 1);
      const after = codeModel.getLineContent(line).slice(col - 1);
      const mt = before.match(/<([a-zA-Z][\w-]*)(?:\s[^<>]*)?>$/);
      if (!mt || /\/>$/.test(before) || VOID_TAGS.test(mt[1]) || after.trimStart().toLowerCase().startsWith("</" + mt[1].toLowerCase())) return;
      setTimeout(() => {
        if (editor.getModel() !== codeModel) return;
        editor.executeEdits("lab-autoclose", [{ range: new m.Range(line, col, line, col), text: "</" + mt[1] + ">" }]);
        editor.setPosition({ lineNumber: line, column: col });
      }, 0);
    });
    editor.addCommand(m.KeyMod.CtrlCmd | m.KeyCode.Enter, () => runCheck());
    editor.addCommand(m.KeyMod.CtrlCmd | m.KeyCode.KeyS, () => toast("Your code is saved automatically."));
    const refModels = {};
    // hidden textarea -> editor: tabs, Start again, Use the answer and the test hooks set the textarea
    const sync = () => {
      if (current.tab === "code") {
        if (editor.getModel() !== codeModel) { editor.setModel(codeModel); editor.updateOptions({ readOnly: false }); }
        if (codeModel.getValue() !== ta.value) {
          applying = true;
          try { codeModel.pushEditOperations(editor.getSelections(), [{ range: codeModel.getFullModelRange(), text: ta.value }], () => null); }
          finally { applying = false; }
        }
      } else {
        const i = +current.tab.slice(3), r = current.refs[i];
        if (!refModels[i]) {
          const rl = r.lang || lang;
          refModels[i] = m.editor.createModel(ta.value, MLANG[rl] || "plaintext", m.Uri.parse(`inmemory:///${uid}/ref${i}.${MEXT[rl] || "txt"}`));
          models.push(refModels[i]);
        }
        editor.setModel(refModels[i]);
        editor.updateOptions({ readOnly: true });
      }
    };
    current.sync = sync;
    ta.addEventListener("input", sync);
    return true;
  }

  function switchTab(tab) {
    const ta = $("#code");
    if (current.tab === "code") state.code[current.step.id] = ta.value;
    current.tab = tab;
    document.querySelectorAll(".tab").forEach((b) => b.classList.toggle("active", b.dataset.tab === tab));
    const old = $(".ro-banner");
    if (old) old.remove();
    if (tab === "code") {
      ta.readOnly = false;
      ta.value = starterFor(current.step);
    } else {
      const r = current.refs[+tab.slice(3)];
      ta.readOnly = true;
      ta.value = typeof r.content === "function" ? r.content() : r.content;
      $(".editor").insertAdjacentHTML("afterbegin", '<span class="ro-banner">read only: for looking, not editing</span>');
    }
    ta.scrollTop = 0;
    syncEditor();
  }
  function editorCode() {
    return current.tab === "code" ? $("#code").value : starterFor(current.step);
  }

  // ---------- preview ----------
  function runPreview() {
    return new Promise((resolve) => {
      const step = current.step;
      if (!step) return resolve();
      const frame = $("#preview");
      clearConsole();
      current.logs = [];
      current.errors = [];
      bridge.run++;
      const html = buildDoc(step, editorCode());
      current.html = html;
      let done = false;
      const finish = () => { if (done) return; done = true; setTimeout(resolve, step.wait || 120); };
      frame.onload = finish;
      frame.srcdoc = html;
      setTimeout(finish, 3000);
    });
  }
  // the student's page as a real file: no Lab runtime, pictures and data built in
  function siteHtml(step, code) {
    bridge.run++;
    const html = buildDoc(step, code);
    return html.replace(RUNTIME, "");
  }
  Lab.siteHtml = (id, code) => siteHtml(STEPS[id], code == null ? starterFor(STEPS[id]) : code);
  // Save a file for the student. On claude.ai the page must ask the viewer through the
  // "downloads" capability; opened as a file, a normal download link does the job.
  async function saveFile(filename, text, type) {
    const host = window.claude && typeof window.claude.use === "function" ? window.claude : null;
    if (host) {
      const downloads = await host.use("downloads").catch(() => null);
      if (downloads) {
        try {
          await downloads.save({ filename, data: text });
          toast("Saved " + filename + ".");
        } catch (e) {
          if (e && e.code !== "declined") toast("This page can't save files here. Open the Lab file from your computer instead.");
        }
        return;
      }
    }
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([text], { type }));
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    toast("Saved " + filename + " to your Downloads folder.");
  }
  function downloadSite(step) {
    saveFile(step.download, siteHtml(step, editorCode()), "text/html");
  }
  function openBig() {
    try {
      const url = URL.createObjectURL(new Blob([current.html.replace(/<script>\(function\(\)\{\nvar B;[\s\S]*?<\/script>/, "")], { type: "text/html" }));
      const w = window.open(url, "_blank");
      if (!w) toast("This browser blocked the new tab. Open the Lab file from your computer to use Bigger.");
    } catch (e) { toast("This browser blocked the new tab. Open the Lab file from your computer to use Bigger."); }
  }

  // ---------- console panel ----------
  function clearConsole() {
    const b = $("#cbody");
    if (!b) return;
    b.innerHTML = '<div class="empty">Messages from console.log() appear here.</div>';
    const c = $("#ccount");
    c.textContent = "0";
    c.classList.remove("err");
  }
  function addConsole(level, text, help) {
    const b = $("#cbody");
    if (!b) return;
    const e = b.querySelector(".empty");
    if (e) e.remove();
    const div = document.createElement("div");
    div.className = "line " + (level === "log" ? "" : level);
    div.textContent = text;
    if (help) {
      const f = document.createElement("span");
      f.className = "friendly";
      f.textContent = help;
      div.appendChild(f);
    }
    b.appendChild(div);
    b.scrollTop = b.scrollHeight;
    const c = $("#ccount");
    c.textContent = String(b.querySelectorAll(".line").length);
    if (level === "error") {
      c.classList.add("err");
      $("#console").classList.remove("closed");
      $("#consoleHead span:last-child").textContent = "hide";
    }
  }

  // ---------- hints, answer, teacher notes ----------
  function renderHints() {
    const step = current.step;
    const hints = step.hints || [];
    const n = Math.min(current.hintsShown, hints.length);
    $("#hints").innerHTML = hints.slice(0, n).map((h, i) => `<div class="hint"><b>Hint ${i + 1}</b><div class="md">${md(h)}</div></div>`).join("");
    const btn = $("#hintBtn");
    btn.textContent = !hints.length ? "No hints" : n < hints.length ? `Hint ${n + 1}/${hints.length}` : "No more hints";
    btn.disabled = !hints.length || n >= hints.length;
  }
  function nextHint() {
    current.hintsShown++;
    state.hints[current.step.id] = current.hintsShown;
    save();
    renderHints();
    const l = $(".lesson");
    l.scrollTo({ top: l.scrollHeight, behavior: "smooth" });
  }
  function renderAnswer() {
    const step = current.step;
    const lang = current.lang;
    $("#answer").innerHTML = `<div class="answer">
      <h3>One possible answer</h3>
      <div class="md"><p>Try to understand it before you copy it. Your version can be different and still be right.</p><pre><code>${highlight(step.solution, lang)}</code></pre></div>
      <button class="btn small" id="useAnswer">Put this answer in my code</button>
    </div>`;
    $("#useAnswer").addEventListener("click", async () => {
      if (!(await ask("Replace your code in this step with the answer?", "Use the answer"))) return;
      switchTab("code");
      $("#code").value = step.solution;
      state.code[step.id] = step.solution;
      save();
      syncEditor();
      runPreview();
    });
    const l = $(".lesson");
    l.scrollTo({ top: l.scrollHeight, behavior: "smooth" });
  }
  function renderTeacher() {
    const step = current.step;
    if (!state.teacher || (!step.mistakes && !step.teacher)) { $("#teacher").innerHTML = ""; return; }
    $("#teacher").innerHTML = `<div class="teacher-box"><h3>For teachers</h3><div class="md">${md(step.teacher || "")}${step.mistakes ? "<p><b>Common mistakes</b></p><ul>" + step.mistakes.map((m) => `<li>${inline(m)}</li>`).join("") + "</ul>" : ""}</div></div>`;
  }

  // =========================================================
  // Checking
  // =========================================================
  class LabFail extends Error { constructor(msg) { super(msg); this.labFail = true; } }

  function rgb(str) {
    const m = String(str || "").match(/rgba?\(\s*([\d.]+)[ ,]+([\d.]+)[ ,]+([\d.]+)(?:[ ,/]+([\d.]+%?))?/);
    if (!m) return null;
    let a = m[4] == null ? 1 : m[4].endsWith("%") ? parseFloat(m[4]) / 100 : parseFloat(m[4]);
    return [+m[1], +m[2], +m[3], a];
  }

  function settle(v) { const p = new Promise((r) => setTimeout(() => r(v), 60)); p.valueOf = () => v; return p; }
  function makeTester(step) {
    const frame = $("#preview");
    const win = frame.contentWindow;
    const doc = frame.contentDocument;
    const code = editorCode();
    const el = (x) => (typeof x === "string" ? t.doc.querySelector(x) : x);
    const t = {
      win, doc, code,
      clean: code.replace(/<!--[\s\S]*?-->/g, "").replace(/\/\*[\s\S]*?\*\//g, "").replace(/(^|[^:"'`])\/\/[^\n]*/g, "$1"),
      logs: current.logs,
      errors: current.errors,
      expect(cond, msg) { if (!cond) throw new LabFail(msg); },
      $: (sel) => t.doc.querySelector(sel),
      $$: (sel) => Array.from(t.doc.querySelectorAll(sel)),
      text: (x) => { const e = el(x); return e ? e.textContent.replace(/\s+/g, " ").trim() : ""; },
      css: (x, prop, pseudo) => { const e = el(x); return e ? t.win.getComputedStyle(e, pseudo || null).getPropertyValue(prop).trim() : ""; },
      px: (x, prop) => parseFloat(t.css(x, prop)) || 0,
      rgb,
      same(a, b) { const x = rgb(a), y = rgb(b); return !!x && !!y && x.slice(0, 3).every((v, i) => Math.abs(v - y[i]) < 3) && Math.abs(x[3] - y[3]) < 0.05; },
      isTransparent(c) { const x = rgb(c); return !x || x[3] === 0; },
      isWhite(c) { const x = rgb(c); return !!x && x[3] > 0 && x[0] > 250 && x[1] > 250 && x[2] > 250; },
      light(c) { const x = rgb(c); return x ? (0.299 * x[0] + 0.587 * x[1] + 0.114 * x[2]) / 255 : 1; },
      cssVar(name) { return t.win.getComputedStyle(t.doc.documentElement).getPropertyValue(name).trim(); },
      rules(test) {
        const out = [];
        const walk = (list) => { for (const r of list) { if (r.selectorText && test(r.selectorText, r)) out.push(r); if (r.cssRules) walk(r.cssRules); } };
        for (const sh of t.doc.styleSheets) { try { walk(sh.cssRules); } catch (e) { /* cross-origin sheet */ } }
        return out;
      },
      get(name) {
        try { return t.win.eval(`typeof ${name} !== "undefined" ? ${name} : undefined`); } catch (e) { return undefined; }
      },
      logged(test) { return current.logs.some((l) => l.level !== "error" && (test instanceof RegExp ? test.test(l.text) : l.text.includes(test))); },
      async waitFor(fn, ms = 4000) {
        const start = Date.now();
        for (;;) {
          let v;
          try { v = fn(); } catch (e) { v = false; }
          if (v) return v;
          if (Date.now() - start > ms) return false;
          await new Promise((r) => setTimeout(r, 80));
        }
      },
      sleep: (ms) => new Promise((r) => setTimeout(r, ms)),
      // click / type / submit act at once, and return a promise that resolves a moment later
      // (await it before the next action, so the page has time to update)
      click(x) { const e = el(x); if (!e) return settle(false); e.dispatchEvent(new t.win.MouseEvent("click", { bubbles: true, cancelable: true })); return settle(true); },
      type(x, value) {
        const e = el(x); if (!e) return settle(false);
        const proto = e.tagName === "TEXTAREA" ? t.win.HTMLTextAreaElement.prototype : e.tagName === "SELECT" ? t.win.HTMLSelectElement.prototype : t.win.HTMLInputElement.prototype;
        const setter = Object.getOwnPropertyDescriptor(proto, "value").set; // works with React inputs too
        setter.call(e, value);
        e.dispatchEvent(new t.win.Event("input", { bubbles: true }));
        e.dispatchEvent(new t.win.Event("change", { bubbles: true }));
        return settle(true);
      },
      check(x, on = true) { const e = el(x); if (!e) return settle(false); if (e.checked !== on) e.click(); return settle(true); },
      submit(x) { const e = el(x); if (!e) return settle(false); e.dispatchEvent(new t.win.Event("submit", { bubbles: true, cancelable: true })); return settle(true); },
      fail(msg) { throw new LabFail(msg); },
      // run the page again (like pressing reload); localStorage is kept
      async rerun() {
        await runPreview();
        const f = $("#preview");
        t.win = f.contentWindow;
        t.doc = f.contentDocument;
        t.logs = current.logs;
        t.errors = current.errors;
        return t;
      },
    };
    return t;
  }

  let checking = false;
  async function runCheck() {
    if (checking || !current.step) return;
    checking = true;
    clearTimeout(refresh);
    const step = current.step;
    const fb = $("#feedback");
    fb.innerHTML = `<div class="fb info">Checking...</div>`;
    if (current.tab !== "code") switchTab("code");
    await runPreview();
    let result;
    try {
      const t = makeTester(step);
      await step.check(t);
      result = { ok: true };
    } catch (e) {
      result = { ok: false, msg: e.labFail ? e.message : "The checker got confused by your code. Look for an error in the Console, or press Start again if the page looks broken." };
      if (!e.labFail) console.warn("check error", step.id, e);
    }
    checking = false;
    if (current.step !== step) return;
    if (result.ok) {
      const first = !state.done[step.id];
      state.done[step.id] = 1;
      state.code[step.id] = editorCode();
      save(true);
      fb.innerHTML = `<div class="fb pass">
        <h3>${ICON.check} ${esc(pick(step.bonus ? ["Challenge done!", "You did it!"] : ["Correct!", "Nice work!", "That works!", "Well done!"], step.id))}</h3>
        <div class="md">${md(step.learned || "")}</div>
        <div class="row">${nextLink(step, true)}</div>
      </div>`;
      renderStepper(step);
      const meta = $(".lesson .meta");
      if (first && meta && !meta.querySelector(".pill.done")) meta.insertAdjacentHTML("beforeend", '<span class="pill done">Done</span>');
    } else {
      const err = current.errors[0];
      const extra = err && !/error/i.test(result.msg) ? `\n\n> There is also an error in the Console: *${err.replace(/\s+/g, " ").slice(0, 140)}*. ${friendly(err)}` : "";
      fb.innerHTML = `<div class="fb fail">
        <h3>${ICON.info} Not yet</h3>
        <div class="md">${md(result.msg + extra)}</div>
        <div class="row">${(step.hints || []).length > current.hintsShown ? '<button class="btn small" id="fbHint">Show a hint</button>' : ""}</div>
      </div>`;
      const h = $("#fbHint");
      if (h) h.addEventListener("click", () => { nextHint(); h.remove(); });
    }
    return result;
  }
  function pick(list, seed) { let h = 0; for (const c of seed) h = (h * 31 + c.charCodeAt(0)) | 0; return list[Math.abs(h) % list.length]; }

  // ---------- help dialog ----------
  function openHelp() {
    const dlg = $("#help");
    dlg.innerHTML = `
      <div class="dlg-head"><h2>Help</h2><button class="btn ghost" id="closeHelp">Close</button></div>
      <div class="dlg-body">
        <h3>How a step works</h3>
        <p>Read the explanation, write code in the dark box, and watch the preview. Press <b>Check</b> (or Ctrl + Enter) when you think you're done. If the check says "Not yet", read the message: it tells you what's missing.</p>
        <h3>Stuck?</h3>
        <ol>
          <li>Read the error message and the Console under the preview.</li>
          <li>Press <b>Hint</b>. Most steps have two hints, the second one more direct.</li>
          <li>Press <b>Answer</b>, compare it with yours, and find the difference.</li>
          <li>Ask your teacher or the person next to you.</li>
        </ol>
        <h3>The code editor</h3>
        <p>The code box is the editor from VS Code. While you type, it suggests what can come next: press <b>Enter</b> or <b>Tab</b> to take a suggestion, <b>Esc</b> to close the list. Red wavy lines mark mistakes: point at one to read why.</p>
        <ul>
          <li><b>Ctrl + Space</b>: show suggestions</li>
          <li><b>Ctrl + /</b>: turn the line into a comment (or back)</li>
          <li><b>Shift + Alt + F</b>: tidy up the indentation</li>
          <li><b>Alt + Up / Down</b>: move a line up or down</li>
          <li><b>Ctrl + Z</b>: undo</li>
        </ul>
        <p class="muted">On a Mac use Cmd instead of Ctrl, and Option instead of Alt.</p>
        <label class="switch"><input type="checkbox" id="simpleToggle" ${state.simpleEditor ? "checked" : ""}> Use the simple editor instead (no suggestions; better on slow computers)</label>
        <h3>Your progress</h3>
        <p>Your code is saved in this browser automatically. To continue on another computer, save your progress to a file and open it there.</p>
        <div class="row">
          <button class="btn" id="exportBtn">Save progress to a file</button>
          <label class="btn" for="importFile">Open a progress file</label>
          <input type="file" id="importFile" accept=".json,application/json" hidden>
        </div>
        <h3>For teachers</h3>
        <p><a href="#/guide" id="guideLink">Open the teacher guide</a>: every task with its answer and common mistakes, ready to print.</p>
        <label class="switch"><input type="checkbox" id="teacherToggle" ${state.teacher ? "checked" : ""}> Teacher view: show the answer and common mistakes on every step</label>
        <h3>Start over</h3>
        <p><button class="btn" id="wipe">Delete all my progress</button></p>
      </div>`;
    dlg.showModal();
    $("#closeHelp").onclick = () => dlg.close();
    $("#guideLink").onclick = () => dlg.close();
    $("#exportBtn").onclick = () => saveFile("showshelf-lab-progress.json", JSON.stringify(state, null, 1), "application/json");
    $("#importFile").onchange = async (e) => {
      const f = e.target.files[0];
      if (!f) return;
      try {
        const s = JSON.parse(await f.text());
        if (!s || s.v !== 1 || !s.code) throw new Error("bad file");
        state = Object.assign(fresh(), s);
        save(true);
        dlg.close();
        toast("Progress loaded.");
        route();
      } catch (err) { toast("That file isn't a ShowShelf Lab progress file."); }
    };
    $("#simpleToggle").onchange = (e) => {
      state.simpleEditor = e.target.checked;
      save(true);
      if (current.step) showStep(current.step);
    };
    $("#teacherToggle").onchange = (e) => {
      state.teacher = e.target.checked;
      save(true);
      if (current.step) { renderTeacher(); if (state.teacher) renderAnswer(); else $("#answer").innerHTML = ""; }
    };
    $("#wipe").onclick = async () => {
      if (!(await ask("Delete all your code and progress in this browser? This can't be undone.", "Delete everything"))) return;
      const teacher = state.teacher;
      state = fresh();
      state.teacher = teacher;
      save(true);
      dlg.close();
      location.hash = "#/";
      route();
    };
  }

  // ---------- test hooks (used by the automated checks, harmless for students) ----------
  Lab.test = {
    go(id) { location.hash = "#/step/" + id; },
    editorKind() { return mon && mon.editor ? "vscode" : "simple"; },
    async setCode(code) { const ta = $("#code"); ta.value = code; ta.dispatchEvent(new Event("input")); },
    async check() { const r = await runCheck(); return r; },
    solution: (id) => STEPS[id].solution,
    starter: (id) => freshStarter(STEPS[id]),
    ids: () => Object.keys(STEPS),
    logs: () => current.logs.slice(),
    reset() { state = fresh(); save(true); },
    setDone(ids, withSolutions) { ids.forEach((id) => { state.done[id] = 1; if (withSolutions) state.code[id] = STEPS[id].solution; }); save(true); },
  };

  // ---------- boot ----------
  function boot() {
    if (Lab.assets.posterSvg) Lab.assets.poster = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(Lab.assets.posterSvg);
    bridge.poster = Lab.assets.poster || null;
    $("#helpBtn").innerHTML = ICON.help + " Help";
    $("#helpBtn").addEventListener("click", openHelp);
    window.addEventListener("hashchange", route);
    route();
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})();
