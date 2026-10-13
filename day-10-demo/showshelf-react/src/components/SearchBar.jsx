// A CONTROLLED input: React state is the single source of truth.
// Props: value (string), onChange (function called with the new text)
export default function SearchBar({ value, onChange }) {
  function handleSubmit(event) {
    event.preventDefault(); // searching already happens while typing
  }

  return (
    <form className="search" onSubmit={handleSubmit}>
      <input
        type="search"
        placeholder="Search shows, e.g. girls"
        aria-label="Search shows"
        value={value}
        onChange={(event) => onChange(event.target.value)}
      />
      <button type="submit">Search</button>
    </form>
  );
}
