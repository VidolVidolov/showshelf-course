# Day 1 · Quiz

## Opening warm-up (no wrong answers)

Ask the room at the start of the lecture. It tells you where people start, and gets everyone talking.

**1. Which websites or apps do you use every day?**
> Collect a few answers. Then: "Every one of them is built from the same three languages. Today you meet the first one, HTML."

**2. When you open a web page, what do you think actually arrives on your computer?**
> Listen for "files", "text" or "code". The short answer: text files. The browser reads them and draws the page. Today you write one of those files yourself.

**3. Think of a page about a film or a TV show. What pieces does it usually have?**
> Listen for: a title, a picture, a short description, lists (cast, genres), links, maybe a table of seasons. Say: "That's exactly the list of things you'll build today, one at a time."

---

## End-of-day check (for the afternoon teacher)

Ask out loud in the last 10 minutes, or go round and ask a few students each.

**1. What's wrong here?**
```html
<h1>Friends<h1>
```
> The closing tag needs a slash: `</h1>`. An element is an opening tag, the content and a closing tag.

**2. You want a list of your three favourite characters, in order. `<ul>` or `<ol>`? And what goes inside it?**
> `<ol>`, because the order matters (it numbers the items for you). Inside go `<li>` items, one per character.

**3. What is the `alt` attribute of an `<img>` for?**
> It describes the picture in words: screen readers read it out, and the browser shows it when the picture can't load. (And `<img>` has no closing tag.)

**Ask them to show you:** the seasons table in their preview, then the three rows for seasons 1–3 in their code. Each row is a `<tr>` with three `<td>` cells, and all rows are before `</table>`.
