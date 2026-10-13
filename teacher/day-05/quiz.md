# Day 5 · Quiz

## Opening recap (Day 4)

Ask one question at a time. Give the class a moment before you show the answer.

**1. What does each line print, and why are they different?**
```js
console.log(236 + 62);
console.log("236" + 62);
```
> `298`, then `23662`. Numbers add up; the quotes make `"236"` a string, and `+` joins strings.

**2. You count the episodes you've watched, and the number goes up every evening. `const` or `let`?**
> `let`. A `const` can never get a new value: you'd see "Assignment to constant variable".

**3. Write this with a template literal: `"Watching " + showName + " tonight"`**
> `` `Watching ${showName} tonight` ``: backticks around it all, `${ }` around the variable.

**4. What does this line do?**
```js
document.querySelector("#title").textContent = showName;
```
> It finds the element with `id="title"` and replaces its text with the value of `showName`.

**5. What's wrong here?**
```js
if (showName = "Friends") {
```
> One `=` *puts a value into* `showName`. To *ask* whether they're the same, use three: `showName === "Friends"`.

---

## End-of-day check (for the afternoon teacher)

**1. What's the difference between defining a function and calling it?**
> Defining writes the recipe (`function sayHello() { ... }`); nothing runs yet. Calling runs it: the name and brackets, `sayHello();`.

**2. A function ends with `console.log(hours);` instead of `return hours;`. What does the code that called it get back?**
> `undefined`. `console.log` only shows the value in the Console; `return` gives it back to the caller.

**3. In `ratingLabel`, why must `rating >= 9` come before `rating >= 8`?**
> JavaScript stops at the first true condition. A rating of 9.2 is also `>= 8`, so with the wrong order it would get "Good" instead of "Must watch".

**Ask them to show you:** the four cards with every grey note filled in, and their one-line arrow version of `watchTime` (step 9).
