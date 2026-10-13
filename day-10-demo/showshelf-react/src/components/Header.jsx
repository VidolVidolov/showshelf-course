import { Link, NavLink } from "react-router";

// NavLink adds class="active" to the link of the current page.
// Props: listCount (number of shows in My List)
export default function Header({ listCount }) {
  return (
    <header className="site-header">
      <div className="container header-inner">
        <Link to="/" className="logo">
          ShowShelf
        </Link>
        <nav className="nav">
          <NavLink to="/" end>
            Home
          </NavLink>
          <NavLink to="/my-list">
            My List (<span className="list-count">{listCount}</span>)
          </NavLink>
        </nav>
      </div>
    </header>
  );
}
