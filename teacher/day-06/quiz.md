# Day 6 · Quiz

## Opening recap (Day 5)

Ask one question at a time. Give the class a moment before you show the answer.

**1. What's the difference between these two lines?**
```js
function sayHello() { console.log("Hello!"); }
sayHello();
```
> The first line **defines** the function: it writes the recipe, nothing runs. The second **calls** it: the name and brackets, and now "Hello!" appears.

**2. In `function greet(name)` and `greet("Ana")`, which is the parameter and which is the argument?**
> `name` is the parameter (the empty box in the definition). `"Ana"` is the argument (the value you put in when you call).

**3. Yesterday the cards first said "undefined hours". Why, and what fixed it?**
> `watchTime` used `console.log`, which only shows the value in the Console; page.js got nothing back, which is `undefined`. `return` fixed it: it gives the value back to the code that called the function.

**4. What does this return for `label(9.5)`, and why is that a bug?**
```js
function label(rating) {
  if (rating >= 8) {
    return "Good";
  } else if (rating >= 9) {
    return "Must watch";
  }
}
```
> "Good". JavaScript stops at the first true condition, and 9.5 is also `>= 8`. The strictest test must come first.

**5. Rewrite as an arrow function: `function double(n) { return n * 2; }`**
> `const double = (n) => n * 2;` One value after the arrow is returned automatically.

---

## End-of-day check (for the afternoon teacher)

**1. `const favourites = ["Dark", "Fleabag", "The Wire"];` What is `favourites[1]`, and how do you get the last one?**
> `"Fleabag"`: counting starts at 0. The last one is `favourites[favourites.length - 1]` (here `favourites[2]`, `"The Wire"`).

**2. `filter`, `map` or `find`? a) the names of all the shows b) only the comedies c) the show with id 7**
> a) `map` b) `filter` c) `find`

**3. Why does this never find anything?**
```js
shows.filter((show) => show.genres === "Comedy");
```
> `genres` is an array, like `["Comedy", "Romance"]`, and an array is never equal to one string. Use `show.genres.includes("Comedy")`.

**Ask them to show you:** the page with all five sections filled, then type `THE` in the search box and explain why How I Met Your Mother appears.
