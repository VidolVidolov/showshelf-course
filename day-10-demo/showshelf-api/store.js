// =========================================================
// store.js - saves My List in mylist.json
// A tiny "database". In a real app this would be PostgreSQL or MongoDB.
// =========================================================
import { readFile, writeFile } from "node:fs/promises";

// The file next to this one (works wherever you start the server from)
const FILE = new URL("./mylist.json", import.meta.url);

export async function readList() {
  try {
    const text = await readFile(FILE, "utf8");
    return JSON.parse(text);
  } catch (error) {
    if (error.code === "ENOENT") return []; // file doesn't exist yet
    throw error;
  }
}

export async function writeList(list) {
  // null, 2 = pretty-print with 2 spaces, so you can read the file yourself
  await writeFile(FILE, JSON.stringify(list, null, 2));
}
