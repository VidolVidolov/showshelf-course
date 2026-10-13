// Small helper functions from Day 3 (utils.js), now as ES modules.
// "export" makes a function available to other files: import { ratingLabel } from "../utils/format.js";

// 9.2 -> "Must watch", 7.5 -> "Worth a try", 6 -> "Skip it"
export const ratingLabel = (rating) => {
  if (rating >= 8.5) {
    return "Must watch";
  } else if (rating >= 7) {
    return "Worth a try";
  } else {
    return "Skip it";
  }
};

// 45 -> "45 min", 60 -> "1 h", 95 -> "1 h 35 min"
export function formatRuntime(total) {
  if (!total) return ""; // null or 0: we don't know the runtime

  const hours = Math.floor(total / 60);
  const minutes = total % 60;

  if (hours === 0) return `${minutes} min`;
  if (minutes === 0) return `${hours} h`;
  return `${hours} h ${minutes} min`;
}

// (2008, 2013) -> "2008–2013", (2019, 2019) -> "2019", (2019, null) -> "2019–now"
export function yearsLabel(premiered, ended) {
  if (!premiered) return ""; // some shows have no premiere date yet

  if (!ended) return `${premiered}–now`;
  if (premiered === ended) return `${premiered}`;
  return `${premiered}–${ended}`;
}
