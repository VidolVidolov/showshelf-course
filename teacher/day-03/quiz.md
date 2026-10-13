# Day 3 · Quiz

## Opening recap (Day 2: Style it)

Ask out loud at the start of the lecture. Let several people answer before you give the answer.

**1. In this rule, what is the selector, what is the property and what is the value?**
```css
h1 {
  color: #5b3fd6;
}
```
> `h1` is the selector (which elements), `color` is the property (what to change), `#5b3fd6` is the value. The declaration ends with `;`.

**2. Why does `background-colour: lavender;` do nothing?**
> CSS uses American spelling: `background-color`. A line CSS can't read is skipped, with no error.

**3. How do you select every element with `class="meta"`?**
> With a dot: `.meta { ... }`.

**4. Name the four layers of the box model, from the inside out.**
> Content, padding (inside the border), border, margin (outside the border).

**5. Where did you put your own colours yesterday, and how do you use one?**
> In a `:root { }` rule, as `--color-accent` and `--color-bg`. You use one with `var(--color-accent)`. They're in today's page already.

---

## End-of-day check (for the afternoon teacher)

**1. The logo and the menu are both inside `<div class="container header-inner">`. To put them in a row, which box gets `display: flex`?**
> `.header-inner`, the parent. The parent decides how its children are arranged.

**2. What does `grid-template-columns: repeat(2, 1fr);` do?**
> It makes two columns of equal width that share the free space (`1fr` = one fraction). The cards fill them left to right, row by row.

**3. You added `@media (min-width: 600px)` with 3 columns, but the preview still shows 2. Is your code broken?**
> Probably not: the preview is narrower than 600px, so the media query doesn't apply. Press **Bigger** and make that window wider. (If it still doesn't change, check the round brackets, `px` and the second `}`.)

**Ask them to show you:** press **Bigger**, then drag the edge of the window slowly from narrow to wide. The grid should go from 2 to 3 to 4 columns, and a card should lift when the mouse is over it.
