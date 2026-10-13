// =========================================================
// server.js - ShowShelf API (Day 9)
// Run:  npm run dev   ->  http://localhost:3000
// =========================================================
import express from "express";
import { readList, writeList } from "./store.js";

const app = express();
const PORT = 3000;

// The only values allowed for "status"
const STATUSES = ["want", "watching", "watched"];

// ---------- Middleware: runs for EVERY request, before the routes ----------

// Turns a JSON request body into req.body
app.use(express.json());

// Stretch: log method, URL, status and how long the request took
app.use((req, res, next) => {
  const start = Date.now();
  res.on("finish", () => {
    console.log(`${req.method} ${req.originalUrl} -> ${res.statusCode} (${Date.now() - start} ms)`);
  });
  next(); // pass the request on to the next middleware or route
});

// ---------- Routes ----------

app.get("/", (req, res) => {
  res.json({ message: "ShowShelf API" });
});

// GET every show in My List
app.get("/api/mylist", async (req, res) => {
  const list = await readList();
  res.json(list);
});

// GET one show by id (route parameter)
app.get("/api/mylist/:id", async (req, res) => {
  const id = Number(req.params.id); // ids in the URL are always text: "169" -> 169
  const list = await readList();
  const item = list.find((show) => show.id === id);

  if (!item) {
    return res.status(404).json({ error: "Show not in your list" });
  }
  res.json(item);
});

// POST a new show. Body: { id, name, image?, genres?, rating? }
app.post("/api/mylist", async (req, res) => {
  const { id, name, image, genres, rating } = req.body ?? {};

  // Validation: never trust data from the client
  if (typeof id !== "number" || !name) {
    return res.status(400).json({ error: "id (number) and name are required" });
  }

  const list = await readList();
  if (list.some((show) => show.id === id)) {
    return res.status(409).json({ error: "This show is already in your list" });
  }

  const item = {
    id,
    name,
    image: image ?? null,
    genres: genres ?? [],
    rating: rating ?? null,
    status: "want", // "want" | "watching" | "watched"
    myRating: null, // your own rating, 1 to 5
    note: "",
    addedAt: new Date().toISOString(),
  };
  list.push(item);
  await writeList(list);

  res.status(201).json(item); // 201 = Created
});

// Stretch: PATCH part of a show. Body: { status?, myRating?, note? }
// Only these three fields can change. Anything else in the body is ignored.
app.patch("/api/mylist/:id", async (req, res) => {
  const { status, myRating, note } = req.body ?? {};

  // Check every field that was sent (undefined = not sent)
  if (status !== undefined && !STATUSES.includes(status)) {
    return res.status(400).json({ error: 'status must be "want", "watching" or "watched"' });
  }
  // null is allowed: it clears your rating
  if (myRating !== undefined && myRating !== null && !(Number.isInteger(myRating) && myRating >= 1 && myRating <= 5)) {
    return res.status(400).json({ error: "myRating must be a whole number from 1 to 5, or null" });
  }
  if (note !== undefined && (typeof note !== "string" || note.length > 500)) {
    return res.status(400).json({ error: "note must be text of at most 500 characters" });
  }

  const id = Number(req.params.id);
  const list = await readList();
  const item = list.find((show) => show.id === id);
  if (!item) {
    return res.status(404).json({ error: "Show not in your list" });
  }

  if (status !== undefined) item.status = status;
  if (myRating !== undefined) item.myRating = myRating;
  if (note !== undefined) item.note = note;
  await writeList(list);

  res.json(item);
});

// DELETE a show from My List
app.delete("/api/mylist/:id", async (req, res) => {
  const id = Number(req.params.id);
  const list = await readList();
  const remaining = list.filter((show) => show.id !== id);

  if (remaining.length === list.length) {
    return res.status(404).json({ error: "Show not in your list" });
  }

  await writeList(remaining);
  res.status(204).end(); // 204 = No Content (success, nothing to send back)
});

// ---------- Errors ----------

// Any route we didn't define
app.use((req, res) => {
  res.status(404).json({ error: "Not found" });
});

// Error handler: 4 parameters. Express 5 sends errors from async routes here automatically.
app.use((err, req, res, next) => {
  // Broken JSON in the request body
  if (err.type === "entity.parse.failed") {
    return res.status(400).json({ error: "Invalid JSON" });
  }
  console.error(err);
  res.status(500).json({ error: "Something went wrong on the server" });
});

app.listen(PORT, () => {
  console.log(`ShowShelf API running on http://localhost:${PORT}`);
});
