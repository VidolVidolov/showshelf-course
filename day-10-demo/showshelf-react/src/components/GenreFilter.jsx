// Props: genres (array of strings), selected (string or null), onSelect (function)
export default function GenreFilter({ genres, selected, onSelect }) {
  return (
    <div className="genres">
      {genres.map((name) => (
        <button
          key={name}
          className={name === selected ? "chip active" : "chip"}
          aria-pressed={name === selected}
          // Click the selected genre again to show every genre
          onClick={() => onSelect(name === selected ? null : name)}
        >
          {name}
        </button>
      ))}
    </div>
  );
}
