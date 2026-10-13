/* A pretend Express server that runs inside the Lab preview (Day 10).
   It understands the same code as real Express for the parts we teach:
   express(), app.use, app.get/post/put/patch/delete, req.params/query/body,
   res.status().json(), res.send(), res.sendStatus(), app.listen().
   fetch("/api/...") in the preview is answered by it. */
(function () {
  "use strict";
  function compile(path) {
    const keys = [];
    const re = new RegExp("^" + path.replace(/\/+$/, "").replace(/[.+*?^$()[\]{}|\\]/g, "\\$&").replace(/:(\w+)/g, (m, k) => { keys.push(k); return "([^/]+)"; }) + "/?$");
    return { re, keys };
  }
  function express() {
    const routes = [];
    const middleware = [];
    const app = {
      use(a, b) { middleware.push(typeof a === "function" ? a : b); return app; },
      listen(port, cb) {
        console.log("Server is listening on port " + port + " (inside the Lab)");
        if (typeof cb === "function") try { cb(); } catch (e) { console.error(e); }
        return app;
      },
    };
    ["get", "post", "put", "patch", "delete"].forEach((m) => {
      app[m] = (path, ...handlers) => {
        if (typeof path !== "string" || path[0] !== "/") throw new Error("The address of a route must start with /, like \"/api/mylist\"");
        routes.push({ method: m.toUpperCase(), path, handlers, ...compile(path) });
        return app;
      };
    });
    window.__labServer = {
      routes,
      handle(method, url, opts) {
        return new Promise((resolve) => {
          const u = new URL(url, "http://localhost:3000");
          const path = u.pathname;
          const query = {};
          u.searchParams.forEach((v, k) => { query[k] = v; });
          let body = {};
          if (opts && opts.body != null) {
            try { body = JSON.parse(opts.body); } catch (e) { body = opts.body; }
          }
          const req = { method, path, url: path + u.search, query, body, params: {}, headers: (opts && opts.headers) || {} };
          let status = 200, done = false;
          const finish = (payload, type) => {
            if (done) { console.warn("The server tried to answer twice. Only the first answer counts: use return res.json(...)"); return; }
            done = true;
            console.info(method + " " + path + "  \u2192  " + status);
            const noBody = status === 204 || status === 304;
            resolve(new Response(noBody ? null : payload, { status, headers: { "Content-Type": type } }));
          };
          const res = {
            status(code) { status = code; return res; },
            json(obj) { finish(JSON.stringify(obj === undefined ? null : obj), "application/json"); return res; },
            send(x) { if (x !== null && typeof x === "object") return res.json(x); finish(x == null ? "" : String(x), "text/plain"); return res; },
            sendStatus(code) { status = code; finish(String(code), "text/plain"); return res; },
            end() { finish("", "text/plain"); return res; },
            get headersSent() { return done; },
          };
          const route = routes.find((r) => r.method === method && r.re.test(path));
          const chain = middleware.slice();
          if (route) {
            const m = route.re.exec(path);
            route.keys.forEach((k, i) => { req.params[k] = decodeURIComponent(m[i + 1]); });
            chain.push(...route.handlers);
          } else {
            chain.push((rq, rs) => {
              const other = routes.some((r) => r.re.test(path));
              rs.status(404).json({ error: other ? "This address exists, but not for " + method : "Cannot " + method + " " + path });
            });
          }
          let k = 0;
          const next = (err) => {
            if (done) return;
            if (err) { status = 500; console.error(err); return res.json({ error: "Server error" }); }
            const h = chain[k++];
            if (!h) return;
            try {
              const r = h(req, res, next);
              if (r && typeof r.catch === "function") r.catch((e) => { console.error("Error in your route: " + (e && e.message)); if (!done) res.status(500).json({ error: "Server error" }); });
            } catch (e) {
              console.error("Error in your route for " + method + " " + path + ": " + e.message);
              if (!done) res.status(500).json({ error: "Server error" });
            }
          };
          setTimeout(next, 30); // a real server is a little bit away
          setTimeout(() => {
            if (!done) {
              console.error("The server never answered " + method + " " + path + ". Every route must end with res.json(...) or res.send(...).");
              status = 504;
              finish(JSON.stringify({ error: "No answer from the server" }), "application/json");
            }
          }, 2500);
        });
      },
    };
    return app;
  }
  express.json = () => (req, res, next) => next();
  express.static = () => (req, res, next) => next();
  window.express = express;
  window.cors = () => (req, res, next) => next();
})();
