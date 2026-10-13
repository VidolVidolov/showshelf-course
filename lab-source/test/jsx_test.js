let ts;
try { ts = require("typescript"); } catch (e) { // fall back to a global install: npm i -g typescript
  ts = require(require("child_process").execSync("npm root -g").toString().trim() + "/typescript");
}
const { transform } = require("../src/jsx.js");
const React = { Fragment: "FRAG", createElement: (type, props, ...children) => ({ type: typeof type === "function" ? type.name : type, props, children }) };
const cases = [
  `const a = <h1>Hello</h1>;`,
  `const a = <h1 className="title">Hello, {name}!</h1>;`,
  `function Card({ show }) {\n  return (\n    <article className="card">\n      <h3>{show.name}</h3>\n      <p className="meta">{show.network} · {show.premiered}</p>\n    </article>\n  );\n}\nconst x = Card({show:{name:"F",network:"NBC",premiered:1994}});`,
  `const list = [1,2,3];\nconst u = <ul>{list.map((n) => <li key={n}>Item {n}</li>)}</ul>;`,
  `const ok = true;\nconst u = <div>{ok && <p>Don't panic</p>}{ok ? <b>yes</b> : <i>no</i>}</div>;`,
  `const u = <>\n  <h1>A</h1>\n  <p>B</p>\n</>;`,
  `const p = {id: 3};\nconst u = <input type="search" value={"x"} disabled onChange={(e) => e} {...p} />;`,
  `const u = <img src="poster.svg" alt="" />;`,
  `const u = <p>\n  Six friends   share\n  apartments &amp; coffee&nbsp;x\n</p>;`,
  `const u = <div aria-label="Close" data-id={5}>{/* a comment */}</div>;`,
  `function App(){ const [n,setN]=[0,()=>{}]; return <button onClick={() => setN(n + 1)}>Clicked {n} times</button>; }\nconst u = App();`,
  `const s = \`\${1 < 2} <b>\`; const u = <p>{\`\${s}!\`}</p>;`,
  `const a = 1 < 2, b = 3 > 1; const u = a && <p>{a < b ? "lt" : "ge"}</p>;`,
  `const Comp = () => <section><h2>T</h2>{[1,2].map(i => (\n  <div key={i}>\n    <span>{i}</span>\n  </div>\n))}</section>;\nconst u = Comp();`,
  `const u = <Foo.Bar x="1"><Baz /></Foo.Bar>; function Baz(){}`,
  `const u = <p>{"a"}{" "}{"b"}</p>;`,
  `const u = <p>  leading and trailing  </p>;`,
  `const u = <a href="https://www.tvmaze.com/shows/431/friends" target="_blank">TVmaze</a>;`,
  `const shows=[{id:1,name:"A"}]; const u = <ul>\n{shows.length === 0 ? (\n  <li>None</li>\n) : (\n  shows.map((s) => <li key={s.id}>{s.name}</li>)\n)}\n</ul>;`,
  `const u = <div style={{ color: "red", padding: 4 }}>x</div>;`,
];
const Foo = { Bar: "FooBar" };
let fails = 0;
for (const c of cases) {
  const ours = transform(c);
  const theirs = ts.transpileModule(c, { compilerOptions: { jsx: ts.JsxEmit.React, target: ts.ScriptTarget.ES2020 } }).outputText;
  const run = (code) => { const f = new Function("React", "Foo", "name", code + "\n;return typeof u !== 'undefined' ? u : (typeof a !== 'undefined' ? a : (typeof x !== 'undefined' ? x : null));"); return JSON.stringify(f(React, Foo, "Vidol")); };
  let r1, r2;
  try { r1 = run(ours); } catch (e) { r1 = "ERR " + e.message; }
  try { r2 = run(theirs); } catch (e) { r2 = "ERR " + e.message; }
  const lines = ours.split("\n").length === c.split("\n").length;
  if (r1 !== r2 || !lines) { fails++; console.log("MISMATCH:", c, "\n ours:", ours, "\n", r1, "\n ts:  ", r2, lines ? "" : "\n LINE COUNT DIFFERS"); }
}
// errors that beginners make
for (const bad of [`const u = <p>Hi</div>;`, `const u = <p>Hi;`, `const u = <img src="x">;`, `const u = <p class=big>x</p>;`]) {
  try { transform(bad); console.log("NO ERROR for", bad); fails++; } catch (e) { console.log("error ok:", e.message); }
}
console.log(fails ? fails + " FAILED" : "all " + cases.length + " cases match TypeScript");
