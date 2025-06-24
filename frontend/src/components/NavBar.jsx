import { Link } from "react-router";
import { ThemeProvider, useTheme } from "./ThemeContext";
import { IoMdClose } from "react-icons/io";
import "../styles/NavBar.css";
import { homePath, applicationsPath, companiesPath, dataPath } from "../links";

const NavBar = ({ navOpen, reference }) => {
  const { theme, toggleTheme } = useTheme();

  return (
    <aside id="nav-modal" className="modal" ref={reference}>
      <section id="modal-content">
        <div className="top-row">
          <h2>Appliq</h2>
          <span className="close">
            <IoMdClose className="close-icon" />
          </span>
        </div>
        <nav>
          <Link to={homePath}>Home</Link>
          <Link to={applicationsPath}>Applications</Link>
          <Link to={companiesPath}>Companies</Link>
          <Link to={dataPath}>Data</Link>
          <button id="toggle-mode" onClick={toggleTheme}>
            {theme === "light" ? "☀️ Light" : "🌖 Dark"}
          </button>
        </nav>
      </section>
    </aside>
  );
};

export default NavBar;
