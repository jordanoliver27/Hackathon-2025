import { Link, useLocation } from "react-router-dom";
import "./NavBar.css";

function NavBar() {
  const location = useLocation();

  return (
    <nav className="tab-bar">
      <Link
        to="/"
        className={`tab ${location.pathname === "/" ? "active" : ""}`}
      >
        RephraseIt
      </Link>
      <Link
        to="/breathing"
        className={`tab ${location.pathname === "/breathing" ? "active" : ""}`}
      >
        Breathing
      </Link>
      <Link
        to="/grounding"
        className={`tab ${location.pathname === "/grounding" ? "active" : ""}`}
      >
        Grounding
      </Link>
    </nav>
  );
}

export default NavBar;
