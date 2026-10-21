/* The practice gym: a page that shows, live, whether the student's function gives the expected answers.
   Include it (asset gymJs) in a script tag before the student's code. The starter code then calls
     tryIt(functionName, [argument1, argument2], expectedAnswer);
   and every call becomes one row on the page: a green tick or a red cross. */
(function () {
  "use strict";
  var box = null, rows = 0, good = 0;

  var css =
    ".gym-results{max-width:760px;margin:24px auto;padding:0 16px;font-family:system-ui,-apple-system,'Segoe UI',Roboto,sans-serif}" +
    ".gym-results h2{font-size:18px;margin:0 0 4px}" +
    ".gym-sum{color:#5f5d75;margin:0 0 12px;font-size:14px}" +
    ".gym-row{display:grid;grid-template-columns:28px 1fr;gap:4px 10px;align-items:start;padding:10px 12px;border:1px solid #e3e0f0;border-radius:10px;margin:0 0 8px;background:#fff}" +
    ".gym-row.ok{border-color:#b9e2c8;background:#f1faf4}.gym-row.bad{border-color:#f0c4c4;background:#fff6f6}" +
    ".gym-mark{font-size:18px;font-weight:700;line-height:1.3}.ok .gym-mark{color:#1f8a4c}.bad .gym-mark{color:#c0392b}" +
    ".gym-call{font-family:ui-monospace,Menlo,Consolas,monospace;font-size:14px;font-weight:600;color:#1c1b29;word-break:break-word}" +
    ".gym-detail{grid-column:2;font-size:13px;color:#4a4860;font-family:ui-monospace,Menlo,Consolas,monospace;word-break:break-word}" +
    ".gym-detail b{font-family:system-ui,sans-serif;font-weight:600}";

  function ensureBox() {
    if (box) return box;
    var st = document.createElement("style");
    st.textContent = css;
    document.head.appendChild(st);
    box = document.getElementById("gym") || document.createElement("section");
    box.classList.add("gym-results");
    box.innerHTML = '<h2>Your tries</h2><p class="gym-sum" id="gym-sum"></p><div id="gym-rows"></div>';
    if (!box.parentNode) (document.querySelector("main") || document.body).appendChild(box);
    return box;
  }

  function show(v) {
    if (typeof v === "string") return JSON.stringify(v);
    if (v === undefined) return "undefined";
    if (typeof v === "function") return "a function";
    try {
      var s = JSON.stringify(v);
      if (s === undefined) return String(v);
      return s.length > 160 ? s.slice(0, 157) + "..." : s;
    } catch (e) { return String(v); }
  }

  function same(a, b) {
    if (typeof a === "number" && typeof b === "number") return Math.abs(a - b) < 1e-6 || (isNaN(a) && isNaN(b));
    if (a === b) return true;
    if (a && b && typeof a === "object" && typeof b === "object") {
      if (Array.isArray(a) !== Array.isArray(b)) return false;
      var ka = Object.keys(a), kb = Object.keys(b);
      if (ka.length !== kb.length) return false;
      for (var i = 0; i < ka.length; i++) if (!Object.prototype.hasOwnProperty.call(b, ka[i]) || !same(a[ka[i]], b[ka[i]])) return false;
      return true;
    }
    return false;
  }

  function addRow(ok, call, detail) {
    ensureBox();
    rows++;
    if (ok) good++;
    var r = document.createElement("div");
    r.className = "gym-row " + (ok ? "ok" : "bad");
    r.innerHTML = '<span class="gym-mark">' + (ok ? "&#10003;" : "&#10007;") + '</span><span class="gym-call"></span><span class="gym-detail"></span>';
    r.querySelector(".gym-call").textContent = call;
    r.querySelector(".gym-detail").innerHTML = detail;
    document.getElementById("gym-rows").appendChild(r);
    document.getElementById("gym-sum").textContent = good + " of " + rows + " give the expected answer" + (good === rows ? ". Now press Check." : ".");
  }
  function esc(s) { return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;"); }

  window.tryIt = function (fn, args, expected) {
    if (!Array.isArray(args)) args = [args];
    var name = typeof fn === "function" ? fn.name || "yourFunction" : "?";
    var call = name + "(" + args.map(show).join(", ") + ")";
    if (typeof fn !== "function") {
      addRow(false, call, "<b>This isn't a function yet.</b> Write the function first.");
      return;
    }
    var got;
    try {
      got = fn.apply(null, args);
    } catch (e) {
      addRow(false, call, "<b>Your function crashed:</b> " + esc(e && e.message ? e.message : e));
      console.error(name + " crashed: " + (e && e.message ? e.message : e));
      return;
    }
    var ok = same(got, expected);
    addRow(ok, call, ok
      ? "gives " + esc(show(got))
      : "gives " + esc(show(got)) + " &nbsp;<b>but should give</b> " + esc(show(expected)) +
        (got === undefined ? " &nbsp;(Did you forget <code>return</code>?)" : ""));
  };
})();
