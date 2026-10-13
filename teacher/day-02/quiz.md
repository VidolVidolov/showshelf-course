# Day 2 · Quiz

## Opening recap (Day 1: Your first web page)

Ask out loud at the start of the lecture. Let several people answer before you give the answer.

**1. An HTML element has three parts. What are they?**
> The opening tag, the content and the closing tag, for example `<h1>Friends</h1>`. The closing tag has a slash.

**2. Which element shows a picture, and what are its two important attributes?**
> `<img>`. `src` says where the picture is; `alt` describes it in words. `<img>` has no closing tag.

**3. What's the difference between `<ul>` and `<ol>`? What goes inside both?**
> `<ul>` shows bullets; `<ol>` numbers the items, for when the order matters. Inside both go `<li>` items, one per item.

**4. Where does an attribute like `class="meta"` go?**
> In the opening tag, as `name="value"` with quotes: `<p class="meta">`. A class is a label. Today CSS uses it.

**5. In the seasons table, what are `<tr>`, `<th>` and `<td>`?**
> `<tr>` is one row, `<th>` is a heading cell, `<td>` is a normal data cell.

---

## End-of-day check (for the afternoon teacher)

**1. This rule does nothing. Why?**
```css
meta {
  color: grey;
}
```
> A class selector needs a dot: `.meta`. Without it, CSS looks for an element called `<meta>`.

**2. You want more space between a card's border and the text inside it. `padding` or `margin`?**
> `padding`: it's the space inside the border. `margin` is the space outside, between the card and its neighbours.

**3. What does `color: var(--color-accent);` do, and why must the names be exactly `--color-accent` and `--color-bg`?**
> It uses the colour stored in the variable `--color-accent` (defined in `:root`). The Lab carries these two variables into every page from Day 3 on, so the names must match exactly.

**Ask them to show you:** their `:root` rule. Ask them to change `--color-accent` to another colour and watch the headings and the links change together. Check that `--color-bg` is a light colour.
