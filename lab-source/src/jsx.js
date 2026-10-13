/* =========================================================
   A small JSX translator for the Lab (Day 10's taste of React).
   Turns   <li className="x">{show.name}</li>
   into    React.createElement("li", {className: "x"}, show.name)
   It keeps line breaks where they were, so error line numbers still match.
   Supports: elements, fragments <>...</>, attributes ("text", {expr}, bare),
   {...spread}, children text / {expr} / elements, JSX nested inside {expr}.
   ========================================================= */
(function (root) {
  "use strict";

  function JSXError(msg, src, pos) {
    const line = src.slice(0, pos).split("\n").length;
    const e = new SyntaxError(msg + " (line " + line + ")");
    e.line = line;
    return e;
  }

  const ENT = { nbsp: " ", amp: "&", lt: "<", gt: ">", quot: '"', apos: "'", copy: "©", middot: "·", ndash: "–", mdash: "—", hellip: "…", times: "×" };
  const decode = (s) => s.replace(/&(#x[0-9a-f]+|#\d+|[a-z]+);/gi, (m, e) => {
    if (e[0] === "#") return String.fromCodePoint(e[1] === "x" || e[1] === "X" ? parseInt(e.slice(2), 16) : parseInt(e.slice(1), 10));
    return ENT[e.toLowerCase()] ?? m;
  });

  // JSX text follows React's whitespace rules
  function jsxText(raw) {
    const lines = raw.split(/\r?\n/);
    let out = "";
    lines.forEach((line, i) => {
      let l = line.replace(/\t/g, " ");
      if (i > 0) l = l.replace(/^\s+/, "");
      if (i < lines.length - 1) l = l.replace(/\s+$/, "");
      if (l) out += (out && i > 0 ? " " : "") + l;
    });
    return out ? decode(out) : "";
  }

  const WORD_BEFORE_JSX = /(?:^|[^\w$.])(return|case|default|typeof|void|yield|await|else|do|in|of|new)$/;

  function transform(src) {
    let i = 0;
    const n = src.length;

    // Is the "<" at position p the start of JSX? Look at the previous meaningful code.
    function jsxAllowed(out) {
      const t = out.replace(/\s+$/, "");
      if (!t) return true;
      const c = t[t.length - 1];
      if ("(,=:?[{};!&|+-*%~^".includes(c)) {
        if (c === "+" && /\+\+$/.test(t)) return false;
        if (c === "-" && /--$/.test(t)) return false;
        return true;
      }
      if (c === ">" && /=>$/.test(t)) return true;
      return WORD_BEFORE_JSX.test(t);
    }

    // copy JavaScript, stopping at an unmatched closing bracket (for {expr})
    function js(stopAtBrace) {
      let out = "";
      let depth = 0;
      while (i < n) {
        const c = src[i];
        const d = src[i + 1];
        if (c === "/" && d === "/") { const e = src.indexOf("\n", i); const end = e < 0 ? n : e; out += src.slice(i, end); i = end; continue; }
        if (c === "/" && d === "*") { const e = src.indexOf("*/", i + 2); const end = e < 0 ? n : e + 2; out += src.slice(i, end); i = end; continue; }
        if (c === '"' || c === "'") { out += str(c); continue; }
        if (c === "`") { out += template(); continue; }
        if (c === "<" && (/[A-Za-z_$>]/.test(d || "")) && jsxAllowed(out)) { out += element(); continue; }
        if (c === "{" || c === "(" || c === "[") depth++;
        if (c === "}" || c === ")" || c === "]") {
          if (depth === 0 && stopAtBrace && c === "}") return out;
          depth--;
        }
        out += c;
        i++;
      }
      if (stopAtBrace) throw JSXError("A { was opened but never closed with }", src, n);
      return out;
    }
    function str(q) {
      let out = q;
      i++;
      while (i < n) {
        const c = src[i];
        out += c;
        i++;
        if (c === "\\") { out += src[i] || ""; i++; continue; }
        if (c === q || c === "\n") break;
      }
      return out;
    }
    function template() {
      let out = "`";
      i++;
      while (i < n) {
        const c = src[i];
        if (c === "\\") { out += c + (src[i + 1] || ""); i += 2; continue; }
        if (c === "`") { out += "`"; i++; return out; }
        if (c === "$" && src[i + 1] === "{") { i += 2; out += "${" + js(true) + "}"; i++; continue; }
        out += c;
        i++;
      }
      return out;
    }
    function ws() {
      const s = i;
      while (i < n && /\s/.test(src[i])) i++;
      return "\n".repeat((src.slice(s, i).match(/\n/g) || []).length);
    }
    function name() {
      const m = /^[A-Za-z_$][\w$]*(?:[.:-][\w$]+)*/.exec(src.slice(i));
      if (!m) throw JSXError("Expected a tag or attribute name after <", src, i);
      i += m[0].length;
      return m[0];
    }
    function tagExpr(tag) {
      if (/^[a-z]/.test(tag) && !tag.includes(".")) return JSON.stringify(tag);
      return tag;
    }
    function propKey(k) { return /^[A-Za-z_$][\w$]*$/.test(k) ? k : JSON.stringify(k); }

    function element() {
      const start = i;
      i++; // <
      let nl = ws();
      // fragment
      let tag = null;
      if (src[i] !== ">") tag = name();
      const props = [];
      for (;;) {
        nl += ws();
        if (i >= n) throw JSXError("This tag is never closed: <" + (tag || "") + " is missing its >", src, start);
        if (src[i] === "/" && src[i + 1] === ">") {
          i += 2;
          return build(tag, props, [], nl);
        }
        if (src[i] === ">") { i++; break; }
        if (src[i] === "{") {
          i++;
          ws();
          if (src.slice(i, i + 3) !== "...") throw JSXError("Inside a tag, { } is only for {...spread}. Did you mean name={value}?", src, i);
          i += 3;
          const expr = js(true);
          i++;
          props.push({ spread: expr });
          continue;
        }
        const key = name();
        nl += ws();
        if (src[i] !== "=") { props.push({ key, value: "true" }); continue; }
        i++;
        nl += ws();
        const q = src[i];
        if (q === '"' || q === "'") {
          const e = src.indexOf(q, i + 1);
          if (e < 0) throw JSXError("An attribute value is missing its closing quote", src, i);
          const raw = src.slice(i + 1, e);
          nl += "\n".repeat((raw.match(/\n/g) || []).length);
          props.push({ key, value: JSON.stringify(decode(raw)) });
          i = e + 1;
        } else if (q === "{") {
          i++;
          const expr = js(true);
          i++;
          if (!expr.trim()) throw JSXError("Empty {} after " + key + "=", src, i);
          props.push({ key, value: "(" + expr + ")" });
        } else if (q === "<") {
          props.push({ key, value: element() });
        } else {
          throw JSXError("An attribute value must be in quotes \"...\" or curly brackets {...}: " + key + "=", src, i);
        }
      }
      // children
      const kids = [];
      let text = "";
      const flush = () => {
        if (!text) return;
        const t = jsxText(text);
        if (t) kids.push(JSON.stringify(t));
        const k = (text.match(/\n/g) || []).length;
        if (k) kids.push({ nl: k });
        text = "";
      };
      for (;;) {
        if (i >= n) {
          if (/^(img|input|br|hr|meta|link)$/.test(tag || "")) throw JSXError("In JSX, <" + tag + "> must close itself with />, like <" + tag + " ... />", src, start);
          throw JSXError("<" + (tag || "") + "> is opened here but never closed with </" + (tag || "") + ">", src, start);
        }
        const c = src[i];
        if (c === "<" && src[i + 1] === "/") {
          flush();
          i += 2;
          ws();
          let close = "";
          if (src[i] !== ">") close = name();
          ws();
          if (src[i] !== ">") throw JSXError("Expected > to finish </" + close, src, i);
          i++;
          if (close !== (tag || "")) throw JSXError(tag ? "<" + tag + "> is closed with </" + close + ">. The names must match." : "A <> fragment must be closed with </>", src, i);
          return build(tag, props, kids, nl);
        }
        if (c === "<") { flush(); kids.push(element()); continue; }
        if (c === "{") {
          flush();
          i++;
          const expr = js(true);
          i++;
          const bare = expr.replace(/\/\*[\s\S]*?\*\//g, "").replace(/\/\/[^\n]*/g, "");
          if (bare.trim()) kids.push("(" + expr + ")");
          else { const k = (expr.match(/\n/g) || []).length; if (k) kids.push({ nl: k }); }
          continue;
        }
        text += c;
        i++;
      }
    }

    function build(tag, props, kids, nl) {
      const type = tag === null ? "React.Fragment" : tagExpr(tag);
      let p = "null";
      if (props.length) {
        const parts = props.map((x) => (x.spread !== undefined ? "..." + x.spread : propKey(x.key) + ": " + x.value));
        p = "{" + parts.join(", ") + "}";
      }
      let out = "React.createElement(" + type + ", " + p + nl;
      for (const k of kids) {
        if (typeof k === "object") out += "\n".repeat(k.nl);
        else out += ", " + k;
      }
      return out + ")";
    }

    return js(false);
  }

  root.LabJSX = { transform };
  if (typeof module !== "undefined") module.exports = { transform };
})(typeof window !== "undefined" ? window : globalThis);
