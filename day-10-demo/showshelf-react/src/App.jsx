import { useEffect, useState } from "react";
import { Route, Routes } from "react-router";
import Header from "./components/Header.jsx";
import HomePage from "./pages/HomePage.jsx";
import ShowPage from "./pages/ShowPage.jsx";
import MyListPage from "./pages/MyListPage.jsx";

// Read My List from localStorage (or start with an empty list)
function loadMyList() {
  try {
    return JSON.parse(localStorage.getItem("myList")) ?? [];
  } catch {
    return []; // the saved text was not valid JSON
  }
}

export default function App() {
  // My List lives here, in the closest common parent of every page that needs it
  // ("lifting state up"). Pages get it through props.
  const [myList, setMyList] = useState(loadMyList);

  // The search text lives here too, so it survives a visit to a show page
  const [term, setTerm] = useState("");

  // Stretch: save to localStorage every time My List changes
  useEffect(() => {
    localStorage.setItem("myList", JSON.stringify(myList));
  }, [myList]);

  function isInList(id) {
    return myList.some((item) => item.id === id);
  }

  function toggleList(show) {
    if (isInList(show.id)) {
      // Never change state directly: create a NEW array without this show
      setMyList(myList.filter((item) => item.id !== show.id));
    } else {
      // Save a small object: enough to draw a card without calling the API
      const item = {
        id: show.id,
        name: show.name,
        image: show.image,
        genres: show.genres,
        rating: show.rating,
      };
      setMyList([...myList, item]);
    }
  }

  const listProps = { isInList, onToggleList: toggleList };

  return (
    <>
      <Header listCount={myList.length} />

      <main className="container">
        <Routes>
          <Route path="/" element={<HomePage term={term} onTermChange={setTerm} {...listProps} />} />
          <Route path="/show/:id" element={<ShowPage {...listProps} />} />
          <Route path="/my-list" element={<MyListPage myList={myList} {...listProps} />} />
          <Route path="*" element={<p className="status">Page not found.</p>} />
        </Routes>
      </main>

      <footer className="site-footer">
        <p>
          ShowShelf · Web Dev in 11 Days ·{" "}
          <a href="https://www.tvmaze.com" target="_blank" rel="noreferrer">
            Data from TVmaze
          </a>
        </p>
      </footer>
    </>
  );
}
