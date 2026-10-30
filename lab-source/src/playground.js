/* =========================================================
   Playground: a free code box for live demos (the teacher on the projector)
   and for students who want to try things outside the steps.
   Inserted into lab.js by build.py (it uses the Lab's preview, console and editor).
   ========================================================= */
  const PG_KEY = "showshelf-lab-playground";
  const PG_SETUPS = {
    blank: { label: "Blank page", tabs: ["html", "css", "js"] },
    showshelf: { label: "ShowShelf page (styles + 12 shows)", tabs: ["html", "css", "js"], appCss: true, data: true },
    react: { label: "React", tabs: ["jsx", "html", "css"], appCss: true, data: true, react: true },
    server: { label: "Server (Express) + page", tabs: ["server", "js", "html", "css"], appCss: true, server: true },
  };
  const PG_TABS = {
    html: { label: "index.html", lang: "html", file: "index.html" },
    css: { label: "style.css", lang: "css", file: "style.css" },
    js: { label: "app.js", lang: "js", file: "app.js" },
    jsx: { label: "App.jsx", lang: "jsx", file: "App.jsx" },
    server: { label: "server.js", lang: "js", file: "server.js" },
  };
  const PG_EMPTY = { html: "<h1>Hello!</h1>\n", css: "", js: "", jsx: "", server: "" };
  let pg = null;
  let pgTimer = null, pgSaveTimer = null, pgDirty = false;

  function pgLoad() {
    let s = null;
    try { s = JSON.parse(localStorage.getItem(PG_KEY)); } catch (e) { /* blocked storage */ }
    const d = { setup: "blank", code: Object.assign({}, PG_EMPTY), tab: "html", codeSize: 18, zoom: 1, live: true, view: "both", console: true };
    if (s && typeof s === "object") {
      Object.assign(d, s);
      d.code = Object.assign({}, PG_EMPTY, s.code || {});
      if (!PG_SETUPS[d.setup]) d.setup = "blank";
    }
    return d;
  }
  function pgSave() {
    clearTimeout(pgSaveTimer);
    pgSaveTimer = setTimeout(() => { try { localStorage.setItem(PG_KEY, JSON.stringify(pg)); } catch (e) { /* ignore */ } }, 300);
  }

  // the page in the preview: libraries for the setup, then the three (or four) files
  function pgDoc(forFile) {
    const S = PG_SETUPS[pg.setup];
    const c = pg.code;
    let head = '<meta charset="utf-8">\n<meta name="viewport" content="width=device-width, initial-scale=1">\n<title>Playground</title>\n';
    if (S.appCss) head += "<style>\n" + String(Lab.assets.appCss || "").replace(/\{\{theme\}\}/g, "") + "\n</style>\n";
    if (S.react) head += "<script>" + Lab.assets.react + "<\/script>\n";
    if (S.server) head += "<script>" + Lab.assets.expressLite + "<\/script>\n";
    if (S.data) head += "<script>const shows = " + JSON.stringify(Lab.data.shows, null, 1) + ";<\/script>\n";
    head += "<style>\n" + (c.css || "") + "\n</style>\n";
    if (!forFile && pg.zoom !== 1) head += "<style>html{zoom:" + pg.zoom + "}</style>\n";
    let doc = "<!doctype html>\n<html lang=\"en\">\n<head>\n" + (forFile ? "" : RUNTIME) + head + "</head>\n<body>\n" + (c.html || "") + "\n";
    const scripts = [];
    if (pg.setup === "server") scripts.push(c.server || "", c.js || "");
    else if (pg.setup === "react") {
      let code = c.jsx || "";
      try { code = window.LabJSX ? window.LabJSX.transform(code) : code; }
      catch (e) { code = `(function(){var B=window.parent&&window.parent.__labBridge;if(B)B.error(B.run,${JSON.stringify("SyntaxError: " + e.message.replace(/ \(line \d+\)$/, ""))},${e.line || 0});})();`; }
      scripts.push(code);
    } else scripts.push(c.js || "");
    // error line numbers count from the top of the last script (the one the demo is about)
    scripts.forEach((code, i) => {
      if (!code.trim()) return;
      doc += "<script>\n";
      if (i === scripts.length - 1 || pg.setup === "react") bridge.lineOffset = doc.split("\n").length - 1;
      doc += code + "\n<\/script>\n";
    });
    doc += "</body>\n</html>\n";
    if (Lab.assets.poster) doc = doc.replace(/(["'(=]\s*)(?:\.\/)?(?:images\/)?poster\.svg/g, (m, p1) => p1 + Lab.assets.poster);
    return doc;
  }

  function pgRun() {
    clearTimeout(pgTimer);
    const frame = $("#preview");
    if (!frame || !pg) return;
    clearConsole();
    current.logs = [];
    current.errors = [];
    bridge.run++;
    const html = pgDoc(false);
    current.html = html;
    frame.srcdoc = html;
  }
  function pgChanged(tab, value) {
    pg.code[tab] = value;
    pgDirty = true;
    pgSave();
    if (pg.live) { clearTimeout(pgTimer); pgTimer = setTimeout(pgRun, 600); }
  }

  function pgDemoOptions() {
    const demos = Lab.playgroundDemos || [];
    const groups = {};
    demos.forEach((d) => { (groups[d.group] = groups[d.group] || []).push(d); });
    return '<option value="">Load a demo...</option>' + Object.keys(groups).map((g) =>
      `<optgroup label="${esc(g)}">${groups[g].map((d) => `<option value="${esc(d.id)}">${esc(d.title)}</option>`).join("")}</optgroup>`).join("");
  }

  function showPlayground(demoId) {
    pg = pgLoad();
    current = { step: null, logs: [], errors: [], playground: true };
    document.title = "Playground · ShowShelf Lab";
    setCrumbs([["All days", "#/"], ["Playground", ""]]);
    $("#stepper").hidden = true;
    app().innerHTML = `
      <div class="pg view-${pg.view}" id="pg">
        <div class="pg-bar" role="toolbar" aria-label="Playground tools">
          <label class="pg-field">Setup <select id="pgSetup">${Object.entries(PG_SETUPS).map(([k, s]) => `<option value="${k}">${esc(s.label)}</option>`).join("")}</select></label>
          <label class="pg-field">Demos <select id="pgDemo">${pgDemoOptions()}</select></label>
          <button class="btn small" id="pgReset" title="Start with an empty playground">Clear</button>
          <span class="spacer"></span>
          <span class="pg-group" title="Size of the code"><span class="pg-lbl">Code</span><button class="btn small" id="pgFontDown" aria-label="Smaller code">A&minus;</button><span class="pg-val" id="pgFont"></span><button class="btn small" id="pgFontUp" aria-label="Bigger code">A+</button></span>
          <span class="pg-group" title="Zoom of the preview"><span class="pg-lbl">Preview</span><button class="btn small" id="pgZoomOut" aria-label="Zoom the preview out">&minus;</button><span class="pg-val" id="pgZoom"></span><button class="btn small" id="pgZoomIn" aria-label="Zoom the preview in">+</button></span>
          <span class="pg-group pg-views" title="What to show">${["code", "both", "preview"].map((v) => `<button class="btn small" data-view="${v}">${v[0].toUpperCase() + v.slice(1)}</button>`).join("")}</span>
          <label class="switch pg-live" title="Run the page while you type"><input type="checkbox" id="pgLive"> Live</label>
          <button class="btn primary small" id="pgRun" title="Run (Ctrl + Enter)">&#9654; Run</button>

        </div>
        <div class="pg-main">
          <section class="pane editor-pane vscode" aria-label="Code">
            <div class="tabs" role="tablist" id="pgTabs"></div>
            <div class="editor" id="pgEditor"><textarea id="pgCode" class="pg-plain" spellcheck="false" autocapitalize="off" autocomplete="off" autocorrect="off" aria-label="Code"></textarea></div>
          </section>
          <section class="pane preview-pane" aria-label="Preview">
            <div class="bar-top"><b>Preview</b><span id="pgSetupName"></span><span class="spacer"></span>
              <button class="btn ghost small" id="reload" title="Run again">${ICON.reload} Run again</button>
              <button class="btn ghost small" id="pgSaveFile" title="Download this page as one HTML file">Save file</button>
              <button class="btn ghost small" id="newtab" title="Open the preview in a new tab">${ICON.ext} Bigger</button>
            </div>
            <iframe id="preview" title="Preview"></iframe>
            <div class="console ${pg.console ? "" : "closed"}" id="console">
              <div class="console-head" id="consoleHead"><b>Console</b><span class="count" id="ccount">0</span><span class="spacer" style="flex:1"></span><button class="btn ghost small" id="pgClearConsole">Clear</button><span>${pg.console ? "hide" : "show"}</span></div>
              <div class="console-body" id="cbody"></div>
            </div>
          </section>
        </div>
      </div>`;

    const m = simpleEditorWanted() ? null : getMonaco();
    const models = {};
    let editor = null;
    if (m) {
      const host = document.createElement("div");
      host.className = "monaco-host";
      $("#pgCode").remove();
      $("#pgEditor").classList.add("monaco");
      $("#pgEditor").appendChild(host);
      const uid = "pg" + Date.now().toString(36);
      for (const [k, t] of Object.entries(PG_TABS)) {
        models[k] = m.editor.createModel(pg.code[k] || "", MLANG[t.lang] || "plaintext", m.Uri.parse(`file:///${uid}/${t.file}`));
        models[k].onDidChangeContent(() => pgChanged(k, models[k].getValue()));
      }
      pgAutoClose(m, () => editor, models.html);
      editor = m.editor.create(host, {
        model: models[pg.tab] || models.html,
        theme: "vs-dark", automaticLayout: true,
        fontFamily: getComputedStyle(document.documentElement).getPropertyValue("--mono").trim() || "monospace",
        fontSize: pg.codeSize, lineHeight: Math.round(pg.codeSize * 1.5), tabSize: 2, insertSpaces: true, detectIndentation: false,
        minimap: { enabled: false }, wordWrap: "on", wrappingIndent: "indent", scrollBeyondLastLine: false, fixedOverflowWidgets: true,
        padding: { top: 12, bottom: 12 }, bracketPairColorization: { enabled: true }, ariaLabel: "Code",
      });
      editor.addCommand(m.KeyMod.CtrlCmd | m.KeyCode.Enter, () => pgRun());
      editor.addCommand(m.KeyMod.CtrlCmd | m.KeyCode.KeyS, () => toast("The playground saves by itself. To keep a copy, use Save as file."));
      mon = { editor, models: Object.values(models) };
    } else {
      const ta = $("#pgCode");
      ta.addEventListener("input", () => pgChanged(pg.tab, ta.value));
      ta.addEventListener("keydown", (e) => {
        if ((e.ctrlKey || e.metaKey) && e.key === "Enter") { e.preventDefault(); pgRun(); }
        else if (e.key === "Tab") { e.preventDefault(); ta.setRangeText("  ", ta.selectionStart, ta.selectionEnd, "end"); pgChanged(pg.tab, ta.value); }
      });
    }

    const setLibs = () => {
      if (!m) return;
      const libs = [];
      const S = PG_SETUPS[pg.setup];
      if (S.data) libs.push({ filePath: "file:///lab/shows.js", content: "const shows = " + JSON.stringify(Lab.data.shows, null, 2) + ";" });
      if (S.react) libs.push({ filePath: "file:///lab/react-globals.d.ts", content: REACT_DTS });
      if (S.server) libs.push({ filePath: "file:///lab/express-globals.d.ts", content: EXPRESS_DTS });
      try { m.languages.typescript.javascriptDefaults.setExtraLibs(libs); } catch (e) { /* fine without */ }
    };
    const showTab = (k) => {
      pg.tab = k;
      document.querySelectorAll("#pgTabs .tab").forEach((b) => b.classList.toggle("active", b.dataset.tab === k));
      if (editor) { editor.setModel(models[k]); editor.focus(); }
      else { const ta = $("#pgCode"); ta.value = pg.code[k] || ""; ta.focus(); }
      pgSave();
    };
    const renderTabs = () => {
      const S = PG_SETUPS[pg.setup];
      if (!S.tabs.includes(pg.tab)) pg.tab = S.tabs[0];
      $("#pgTabs").innerHTML = S.tabs.map((k) => `<button class="tab" data-tab="${k}">${esc(PG_TABS[k].label)}</button>`).join("");
      document.querySelectorAll("#pgTabs .tab").forEach((b) => b.addEventListener("click", () => showTab(b.dataset.tab)));
      $("#pgSetup").value = pg.setup;
      $("#pgSetupName").textContent = S.data ? "· shows has the 12 shows" : "";
      setLibs();
      showTab(pg.tab);
    };
    const setValues = () => {
      for (const k of Object.keys(PG_TABS)) {
        if (editor) { if (models[k].getValue() !== (pg.code[k] || "")) models[k].setValue(pg.code[k] || ""); }
      }
      if (!editor) $("#pgCode").value = pg.code[pg.tab] || "";
    };
    const applySizes = () => {
      $("#pgFont").textContent = pg.codeSize;
      $("#pgZoom").textContent = Math.round(pg.zoom * 100) + "%";
      if (editor) editor.updateOptions({ fontSize: pg.codeSize, lineHeight: Math.round(pg.codeSize * 1.5) });
      else $("#pgCode").style.fontSize = pg.codeSize + "px";
    };
    const setView = (v) => {
      pg.view = v;
      $("#pg").className = "pg view-" + v;
      document.querySelectorAll(".pg-views button").forEach((b) => b.classList.toggle("on", b.dataset.view === v));
      pgSave();
    };
    const loadDemo = async (id) => {
      const d = (Lab.playgroundDemos || []).find((x) => x.id === id);
      if (!d) return;
      if (pgDirty && !(await ask("Replace the code in the playground with the demo \"" + d.title + "\"? (Save as file first if you want to keep it.)", "Load the demo"))) { $("#pgDemo").value = ""; return; }
      pg.setup = d.setup || "blank";
      pg.code = Object.assign({}, PG_EMPTY, { html: "", css: "", js: "", jsx: "", server: "" }, d.code);
      pg.tab = d.tab || PG_SETUPS[pg.setup].tabs.find((k) => (pg.code[k] || "").trim()) || PG_SETUPS[pg.setup].tabs[0];
      setValues();
      renderTabs();
      pgDirty = false;
      pgSave();
      pgRun();
      $("#pgDemo").value = "";
      toast("Loaded: " + d.title);
    };

    $("#pgSetup").addEventListener("change", (e) => { pg.setup = e.target.value; renderTabs(); pgSave(); pgRun(); });
    $("#pgDemo").addEventListener("change", (e) => loadDemo(e.target.value));
    $("#pgFontDown").addEventListener("click", () => { pg.codeSize = Math.max(12, pg.codeSize - 2); applySizes(); pgSave(); });
    $("#pgFontUp").addEventListener("click", () => { pg.codeSize = Math.min(36, pg.codeSize + 2); applySizes(); pgSave(); });
    $("#pgZoomOut").addEventListener("click", () => { pg.zoom = Math.max(0.5, Math.round((pg.zoom - 0.1) * 10) / 10); applySizes(); pgSave(); pgRun(); });
    $("#pgZoomIn").addEventListener("click", () => { pg.zoom = Math.min(2.5, Math.round((pg.zoom + 0.1) * 10) / 10); applySizes(); pgSave(); pgRun(); });
    document.querySelectorAll(".pg-views button").forEach((b) => b.addEventListener("click", () => setView(b.dataset.view)));
    $("#pgLive").checked = pg.live;
    $("#pgLive").addEventListener("change", (e) => { pg.live = e.target.checked; pgSave(); if (pg.live) pgRun(); });
    $("#pgRun").addEventListener("click", pgRun);
    $("#reload").addEventListener("click", pgRun);
    $("#newtab").addEventListener("click", openBig);
    $("#pgSaveFile").addEventListener("click", () => saveFile("playground.html", pgDoc(true), "text/html"));
    $("#pgReset").addEventListener("click", async () => {
      if (!(await ask("Clear all the code in the playground?", "Clear all"))) return;
      pg.code = Object.assign({}, PG_EMPTY);
      pg.setup = "blank";
      pg.tab = "html";
      setValues();
      renderTabs();
      pgDirty = false;
      pgSave();
      pgRun();
    });
    $("#pgClearConsole").addEventListener("click", (e) => { e.stopPropagation(); clearConsole(); });
    $("#consoleHead").addEventListener("click", () => {
      const c = $("#console");
      c.classList.toggle("closed");
      pg.console = !c.classList.contains("closed");
      $("#consoleHead span:last-child").textContent = pg.console ? "hide" : "show";
      pgSave();
    });

    renderTabs();
    applySizes();
    setView(pg.view);
    pgDirty = false;
    if (demoId && (Lab.playgroundDemos || []).some((d) => d.id === demoId)) {
      pgDirty = false;
      loadDemo(demoId);
      try { history.replaceState(null, "", "#/playground"); } catch (e) { /* fine */ }
    } else pgRun();
  }

  // VS Code closes an HTML tag for you when you type the > of the opening tag
  function pgAutoClose(m, getEditor, model) {
    model.onDidChangeContent((e) => {
      const editor = getEditor();
      if (!editor || editor.getModel() !== model || e.changes.length !== 1 || e.changes[0].text !== ">" || e.isUndoing || e.isRedoing || e.isFlush) return;
      const c = e.changes[0];
      const line = c.range.startLineNumber, col = c.range.startColumn + 1;
      const text = model.getLineContent(line);
      const before = text.slice(0, col - 1), after = text.slice(col - 1);
      const mt = before.match(/<([a-zA-Z][\w-]*)(?:\s[^<>]*)?>$/);
      if (!mt || /\/>$/.test(before) || VOID_TAGS.test(mt[1]) || after.trimStart().toLowerCase().startsWith("</" + mt[1].toLowerCase())) return;
      setTimeout(() => {
        if (editor.getModel() !== model) return;
        editor.executeEdits("pg-autoclose", [{ range: new m.Range(line, col, line, col), text: "</" + mt[1] + ">" }]);
        editor.setPosition({ lineNumber: line, column: col });
      }, 0);
    });
  }
