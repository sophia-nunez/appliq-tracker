import { ThemeProvider, useTheme } from "./ThemeContext";
import { IoMenu } from "react-icons/io5";
import "../styles/NavBar.css";

const NavBar = ({ reference }) => {
  const { theme, toggleTheme } = useTheme();

  return (
    <aside id="nav-modal" className="modal" ref={reference}>
      <span className="close">
        <IoMenu />
      </span>
      <section id="modal-content">
        <nav>
          <p>Navigation Bar</p>
          <button id="toggle-mode" onClick={toggleTheme}>
            {theme === "light" ? "☀️ Light" : "🌖 Dark"}
          </button>
        </nav>
      </section>
    </aside>
  );
};

export default NavBar;
