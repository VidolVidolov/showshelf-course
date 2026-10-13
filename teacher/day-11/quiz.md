# Day 11 · Quiz

## Opening recap (Day 10)

Ask one question at a time. Give the class a moment before you show the answer.

**1. What is a React component? Name its two rules.**
> A function that returns what part of the page should look like, written in JSX. Its name starts with a capital letter (`ShowCard`, used as `<ShowCard />`), and it returns one outer element.

**2. In JSX, why do we write `className` and not `class`? And what do curly brackets `{ }` do?**
> `class` is a reserved word in JavaScript. Curly brackets mean "this part is JavaScript: work it out and show the result", like `{shows.length}`.

**3. `const [count, setCount] = React.useState(0);` What are `count` and `setCount`?**
> `count` is the current value of the state (it starts at 0). `setCount` changes it, and React then draws the component again.

**4. Which method do you use to get the list, to add a show, and to remove a show?**
> GET to get the list, POST to add (with a body, read as `req.body`), DELETE to remove (`/api/mylist/:id`).

**5. What do 201, 400 and 404 mean? Who has the problem when a code starts with 4?**
> 201 Created, 400 Bad Request, 404 Not Found. A 4 means the request was wrong; a 5 means the server has a problem.

---

## End-of-day check (for the afternoon teacher)

**1. Why do the colours in my-theme.css win over the ones in style.css?**
> my-theme.css is loaded after style.css, and when two rules say different things, the later one wins. That's the cascade.

**2. What's the difference between hosting and deploying?**
> Hosting is space on a web server, a computer that's always on and sends your files to visitors. Deploying is putting your files there, for example by dropping your folder on Netlify Drop.

**3. extra.js can call `openShow(id)` and change `state`, without changing app.js. Why does that work?**
> The `<script>` lines load in order, and extra.js is the last one, so everything app.js made already exists when it runs.

**Ask them to show you:** their site at its own address (`.netlify.app` or `.github.io`), opened on a phone or another computer, and their three demo sentences in step 10.
