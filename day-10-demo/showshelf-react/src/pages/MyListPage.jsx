import { Link } from "react-router";
import ShowGrid from "../components/ShowGrid.jsx";

// Homework: every show in My List. The ✓ button on a card removes it.
// Props: myList (array of small show objects), isInList, onToggleList
export default function MyListPage({ myList, isInList, onToggleList }) {
  return (
    <>
      <h1 className="page-title">My List</h1>
      {myList.length === 0 ? (
        <p className="status">
          Your list is empty. <Link to="/">Find a show</Link> and press ＋.
        </p>
      ) : (
        <ShowGrid shows={myList} isInList={isInList} onToggleList={onToggleList} />
      )}
    </>
  );
}
