# Day 10 · Script: How real apps are built

**Lecture:** 90 min · **Goal:** students see a real React project and a real Express server running on your laptop, recognise components, props, state, routes and status codes in them, and know how the Lab's small versions relate to the real ones, so that this afternoon they can try both ideas themselves.

**Before class:**
- Open ShowShelf Lab on the projector at Day 10's overview: `#/day/10` at the end of the address.
- **Help › Teacher view** shows the answer and the common mistakes on every step. Use it when you show an answer; switch it off during the demos, so the answers aren't on the projector.
- Slides: *Web Dev Guided · Day 10*.
- **Node.js 20.19 or newer** on your laptop: `node -v` in a terminal. The React project uses Vite 7, which needs it.
- **Install both projects the day before**, on a good connection (`npm install` downloads a few hundred files; slow on classroom Wi-Fi). Open a terminal in the course folder (`showshelf-course-final`), then:

  ```bash
  cd day-10-demo/showshelf-react
  npm install
  cd ../showshelf-api
  npm install
  ```

  Then do a dry run of both `npm run dev` commands below, and stop them with **Ctrl + C**.
- Open both folders in your editor (VS Code). For the server demo, install the **REST Client** extension (the project's `requests.http` is written for it), or use `curl` in a terminal.
- Two terminal windows with a large font, both opened in the course folder (`showshelf-course-final`). Start the servers live, in class.
- The React project asks the real TVmaze, so it needs internet. Without it, show the code and skip the browser: the Lab works offline.
- `showshelf-api/mylist.json` starts as `[]`. The demo adds Breaking Bad to it; set it back to `[]` after class.
- Press **Start again** after every Lab demo, so your demo code doesn't flow into the next step.

**Mindset for today:** a taste, not a course. Nobody has to remember the commands. The aim is that next time they see React or Express, they think "I've seen this: a component, a prop, a route".

---

## 0:00 · Recap (10 min)

- **Opening recap** in `quiz.md`: five questions about Day 9.
- **Say:** "Your ShowShelf is finished. Today we look at how professionals build the same thing: a library called React for the page, and a server written with Express for the data. This morning you watch them run on my laptop. This afternoon you try small versions of both in the Lab."

## 0:10 · A real React project (12 min)

Terminal 1:

```bash
cd day-10-demo/showshelf-react
npm run dev
```

Vite prints `Local: http://localhost:5173/`. Open that address: ShowShelf, built with React. Search, open a show, add one to My List.

**Say:** three new words, one sentence each.
- "**Node.js** runs JavaScript on your computer, outside the browser. Every tool here needs it."
- "**npm** downloads code other people wrote, called **packages**. Before class I typed `npm install`: it read `package.json` and put React and Vite in the `node_modules` folder."
- "**Vite** runs the project while you work on it. `npm run dev` starts it, and `localhost` means 'this computer'."

Tour in the editor, three files only:
1. `index.html`: almost empty, `<div id="root"></div>`. "React fills this one box."
2. `src/main.jsx`: `createRoot(document.getElementById("root")).render(...)` with `<App />` inside. "Draw `App` inside `#root`."
3. `src/components/ShowCard.jsx`: "A **component**: a function that returns what one card looks like. It looks like HTML; it's called **JSX**."

**Live change:** in `src/pages/HomePage.jsx`, change "What are we watching tonight?" to "What shall we watch, class?" and save. The browser updates at once, without a reload. Change it back.

**Connect to the Lab** (slide table): React is installed with npm here, already loaded in the Lab. Here the code is split into many files with `import` lines; in the Lab your code box is one file called **App.jsx**, with no `import` lines. Here you write `useState`; in the Lab, `React.useState`. Here you open `localhost:5173`; in the Lab you watch the preview. Leave the server running.

## 0:22 · Components, JSX and props (14 min)

Lab step 1, *Your first React component* (Teacher view off). Type in the code box:

```jsx
function Hello() {
  return <p className="meta">Hello, class! A week has {7 * 24} hours.</p>;
}

ReactDOM.createRoot(document.getElementById("root")).render(<Hello />);
```

**Say:**
- "A component is a function. Its name starts with a **capital letter**, and you use it like a tag: `<Hello />`."
- "It returns JSX: no quotes around it. Curly brackets `{ }` mean 'this part is JavaScript, show the result': 168."
- "`className`, not `class`: `class` is a reserved word in JavaScript."

**Mistake on purpose:** rename it to `hello` and `<hello />`. Nothing appears, and the Console says the tag is unrecognised: "start its name with an uppercase letter". Fix it.

**Props.** Add a second component above `Hello`, and use it inside:

```jsx
function Badge({ text }) {
  return <span className="badge">{text}</span>;
}

function Hello() {
  return (
    <p>
      <Badge text="Drama" /> <Badge text="Comedy" />
    </p>
  );
}
```

**Say:** "**Props** are a component's inputs, like a function's parameters. You pass them like HTML attributes: text in quotes, any other value in curly brackets, like `show={shows[0]}`. One component, many results." **Ask:** "What would `<Badge text={2 + 2} />` show?" (4.)

Switch to the editor: `ShowCard.jsx` starts with `function ShowCard({ show, isInList = false, onToggleList })`. "Same idea, three props." Press **Start again** in the Lab.

## 0:36 · Lists and state (12 min)

**A component for every item.** In the same code box:

```jsx
function Badge({ text }) {
  return <span className="badge">{text}</span>;
}

const genres = ["Drama", "Comedy", "Fantasy"];

function Hello() {
  return <p>{genres.map((genre) => <Badge key={genre} text={genre} />)}</p>;
}

ReactDOM.createRoot(document.getElementById("root")).render(<Hello />);
```

**Mistake on purpose:** delete `key={genre}`. The Console warns: "Each child in a list should have a unique key prop." **Say:** "`map` turns data into components. The **key** is a name tag React uses to tell the items apart. It must be different for each item: an id is best." Put it back.

**State.** Press **Start again**, then type:

```jsx
function EpisodeCounter() {
  const [watched, setWatched] = React.useState(0);
  return (
    <button onClick={() => setWatched(watched + 1)}>
      Episodes watched: {watched}
    </button>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<EpisodeCounter />);
```

Click the button a few times. **Say:** "**State** is a component's memory. `useState(0)` starts at 0 and gives back two things: the value and a function that changes it. Call `setWatched`, and React draws the component again. On Day 9, `createListButton` had to set the text by hand; here you never touch the elements."

**Mistake on purpose:** `onClick={setWatched(watched + 1)}` without `() =>`. The Console: "Too many re-renders". "Without the arrow, it runs *while drawing*, which draws again, which runs it again." Fix it.

Back in the editor, point at `SearchBar.jsx`: `value={value}` and `onChange`. "A search box whose text lives in state: you build a small one in step 6." Press **Start again** in the Lab.

## 0:48 · A real server (14 min)

**Say:** "Until now, all your code ran in the **browser**, on the visitor's computer. A **server** is a program on another computer that waits for **requests** and sends back **responses**. TVmaze is one. Here's a small one we wrote for the full course: it keeps a My List."

Terminal 2:

```bash
cd day-10-demo/showshelf-api
npm run dev
```

The terminal says `ShowShelf API running on http://localhost:3000`. In the browser:
- `http://localhost:3000` gives `{"message":"ShowShelf API"}`
- `http://localhost:3000/api/mylist` gives `[]`, an empty list

Open `server.js` and find `app.get("/api/mylist", ...)`. **Say:** "A **route**: a method (GET), an address, and a function that answers. `req` is the request that arrived, `res` is how you answer, `res.json(...)` sends data back."

**Add a show.** Open `requests.http` and press **Send Request** above *Add a show -> 201*. (Without REST Client, on macOS or Linux, paste this into a third terminal:)

```bash
curl -X POST http://localhost:3000/api/mylist -H "Content-Type: application/json" -d '{"id":169,"name":"Breaking Bad"}'
```

The answer is `201` with the new item. Reload `/api/mylist`: Breaking Bad is there. Point at the log line in Terminal 2: `POST /api/mylist -> 201 (... ms)`. Then send *Missing name -> 400*: refused, with an error message. Open `mylist.json`: the show is saved in a file. Stop the server with **Ctrl + C**, start it again: the show is still there.

**Say:** "These two projects don't talk to each other yet. In the full course, the next day connects them: the React page asks this server for My List. Today you only need to see both parts."

**Connect to the Lab** (slide table): here Node.js runs `server.js` in a terminal; in the Lab a pretend Express runs inside the preview. Here My List lives in `mylist.json`; in the Lab it lives in a variable, `let myList`, and starts fresh every time the preview runs. Here you test with `requests.http`; in the Lab with the page's form and the **Try a request** box. The log line looks the same in the Lab's Console: `POST /api/mylist → 201`. Stop both servers now (**Ctrl + C** in each terminal).

## 1:02 · Routes, methods and status codes (13 min)

Lab step 7, *Your first server route* (Teacher view off). The preview is a fixed page, **mylist.html**; the code box is **server.js**. Under `// Your routes go here`, type:

```js
app.get("/api/greeting", (req, res) => {
  res.json({ text: "Good morning, class!" });
});
```

In the preview, scroll to **Try a request**: GET, `/api/greeting`, **Send**. The answer appears, and the Console logs `GET /api/greeting → 200`.

- **Mistake on purpose:** send `/api/greetings` with an extra s: `404`, `Cannot GET /api/greetings`. "The address must match exactly."
- **Break it on purpose:** add `throw new Error("Oops");` as the first line inside the route and send again: `500`, and the error in red. "5 means the server has a problem." Remove it.

Show the methods and status codes slide. **Say:**
- "The **method** says what you want: GET 'give me', POST 'here's something new, save it', DELETE 'remove it'. A POST carries a **body**, which arrives as `req.body`."
- "To say *which* show, the address carries the id: `/api/mylist/2`. In the route you write `:id`, and `req.params.id` gives `"2"`, as **text**: turn it into a number with `Number(...)`."
- "The first digit of a status code tells you who has a problem: 2 all fine, 4 the request was wrong, 5 the server broke."

Show the statement slide: never trust what arrives. **Say:** "Anyone can send anything to a server, not only your page. So a server checks first, and says no with `400`." Press **Start again**.

## 1:15 · This afternoon (15 min)

1. Open the Day 10 overview (`#/day/10`). Read the step list together: **Part 1, React** (steps 1 to 6) and **Part 2, a server** (steps 7 to 12), grouped as on the slide. Aim to start step 7 around the middle of the afternoon.
2. **Do step 1 together** on the projector, with Teacher view off: the class dictates `function App()` with `<h1>ShowShelf</h1>` and the `createRoot` line. Press **Check**.
3. Show where help is: **Hint** under the code box, **Answer** next to it, and the **Console** bar under the preview. **Say:** "Today the Console matters most. An empty React preview almost always has a red line there, with a line number."
4. **Progress saves automatically** in this browser. Changing computers: **Help › Save progress to a file**, then **Help › Open a progress file**.
5. **Finished early?** The extra challenges after step 12: *Shows from TVmaze with useEffect*, *Ask for one show*, *Change a status with PATCH*.
6. **Milestone:** the My List manager page works with your server: add a show, refuse an empty name, remove a show, and read the log lines in the Console.
7. **For tomorrow:** "Tomorrow your site goes online. You'll need an email address you can open in class, to make a free account."

---

## Handover note for the afternoon teacher

- **Today is a taste.** Students don't need to remember React or Express, only recognise the ideas. If someone is stuck for more than 10 minutes on one step, the Answer button is fine today.
- **Empty React preview:** look at the Console first. JSX mistakes come with a line number. `import` lines don't work in the Lab and aren't needed: `React` and `ReactDOM` are already loaded.
- **Step 3, *A ShowCard component with props* (20 min):** `show="shows[0]"` in quotes passes text, not the object; `<h3>show.name</h3>` without curly brackets shows the words; `{name}` instead of `{show.name}`.
- **Step 5, *Remember something with state* (20 min):** `onClick={setInList(!inList)}` without `() =>` gives "Too many re-renders"; the `useState` line in `App` instead of `ShowCard` makes all cards switch together; `onclick` with a small c is ignored.
- **Steps 4 and 6:** `map` with `{ }` but no `return` draws no cards; still mapping `shows` instead of the filtered list, so the search changes nothing; `onChange={setSearch}` saves the whole event instead of `e.target.value`.
- **Step 11, *Remove a show with DELETE* (20 min):** without `Number(req.params.id)`, every show is "not found"; `myList.filter(...)` without `myList =` in front changes nothing; `const myList` crashes with "Assignment to constant variable".
- **The server's list resets** every time the preview runs again (when the student types). That's expected: it lives in memory, not in a file.
- **Steps 9 and 10:** `res.json(item).status(201)` answers 200 before the status is set; a validation `if` without `return` still adds the empty show.
