// A show poster. When a show has no image (null), we use our placeholder poster
// from the public folder. "??" means: use the right side when the left is null or undefined.
// Props: src (URL string or null), alt (text for screen readers)
export default function Poster({ src, alt }) {
  return <img className="poster" src={src ?? "/poster.svg"} alt={alt} />;
}
