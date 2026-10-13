// Bundle the Monaco editor (the editor inside VS Code) for ShowShelf Lab.
// Usage: node tools/build-monaco.js <path to the unpacked monaco-editor package> [esbuild module path]
// Writes src/vendor/monaco.js (editor + its CSS + the 4 web workers as strings).
const fs = require("fs");
const path = require("path");
const os = require("os");
const pkg = path.resolve(process.argv[2] || "");
if (!fs.existsSync(path.join(pkg, "esm/vs/editor/edcore.main.js"))) {
  console.error("Give the path of the unpacked monaco-editor package (the folder with package.json and esm/)");
  process.exit(1);
}
const esbuild = require(process.argv[3] || "esbuild");
const version = JSON.parse(fs.readFileSync(path.join(pkg, "package.json"), "utf8")).version;
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "monaco-"));
const E = (p) => JSON.stringify(path.join(pkg, "esm/vs", p));

fs.writeFileSync(path.join(tmp, "main.js"), `
import * as monaco from ${E("editor/edcore.main.js")};
import ${E("language/html/monaco.contribution.js")};
import ${E("language/css/monaco.contribution.js")};
import ${E("language/typescript/monaco.contribution.js")};
import ${E("basic-languages/html/html.contribution.js")};
import ${E("basic-languages/css/css.contribution.js")};
import ${E("basic-languages/javascript/javascript.contribution.js")};
window.monaco = monaco;
`);
const common = { bundle: true, minify: true, format: "iife", legalComments: "none", logLevel: "error", target: "es2020" };
esbuild.buildSync({ ...common, entryPoints: [path.join(tmp, "main.js")], outfile: path.join(tmp, "out/main.js"), loader: { ".ttf": "dataurl" } });
const workers = {
  editor: "editor/editor.worker.js",
  css: "language/css/css.worker.js",
  html: "language/html/html.worker.js",
  ts: "language/typescript/ts.worker.js",
};
const workerCode = {};
for (const [k, p] of Object.entries(workers)) {
  const r = esbuild.buildSync({ ...common, entryPoints: [path.join(pkg, "esm/vs", p)], write: false });
  workerCode[k] = r.outputFiles[0].text;
}
const js = fs.readFileSync(path.join(tmp, "out/main.js"), "utf8");
const css = fs.readFileSync(path.join(tmp, "out/main.css"), "utf8");
const safe = (s) => JSON.stringify(s).replace(/<\//g, "<\\/").replace(/<!--/g, "<\\!--");
const out = `/* Monaco editor ${version} (MIT, https://github.com/microsoft/monaco-editor), bundled by tools/build-monaco.js */
window.LabMonaco = {
  version: ${JSON.stringify(version)},
  css: ${safe(css)},
  workers: {${Object.entries(workerCode).map(([k, v]) => `\n    ${k}: ${safe(v)}`).join(",")}\n  },
  load: function () {
    if (window.monaco) return window.monaco;
    var st = document.createElement("style"); st.textContent = this.css; document.head.appendChild(st);
    var self = this, urls = {};
    window.MonacoEnvironment = { getWorker: function (id, label) {
      var k = label === "css" || label === "scss" || label === "less" ? "css" : label === "html" || label === "handlebars" || label === "razor" ? "html" : label === "typescript" || label === "javascript" ? "ts" : "editor";
      if (!urls[k]) urls[k] = URL.createObjectURL(new Blob([self.workers[k]], { type: "text/javascript" }));
      return new Worker(urls[k], { name: label });
    } };
    (0, eval)(this.main);
    return window.monaco;
  },
  main: ${safe(js)}
};
`;
fs.mkdirSync(path.join(__dirname, "../src/vendor"), { recursive: true });
fs.writeFileSync(path.join(__dirname, "../src/vendor/monaco.js"), out);
fs.copyFileSync(path.join(pkg, "LICENSE"), path.join(__dirname, "../src/vendor/monaco-LICENSE.txt"));
const kb = (s) => Math.round(s.length / 1024) + " KB";
console.log("monaco", version, "main", kb(js), "css", kb(css), Object.entries(workerCode).map(([k, v]) => k + " " + kb(v)).join(", "), "total", kb(out));
fs.rmSync(tmp, { recursive: true, force: true });
