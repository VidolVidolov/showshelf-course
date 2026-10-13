import ShowCard from "./ShowCard.jsx";

// Props: shows (array), isInList (function id -> boolean), onToggleList (function)
export default function ShowGrid({ shows, isInList, onToggleList }) {
  return (
    <div className="grid">
      {shows.map((show) => (
        <ShowCard
          key={show.id}
          show={show}
          isInList={isInList(show.id)}
          onToggleList={onToggleList}
        />
      ))}
    </div>
  );
}
